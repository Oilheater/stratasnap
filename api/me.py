"""
GET /api/me

Returns the current session's customer data (credits, past reports).
Used by the dashboard to hydrate.
Returns 401 if not logged in.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

from auth import get_email_from_request
from supabase_client import SupabaseClient


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        email = get_email_from_request(self.headers)
        if not email:
            self._respond(401, {"error": "not_authenticated"})
            return

        try:
            client = SupabaseClient()
            customer = client.select("customers", {"email": email}, single=True)
            reports = client.select("reports", {"email": email}) or []
            # Sort reports newest first
            reports.sort(key=lambda r: r.get("created_at", ""), reverse=True)
            # Only include fields relevant to the dashboard
            reports_out = [{
                "id": r.get("id"),
                "created_at": r.get("created_at"),
                "property_address": r.get("property_address"),
                "original_filename": r.get("original_filename"),
                "status": r.get("status"),
                "scheduled_deletion_at": r.get("scheduled_deletion_at"),
            } for r in reports]

            self._respond(200, {
                "email": email,
                "credits_remaining": customer.get("credits_remaining", 0) if customer else 0,
                "credits_used": customer.get("credits_used", 0) if customer else 0,
                "reports": reports_out,
            })
        except Exception:
            self._respond(500, {"error": "internal_error"})

    def _respond(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)
