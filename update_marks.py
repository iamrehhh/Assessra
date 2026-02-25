import re

js_file = "scripts/general_paper.js"
with open(js_file, "r") as f:
    content = f.read()

def replace_marks(match):
    q_num = match.group(1) # e.g. 1(a)
    content_str = match.group(2) 

    mark = 3
    if 'a' in q_num or 'b' in q_num or 'c' in q_num:
        mark = 2
    if 'h' in q_num or 'i' in q_num or 'j' in q_num:
        mark = 4
        
    return f"{{ n: '{q_num}', m: {mark}{content_str}"

new_content = re.sub(r"\{\s*n:\s*'([^']+)',\s*m:\s*0([^}]+})", replace_marks, content)

with open(js_file, "w") as f:
    f.write(new_content)

print(f"Updated general_paper.js")
