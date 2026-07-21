"""
POST /api/login
Body: { "email": "user@example.com" }

Generates a magic link token, stores it in Supabase, emails the link.
Always returns 200 (don't leak whether an email exists in the system).
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

from auth import generate_magic_token
from mailer import email_magic_link


SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://stratasnap.com.au").rstrip("/")


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            email = data.get("email", "").strip().lower()

            if "@" not in email or len(email) < 5:
                self._respond(400, {"error": "Invalid email"})
                return

            # Get IP for logging (helpful for abuse tracking)
            ip = self.headers.get("X-Forwarded-For", "").split(",")[0].strip() or None

            token = generate_magic_token(email, ip)
            link_url = f"{SITE_URL}/api/verify?token={token}"

            email_magic_link(email, link_url)

            self._respond(200, {"success": True, "message": "If that email is on file, we've sent a login link."})

        except Exception:
            self._respond(500, {"error": "Internal error"})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _respond(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)
