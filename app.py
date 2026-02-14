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
MARKING_API_KEY = "AIzaSyAu3sXQ_bEOxC_zNSeN6vwzkOZqEJtmHtg" 

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
    else:
        rubric = f"Mark strictly according to standard Cambridge conventions for {marks} marks."
        word_guide = "Appropriate length"

    system_prompt = f"""
    You are a Strict Senior Cambridge A-Level Business Examiner. 
    Mark the following answer with NO MERCY.
    """

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
        "model_answer": "<Write a perfect A* model answer ({word_guide}) using paragraphs. Ensure it references the case study explicitly.>"
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
    Respond concisely (under 100 words if possible) and accurately. 
    Use a friendly, encouraging tone. 
    If they ask about a specific syllabus topic, explain it simply.
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)