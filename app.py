from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
# Allow CORS for all domains
CORS(app, resources={r"/*": {"origins": "*"}})

# ==========================================
# ⚠ API KEYS CONFIGURATION
# ==========================================
# API Key for Paper Checking (Strict Marking)
MARKING_API_KEY = "AIzaSyCrWhTElkLQt2OrljhPGzaKBlpx0yrqN9U" 

# API Key for AI Tutor (Chat)
# TODO: Replace with your second API key if you have one, or keep same for now.
TUTOR_API_KEY = "AIzaSyAu3sXQ_bEOxC_zNSeN6vwzkOZqEJtmHtg" 

# Model Configuration
MODEL_NAME = "gemini-2.5-flash"

def generate_with_gemini(api_key, system_instruction, user_prompt):
    """
    Helper function to call Gemini API via REST to support multiple keys safely.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"
    
    payload = {
        "contents": [{
            "parts": [{"text": user_prompt}]
        }],
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        }
    }
    
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        result = response.json()
        
        # Extract text from response
        if 'candidates' in result and result['candidates']:
            content = result['candidates'][0]['content']['parts'][0]['text']
            return content
        else:
            return None
            
    except Exception as e:
        print(f"API Error: {e}")
        if response.text:
            print(f"Response: {response.text}")
        return None

@app.route('/mark', methods=['POST'])
def mark():
    data = request.json
    marks = int(data.get('marks', 12))
    question_text = data.get('question', '')
    case_study = data.get('case_study', '')
    student_answer = data.get('answer', '')

    # STRICT RUBRIC LOGIC
    if marks == 8:
        rubric = """
        STRICT 8-MARK RUBRIC (Analysis):
        - AO1 (Knowledge): Max 2 marks. (Precise definitions required)
        - AO2 (Application): Max 2 marks. (MUST quote/reference Case Study facts)
        - AO3 (Analysis): Max 4 marks. (Detailed chains of reasoning: Cause -> Effect -> Impact)
        - AO4 (Evaluation): 0 marks. (Do NOT award marks for judgment).
        
        PENALTIES:
        - If Application (AO2) is missing, CAP Total Score at 4.
        - If answer is too short (<100 words), CAP Total Score at 3.
        """
        word_guide = "150-225 words"
    elif marks == 12:
        rubric = """
        STRICT 12-MARK RUBRIC (Evaluation):
        - AO1 (Knowledge): Max 2 marks.
        - AO2 (Application): Max 2 marks. (MUST quote/reference Case Study facts)
        - AO3 (Analysis): Max 2 marks. (CAP at 2 even if analysis is extensive).
        - AO4 (Evaluation): Max 6 marks. (Requires: Judgement, Weighting of arguments, Short/Long term view).

        PENALTIES:
        - If no final justified conclusion, CAP AO4 at 3 marks.
        - If Application (AO2) is missing, CAP Total Score at 6.
        """
        word_guide = "250-350 words"
    elif marks <= 4:
        # CALCULATION QUESTIONS (2-4 marks)
        if marks == 2:
            rubric = """
            STRICT 2-MARK CALCULATION RUBRIC:
            1. VERIFY mathematical accuracy step-by-step.
            2. Mark allocation:
               - 1 mark for correct METHOD/WORKING shown (formula, substitution, or clear process)
               - 1 mark for correct FINAL ANSWER (with appropriate units/formatting if required)
            3. Award method mark even if final answer is incorrect (if working is shown).
            4. Deductions:
               - Missing or incorrect units: -1 mark
               - Arithmetic errors: depends on working shown
               - No working shown: Maximum 1 mark (only if answer is miraculously correct)
            5. Set AO1=1, AO2=0, AO3=1, AO4=0 for breakdown (method=AO1, answer=AO3).
            """
        elif marks == 4:
            rubric = """
            STRICT 4-MARK CALCULATION RUBRIC:
            1. VERIFY mathematical accuracy step-by-step.
            2. Mark allocation:
               - 2 marks for correct METHOD/WORKING shown (formula stated, correct substitution, clear process)
               - 2 marks for correct FINAL ANSWER (with appropriate units/formatting)
            3. Award method marks even if final answer is incorrect (if working is shown).
            4. Partial credit breakdown:
               - Full working, wrong answer: 2/4
               - Partial working, wrong answer: 1/4
               - No working, correct answer: 2/4 maximum
            5. Deductions:
               - Missing or incorrect units: -1 mark
               - Minor arithmetic errors with correct method: -1 mark
               - Major conceptual errors: -2 marks
            6. Set AO1=2, AO2=0, AO3=2, AO4=0 for breakdown (method=AO1, answer=AO3).
            """
        else:
            # 1 mark or 3 mark questions (rare)
            rubric = f"""
            STRICT {marks}-MARK CALCULATION RUBRIC:
            1. VERIFY mathematical accuracy.
            2. Award marks for correct method and correct answer proportionally.
            3. For {marks} marks, split between method and answer.
            4. Deduct for missing units, arithmetic errors, or lack of working.
            """
        word_guide = "Brief calculation with complete working shown"
    else:
        rubric = f"Mark strictly according to standard Cambridge conventions for {marks} marks."
        word_guide = "Appropriate length"

    system_prompt = f"""
    You are a Strict Senior Cambridge A-Level Business Examiner. 
    Mark the following answer with NO MERCY.
    """

    # Updated user prompt with calculation-aware model answer instruction
    model_answer_instruction = (
        f"<For calculation questions: Show complete step-by-step working including: "
        f"1) Formula/method stated, 2) Values substituted clearly, 3) Calculation steps shown, "
        f"4) Final answer with units if required. "
        f"For essay questions: Write a perfect A* model answer ({word_guide}) using paragraphs. "
        f"Ensure it references the case study explicitly.>"
    ) if marks <= 4 else f"<Write a perfect A* model answer ({word_guide}) using paragraphs. Ensure it references the case study explicitly.>"

    user_prompt = f"""
    CASE STUDY CONTEXT:
    {case_study}

    QUESTION:
    {question_text}

    STUDENT ANSWER:
    {student_answer}

    MARKING INSTRUCTIONS:
    1. Follow this rubric RIGIDLY:
    {rubric}
    
    2. BE CRITICAL. Do not give "benefit of the doubt". 
    3. If the student uses generic points not linked to the case, mark them down.

    OUTPUT FORMAT (JSON ONLY):
    {{
        "score": <total_score_int>,
        "ao1": <score_int>, "ao2": <score_int>, "ao3": <score_int>, "ao4": <score_int>,
        "strengths": "<Concise bullet points on what was done well>",
        "weaknesses": "<Concise bullet points on exact errors/omissions>",
        "model_answer": "{model_answer_instruction}"
    }}
    """
    
    text = generate_with_gemini(MARKING_API_KEY, system_prompt, user_prompt)
    
    if text:
        cleaned_text = text.replace('```json', '').replace('```', '').strip()
        return cleaned_text, 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({"error": "Failed to generate marking"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get('message', '')
    
    if not user_msg:
        return jsonify({"reply": "Please say something!"})

    system_prompt = """
    You are an expert Cambridge A-Level Business and Economics Tutor.
    
    GUIDELINES:
    1. **Explain Well:** Provide clear, detailed, and accurate explanations. Use examples where helpful.
    2. **Structure:** Use paragraphs with **double line breaks** to separate them. Use **bold text** for key terms.
    3. **Tone:** Be friendly, encouraging, and professional.
    4. **Formatting:** Use Markdown for formatting (e.g., **bold** for key terms, - lists for points).
    5. **Depth:** Do not be overly concise if the topic requires depth. Aim for clarity and completeness.
    """

    user_prompt = f"""
    The student asks: "{user_msg}"
    """
    
    text = generate_with_gemini(TUTOR_API_KEY, system_prompt, user_prompt)
    
    if text:
        cleaned_text = text.replace('```', '').strip()
        return jsonify({"reply": cleaned_text})
    else:
        return jsonify({"reply": "Sorry, I'm having trouble thinking right now. Try again later!"})

# ==========================================
import json
import os
from typing import Dict, Any

# ==========================================
# VOCAB PROGRESS CLOUD STORAGE
# ==========================================
VOCAB_DB_FILE = 'vocab_data.json'
IDIOMS_DB_FILE = 'idioms_data.json'

def load_db(filename):
    if os.path.exists(filename):
        try:
            with open(filename, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_db(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f)

# Load data on startup
vocab_progress_db: Dict[str, Any] = load_db(VOCAB_DB_FILE)
if not isinstance(vocab_progress_db, dict):
    vocab_progress_db = {}

idioms_progress_db: Dict[str, Any] = load_db(IDIOMS_DB_FILE)
if not isinstance(idioms_progress_db, dict):
    idioms_progress_db = {}

@app.route('/save_vocab_progress', methods=['POST'])
def save_vocab_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    progress = data.get('progress', {})
    
    vocab_progress_db[user_id] = progress
    save_db(VOCAB_DB_FILE, vocab_progress_db)
    return jsonify({"status": "success", "message": "Progress saved"})

@app.route('/load_vocab_progress', methods=['POST'])
def load_vocab_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    
    progress = vocab_progress_db.get(user_id, None)
    return jsonify({"progress": progress})

# ==========================================
# IDIOMS PROGRESS CLOUD STORAGE
# ==========================================

@app.route('/save_idioms_progress', methods=['POST'])
def save_idioms_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    progress = data.get('progress', {})
    
    idioms_progress_db[user_id] = progress
    save_db(IDIOMS_DB_FILE, idioms_progress_db)
    return jsonify({"status": "success", "message": "idioms progress saved"})

@app.route('/load_idioms_progress', methods=['POST'])
def load_idioms_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    
    progress = idioms_progress_db.get(user_id, None)
    return jsonify({"progress": progress})

# ==========================================
# VOCAB NOTES SYSTEM
# ==========================================
# Notes storage with default sections
notes_db = {}

def get_default_notes():
    return {
        'Wrong Vocab': [],
        'Correct Vocab': []
    }

@app.route('/save_note', methods=['POST'])
def save_note():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    note_section = data.get('section', 'Wrong Vocab')  # Default to Wrong Vocab
    word_data = data.get('word_data', {})
    
    # Initialize user notes if not exists
    if user_id not in notes_db:
        notes_db[user_id] = get_default_notes()
    
    # Create section if doesn't exist
    if note_section not in notes_db[user_id]:
        notes_db[user_id][note_section] = []
    
    # Check if word already exists in this section
    existing = next((item for item in notes_db[user_id][note_section] if item['word'] == word_data.get('word')), None)
    if not existing:
        notes_db[user_id][note_section].append(word_data)
    
    return jsonify({"status": "success", "message": f"Saved to {note_section}"})

@app.route('/get_notes', methods=['POST'])
def get_notes():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    
    # Initialize if not exists
    if user_id not in notes_db:
        notes_db[user_id] = get_default_notes()
    
    return jsonify({"notes": notes_db[user_id]})

@app.route('/update_notes', methods=['POST'])
def update_notes():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    notes = data.get('notes', {})
    
    # Ensure default sections exist
    if 'Wrong Vocab' not in notes:
        notes['Wrong Vocab'] = []
    if 'Correct Vocab' not in notes:
        notes['Correct Vocab'] = []
    
    notes_db[user_id] = notes
    return jsonify({"status": "success", "message": "Notes updated"})

@app.route('/delete_note_item', methods=['POST'])
def delete_note_item():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    section = data.get('section')
    word = data.get('word')
    
    if user_id in notes_db and section in notes_db[user_id]:
        notes_db[user_id][section] = [item for item in notes_db[user_id][section] if item['word'] != word]
    
    return jsonify({"status": "success", "message": "Note deleted"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
