import json

with open('scripts/chapter1_raw.txt', 'r') as f:
    raw_text = f.read()

def process_text(text):
    lines = text.split('\n')
    output = []
    
    in_table = False
    table_lines = []
    
    def render_table(tbl):
        if not tbl: return ""
        # The first line is the header
        header = tbl[0].split('\t')
        
        # Build the table
        out_tbl = []
        out_tbl.append("| " + " | ".join(header) + " |")
        out_tbl.append("|" + "|".join(["---" for _ in header]) + "|")
        for row in tbl[1:]:
            cols = row.split('\t')
            # Pad with empty if some columns are missing
            while len(cols) < len(header):
                cols.append("")
            out_tbl.append("| " + " | ".join(cols) + " |")
            
        return "\n".join(out_tbl) + "\n"

    for line in lines:
        line = line.strip()
        if '\t' in line:
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(line)
        else:
            if in_table:
                output.append(render_table(table_lines))
                in_table = False
                table_lines = []
            
            # Now handle normal line
            if not line:
                output.append("")
            else:
                # Is it a title?
                if len(line) < 60 and not line.endswith('.') and not line.endswith('?') and not line.endswith(':') and not line.endswith(','):
                    output.append(f"### {line}")
                else:
                    output.append(line)

    if in_table:
        output.append(render_table(table_lines))
        
    return "\n".join(output)

markdown_content = process_text(raw_text)

# We want to replace Chapter 1 in theory.json with this new content.
with open('data/notes/A Level/Business/theory.json', 'r') as f:
    data = json.load(f)

for ch in data:
    if "Chapter 1" in ch['title']:
        ch['content'] = markdown_content
        break

with open('data/notes/A Level/Business/theory.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated Chapter 1")
