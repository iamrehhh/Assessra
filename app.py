import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables (for local testing)
load_dotenv()

app = Flask(__name__)
# Allow CORS for your Render URL and Localhost
CORS(app, resources={r"/*": {"origins": "*"}})

# 1. CONFIGURE API KEY
# (Render will provide this via Environment Variables, or you can paste it for local test)
api_key = os.getenv("GOOGLE_API_KEY") 
if api_key:
    genai.configure(api_key=api_key)

# 2. SMART MODEL SELECTOR (Prevents Crashing)
def get_model():
    try:
        # Try the newest model first
        return genai.GenerativeModel('gemini-2.0-flash')
    except:
        # Fallback to the stable model if 2.0 isn't available to your key
        return genai.GenerativeModel('gemini-1.5-flash')

model = get_model()

# --- ROUTE 1: MARKING SYSTEM ---
@app.route('/mark', methods=['POST'])
def mark():
    try:
        data = request.json
        marks = int(data.get('marks', 0))
        question = data.get('question', '')
        case_study = data.get('case_study', '')
        student_answer = data.get('answer', '')
        
        # Word limit constraints
        word_limit = "150-225 words" if marks == 8 else "250-350 words"
        
        system_prompt = f"""
        You are a Senior Cambridge A-Level Business (9609) Examiner. 
        Be extremely strict. Grade the answer based on these Assessment Objectives:
        - AO1 (Knowledge): Correct definitions.
        - AO2 (Application): Direct reference to the Case Study facts provided.
        - AO3 (Analysis): Clear cause-and-effect chains.
        - AO4 (Evaluation): Required for 12-mark questions. A justified conclusion is a must.

        STRICT CONSTRAINTS:
        - Target Word Count: {word_limit}. Penalize if significantly over or under.
        - Reference the provided Case Study for application marks.
        
        Question: {question}
        Marks: {marks}
        Case Study Context: {case_study}
        Student Answer: {student_answer}

        Return ONLY a JSON object:
        {{
            "score": int,
            "ao1": int, "ao2": int, "ao3": int, "ao4": int,
            "strengths": "string (use \\n\\n for paragraphs)",
            "weaknesses": "string (use \\n\\n for paragraphs)",
            "model_answer": "Provide a high-scoring, concise A* model answer here. (use \\n\\n for paragraphs)"
        }}
        """
        
        # Force JSON response
        response = model.generate_content(
            system_prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        
        # Clean and Parse
        text = response.text.replace('```json', '').replace('```', '').strip()
        return jsonify(json.loads(text))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- ROUTE 2: AI TUTOR (Added to match your HTML) ---
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')

        tutor_prompt = f"""
        You are an Expert A-Level Business Tutor.
        Answer ONLY questions related to Business/Economics.
        Keep answers concise and structured with bullet points.
        
        Student Question: {user_message}
        """

        response = model.generate_content(tutor_prompt)
        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)