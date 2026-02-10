from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 1. PASTE YOUR API KEY HERE
genai.configure(api_key="AIzaSyCoiWYtl2E5DATpunC2__5uwenTQ7ML0JE")
model = genai.GenerativeModel('models/gemini-2.5-flash')

@app.route('/mark', methods=['POST'])
def mark():
    data = request.json
    marks = data['marks']
    
    # Setting word limit constraints based on marks
    word_limit = "150-225 words" if marks == 8 else "250-350 words"
    
    system_prompt = f"""
    You are a Senior Cambridge A-Level Business (9609) Examiner. 
    Be extremely strict. Grade the answer based on these Assessment Objectives:
    - AO1 (Knowledge): Correct definitions.
    - AO2 (Application): Direct reference to Iyipada (IPA) facts.
    - AO3 (Analysis): Clear cause-and-effect chains.
    - AO4 (Evaluation): Required for 12-mark questions. A justified conclusion is a must.

    STRICT CONSTRAINTS:
    - Target Word Count: {word_limit}. Penalize if significantly over or under.
    - Reference the provided Case Study for application marks.
    
    Question: {data['question']}
    Marks: {marks}
    Case Study: {data['case_study']}
    Student Answer: {data['answer']}

    Return ONLY a JSON object:
    {{
        "score": int,
        "ao1": int, "ao2": int, "ao3": int, "ao4": int,
        "strengths": "string",
        "weaknesses": "string",
        "model_answer": "Provide a high-scoring, concise A* model answer here."
    }}
    """
    
    response = model.generate_content(system_prompt)
    return response.text.replace('```json', '').replace('```', '').strip()

if __name__ == '__main__':
    app.run(port=5000)