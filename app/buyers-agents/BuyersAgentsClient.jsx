"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, Users, Zap } from "lucide-react";

export default function BuyersAgentsClient() {
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
      lead_type: "buyers_agent",
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
      <nav className="border-b border-ink/15 bg-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="serif text-2xl font-bold tracking-tight">StrataSnap</span>
            <span className="mono text-[10px] uppercase tracking-widest text-ink/50">
              / for buyers' agents
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="underline-grow">For buyers</Link>
            <a href="#partner" className="bg-ink text-cream px-4 py-2 hover:bg-red transition-colors">
              Partner with us →
            </a>
          </div>
        </div>
      </nav>

      <section className="grain">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-6">
                For NSW buyers' agents
              </div>
              <h1 className="serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-8">
                Strata diligence on
                <br />
                <span className="italic font-normal">every property</span>
                <br />
                you shortlist.
              </h1>
              <p className="text-lg md:text-xl text-ink/75 max-w-2xl leading-relaxed">
                A summary of the strata records for every apartment your client is considering. Shows you found the risks before your client did. Costs less than one bad shortlist decision. Partner tier: free for verified buyers' agents.
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-10">
                <a href="#partner" className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors flex items-center gap-2">
                  Apply to partner <ArrowRight size={18} />
                </a>
                <a href="#pricing" className="text-sm underline underline-offset-4 hover:text-red">
                  See partner tiers →
                </a>
              </div>
            </div>
            <div className="md:col-span-4 border-l-2 border-ink pl-6">
              <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">
                Partner tiers
              </div>
              <div className="space-y-6 mt-4">
                <div>
                  <div className="serif text-5xl font-bold">Free</div>
                  <div className="text-sm text-ink/60">Up to 10 reports/month.</div>
                </div>
                <div>
                  <div className="serif text-5xl font-bold">$29</div>
                  <div className="text-sm text-ink/60">per report over the free tier.</div>
                </div>
                <div>
                  <div className="serif text-5xl font-bold">$300</div>
                  <div className="text-sm text-ink/60">flat for unlimited monthly.</div>
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
              § 02 — Why partner
            </div>
            <h2 className="serif text-5xl font-bold leading-tight">
              Do real diligence at shortlist. Not just at offer.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-lg text-ink/75 leading-relaxed">
              Your job is to find good properties. Ours is to read the strata records on them. Combined, your client gets diligence on every shortlist option — not just the one they're about to bid on.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-ink/15">
          {[
            {
              n: "01",
              icon: Search,
              title: "Shortlist without blind spots",
              body: "For every property you consider, run the strata records. Financial position, defect litigation, special levies — in three minutes. Kill bad options before your client falls in love with them.",
            },
            {
              n: "02",
              icon: Users,
              title: "Client-ready summaries",
              body: "Add the summary to your shortlist deck. Your client sees you've actually read the strata records for each option — not just glanced at price and location. Justifies your fee visibly.",
            },
            {
              n: "03",
              icon: Zap,
              title: "3-minute turnaround",
              body: "Get the report at 11pm, run it, have the summary ready for tomorrow's client meeting. Faster than commissioning a $300 inspector report for every shortlist option.",
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

      {/* PARTNER TIERS */}
      <section id="pricing" className="bg-ink text-cream py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-5">
              <div className="mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
                § 03 — Partner tiers
              </div>
              <h2 className="serif text-5xl font-bold leading-tight">
                Volume beats margin. That's the deal.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <p className="text-cream/70 leading-relaxed">
                Buyers' agents refer buyers to us long after the shortlist. We'd rather have you as a partner than a customer. All tiers require PIPA or REBAA membership verification.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-cream/20 p-8 bg-ink">
              <div className="mono text-[10px] uppercase tracking-widest text-cream/50 mb-2">
                Starter
              </div>
              <div className="serif text-6xl font-bold text-gold mb-1">Free</div>
              <div className="text-sm text-cream/60 mb-6">Up to 10 reports/month</div>
              <ul className="space-y-2 text-sm text-cream/85">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> 10 free summaries/month</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> Full plain-English output</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> PDF + browser version</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> No credit card required</li>
              </ul>
            </div>

            <div className="border-2 border-gold p-8 bg-cream text-ink relative">
              <div className="absolute -top-3 left-6 bg-gold text-ink mono text-[10px] uppercase tracking-widest px-2 py-1">
                Most popular
              </div>
              <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">Standard</div>
              <div className="serif text-6xl font-bold mb-1">$29</div>
              <div className="text-sm text-ink/60 mb-6">per report over 10/mo</div>
              <ul className="space-y-2 text-sm text-ink/80">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-red mt-0.5 shrink-0" /> First 10 reports/month free</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-red mt-0.5 shrink-0" /> $29 per additional report</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-red mt-0.5 shrink-0" /> No minimum spend</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-red mt-0.5 shrink-0" /> Monthly invoicing</li>
              </ul>
            </div>

            <div className="border-2 border-cream/20 p-8 bg-ink">
              <div className="mono text-[10px] uppercase tracking-widest text-cream/50 mb-2">Unlimited</div>
              <div className="serif text-6xl font-bold text-gold mb-1">$300</div>
              <div className="text-sm text-cream/60 mb-6">per month, unlimited reports</div>
              <ul className="space-y-2 text-sm text-cream/85">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> Unlimited reports</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> For high-volume firms</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> Priority support</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" /> Cancel any time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY */}
      <section id="partner" className="max-w-3xl mx-auto px-6 py-24">
        <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
          § 04 — Apply
        </div>
        <h2 className="serif text-5xl font-bold leading-tight mb-4">
          Apply to partner with StrataSnap.
        </h2>
        <p className="text-ink/70 mb-10">
          We verify PIPA/REBAA membership before activating your account. Usually done within one business day.
        </p>

        {submitted ? (
          <div className="border-l-4 border-red bg-white p-8">
            <div className="serif text-2xl font-bold mb-3">Thanks — we'll be in touch within one business day.</div>
            <p className="text-ink/75 leading-relaxed">
              We'll verify your PIPA/REBAA membership and activate your account. If we need any additional details we'll email you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <BField label="Firm name *" name="firm_name" required />
              <BField label="Your name *" name="contact_name" required />
              <BField label="Work email *" name="contact_email" type="email" required />
              <BField label="Phone (optional)" name="phone" />
            </div>
            <BField
              label="How many shortlists per month typically?"
              name="estimated_monthly_reports"
              type="number"
              placeholder="e.g. 15"
            />
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-ink/60 mb-2 block">
                PIPA / REBAA membership number and anything else we should know
              </label>
              <textarea
                name="notes"
                rows={4}
                className="w-full bg-white border border-ink/20 px-4 py-3 text-ink focus:outline-none focus:border-red"
                placeholder="PIPA member #12345 · Based in Bondi · Focus on first home buyers"
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
                className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Apply to partner"} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </section>

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
                <Link href="/conveyancers" className="hover:text-gold">For conveyancers</Link>
                <Link href="/privacy" className="hover:text-gold">Privacy</Link>
                <Link href="/terms" className="hover:text-gold">Terms</Link>
              </div>
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-cream/40 mb-3">
                Contact
              </div>
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

function BField({ label, name, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="mono text-[10px] uppercase tracking-widest text-ink/60 mb-2 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white border border-ink/20 px-4 py-3 text-ink focus:outline-none focus:border-red"
      />
    </div>
  );
}
