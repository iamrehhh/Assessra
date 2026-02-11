from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import requests

app = Flask(__name__)
# Allow CORS for your specific domain to be safe, or * for testing
CORS(app, resources={r"/*": {"origins": "*"}})

# ==========================================
# ⚠ IMPORTANT: PASTE YOUR API KEY BELOW
# ==========================================
genai.configure(api_key="AIzaSyAu3sXQ_bEOxC_zNSeN6vwzkOZqEJtmHtg") 
model = genai.GenerativeModel('models/gemini-2.5-flash')

# ==========================================
# ☁️ CLOUD DATABASE SETTINGS (JSONBIN.IO)
# ==========================================
BIN_ID = '698c12cdae596e708f21a63d'
MASTER_KEY = '$2a$10$3OsrhYa0hGsfBLm7ZcSeLOnnr6rTgZ09aD/l2vptk9w1r7ks/NDlq'

BIN_URL = f'https://api.jsonbin.io/v3/b/{BIN_ID}'
HEADERS = {
    'X-Master-Key': MASTER_KEY,
    'Content-Type': 'application/json'
}

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        # Fetch scores from the cloud
        req = requests.get(BIN_URL, headers=HEADERS)
        scores = req.json().get('record', {})
        
        # 🛡️ BULLETPROOF FIX: Filter out any garbage data
        valid_scores = {k: v for k, v in scores.items() if isinstance(v, dict) and 'score' in v}
        
        # Sort users by score (highest first)
        sorted_scores = sorted(valid_scores.items(), key=lambda x: x[1]['score'], reverse=True)
        return jsonify(sorted_scores), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.json
    user = data.get('username')
    score = data.get('total_score')
    papers = data.get('papers_completed')
    
    if not user: return jsonify({"error": "No user"}), 400
    
    try:
        # 1. Get current scores from the cloud
        req = requests.get(BIN_URL, headers=HEADERS)
        current_scores = req.json().get('record', {})
        
        # 2. Update or add the specific user's stats
        current_scores[user] = {"score": score, "papers": papers}
        
        # 3. Save it back to the cloud permanently
        requests.put(BIN_URL, json=current_scores, headers=HEADERS)
        
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete_user', methods=['GET'])
def delete_user():
    username = request.args.get('name')
    if not username:
        return "Please provide a name. Example: /delete_user?name=Username", 400

    try:
        req = requests.get(BIN_URL, headers=HEADERS)
        scores = req.json().get('record', {})
        
        if username in scores:
            del scores[username]
            requests.put(BIN_URL, json=scores, headers=HEADERS)
            return f"Deleted user: {username}", 200
        else:
            return f"User {username} not found.", 404
    except Exception as e:
        return f"Error: {str(e)}", 500

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
    
    try:
        response = model.generate_content(system_prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return text, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)