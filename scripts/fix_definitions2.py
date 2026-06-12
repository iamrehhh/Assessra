import json

with open('data/notes/A Level/Business/definitions.json', 'r') as f:
    data = json.load(f)

for section in data:
    for d in section.get('definitions', []):
        if d['term'] == "Environmental (Planet).Two-way communication":
            d['term'] = "Two-way communication"
            # We don't know the exact previous one but we can just fix the term
            # It's better than having a broken term.
            
with open('data/notes/A Level/Business/definitions.json', 'w') as f:
    json.dump(data, f, indent=2)

