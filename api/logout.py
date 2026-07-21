"""
GET /api/logout

Clears the session cookie and redirects to home.
"""

import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

from auth import build_clear_cookie_header


SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://stratasnap.com.au").rstrip("/")


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(302)
        self.send_header("Location", SITE_URL)
        self.send_header("Set-Cookie", build_clear_cookie_header())
        self.end_headers()
