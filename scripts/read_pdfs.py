import PyPDF2
import os

files = [
    'public/notes/A Level/Business/theory.pdf',
    'public/notes/A Level/Business/definitions.pdf',
    'public/notes/A Level/Business/formulae.pdf'
]

for file_path in files:
    if os.path.exists(file_path):
        print(f"\n\n=== START: {file_path} ===\n")
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                print(page.extract_text())
        print(f"\n=== END: {file_path} ===\n")
    else:
        print(f"File not found: {file_path}")
