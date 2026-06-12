import json
import re

def format_theory():
    with open('data/notes/A Level/Business/theory.md', 'r') as f:
        text = f.read()

    # Split the text by section headers like "1.1. Title"
    pattern = r'(?P<sec>\d\.\d\.\s+[A-Z][^\n]{0,60})'
    
    # re.split keeps the delimiters if we use capture groups, but let's use finditer
    sections = []
    
    matches = list(re.finditer(pattern, text))
    
    for i in range(len(matches)):
        start = matches[i].end()
        end = matches[i+1].start() if i+1 < len(matches) else len(text)
        
        full_title = matches[i].group('sec').strip()
        words = full_title.split()
        title = " ".join(words[:7])
        if len(words) > 7: title += "..."
        
        content = text[start:end].strip()
        
        # Add spacing after sentences (periods followed by a space and capital letter)
        content = re.sub(r'([a-z]\.)\s*(?=[A-Z])', r'\1\n\n', content)
        # Add spacing before "Advantages" or "Disadvantages"
        content = re.sub(r'(Advantages|Disadvantages)', r'\n\n**\1**\n\n', content)
        
        # Clean up weird spacing
        content = re.sub(r'\n{3,}', r'\n\n', content)
        
        sections.append({
            "title": title,
            "content": content
        })

    with open('data/notes/A Level/Business/theory.json', 'w') as f:
        json.dump(sections, f, indent=2)

def format_definitions():
    with open('data/notes/A Level/Business/definitions.json', 'r') as f:
        data = json.load(f)
        
    structured = []
    current_section = "General Definitions"
    current_defs = []
    
    for item in data:
        if not item['definition'].strip():
            # This is a section header!
            if current_defs:
                structured.append({
                    "section": current_section,
                    "definitions": current_defs
                })
            current_section = item['term'].strip()
            current_defs = []
        else:
            current_defs.append(item)
            
    if current_defs:
        structured.append({
            "section": current_section,
            "definitions": current_defs
        })
        
    with open('data/notes/A Level/Business/definitions.json', 'w') as f:
        json.dump(structured, f, indent=2)

format_theory()
format_definitions()
print("Reformatting complete!")
