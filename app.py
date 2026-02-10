from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json

app = Flask(__name__)
# Allow CORS for your specific domain to be safe, or * for testing
CORS(app, resources={r"/*": {"origins": "*"}})

# ==========================================
# ⚠ IMPORTANT: PASTE YOUR API KEY BELOW
# ==========================================
genai.configure(api_key="AIzaSyAu3sXQ_bEOxC_zNSeN6vwzkOZqEJtmHtg") 
model = genai.GenerativeModel('models/gemini-2.5-flash')

# File to store leaderboard data
SCORES_FILE = 'scores.json'

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        if os.path.exists(SCORES_FILE):
            with open(SCORES_FILE, 'r') as f:
                scores = json.load(f)
        else:
            scores = {}
        
        # Sort users by score (highest first)
        sorted_scores = sorted(scores.items(), key=lambda x: x[1]['score'], reverse=True)
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
    
    current_scores = {}
    if os.path.exists(SCORES_FILE):
        try:
            with open(SCORES_FILE, 'r') as f:
                current_scores = json.load(f)
        except: pass
        
    # Update or add user stats
    current_scores[user] = {"score": score, "papers": papers}
    
    with open(SCORES_FILE, 'w') as f:
        json.dump(current_scores, f)
        
    return jsonify({"status": "success"}), 200

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