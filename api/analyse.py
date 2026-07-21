"""
POST /api/analyse

Receives a multipart/form-data PDF upload.
Runs the StrataSnap two-pass analysis pipeline (guard + extraction).

Auth flow:
- Session cookie + credits: full analysis, deduct credit, save to DB, email summary.
- No session / no credits: full analysis runs, but returns TEASER version
  (property ID + fund balances + finding counts, actual findings locked).

Env vars required:
  ANTHROPIC_API_KEY
  SUPABASE_URL
  SUPABASE_SECRET_KEY
  RESEND_API_KEY
"""

import json
import os
import sys
import tempfile
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_lib"))

import anthropic
from pypdf import PdfReader

from auth import get_email_from_request
from supabase_client import SupabaseClient, deduct_credit, record_report
from mailer import email_report_ready


MODEL = "claude-opus-4-8"
MAX_FILE_SIZE_MB = 50
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://stratasnap.com.au").rstrip("/")


GUARD_PROMPT = """You are a document classifier for StrataSnap, a NSW strata report summarisation service.

Determine whether this document is a NSW strata inspection report or contains substantial strata-scheme records (Section 184 certificate, owners corporation minutes, financial statements, by-laws, insurance certificates).

Acceptable:
- Full strata inspection reports for property buyers
- Section 184 strata information certificates
- Owners corporation records bundles (minutes, financials, by-laws, insurance certificates)
- NSW strata records assembled by strata managers or inspectors

NOT acceptable:
- Contracts of sale, vendor disclosure statements
- Building/pest inspection reports
- Property valuations, marketing brochures, loan documents
- Anything unrelated to a NSW strata scheme

Return JSON only:
{
  "is_strata_document": true | false,
  "confidence": "high" | "medium" | "low",
  "document_type": "<short description>",
  "reason_if_rejected": "<plain-English reason if not strata, else null>"
}"""


EXTRACTION_PROMPT = """You are a forensic document analyst for StrataSnap. You are given the full text of a NSW strata inspection report or owners corporation records bundle.

Extract factual information ONLY. You are not a lawyer, financial adviser, strata inspector, or conveyancer. You do not advise on whether to buy, predict the future, or interpret legal enforceability. Extract what is in the document and explain what each thing means in plain English, anchored in the relevant section of the Strata Schemes Management Act 2015 (NSW).

CRITICAL RULES:
1. NEVER use "should", "shouldn't", "recommend", "advise", "good/bad investment", "risky/safe purchase".
2. NEVER predict future events. Do not extrapolate beyond the document.
3. NEVER claim a by-law is enforceable or unenforceable. State what it says.
4. NEVER claim legal defects, only that the report identifies issues at specific pages.
5. ALWAYS cite the page number from the source PDF.
6. ALWAYS reference the SSM Act 2015 section using format "(SSM Act s.X)".
7. If information is unclear, missing, or not addressed in the document, output "not_provided" for that field. NEVER invent or infer content that is not in the document. A field marked "not_provided" is itself a valuable finding — it tells the buyer the document is silent on that topic.
8. Plain-English explanations should be 1-2 sentences, neutral tone.

KEY SSM ACT 2015 (NSW) SECTIONS TO ANCHOR FINDINGS:
- s.73: administrative fund — operational expenses
- s.74: capital works fund — long-term major repairs (formerly "sinking fund")
- s.79-81: contributions, estimates, 10-year capital works fund plan
- s.80: 10-year capital works fund plan must be prepared
- s.83: levying of contributions (the collection mechanism)
- s.81(4): special contributions for specific capital works fund expenditure
- s.85: overdue contributions, interest, payment plans
- s.92-95: financial statements, auditing
- s.102: spending limits ($30,000 threshold)
- s.103: legal services >$15,000 requires general meeting
- s.106: duty to maintain and repair common property
- s.108: changes to common property require special resolution
- s.110: minor renovations by owners
- s.115: initial maintenance schedule
- s.118: window safety devices (child safety, mandatory)
- s.123: fire safety inspections
- s.132-139: by-laws — what they can cover, restrictions
- s.137: occupancy limits
- s.137A: short-term rental accommodation (STRA) by-laws — NOTE: s.137A permits by-laws restricting STRA in certain circumstances, BUT an owner who uses the lot as their principal place of residence may let it short-term subject to day caps regardless of the by-law. State what the by-law says, note the principal-place-of-residence carve-out exists, do not opine on enforceability.
- s.137B: keeping of animals — NOTE: s.137B provides that a by-law must not unreasonably prohibit the keeping of an animal on a lot. A by-law requiring consent is not automatically void — the question is whether the consent process is reasonable. State what the by-law says and note that s.137B restricts unreasonable prohibition, do not declare the by-law void or enforceable.
- s.139: restrictions on by-laws — cannot be harsh, unconscionable, or oppressive
- s.160-164: insurance obligations, minimum $20M public liability (SSM Regulation 2016 cl.40)
- s.182: right to inspect strata records (the "search")
- s.184: strata information certificate — what must be included. NOTE: under s.185, a s.184 certificate is conclusive evidence of the matters stated in it. When processing a s.184 certificate, note this status — it means the information carries legal weight and accuracy of extraction is especially important.
- Part 11 (s.189-215): building defects, building bonds, decennial insurance

COMPLIANCE / FIRE SAFETY — EXTRACT AS A FIRST-CLASS CATEGORY:
This is a high-value category for buyers. Extract each of the following. If the document does not address a topic, output "not_provided" — do not infer or guess. A "not_provided" finding is itself valuable (it tells the buyer the document is silent on that topic).

Severity calibration (NSW-specific):
- Overdue AFSS or active cladding rectification order = "critical"
- Fire safety measure deficiency, expired anchor point certification = "attention"
- WHS on purely residential scheme with no direct workers = "clear" (low concern)
- Asbestos register present and managed = "clear"; asbestos present with no register/plan = "attention"
- Missing information on AFSS or cladding = "attention" (silence on these topics is itself a concern)

SECTION 184 ITEM 12A — OUTSTANDING ORDERS:
This is the highest-severity flag on a s.184 certificate. Look for: rectification orders, Residential Apartment Buildings (RAB) Act building work rectification orders, EP&A Act development control orders, combustible cladding orders, Cladding Product Safety Panel references. If ANY outstanding order is present, it must be surfaced prominently with severity "critical". If none are present, state "no outstanding orders noted."

EMBEDDED NETWORK / EXCLUSIVE SUPPLY:
Look for references to embedded electricity networks, exclusive supply arrangements, or "embedded network" / "exclusive supply network" on the s.184 form. These affect the buyer's choice of energy retailer after purchase. Surface if present.

OUTPUT FORMAT — return JSON only:

{
  "property_identification": {
    "address_as_stated": "<address or null>",
    "strata_plan_number": "<SP number or null>",
    "report_prepared_by": "<inspector/firm or null>",
    "report_date": "<date or null>",
    "lot_number_inspected": "<lot or null>"
  },
  "document_type_detected": "<strata inspection report | s.184 certificate | OC records bundle | other>",
  "is_section_184_certificate": false,
  "section_185_note": "If this is a s.184 certificate: under s.185 of the SSM Act 2015, this certificate is conclusive evidence of the matters stated in it.",
  "scheme_overview": {
    "total_lots": "<number or null>",
    "scheme_age_or_registration_date": "<date or null>",
    "building_type": "<description or null>",
    "strata_manager": "<firm and licence if stated, else null>",
    "building_manager": "<name or null>"
  },
  "financial_position": {
    "administrative_fund_balance": {
      "amount": "<amount or null>",
      "as_at_date": "<date or null>",
      "page_reference": "<page>",
      "explanation": "<plain English with SSM s.73 reference>"
    },
    "capital_works_fund_balance": {
      "amount": "<amount or null>",
      "as_at_date": "<date or null>",
      "page_reference": "<page>",
      "explanation": "<plain English with SSM s.74 reference>"
    },
    "ten_year_capital_works_fund_plan": {
      "is_referenced": true,
      "forecast_total_spend": "<amount or null>",
      "forecast_period": "<period or null>",
      "page_reference": "<page>",
      "explanation": "<plain English with SSM s.80 reference>"
    },
    "current_quarterly_levies": {
      "administrative_fund_levy": "<amount or null>",
      "capital_works_fund_levy": "<amount or null>",
      "special_levy_in_force": "<amount and purpose or null>",
      "page_reference": "<page>"
    },
    "outstanding_arrears": {
      "total_amount_owed_by_lot_owners": "<amount or null>",
      "arrears_for_subject_lot": "<amount or null>",
      "page_reference": "<page>",
      "explanation": "<plain English with SSM s.85 reference>"
    }
  },
  "special_levies_history": [],
  "by_laws_summary": {
    "registered_by_laws_count": "<number or null>",
    "notable_by_laws": [
      {
        "by_law_number": "<number>",
        "topic": "<pets | short-term letting | renovations | parking | noise | smoking | other>",
        "what_it_says": "<plain English summary of what the by-law provides>",
        "statutory_reference": "<e.g. SSM Act s.137B>",
        "page_reference": "<page>"
      }
    ]
  },
  "insurance": {
    "building_replacement_value": "<amount or null>",
    "policy_expiry": "<date or null>",
    "insurer": "<name or null>",
    "public_liability_cover": "<amount or null>",
    "workers_compensation": "<status or not_provided>",
    "page_reference": "<page>",
    "explanation": "<plain English with SSM s.160, s.161, s.164, Reg cl.40 reference>"
  },
  "building_condition_and_defects": {
    "defects_identified_in_report": [
      {
        "issue": "<short description>",
        "location": "<location or not stated>",
        "severity_as_stated": "<severity or not stated>",
        "context": "<additional context>",
        "page_reference": "<page>"
      }
    ],
    "active_part_11_defect_proceedings": {
      "any_referenced": false,
      "details": "<details or null>",
      "page_reference": "<page or null>"
    }
  },
  "compliance": {
    "overall_risk_rating": "<clear | attention | critical>",
    "annual_fire_safety_statement": {
      "status": "<current | overdue | not_provided>",
      "last_lodged_date": "<date or not_provided>",
      "next_due_date": "<date or not_provided>",
      "months_overdue": "<number or null>",
      "page_reference": "<page or null>",
      "explanation": "<plain English. If overdue, note: an overdue AFSS can affect the building's insurance position. If not_provided, note: the document does not address AFSS status.>"
    },
    "fire_safety_measures": {
      "status": "<compliant | deficiencies_noted | not_provided>",
      "deficiencies": "<short description of any noted deficiencies in sprinklers, alarms, egress, fire doors, or null>",
      "page_reference": "<page or null>"
    },
    "building_defect_orders": {
      "has_outstanding_orders": "<true | false | not_provided>",
      "orders": [
        {
          "order_type": "<rectification order | RAB Act building work rectification order | EP&A development control order | cladding rectification order | other>",
          "description": "<description>",
          "issuing_body": "<e.g. NSW Fair Trading, local council, Secretary>",
          "page_reference": "<page>"
        }
      ],
      "explanation": "<plain English. This is the highest-severity flag — surface prominently.>"
    },
    "cladding": {
      "status": "<identified | rectified | under_order | none_noted | not_provided>",
      "details": "<description or null>",
      "page_reference": "<page or null>",
      "explanation": "<plain English. Any mention of combustible cladding = attention minimum.>"
    },
    "whs": {
      "status": "<compliant | issues_noted | not_applicable | not_provided>",
      "note": "<description or null>",
      "page_reference": "<page or null>"
    },
    "anchor_points_height_safety": {
      "status": "<certified | expired | not_provided>",
      "certification_date": "<date or not_provided>",
      "page_reference": "<page or null>"
    },
    "asbestos": {
      "status": "<present_and_managed | present_no_register | none_noted | not_provided>",
      "register_present": "<true | false | not_provided>",
      "page_reference": "<page or null>",
      "explanation": "<plain English. Frame as 'present and managed' vs 'present, no register or management plan noted'. Expected in pre-1990 buildings; mere presence with a register is not alarming.>"
    },
    "window_safety_devices": {
      "status": "<compliant | non_compliant | not_provided>",
      "page_reference": "<page or null>",
      "explanation": "<plain English with SSM s.118 reference>"
    },
    "missing_information": "<list any compliance topics the document does not address — e.g. 'The document does not address AFSS status, asbestos, or anchor point certification.' This is a first-class finding, not an error.>"
  },
  "embedded_network": {
    "has_embedded_network": "<true | false | not_provided>",
    "details": "<description of the arrangement or null>",
    "page_reference": "<page or null>",
    "explanation": "<plain English — an embedded network may limit the buyer's choice of electricity retailer after purchase.>"
  },
  "disputes_and_legal_matters": {
    "ncat_proceedings_referenced": [],
    "legal_costs_in_financials": "<amount or null>",
    "explanation": "<plain English>"
  },
  "items_for_buyer_to_discuss_with_their_conveyancer": [],
  "items_unclear_or_missing_from_report": [],
  "extraction_confidence": "high | medium | low",
  "extraction_notes": "<caveats>"
}

IMPORTANT — for every field: if the document does not address the topic, output "not_provided" rather than null or an empty string. An explicit "not_provided" tells the buyer the document is silent on that topic, which is itself a useful finding.

Empty arrays for list fields with no relevant findings. Do not invent content."""


def _extract_pdf_text(pdf_path):
    """Extract text from PDF, including AcroForm field values for fillable PDFs."""
    reader = PdfReader(pdf_path)
    parts = []

    # Extract page text
    for i, page in enumerate(reader.pages):
        page_num = i + 1
        try:
            text = page.extract_text() or ""
        except Exception as e:
            text = f"[Could not extract text from this page: {e}]"
        parts.append(f"\n=== PAGE {page_num} ===\n{text}")

    # Extract AcroForm field values (for fillable PDFs like s.184 certificates)
    try:
        fields = reader.get_fields()
        if fields:
            form_parts = ["\n=== FORM FIELD VALUES (from fillable PDF) ==="]
            for field_name, field_obj in fields.items():
                value = None
                if isinstance(field_obj, dict):
                    value = field_obj.get("/V") or field_obj.get("value")
                elif hasattr(field_obj, "value"):
                    value = field_obj.value
                if value and str(value).strip():
                    # Clean the field name and value
                    clean_name = str(field_name).strip()
                    clean_value = str(value).strip()
                    if clean_value and clean_value != "None":
                        form_parts.append(f"{clean_name}: {clean_value}")
            if len(form_parts) > 1:  # Only add if we found actual values
                parts.append("\n".join(form_parts))
    except Exception:
        pass  # Not a fillable form, or form parsing failed — continue with text only

    return "".join(parts)


def _strip_json_fences(raw):
    raw = raw.strip()
    if raw.startswith("```"):
        parts = raw.split("```")
        if len(parts) >= 2:
            raw = parts[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()
    return raw


def _run_guard(client, document_text):
    sample = document_text[:8000]
    response = client.messages.create(
        model=MODEL,
        max_tokens=500,
        system=GUARD_PROMPT,
        messages=[{"role": "user", "content": sample}],
    )
    raw = _strip_json_fences(response.content[0].text)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"is_strata_document": False, "confidence": "low", "document_type": "unknown", "reason_if_rejected": "Unable to verify document type."}


def _run_extraction(client, document_text):
    response = client.messages.create(
        model=MODEL,
        max_tokens=12000,
        system=EXTRACTION_PROMPT,
        messages=[{"role": "user", "content": document_text}],
    )
    raw = _strip_json_fences(response.content[0].text)
    return json.loads(raw)


def _build_teaser(full_summary):
    """
    Build a teaser version of the summary for unpaid users.
    Shows: property ID, fund balances, finding counts.
    Locks: actual findings, conveyancer items, compliance details.
    """
    prop = full_summary.get("property_identification", {})
    fin = full_summary.get("financial_position", {})
    compliance = full_summary.get("compliance", {})

    # Count findings across categories
    defects = full_summary.get("building_condition_and_defects", {})
    defect_count = len(defects.get("defects_identified_in_report", []))
    bylaw_count = len((full_summary.get("by_laws_summary", {}).get("notable_by_laws", [])))
    conveyancer_count = len(full_summary.get("items_for_buyer_to_discuss_with_their_conveyancer", []))
    missing_count = len(full_summary.get("items_unclear_or_missing_from_report", []))
    disputes = full_summary.get("disputes_and_legal_matters", {})
    dispute_count = len(disputes.get("ncat_proceedings_referenced", []))
    compliance_risk = compliance.get("overall_risk_rating", "unknown")
    has_outstanding_orders = (compliance.get("building_defect_orders", {}).get("has_outstanding_orders") == True)

    return {
        "property_identification": prop,
        "document_type_detected": full_summary.get("document_type_detected"),
        "scheme_overview": full_summary.get("scheme_overview", {}),
        "financial_position": {
            "administrative_fund_balance": fin.get("administrative_fund_balance"),
            "capital_works_fund_balance": fin.get("capital_works_fund_balance"),
        },
        "finding_counts": {
            "defects_flagged": defect_count,
            "notable_by_laws": bylaw_count,
            "items_for_conveyancer": conveyancer_count,
            "items_unclear_or_missing": missing_count,
            "disputes_or_proceedings": dispute_count,
            "compliance_risk_rating": compliance_risk,
            "has_outstanding_orders": has_outstanding_orders,
        },
        "locked": True,
        "unlock_message": "Pay to unlock the full summary — all findings, compliance details, and items to discuss with your conveyancer.",
    }


def analyse_pdf(pdf_path, filename=None):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return {"error": "configuration_error", "message": "Server configuration issue. Please email hello@stratasnap.com.au."}

    client = anthropic.Anthropic(api_key=api_key)
    document_text = _extract_pdf_text(pdf_path)

    if len(document_text.strip()) < 200:
        return {"error": "document_unreadable", "message": "We couldn't read enough text from this PDF. It may be a scanned document or an interactive form we can't read. Please email hello@stratasnap.com.au and we'll assist."}

    guard_result = _run_guard(client, document_text)
    if not guard_result.get("is_strata_document"):
        return {"error": "wrong_document_type", "guard_result": guard_result, "message": guard_result.get("reason_if_rejected", "This does not appear to be a NSW strata inspection report.")}

    try:
        extraction = _run_extraction(client, document_text)
    except json.JSONDecodeError:
        return {"error": "extraction_failed", "message": "We had trouble parsing this document. Please email hello@stratasnap.com.au and we'll process it manually."}

    return {"status": "ok", "guard": guard_result, "summary": extraction}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_type = self.headers.get("Content-Type", "")
            content_length = int(self.headers.get("Content-Length", 0))

            if content_length > MAX_FILE_SIZE_MB * 1024 * 1024:
                self._respond(413, {"error": "file_too_large", "message": f"File exceeds {MAX_FILE_SIZE_MB}MB."})
                return

            if "multipart/form-data" not in content_type:
                self._respond(400, {"error": "invalid_request", "message": "Expected multipart/form-data upload."})
                return

            # Check session
            email = get_email_from_request(self.headers)
            has_credit = False
            if email:
                try:
                    db = SupabaseClient()
                    customer = db.select("customers", {"email": email}, single=True)
                    if customer and customer.get("credits_remaining", 0) > 0:
                        has_credit = True
                except Exception:
                    pass  # DB issue — proceed without credit check

            boundary = content_type.split("boundary=")[-1].encode()
            body = self.rfile.read(content_length)
            pdf_bytes, filename = self._extract_file_bytes(body, boundary)

            if not pdf_bytes:
                self._respond(400, {"error": "no_file", "message": "No file found in upload."})
                return

            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                tmp.write(pdf_bytes)
                tmp_path = tmp.name

            try:
                result = analyse_pdf(tmp_path, filename)
            finally:
                try:
                    os.unlink(tmp_path)
                except Exception:
                    pass

            if result.get("status") != "ok":
                self._respond(422, result)
                return

            full_summary = result.get("summary", {})

            # PAID PATH: deduct credit, save report, email link, return full summary
            if email and has_credit:
                deducted = deduct_credit(email)
                if deducted:
                    property_address = (full_summary.get("property_identification") or {}).get("address_as_stated")
                    report = record_report(email, full_summary, property_address, filename)
                    result["report_id"] = report.get("id") if report else None
                    result["credit_deducted"] = True
                    if report:
                        view_url = f"{SITE_URL}/report/{report['id']}"
                        try:
                            email_report_ready(email, view_url, property_address)
                        except Exception:
                            pass  # Don't fail the request if email fails
                self._respond(200, result)
                return

            # UNPAID PATH: return teaser only
            teaser = _build_teaser(full_summary)
            self._respond(200, {
                "status": "ok",
                "guard": result.get("guard"),
                "summary": teaser,
                "requires_payment": True,
            })

        except Exception:
            self._respond(500, {"error": "internal_error", "message": "Something went wrong on our end. Please email hello@stratasnap.com.au."})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Cookie")
        self.end_headers()

    def _respond(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _extract_file_bytes(self, body, boundary):
        sep = b"--" + boundary
        parts = body.split(sep)
        for part in parts:
            if b"filename=" in part and b"\r\n\r\n" in part:
                header, content = part.split(b"\r\n\r\n", 1)
                filename = None
                if b"filename=\"" in header:
                    fn_start = header.index(b"filename=\"") + len(b"filename=\"")
                    fn_end = header.index(b"\"", fn_start)
                    filename = header[fn_start:fn_end].decode("utf-8", errors="ignore")
                content = content.rstrip(b"\r\n-")
                return content, filename
        return b"", None
