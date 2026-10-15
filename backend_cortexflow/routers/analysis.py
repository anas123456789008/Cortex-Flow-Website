"""FR6 route: GET /analysis"""

from fastapi import APIRouter, Depends

from ..auth import current_user
from ..models import User
from ..services.analysis import analyze_finances
from ..store import get_user_transactions

router = APIRouter(tags=["Analysis"])


@router.get("/analysis")
def get_analysis(user: User = Depends(current_user)):
    return analyze_finances(get_user_transactions(user.id))
