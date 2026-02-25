import os
import pypdf
import re

pdf_dir = "papers"
ms = "8021_w25_ms_21.pdf"
try:
    reader = pypdf.PdfReader(os.path.join(pdf_dir, ms))
    for i in range(1, 4):
        print(f"--- PAGE {i} ---")
        print(reader.pages[i].extract_text()[:1000])
except Exception as e:
    print(f"Error {ms}: {e}")
