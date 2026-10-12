import os
import google.generativeai as genai
from dotenv import load_dotenv
from schema import get_schema
from document_context import (
    get_latest_document,
    get_all_documents
)
from financial_insights import financial_context

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_sql(question):

    prompt = f"""
You are a PostgreSQL expert.

{get_schema()}

Rules:
- Generate ONLY SQL
- Only SELECT queries
- No explanation
- No markdown
- No code blocks

Question:
{question}
"""

    response = model.generate_content(prompt)

    sql = response.text.strip()

    sql = sql.replace("```sql", "")
    sql = sql.replace("```", "")
    sql = sql.strip()

    return sql


def classify_question(question):

    prompt = f"""
Classify the question.

Return ONLY one word:

DATABASE
DOCUMENT
GENERAL
FINANCIAL

Examples:

"What is the price of laptop?" -> DATABASE

"Summarize the uploaded file" -> DOCUMENT

"What are the recommendations in the PDF?" -> DOCUMENT

"Hi how are you?" -> GENERAL
 
"Analyze my spending" -> FINANCIAL

"Give financial insights" -> FINANCIAL

"What is my savings rate?" -> FINANCIAL

"Where am I overspending?" -> FINANCIAL

"What category do I spend most on?" -> FINANCIAL

Question:
{question}
"""

    response = model.generate_content(prompt)

    return response.text.strip().upper()


# GENERAL CHAT
def general_chat(question):

    print("GENERAL CHAT STARTED")

    response = model.generate_content(question)

    print("GEMINI RESPONSE RECEIVED")

    return response.text.strip()

def financial_chat(question):

    data = financial_context()

    prompt = f"""
You are a Financial AI Assistant.

Financial Data:

{data}

User Question:
{question}

Rules:

- Answer ONLY the user's question.
- Do not generate a full financial report unless requested.
- Be concise.
- Use the provided financial data.
- Explain reasoning.
- If user asks for recommendations, provide recommendations.
- If user asks about unusual spending, answer only unusual spending.
- If user asks about savings, answer only savings.
- If user asks for financial summary, provide financial summary.
"""

    response = model.generate_content(prompt)

    return response.text.strip()


# DATABASE ANSWER FORMATTER
def generate_answer(question, result):

    prompt = f"""
Question:
{question}

Database Result:
{result}

Answer the user's question naturally and briefly.
Do not mention SQL.
If the result contains only one value, answer directly.
If the result contains multiple rows, summarize them naturally.
"""

    response = model.generate_content(prompt)

    return response.text.strip()


# DOCUMENT QA
def answer_document_question(question):

    doc = get_latest_document()

    if not doc:
        return "No document uploaded."

    file_name, content = doc

    prompt = f"""
Document:
{file_name}

Content:
{content[:15000]}

Question:
{question}

Answer only from the document.
"""

    response = model.generate_content(prompt)

    return response.text.strip()


def answer_all_documents(question):

    docs = get_all_documents()

    if not docs:
        return "No documents uploaded."

    combined_text = ""

    for file_name, content in docs:

        combined_text += f"""

FILE:
{file_name}

CONTENT:
{content[:5000]}

"""

    prompt = f"""
You have access to multiple documents.

Documents:
{combined_text}

Question:
{question}

Answer using all relevant documents.
"""

    response = model.generate_content(prompt)

    return response.text.strip()


def financial_ai_summary(data):

    prompt = f"""
You are a financial advisor.

Analyze this data:

{data}

Provide:

1. Spending observations
2. Risks
3. Recommendations

Keep answer concise.
"""

    response = model.generate_content(prompt)

    return response.text.strip()

def is_financial_document(text):

    prompt = f"""
Determine whether this document contains financial data.

Examples:

Bank statement -> YES
Invoice -> YES
Salary slip -> YES
Expense report -> YES
University bill -> YES

Story book -> NO
Novel -> NO
Random notes -> NO

Document:

{text[:3000]}

Return ONLY:

YES

or

NO
"""

    response = model.generate_content(prompt)

    return response.text.strip().upper()


def extract_transactions(text):

    prompt = f"""
Extract financial transactions.

Return JSON ONLY.

Format:

[
  {{
    "date":"2026-04-01",
    "description":"Salary",
    "category":"Salary",
    "amount":50000,
    "type":"credit"
  }}
]

Document:

{text[:15000]}
"""

    response = model.generate_content(prompt)

    return response.text

    
    
