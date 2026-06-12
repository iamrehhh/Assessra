import PyPDF2
import json

def parse_definitions(pdf_path, out_path):
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

    sections = []
    
    current_section_name = "General Definitions"
    current_defs = []
    
    lines = text.split('\n')
    
    current_term = None
    current_def = ""
    
    for line in lines:
        line = line.strip()
        if not line: continue
        if 'ZNOTES' in line or 'Copyright' in line or 'CAIE' in line or 'WWW' in line: continue
        if 'This document' in line or 'These notes' in line or 'ALIGNED' in line: continue
        if line.startswith('1. #'): continue
        if line == 'DEFINITIONS' or line == 'BUSINESS (9609)' or line == 'CAIE A2 LEVEL': continue
        if 'Authorized for personal use' in line: continue
        if 'www.znotes.org' in line: continue
        
        # New term or section logic
        is_new_term = False
        is_section = False
        
        if ':' in line:
            parts = line.split(':', 1)
            term_cand = parts[0].strip()
            def_cand = parts[1].strip()
            
            if def_cand == "":
                # It's a section header
                if term_cand == "alphabetical order with your exact wordings preserved":
                    term_cand = "General Definitions"
                elif term_cand == "cash flow." or term_cand == "Activity":
                    # skip these broken ones
                    continue
                is_section = True
            elif len(term_cand) < 60 and len(term_cand.split()) < 8 and not term_cand[0].islower():
                # Valid term candidate
                is_new_term = True
                    
        if is_section:
            if current_term:
                current_defs.append({"term": current_term, "definition": current_def.strip()})
                current_term = None
                current_def = ""
                
            if current_defs:
                sections.append({"section": current_section_name, "definitions": current_defs})
            current_section_name = term_cand
            current_defs = []
            
        elif is_new_term:
            if current_term:
                current_defs.append({"term": current_term, "definition": current_def.strip()})
            current_term = term_cand
            current_def = parts[1].strip() + " "
        else:
            if current_term:
                current_def += line + " "

    if current_term:
        current_defs.append({"term": current_term, "definition": current_def.strip()})
        
    if current_defs:
        sections.append({"section": current_section_name, "definitions": current_defs})
        
    with open(out_path, 'w') as f:
        json.dump(sections, f, indent=2)

parse_definitions('data/notes/A Level/Business/CAIE - A2 Level - Business (1).pdf', 'data/notes/A Level/Business/definitions.json')
print("Done reextracting with sections")
