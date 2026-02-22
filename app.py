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
    Helper function to call Gemini API via REST with retry logic.
    Returns (result_text, error_code).
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
    
    import time
    max_retries = 3
    base_delay = 2

    for attempt in range(max_retries):
        try:
            # Added timeout to prevent hanging indefinitely
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            
            # Check for quota/token errors
            if response.status_code == 429:
                logger.warning(f"Gemini API Rate Limit (429) on attempt {attempt+1}")
                if attempt < max_retries - 1:
                    time.sleep(base_delay * (2 ** attempt))
                    continue
                return None, 429
            elif response.status_code == 503:
                 logger.warning(f"Gemini Service Unavailable (503) on attempt {attempt+1}")
                 if attempt < max_retries - 1:
                    time.sleep(base_delay * (2 ** attempt))
                    continue
                 return None, 503
            elif response.status_code == 403:
                logger.error(f"Gemini API Permission Denied (403)")
                return None, 403
            
            response.raise_for_status()
            result = response.json()
            
            # Extract text from response
            if 'candidates' in result and result['candidates']:
                content = result['candidates'][0]['content']['parts'][0]['text']
                return content, None
            else:
                return None, None
                
        except requests.exceptions.Timeout:
            logger.warning(f"Gemini Request Timed Out on attempt {attempt+1}")
            if attempt < max_retries - 1:
                time.sleep(base_delay * (2 ** attempt))
                continue
            return None, 504
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            if attempt < max_retries - 1 and "429" in str(e): # simplistic check
                 time.sleep(base_delay * (2 ** attempt))
                 continue
            return None, 500
            
    return None, 500

def generate_with_gpt(system_instruction, user_prompt):
    """
    Helper function to call OpenAI GPT-4o-mini with retry logic, timeout, and JSON mode.
    """
    import time as _time

    max_retries = 3
    base_delay = 2  # seconds

    for attempt in range(max_retries):
        try:
            client = OpenAI(api_key=OPENAI_API_KEY, timeout=120.0)
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=1.0,
                max_tokens=16384,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            if content and content.strip():
                return content
            else:
                logger.warning(f"GPT returned empty response on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    _time.sleep(base_delay * (attempt + 1))
                    continue
                return None

        except Exception as e:
            error_str = str(e).lower()
            logger.error(f"GPT API Error (attempt {attempt + 1}/{max_retries}): {e}")
            
            # Retry on transient errors (rate limit, timeout, connection)
            is_transient = any(keyword in error_str for keyword in [
                'rate_limit', 'rate limit', 'timeout', 'connection', 
                'server_error', '503', '502', '429', 'overloaded'
            ])
            
            if is_transient and attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)  # Exponential backoff
                logger.info(f"⏳ Retrying in {delay}s...")
                _time.sleep(delay)
                continue
            
            return None
    
    return None

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
    custom_feedback_structure = data.get('feedback_structure')

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

    # DETECT ECONOMICS PAPER 4
    is_economics_p4 = False
    if pdf_path and "9708" in pdf_path:
        if "_4" in pdf_path or "41" in pdf_path or "42" in pdf_path or "43" in pdf_path:
            is_economics_p4 = True
            print("⚠ MODE ACTIVE: Economics Paper 4 Detected")

    # DETECT GENERAL PAPER 8021
    is_general_paper = False
    if pdf_path and ("8021" in pdf_path or "General" in pdf_path):
        is_general_paper = True
        print("⚠ MODE ACTIVE: General Paper 8021 Detected")

    # ---------------------------------------------------------
    # ATTEMPT TO FIND & EXTRACT MARKING SCHEME
    # ---------------------------------------------------------
    marking_scheme_text = ""
    if pdf_path:
        base_dir = os.path.dirname(pdf_path)
        filename = os.path.basename(pdf_path)
        ms_filename = None

        # Standard naming convention replacements
        if "_in_" in filename:
            ms_filename = filename.replace("_in_", "_ms_")
        elif "_qp_" in filename:
            ms_filename = filename.replace("_qp_", "_ms_")
        
        if ms_filename:
            ms_path = os.path.join(base_dir, ms_filename)
            if os.path.exists(ms_path):
                print(f"✅ FOUND Marking Scheme: {ms_path}")
                try:
                    marking_scheme_text = extract_text_from_pdf(ms_path)
                    # Limit MS text length to avoid token limits, prioritizing the relevant sections if possible
                    # For now we take the whole thing as they aren't huge
                except Exception as e:
                    print(f"❌ Failed to extract Marking Scheme: {e}")

    # 1. DETERMINE SYSTEM PROMPT
    if custom_system_prompt:
        system_prompt = custom_system_prompt
    elif is_business_p3 or is_business_p4:
        # NEUTRAL PERSONA FOR BUSINESS P3/P4
        system_prompt = f"""
        You are a Cambridge International A-Level Business (9609) Examiner. 
        Mark the following answer strictly according to the provided Global Marking Commands.
        Do not be artificially strict or lenient. Follow the rubric instructions precisely.
        
        CRITICAL FOR CALCULATION QUESTIONS:
        If the question involves any numerical calculation (e.g., ARR, payback period, NPV, PED, 
        profit margins, ratios, moving averages, seasonal variations, labour productivity, etc.):
        1. REFERENCE THE MARKING SCHEME: If a Marking Scheme Text is provided below, you MUST use the exact figures and method shown in it.
        2. If no Marking Scheme is provided, you MUST extract the relevant data from the case study/insert text provided and calculate it yourself first.
        3. You MUST compare the student's answer to the CORRECT calculated answer (from MS or your own calculation).
        4. Do NOT guess or approximate — use the exact figures.
        5. Award marks based on whether the student's calculation matches the correct answer.

        CRITICAL FOR ESSAY/STRATEGY QUESTIONS:
        If a Marking Scheme is provided below, you MUST use it as the absolute ground truth for identifying valid points, analysis, and evaluation.
        You must cross-reference the student's answer with the Marking Scheme to award Knowledge (AO1), Application (AO2), Analysis (AO3), and Evaluation (AO4) marks according to the rubric.

        {'[MARKING SCHEME REFERENCE DATA]' if marking_scheme_text else ''}
        {marking_scheme_text if marking_scheme_text else ''}
        """
    elif is_economics_p4:
        system_prompt = f"""
        You are an experienced Cambridge International A Level Economics examiner 
        marking Paper 4 (9708). Apply the marking criteria precisely and 
        consistently for ANY Paper 4 question. Always award whole marks only. 
        Mark positively — reward what is correct, never deduct for errors or omissions.

        CRITICAL INSTRUCTION:
        If a Marking Scheme is provided below, you MUST use it as the absolute ground truth for grading.
        You must verify the student's answer against the specific points in the Marking Scheme.

        {'[MARKING SCHEME REFERENCE DATA]' if marking_scheme_text else ''}
        {marking_scheme_text if marking_scheme_text else ''}
        """
    elif is_general_paper:
        system_prompt = f"""
        You are a Cambridge International AS Level English General Paper (8021) Examiner.
        Mark the following answer strictly according to the provided marking rubric.
        
        CRITICAL INSTRUCTION FOR NUANCED ARGUMENTS:
        1. If a Marking Scheme is provided below, you MUST use it as a reference for expected 
           arguments, examples, valid points, and overall content.
        2. HOWEVER, do NOT rigidly penalize the student if they present an argument that falls 
           outside the specific bullet points of the Marking Scheme, PROVIDED THAT their argument 
           shows deep philosophical, conceptual, or analytical maturity.
        3. REWARD CREATIVITY AND EXTERNAL KNOWLEDGE: If the student provides an argument or example that is NOT in the Marking Scheme but is factually accurate, highly relevant, and creatively explores the deeper meaning of the question, you MUST give it full credit. Assess the factual accuracy and relevance independently. Good, creative, and factually correct writing MUST be marked well.
        4. Accept well-reasoned thought experiments, philosophical precedents, or historical 
           analogies as valid "specific examples"—do not strictly demand only recent factual data 
           if the philosophical point is strong.
        5. DO NOT give away marks freely. Leniency for nuance refers ONLY to the *type* of argument 
           or structure; the student must still demonstrate linguistic clarity, logical cohesion, 
           and highly effective communication to score in the top bands.

        {'[MARKING SCHEME REFERENCE DATA]' if marking_scheme_text else ''}
        {marking_scheme_text if marking_scheme_text else ''}
        """
    else:
        system_prompt = f"""
        You are a Cambridge International A-Level Examiner. 
        Mark the following answer regarding the mark scheme.

        {'[MARKING SCHEME REFERENCE DATA]' if marking_scheme_text else ''}
        {marking_scheme_text if marking_scheme_text else ''}
        """

    # 2. DETERMINE RUBRIC
    if custom_rubric:
        rubric = custom_rubric
    elif is_business_p3:
        # COMPREHENSIVE BUSINESS P3 RUBRIC (Cambridge 9609)
        if marks <= 4:
            # CALCULATION QUESTIONS (1-4 marks)
            rubric = f"""
            CALCULATION QUESTION RUBRIC ({marks} MARKS)
            
            CRITICAL INSTRUCTION — BEFORE grading the student's answer:
            1. LOOK for the specific question in the provided MARKING SCHEME text (if available).
            2. If available, the MS answer is the GROUND TRUTH. Compare student answer directly to it.
            3. If MS is not available, solve the calculation yourself using ONLY the data from the case study/insert.
            4. Extract the exact numbers from the tables/text provided.
            5. Apply the correct formula.
            6. Compute the answer step-by-step.
            7. ONLY THEN compare the student's answer to YOUR calculated answer.
            
            MARKING SCHEME ({marks} marks):
            - Full marks ({marks}/{marks}): Correct final answer (with or without working shown).
              Accept answers to reasonable rounding (e.g., 2 decimal places).
              Correct units must be stated where applicable (%, $, weeks, days, ratio).
            - Partial marks: Award 1 mark if:
              * Correct formula is stated but arithmetic is wrong
              * Correct method/approach with a computational error
              * Own Figure Rule (OFR): A wrong intermediate figure used correctly in valid subsequent steps
            - 0 marks: No creditable response, wrong formula AND wrong answer.
            
            IMPORTANT:
            - For multi-step calculations (e.g., ARR, payback, NPV), award marks for each correct step.
            - ACCEPT alternative valid methods that reach the same answer.
            - Do NOT penalise rounding differences if the method is correct.
            - If the question is worth 1 mark, award 1 for correct answer, 0 otherwise.
            - If the question is worth 3-4 marks, distribute marks across: formula (1), working (1-2), final answer (1).
            
            APPLY positive marking only.
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
        (Use the Marking Scheme to identify valid knowledge points)
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
        (Use the Marking Scheme to verify the validity of analytical chains)
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
        (Use the Marking Scheme to identify expected evaluative points and justified conclusions)
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
        IMPORTANT: Your feedback MUST explicitly reference both the rubric levels and the specific points from the Marking Scheme.
        """
        word_guide = "400-500 words for A* response"
    elif is_economics_p4:
        rubric = """
        =============================================================
        PAPER 4 STRUCTURE OVERVIEW
        =============================================================
        
        Paper 4 consists of two sections:
        
        SECTION A — Data Response (20 marks total)
        Contains short-answer sub-questions based on stimulus material 
        (data, figures, tables, extracts). Uses point-based marking.
        
        SECTION B — Essays (20 marks each, candidates answer 2 from 4)
        Extended response questions. Uses levels-based marking split into:
          - AO1 Knowledge & Understanding + AO2 Analysis: 14 marks
          - AO3 Evaluation: 6 marks
        
        =============================================================
        SECTION A — POINT-BASED MARKING RULES
        =============================================================
        
        Apply these rules to ALL Section A sub-questions:
        
        GENERAL PRINCIPLES:
        - Award marks for correct, clearly relevant economic points only.
        - A key term alone is insufficient — the candidate must demonstrate 
          they understand it and are not using it incorrectly.
        - Do not award marks for vague, self-contradictory, or repeated points.
        - Alternative correct answers not in the mark scheme should still be 
          credited if they are economically valid.
        - Do not penalise for poor spelling or grammar unless meaning is 
          made ambiguous.
        - Marks are never deducted — only awarded.
        
        TYPES OF SUB-QUESTIONS AND HOW TO MARK THEM:
        
        [Define / Explain what is meant by...] (typically 2–3 marks)
        - Award marks for accurate definition of the concept (1 mark)
        - Award further marks for elaboration, qualification, or a correct example
        - The candidate must show understanding, not just name the term
        
        [Explain / Analyse...] (typically 4–6 marks)
        - Award marks for: identification of relevant point (1), explanation 
          of the mechanism or relationship (1), further developed consequence 
          or application to context (1)
        - Marks are typically structured in clusters of 2–3 per valid point
        - Require economic reasoning, not just description
        
        [Consider / Discuss / Assess...] (typically 6–8 marks)
        - Award marks for analysis of relevant factors/policies/effects
        - Require development beyond identification — the mechanism must 
          be explained
        - Award 1 additional mark for a supported conclusion where indicated
        - Do not award maximum marks without some form of evaluative comment 
          or conclusion
        
        [Using the data / figure / extract...] 
        - Require explicit reference to the stimulus material for full marks
        - Data must be used accurately and in context
        - Observations must be correctly interpreted — not just quoted
        
        MARK ALLOCATION GUIDANCE FOR SECTION A:
        - Each valid, distinct, developed point typically earns up to 3 marks
          (identification + explanation + consequence/application)
        - Do not award more marks than the sub-question maximum allows
        - Do not award the same mark twice for a point already credited, 
          even if restated differently (no mirror statements)
        
        =============================================================
        SECTION B — LEVELS-BASED MARKING RULES
        =============================================================
        
        Each essay is marked out of 20 marks total:
          AO1 + AO2 (Knowledge, Understanding & Analysis): out of 14 marks
          AO3 (Evaluation): out of 6 marks
        
        These are assessed and awarded SEPARATELY.
        
        ---
        TABLE A — AO1 Knowledge & Understanding + AO2 Analysis (out of 14)
        
        LEVEL 3 (11–14 marks) — Detailed and Developed
        Award Level 3 when the response:
        ✓ Shows detailed, accurate knowledge of relevant economic concepts 
          with clear explanations and appropriate examples
        ✓ Directly and fully addresses the specific requirements of the question 
          (not just the general topic)
        ✓ Develops analysis in depth — explains mechanisms, causes, effects, 
          and relationships using economic theory
        ✓ Makes accurate and relevant use of diagrams and/or formulae 
          where required, AND fully explains them in the written response
        ✓ Is well-organised, logical, and coherent throughout
        
          14 marks — Response CONVINCINGLY meets all Level 3 descriptors
          12–13 marks — Response ADEQUATELY meets Level 3 descriptors
          11 marks — Response JUST meets Level 3 descriptors
        
        LEVEL 2 (6–10 marks) — Partial and Limited
        Award Level 2 when the response:
        ✓ Shows knowledge of some relevant economic concepts but explanations 
          are limited, over-generalised, or contain inaccuracies
        ✓ Addresses the general theme of the question but with limited development
        ✓ Provides generally accurate analysis with some development but 
          lacks depth or detail
        ✓ Uses diagrams/formulae where required but they are partially accurate 
          or not fully explained in the written response
        ✓ Is generally logical but sometimes lacks focus or organisation
        
          10 marks — Response CONVINCINGLY meets Level 2 descriptors
          7–9 marks — Response ADEQUATELY meets Level 2 descriptors
          6 marks — Response JUST meets Level 2 descriptors
        
        ⚠️ DIAGRAM CAP RULE: If the question requires a diagram AND no 
        relevant diagram is provided, the response is CAPPED at Level 2 
        Maximum (10/14) for AO1/AO2, regardless of the quality of 
        written analysis.
        
        LEVEL 1 (1–5 marks) — Weak and Underdeveloped
        Award Level 1 when the response:
        ✓ Includes only a small number of relevant knowledge points
        ✓ Contains significant errors, omissions, or misunderstanding
        ✓ Has little direct relevance to the specific question asked
        ✓ Provides only descriptive or narrative writing with minimal analysis
        ✓ Diagrams, if present, contain significant errors or are irrelevant
        
          5 marks — Response CONVINCINGLY meets Level 1 descriptors
          2–4 marks — Response ADEQUATELY meets Level 1 descriptors
          1 mark — Response JUST meets Level 1 descriptors
        
        LEVEL 0 (0 marks): No creditable response.
        
        ---
        TABLE B — AO3 Evaluation (out of 6)
        
        Evaluation must go BEYOND analysis. It involves making reasoned 
        judgements, weighing evidence, recognising limitations, considering 
        conditions, and reaching supported conclusions.
        
        LEVEL 2 (4–6 marks) — Developed and Justified Evaluation
        Award Level 2 when the response:
        ✓ Provides a justified conclusion or judgement that directly addresses 
          the specific wording of the question (not a generic summary)
        ✓ Makes developed, reasoned evaluative comments supported by 
          economic argument — for example:
            - Considers conditions under which a conclusion holds or does not hold
            - Weighs competing arguments against each other
            - Distinguishes between short-run and long-run effects
            - Considers trade-offs between economic objectives
            - Identifies significant assumptions or limitations of the analysis
            - Assesses the relative importance or significance of factors discussed
        
          6 marks — Evaluation is CONVINCINGLY at Level 2
          5 marks — Evaluation ADEQUATELY meets Level 2
          4 marks — Evaluation JUST meets Level 2
        
        LEVEL 1 (1–3 marks) — Superficial Evaluation
        Award Level 1 when the response:
        ✓ Provides only a vague or general conclusion (e.g. "it depends on 
          the situation" with no further explanation)
        ✓ Makes simple evaluative comments that are asserted rather than 
          argued — no development and little supporting evidence
        ✓ Evaluative points feel bolted on rather than integrated into the argument
        
          3 marks — CONVINCINGLY at Level 1
          2 marks — ADEQUATELY at Level 1
          1 mark — JUST at Level 1
        
        LEVEL 0 (0 marks): No creditable response.
        
        ---
        WHAT GOOD EVALUATION LOOKS LIKE (apply to any question):
        
        Strong evaluative moves include:
        - "This policy will be more/less effective depending on [specific condition] 
          because..."
        - "In the short run... however in the long run..."
        - "This assumes [X], but in practice [Y] because..."
        - "While [argument A] suggests [conclusion], [argument B] suggests the 
          opposite is true when..."
        - "The most significant factor is [X] because... compared to [Y] which..."
        - A final conclusion that makes a definite, reasoned judgement on 
          the question — not a list of "on the one hand / on the other hand" 
          with no resolution
        
        Poor evaluation that should NOT receive Level 2:
        - Simply listing more analysis points and calling it evaluation
        - A one-sentence conclusion with no justification
        - "There are advantages and disadvantages" with no weighing
        - Repeating earlier analysis in different words
        
        =============================================================
        ASSESSMENT OBJECTIVES — REFERENCE GUIDE
        =============================================================
        
        AO1 — Knowledge and Understanding
        - Accurate recall of economic facts, definitions, formulae, concepts
        - Clear explanation of economic ideas with appropriate examples
        - Correct application of knowledge to the question context
        
        AO2 — Analysis
        - Examining economic issues using relevant theory and concepts
        - Explaining causes, effects, mechanisms, and relationships
        - Accurate use of diagrams, data, and formulae where relevant
        - Logical development of an economic argument
        
        AO3 — Evaluation
        - Recognising assumptions and limitations of models/arguments
        - Assessing the strength and weakness of economic arguments
        - Making reasoned judgements that account for priorities and 
          value judgements
        - Communicating a clear, justified conclusion
        
        =============================================================
        COMMON MARKING ERRORS TO AVOID
        =============================================================
        
        DO credit:
        - Answers worded differently from any mark scheme if they clearly 
          convey the same correct economic meaning
        - Valid alternative examples or policies not explicitly listed
        - Diagrams that are accurately drawn even if not perfectly labelled, 
          provided the economic meaning is clear
        - Analysis that goes beyond the syllabus if it is correct
        
        DO NOT credit:
        - Key terms used without demonstrated understanding
        - Points that contradict each other within the same answer
        - The same point restated in different words (repetition)
        - Descriptions of what a diagram shows without economic explanation
        - Conclusions that are asserted without any supporting argument
        """
        word_guide = "Subject to detailed Economics output format"
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
        
        CRITICAL SCORING INSTRUCTION:
        - EACH Assessment Objective (AO1, AO2, AO3) MUST be scored exactly out of 10.
        - Do NOT arbitrarily deduct marks. If a student's point is valid, factually accurate, and well-argued, award high marks even if it isn't specifically named in the marking scheme.
        - Add the three AO scores together to get the final score out of 30.
        """
        word_guide = "Subject to 100-200 word feedback limit"
    elif marks <= 4:
        # CALCULATION / SHORT ANSWER (non-business)
        rubric = f"""
        STRICT CALCULATION/SHORT ANSWER RUBRIC ({marks} MARKS):
        CRITICAL: Before grading, YOU must solve the calculation yourself using the case study data.
        Extract the numbers, apply the formula, compute the answer, then compare to the student's response.
        
        Instruction: 
        - If the final numerical answer is correct, award full marks ({marks}/{marks}).
        - If the final answer is incorrect, award 1 mark if the correct formula or method is shown in the working.
        - Accept reasonable rounding differences.
        """
        word_guide = "Show full working"
    else:
        rubric = f"Mark strictly according to standard Cambridge conventions for {marks} marks."
        word_guide = "Appropriate length"

    # 3. DETERMINE MODEL ANSWER INSTRUCTION
    if custom_model_instruction:
        model_answer_instruction = custom_model_instruction
    elif is_business_p4:
        # BUSINESS PAPER 4 MODEL ANSWER (SPECIFIC RUBRIC)
        model_answer_instruction = """<BUSINESS PAPER 4 MODEL ANSWER (7 PARAGRAPH STRUCTURE):
You are an expert Cambridge A Level Business (9609) examiner. Write a formal, evaluative essay response for Business Paper 4 in continuous prose targeting full marks. Do not use bullet points or subheadings. Do not label paragraphs with assessment objective codes. 
Your writing must naturally embed knowledge, application to the business context, analysis of causes/impacts/consequences, and evaluative judgement throughout. Write as a confident, well-prepared exam candidate.

CRITICAL FORMATTING REQUIREMENT: You MUST generate EXACTLY 7 distinct paragraphs, separated by blank lines.

Paragraph 1 – Introduction
Briefly define the key concept(s) in the question using precise business terminology. Introduce the business context and signal the line of argument your response will take. Do not simply repeat the question.

Paragraph 2 – Body Paragraph 1
Identify and explain a relevant business concept, theory or factor. Apply it directly and specifically to the business in the case study using evidence from the context provided. Analyse the cause-and-effect chain, exploring the impact or consequence of this factor on the business. End with a counter-argument or limitation to show balance.

Paragraph 3 – Body Paragraph 2
Identify and explain a second relevant concept or factor. Apply it specifically to the business context with reference to case detail. Analyse how this connects to the business's performance, objectives or strategy. Include a contrasting point or condition that qualifies the analysis.

Paragraph 4 – Body Paragraph 3
Identify and explain a third relevant concept or factor. Apply to the business context. Develop the analysis by exploring consequences for the business's strategy, stakeholders or outcomes. Balance with an alternative perspective or complicating factor.

Paragraph 5 – Body Paragraph 4
Identify and explain a fourth relevant concept or factor. Apply to the case. Analyse connections between causes, impacts and consequences at a developed level. Include a nuanced counter-point or condition.

Paragraph 6 – Other Factors / Wider Considerations
Evaluate additional factors that could influence the outcome of the strategy or decision discussed. Consider conditions under which the strategy may or may not succeed (e.g. market conditions, internal resources, competition, external environment, stakeholder response). This paragraph should demonstrate mature, contextualised judgement.

Paragraph 7 – Conclusion
Make a clear, justified overall judgement that directly answers the question. Draw together the key arguments from your response. Your conclusion must be supported by reasoning rooted in the business context — avoid generic or unsupported statements. Acknowledge that the outcome may depend on specific conditions or circumstances.
>"""
    elif is_business_p3:
        # BUSINESS PAPER 3 MODEL ANSWER WITH WORD LIMITS
        if marks <= 4:
            # CALCULATION QUESTIONS
            model_answer_instruction = f"""<CALCULATION MODEL ANSWER ({marks} marks):
You are an expert Cambridge A Level Business (9609) examiner. Produce a perfect calculation answer.

YOU MUST FOLLOW THESE STEPS EXACTLY:

1. EXTRACT DATA: Identify and list every relevant number from the case study or table.
   Write each value with a label, e.g. "Total revenue = $500,000", "Net cash flow Year 1 = $80,000".

2. STATE FORMULA: Write the standard Cambridge-accepted formula clearly.
   e.g. "ARR = (Average annual profit / Initial investment) × 100"
   e.g. "Payback period = Years before full recovery + (Remaining amount / Cash flow in recovery year)"

3. SUBSTITUTE: Show the formula with the extracted numbers plugged in.
   e.g. "ARR = ($60,000 / $300,000) × 100"

4. CALCULATE: Perform the arithmetic step by step. Show intermediate results.
   DOUBLE-CHECK every calculation. If there are multiple steps, show each one.
   e.g. "= 0.2 × 100 = 20%"

5. FINAL ANSWER: State the result clearly with correct units.
   e.g. "ARR = 20%" or "Payback period = 2 years and 6 months"

CRITICAL RULES:
- Extract data ONLY from the case study provided. Do NOT invent numbers.
- If data is in a table, reference the table explicitly.
- Show ALL working — marks are awarded for method even if the final answer has a rounding error.
- Write in PLAIN TEXT only. No markdown, no bold, no bullet points.
- Separate steps with blank lines.
- Output ONLY the calculation answer, nothing else.>"""
        elif marks == 8:
            # 8-MARK ANALYSIS (PEEL STRUCTURE)
            model_answer_instruction = """<8-MARK MODEL ANSWER (A* STUDENT RESPONSE):
You are an expert Cambridge A Level Business (9609) examiner. Write a model answer for the question below, targeting full marks. Follow these rules strictly:

STRUCTURE RULES:
- Exactly 2 PEEL paragraphs.
- No introduction, no conclusion, no evaluation.

AO REQUIREMENTS (in this order — do NOT skip steps):
[AO1 – Knowledge] Define the key concept(s) relevant to the question in 1–2 sentences.
[AO2 – Application] Link every point explicitly to the case study. Use specific data, names, dates, or events. Do NOT copy the case — interpret and apply it.
[AO3 – Analysis] Build a full chain of reasoning for each point: cause → impact → consequence. Aim for at least 2 links in the chain per paragraph.

PEEL PARAGRAPH FORMAT:
P – State the concept/strategy
E – Define/develop it (AO1)
E – Apply to the case with specific evidence (AO2)
L – Analyse the chain of cause → impact → consequence (AO3)

CRITICAL RULES:
- No AO2/AO3 marks without AO1 first.
- Do NOT copy case study text verbatim.
- Write in PLAIN TEXT only. Do NOT use any markdown, bold, italics, headings, bullet points, or asterisks.
- Separate paragraphs with a blank line.
- Output ONLY the candidate response, nothing else.>"""
        elif marks == 12:
            # 12-MARK EVALUATION (PEEL STRUCTURE)
            model_answer_instruction = """<12-MARK MODEL ANSWER (A* STUDENT RESPONSE):
You are an expert Cambridge A Level Business (9609) examiner. Write a model answer for the question below, targeting full marks. Follow these rules strictly:

STRUCTURE RULES:
- 2–3 PEEL paragraphs + 1 evaluation paragraph.

AO REQUIREMENTS (in this order — do NOT skip steps):
[AO1 – Knowledge] Define the key concept(s) relevant to the question in 1–2 sentences.
[AO2 – Application] Link every point explicitly to the case study. Use specific data, names, dates, or events. Do NOT copy the case — interpret and apply it.
[AO3 – Analysis] Build a full chain of reasoning for each point: cause → impact → consequence. Aim for at least 2 links in the chain per paragraph.
[AO4 – Evaluation] Argue one side, then the other. Use qualifiers: "this depends on…", "the extent to which…". Conclude with a specific, supported verdict tied to the business in the case. Must reference context to reach Level 3.

PEEL PARAGRAPH FORMAT:
P – State the concept/strategy
E – Define/develop it (AO1)
E – Apply to the case with specific evidence (AO2)
L – Analyse the chain of cause → impact → consequence (AO3)
[Evaluation Paragraph at the end for AO4]

CRITICAL RULES:
- No AO2/AO3/AO4 marks without AO1 first.
- Do NOT copy case study text verbatim.
- Evaluation must name the business and reference case data.
- Write in PLAIN TEXT only. Do NOT use any markdown, bold, italics, headings, bullet points, or asterisks.
- Separate paragraphs with a blank line.
- Output ONLY the candidate response, nothing else.>"""
        elif marks == 20:
            # THIS IS A FALLBACK IN CASE P3 HAS 20 MARKER (HIGHLY UNLIKELY BUT KEPT FOR SAFETY)
            model_answer_instruction = """<20-MARK STRATEGY MODEL ANSWER (A* STUDENT RESPONSE):
You are an expert Cambridge A Level Business (9609) examiner. Write a model answer for the question below, targeting full marks. Follow these rules strictly:

STRUCTURE RULES:
- 4–5 PEEL paragraphs + 1 conclusion paragraph.

AO REQUIREMENTS (in this order — do NOT skip steps):
[AO1 – Knowledge] Define AND develop the meaning of key concepts in 2-3 sentences (up to 3 marks).
[AO2 – Application] Link every point explicitly to the case study. Use specific data, names, dates, or events. Do NOT copy the case — interpret and apply it.
[AO3 – Analysis] Build integrated chains of reasoning: cause → impact → consequence. Aim for developed analysis with multiple links.
[AO4 – Evaluation] Balanced argument (one side vs other). Use qualifiers: "this depends on…", "the extent to which…". Conclude with a specific, supported verdict tied to the business. Must reference context to reach Level 3.

PEEL PARAGRAPH FORMAT:
P – State the concept/strategy
E – Define/develop it (AO1)
E – Apply to the case with specific evidence (AO2)
L – Analyse the chain of cause → impact → consequence (AO3) [Include brief evaluative links where appropriate]
[Conclusion Paragraph at the end for AO4]

CRITICAL RULES:
- No AO marks without AO1 first.
- Do NOT copy case study text verbatim.
- Final evaluation must name the business and reference case data.
- Write in PLAIN TEXT only. Do NOT use any markdown, bold, italics, headings, bullet points, or asterisks.
- Separate paragraphs with a blank line.
- Output ONLY the candidate response, nothing else.>"""
        else:
            model_answer_instruction = f"<Write a perfect A* model answer ({marks} marks). Continuous prose, no bullets, fully applied to the case.>"
    elif is_economics_p4:
        if marks <= 8:
            model_answer_instruction = f"""<INSTRUCTION: You must GENERATE a perfect Economics Paper 4 Model Answer ({marks} marks).
You are an expert Cambridge International A Level Economics teacher writing a flawless model response. 
Your generated answer must reflect what a top-scoring candidate would write under exam conditions.

MARKS AVAILABLE: {marks}
QUESTION TYPE: Short Answer / Point-Based

Follow these strict rules for generating your answer:

1. DEFINITIONS (if asked):
   - Open with a precise, technically correct definition.
   - Follow immediately with a clear elaboration or qualification.
   - Include a brief, accurate example if helpful.
   - 2 marks: 2-3 sentences. No padding.

2. EXPLANATIONS (if asked to explain/analyse):
   - Identify the relevant economic concept clearly.
   - Explain the mechanism: why and how it works.
   - Develop the consequence: what happens as a result, and to whom.
   - Target length: 1 developed point per 2-3 marks available.

3. DISCUSSIONS (if asked to consider/discuss/assess):
   - Cover all aspects demanded by the question.
   - Identify -> Explain Mechanism -> Develop Consequence for each point.
   - Include a brief evaluative comment.
   - End with a clear conclusion answering the question.

Do NOT simply summarize the case study, but you MUST refer back to the specific context and data provided in the case study for Application marks.
Use formal, precise economic language.
CRITICAL: DO NOT copy these instructions into the output. You must strictly output ONLY the newly generated text answering the specific question above.>"""
        else:
            model_answer_instruction = f"""<INSTRUCTION: You must GENERATE a perfect Economics Paper 4 Model Essay ({marks} marks).
You are an expert Cambridge International A Level Economics teacher writing a flawless model response. 
Your generated answer must reflect what a top-scoring candidate would write under exam conditions.

MARKS AVAILABLE: {marks}
QUESTION TYPE: Extended Essay (Levels-Based)
TARGET LENGTH: Approx 600-900 words, 6-8 paragraphs.

You MUST structure your GENERATED essay exactly as follows:

1. INTRODUCTION (2-4 sentences max):
   - Define all key terms in the question precisely.
   - Briefly signpost what the essay will cover.
   - Directly engage with the specific question immediately.

2. ANALYSIS SECTION (3-4 distinct paragraphs):
   - Each paragraph must: State concept -> Explain mechanism -> Develop consequence -> Support with diagram OR example.
   - Diagram rules: If relevant, describe diagrams fully: Axes, Curves (shape/direction), Intersections, Shifts (and why), Areas shaded, Conclusion drawn from diagram.
   - Connect every paragraph back to the question.

3. EVALUATION SECTION (2-3 distinct paragraphs):
   - Challenge, qualify, or add conditions to analytical points.
   - Explain WHY it matters to the conclusion.
   - Use evaluative moves: Short-run vs Long-run, trade-offs, assumptions/limitations, relative significance of factors.
   - Do NOT just list opposites; weigh them.

4. CONCLUSION (3-5 sentences):
   - Make a definite, reasoned judgement answering the specific question.
   - Start with "Overall...", "On balance...", or "The evidence suggests...".
   - Support with preceding arguments.

Use precise terminology (e.g., "allocative efficiency", "PED").
Use causal connectives ("therefore", "consequently").
CRITICAL: DO NOT copy these instructions into the output. You must strictly output ONLY the newly generated essay text answering the specific question above.>"""
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
            f"\n"
            f"*** ABSOLUTE WORD COUNT REQUIREMENT ***\n"
            f"The model answer MUST be EXACTLY between 600 and 700 words. This is a NON-NEGOTIABLE hard limit.\n"
            f"- MINIMUM: 600 words. Anything below 600 words is UNACCEPTABLE and a FAILURE.\n"
            f"- MAXIMUM: 700 words. Anything above 700 words is UNACCEPTABLE and a FAILURE.\n"
            f"- You MUST mentally count your words as you write. Before finalising, verify the total word count falls within 600-700.\n"
            f"- If you are under 600 words, you MUST expand your arguments with more depth, examples, and analysis until you reach at least 600.\n"
            f"- If you are over 700 words, you MUST trim unnecessary elaboration until you are at or below 700.\n"
            f"\n"
            f"- MANDATORY Structure and Paragraph Constraints (to ensure length and depth):\n"
            f"  * Introduction: Minimum 5 detailed sentences (define key terms, establish your thesis, signal argument direction).\n"
            f"  * Body Paragraphs 1 to 4: EACH MUST be highly verbose and elaborative. Minimum 8 to 10 long, highly detailed sentences per paragraph. You MUST include at least TWO specific, deeply analyzed examples per paragraph. Do not be concise; elaborate deeply on every point.\n"
            f"  * Conclusion: Minimum 5 sentences summarizing the nuanced judgement.\n"
            f"- Word Count Target: Ensure you write abundantly to hit the 600-700 word mark by fulfilling the heavy sentence constraints above.\n"
            f"  TOTAL TARGET: ~640 words minimum to score well.\n"
            f"\n"
            f"- Must demonstrate: Sophisticated question interpretation, deeply expanded analytical thinking, evaluative thinking, extremely specific credible examples. DO NOT be concise.\n"
            f"- Argument Balance: You MUST provide a balanced, two-sided evaluation. Develop counter-arguments seriously and in-depth. Do not provide a one-sided list. Your conclusion MUST reflect a nuanced, weighed judgement rather than just a reinforcement of an opening thesis.\n"
            f"- Writing Style (CRITICAL): The tone must NOT sound like an AI. It must sound like a high-level high school student. The language should be human-like and not overly complex or artificially sophisticated. It is perfectly fine to use standard connectors like 'Furthermore' or 'In conclusion' when needed, but keep the overall style accessible and authentic. Use varied sentence lengths, descriptive imagery, natural transitions, and personal/observational anecdotes where appropriate. Mimic the cadence of a thoughtful student who connects abstract ideas to tangible, lived experiences.\n"
            f"Here is a direct example of the exact writing style and tone you MUST emulate:\n"
            f"\"After a 5 minute scooty ride, I finally arrive at the gate of Lee's club. Taking off the helmet I see my friends already in that circular formation around the indoor badminton court, cheering vociferously for Satyaki in a match against Sobuj. Looks like there's a tournament going on. And I am late.\\n\\n"
            f"I walk inside the indoor court. It is a hall tall enough to fit a two story house, with a floor large enough to hide 12 large trucks. Yet, as the matches heat up, the hall almost narrows down to the one little badminton court, which becomes the centre of everyone's attention. There are half a dozen chairs lined up beside the court, premium tickets for only the most punctual. Up above the strong fluorescent lights, we can see the tin roof, surprisingly durable and water-proof even during the stormiest nights- providing us, on many occasions, a safe haven against the bad monsoon weather.\\n\\n"
            f"Far away on the other corner lay a TT table, its deteriorating conditions almost giving it a pitiable appearance- with its own set of empty chairs that begged for attention. For now though they were occupied by few of the disinterested chatterers, who just came to the club to socialise and relax. I decided to step out to get a breath of fresh air- the place, though special in many ways, always gave us a mildly stifling feeling accentuated by the daunting echoes of loud cheering from the circle at the court.\\n\\n"
            f"Across the sliding metal gate was the place where we parked our cycles and our bags full of accessories and outer jackets- some simple wrist watches while some fitbits, some cheap bicycles while some with gears fitted on them. It was almost as if this pristine and protected hub of the batch of 2025-26 boys required you to strip off all your status symbols before stepping in- with only your popularity and your sporting abilities defining your quality of time here.\\n\\n"
            f"This place was protected and private, away from the snooping eyes of our parents and teachers, our very 'den'- or the 'hub of indiscipline', as our school authorities would say. Numerous 'festivals' have been held here by our gang, on dates that mean nothing on a normal calendar, just occasions when school and academic lives grow tiring and we all decide a evening's worth of break. Cold-drinks and fast-food flood into the club, funded by the rich boys and fetched by younger boys eager for an excuse to ride their unlicensed scooties. Musically gifted boys haul in their guitars and amplifiers and play rock music while the hall transforms into a nightclub, with torches flickered in perfect sync with the beats to emulate disco lights.\\n\\n"
            f"Yes, it is this place that I love the most. This is the place that never fails to intoxicate me with a potent solution of liberty and power- a sense of collective invinciblity that will be a part of our teenage memories, a page with a turned corner that we will all revisit from time to time.\"\n"
            f"- Follow the 'Discuss', 'Evaluate', or 'Country-Specific' template as appropriate.\n"
            f"- Write in PLAIN TEXT only. No markdown, bold, bullets, or special characters.\n"
            f"- CRITICAL REQUIREMENT (MARKING SCHEME ADHERENCE): You MUST construct your entire argument using EXACTLY the points, evidence, and perspectives listed in the Marking Scheme provided above. DO NOT invent random generic arguments. If the question refers to specific texts (e.g., Essay Paper 12), you MUST analyze those exact texts as specified in the marking scheme. Do not wander off-topic.\n"
            f"- Ensure the answer would score Level 5 (25-30 marks) across all AOs.\n"
            f"\n"
            f"*** FINAL REMINDER: YOUR MODEL ANSWER MUST BE 600-700 WORDS. NOT 400. NOT 500. NOT 800. EXACTLY 600-700. COUNT YOUR WORDS. ***>"
        ) if is_general_paper else (
            f"<Write a perfect A* model answer ({word_guide}) that would score FULL MARKS.\\n"
            f"The answer MUST be a standalone continuous prose candidate response. DO NOT use bullet points, headings, bold text, or explicit Assessment Objective labels (like 'AO1' or 'Definition:').\\n"
            f"It MUST follow standard A-Level Essay structure with proper paragraph breaks.\\n"
            f"IMPORTANT: If the question involves data, calculate ratios/figures IN THE BACKGROUND first.\\n"
            f"Your essay should naturally embed:\\n"
            f"- Precise definition of terms.\\n"
            f"- Specific facts/figures applied from the case.\\n"
            f"- Developed chains of argument (Point -> Evidence -> Explanation + Connectors).\\n"
            f"- A balanced conclusion with short/long term view.\\n"
            f"CRITICAL: The model answer must read exactly like a perfect student essay. DO NOT mention the student.> "
        )

    # 4. DETERMINE FEEDBACK STRUCTURE
    if custom_feedback_structure:
        feedback_structure = custom_feedback_structure
    elif is_economics_p4:
        feedback_structure = """
    For every question or sub-question marked, provide your output 
    in the following structured format inside the 'detailed_critique' string:
    
    ---
    QUESTION [number/letter]:
    
    SECTION A (point-based) format:
    Points awarded:
      [Mark] — [Brief justification for awarding or not awarding the mark]
      [Mark] — [Brief justification]
      ... (continue for all marks available)
    
    Total awarded: [X] / [maximum marks]
    
    Examiner comment: [2–3 sentences summarising overall quality, 
    noting key strengths, and explaining what would be needed to 
    score higher if applicable]
    
    ---
    SECTION B (levels-based) format:
    AO1/AO2 Assessment:
      Level awarded: [1 / 2 / 3]
      Mark: [X] / 14
      Justification: [2–3 sentences explaining why this level and 
      specific mark was awarded, referencing level descriptors]
      Diagram: [Present and accurate / Present but incomplete / 
      Absent — cap applied]
    
    AO3 Assessment:
      Level awarded: [1 / 2]
      Mark: [X] / 6
      Justification: [2–3 sentences explaining the evaluation quality, 
      noting whether the conclusion was justified and specific]
    
    Total: [X] / 20
    
    Examiner comment: [2–3 sentences on overall essay quality — 
    what distinguished this response, and what would be needed 
    to reach the next level]
    ---
    """
    elif is_general_paper:
        feedback_structure = """
    You must output your final grading using the following structure for the 'detailed_critique' field.
    IMPORTANT: The feedback MUST be highly contextual to the student's actual writing. Do not provide generic advice. Quote or reference specific sentences they wrote when explaining the pros and cons.
    MAXIMUM 200-250 WORDS TOTAL for the entire feedback section.
    
    Structure:
    1. Final Score: [X]/30
    2. Assessment Objective Breakdown:
       - AO1 (Selection & Application): [X]/10
       - AO2 (Analysis & Evaluation): [X]/10
       - AO3 (Communication): [X]/10
    3. Comprehensive Examiner Report:
       - Grade Equivalence: [Distinction/Credit/Pass/Fail]
       - Overall Assessment: [One sentence verdict based on their specific arguments]
       - Strengths (Pros): [Detail exact concepts they explained well or evidence they used effectively. Quote them.]
       - Nuance & Creativity: [If they used examples outside the marking scheme that were factually correct, praise them here and note the marks awarded. If not, note how they could have expanded creatively.]
       - Shortcomings (Cons): [Pinpoint exactly where their logic failed, was too vague, or lacked specific examples. Quote the weak parts.]
       - Actionable Fixes: [Provide 1-2 specific ways they could have rewritten their weak points to score higher. Give an example of a stronger sentence they could have used.]
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
    4. ZERO TOLERANCE FOR GIBBERISH/NON-ANSWERS: If the student answer is extremely short (e.g., just a few letters like "mm"), mostly blank, or contains no meaningful academic content related to the question, you MUST award 0 marks for all AOs and a total score of 0. Do NOT hallucinate a score or positive feedback for garbage input.

    OUTPUT FORMAT REQUIREMENT:
    {feedback_structure}

    4. MODEL ANSWER INSTRUCTION:
    YOU MUST strictly follow the format below for generating the model answer:
    {model_answer_instruction}

    OUTPUT FORMAT (JSON ONLY):
    {{
        "score": <total_score_int>,
        {('"ao1": <AO1_Selection_and_Application_score_out_of_10>, "ao2": <AO2_Analysis_and_Evaluation_score_out_of_10>, "ao3": <AO3_Communication_score_out_of_10>, "ao4": 0,' if is_general_paper else '"ao1": <score_int>, "ao2": <score_int>, "ao3": <score_int>, "ao4": <score_int>,')}
        "detailed_critique": "<Markdown string that MUST START with '1. Final Score:...' and '2. Assessment Objective Breakdown:...' followed by the report.>",
        "model_answer": "<The generated A* model answer string based on the instruction above>"
    }}
    {('CRITICAL ALGORITHMIC RULE FOR GENERAL PAPER SCORING:\n'
      '1. Determine the TOTAL holistic score out of 30 FIRST (e.g., 16).\n'
      '2. You MUST mathematically divide this exact total across ao1, ao2, and ao3 (maximum 10 each).\n'
      '3. THE SUM OF ao1 + ao2 + ao3 MUST EXACTLY EQUAL THE TOTAL SCORE. Double check your math. (e.g., if total is 16, AOs must be 5, 5, 6). ao4 must always be 0.' if is_general_paper else '')}
    """
    
    # Use GPT-4o Mini for all marking
    logger.info(f"📝 Processing with GPT-4o Mini... (Prompt length: {len(user_prompt)})")
    text = generate_with_gpt(system_prompt, user_prompt)
    
    if text:
        cleaned_text = text.replace('```json', '').replace('```', '').strip()
        try:
            data = json.loads(cleaned_text)
            
            # Ensure model_answer and detailed_critique exist (Critical for General Paper)
            if 'model_answer' not in data or not data['model_answer'] or data['model_answer'].strip() == '':
                # ---- FALLBACK: Dedicated second API call for model answer ----
                logger.warning("⚠️ Model answer missing from grading response. Making dedicated call...")
                try:
                    safe_case_study = str(case_study_text) if case_study_text else ""
                    ma_prompt = f"""
                    QUESTION: {question_text}
                    
                    CASE STUDY / CONTEXT:
                    {safe_case_study[:3000]}
                    
                    MARKING SCHEME / GROUND TRUTH:
                    {marking_scheme_text if marking_scheme_text else "None provided."}
                    
                    INSTRUCTION:
                    YOU MUST strictly follow the exact paragraph structure and rules below:
                    {model_answer_instruction}
                    
                    OUTPUT FORMAT (JSON ONLY):
                    {{"model_answer": "<Your complete model answer here>"}}
                    """
                    ma_response = generate_with_gpt(
                        "You are a Cambridge International A-Level expert. Generate a perfect model answer. Output valid JSON only.",
                        ma_prompt
                    )
                    if ma_response:
                        ma_data = json.loads(ma_response.replace('```json', '').replace('```', '').strip())
                        if ma_data.get('model_answer'):
                            data['model_answer'] = ma_data['model_answer']
                            logger.info("✅ Model answer generated via fallback call")
                        else:
                            data['model_answer'] = "Model answer not generated. Please retry."
                    else:
                        data['model_answer'] = "Model answer not generated. Please retry."
                except Exception as ma_err:
                    logger.error(f"❌ Fallback model answer call failed: {ma_err}")
                    data['model_answer'] = "Model answer not generated. Please retry."
                    
            if 'detailed_critique' not in data or not data['detailed_critique']:
                data['detailed_critique'] = "Feedback not generated."
            
            # Ensure score fields exist with safe defaults
            data.setdefault('score', 0)
            data.setdefault('ao1', 0)
            data.setdefault('ao2', 0)
            data.setdefault('ao3', 0)
            data.setdefault('ao4', 0)
                
            return jsonify(data), 200
        except json.JSONDecodeError:
            logger.error(f"❌ JSON Decode Error: {cleaned_text[:500]}")
            
            # Attempt to extract model_answer from raw text using regex fallback
            import re
            model_answer_match = re.search(r'"model_answer"\s*:\s*"((?:[^"\\]|\\.)*)"', cleaned_text, re.DOTALL)
            extracted_model = model_answer_match.group(1) if model_answer_match else "Error generating model answer."
            
            return jsonify({
                "score": 0,
                "ao1": 0, "ao2": 0, "ao3": 0, "ao4": 0,
                "detailed_critique": "Error: AI response was not valid JSON. Please try again.",
                "model_answer": extracted_model,
                "raw_response": cleaned_text[:500]
            }), 200
    else:
        logger.error("❌ GPT-4o Mini returned no response after all retries")
        return jsonify({
            "score": 0,
            "ao1": 0, "ao2": 0, "ao3": 0, "ao4": 0,
            "detailed_critique": "Server error: AI failed to respond after multiple attempts. Please try again.",
            "model_answer": "Model answer could not be generated. Please retry."
        }), 200


# ==========================================
# VOCAB/IDIOM AI EXAMPLE + SYNONYMS ENDPOINT
# ==========================================
@app.route('/vocab-ai', methods=['POST'])
def vocab_ai():
    if not OPENAI_API_KEY:
        return jsonify({"example": "Example unavailable (API not configured).", "synonyms": []}), 200

    data = request.json
    word = data.get('word', '')
    word_type = data.get('type', 'vocabulary')  # 'vocabulary' or 'idiom'

    if not word:
        return jsonify({"example": "No word provided.", "synonyms": []}), 200

    try:
        if word_type == 'idiom':
            prompt = (
                f'For the idiom "{word}":\n'
                f'1. Write ONE clear example sentence showing its correct usage in standard English.\n'
                f'2. List 2-3 similar common idioms or phrases with the same meaning.\n'
                f'Reply in JSON: {{"example": "...", "synonyms": ["...", "..."]}}'
            )
        else:
            prompt = (
                f'For the word "{word}":\n'
                f'1. Write ONE clear example sentence showing its correct usage in standard English.\n'
                f'2. List 2-3 common synonyms that a student could use to remember this word.\n'
                f'Reply in JSON: {{"example": "...", "synonyms": ["...", "..."]}}'
            )

        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful English language assistant. Reply ONLY with valid JSON, nothing else."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )

        text = response.choices[0].message.content.strip()
        cleaned = text.replace('```json', '').replace('```', '').strip()
        result = json.loads(cleaned)
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Vocab AI error: {e}")
        return jsonify({"example": "Example unavailable.", "synonyms": []}), 200

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


# ---------------------------------------------------------
# SWOT ANALYSIS ENDPOINT
# ---------------------------------------------------------
@app.route('/swot-analysis', methods=['POST'])
def swot_analysis():
    if not OPENAI_API_KEY:
        return jsonify({"error": "API Key Missing"}), 503

    try:
        data = request.json
        subject = data.get('subject', 'General')
        paper = data.get('paper', 'General') # e.g. "Paper 3"
        performance_data = data.get('performance_data', {})
        
        # Construct prompt for the AI
        papers_analyzed = performance_data.get('papers_analyzed', 'multiple')
        
        system_prompt = f"""
        You are an expert Cambridge International A-Level Academic Counselor.
        Your task is to perform a detailed SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) for a student.
        
        This analysis is specifically based on the student's performance across the {papers_analyzed} past paper(s) they have attempted for {subject} {paper}.
        The strengths, weaknesses, threats, and opportunities demonstrated in these exact {papers_analyzed} papers MUST be combined and summarized in your response.

        DATA PROVIDED:
        - Number of papers analyzed: {papers_analyzed}
        - Total questions attempted.
        - Average overall score.
        - Detailed examiner critiques directly from the user's attempted papers.
        - Trend of past scores.

        OUTPUT FORMAT (JSON ONLY):
        {{
            "strengths": ["point 1 based on the {papers_analyzed} papers", "point 2", ...],
            "weaknesses": ["point 1 demonstrated in these papers", "point 2", ...],
            "opportunities": ["Actionable advice 1", "advice 2", ...],
            "threats": ["Risk factor 1", "risk 2", ...]
        }}

        Keep points concise, actionable, and encouraging but realistic. Focus on academic skills (Analysis, Evaluation, Knowledge) and exam technique.
        IMPORTANT: Your language MUST reflect that this analysis is an aggregate look across the {papers_analyzed} paper(s) provided.
        """

        user_prompt = f"""
        Student Performance Data:
        {json.dumps(performance_data, indent=2)}
        """

        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        return jsonify(json.loads(content))

    except Exception as e:
        logger.error(f"SWOT Analysis Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
