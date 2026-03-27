import sys
try:
    from docx import Document
except ImportError:
    print("python-docx not installed. Please install it.")
    sys.exit(1)

doc_path = r"C:\Users\prana\.gemini\antigravity\scratch\crop_recommendation\soil_quality_report_refined (1).docx"
try:
    doc = Document(doc_path)
    for para in doc.paragraphs:
        print(para.text)
except Exception as e:
    print(f"Error reading document: {e}")
