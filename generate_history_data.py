import sys
import re
from pypdf import PdfReader
import json
import glob
import os

def extract_questions_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
        
    text = re.sub(r'\s+', ' ', text) # normalize spaces
    
    questions = []
    
    # Find all main question starts: "1 ", "2 ", etc.
    # We know History Paper 1 has questions numbered 1 to 18.
    
    for q_num in range(1, 19):
        # Regex to find: " {q_num} <context text> (a) <text> [4] (b) <text> [6] (c) <text> [10]"
        # Since OCR isn't perfect, let's just find "(a)", "(b)", "(c)" preceded by the question number.
        
        # Look for the start of the question
        pattern = rf'\b{q_num}\s+([A-Z].+?)\s*\(a\)\s+(.+?)\s*\[(\d+)\]\s*\(b\)\s+(.+?)\s*\[(\d+)\]\s*\(c\)\s+(.+?)\s*\[(\d+)\]'
        match = re.search(pattern, text)
        if match:
            context = f"{q_num} {match.group(1).strip()}"
            questions.append({ "n": f"{q_num}a", "m": int(match.group(3)), "t": f"{context}\n(a) {match.group(2).strip()}" })
            questions.append({ "n": f"{q_num}b", "m": int(match.group(5)), "t": f"{context}\n(b) {match.group(4).strip()}" })
            questions.append({ "n": f"{q_num}c", "m": int(match.group(7)), "t": f"{context}\n(c) {match.group(6).strip()}" })
        else:
            # Maybe some parts are missing or OCR failed to put them together.
            # Let's try a looser regex
            pass
            
    # Looser approach: just find all (a) [4], (b) [6], (c) [10]
    if len(questions) == 0:
        # We will split the text by (a), (b), (c)
        # Find all occurrences of "(a) ... [4]", etc.
        # But we need the question number and context.
        pass
        
    return questions

def process_all_pdfs():
    files = glob.glob('/Users/abdulrehan/Documents/Assessra/past_papers/igcse/history/questions/*.pdf')
    
    data_dict = {}
    
    for f in files:
        base = os.path.basename(f)
        # e.g., 0470_m25_qp_12.pdf
        parts = base.replace('.pdf', '').split('_')
        
        # Mapping m->fm, s->mj, w->on
        season_map = {'m': 'fm', 's': 'mj', 'w': 'on'}
        
        series = parts[1] # e.g. m25
        season = season_map.get(series[0], series[0])
        year = "20" + series[1:]
        variant = parts[3]
        
        paper_id = f"history_{year}_{season}_{variant}"
        
        # We extract text, but regex needs to be perfect
        # Let's just do a simpler parsing line by line
        reader = PdfReader(f)
        lines = []
        for p in reader.pages:
            lines.extend(p.extract_text().split('\n'))
            
        questions = []
        current_context = ""
        current_q_num = ""
        
        for line in lines:
            line = line.strip()
            
            # Match start of question "1 Blah"
            m_main = re.match(r'^([1-9]|1[0-8])\s+([A-Z].+)$', line)
            if m_main and not 'Section' in line and not 'Option' in line:
                current_q_num = m_main.group(1)
                current_context = line
                
            # Match parts (a), (b), (c) that might have marks at the end
            m_part = re.match(r'^\(([a-c])\)\s+(.+?)\s*\[(\d+)\]$', line)
            if m_part:
                questions.append({
                    "n": f"{current_q_num}{m_part.group(1)}",
                    "m": int(m_part.group(3)),
                    "t": f"{current_context}\n({m_part.group(1)}) {m_part.group(2)}"
                })
            else:
                # Sometimes marks are not on the same line, or question spans lines
                # Let's just find any line starting with (a), (b), (c)
                m_part_nomark = re.match(r'^\(([a-c])\)\s+(.+)$', line)
                if m_part_nomark:
                    # Look for marks
                    m_marks = re.search(r'\[(\d+)\]', line)
                    if m_marks:
                        text_only = line.replace(m_marks.group(0), '').strip()
                        questions.append({
                            "n": f"{current_q_num}{m_part_nomark.group(1)}",
                            "m": int(m_marks.group(1)),
                            "t": f"{current_context}\n{text_only}"
                        })
                    else:
                        # Marks might be on the next line or wrapped
                        # Let's just assume marks: a=4, b=6, c=10
                        part_letter = m_part_nomark.group(1)
                        marks = 4 if part_letter == 'a' else (6 if part_letter == 'b' else 10)
                        questions.append({
                            "n": f"{current_q_num}{part_letter}",
                            "m": marks,
                            "t": f"{current_context}\n{line}"
                        })
                        
        # Filter out duplicates or empty Q nums
        valid_qs = []
        seen = set()
        for q in questions:
            if q['n'] not in seen and q['n'][0].isdigit():
                valid_qs.append(q)
                seen.add(q['n'])
                
        data_dict[paper_id] = {
            "title": f"IGCSE History {year}",
            "pdf": f"igcse/history/questions/{base}",
            "questions": valid_qs
        }
        
    # Write to file
    out = "export const igcseHistoryData = " + json.dumps(data_dict, indent=4) + ";\n\n"
    out += """export const igcseHistoryPapers = Object.entries(igcseHistoryData).map(([id, d]: [string, any]) => {
    const parts = id.split('_'); 
    const year = parts[1];
    const seriesMap = { on: 'Oct / Nov Series', mj: 'May / June Series', fm: 'Feb / March Series' };
    const variant = parts[3];
    const code = `0470/${variant}`;
    return { id, code, title: d.title, year, series: seriesMap[parts[2]] || '' };
});
"""
    with open('/Users/abdulrehan/Documents/Assessra/data/papers/igcseHistory.ts', 'w') as f:
        f.write(out)
        
process_all_pdfs()
