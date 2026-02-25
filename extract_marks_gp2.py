import os
import pypdf
import re

pdf_dir = "papers"
qp_files = [f for f in os.listdir(pdf_dir) if f.startswith("8021_") and "_qp_2" in f and f.endswith(".pdf")]

for qp_file in sorted(qp_files):
    print(f"\n--- Extracting marks for {qp_file} ---")
    try:
        reader = pypdf.PdfReader(os.path.join(pdf_dir, qp_file))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Look for patterns like "1(a) ... [2]" or "1(a) ... 2\n" in the question paper
        matches = re.finditer(r"([12]\s*\([a-z](?:[iv]+)?\))(.*?)(?=\n)", text)
        for match in matches:
            q_num = match.group(1).replace(" ", "")
            line = match.group(0)
            
            # Simple heuristic: looking for brackets [3] or just standalone numbers at the end of lines
            marks_match = re.search(r"\[(\d+)\]", line)
            if marks_match:
                print(f"{q_num}: {marks_match.group(1)} marks")
    except Exception as e:
        print(f"Error reading {qp_file}: {e}")
