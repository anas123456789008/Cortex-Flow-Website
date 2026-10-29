"""Supabase access-token validation for FastAPI routes.

The API never trusts a user ID supplied by the browser. It validates the
Bearer token with Supabase Auth and derives the user identity from that
verified response.
"""
import os

import httpx
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .models import User

_bearer = HTTPBearer(auto_error=False)


def current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> User:
    """Validate the Supabase access token and return the authenticated user."""
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    supabase_url = (os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL") or "").rstrip("/")
    supabase_key = (
        os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("SUPABASE_PUBLISHABLE_KEY")
        or os.getenv("SUPABASE_PUBLISHABLE_DEFAULT_KEY")
        or os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")
        or ""
    )
    if not supabase_url or not supabase_key:
        raise HTTPException(
            status_code=503,
            detail="Authentication service is not configured on the backend.",
        )

    try:
        response = httpx.get(
            f"{supabase_url}/auth/v1/user",
            headers={
                "apikey": supabase_key,
                "Authorization": f"Bearer {credentials.credentials}",
            },
            timeout=8.0,
        )
    except httpx.HTTPError:
        raise HTTPException(
            status_code=503,
            detail="Authentication service is temporarily unavailable.",
        )

    if response.status_code in (401, 403):
        raise HTTPException(
            status_code=401,
            detail="Your session is invalid or expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if response.status_code != 200:
        raise HTTPException(
            status_code=503,
            detail="Could not validate the session with the authentication service.",
        )

    try:
        identity = response.json()
        user_id = identity["id"]
    except (ValueError, KeyError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid authentication response.")

    email = identity.get("email") or ""
    metadata = identity.get("user_metadata") or {}
    app_metadata = identity.get("app_metadata") or {}
    # Roles must come from server-controlled app_metadata, never user_metadata.
    role = "admin" if app_metadata.get("role") == "admin" else "user"

    return User(
        id=str(user_id),
        name=str(metadata.get("name") or metadata.get("full_name") or (email.split("@")[0] if email else user_id)),
        email=str(email),
        role=role,
        is_active=True,
    )


def admin_only(user: User = Depends(current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
