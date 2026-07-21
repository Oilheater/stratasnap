"""
POST /api/lead

Receives form submissions from /conveyancers and /buyers-agents pages.
Stores in Supabase and sends notification email.

Body JSON:
  firm_name: str
  contact_name: str
  contact_email: str
  phone: str (optional)
  estimated_monthly_reports: int (optional)
  notes: str (optional)
  lead_type: 'conveyancer' | 'buyers_agent'
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

# Add _lib to path so we can import supabase_client
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

from supabase_client import SupabaseClient
import httpx


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)

            lead_type = data.get("lead_type", "").strip()
            if lead_type not in ("conveyancer", "buyers_agent"):
                self._respond(400, {"error": "Invalid lead_type"})
                return

            required = ["firm_name", "contact_name", "contact_email"]
            for f in required:
                if not data.get(f, "").strip():
                    self._respond(400, {"error": f"Missing required field: {f}"})
                    return

            table = (
                "conveyancer_leads"
                if lead_type == "conveyancer"
                else "buyers_agent_leads"
            )

            record = {
                "firm_name": data.get("firm_name", "").strip(),
                "contact_name": data.get("contact_name", "").strip(),
                "contact_email": data.get("contact_email", "").strip(),
                "phone": data.get("phone", "").strip() or None,
                "estimated_monthly_reports": data.get("estimated_monthly_reports"),
                "notes": data.get("notes", "").strip() or None,
            }

            try:
                client = SupabaseClient()
                lead = client.insert(table, record)
            except Exception as e:
                # DB failure — still try to send email so we don't lose the lead
                lead = record
                lead["db_error"] = str(e)

            # Send notification email
            self._send_notification(lead_type, record)

            self._respond(200, {"success": True})

        except Exception as e:
            self._respond(500, {"error": "Internal error"})

    def _send_notification(self, lead_type, record):
        resend_key = os.environ.get("RESEND_API_KEY")
        if not resend_key:
            return  # No email service configured, skip silently

        label = "Conveyancer" if lead_type == "conveyancer" else "Buyers' Agent"
        subject = f"New {label} lead: {record['firm_name']}"
        html = f"""
        <h2>New {label} lead</h2>
        <p><strong>Firm:</strong> {record['firm_name']}</p>
        <p><strong>Contact:</strong> {record['contact_name']}</p>
        <p><strong>Email:</strong> {record['contact_email']}</p>
        <p><strong>Phone:</strong> {record.get('phone') or '—'}</p>
        <p><strong>Monthly reports:</strong> {record.get('estimated_monthly_reports') or '—'}</p>
        <p><strong>Notes:</strong> {record.get('notes') or '—'}</p>
        """

        try:
            httpx.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {resend_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": "StrataSnap <hello@stratasnap.com.au>",
                    "to": ["hello@stratasnap.com.au"],
                    "subject": subject,
                    "html": html,
                    "reply_to": record["contact_email"],
                },
                timeout=10,
            )
        except Exception:
            pass  # Don't fail the request if email fails

    def _respond(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
