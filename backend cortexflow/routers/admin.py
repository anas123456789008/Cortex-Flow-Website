"""FR13 routes: Admin can manage users."""

from fastapi import APIRouter, Depends, HTTPException

from ..auth import admin_only
from ..models import User, UserUpdate
from ..store import USERS, delete_user_data

router = APIRouter(prefix="/admin/users", tags=["Admin"])


@router.get("")
def list_users(_: User = Depends(admin_only)):
    return list(USERS.values())


@router.post("", status_code=201)
def create_user(user: User, _: User = Depends(admin_only)):
    if user.id in USERS:
        raise HTTPException(409, "User already exists")
    USERS[user.id] = user
    return user


@router.patch("/{user_id}")
def update_user(user_id: str, changes: UserUpdate, _: User = Depends(admin_only)):
    user = USERS.get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    USERS[user_id] = user.model_copy(update=changes.model_dump(exclude_none=True))
    return USERS[user_id]


@router.delete("/{user_id}")
def delete_user(user_id: str, admin: User = Depends(admin_only)):
    if user_id == admin.id:
        raise HTTPException(400, "Admins cannot delete themselves")
    if USERS.pop(user_id, None) is None:
        raise HTTPException(404, "User not found")
    delete_user_data(user_id)
    return {"deleted": user_id}
