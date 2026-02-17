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
        # USER-SPECIFIED RUBRIC FOR BUSINESS P3
        # USER-SPECIFIED GLOBAL MARKING COMMANDS FOR BUSINESS P3
        rubric = """
        GLOBAL MARKING COMMANDS
        AWARD marks using positive marking only.
        DO NOT deduct marks for wrong statements.
        AWARD marks only for correct, relevant, syllabus-based content.
        IGNORE spelling and grammar if meaning is clear.
        DO NOT award marks for:
        - vague statements
        - unclear ideas
        - repetition of the same point
        - contradictory points
        - “list dumping” without explanation

        USE whole marks only.
        ACCEPT valid alternative answers not written in the mark scheme.

        POINT-BASED QUESTION COMMANDS
        FOR each mark point:
        AWARD 1 mark if the point is:
        - correct
        - explained (not just named)
        - relevant to the question.
        DO NOT award marks for keywords without explanation.
        IF multiple similar points appear:
        MARK only the best instance.

        CALCULATION QUESTION COMMANDS
        AWARD marks step-by-step as per method shown.
        IF final answer is correct:
        AWARD full marks even if no working is shown (unless the question explicitly requires working).
        APPLY own-figure rule:
        IF a candidate uses an earlier wrong figure correctly in a valid method:
        AWARD full method marks.
        ACCEPT alternative correct methods and award equivalent marks.

        EXTENDED / EVALUATION QUESTION – MASTER COMMAND
        SPLIT the answer into assessment objectives:
        AO1 – Knowledge
        AO2 – Application
        AO3 – Analysis
        AO4 – Evaluation

        AO1 – KNOWLEDGE COMMANDS
        AWARD 2 marks if:
        - business terms are correct AND
        - concepts are explained accurately.
        AWARD 1 mark if:
        - knowledge is present but weak or partial.
        AWARD 0 marks if:
        - no relevant business knowledge.

        AO2 – APPLICATION COMMANDS
        AWARD 2 marks if:
        - the answer clearly links to the given case AND
        - uses specific case information more than once.
        AWARD 1 mark if:
        - only one basic or superficial case reference is made.
        AWARD 0 marks if:
        - the answer is generic with no case reference.

        AO3 – ANALYSIS COMMANDS
        DEFINE analysis as: cause -> effect -> business consequence.
        AWARD 2 marks if:
        - two or more logical links are developed.
        AWARD 1 mark if:
        - only one logical link is shown.
        AWARD 0 marks if:
        - the answer is descriptive only.

        AO4 – EVALUATION COMMANDS
        5–6 marks
        AWARD ONLY if ALL conditions are met:
        - a clear judgement is stated,
        - the judgement is justified,
        - advantages and limitations are considered,
        - the judgement is contextualised to the case.
        3–4 marks
        AWARD if:
        - judgement is present and supported,
        - some balance is shown,
        - but context is weak or generic.
        1–2 marks
        AWARD if:
        - judgement is present,
        - justification is weak or undeveloped.
        0 marks
        AWARD if:
        - no judgement or evaluative comment is present.

        LEVEL-BASED DECISION COMMAND
        SELECT the level using best-fit.
        THEN choose mark position:
        bottom of band -> just meets the level
        middle of band -> adequately meets the level
        top of band -> convincingly meets the level

        CONTENT SELECTION COMMAND
        IF the question asks for a limited number of points (e.g. one advantage and one disadvantage):
        MARK only the required number of best points.

        INTERNAL TAGGING COMMAND (FOR YOUR AI)
        TAG each meaningful clause as:
        K -> AO1 (knowledge)
        APP -> AO2 (application)
        AN -> AO3 (analysis)
        E -> AO4 (evaluation)

        FINAL SCORING WORKFLOW COMMAND
        REMOVE vague, repeated and contradictory statements.
        TAG remaining content into AO1, AO2, AO3, AO4.
        SCORE AO1, AO2, AO3 using 0–2 rules.
        SCORE AO4 using level rules.
        APPLY best-fit across the whole answer.
        OUTPUT whole marks only.
        """
        
        word_guide = "Refer to Global Marking Commands"
    elif is_business_p4:
        # USER-SPECIFIED GLOBAL MARKING COMMANDS FOR BUSINESS P4
        rubric = """
        GLOBAL MARKING COMMANDS (APPLY TO ALL QUESTIONS)
        MARK using positive marking only.
        DO NOT deduct marks for:
        - spelling
        - grammar
        - weak structure.

        AWARD marks only for:
        - correct
        - relevant
        - syllabus-based business content.
        IGNORE irrelevant material.

        DO NOT reward:
        - vague statements,
        - narrative copying from the case,
        - repetition of the same idea.

        ACCEPT valid alternative business arguments.
        USE whole marks only.
        IF a statement is unclear -> DO NOT award marks.

        STRUCTURE OF PAPER 4 MARKING
        For every 20-mark question:
        You MUST mark using four assessment objectives:
        AO1 – Knowledge and understanding
        AO2 – Application to the case
        AO3 – Analysis
        AO4 – Evaluation

        Standard weighting used in Paper 4:
        AO1 -> max 3 marks
        AO2 -> max 2 marks
        AO3 -> max 8 marks
        AO4 -> max 7 marks

        AO1 – KNOWLEDGE & UNDERSTANDING (max 3)
        COMMANDS
        AWARD 1 mark
        -> limited but correct business knowledge.
        AWARD 2–3 marks
        -> clear and developed understanding of relevant business concepts.
        AWARD 0 marks
        -> no valid business knowledge.

        AO1 must be:
        - accurate,
        - correctly used,
        - clearly explained.

        Do NOT reward:
        - copying of the case,
        - naming terms without explanation.

        AO2 – APPLICATION TO THE CASE (max 2)
        COMMANDS
        AWARD marks ONLY if the answer:
        - is clearly rooted in the given business,
        - uses case facts correctly.

        AWARD 2 marks
        -> developed and consistent application to the case.
        AWARD 1 mark
        -> limited or one-off application.
        AWARD 0 marks
        -> generic answer.

        Valid application includes:
        - referring to the specific firm,
        - using its strategy, size, market, employees, competitors, finances, time period, or constraints.

        AO3 – ANALYSIS (max 8)
        COMMAND – definition of analysis
        Analysis means: cause -> effect -> business consequence

        AO3 LEVEL COMMANDS
        Level 1 – 1 to 3 marks
        - limited causal explanation,
        - simple links only.
        Level 2 – 4 to 6 marks
        - developed chains of reasoning,
        - several linked effects,
        - good depth on some issues.
        Level 3 – 7 to 8 marks
        - integrated and strategic analysis,
        - links several issues together,
        - shows impact on overall business performance or strategy.

        AO3 must show:
        - how a decision works,
        - why it leads to outcomes,
        - how it affects objectives such as: revenue, profit, competitiveness, brand, productivity, growth, long-term survival.

        AO4 – EVALUATION (max 7)
        COMMAND – evaluation is only valid if it contains:
        - a judgement,
        - justification,
        - balance,
        - business context.

        AO4 LEVEL COMMANDS
        Level 1 – 1 to 2 marks
        - simple judgement,
        - weak or unsupported evaluation.
        Level 2 – 3 to 5 marks
        - developed judgement,
        - some balance,
        - some contextual support.
        Level 3 – 6 to 7 marks
        - well-reasoned and balanced evaluation,
        - clear conclusion,
        - judgement clearly rooted in the case business.

        AO4 must normally include:
        - “depends on” arguments,
        - limitations of the strategy,
        - alternative options,
        - realistic constraints such as: finance, staff, competition, market conditions, implementation issues.

        FINAL MARK DECISION COMMAND
        For each answer:
        IDENTIFY AO1, AO2, AO3, AO4 content.
        SCORE AO1 out of 3.
        SCORE AO2 out of 2.
        SCORE AO3 using its three levels (max 8).
        SCORE AO4 using its three levels (max 7).

        USE best-fit within each level:
        just meets -> bottom of band
        adequately meets -> middle
        convincingly meets -> top

        FINAL MARK = AO1 + AO2 + AO3 + AO4.

        INTERNAL TAGGING COMMAND (FOR YOUR AI ENGINE)
        Tag each meaningful clause as:
        K -> AO1
        APP -> AO2
        AN -> AO3
        E -> AO4
        """
        word_guide = "Refer to Global Marking Commands (P4)"
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
    else:
        # Updated user prompt with strict calculation and A* essay instructions
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
            f"🔴 GLOBAL GENERATION COMMANDS\n"
            f"GENERATE a response that would clearly reach the top level band of the mark scheme.\n"
            f"WRITE in formal academic business style, clear simple sentences, no unnecessary jargon.\n"
            f"NEVER write as bullet points. NEVER write headings inside the answer. ALWAYS write in full paragraphs.\n"
            f"ALWAYS use the case business name where relevant. DO NOT copy or restate large parts of the case.\n"
            f"DO NOT write definitions as isolated sentences. DO NOT include examiner language.\n\n"
            
            f"🧠 STRUCTURAL COMMANDS (MANDATORY)\n"
            f"Your model answer MUST follow this structure:\n\n"
            
            f"PARAGRAPH 1 – Focused introduction\n"
            f"DIRECTLY address the command word. SHOW immediate understanding of the decision/issue. BRIEFLY state typical business aim.\n"
            f"DO NOT define basic terms unless essential.\n\n"
            
            f"PARAGRAPH 2 & 3 – Main analytical arguments (supporting side)\n"
            f"For each main paragraph:\n"
            f"START with a clear business point. IMMEDIATELY link to the case business.\n"
            f"DEVELOP a full analytical chain: decision -> operational impact -> financial/competitive impact -> business objective.\n"
            f"INCLUDE: one clear, accurate case reference AND realistic business outcomes.\n\n"
            
            f"PARAGRAPH 4 – Counter-argument / limitation paragraph\n"
            f"INTRODUCE a clear limitation, risk or opposing argument. LINK directly to the same case context.\n"
            f"ANALYSE the downside using: cause -> effect -> impact on performance/strategy.\n"
            f"DO NOT merely state 'however'.\n\n"
            
            f"PARAGRAPH 5 – Integrated evaluation paragraph\n"
            f"BALANCE both sides together. EXPLAIN why one side may matter more than the other in THIS business.\n"
            f"USE conditional language: depends on, will only be effective if, may be limited by.\n"
            f"MUST remain firmly rooted in the case.\n\n"
            
            f"FINAL PARAGRAPH – Judgement / conclusion\n"
            f"GIVE a clear, final decision. JUSTIFY the decision using the most important case factor.\n"
            f"DO NOT summarise every point. DO NOT introduce new arguments.\n"
            f"END with a business-realistic outlook (short/long term).\n\n"

            f"🟦 CONTENT COMMANDS (AO TARGETING)\n"
            f"AO1: Use correct terminology naturally. Theory only when helpful.\n"
            f"AO2: EVERY main paragraph MUST contain at least one explicit case reference. No generic examples.\n"
            f"AO3: For every main point, include min 2 logical links and 1 final business outcome.\n"
            f"AO4: Include balanced viewpoint, limitation, conditional statement, and justified final judgement.\n\n"
            
            f"🟧 DEPTH & QUALITY COMMANDS (A* STANDARD)\n"
            f"EACH analytical paragraph must develop the point, not repeat it. NO obvious statements, descriptive narration, or copying data.\n\n"
            
            f"🟨 LANGUAGE & STYLE COMMANDS\n"
            f"WRITE in short and controlled sentences. AVOID emotional tone. MAINTAIN academic neutrality.\n\n"
            
            f"🟥 CONTEXT PRIORITY COMMAND\n"
            f"When two arguments are equally valid: PRIORITISE the argument that is more important to this specific business or more realistic.\n\n"
            
            f"🟪 FINAL QUALITY CHECK COMMAND\n"
            f"Check: every paragraph has application, analysis in min 3 paragraphs, evaluation before conclusion, conclusion has justified judgement.\n"
            f"✅ OUTPUT FORMAT COMMAND\n"
            f"OUTPUT only the answer text. DO NOT output rubrics. DO NOT output AO labels. DO NOT output marks.>"
        ) if is_business_p3 else (
            f"<GENERATE A MODEL ANSWER USING THESE COMMANDS:\n"
            f"✅ MODEL ANSWER GENERATION RUBRIC\n"
            f"Paper: Business – Paper 4\n"
            f"Feature: A* / perfect candidate response generator\n\n"
            
            f"🔴 GLOBAL GENERATION COMMANDS\n"
            f"GENERATE a response that would clearly reach the top level band for Paper 4.\n"
            f"WRITE in formal academic business style, concise, controlled sentences.\n"
            f"DO NOT use bullet points. DO NOT use headings inside the answer. DO NOT mention assessment objectives.\n"
            f"DO NOT copy large parts of the case. DO NOT narrate the case. ALWAYS embed theory into analysis.\n"
            f"ALWAYS use the name of the case business where appropriate. NEVER include examiner commentary.\n\n"
            
            f"🧠 MANDATORY STRATEGIC STRUCTURE\n"
            f"The model answer MUST follow the structure below.\n\n"
            
            f"PARAGRAPH 1 – Strategic focus introduction\n"
            f"DIRECTLY address the command word. IDENTIFY the strategic decision. STATE briefly key objective and main tension.\n"
            f"DO NOT define basic terms.\n\n"
            
            f"PARAGRAPH 2 – Major strategic argument (supporting the proposal)\n"
            f"START with one clear strategic reason. LINK immediately to the case organisation.\n"
            f"DEVELOP a full strategic chain: strategic choice -> operational change -> market/competitive effect -> financial/long-term impact.\n"
            f"USE at least one concrete case detail. FOCUS on strategic, not operational, consequences.\n\n"
            
            f"PARAGRAPH 3 – Second strategic argument (supporting the proposal)\n"
            f"INTRODUCE a different strategic dimension. LINK to the same case business.\n"
            f"ANALYSE using: decision -> internal capability impact -> external competitiveness -> strategic position.\n"
            f"CONNECT explicitly to long-term performance or survival.\n\n"
            
            f"PARAGRAPH 4 – Strategic risk / counter-argument\n"
            f"PRESENT a clear strategic limitation. ANALYSE: risk/constraint -> implementation problem -> strategic failure.\n"
            f"MUST be rooted in case constraints (finance, people, culture, brand, market, competition, capacity, regulation, timing).\n\n"
            
            f"PARAGRAPH 5 – Integrated strategic evaluation\n"
            f"WEIGH supporting and limiting arguments. PRIORITISE most important strategic factor.\n"
            f"USE conditional language: depends on, only if, will be limited unless. EXPLAIN how uncertainty affects decision.\n\n"
            
            f"FINAL PARAGRAPH – Strategic judgement\n"
            f"MAKE a clear decisive recommendation. JUSTIFY using single most critical strategic issue.\n"
            f"STATE whether proposal is suitable in short/long term. DO NOT repeat analysis. DO NOT introduce new arguments.\n\n"
            
            f"🟦 CONTENT COMMANDS (PAPER 4 FOCUS)\n"
            f"Strategic AO1: Use strategic terminology. Frameworks only if strengthening analysis.\n"
            f"Strategic AO2: EVERY analytical paragraph MUST reference specific organisation, industry, size, resources.\n"
            f"Strategic AO3: EACH analytical paragraph MUST contain min 2 linked causes and reach a strategic consequence.\n"
            f"Strategic AO4: Include at least one strategic risk, trade-off, conditional judgement, and integrated conclusion.\n\n"
            
            f"🟧 DEPTH & QUALITY (A* STANDARD – PAPER 4)\n"
            f"ANALYSIS must be cross-functional and forward-looking. SHOW interaction between decisions.\n\n"
            
            f"🟨 LANGUAGE & PRESENTATION COMMANDS\n"
            f"WRITE in continuous prose. USE professional academic tone. KEEP paragraphs balanced.\n\n"
            
            f"🟥 CONTEXT PRIORITY COMMAND\n"
            f"When choosing between two valid arguments: PRIORITISE the argument that most strongly affects long-term competitiveness/survival.\n\n"
            
            f"🟪 FINAL QUALITY CHECK COMMAND\n"
            f"Check: application in every paragraph, deep strategic analysis in min 3 paragraphs, evaluation present, justified strategic judgement.\n"
            f"✅ OUTPUT FORMAT COMMAND\n"
            f"OUTPUT only the final model answer text. DO NOT show structure labels. DO NOT include rubrics/AO references/marks.>"
        ) if is_business_p4 else (
            f"<GENERATE A MODEL ANSWER USING THESE COMMANDS:\n"
            f"General Paper 8021 Model Answer Specifications:\n"
            f"- Word Count: 500-650 words\n"
            f"- Structure: Intro (80-100w), Body (3-4 paragraphs, 80-100w each), Conclusion (80-100w)\n"
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
