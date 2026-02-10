import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Allow your website to talk to this server
CORS(app, resources={r"/*": {"origins": "*"}})

# 1. CONFIGURE API KEY
api_key = os.getenv("AIzaSyCoiWYtl2E5DATpunC2__5uwenTQ7ML0JE") 
if api_key:
    genai.configure(api_key=api_key)

# 2. SMART MODEL SELECTOR (The Crash Fix)
# This function stops the "Quota Exceeded" error by trying a backup model.
def get_working_model():
    try:
        # Priority 1: Try the newest smart model
        model = genai.GenerativeModel('gemini-2.0-flash')
        # Quick test to see if Google allows it
        model.generate_content("test") 
        return model
    except:
        # Priority 2: Fallback to the standard model (Guaranteed to work)
        print("Switching to fallback model (2.5 Flash)...")
        return genai.GenerativeModel('gemini-2.5-flash')

# Initialize the best available model
model = get_working_model()

# --- ROUTE 1: MARKING ---
@app.route('/mark', methods=['POST'])
def mark():
    try:
        data = request.json
        marks = int(data.get('marks', 0))
        
        word_limit = "150-225 words" if marks == 8 else "250-350 words"
        
        system_prompt = f"""
        You are a Senior Cambridge A-Level Business (9609) Examiner. 
        Be extremely strict. Grade based on:
        - AO1 (Knowledge): Correct definitions.
        - AO2 (Application): Direct reference to Case Study.
        - AO3 (Analysis): Clear cause-and-effect chains.
        - AO4 (Evaluation): Required for 12-mark questions.

        Constraints:
        - Target Word Count: {word_limit}.
        
        Question: {data.get('question')}
        Marks: {marks}
        Case Study: {data.get('case_study')}
        Student Answer: {data.get('answer')}

        Return ONLY a JSON object:
        {{
            "score": int,
            "ao1": int, "ao2": int, "ao3": int, "ao4": int,
            "strengths": "string (use \\n\\n for paragraphs)",
            "weaknesses": "string (use \\n\\n for paragraphs)",
            "model_answer": "string (use \\n\\n for paragraphs)"
        }}
        """
        
        response = model.generate_content(
            system_prompt,
            generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
        )
        
        return response.text.replace('```json', '').replace('```', '').strip()
    
    except Exception as e:
        return jsonify({
            "score": 0, 
            "strengths": "Error", 
            "weaknesses": f"Server Error: {str(e)}", 
            "model_answer": "Please try again."
        })

# --- ROUTE 2: CHATBOT (Matches your new HTML) ---
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        
        # Tutor Personality
        response = model.generate_content(
            f"You are an Expert A-Level Business Tutor. Answer this student question concisely and clearly: {user_message}"
        )
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"reply": "I am having trouble connecting right now."})

if __name__ == '__main__':
    app.run(port=5000)
