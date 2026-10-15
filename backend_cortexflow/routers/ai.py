"""FR11 + FR8 route: POST /ai/insights (answer is generated, then validated)"""

from fastapi import APIRouter, Depends

from ..auth import current_user
from ..models import AIQuestion, User
from ..services.ai_insights import call_llm
from ..services.analysis import analyze_finances
from ..services.validation import validate_ai_response
from ..store import get_user_transactions

router = APIRouter(prefix="/ai", tags=["AI Insights"])


@router.post("/insights")
def ai_insights(body: AIQuestion, user: User = Depends(current_user)):
    analysis = analyze_finances(get_user_transactions(user.id))
    answer = call_llm(body.question, analysis)
    check = validate_ai_response(answer, analysis)
    return {"answer": answer, "validation": check}
