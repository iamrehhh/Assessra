import json
import re

with open('data/notes/A Level/Business/theory.json', 'r') as f:
    data = json.load(f)

# Hardcode some nice chapter titles
chapter_titles = {
    "1": "Chapter 1: External Influences on Business Activity",
    "2": "Chapter 2: Business Strategy",
    "3": "Chapter 3: Organisation Structure",
    "4": "Chapter 4: Leadership",
    "5": "Chapter 5: Human Resource Management",
    "6": "Chapter 6: Marketing Analysis",
    "7": "Chapter 7: Marketing Strategy",
    "8": "Chapter 8: Location and Scale of Operations",
    "9": "Chapter 9: Quality Management",
    "0": "Chapter 10: Operations Management"
}

chapters = {}
for item in data:
    title = item['title']
    content = item['content']
    
    match = re.match(r'^(\d+)\.', title)
    if match:
        ch_num = match.group(1)
        if ch_num not in chapters:
            chapters[ch_num] = []
        chapters[ch_num].append(item)

new_data = []

# Sort by logical order: 1 to 9, then 0 (which is 10)
order = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

for ch_num in order:
    if ch_num in chapters:
        ch_title = chapter_titles.get(ch_num, f"Chapter {ch_num}")
        
        # Combine all sections into markdown
        combined_content = ""
        for section in chapters[ch_num]:
            combined_content += f"## {section['title']}\n\n{section['content']}\n\n"
            
        new_data.append({
            "title": ch_title,
            "content": combined_content.strip()
        })
        
# For any remaining items that didn't match \d+.
other_items = [item for item in data if not re.match(r'^(\d+)\.', item['title'])]
if other_items:
    other_content = ""
    for item in other_items:
        other_content += f"## {item['title']}\n\n{item['content']}\n\n"
    new_data.append({
        "title": "Other Theories",
        "content": other_content.strip()
    })

with open('data/notes/A Level/Business/theory.json', 'w') as f:
    json.dump(new_data, f, indent=2)

print("theory.json grouped by chapters")
