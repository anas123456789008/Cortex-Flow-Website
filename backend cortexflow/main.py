"""
CortexFlow API entry point.

Run from the project root:
    uvicorn cortexflow.main:app --reload
Then open http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI

from .routers import admin, ai, analysis, dashboard, documents, recommendations
from .store import seed

app = FastAPI(title="CortexFlow API")

app.include_router(analysis.router)         # FR6
app.include_router(recommendations.router)  # FR7
app.include_router(ai.router)               # FR11 + FR8
app.include_router(dashboard.router)        # FR9
app.include_router(admin.router)            # FR13
app.include_router(documents.router)        # RAG: retrieve info from uploaded documents

seed()  # sample data for testing; remove when using the real database
