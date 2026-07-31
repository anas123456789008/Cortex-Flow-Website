from pypdf import PdfReader
from docx import Document

def extract_pdf_text(path):

    reader = PdfReader(path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def extract_docx_text(path):

    doc = Document(path)

    return "\n".join(
        para.text
        for para in doc.paragraphs
    )


def extract_txt_text(path):

    with open(path, "r", encoding="utf-8") as f:
        return f.read()