import sys
from pypdf import PdfReader
import re
import json

def extract_answers(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    # Looking for patterns like "1 A" or "1 B"
    # MS usually has "Question Number Key"
    # or just lines like "1 A", "2 C"
    answers = {}
    for line in text.split('\n'):
        # match patterns like "1 A" or "1  A" or "1\tA"
        match = re.match(r'^\s*(\d+)\s+([A-D])\s*$', line.strip())
        if match:
            q = int(match.group(1))
            ans = match.group(2)
            answers[q] = ans
    
    # If not line by line, try global search
    if len(answers) < 40:
        matches = re.findall(r'\b(\d+)\s+([A-D])\b', text)
        for m in matches:
            q = int(m[0])
            ans = m[1]
            if 1 <= q <= 40:
                answers[q] = ans

    # Convert dictionary to ordered array
    ans_array = []
    for i in range(1, max(answers.keys(), default=0) + 1):
        ans_array.append(answers.get(i, '?'))
    
    return ans_array

if __name__ == '__main__':
    paths = sys.argv[1:]
    for path in paths:
        ans = extract_answers(path)
        print(f"{path}: {json.dumps(ans)}")
