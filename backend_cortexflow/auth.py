"""
Auth helpers.

Demo only: the user id comes from the X-User-Id header.
In production, read the user from the Supabase JWT instead.
"""

from fastapi import Depends, Header, HTTPException

from .models import User
from .store import USERS


def current_user(x_user_id: str = Header(...)) -> User:
    user = USERS.get(x_user_id)
    if not user or not user.is_active:
        raise HTTPException(401, "Unknown or inactive user")
    return user


def admin_only(user: User = Depends(current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(403, "Admin access required")
    return user
