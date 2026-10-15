"""
CortexFlow API entry point.

Run from the project root:
    uvicorn cortexflow.main:app --reload
Then open http://127.0.0.1:8000/docs
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import admin, ai, analysis, dashboard, documents, recommendations
from .store import seed

app = FastAPI(title="CortexFlow API")

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
# Default origins; extra ones can be added via the CORS_ORIGINS env var
# (comma-separated), e.g. CORS_ORIGINS="https://app.mydomain.com,https://mydomain.com"
origins = [
    "http://localhost:5173",           # Vite dev server
    "http://127.0.0.1:5173",
    "cortex-flow-website-2nn2-git-main-ubi2.vercel.app",    # Production frontend (no trailing slash)
]

extra_origins = os.getenv("CORS_ORIGINS", "")
origins += [o.strip().rstrip("/") for o in extra_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Allows Vercel preview deployments such as https://your-site-git-main-user.vercel.app
    allow_origin_regex=r"https://cortex-flow-website-2nn2-git-main-ubi2\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(analysis.router)         # FR6
app.include_router(recommendations.router)  # FR7
app.include_router(ai.router)               # FR11 + FR8
app.include_router(dashboard.router)        # FR9
app.include_router(admin.router)            # FR13
app.include_router(documents.router)        # RAG: retrieve info from uploaded documents


# ---------------------------------------------------------------------------
# Basic routes
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "CortexFlow API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------
seed()  # sample data for testing; remove when using the real database


# ---------------------------------------------------------------------------
# Local run: python -m cortexflow.main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("cortexflow.main:app", host="0.0.0.0", port=8000, reload=True)