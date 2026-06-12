import PyPDF2
import json

def parse_definitions(pdf_path, out_path):
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

    results = []
    lines = text.split('\n')
    
    current_term = None
    current_def = ""
    
    for line in lines:
        line = line.strip()
        if not line: continue
        if 'ZNOTES' in line or 'Copyright' in line or 'CAIE' in line or 'WWW' in line: continue
        if 'This document' in line or 'These notes' in line or 'ALIGNED' in line: continue
        if line.startswith('1. #') or line.startswith('Here is your') or line.startswith('alphabetical order'): continue
        if line == 'DEFINITIONS' or line == 'BUSINESS (9609)' or line == 'CAIE A2 LEVEL': continue
        if 'Authorized for personal use' in line: continue
        if 'www.znotes.org' in line: continue
        
        # New term logic
        is_new_term = False
        if ':' in line:
            parts = line.split(':', 1)
            term_cand = parts[0].strip()
            
            # Valid term candidate:
            # - length < 60
            # - less than 8 words
            # - Does not start with lowercase
            if len(term_cand) < 60 and len(term_cand.split()) < 8 and not term_cand[0].islower():
                # Also check if current_def implies a continuation
                if current_term:
                    # if the last char of current_def is NOT a period, it's likely a continuation
                    # but wait, some definitions don't end with a period.
                    # Actually, new terms in the PDF are usually title case and at the start of a line.
                    # "growth strategies" starts with lower case! So not term_cand[0].islower() will correctly skip it!
                    is_new_term = True
                else:
                    is_new_term = True
                    
        if is_new_term:
            if current_term:
                results.append({"term": current_term, "definition": current_def.strip()})
            current_term = term_cand
            current_def = parts[1].strip() + " "
        else:
            if current_term:
                current_def += line + " "

    if current_term:
        results.append({"term": current_term, "definition": current_def.strip()})
        
    structured_results = [{"section": "General Definitions", "definitions": results}]
    
    with open(out_path, 'w') as f:
        json.dump(structured_results, f, indent=2)

parse_definitions('data/notes/A Level/Business/CAIE - A2 Level - Business (1).pdf', 'data/notes/A Level/Business/definitions.json')
print("Done reextracting")
