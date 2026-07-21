"""
GET /api/verify?token=xxx

Verify a magic link token. If valid, set session cookie and redirect to /dashboard.
If invalid, redirect to /login?error=expired
"""

import os
import sys
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

from auth import consume_magic_token, create_session_cookie, build_cookie_header


SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://stratasnap.com.au").rstrip("/")


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        token = params.get("token", [None])[0]

        if not token:
            self._redirect(f"{SITE_URL}/login?error=missing")
            return

        email = consume_magic_token(token)
        if not email:
            self._redirect(f"{SITE_URL}/login?error=expired")
            return

        session_cookie = create_session_cookie(email)
        cookie_header = build_cookie_header(session_cookie)

        self.send_response(302)
        self.send_header("Location", f"{SITE_URL}/dashboard")
        self.send_header("Set-Cookie", cookie_header)
        self.end_headers()

    def _redirect(self, url):
        self.send_response(302)
        self.send_header("Location", url)
        self.end_headers()
