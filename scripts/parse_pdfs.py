import PyPDF2
import json
import os
import re

def parse_definitions(pdf_path, out_path):
    if not os.path.exists(pdf_path): return
    with open(pdf_path, 'rb') as f:
        text = ""
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages: text += page.extract_text() + "\n"
        
    results = []
    # Match patterns like "Term: Definition"
    lines = text.split('\n')
    for line in lines:
        if ':' in line and not 'ZNOTES' in line and not 'Copyright' in line and not 'CAIE' in line:
            parts = line.split(':', 1)
            if len(parts) == 2:
                results.append({
                    "term": parts[0].strip(),
                    "definition": parts[1].strip()
                })
    
    with open(out_path, 'w') as f:
        json.dump(results, f, indent=2)

def parse_formulae(pdf_path, out_path):
    if not os.path.exists(pdf_path): return
    with open(pdf_path, 'rb') as f:
        text = ""
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages: text += page.extract_text() + "\n"
        
    results = []
    lines = [l.strip() for l in text.split('\n') if l.strip() and not 'ZNOTES' in l and not 'Copyright' in l and not 'CAIE' in l and not 'WWW' in l and not 'ALIGNED' in l and not 'FORMULAE' in l and not 'BUSINESS' in l and not 'This document' in l and not 'These notes' in l]
    
    i = 0
    while i < len(lines):
        line = lines[i]
        if '=' in line:
            # We found a formula, the previous line is probably the name
            name = lines[i-1] if i > 0 else "Formula"
            results.append({
                "name": name.strip(),
                "formula": line.strip(),
                "meaning": ""
            })
        i += 1
        
    with open(out_path, 'w') as f:
        json.dump(results, f, indent=2)

def parse_theory(pdf_path, out_path):
    if not os.path.exists(pdf_path): return
    with open(pdf_path, 'rb') as f:
        text = ""
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages: text += page.extract_text() + "\n"
        
    # Basic markdown formatting
    md_text = "# Business Theory\n\n"
    lines = text.split('\n')
    for line in lines:
        if 'ZNOTES' in line or 'Copyright' in line or 'CAIE' in line or 'WWW' in line:
            continue
        if len(line.strip()) < 50 and line.strip().isupper():
            md_text += f"\n## {line.strip()}\n\n"
        else:
            md_text += line.strip() + " "
            if line.endswith('.'):
                md_text += "\n\n"
                
    with open(out_path, 'w') as f:
        f.write(md_text)

os.makedirs('data/notes/A Level/Business', exist_ok=True)
parse_definitions('public/notes/A Level/Business/definitions.pdf', 'data/notes/A Level/Business/definitions.json')
parse_formulae('public/notes/A Level/Business/formulae.pdf', 'data/notes/A Level/Business/formulae.json')
parse_theory('public/notes/A Level/Business/theory.pdf', 'data/notes/A Level/Business/theory.md')

print("Extraction complete!")
