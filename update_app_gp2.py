import re
import sys

with open('/Users/abdulrehan/Documents/Assessra/app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Paper Detection
detect_gp_old = """    # DETECT GENERAL PAPER 8021
    is_general_paper = False
    if pdf_path and ("8021" in pdf_path or "General" in pdf_path):
        is_general_paper = True
        print("⚠ MODE ACTIVE: General Paper 8021 Detected")"""

detect_gp_new = """    # DETECT GENERAL PAPER 8021
    is_general_paper_1 = False
    is_general_paper_2 = False
    if pdf_path and ("8021" in pdf_path or "General" in pdf_path):
        if "_1" in pdf_path or "11" in pdf_path or "12" in pdf_path or "13" in pdf_path:
            is_general_paper_1 = True
            print("⚠ MODE ACTIVE: General Paper 8021/1 (Essay) Detected")
        elif "_2" in pdf_path or "21" in pdf_path or "22" in pdf_path or "23" in pdf_path:
            is_general_paper_2 = True
            print("⚠ MODE ACTIVE: General Paper 8021/2 (Comprehension) Detected")
        else:
            is_general_paper_1 = True
            print("⚠ MODE ACTIVE: General Paper 8021/1 (Essay) Default Detected")"""

content = content.replace(detect_gp_old, detect_gp_new)

# 2. Extract Multiple PDFs (MS and IN)
ms_extract_old = """        # Standard naming convention replacements
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
                    print(f"❌ Failed to extract Marking Scheme: {e}")"""

ms_extract_new = """        # Standard naming convention replacements
        in_filename = None
        if "_in_" in filename:
            ms_filename = filename.replace("_in_", "_ms_")
            in_filename = filename
        elif "_qp_" in filename:
            ms_filename = filename.replace("_qp_", "_ms_")
            in_filename = filename.replace("_qp_", "_in_")
        
        insert_text = ""
        if in_filename:
            in_path = os.path.join(base_dir, in_filename)
            if os.path.exists(in_path):
                print(f"✅ FOUND Insert: {in_path}")
                try:
                    insert_text = extract_text_from_pdf(in_path)
                except Exception as e:
                    print(f"❌ Failed to extract Insert: {e}")
                    
        if ms_filename:
            ms_path = os.path.join(base_dir, ms_filename)
            if os.path.exists(ms_path):
                print(f"✅ FOUND Marking Scheme: {ms_path}")
                try:
                    marking_scheme_text = extract_text_from_pdf(ms_path)
                    if insert_text:
                        marking_scheme_text += "\\n\\n[INSERT / PASSAGE TEXT]\\n" + insert_text
                except Exception as e:
                    print(f"❌ Failed to extract Marking Scheme: {e}")"""

content = content.replace(ms_extract_old, ms_extract_new)

# 3. System Prompt
sys_prompt_old = """    elif is_general_paper:
        system_prompt = f\"\"\"
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
        \"\"\""""

sys_prompt_new = """    elif is_general_paper_1:
        system_prompt = f\"\"\"
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
        \"\"\"
    elif is_general_paper_2:
        system_prompt = f\"\"\"
        You are a Cambridge International AS Level English General Paper (8021/2 Comprehension) Examiner.
        Mark the following answer strictly according to the provided marking rubric and marking scheme/insert text.

        Core AI Marking Principles:
        • Positive Marking: Marks must be awarded for correct/valid answers. Do not deduct marks for errors or omissions.
        • No Half Marks: Marks awarded must always be whole numbers.
        • Language & Grammar: Answers should only be judged on spelling, punctuation, and grammar if those features are specifically assessed by the question (e.g., extended writing). Otherwise, if the meaning is unambiguous, do not penalize grammatical errors.
        • First Response Rule: For single-mark identification questions, only evaluate the first attempted response.

        Question-Type Specific Rubrics:
        A. Logical Reasoning & Extended Writing (e.g., 10-mark scenario questions):
        - Connecting Evidence: Award marks when the student successfully links two separate pieces of information from the text to form a developed point.
        - Rejecting Speculation: Do not credit advantages or disadvantages based on pure assumptions that have no supporting evidence in the text.
        - True Disadvantages vs. Mitigation: If a question asks for a disadvantage, the student must explain why something is a negative constraint. If they simply offer a mitigation, do not award the mark for a disadvantage.
        - Levels-Based Marking (10 Marks):
          ◦ Level 4 (9–10 marks): Comprehensive approach. Selects relevant information, sustains a strong focus, and communicates fluently with accurate grammar.
          ◦ Level 3 (6–8 marks): Moderate range of arguments. Shows some grasp of key issues but may lose focus or include some irrelevant material. Communicates clearly.
          ◦ Level 2 (3–5 marks): Limited analysis. Mainly undeveloped material. Modest range of points, some irrelevant/incorrect. Errors in expression impede flow.
          ◦ Level 1 (1–2 marks): Simple, unexplained points. Very narrow range. Little interpretation. Significant spelling/grammar errors hinder communication.

        B. "Own Words" Questions:
        - Lifted Text Penalty: Scan for phrases copied directly from the text. Direct copying without paraphrasing should not receive credit.
        - Permitted Exceptions: Allow repetition of specialist vocabulary with no obvious synonym.
        - Grammatical Shifts: Award marks if the student successfully changes the word form of the original text (e.g., noun to adjective).

        C. Word-Limited Summaries (e.g., "Answer in about 30 words"):
        - Strict Cut-off: Count words. Any correct points made after the specified word limit must not be credited.
        - Continuous Prose Requirement: Answers must be written in continuous prose/complete sentences. Penalize answers written in bullet points or incomplete sentences.
        - Question Stem Wording: Do not award marks for repeating the question stem (wastes word count).

        D. Exact Word / Synonym Identification:
        - Grammatical Matching: Ensure the identified word exactly matches the grammatical form of the prompt (e.g., noun for noun).
        - Single Word Rule: If asking for an "exact word", reject answers that include extra adjectives.

        CRITICAL: 
        You MUST use the provided Marking Scheme AND the Insert/Case Study text as the absolute ground truth. Compare the student's answer against the Marking Scheme directly to verify points.

        {'[MARKING SCHEME AND INSERT REFERENCE DATA]' if marking_scheme_text else ''}
        {marking_scheme_text if marking_scheme_text else ''}
        \"\"\""""

content = content.replace(sys_prompt_old, sys_prompt_new)

# 4. Rubric
rubric_old = """    elif is_general_paper:
        rubric = \"\"\"
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
        \"\"\"
        word_guide = "Subject to 100-200 word feedback limit\"\"\""""

rubric_new = """    elif is_general_paper_1:
        rubric = \"\"\"
        CAMBRIDGE AS LEVEL ENGLISH GENERAL PAPER 8021/1 PAPER 1 MARKING RUBRIC
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
        \"\"\"
        word_guide = "Subject to 100-200 word feedback limit"
    elif is_general_paper_2:
        rubric = f\"\"\"
        GENERAL PAPER 2 (COMPREHENSION) RUBRIC
        Maximum Marks: {marks}

        If {marks} >= 8:
        Apply the Levels-Based Marking (Level 1-4) outlined in the system prompt for 10-mark scenario/logical reasoning questions.
        
        If {marks} < 8:
        Apply Strict Point-Based Marking. Check against the marking scheme. Ensure no lifted text if it's an "own words" question. Check word limits if applicable. Check grammatical match if exact word.
        \"\"\"
        word_guide = "According to question constraints"
"""

rubric_old_fallback = """    elif is_general_paper:
        rubric = \"\"\"
        CAMBRIDGE AS LEVEL ENGLISH GENERAL PAPER 8021/12 MARKING RUBRIC
        Maximum Marks: 30

        LEVEL 5 (25-30 marks) - EXCELLENT"""
if rubric_old_fallback in content:
    # use regex slightly safely because of long string
    res = re.sub(r'    elif is_general_paper:\s+rubric = """\s+CAMBRIDGE AS LEVEL ENGLISH GENERAL PAPER 8021/12 MARKING RUBRIC[\s\S]*?word_guide = "Subject to 100-200 word feedback limit"', rubric_new.strip(), content)
    if res != content:
        content = res
    else:
        print("Failed to replace rubric via Regex.")
else:
    print("Cannot find rubric_old")

# 5. Model Answer
model_old = """        ) if is_general_paper else ("""
model_new = """        ) if is_general_paper_1 else (
            f"<GENERAL PAPER 2 MODEL ANSWER:\\n"
            f"You are an expert Cambridge General Paper 2 examiner. Write a perfect standalone model answer for {marks} marks.\\n"
            f"If it is a 10-mark logical reasoning question, provide a balanced response, evaluating advantages and disadvantages with developed points linking evidence from the text.\\n"
            f"If it is an 'own words' question, perfectly paraphrase the text.\\n"
            f"If it is an exact word/phrase question, provide just the exact word/phrase in the correct grammatical form.\\n"
            f"Write exactly what the student should write to get full marks. Do NOT include examiner commentary in the model answer.>"
        ) if is_general_paper_2 else ("""
content = content.replace(model_old, model_new)

# 6. Feedback Structure
feedback_old = """    elif is_general_paper:
        feedback_structure = \"\"\"
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
    \"\"\""""

feedback_new = """    elif is_general_paper_1:
        feedback_structure = \"\"\"
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
    \"\"\"
    elif is_general_paper_2:
        feedback_structure = f\"\"\"
    You must output your final grading using the following structure for the 'detailed_critique' field.
    IMPORTANT: The feedback MUST follow this exact template and be highly contextual to the student's actual writing. Stop generating the response after 'How to Fix It'. No extra text.

    Structure:
    1. Final Score: [X]/{marks}
    
    🌟 2. Criteria Fulfilled (Strengths & Marks Awarded)
    Start with positive reinforcement based on Positive Marking. Check which apply to their answer and use bullet points similar to these:
    • Valid Points Identified [Tick 1]: "You successfully identified valid points from the text, specifically..."
    • Developed Points [DEV/Tick 2]: "You successfully linked two pieces of information together to create a developed point..."
    • Balanced Argument [Bal]: "You successfully provided a balanced argument by including clear advantages and at least one valid disadvantage."
    • Word Limit Compliance: "You successfully communicated your ideas concisely and stayed within the required word limit."
    • Own Words Mastery: "You successfully captured the meaning of the text using your own words, substituting synonyms effectively without losing precision."
    • Continuous Prose: "You correctly wrote your response in continuous prose rather than bullet points."
    
    ⚠️ 3. Flaws and Cons (Marks Lost & Diagnostic Tags)
    Identify exactly where the student went wrong using official diagnostic tags if they made mistakes:
    • [NAQ] Not Answering the Question: "Your response contained information that did not directly address the prompt..."
    • [NAR] Narration vs. Analysis: "You narrated or described the events in the text rather than explaining why they act as an advantage/disadvantage."
    • [TV] Too Vague: "Your point lacked precision..."
    • [REP] Repetition & Reversal: "You repeated a point you already made, or offered the exact inverse..."
    • Word Limit Exceeded: "You exceeded the word limit. Any valid points made after the cut-off count could not be credited."
    • Lifted Text Penalty: "You copied phrases directly from the text instead of using your own words."
    • Grammatical Mismatch: "Your answer did not match the grammatical form of the prompt."
    • Mitigation vs. Disadvantage: "Instead of providing a pure disadvantage, you offered a mitigation."

    🛠️ 4. How to Fix It (Actionable Steps)
    Provide specific, actionable steps to prevent these errors in the future (if they made errors) or how to keep improving:
    • Stop Repeating the Question Stem: "Never start your answer by repeating the question stem..."
    • How to Paraphrase Effectively: "To fix the 'lifted text' penalty, try changing the word class..."
    • Avoid Extra Adjectives: "When a question asks for an 'exact word', only provide that single word."
    • Check the Subject of the Question: "Carefully read whose perspective the question asks for."
    • Separate Combined Information: "If the text lists two great things in one sentence, treat these as two separate points..."
    • Write in Complete Sentences: "Ensure you are writing in complete, coherent sentences."
    \"\"\""""
content = content.replace(feedback_old, feedback_new)

# 7. JSON Output parsing
json_1 = """    {{
        "score": <total_score_int>,
        {('"ao1": <AO1_Selection_and_Application_score_out_of_10>, "ao2": <AO2_Analysis_and_Evaluation_score_out_of_10>, "ao3": <AO3_Communication_score_out_of_10>, "ao4": 0,' if is_general_paper else '"ao1": <score_int>, "ao2": <score_int>, "ao3": <score_int>, "ao4": <score_int>,')}
        "detailed_critique": "<Markdown string that MUST START with '1. Final Score:...' and '2. Assessment Objective Breakdown:...' followed by the report.>",
        "model_answer": "<The generated A* model answer string based on the instruction above>"
    }}"""

json_1_new = """    {{
        "score": <total_score_int>,
        {('"ao1": <AO1_Selection_and_Application_score_out_of_10>, "ao2": <AO2_Analysis_and_Evaluation_score_out_of_10>, "ao3": <AO3_Communication_score_out_of_10>, "ao4": 0,' if is_general_paper_1 else '"ao1": <score_int>, "ao2": <score_int>, "ao3": <score_int>, "ao4": <score_int>,')}
        "detailed_critique": "<Markdown string that MUST START with '1. Final Score:...' followed by the report.>",
        "model_answer": "<The generated A* model answer string based on the instruction above>"
    }}"""
content = content.replace(json_1, json_1_new)

json_2 = """    {('CRITICAL ALGORITHMIC RULE FOR GENERAL PAPER SCORING:\\n'
      '1. Determine the TOTAL holistic score out of 30 FIRST (e.g., 16).\\n'
      '2. You MUST mathematically divide this exact total across ao1, ao2, and ao3 (maximum 10 each).\\n'
      '3. THE SUM OF ao1 + ao2 + ao3 MUST EXACTLY EQUAL THE TOTAL SCORE. Double check your math. (e.g., if total is 16, AOs must be 5, 5, 6). ao4 must always be 0.' if is_general_paper else '')}"""

json_2_new = """    {('CRITICAL ALGORITHMIC RULE FOR GENERAL PAPER 1 SCORING:\\n'
      '1. Determine the TOTAL holistic score out of 30 FIRST (e.g., 16).\\n'
      '2. You MUST mathematically divide this exact total across ao1, ao2, and ao3 (maximum 10 each).\\n'
      '3. THE SUM OF ao1 + ao2 + ao3 MUST EXACTLY EQUAL THE TOTAL SCORE. Double check your math. (e.g., if total is 16, AOs must be 5, 5, 6). ao4 must always be 0.' if is_general_paper_1 else '')}"""
content = content.replace(json_2, json_2_new)

with open('/Users/abdulrehan/Documents/Assessra/app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement successful")
