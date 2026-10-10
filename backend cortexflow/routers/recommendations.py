"""FR7 route: GET /recommendations"""

from fastapi import APIRouter, Depends

from ..auth import current_user
from ..models import User
from ..services.analysis import analyze_finances
from ..services.recommendations import generate_recommendations
from ..store import get_user_transactions

router = APIRouter(tags=["Recommendations"])


@router.get("/recommendations")
def get_recommendations(user: User = Depends(current_user)):
    analysis = analyze_finances(get_user_transactions(user.id))
    return {"recommendations": generate_recommendations(analysis)}
