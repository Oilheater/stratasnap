"""
POST /api/stripe-webhook

Receives Stripe events. On checkout.session.completed:
1. Determine tier from Payment Link (via metadata or price ID mapping)
2. Add credits to customer in Supabase
3. Record purchase
4. Send purchase confirmation email
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

import stripe
from supabase_client import add_credits, record_purchase
from mailer import email_purchase_confirmation


SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://stratasnap.com.au").rstrip("/")


# Map Stripe Payment Link IDs (or price IDs) to tiers.
# When you create your Payment Links, set metadata: { "tier": "single" | "fivepack" | "tenpack" }
# The webhook reads that metadata directly.

TIER_CREDITS = {
    "single": 1,
    "fivepack": 5,
    "tenpack": 10,
}


def determine_tier(session) -> str:
    """
    Figure out which tier the customer bought.
    Preferred: Payment Link metadata `tier` = 'single' | 'fivepack' | 'tenpack'
    Fallback: amount matching.
    """
    metadata = session.get("metadata") or {}
    tier = metadata.get("tier")
    if tier in TIER_CREDITS:
        return tier

    # Fallback: match by amount (cents, AUD)
    amount = session.get("amount_total", 0)
    if amount == 1999:
        return "single"
    if amount == 4999:
        return "fivepack"
    if amount == 9999:
        return "tenpack"
    return "single"  # safe default


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            payload = self.rfile.read(content_length)
            sig_header = self.headers.get("Stripe-Signature", "")

            webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
            stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

            if not webhook_secret or not stripe.api_key:
                self._respond(500, {"error": "Server not configured"})
                return

            try:
                event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
            except ValueError:
                self._respond(400, {"error": "Invalid payload"})
                return
            except stripe.error.SignatureVerificationError:
                self._respond(400, {"error": "Invalid signature"})
                return

            if event["type"] == "checkout.session.completed":
                session = event["data"]["object"]
                self._handle_checkout_completed(session)

            self._respond(200, {"received": True})

        except Exception:
            self._respond(500, {"error": "Internal error"})

    def _handle_checkout_completed(self, session):
        session_id = session.get("id")
        customer_details = session.get("customer_details") or {}
        email = (customer_details.get("email") or "").lower().strip()
        amount_cents = session.get("amount_total", 0)
        payment_intent = session.get("payment_intent")

        if not email:
            return

        tier = determine_tier(session)
        credits = TIER_CREDITS.get(tier, 1)

        # Record the purchase (idempotent)
        record_purchase(email, session_id, tier, amount_cents, credits, payment_intent)

        # Add credits to customer
        add_credits(email, credits, amount_cents)

        # Send purchase confirmation email
        dashboard_url = f"{SITE_URL}/dashboard"
        email_purchase_confirmation(email, tier, credits, dashboard_url)

    def _respond(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)
