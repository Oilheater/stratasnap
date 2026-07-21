"""
GET /api/report?id=<uuid>

Returns a single report by ID.
Requires session cookie. Only returns reports belonging to the logged-in email.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

from auth import get_email_from_request
from supabase_client import SupabaseClient


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        email = get_email_from_request(self.headers)
        if not email:
            self._respond(401, {"error": "not_authenticated"})
            return

        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        report_id = params.get("id", [None])[0]

        if not report_id:
            self._respond(400, {"error": "missing_id"})
            return

        try:
            client = SupabaseClient()
            report = client.select("reports", {"id": report_id}, single=True)
            if not report:
                self._respond(404, {"error": "not_found"})
                return
            # Verify it belongs to this session's email
            if report.get("email", "").lower() != email.lower():
                self._respond(403, {"error": "forbidden"})
                return
            self._respond(200, {
                "id": report.get("id"),
                "created_at": report.get("created_at"),
                "property_address": report.get("property_address"),
                "summary_json": report.get("summary_json"),
                "scheduled_deletion_at": report.get("scheduled_deletion_at"),
            })
        except Exception:
            self._respond(500, {"error": "internal_error"})

    def _respond(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)
