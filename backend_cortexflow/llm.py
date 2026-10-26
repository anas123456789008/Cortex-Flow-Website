import os
import re
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


# ---------------------------------------------------------------------------
# Gemini model choice + time limits
# ---------------------------------------------------------------------------
# 1) Google retires old model names (gemini-2.5-flash returns 404 "NotFound").
# 2) By default the Google library waits up to 10 MINUTES for one answer and
#    silently retries when Google is busy. The website gives up after 90 seconds,
#    so users saw "The AI service took too long".
# This wrapper tries several models, gives every call a short time limit, stops
# after TOTAL_BUDGET seconds, and remembers the model that works.
# To force one model, set GEMINI_MODEL in Render -> Environment.
import time

from google.api_core import exceptions as gexc

MODEL_CANDIDATES = [
    m for m in (
        os.getenv("GEMINI_MODEL"),
        "gemini-3.8-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash",
    ) if m
]

PER_CALL_TIMEOUT = 25   # seconds one Gemini call may take
TOTAL_BUDGET = 60       # seconds for ALL attempts of one question

# "This model cannot answer right now" -> try the next model.
# (Free-tier limits are counted per model, so another model can still work.)
SKIP_ERRORS = (
    gexc.NotFound,            # model name does not exist for this key
    gexc.TooManyRequests,     # quota / rate limit (429)
    gexc.ServiceUnavailable,  # Google is overloaded (503)
    gexc.GatewayTimeout,      # includes DeadlineExceeded (call took too long)
    gexc.InternalServerError,
)


class _ResilientModel:
    """Works like genai.GenerativeModel(...).generate_content(prompt)."""

    def __init__(self, names):
        self.names = list(dict.fromkeys(names))
        self.working = None

    def _discover(self, already_tried):
        """Ask Google which flash models this API key can call."""
        try:
            found = []
            for m in genai.list_models():
                name = m.name.split("/")[-1]
                if ("generateContent" in m.supported_generation_methods
                        and "flash" in name
                        and not any(x in name for x in
                                    ("image", "tts", "audio", "live", "embed", "robotics"))
                        and name not in already_tried):
                    found.append(name)
            return sorted(found, reverse=True)
        except Exception as e:
            print("Could not list Gemini models:", e)
            return []

    def _try(self, name, prompt, started, kwargs):
        left = TOTAL_BUDGET - (time.monotonic() - started)
        if left < 3:
            raise gexc.DeadlineExceeded("The AI service did not answer in time")
        options = {"timeout": min(PER_CALL_TIMEOUT, left), "retry": None}
        return genai.GenerativeModel(name).generate_content(
            prompt, request_options=options, **kwargs)

    def generate_content(self, prompt, **kwargs):
        started = time.monotonic()
        order = ([self.working] if self.working else []) + self.names
        tried, last_error, only_not_found = [], None, True

        for name in dict.fromkeys(order):
            try:
                response = self._try(name, prompt, started, kwargs)
                if self.working != name:
                    print(f"Using Gemini model: {name}")
                self.working = name
                return response
            except gexc.DeadlineExceeded as e:
                # ran out of total time (or the call itself timed out)
                print(f"Gemini model {name}: {e.__class__.__name__}")
                last_error, only_not_found = e, False
                if time.monotonic() - started >= TOTAL_BUDGET - 3:
                    raise
                tried.append(name)
            except SKIP_ERRORS as e:
                print(f"Gemini model {name} failed ({e.__class__.__name__}), trying next")
                tried.append(name)
                last_error = e
                if not isinstance(e, gexc.NotFound):
                    only_not_found = False

        # Every hard-coded name does not exist for this key: ask Google what does.
        if only_not_found:
            for name in self._discover(tried):
                try:
                    response = self._try(name, prompt, started, kwargs)
                    print(f"Using Gemini model (auto-detected): {name}")
                    self.working = name
                    return response
                except SKIP_ERRORS as e:
                    last_error = e

        raise last_error or gexc.DeadlineExceeded("The AI service did not answer in time")


model = _ResilientModel(MODEL_CANDIDATES)


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


GREETING_RE = re.compile(
    r"^\s*(hi+|hello+|hey+|hola|salam|assalam[o ]*alaikum|aoa|good\s+(morning|afternoon|evening)|"
    r"thanks?( you)?|thank u|ok(ay)?|bye|who are you|what can you do)\W*$",
    re.IGNORECASE,
)

FINANCIAL_HINTS = (
    "savings rate", "overspend", "financial insight", "financial summary",
    "analyze my spending", "analyse my spending", "spend most", "my spending",
    "financial advice", "unusual spending",
)

DOCUMENT_HINTS = (
    "uploaded file", "uploaded document", "the document", "the pdf",
    "this document", "this pdf", "the file i uploaded", "summarize the file",
)


def quick_classify(question):
    """Obvious questions are sorted without calling Gemini (faster, and it
    saves free-tier quota). Returns None when unsure."""
    q = question.lower().strip()
    if GREETING_RE.match(q):
        return "GENERAL"
    if any(h in q for h in FINANCIAL_HINTS):
        return "FINANCIAL"
    if any(h in q for h in DOCUMENT_HINTS):
        return "DOCUMENT"
    return None


def classify_question(question):

    quick = quick_classify(question)
    if quick:
        return quick

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

def financial_chat(question, context=None):

    # Authenticated API requests must pass a user-filtered context.
    # Keep the old fallback for non-request compatibility.
    data = context if context is not None else financial_context()

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