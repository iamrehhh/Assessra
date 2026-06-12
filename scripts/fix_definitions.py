import json
import re

with open('data/notes/A Level/Business/definitions.json', 'r') as f:
    data = json.load(f)

# data is a list of sections
new_data = []

for section in data:
    sec_name = section.get('section', '')
    if sec_name == "alphabetical order with your exact wordings preserved":
        sec_name = "General Definitions"
    elif sec_name == "cash flow.":
        continue # duplicate of 6.3 probably

    defs = section.get('definitions', [])
    new_defs = []
    
    for d in defs:
        term = d.get('term', '')
        definition = d.get('definition', '')
        
        # fix broken terms
        # e.g., "someone else.High-quality profit" -> term: "High-quality profit", append "someone else." to previous definition
        match = re.match(r'(.*?\.)([A-Z].*)', term)
        if match and " " not in match.group(1): # It might be a sentence ending
            pass
            
        # simpler heuristic: if term contains a period followed by uppercase:
        if re.search(r'[a-z]\.[A-Z]', term):
            parts = re.split(r'(?<=\.)(?=[A-Z])', term)
            if len(parts) == 2:
                # append parts[0] to previous definition
                if new_defs:
                    new_defs[-1]['definition'] += " " + parts[0]
                term = parts[1]
                
        # "growth strategies" was broken from previous
        if term == "growth strategies" and new_defs and new_defs[-1]['term'] == "Ansoff matrix":
            new_defs[-1]['definition'] += " " + term + " " + definition
            continue
            
        if term == "significant market opportunities" and new_defs and new_defs[-1]['term'] == "BRICS":
            new_defs[-1]['definition'] += " " + term + " " + definition
            continue

        if term == "cash flows resulting from an investment.Net realisable value (NRV)":
            if new_defs:
                 new_defs[-1]['definition'] += " cash flows resulting from an investment."
            term = "Net realisable value (NRV)"
            
        if term == "dividends could be paid from profit for the year.Price/earnings ratio":
             if new_defs:
                 new_defs[-1]['definition'] += " dividends could be paid from profit for the year."
             term = "Price/earnings ratio"
             
        # general clean up
        term = term.strip()
        definition = definition.strip()
        
        # Another heuristic for term starting with lowercase and previous was incomplete
        if term and term[0].islower() and new_defs and len(term.split()) > 2 and not term.startswith("cash flows"):
             # maybe it's just continuation?
             pass # let's just leave it for now
             
        new_defs.append({
            "term": term,
            "definition": definition
        })
        
    new_data.append({
        "section": sec_name,
        "definitions": new_defs
    })

with open('data/notes/A Level/Business/definitions.json', 'w') as f:
    json.dump(new_data, f, indent=2)

print("definitions.json fixed")
