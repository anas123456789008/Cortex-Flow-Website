"""FR9 route: GET /dashboard (charts, summaries and insights)"""

from fastapi import APIRouter, Depends

from ..auth import current_user
from ..models import User
from ..services.analysis import analyze_finances
from ..services.recommendations import generate_recommendations
from ..store import get_user_transactions

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard")
def dashboard(user: User = Depends(current_user)):
    analysis = analyze_finances(get_user_transactions(user.id))
    trend = analysis["monthly_trend"]
    return {
        "summary": {
            "income": analysis["total_income"],
            "expenses": analysis["total_expenses"],
            "savings": analysis["net_savings"],
            "savings_rate_pct": analysis["savings_rate_pct"],
        },
        "charts": {
            "spending_pie": [{"label": k, "value": v}
                             for k, v in analysis["spending_by_category"].items()],
            "monthly_line": {
                "labels": [m["month"] for m in trend],
                "income": [m["income"] for m in trend],
                "expense": [m["expense"] for m in trend],
            },
        },
        "insights": [r["message"] for r in generate_recommendations(analysis)],
    }
