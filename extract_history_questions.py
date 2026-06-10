import sys
import re
from pypdf import PdfReader
import json

def extract_questions_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    questions = []
    
    # Split text into lines
    lines = text.split('\n')
    
    current_main_context = ""
    current_question_num = ""
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Match main question: e.g., "1 In 1848 revolutions swept across Europe."
        main_q_match = re.match(r'^(\d+)\s+(.+)$', line)
        
        # Avoid matching years or just numbers
        # Usually it's followed by text. But it might be a part of (a)
        
        # Match part: e.g., "(a) Describe..."
        part_match = re.match(r'^\(([a-c])\)\s+(.+?)\s*\[(\d+)\]$', line)
        if not part_match:
            # Maybe marks are on the next line or separated
            part_match_no_marks = re.match(r'^\(([a-c])\)\s+(.+)$', line)
            
        if part_match:
            part = part_match.group(1)
            text_part = part_match.group(2)
            marks = int(part_match.group(3))
            
            # Use current main context if it exists
            full_text = f"{current_main_context}\n({part}) {text_part}".strip()
            
            questions.append({
                "n": f"{current_question_num}{part}",
                "m": marks,
                "t": full_text
            })
        elif main_q_match:
            # Check if it's a valid main question (usually 1-22)
            num = main_q_match.group(1)
            rest = main_q_match.group(2)
            if num.isdigit() and int(num) <= 25 and len(rest) > 5:
                current_question_num = num
                current_main_context = line
        else:
            # Check if it continues the previous part, but let's assume it's simple for now.
            # We can also handle the case where marks are not on the same line.
            part_match_no_marks = re.match(r'^\(([a-c])\)\s+(.+)$', line)
            if part_match_no_marks and not line.endswith(']'):
                # Wait, marks might be at the end of the line
                match_brackets = re.search(r'\[(\d+)\]', line)
                if match_brackets:
                    part = part_match_no_marks.group(1)
                    text_part = line.replace(match_brackets.group(0), '').strip()
                    marks = int(match_brackets.group(1))
                    
                    full_text = f"{current_main_context}\n{text_part}".strip()
                    questions.append({
                        "n": f"{current_question_num}{part}",
                        "m": marks,
                        "t": full_text
                    })
                
    return questions

if __name__ == '__main__':
    for path in sys.argv[1:]:
        print(f"Processing {path}...")
        qs = extract_questions_from_pdf(path)
        print(json.dumps(qs, indent=2))
        
