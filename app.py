from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 1. PASTE YOUR API KEY HERE
genai.configure(api_key="AIzaSyCoiWYtl2E5DATpunC2__5uwenTQ7ML0JE")
model = genai.GenerativeModel('models/gemini-2.5-flash')

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# 1. CONFIGURE GEMINI (Use the best FREE model: 2.0 Flash)
# Make sure your API key is in a .env file or set directly here
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash') 

@app.route('/mark', methods=['POST'])
def mark():
    try:
        data = request.json
        marks = int(data.get('marks', 0))
        question = data.get('question', 'Unknown Question')
        case_study = data.get('case_study', 'No Case Study Provided')
        student_answer = data.get('answer', '')

        # 2. WORD LIMIT LOGIC (Kept from your original code)
        word_limit = "150-225 words" if marks == 8 else "250-350 words"

        # 3. UPGRADED "SENIOR EXAMINER" SYSTEM PROMPT
        # This prompt forces deep analysis, strict marking, and proper paragraph breaks.
        system_prompt = f"""
        You are a SENIOR CAMBRIDGE A-LEVEL BUSINESS (9609) EXAMINER.
        Your task is to mark the student's answer STRICTLY against the marking scheme.

        ### QUESTION DETAILS:
        - **Question:** {question}
        - **Max Marks:** {marks}
        - **Target Word Count:** {word_limit} (Penalize if significantly under/over).
        - **Case Study Context:** {case_study}

        ### ASSESSMENT OBJECTIVES (AOs):
        - **AO1 (Knowledge):** Accurate definitions & theories.
        - **AO2 (Application):** CRITICAL. The answer MUST explicitly reference the Case Study (names, data, scenario). If the answer is generic (could apply to any business), CAP AO2 MARKS AT 0.
        - **AO3 (Analysis):** Chains of reasoning (Cause -> Effect -> Impact).
        - **AO4 (Evaluation):** (Only for 12/20 marks) Final judgement, weighing pros/cons, short/long term perspective.

        ### FEEDBACK RULES:
        1. **Be Constructive:** Do not just say "good". Explain *why* marks were awarded or lost.
        2. **Paragraph Breaks:** Use \\n\\n in your JSON strings to create paragraphs in the feedback.
        3. **Model Answer:** Provide a perfect, A* grade answer that uses the Case Study context perfectly.

        ### REQUIRED OUTPUT FORMAT (JSON ONLY):
        {{
            "score": (integer),
            "ao1": (integer),
            "ao2": (integer),
            "ao3": (integer),
            "ao4": (integer),
            "strengths": "Detailed paragraph identifying what the student did well.",
            "weaknesses": "Detailed paragraph explaining where marks were lost, referencing missing context or broken analysis chains.",
            "model_answer": "A perfect model answer."
        }}
        """

        # 4. GENERATE CONTENT WITH JSON ENFORCEMENT
        # This ensures Gemini returns PURE JSON, no markdown formatting to clean up.
        response = model.generate_content(
            f"STUDENT ANSWER:\n{student_answer}\n\nSYSTEM INSTRUCTIONS:\n{system_prompt}",
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.3  # Lower temperature = stricter, more consistent marking
            )
        )

        # 5. SAFE RETURN
        # Directly parse the JSON from Gemini
        return jsonify(json.loads(response.text))

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to mark answer", "details": str(e)}), 500
        # --- ADD THIS NEW ROUTE FOR THE CHATBOT ---

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')

        # TUTOR PERSONALITY
        tutor_prompt = f"""
        You are an Expert A-Level Business & Economics Tutor for Cambridge (9609/9708).
        
        YOUR RULES:
        1. Answer ONLY questions related to Business Studies, Economics, Finance, or Management.
        2. If a user asks about anything else (e.g., movies, coding, weather), politely refuse: "I can only help with Business and Economics studies."
        3. Keep answers concise, structured (bullet points), and easy to revise from.
        4. Use bolding (**text**) for key terms.
        
        Student Question: {user_message}
        """

        response = model.generate_content(tutor_prompt)
        
        # Return plain text (Markdown is fine, we will render it)
        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
