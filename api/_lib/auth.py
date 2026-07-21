"""
Magic link authentication.

Flow:
1. User enters email
2. Server generates token, stores in `magic_links` table (15 min expiry)
3. Email sent with link: /login?token=xxx
4. User clicks link → server verifies token → sets session cookie → redirects to /dashboard

Token: 64-char URL-safe random string.
Session cookie: signed JWT-like value with email + expiry.
"""

import os
import secrets
import hmac
import hashlib
import base64
import json
import time
from datetime import datetime, timedelta, timezone
from typing import Optional

import sys
sys.path.insert(0, os.path.dirname(__file__))
from supabase_client import SupabaseClient


SESSION_COOKIE_NAME = "stratasnap_session"
SESSION_DURATION_DAYS = 30


def _session_secret() -> bytes:
    secret = os.environ.get("SESSION_SECRET", "").encode()
    if not secret:
        # Derive from Supabase secret so we don't need another env var
        # (safe: session cookies aren't for authenticating to Supabase)
        secret = os.environ.get("SUPABASE_SECRET_KEY", "fallback-dev-secret").encode()
    return secret


def generate_magic_token(email: str, ip: Optional[str] = None) -> str:
    """Generate and store a magic link token. Returns the token."""
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    client = SupabaseClient()
    client.insert("magic_links", {
        "email": email.lower().strip(),
        "token": token,
        "expires_at": expires_at.isoformat(),
        "ip_address": ip,
    })
    return token


def consume_magic_token(token: str) -> Optional[str]:
    """
    Verify a magic link token. Marks it as used.
    Returns the email if valid, None if invalid/expired/used.
    """
    client = SupabaseClient()
    link = client.select("magic_links", {"token": token}, single=True)
    if not link:
        return None
    if link.get("used_at"):
        return None
    expires_at = datetime.fromisoformat(link["expires_at"].replace("Z", "+00:00"))
    if datetime.now(timezone.utc) > expires_at:
        return None
    # Mark used
    client.update("magic_links", {"token": token}, {
        "used_at": datetime.now(timezone.utc).isoformat(),
    })
    return link["email"]


def create_session_cookie(email: str) -> str:
    """Create a signed session cookie value: base64(payload).base64(signature)"""
    payload = {
        "email": email.lower().strip(),
        "exp": int(time.time()) + (SESSION_DURATION_DAYS * 86400),
        "iat": int(time.time()),
    }
    payload_json = json.dumps(payload, separators=(",", ":")).encode()
    payload_b64 = base64.urlsafe_b64encode(payload_json).rstrip(b"=").decode()

    signature = hmac.new(_session_secret(), payload_b64.encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).rstrip(b"=").decode()

    return f"{payload_b64}.{sig_b64}"


def verify_session_cookie(cookie_value: str) -> Optional[str]:
    """Verify a session cookie. Returns email if valid, None otherwise."""
    if not cookie_value or "." not in cookie_value:
        return None
    try:
        payload_b64, sig_b64 = cookie_value.split(".", 1)
        # Verify signature
        expected_sig = hmac.new(_session_secret(), payload_b64.encode(), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).rstrip(b"=").decode()
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None
        # Decode payload
        payload_json = base64.urlsafe_b64decode(payload_b64 + "=" * (-len(payload_b64) % 4))
        payload = json.loads(payload_json)
        # Check expiry
        if payload.get("exp", 0) < time.time():
            return None
        return payload.get("email")
    except Exception:
        return None


def build_cookie_header(cookie_value: str) -> str:
    """Build a Set-Cookie header value with proper security flags."""
    max_age = SESSION_DURATION_DAYS * 86400
    return (
        f"{SESSION_COOKIE_NAME}={cookie_value}; "
        f"Max-Age={max_age}; "
        f"Path=/; "
        f"HttpOnly; "
        f"Secure; "
        f"SameSite=Lax"
    )


def build_clear_cookie_header() -> str:
    return f"{SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax"


def get_email_from_request(headers) -> Optional[str]:
    """Extract email from session cookie in request headers."""
    cookie_header = headers.get("Cookie", "") or headers.get("cookie", "")
    if not cookie_header:
        return None
    for chunk in cookie_header.split(";"):
        chunk = chunk.strip()
        if chunk.startswith(f"{SESSION_COOKIE_NAME}="):
            value = chunk[len(SESSION_COOKIE_NAME) + 1:]
            return verify_session_cookie(value)
    return None
