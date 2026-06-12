import json

with open('data/notes/A Level/Business/theory.json', 'r') as f:
    data = json.load(f)

# Define the boundaries of the chapters based on their order in the list.
# A new chapter starts when the prefix integer changes.
chapters = []
current_chapter_num = 1
current_prefix = None
current_chapter_sections = []

for item in data:
    title = item['title']
    
    # Extract the prefix e.g. "1" from "1.1. "
    prefix = title.split('.')[0]
    
    if current_prefix is None:
        current_prefix = prefix
        
    if prefix != current_prefix:
        # A new chapter has started
        chapters.append(current_chapter_sections)
        current_chapter_sections = []
        current_chapter_num += 1
        current_prefix = prefix
        
    current_chapter_sections.append(item)

if current_chapter_sections:
    chapters.append(current_chapter_sections)

# Now define logical chapter names
chapter_names = [
    "Chapter 1: External Influences on Business Activity",
    "Chapter 2: Business Strategy",
    "Chapter 3: Organisation Structure",
    "Chapter 4: Leadership",
    "Chapter 5: Human Resource Management",
    "Chapter 6: Marketing Analysis",
    "Chapter 7: Marketing Strategy",
    "Chapter 8: Location and Scale of Operations",
    "Chapter 9: Quality Management",
    "Chapter 10: Operations Planning",
    "Chapter 11: Financial Statements",
    "Chapter 12: Ratio Analysis",
    "Chapter 13: Investment Appraisal",
    "Chapter 14: Strategic Decision Making",
    "Chapter 15: Communication"
]

new_data = []
for i, ch_sections in enumerate(chapters):
    if i < len(chapter_names):
        ch_title = chapter_names[i]
    else:
        ch_title = f"Chapter {i+1}"
        
    combined_content = ""
    for sec in ch_sections:
        combined_content += f"## {sec['title']}\n\n{sec['content']}\n\n"
        
    new_data.append({
        "title": ch_title,
        "content": combined_content.strip()
    })

with open('data/notes/A Level/Business/theory.json', 'w') as f:
    json.dump(new_data, f, indent=2)

print("theory.json correctly grouped into chapters")
