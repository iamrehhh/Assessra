from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
import pypdf

app = Flask(__name__)
# Allow CORS for all domains
CORS(app, resources={r"/*": {"origins": "*"}})

# ==========================================
# ⚠ API KEYS CONFIGURATION
# ==========================================
# Primary API Key for Paper Checking (Strict Marking)
MARKING_API_KEY_PRIMARY = "AIzaSyC538XHLbFMn0wLEKPcizwM6F1PQyxVdqg" 

# Secondary API Key for Fallback (when primary runs out of tokens)
# TODO: PASTE YOUR SECOND API KEY HERE
MARKING_API_KEY_SECONDARY = "AIzaSyBD6Uu3G5EGs-kSOeUG0ZUpbLmyUNvNrtk"

# Tertiary API Key for Extra Fallback (when secondary runs out)
# TODO: PASTE YOUR THIRD API KEY HERE
MARKING_API_KEY_TERTIARY = "AIzaSyAZICuZj-jMdbY98Xm5uwso8NPJkTZah_4"

# API Key for Vocab/Idioms Sentence Generation
TUTOR_API_KEY = "AIzaSyCrWhTElkLQt2OrljhPGzaKBlpx0yrqN9U" 

# Model Configuration
MODEL_NAME = "gemini-2.5-flash"

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file.
    """
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

def generate_with_gemini(api_key, system_instruction, user_prompt):
    """
    Helper function to call Gemini API via REST to support multiple keys safely.
    Returns (result_text, error_code) where error_code indicates the type of failure.
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
        
        # Check for quota/token errors before raising
        if response.status_code == 429:
            print(f"API Rate Limit/Quota Exceeded (429)")
            return None, 429
        elif response.status_code == 403:
            print(f"API Quota Exceeded or Permission Denied (403)")
            return None, 403
        
        response.raise_for_status()
        result = response.json()
        
        # Extract text from response
        if 'candidates' in result and result['candidates']:
            content = result['candidates'][0]['content']['parts'][0]['text']
            return content, None
        else:
            return None, None
            
    except Exception as e:
        print(f"API Error: {e}")
        try:
            if 'response' in locals() and response.text:
                print(f"Response: {response.text}")
                # Check for quota errors in response text
                if 'quota' in response.text.lower() or 'limit' in response.text.lower():
                    return None, 429
        except:
            pass
        return None, None

def generate_with_fallback(system_instruction, user_prompt):
    """
    Tries primary API key first, falls back to secondary, then tertiary if needed.
    """
    # 1. Try Primary API
    result, error_code = generate_with_gemini(MARKING_API_KEY_PRIMARY, system_instruction, user_prompt)
    
    if result:
        return result

    # 2. Try Secondary API if Primary failed due to quota
    if error_code in [429, 403]:
        print("Primary API quota exhausted, switching to SECONDARY API...")
        result, error_code = generate_with_gemini(MARKING_API_KEY_SECONDARY, system_instruction, user_prompt)
        
        if result:
            print("Secondary API succeeded!")
            return result
    
    # 3. Try Tertiary API if Secondary also failed due to quota
    if error_code in [429, 403]:
        print("Secondary API quota exhausted, switching to TERTIARY API...")
        result, error_code = generate_with_gemini(MARKING_API_KEY_TERTIARY, system_instruction, user_prompt)
        
        if result:
            print("Tertiary API succeeded!")
            return result
        else:
            print("Tertiary API also failed (or other error).")
    
    return None

# ==========================================
# STATIC FILE SERVING (Frontend)
# ==========================================
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/mark', methods=['POST'])
def mark():
    data = request.json
    marks = int(data.get('marks', 12))
    question_text = data.get('question', '')
    # 'case_study' might now be a path if provided by frontend, or text. 
    # Logic.js sends "Refer to attached PDF..." string usually.
    # We will look for a new field 'pdf_path' to be explicit.
    pdf_path = data.get('pdf_path', '')
    case_study_text = ""
    
    if pdf_path and os.path.exists(pdf_path):
        print(f"Extracting text from: {pdf_path}")
        case_study_text = extract_text_from_pdf(pdf_path)
    else:
        # Fallback to whatever string was sent (legacy support)
        case_study_text = data.get('case_study', '')

    student_answer = data.get('answer', '')

    # DETECT BUSINESS PAPER 3 for STRICT MARKING
    is_business_p3 = False
    if pdf_path and ("9609" in pdf_path and ("_3" in pdf_path or "31" in pdf_path or "32" in pdf_path or "33" in pdf_path)):
        is_business_p3 = True
        print("⚠ STRICT MODE ACTIVE: Business Paper 3 Detected")

    # STRICT RUBRIC LOGIC
    if is_business_p3:
        # USER-DEFINED STRICT PROTOCOL FOR BUSINESS P3
        system_prompt = """
        System Persona: You are an unforgiving, hyper-strict Cambridge International A-Level Business (9609) Paper 3 Examiner. 
        Your purpose is to prepare the candidate for the worst-case grading scenario. You do not give the benefit of the doubt. 
        You look for precision, deep context integration, and unbroken chains of logic.
        """

        rubric = f"""
        Zero-Leeway Rules:
        1. No Credit for Confusion: If a sentence contradicts itself or shows fundamental misunderstanding, award zero marks for that point.
        2. No Buzzword Points: Do not award AO1 (Knowledge) marks if the candidate simply name-drops a key term without clear evidence they understand what it means in a business context.
        3. No Parroting: Do not award AO2 (Application) marks if the candidate just copies data or text from the case study. They must explicitly connect the data to their argument.

        Strict Grading Protocol:
        AO1: Knowledge and Understanding (Max 2 Marks)
        - Award 0 marks for vague definitions.
        - Award 1 mark for one precisely accurate point or definition.
        - Award 2 marks ONLY if two distinct, accurate points are made, or a flawless definition and a distinct point are provided.

        AO2: Application (Max 2 Marks)
        - Award 0 marks for generic statements or directly quoting the text without using it.
        - Award 1 mark if case data is actively used to support an argument once.
        - Award 2 marks ONLY if case data is actively used to support an argument twice in distinctly different ways.

        AO3: Analysis (Max 4 Marks for 8-markers / Max 2 Marks for 12-markers)
        - Rule: Analysis requires unbroken chains of reasoning (Cause -> Impact -> Consequence).
        - Award 0 marks for stating a fact without a consequence.
        - Award L1 (1-2 marks for 8-markers; 1 mark for 12-markers) if there is only a single step of logic (e.g., "This reduces costs so profits rise").
        - Award L2 (3-4 marks for 8-markers; 2 marks for 12-markers) ONLY if the candidate provides a multi-step, fully developed chain of reasoning that leaves absolutely no gaps in logic.

        AO4: Evaluation (Max 6 Marks - 12-markers only)
        - The "Any Business" Test: Read the candidate's conclusion. If you remove the name of the business from their paragraph and the statement still makes sense for a generic company, you MUST cap Evaluation at L2 (Maximum 4 marks).
        - Award L1 (1-2 marks): A weak judgement is made with little to no supporting evidence.
        - Award L2 (3-4 marks): A developed, balanced judgement is made, weighing pros and cons, but it lacks deep integration with the specific facts of the case.
        - Award L3 (5-6 marks): ONLY award this if the judgement is heavily contextualized, explicitly weighing specific case study data.

        Current Question Max Marks: {marks}
        """
        
        word_guide = "Refer to Cambridge Conventions"

    elif marks == 8:
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

    if not is_business_p3:
        system_prompt = f"""
        You are a Strict Senior Cambridge A-Level Business Examiner. 
        Mark the following answer with NO MERCY.
        """

    # Updated user prompt with calculation-aware model answer instruction
    # Updated user prompt with calculation-aware model answer instruction
    model_answer_instruction = (
        f"<For calculation questions: Show complete step-by-step working including: "
        f"1) Formula/method stated, 2) Values substituted clearly, 3) Calculation steps shown, "
        f"4) Final answer with units if required. "
        f"For essay questions: Write a perfect A* model answer ({word_guide}) using paragraphs. "
        f"Ensure it references the case study explicitly. "
        f"CRITICAL: The model answer must be a standalone answer to the question. "
        f"DO NOT mention the student's answer or their performance in this section. "
        f"Focus ONLY on writing the ideal response a student should have written.>"
    ) if marks <= 4 else (
        f"<Write a perfect A* model answer ({word_guide}) using paragraphs. "
        f"Ensure it references the case study explicitly. "
        f"CRITICAL: The model answer must be a standalone answer to the question. "
        f"DO NOT mention the student's answer or their performance in this section. "
        f"Focus ONLY on writing the ideal response a student should have written.>"
    )

    user_prompt = f"""
    CASE STUDY CONTEXT:
    {case_study_text}

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
        "strengths": "<A single concise paragraph (max 50 words) stating the verdict and specific strong points (citing figures/facts).>",
        "weaknesses": "<A single concise paragraph (max 50 words) highlighting the exact errors, missing definitions, or logic gaps. Be blunt.>",
        "model_answer": "{model_answer_instruction}"
    }}
    """
    
    text = generate_with_fallback(system_prompt, user_prompt)
    
    if text:
        cleaned_text = text.replace('```json', '').replace('```', '').strip()
        return cleaned_text, 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({"error": "Failed to generate marking"}), 500



# ==========================================
import json
import os
from typing import Dict, Any

# ==========================================
# VOCAB PROGRESS CLOUD STORAGE
# ==========================================
VOCAB_DB_FILE = 'vocab_data.json'
IDIOMS_DB_FILE = 'idioms_data.json'

def load_db(filename) -> Dict[str, Any]:
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
# VOCAB SETS PROGRESS (Monthly Organization)
# ==========================================
VOCAB_SETS_DB_FILE = 'vocab_sets_data.json'

vocab_sets_db: Dict[str, Any] = load_db(VOCAB_SETS_DB_FILE)
if not isinstance(vocab_sets_db, dict):
    vocab_sets_db = {}

@app.route('/save_vocab_sets_progress', methods=['POST'])
def save_vocab_sets_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    progress = data.get('progress', {})
    
    vocab_sets_db[user_id] = progress
    save_db(VOCAB_SETS_DB_FILE, vocab_sets_db)
    return jsonify({"status": "success", "message": "Vocab sets progress saved"})

@app.route('/load_vocab_sets_progress', methods=['POST'])
def load_vocab_sets_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    
    progress = vocab_sets_db.get(user_id, None)
    return jsonify({"progress": progress})

# ==========================================
# IDIOMS SETS PROGRESS (Monthly Organization)
# ==========================================
IDIOMS_SETS_DB_FILE = 'idioms_sets_data.json'

idioms_sets_db: Dict[str, Any] = load_db(IDIOMS_SETS_DB_FILE)
if not isinstance(idioms_sets_db, dict):
    idioms_sets_db = {}

@app.route('/save_idioms_sets_progress', methods=['POST'])
def save_idioms_sets_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    progress = data.get('progress', {})
    
    idioms_sets_db[user_id] = progress
    save_db(IDIOMS_SETS_DB_FILE, idioms_sets_db)
    return jsonify({"status": "success", "message": "Idioms sets progress saved"})

@app.route('/load_idioms_sets_progress', methods=['POST'])
def load_idioms_sets_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    
    progress = idioms_sets_db.get(user_id, None)
    return jsonify({"progress": progress})


# ==========================================
# SENTENCE COLLECTION STORAGE
# ==========================================
SENTENCES_DB_FILE = 'sentences_data.json'

# Load sentences database
sentences_db: Dict[str, Any] = load_db(SENTENCES_DB_FILE)
if not isinstance(sentences_db, dict):
    sentences_db = {}

@app.route('/save_sentence', methods=['POST'])
def save_sentence():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    sentence_data = data.get('sentence_data', {})
    
    # Initialize user sentences if not exists
    if user_id not in sentences_db:
        sentences_db[user_id] = {'sentences': []}
    
    # Add timestamp
    from datetime import datetime
    sentence_data['timestamp'] = datetime.utcnow().isoformat() + 'Z'
    
    # Append sentence
    sentences_db[user_id]['sentences'].append(sentence_data)
    save_db(SENTENCES_DB_FILE, sentences_db)
    
    return jsonify({"status": "success", "message": "Sentence saved"})

@app.route('/get_sentences', methods=['POST'])
def get_sentences():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    
    if user_id not in sentences_db:
        return jsonify({"sentences": []})
    
    return jsonify({"sentences": sentences_db[user_id].get('sentences', [])})

@app.route('/delete_sentence', methods=['POST'])
def delete_sentence():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    timestamp = data.get('timestamp')
    
    if user_id in sentences_db and 'sentences' in sentences_db[user_id]:
        sentences_db[user_id]['sentences'] = [
            s for s in sentences_db[user_id]['sentences'] 
            if s.get('timestamp') != timestamp
        ]
        save_db(SENTENCES_DB_FILE, sentences_db)
        return jsonify({"status": "success", "message": "Sentence deleted"})
    
    return jsonify({"status": "error", "message": "Sentence not found"})


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
