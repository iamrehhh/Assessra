import os
import json
import logging
from typing import Dict, Any
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import pypdf
import openai
from openai import OpenAI
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, db
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-1.5-flash"

if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY not found. Marking functionality will be disabled.")
if not GEMINI_API_KEY:
    logger.info("GEMINI_API_KEY not found. Using GPT as primary model.")

print("🚀 App starting...")
logger.info("Environment variables loaded.")

app = Flask(__name__)
# Allow CORS for all domains
CORS(app, resources={r"/*": {"origins": "*"}})

# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
# Initialize Firebase Admin SDK
firebase_service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT")
database_url = "https://habibi-studies-chat-default-rtdb.firebaseio.com"

if firebase_service_account:
    try:
        cred_dict = json.loads(firebase_service_account)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred, {
            'databaseURL': database_url
        })
        logger.info("Firebase Admin initialized with service account.")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase with service account: {e}")
else:
    logger.warning("FIREBASE_SERVICE_ACCOUNT not found. Data persistence will be disabled.")
    # Initialize with default credentials or just skip
    try:
        firebase_admin.initialize_app(options={'databaseURL': database_url})
        logger.info("Firebase Admin initialized with default options.")
    except Exception as e:
        logger.error(f"Firebase initialization failed: {e}")

# ==========================================
# FIREBASE STORAGE PATHS & HELPERS
# ==========================================
VOCAB_DB_PATH = 'backend/vocab_progress'
IDIOMS_DB_PATH = 'backend/idioms_progress'
VOCAB_SETS_DB_PATH = 'backend/vocab_sets'
IDIOMS_SETS_DB_PATH = 'backend/idioms_sets'
SENTENCES_DB_PATH = 'backend/sentences'
NOTES_DB_PATH = 'backend/notes'

def load_db_from_firebase(path) -> Dict[str, Any]:
    try:
        ref = db.reference(path)
        data = ref.get()
        return data if isinstance(data, dict) else {}
    except Exception as e:
        logger.error(f"Error loading from Firebase ({path}): {e}")
        return {}

def save_db_to_firebase(path, data):
    try:
        ref = db.reference(path)
        ref.set(data)
    except Exception as e:
        logger.error(f"Error saving to Firebase ({path}): {e}")

# Legacy support/mapping
def load_db(filename):
    mapping = {
        'vocab_data.json': VOCAB_DB_PATH,
        'idioms_data.json': IDIOMS_DB_PATH,
        'vocab_sets_data.json': VOCAB_SETS_DB_PATH,
        'idioms_sets_data.json': IDIOMS_SETS_DB_PATH,
        'sentences_data.json': SENTENCES_DB_PATH
    }
    path = mapping.get(filename, f"backend/{filename.replace('.json', '')}")
    return load_db_from_firebase(path)

def save_db(filename, data):
    mapping = {
        'vocab_data.json': VOCAB_DB_PATH,
        'idioms_data.json': IDIOMS_DB_PATH,
        'vocab_sets_data.json': VOCAB_SETS_DB_PATH,
        'idioms_sets_data.json': IDIOMS_SETS_DB_PATH,
        'sentences_data.json': SENTENCES_DB_PATH
    }
    path = mapping.get(filename, f"backend/{filename.replace('.json', '')}")
    save_db_to_firebase(path, data)


# In-memory cache for PDF text to avoid re-processing
pdf_text_cache = {}

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file with caching.
    """
    if pdf_path in pdf_text_cache:
        print(f"Cache HIT for: {pdf_path}")
        return pdf_text_cache[pdf_path]

    print(f"Cache MISS - Extracting: {pdf_path}")
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Store in cache
        pdf_text_cache[pdf_path] = text
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
        # Added timeout to prevent hanging indefinitely
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
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

def generate_with_gpt(system_instruction, user_prompt):
    """
    Helper function to call OpenAI GPT-4o.
    """
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_prompt}
            ],
            temperature=1.0
        )
        
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"GPT API Error: {e}")
        return str(e)

def generate_with_gemini_simple(system_instruction, user_prompt):
    """
    Simple wrapper to call Gemini API with the single configured key.
    """
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY is missing.")
        return None
        
    result, error_code = generate_with_gemini(GEMINI_API_KEY, system_instruction, user_prompt)
    
    if result:
        return result
    else:
        print(f"Gemini API failed with error code: {error_code}")
        return None

# ==========================================
# STATIC FILE SERVING (Frontend)
# ==========================================
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/mark', methods=['POST'])
def mark():
    # Check OpenAI API key availability
    if not OPENAI_API_KEY:
        return jsonify({
            "error": "API Configuration Error",
            "message": "OPENAI_API_KEY is not configured. Please contact the administrator."
        }), 503
    
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

    # DYNAMIC PROTOCOLS (Database/Frontend Overrides)
    # Check if custom marking data is provided in the request
    custom_rubric = data.get('rubric')
    custom_system_prompt = data.get('system_prompt')
    custom_model_instruction = data.get('model_instruction')

    # DETECT BUSINESS PAPER 3 or 4
    is_business_p3 = False
    is_business_p4 = False
    
    if pdf_path and "9609" in pdf_path:
        if "_3" in pdf_path or "31" in pdf_path or "32" in pdf_path or "33" in pdf_path:
            is_business_p3 = True
            print("⚠ MODE ACTIVE: Business Paper 3 Detected")
        elif "_4" in pdf_path or "41" in pdf_path or "42" in pdf_path or "43" in pdf_path:
            is_business_p4 = True
            print("⚠ MODE ACTIVE: Business Paper 4 Detected")

    # DETECT GENERAL PAPER 8021
    is_general_paper = False
    if pdf_path and ("8021" in pdf_path or "General" in pdf_path):
        is_general_paper = True
        print("⚠ MODE ACTIVE: General Paper 8021 Detected")

    # 1. DETERMINE SYSTEM PROMPT
    if custom_system_prompt:
        system_prompt = custom_system_prompt
    elif is_business_p3 or is_business_p4:
        # NEUTRAL PERSONA FOR BUSINESS P3/P4
        system_prompt = """
        You are a Cambridge International A-Level Business (9609) Examiner. 
        Mark the following answer strictly according to the provided Global Marking Commands.
        Do not be artificially strict or lenient. Follow the rubric instructions precisely.
        """
    elif is_general_paper:
        system_prompt = """
        You are a Cambridge International AS Level English General Paper (8021) Examiner.
        Mark the following answer strictly according to the provided marking rubric.
        """
    else:
        system_prompt = f"""
        You are a Cambridge International A-Level Business Examiner. 
        Mark the following answer regarding the mark scheme.
        """

    # 2. DETERMINE RUBRIC
    if custom_rubric:
        rubric = custom_rubric
    elif is_business_p3:
        # COMPREHENSIVE BUSINESS P3 RUBRIC (Cambridge 9609)
        if marks <= 4:
            # CALCULATION QUESTIONS (2 marks standard)
            rubric = """
            CALCULATION QUESTION RUBRIC (2 MARKS)
            
            2 MARKS:
            - Correct answer with accurate units (e.g., %, weeks, $)
            - Award even without working shown (unless question explicitly requires it)
            
            1 MARK:
            - Correct formula stated
            - Correct method with arithmetic error
            - Valid Own Figure Rule (OFR): using earlier wrong figure correctly in valid method
            
            0 MARKS:
            - No creditable response
            
            APPLY positive marking only. ACCEPT alternative correct methods.
            """
        elif marks == 8:
            # ANALYSIS QUESTIONS (8 marks)
            rubric = """
            ANALYSIS QUESTION RUBRIC (8 MARKS)
            Total: AO1 (2) + AO2 (2) + AO3 (4) = 8 marks
            
            AO1 – KNOWLEDGE (max 2 marks):
            - 1 mark per relevant business term/concept identified and explained
            - Must be accurate and relevant to question
            
            AO2 – APPLICATION (max 2 marks):
            - 1 mark per point specifically applied to business context
            - Must use case information, not generic statements
            
            AO3 – ANALYSIS (max 4 marks):
            Level 2 (3-4 marks):
            - Developed analysis identifying connections between causes and impacts
            - Multiple logical links in chain of reasoning
            - Shows business consequences clearly
            
            Level 1 (1-2 marks):
            - Limited analysis with basic connections
            - Simple cause-effect links only
            - Minimal development
            
            MARK using best-fit. Award whole marks only.
            """
        elif marks == 12:
            # EVALUATION QUESTIONS (12 marks)
            rubric = """
            EVALUATION QUESTION RUBRIC (12 MARKS)
            Total: AO1 (2) + AO2 (2) + AO3 (2) + AO4 (6) = 12 marks
            
            AO1 – KNOWLEDGE (max 2 marks):
            2 marks: Developed knowledge of key terms, accurately explained
            1 mark: Limited knowledge, partially explained
            0 marks: No relevant business knowledge
            
            AO2 – APPLICATION (max 2 marks):
            2 marks: Developed application to context with specific case references
            1 mark: Limited application, superficial case reference
            0 marks: Generic answer with no case reference
            
            AO3 – ANALYSIS (max 2 marks):
            2 marks: Developed analysis showing causes, impacts, and consequences
            1 mark: Limited analysis with basic connections
            0 marks: Descriptive only, no analytical reasoning
            
            AO4 – EVALUATION (max 6 marks):
            Level 3 (5-6 marks):
            - Developed evaluation with clear judgement
            - Balanced consideration of arguments
            - Judgement justified and contextualized to the case
            
            Level 2 (3-4 marks):
            - Developed evaluation with judgement
            - Some balance shown
            - Context weak or generic
            
            Level 1 (1-2 marks):
            - Limited evaluation
            - Judgement present but weak justification
            
            0 marks: No judgement or evaluative comment
            
            MARK using best-fit within levels. Award whole marks only.
            """
        else:
            # FALLBACK FOR OTHER MARK ALLOCATIONS
            rubric = f"Mark strictly according to Cambridge Business 9609 Paper 3 conventions for {marks} marks."
        
        word_guide = "Appropriate to mark allocation"
    elif is_business_p4:
        # COMPREHENSIVE BUSINESS P4 RUBRIC (Cambridge 9609) - 20 MARK STRATEGY QUESTIONS
        rubric = """
        STRATEGY QUESTION RUBRIC (20 MARKS)
        Total: AO1 (3) + AO2 (2) + AO3 (8) + AO4 (7) = 20 marks
        
        AO1 – KNOWLEDGE & UNDERSTANDING (max 3 marks):
        Level 2 (2-3 marks):
        - Developed knowledge of strategic terms and factors
        - Clear understanding of business concepts
        - Accurately explained
        
        Level 1 (1 mark):
        - Limited knowledge
        - Partial understanding
        
        0 marks: No valid business knowledge
        
        AO2 – APPLICATION TO CONTEXT (max 2 marks):
        Level 2 (2 marks):
        - Developed application to context
        - Consistent use of case facts
        - Clearly rooted in the specific business
        
        Level 1 (1 mark):
        - Limited application
        - One-off or superficial case reference
        
        0 marks: Generic answer with no context
        
        AO3 – ANALYSIS (max 8 marks):
        Level 3 (7-8 marks):
        - Developed analysis of overall strategy
        - Integrated connections between strategic elements
        - Shows impact on business performance/survival
        - Multiple sustained chains of reasoning
        
        Level 2 (4-6 marks):
        - Developed analysis of individual strategic elements
        - Several linked effects shown
        - Good depth on some issues
        
        Level 1 (1-3 marks):
        - Limited analysis
        - Simple causal links only
        - Minimal development
        
        0 marks: Descriptive only, no analysis
        
        AO4 – EVALUATION (max 7 marks):
        Level 3 (6-7 marks):
        - Effective evaluation with developed judgement
        - Highly contextualized to the case business
        - Balances key arguments effectively
        - Clear, justified conclusion
        
        Level 2 (3-5 marks):
        - Developed evaluation with balanced arguments
        - Some contextual support
        - Judgement present
        
        Level 1 (1-2 marks):
        - Limited evaluation
        - Weak or unsupported judgement
        
        0 marks: No evaluative comment
        
        MARK using best-fit within levels. Award whole marks only.
        APPLY positive marking. IGNORE spelling/grammar if meaning is clear.
        """
        word_guide = "400-500 words for A* response"
    elif is_general_paper:
        rubric = """
        CAMBRIDGE AS LEVEL ENGLISH GENERAL PAPER 8021/12 MARKING RUBRIC
        Maximum Marks: 30

        LEVEL 5 (25-30 marks) - EXCELLENT
        AO1 (Selection/Application): 
        - Selects a range of fully relevant information
        - Information effectively exemplifies main aspects
        - Examples support main ideas/opinions consistently
        AO2 (Analysis/Evaluation):
        - Analyses possible meanings of question
        - Defines scope of response
        - Evaluates a range of arguments
        - Reaches supported conclusion
        - Strong argument with clear evidence
        AO3 (Communication):
        - Consistently appropriate register
        - Wide range of vocabulary and variety of features
        - Controlled and accurate language
        - Cohesive, well-organised response

        LEVEL 4 (19-24 marks) - GOOD
        AO1: Selects relevant information, exemplifies main aspects, applies examples appropriately.
        AO2: Analyses meaning, begins to evaluate different arguments, well-reasoned argument.
        AO3: Appropriate register, range of vocabulary, some accuracy, generally well organised.

        LEVEL 3 (13-18 marks) - SATISFACTORY
        AO1: Selects information exemplifying some aspects, examples support ideas.
        AO2: Understands question, brings together some arguments, logical argument usually supported.
        AO3: Communicates clearly overall, inconsistent register, everyday vocabulary, some organisation.

        LEVEL 2 (7-12 marks) - BASIC
        AO1: Limited information, examples linked to some ideas.
        AO2: Partial understanding, refers to arguments, argument partially supported.
        AO3: Communicates clearly in places, inconsistent register, basic vocabulary, frequent errors, fragmented.

        LEVEL 1 (1-6 marks) - POOR
        AO1: Limited information, examples may not link.
        AO2: Limited response, basic conclusion, weak argument.
        AO3: Lack of clarity, inappropriate register, basic vocabulary, frequent errors.

        If score is 0: No creditable content.
        """
        word_guide = "Subject to 100-200 word feedback limit"
    elif marks <= 4:
        # CALCULATION / SHORT ANSWER
        rubric = """
        STRICT CALCULATION/SHORT ANSWER RUBRIC:
        Instruction: 
        - If the final numerical answer is correct, award full marks.
        - If the final answer is incorrect, award 1 mark if the correct formula or method is shown in the working.
        """
        word_guide = "Show working"
    else:
        rubric = f"Mark strictly according to standard Cambridge conventions for {marks} marks."
        word_guide = "Appropriate length"

    # 3. DETERMINE MODEL ANSWER INSTRUCTION
    if custom_model_instruction:
        model_answer_instruction = custom_model_instruction
    elif is_business_p3 or is_business_p4:
        # BUSINESS PAPERS MODEL ANSWER WITH WORD LIMITS
        if marks <= 4:
            # CALCULATION QUESTIONS
            model_answer_instruction = """<CALCULATION MODEL ANSWER:
            Act as a top-scoring student.
            1. EXTRACT DATA: List relevant numbers from the case.
            2. FORMULA: State the formula.
            3. WORKING: Show the calculation steps clearly.
            4. ANSWER: State the final answer with units.
            
            OUTPUT FORMAT:
            Calculations should be clear and step-by-step.
            No essay writing needed for calculations.>"""
        elif marks == 8:
            # 8-MARK ANALYSIS (NO WORD LIMIT)
            model_answer_instruction = """<8-MARK MODEL ANSWER (A* STUDENT RESPONSE):
            Act as an expert Cambridge International A Level Business (9609) examiner and top-tier student. Generate a perfect model answer for this Paper 3 question based on the provided case study context.
            
            **Question:** Refer to the provided QUESTION above.
            **Total Marks:** 8
            **Case Study Context:** Refer to the provided CASE STUDY CONTEXT above.
            
            Adhere strictly to the following structural rules:
            
            1. **Paragraph 1 (Point 1):** - State the first point clearly. 
               - Provide a brief, precise definition of the core business concept (AO1).
               - Apply the point directly to the business using specific data/facts from the case study. Do not just repeat the data; use it to support the point (AO2).
               - Build a developed chain of reasoning (Cause -> Impact -> Consequence on the business) (AO3).
            2. **Paragraph 2 (Point 2):**
               - State the second point clearly.
               - Apply it directly to a different piece of data/context from the case study (AO2).
               - Build another developed chain of reasoning (AO3).
            *(Do NOT include a conclusion or any evaluation for 8-mark questions).*
            
            Ensure the tone is academic, concise, and heavily focused on business terminology.
            Output ONLY the candidate response.>"""
        elif marks == 12:
            # 12-MARK EVALUATION (NO WORD LIMIT)
            model_answer_instruction = """<12-MARK MODEL ANSWER (A* STUDENT RESPONSE):
            Act as an expert Cambridge International A Level Business (9609) examiner and top-tier student. Generate a perfect model answer for this Paper 3 question based on the provided case study context.
            
            **Question:** Refer to the provided QUESTION above.
            **Total Marks:** 12
            **Case Study Context:** Refer to the provided CASE STUDY CONTEXT above.
            
            Adhere strictly to the following structural rules:
            
            1. **Paragraph 1 (Argument 1):**
               - Define the key concept/strategy (AO1).
               - Present the first side of the argument, applying it strictly to the specific business context (AO2).
               - Provide a short chain of analysis showing the likely impact (AO3).
            2. **Paragraph 2 (Argument 2 / Counter-argument):**
               - Present the opposing side or a different factor, again heavily contextualized with case data (AO2).
               - Provide a short chain of analysis showing the alternative impact (AO3).
            3. **Paragraph 3 (Evaluation & Conclusion - heavily weighted):**
               - Make a definitive, supported judgement that directly answers the question (AO4).
               - Do not just summarize the previous paragraphs. Introduce evaluative criteria: What does the success of this decision depend upon? (e.g., timeline, competitor reaction, elasticity, budget constraints).
               - Weigh the arguments clearly against each other in the specific context of the business to form a final, justified conclusion (AO4).
            
            Ensure the tone is academic, concise, and heavily focused on business terminology.
            Output ONLY the candidate response.>"""
        elif marks == 20:
            # 20-MARK STRATEGY (NO WORD LIMIT)
            model_answer_instruction = """<20-MARK STRATEGY MODEL ANSWER (A* STUDENT RESPONSE):
            Act as an expert Cambridge International A Level Business (9609) examiner and top-tier student. Generate a perfect model answer for this Paper 4 (Business Strategy) 20-mark essay question based on the provided case study context.
            
            **Question:** Refer to the provided QUESTION above.
            **Total Marks:** 20
            **Case Study Context:** Refer to the provided CASE STUDY CONTEXT above.
            
            Adhere strictly to the following structural rules for a 20-mark essay:
            
            1. **Introduction (AO1 & AO2):**
               - Provide clear, precise definitions of the core strategic terms in the question (e.g., transformational leadership, marketing strategy). 
               - Briefly outline the current strategic position or problem the business is facing using specific data from the case study (e.g., timeline events, appendices data).
            
            2. **Paragraph 1 (Strategic Argument 1 - AO2 & AO3 & mini-AO4):**
               - Present the first major argument or factor.
               - Apply it heavily to the case study, synthesizing data from different appendices or timeline points.
               - Build a deep chain of analysis (Cause -> Impact -> Strategic Consequence).
               - End the paragraph with a brief evaluative comment (e.g., "However, the success of this depends on...").
            
            3. **Paragraph 2 (Strategic Argument 2 - AO2 & AO3 & mini-AO4):**
               - Present a distinct second argument, counter-argument, or alternative strategic perspective.
               - Ground it in different evidence from the case study.
               - Build another deep chain of analysis.
               - End with a brief evaluative comment weighing its significance.
            
            4. **Paragraph 3 (Optional but recommended - Further Analysis):**
               - Introduce a third perspective or long-term implication (e.g., financial constraints, competitor reactions, impact on corporate culture).
            
            5. **Conclusion & Strategic Evaluation (AO4 - heavily weighted):**
               - Make a definitive, supported judgement that directly answers the question. Do not just summarize the previous paragraphs.
               - Weigh the arguments against each other. Which factor is the *most* important and why?
               - Introduce strong evaluative criteria: What does the success of this strategy depend upon? (e.g., the timeframe, the budget, the specific leadership style, macroeconomic factors).
               - Provide a final, justified strategic recommendation or conclusion tailored specifically to the exact constraints and objectives of the business in the case study.
            
            Ensure the tone is academic, cohesive, and heavily focused on A Level Business strategic terminology.
            Output ONLY the candidate response.>"""
        else:
            model_answer_instruction = f"<Write a perfect A* model answer ({marks} marks). Continuous prose, no bullets, fully applied to the case.>"
    else:
        # FALLBACK FOR OTHER PAPERS
        model_answer_instruction = (
            f"<For calculation questions: YOU MUST FOLLOW THIS EXACT FORMAT:\n"
            f"1. EXTRACT DATA: List every relevant number from the case study (e.g., 'Revenue = $500,000').\n"
            f"2. STATE FORMULA: Write the standard formula clearly.\n"
            f"3. SUBSTITUTE: Show the formula with the extracted numbers inserted.\n"
            f"4. CALCULATE: Show the step-by-step arithmetic. DOUBLE CHECK YOUR MATH.\n"
            f"5. FINAL ANSWER: State the final result with correct units (e.g., %, $, ratios).\n"
            f"DO NOT SKIP STEPS. PRECISION IS MANDATORY.>\n"
        ) if marks <= 4 else (
            f"<GENERATE A MODEL ANSWER USING THESE COMMANDS:\n"
            f"General Paper 8021 Model Answer Specifications:\n"
            f"- Word Count: 600-700 words\n"
            f"- Structure: Intro (80-100w), Body (4-5 paragraphs, 100-120w each), Conclusion (80-100w)\n"
            f"- Must demonstrate: Sophisticated question interpretation, analytical depth, evaluative thinking, specific credible examples (post-2020 preferred), logical coherence, academic expression.\n"
            f"- Follow the 'Discuss', 'Evaluate', or 'Country-Specific' template as appropriate for the question.\n"
            f"Ensure the answer would score Level 5 (25-30 marks) across all AOs.>"
        ) if is_general_paper else (
            f"<Write a perfect A* model answer ({word_guide}) that would score FULL MARKS.\n"
            f"The answer MUST follow standard A-Level Essay structure with proper paragraph breaks.\n"
            f"IMPORTANT: If the question involves data, calculate ratios/figures IN THE BACKGROUND first.\n"
            f"Structure:\n"
            f"1. DEFINITION (AO1): Define terms precisely.\n"
            f"2. APPLICATION (AO2): Use specific facts/figures from the case.\n"
            f"3. ANALYSIS (AO3): Develop chains of argument (Point -> Evidence -> Explanation + Connectors).\n"
            f"4. EVALUATION (AO4): Balanced conclusion, weighting, short/long term view.\n"
            f"CRITICAL: The model answer must be a standalone perfect response. DO NOT mention the student.> "
        )

    # 4. DETERMINE FEEDBACK STRUCTURE
    if is_general_paper:
        feedback_structure = """
    You must output your final grading using the following structure for the 'detailed_critique' field.
    IMPORTANT: The feedback response MUST be concise. MAXIMUM 100-200 WORDS TOTAL for the entire feedback section.
    
    Structure:
    1. Final Score: [X]/30
    2. Assessment Objective Breakdown:
       - AO1 (Selection & Application): [X]/10
       - AO2 (Analysis & Evaluation): [X]/10
       - AO3 (Communication): [X]/10
       - AO4: 0/0
    3. Comprehensive Examiner Report:
       - Grade Equivalence: [Distinction/Credit/Pass/Fail]
       - Overall Assessment: [One sentence verdict]
       - Strengths: [Brief bullet points]
       - Areas for Development: [Brief bullet points]
       - Next Steps: [1-2 priority actions]
    """
    elif is_business_p3 or is_business_p4:
        # PRAISE-POLISH-PONDER FEEDBACK STRUCTURE FOR BUSINESS PAPERS
        if marks <= 4:
            # Calculation feedback
            ao_breakdown = f"AO1: [X]/{marks}"
        elif marks == 8:
            ao_breakdown = "AO1 (Knowledge): [X]/2, AO2 (Application): [X]/2, AO3 (Analysis): [X]/4"
        elif marks == 12:
            ao_breakdown = "AO1 (Knowledge): [X]/2, AO2 (Application): [X]/2, AO3 (Analysis): [X]/2, AO4 (Evaluation): [X]/6"
        elif marks == 20:
            ao_breakdown = "AO1 (Knowledge): [X]/3, AO2 (Application): [X]/2, AO3 (Analysis): [X]/8, AO4 (Evaluation): [X]/7"
        else:
            ao_breakdown = f"AO1: [X]/2, AO2: [X]/2, AO3: [X]/{marks-4}, AO4: [X]/0"
        
        feedback_structure = f"""
    CRITICAL: The feedback response MUST be 100-200 WORDS TOTAL.
    
    Structure for 'detailed_critique' field:
    1. Final Score: [X]/{marks}
    2. Assessment Objective Breakdown: {ao_breakdown}
    3. Examiner Feedback (Praise-Polish-Ponder):
       
       **PRAISE** (What earned marks):
       - Cite specific AO1 (Knowledge) strengths with exact terminology used
       - Cite specific AO2 (Application) strengths with exact case data referenced
       - Quote or reference the student's exact text where they succeeded
       
       **POLISH** (What lost marks - AO3 Analysis):
       - Identify missing links in the chain of reasoning
       - Point out where causes were stated but impacts/consequences were not developed
       - Explain exactly where the analytical chain broke down
       
       **PONDER** (Challenge for AO4 Evaluation):
       - Pose ONE direct question that challenges their judgement
       - Ask them to balance key arguments or weigh the most critical factor in context
       - Make them think about what they overlooked or didn't consider
    
    WORD COUNT: Keep total feedback to 100-200 words. Be concise and impactful.
    """
    else:
        feedback_structure = f"""
    You must output your final grading strictly using the following structure for the 'detailed_critique' field. 
    Do not output a single, blocky paragraph. Break down the feedback comprehensively.

    Comprehensive Examiner Report Structure:
    1. Final Score: [X]/{marks}
    2. Assessment Objective Breakdown:
       - AO1 (Knowledge): [X]/2
       - AO2 (Application): [X]/2
       - AO3 (Analysis): [X]/{4 if marks >= 8 else 2}
       - AO4 (Evaluation): [X]/{6 if marks == 12 else 0}
    3. Comprehensive Examiner Report:
       - Overall Verdict: Provide a single, blunt sentence summarizing the overall quality and rigor of the response.
       - Strengths (Marks Awarded): Explicitly detail what the candidate did correctly. Identify the exact definitions, data applications, or logical links that successfully earned marks. State why they were correct according to the Cambridge mark scheme.
       - Weaknesses & Marks Withheld: Be ruthless and precise here. Explain exactly where the candidate's logic failed or where they lost focus.
         * Address AO2: Did they just copy data without using it?
         * Address AO3: Where did their chain of reasoning break down? Point out exactly where they stated a cause but failed to connect it to an ultimate consequence for the business.
         * Address AO4 (if applicable): Did they fail the "Any Business" test? Explain why their conclusion was too generic.
       
    Required phrasing: Start your critiques with phrases like: "You failed to...", "Your chain of reasoning broke down when...", "Your evaluation was capped at Level 2 because...".
    """

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
    3. If the student uses generic points not linked to the case, do not award marks for Application.

    OUTPUT FORMAT REQUIREMENT:
    {feedback_structure}

    4. MODEL ANSWER INSTRUCTION:
    {model_answer_instruction}

    OUTPUT FORMAT (JSON ONLY):
    {{
        "score": <total_score_int>,
        "ao1": <score_int>, "ao2": <score_int>, "ao3": <score_int>, "ao4": <score_int>,
        "detailed_critique": "<Markdown string that MUST START with '1. Final Score:...' and '2. Assessment Objective Breakdown:...' followed by the report.>",
        "model_answer": "<The generated A* model answer string based on the instruction above>"
    }}
    """
    
    # Use GPT-4o Mini for all marking
    logger.info(f"📝 Processing with GPT-4o Mini... (Prompt length: {len(user_prompt)})")
    text = generate_with_gpt(system_prompt, user_prompt)
    
    # Check if text is an error message (starts with an exception from generate_with_gpt)
    if text and not text.startswith("Error"):
        cleaned_text = text.replace('```json', '').replace('```', '').strip()
        try:
            data = json.loads(cleaned_text)
            
            # Ensure model_answer and detailed_critique exist (Critical for General Paper)
            if 'model_answer' not in data:
                data['model_answer'] = "Model answer not generated."
            if 'detailed_critique' not in data:
                data['detailed_critique'] = "Feedback not generated."
                
            return jsonify(data), 200
        except json.JSONDecodeError:
            logger.error(f"❌ JSON Decode Error: {cleaned_text[:500]}")
            return jsonify({
                "score": 0,
                "ao1": 0, "ao2": 0, "ao3": 0, "ao4": 0,
                "detailed_critique": "Error: AI response was not valid JSON. Please try again.",
                "model_answer": "Error generating model answer.",
                "raw_response": cleaned_text[:500]
            }), 200
    else:
        return jsonify({
            "error": "Failed to generate marking",
            "message": f"GPT-4o Mini failed to generate a response. API Error: {text or 'Unknown Error'}. Please check your OpenAI quota and API key."
        }), 500



# Syncing databases with Firebase

# Load data on startup
logger.info("Syncing databases with Firebase...")
vocab_progress_db = load_db_from_firebase(VOCAB_DB_PATH)
idioms_progress_db = load_db_from_firebase(IDIOMS_DB_PATH)
vocab_sets_db = load_db_from_firebase(VOCAB_SETS_DB_PATH)
idioms_sets_db = load_db_from_firebase(IDIOMS_SETS_DB_PATH)
sentences_db = load_db_from_firebase(SENTENCES_DB_PATH)
notes_db = load_db_from_firebase(NOTES_DB_PATH)
logger.info("Firebase Sync Complete.")

if not isinstance(vocab_progress_db, dict): vocab_progress_db = {}
if not isinstance(idioms_progress_db, dict): idioms_progress_db = {}
if not isinstance(vocab_sets_db, dict): vocab_sets_db = {}
if not isinstance(idioms_sets_db, dict): idioms_sets_db = {}
if not isinstance(sentences_db, dict): sentences_db = {}
if not isinstance(notes_db, dict): notes_db = {}

@app.route('/save_vocab_progress', methods=['POST'])
def save_vocab_progress():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    progress = data.get('progress', {})
    
    vocab_progress_db[user_id] = progress
    save_db("vocab_data.json", vocab_progress_db)
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
    save_db("idioms_data.json", idioms_progress_db)
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
        save_db_to_firebase(NOTES_DB_PATH, notes_db)
    
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
    save_db_to_firebase(NOTES_DB_PATH, notes_db)
    return jsonify({"status": "success", "message": "Notes updated"})

@app.route('/delete_note_item', methods=['POST'])
def delete_note_item():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    section = data.get('section')
    word = data.get('word')
    
    if user_id in notes_db and section in notes_db[user_id]:
        notes_db[user_id][section] = [item for item in notes_db[user_id][section] if item['word'] != word]
        save_db_to_firebase(NOTES_DB_PATH, notes_db)
    
    return jsonify({"status": "success", "message": "Note deleted"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
