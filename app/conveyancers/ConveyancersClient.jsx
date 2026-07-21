"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, Clock, DollarSign, Shield } from "lucide-react";

export default function ConveyancersClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.target;
    const data = {
      firm_name: form.firm_name.value,
      contact_name: form.contact_name.value,
      contact_email: form.contact_email.value,
      phone: form.phone.value,
      estimated_monthly_reports: parseInt(form.estimated_monthly_reports.value) || null,
      notes: form.notes.value,
      lead_type: "conveyancer",
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please email hello@stratasnap.com.au directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* NAV */}
      <nav className="border-b border-ink/15 bg-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="serif text-2xl font-bold tracking-tight">StrataSnap</span>
            <span className="mono text-[10px] uppercase tracking-widest text-ink/50">
              / for conveyancers
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="underline-grow">For buyers</Link>
            <a href="#demo" className="bg-ink text-cream px-4 py-2 hover:bg-red transition-colors">
              Book a demo →
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="grain">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-6">
                For NSW conveyancing firms
              </div>
              <h1 className="serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-8">
                Every client arrives
                <br />
                <span className="italic font-normal">already understanding</span>
                <br />
                the strata report.
              </h1>
              <p className="text-lg md:text-xl text-ink/75 max-w-2xl leading-relaxed">
                White-label AI summaries of strata reports for your clients. Branded as your firm. Delivered in three minutes. So your clients walk into their contract review knowing what's in the strata records — and value your advice more.
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-10">
                <a href="#demo" className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors flex items-center gap-2">
                  Book a 15-minute demo <ArrowRight size={18} />
                </a>
                <a href="#pricing" className="text-sm underline underline-offset-4 hover:text-red">
                  See wholesale pricing →
                </a>
              </div>
            </div>
            <div className="md:col-span-4 border-l-2 border-ink pl-6">
              <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">Key numbers</div>
              <div className="space-y-6 mt-4">
                <div>
                  <div className="serif text-5xl font-bold">$39</div>
                  <div className="text-sm text-ink/60">wholesale per report.</div>
                </div>
                <div>
                  <div className="serif text-5xl font-bold">$200</div>
                  <div className="text-sm text-ink/60">monthly minimum.</div>
                </div>
                <div>
                  <div className="serif text-5xl font-bold">~3 min</div>
                  <div className="text-sm text-ink/60">turnaround per report.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-4">
            <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
              § 02 — How it works for your firm
            </div>
            <h2 className="serif text-5xl font-bold leading-tight">
              You look thorough. Your clients understand more. We handle the reading.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-lg text-ink/75 leading-relaxed">
              The workflow slots into your existing client onboarding without changing how you work.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-ink/15">
          {[
            {
              n: "01",
              icon: Building2,
              title: "Your clients upload via your portal",
              body: "We give you a branded URL (reports.yourfirm.com.au or similar) that looks like part of your website. Your clients don't see StrataSnap — they see your firm.",
            },
            {
              n: "02",
              icon: Clock,
              title: "AI summary in 3 minutes",
              body: "The AI extracts financials, by-laws, defects, insurance and levy history. Every finding is anchored to the Strata Schemes Management Act 2015 and cited to the source page.",
            },
            {
              n: "03",
              icon: CheckCircle2,
              title: "Your client is ready for your review",
              body: "They arrive at your contract review knowing what to ask about. You focus on advice, not explanation. Your billable hours stay at their proper rate.",
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="bg-cream p-8 hover:bg-stone transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <div className="mono text-xs text-red">{s.n}</div>
                  <Icon size={20} className="text-ink/40" />
                </div>
                <h3 className="serif text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-ink/70 leading-relaxed">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHITE-LABEL EXAMPLE */}
      <section className="bg-ink text-cream py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-6">
              <div className="mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
                § 03 — Branded as your firm
              </div>
              <h2 className="serif text-5xl font-bold leading-tight">
                Your logo. Your colours. Your domain.
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 flex items-end">
              <p className="text-cream/70">
                Your clients experience your brand throughout — from upload page to the PDF they receive. StrataSnap runs invisibly in the background.
              </p>
            </div>
          </div>

          <div className="bg-cream text-ink p-8 md:p-14 shadow-2xl">
            <div className="border-b-2 border-ink pb-6 mb-8 flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-ink/50">
                  Your Firm Conveyancing — Strata Summary
                </div>
                <h3 className="serif text-2xl md:text-3xl font-bold mt-1">
                  12/47 Bondi Road, Bondi NSW 2026
                </h3>
                <div className="text-sm text-ink/60 mt-1">
                  Prepared for [Client Name] · 16 July 2026
                </div>
              </div>
              <div className="text-right">
                <div className="serif text-lg font-bold text-red">YOUR LOGO</div>
                <div className="text-xs text-ink/60 mt-1">yourfirm.com.au</div>
              </div>
            </div>

            <div className="border border-ink/20 bg-ink/[0.03] p-4 mb-6">
              <div className="text-xs text-ink/75 leading-relaxed">
                <span className="font-bold">Important. </span>
                This summary has been prepared using AI to help you understand the contents of the strata records. Your Firm Conveyancing will provide formal advice on these matters as part of your contract review.
              </div>
            </div>

            <div className="mono text-[10px] uppercase tracking-widest text-red mb-3">
              § Sample finding
            </div>
            <div className="border-l-2 border-ink/40 pl-5 py-3">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="mono text-[10px] uppercase tracking-widest text-red">
                  Capital works fund
                </div>
                <div className="mono text-[10px] uppercase tracking-widest text-ink/50">
                  SSM Act s.74, s.80
                </div>
                <div className="mono text-[10px] uppercase tracking-widest text-ink/50">
                  pp. 84, 91
                </div>
              </div>
              <div className="serif text-lg font-bold leading-snug">
                Capital works fund balance is $112,500 against a 10-year forecast spend of $1.2M
              </div>
              <p className="text-sm text-ink/75 mt-2 leading-relaxed">
                The plan in this report (p.84) forecasts $1.2M in major works. The current balance of $112,500 represents approximately 9% of the 10-year forecast spend. This is a matter to raise with Your Firm during your contract review.
              </p>
            </div>

            <div className="border-t border-ink/15 mt-8 pt-4 flex items-center justify-between">
              <div className="mono text-[10px] uppercase tracking-widest text-ink/40">
                Powered by StrataSnap · Your Firm Conveyancing
              </div>
              <div className="serif text-sm font-bold">— Your Firm</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CONVEYANCERS USE US */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
              § 04 — Why firms sign up
            </div>
            <h2 className="serif text-4xl md:text-5xl font-bold leading-tight">
              Better prepared clients.
              <br />
              <span className="italic font-normal">Cleaner conversations.</span>
              <br />
              Higher perceived value.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-8">
            <Benefit
              title="Your clients ask better questions"
              body="Clients who understand what's in the strata report don't ask 'what does capital works fund mean?' They ask 'is this level of funding acceptable given the building's age?' That's a conversation where your expertise is worth the fee."
            />
            <Benefit
              title="Less explanation time, same billable hour"
              body="You'd normally spend 15–20 minutes per client walking through the strata basics before you get to actual advice. That time disappears. Your clients arrive with a plain-English summary already read."
            />
            <Benefit
              title="A differentiator against firms that don't offer this"
              body="Property buyers increasingly Google their conveyancer. Firms offering AI-powered strata summaries as part of standard packages win business against firms that don't."
            />
            <Benefit
              title="Your risk profile is unchanged"
              body="StrataSnap is information, not advice. Your firm remains the legal advisor — you still provide the professional opinion under your PI insurance. Our tool just improves your clients' comprehension of the underlying documents."
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t border-ink/15 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-5">
              <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
                § 05 — Wholesale pricing
              </div>
              <h2 className="serif text-5xl font-bold leading-tight">
                Simple pricing. No lock-in.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <p className="text-ink/75 leading-relaxed">
                Pay only for reports you use. Minimum monthly commitment covers our operating costs. Cancel any time with 30 days' notice.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-ink/30 p-8 bg-cream">
              <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">Per-report</div>
              <div className="serif text-6xl font-bold mb-1">$39</div>
              <div className="text-sm text-ink/60 mb-6">wholesale per summary</div>
              <ul className="space-y-2 text-sm text-ink/80">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> Full plain-English summary</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> Every finding page-cited</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> References SSM Act 2015</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> PDF + browser version</li>
              </ul>
            </div>

            <div className="border-2 border-red p-8 bg-ink text-cream relative">
              <div className="absolute -top-3 left-6 bg-red text-cream mono text-[10px] uppercase tracking-widest px-2 py-1">
                Standard plan
              </div>
              <div className="mono text-[10px] uppercase tracking-widest text-gold mb-2">Monthly minimum</div>
              <div className="serif text-6xl font-bold mb-1">$200</div>
              <div className="text-sm text-cream/60 mb-6">per month</div>
              <ul className="space-y-2 text-sm text-cream/85">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> Covers ~5 reports/mo included</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> Additional reports at $39 each</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> Unused reports don't roll over</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> 30-day cancellation notice</li>
              </ul>
            </div>

            <div className="border border-ink/30 p-8 bg-cream">
              <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">White-label add-on</div>
              <div className="serif text-6xl font-bold mb-1">$150</div>
              <div className="text-sm text-ink/60 mb-6">one-off setup</div>
              <ul className="space-y-2 text-sm text-ink/80">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> Your logo on all outputs</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> Branded upload URL</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> Custom firm colours</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" /> Set up within 5 business days</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-ink/60 mt-8 text-center">
            All prices in AUD, excluding GST. Volume discounts available for firms processing 30+ reports/month.
          </p>
        </div>
      </section>

      {/* DEMO FORM */}
      <section id="demo" className="bg-ink text-cream py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
            § 06 — Book a demo
          </div>
          <h2 className="serif text-5xl font-bold leading-tight mb-4">
            15-minute Zoom. No pitch. Just show you the tool.
          </h2>
          <p className="text-cream/70 mb-10 max-w-2xl">
            We'll run a real strata PDF through the tool live, walk through the output, and answer any questions. If it's not for your firm, we don't follow up.
          </p>

          {submitted ? (
            <div className="border-l-4 border-gold bg-cream text-ink p-8">
              <div className="serif text-2xl font-bold mb-3">Thanks — we'll be in touch within one business day.</div>
              <p className="text-ink/75 leading-relaxed">
                A calendar link will land in your inbox shortly. If it doesn't arrive within 24 hours, email <a href="mailto:hello@stratasnap.com.au" className="underline underline-offset-2 hover:text-red">hello@stratasnap.com.au</a> directly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Firm name *" name="firm_name" required />
                <Field label="Your name *" name="contact_name" required />
                <Field label="Work email *" name="contact_email" type="email" required />
                <Field label="Phone (optional)" name="phone" />
              </div>
              <Field
                label="Roughly how many strata reports does your firm see per month?"
                name="estimated_monthly_reports"
                type="number"
                placeholder="e.g. 25"
              />
              <div>
                <label className="mono text-[10px] uppercase tracking-widest text-cream/60 mb-2 block">
                  Anything specific you want to see in the demo?
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full bg-cream/5 border border-cream/20 px-4 py-3 text-cream focus:outline-none focus:border-gold"
                />
              </div>
              {error && (
                <div className="text-sm text-red bg-red/10 border border-red/30 px-4 py-3">
                  {error}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gold text-ink px-8 py-4 font-medium hover:bg-cream transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Book the demo"} <ArrowRight size={18} />
                </button>
                <span className="text-xs text-cream/50">
                  We'll email you within one business day.
                </span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-cream py-16 border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <Link href="/" className="serif text-2xl font-bold">StrataSnap</Link>
              <p className="text-sm text-cream/60 mt-2 mono">/ Strata reports, in plain English.</p>
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-cream/40 mb-3">
                Explore
              </div>
              <div className="flex flex-col gap-2 text-sm text-cream/80">
                <Link href="/" className="hover:text-gold">For buyers</Link>
                <Link href="/buyers-agents" className="hover:text-gold">For buyers' agents</Link>
                <Link href="/privacy" className="hover:text-gold">Privacy</Link>
                <Link href="/terms" className="hover:text-gold">Terms</Link>
              </div>
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-cream/40 mb-3">Contact</div>
              <p className="text-sm text-cream/80">
                hello@stratasnap.com.au
                <br />
                Sydney, NSW
              </p>
            </div>
          </div>
          <div className="border-t border-cream/15 pt-6 mono text-[10px] uppercase tracking-widest text-cream/40">
            © 2026 Vapour Film Lighting Pty Ltd · trading as StrataSnap
          </div>
        </div>
      </footer>
    </div>
  );
}

function Benefit({ title, body }) {
  return (
    <div className="border-l-2 border-ink pl-5">
      <div className="serif text-xl font-bold mb-2">{title}</div>
      <p className="text-ink/75 leading-relaxed">{body}</p>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="mono text-[10px] uppercase tracking-widest text-cream/60 mb-2 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-cream/5 border border-cream/20 px-4 py-3 text-cream focus:outline-none focus:border-gold"
      />
    </div>
  );
}
