"""
Supabase server client. Uses service_role key — full DB access.
NEVER expose this to browsers.
"""

import os
from typing import Optional, Dict, Any, List
import httpx


class SupabaseClient:
    def __init__(self):
        self.url = os.environ.get("SUPABASE_URL", "").rstrip("/")
        self.key = os.environ.get("SUPABASE_SECRET_KEY")
        if not self.url or not self.key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SECRET_KEY must be set")

    def _headers(self):
        return {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    def insert(self, table: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        url = f"{self.url}/rest/v1/{table}"
        r = httpx.post(url, json=data, headers=self._headers(), timeout=10)
        r.raise_for_status()
        result = r.json()
        return result[0] if result else None

    def update(self, table: str, filters: Dict[str, Any], data: Dict[str, Any]):
        url = f"{self.url}/rest/v1/{table}"
        params = "&".join([f"{k}=eq.{v}" for k, v in filters.items()])
        r = httpx.patch(f"{url}?{params}", json=data, headers=self._headers(), timeout=10)
        r.raise_for_status()
        return r.json()

    def select(self, table: str, filters: Optional[Dict[str, Any]] = None, single: bool = False) -> Any:
        url = f"{self.url}/rest/v1/{table}"
        params = ""
        if filters:
            params = "?" + "&".join([f"{k}=eq.{v}" for k, v in filters.items()])
        headers = self._headers()
        if single:
            headers["Accept"] = "application/vnd.pgrst.object+json"
        r = httpx.get(f"{url}{params}", headers=headers, timeout=10)
        if r.status_code == 406 and single:
            return None
        r.raise_for_status()
        return r.json()

    def upsert(self, table: str, data: Dict[str, Any], on_conflict: str = "email") -> Optional[Dict[str, Any]]:
        url = f"{self.url}/rest/v1/{table}?on_conflict={on_conflict}"
        headers = self._headers()
        headers["Prefer"] = "resolution=merge-duplicates,return=representation"
        r = httpx.post(url, json=data, headers=headers, timeout=10)
        r.raise_for_status()
        result = r.json()
        return result[0] if result else None


# ────────────────────────────────────────────────────────────
# High-level helpers
# ────────────────────────────────────────────────────────────

def get_or_create_customer(email: str) -> Dict[str, Any]:
    """Returns the customer record, creating if needed."""
    client = SupabaseClient()
    existing = client.select("customers", {"email": email}, single=True)
    if existing:
        return existing
    return client.insert("customers", {"email": email})


def add_credits(email: str, credits: int, amount_cents: int) -> Dict[str, Any]:
    """Add credits to a customer. Returns updated customer record."""
    client = SupabaseClient()
    customer = get_or_create_customer(email)
    new_remaining = customer["credits_remaining"] + credits
    new_purchased = customer["credits_purchased"] + credits
    new_spent = customer["total_spent_cents"] + amount_cents
    result = client.update("customers", {"email": email}, {
        "credits_remaining": new_remaining,
        "credits_purchased": new_purchased,
        "total_spent_cents": new_spent,
    })
    return result[0] if result else None


def deduct_credit(email: str) -> bool:
    """Deduct one credit. Returns True if successful, False if no credits."""
    client = SupabaseClient()
    customer = client.select("customers", {"email": email}, single=True)
    if not customer or customer["credits_remaining"] < 1:
        return False
    client.update("customers", {"email": email}, {
        "credits_remaining": customer["credits_remaining"] - 1,
        "credits_used": customer["credits_used"] + 1,
    })
    return True


def record_purchase(email: str, stripe_session_id: str, tier: str, amount_cents: int, credits: int, payment_intent: Optional[str] = None):
    """Record a Stripe purchase. Idempotent — checks for existing session."""
    client = SupabaseClient()
    existing = client.select("purchases", {"stripe_session_id": stripe_session_id}, single=True)
    if existing:
        return existing
    customer = get_or_create_customer(email)
    return client.insert("purchases", {
        "customer_id": customer["id"],
        "email": email,
        "stripe_session_id": stripe_session_id,
        "stripe_payment_intent": payment_intent,
        "amount_cents": amount_cents,
        "tier": tier,
        "credits_granted": credits,
    })


def record_report(email: str, summary_json: dict, property_address: Optional[str] = None, filename: Optional[str] = None) -> Dict[str, Any]:
    """Store a completed report."""
    client = SupabaseClient()
    customer = get_or_create_customer(email)
    return client.insert("reports", {
        "customer_id": customer["id"],
        "email": email,
        "property_address": property_address,
        "original_filename": filename,
        "summary_json": summary_json,
        "status": "completed",
    })
