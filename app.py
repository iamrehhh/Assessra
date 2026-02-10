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
    You are a Senior Cambridge A-Level Business (9609) Examiner with 15+ years of experience. 
    
    YOUR MANDATE: Be EXTREMELY strict and uncompromising. Follow the Cambridge marking scheme to the letter. Do NOT give leeways or benefit of doubt.
    
    ASSESSMENT OBJECTIVES - STRICT CRITERIA:
    
    AO1 (Knowledge & Understanding):
    - Award marks ONLY for precise, accurate definitions using exact business terminology
    - Generic explanations get ZERO marks
    - Must use correct Cambridge-approved definitions from the syllabus
    
    AO2 (Application):
    - Award marks ONLY if student makes DIRECT, SPECIFIC reference to Iyipada (IPA) from the case study
    - Generic business examples get ZERO marks for application
    - Student must quote/reference specific facts, figures, or context from the insert
    - Vague references like "the company" or "the business" without specific IPA details = NO APPLICATION MARKS
    
    AO3 (Analysis):
    - Award marks ONLY for clear, logical cause-and-effect chains
    - Must show "because of X, this leads to Y, which results in Z"
    - Single-step reasoning gets minimal marks
    - Must develop chains of reasoning with clear links
    - Weak connectives (e.g., "and", "also") instead of analytical ones (e.g., "therefore", "consequently", "as a result") = lower marks
    
    AO4 (Evaluation) - For 12-mark questions ONLY:
    - Award marks ONLY for well-justified conclusions with clear judgement
    - Must include: weighing different arguments, consideration of context, short-term vs long-term implications
    - Sitting on the fence or weak conclusions get minimal marks
    - Must make a clear, supported recommendation
    - Generic evaluation statements get ZERO marks
    
    STRICT WORD COUNT ENFORCEMENT:
    - Target: {word_limit}
    - Significantly under the minimum: Deduct up to 2 marks (indicates insufficient development)
    - Significantly over the maximum: Deduct up to 2 marks (indicates poor exam technique and time management)
    - Count the words in the student's answer and strictly enforce this
    
    MARKING SCHEME ALLOCATION:
    {f'''
    For 8-mark questions (Analysis):
    - AO1: Maximum 2 marks
    - AO2: Maximum 2 marks  
    - AO3: Maximum 4 marks
    - AO4: 0 marks (not required)
    
    Typical distribution for excellent answers:
    - 8/8: AO1=2, AO2=2, AO3=4
    - 7/8: AO1=2, AO2=2, AO3=3
    - 6/8: AO1=2, AO2=1, AO3=3
    ''' if marks == 8 else '''
    For 12-mark questions (Evaluation):
    - AO1: Maximum 2 marks
    - AO2: Maximum 2 marks
    - AO3: Maximum 2 marks (CAPPED - do NOT award 3 or 4)
    - AO4: Maximum 6 marks
    
    Typical distribution for excellent answers:
    - 12/12: AO1=2, AO2=2, AO3=2, AO4=6
    - 11/12: AO1=2, AO2=2, AO3=2, AO4=5
    - 10/12: AO1=2, AO2=2, AO3=2, AO4=4
    '''}
    
    ZERO TOLERANCE POLICY:
    - No marks for irrelevant content
    - No marks for repetition
    - No marks for common sense without business theory
    - No marks for bullet points (unless specifically requested in question)
    - Penalize poor structure and unclear writing
    
    QUESTION CONTEXT:
    Question: {data['question']}
    Total Marks: {marks}
    
    CASE STUDY CONTEXT:
    {data['case_study']}
    
    STUDENT'S ANSWER:
    {data['answer']}
    
    YOUR TASK:
    1. Count the words in the student's answer
    2. Analyze against each Assessment Objective with reference to the Cambridge marking scheme
    3. Provide extensive, detailed feedback explaining EXACTLY why marks were awarded or deducted for each AO
    4. Reference specific parts of the marking scheme and Cambridge Business textbook principles
    5. Create a comprehensive, A*-worthy model answer that:
       - Follows proper paragraph structure with clear breaks
       - Aligns perfectly with the IPA (Iyipada) case study context
       - Demonstrates all Assessment Objectives at the highest level
       - Falls within the word limit ({word_limit})
       - Uses sophisticated business vocabulary and terminology
    
    FEEDBACK STRUCTURE REQUIRED:
    
    Your feedback must be structured as follows:
    
    **WORD COUNT ANALYSIS:**
    State the exact word count and whether it meets the requirement ({word_limit}). If outside range, specify the penalty.
    
    **AO1 - KNOWLEDGE & UNDERSTANDING (Max {2}):**
    - What marks were awarded and why
    - Specific definitions/concepts that were correct or missing
    - Reference to Cambridge syllabus terminology
    - What was needed to score full marks
    
    **AO2 - APPLICATION (Max {2 if marks == 8 else 2}):**
    - What marks were awarded and why  
    - Specific IPA context that was used or missing
    - Whether references to the case were direct and specific enough
    - What specific IPA details should have been included
    
    **AO3 - ANALYSIS (Max {4 if marks == 8 else 2}):**
    - What marks were awarded and why
    - Quality of cause-and-effect reasoning demonstrated
    - Whether chains of reasoning were developed sufficiently
    - Specific analytical gaps or weaknesses
    - What additional development was needed
    
    {f'''**AO4 - EVALUATION (Max 6):**
    - What marks were awarded and why
    - Quality of judgement and weighing of arguments
    - Whether conclusion was justified and clear
    - Missing evaluative elements (e.g., short/long term, stakeholder perspectives)
    - What was needed for full evaluative marks''' if marks == 12 else ''}
    
    **OVERALL JUDGEMENT:**
    A paragraph explaining the overall quality of the answer, major strengths and critical weaknesses, and how it compares to A*-level expectations.
    
    Return your response as a JSON object with this EXACT structure:
    {{
        "score": <total marks as integer>,
        "ao1": <marks for AO1 as integer>,
        "ao2": <marks for AO2 as integer>,
        "ao3": <marks for AO3 as integer>,
        "ao4": <marks for AO4 as integer>,
        "word_count": <actual word count as integer>,
        "word_count_penalty": <marks deducted for word count as integer, 0 if none>,
        "strengths": "<comprehensive detailed feedback on strengths with specific examples>",
        "weaknesses": "<extensive detailed feedback on ALL weaknesses and flaws, referencing marking scheme criteria and what was missing. Be very specific and thorough. This should be the longest section.>",
        "model_answer": "<A complete A*-worthy model answer with proper paragraph breaks (use \\n\\n for breaks), sophisticated vocabulary, perfect IPA context application, and exemplary demonstration of all AOs. Must be {word_limit}.>"
    }}
    
    CRITICAL REMINDERS:
    - Be ruthlessly strict - this is Cambridge A-Level, not a participation trophy
    - Reference the actual marking scheme criteria in your feedback
    - The model answer must be perfectly structured with paragraph breaks
    - Every criticism must be specific and constructive
    - Do not inflate marks - be harsh but fair
    """
    
    response = model.generate_content(system_prompt)
    return response.text.replace('```json', '').replace('```', '').strip()

if __name__ == '__main__':
    app.run(port=5000)
