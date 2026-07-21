"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Shield,
  Info,
  AlertCircle,
  Package,
} from "lucide-react";
import SampleReport from "./SampleReport";
import LiveReport from "./LiveReport";

const PAYMENT_LINKS = {
  single: process.env.NEXT_PUBLIC_PAYMENT_LINK_SINGLE || "#",
  fivepack: process.env.NEXT_PUBLIC_PAYMENT_LINK_FIVEPACK || "#",
  tenpack: process.env.NEXT_PUBLIC_PAYMENT_LINK_TENPACK || "#",
};

const ANALYSIS_STEPS = [
  "Reading the document",
  "Identifying strata records",
  "Extracting financials",
  "Reviewing by-laws",
  "Checking insurance and defects",
  "Compiling summary",
];

export default function StrataSnap() {
  const [stage, setStage] = useState("landing");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [consent, setConsent] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [report, setReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF files are supported.");
      setStage("error");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("File exceeds 50MB. Please upload a smaller PDF.");
      setStage("error");
      return;
    }
    if (!consent) {
      setPendingFile(file);
      return;
    }
    startAnalysis(file);
  };

  const startAnalysis = async (file) => {
    setFileName(file.name);
    setStage("analysing");
    setProgress(0);
    setPendingFile(null);
    setErrorMessage("");

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress(Math.min(i, ANALYSIS_STEPS.length - 1));
      if (i >= ANALYSIS_STEPS.length - 1) clearInterval(interval);
    }, 8000);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyse", {
        method: "POST",
        body: formData,
      });
      clearInterval(interval);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(
          err.message ||
            "We couldn't process that document. Please try again or email hello@stratasnap.com.au."
        );
        setStage("error");
        return;
      }

      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.message || "We couldn't process that document.");
        setStage("error");
        return;
      }

      setReport(data);
      setProgress(ANALYSIS_STEPS.length);
      setTimeout(() => setStage("result"), 500);
    } catch (e) {
      clearInterval(interval);
      setErrorMessage(
        "Connection issue. Please try again or email hello@stratasnap.com.au."
      );
      setStage("error");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const reset = () => {
    setStage("landing");
    setFileName("");
    setProgress(0);
    setPendingFile(null);
    setReport(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* NAV */}
      <nav className="border-b border-ink/15 bg-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="serif text-2xl font-bold tracking-tight">
              StrataSnap
            </span>
            <span className="mono text-[10px] uppercase tracking-widest text-ink/50">
              / NSW apartments
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#how" className="underline-grow">
              How it works
            </a>
            <Link href="/guides/how-to-get-a-strata-report-nsw" className="underline-grow">
              How to get a report
            </Link>
            <a href="#pricing" className="underline-grow">
              Pricing
            </a>
            <Link href="/conveyancers" className="underline-grow">
              For conveyancers
            </Link>
            <Link href="/buyers-agents" className="underline-grow">
              For buyers' agents
            </Link>
            <Link href="/login" className="underline-grow">
              Log in
            </Link>
            <a
              href="#tool"
              className="bg-ink text-cream px-4 py-2 hover:bg-red transition-colors"
            >
              Summarise a report →
            </a>
          </div>
        </div>
      </nav>

      {stage === "landing" && (
        <>
          {/* HERO */}
          <section className="grain">
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
              <div className="grid md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-6">
                    Issue 001 · Strata diligence, without the $300 bill
                  </div>
                  <h1 className="serif text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight mb-8">
                    Diligence on
                    <br />
                    <span className="italic font-normal">every apartment</span>
                    <br />
                    you look at.
                  </h1>
                  <p className="text-lg md:text-xl text-ink/75 max-w-2xl leading-relaxed">
                    Strata inspections cost $300. So most buyers only pay for one — on the property they're already offering on. Too late. StrataSnap reads any strata document in three minutes for $14.99, so you can do real diligence at the shortlist stage, before you fall for the wrong apartment.
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-10">
                    <a
                      href="#tool"
                      className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors flex items-center gap-2"
                    >
                      Summarise a strata report <ArrowRight size={18} />
                    </a>
                    <a
                      href="#sample"
                      className="text-sm underline underline-offset-4 hover:text-red"
                    >
                      See a sample summary →
                    </a>
                  </div>
                  <div className="mono text-[10px] uppercase tracking-widest text-ink/40 mt-6">
                    Information tool · Not legal, financial, or property advice ·
                    For NSW apartment, townhouse, and unit buyers
                  </div>
                </div>

                <div className="md:col-span-4 border-l-2 border-ink pl-6">
                  <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">
                    By the numbers
                  </div>
                  <div className="space-y-6 mt-4">
                    <div>
                      <div className="serif text-5xl font-bold">$14.99</div>
                      <div className="text-sm text-ink/60">Single report.</div>
                    </div>
                    <div>
                      <div className="serif text-5xl font-bold">$44.99</div>
                      <div className="text-sm text-ink/60">5-pack.</div>
                    </div>
                    <div>
                      <div className="serif text-5xl font-bold">$74.99</div>
                      <div className="text-sm text-ink/60">
                        10-pack. The shortlister's tool.
                      </div>
                    </div>
                    <div>
                      <div className="serif text-5xl font-bold">~3 min</div>
                      <div className="text-sm text-ink/60">Per summary.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WHAT WE READ — static feature strip, no marquee */}
          <section className="bg-ink text-cream border-y border-ink">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-gold mb-6">
                What every summary covers
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
                <div className="serif text-lg md:text-xl leading-tight">Capital works fund balance</div>
                <div className="serif text-lg md:text-xl leading-tight">Special levies coming up</div>
                <div className="serif text-lg md:text-xl leading-tight">By-laws on pets and Airbnb</div>
                <div className="serif text-lg md:text-xl leading-tight">Building defect claims</div>
                <div className="serif text-lg md:text-xl leading-tight">Insurance status</div>
                <div className="serif text-lg md:text-xl leading-tight">Financial arrears</div>
              </div>
            </div>
          </section>

          {/* HOW BUYERS USE THIS */}
          <section id="how" className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-12 gap-8 mb-16">
              <div className="md:col-span-4">
                <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
                  § 02 — Use cases
                </div>
                <h2 className="serif text-5xl font-bold leading-tight">
                  How buyers actually use this.
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <p className="text-lg text-ink/75 leading-relaxed">
                  StrataSnap fits at the shortlist stage. Not the contract
                  stage. Three patterns we see:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-ink/15">
              {[
                {
                  n: "01",
                  title: "Open home tomorrow",
                  price: "$14.99 single",
                  body: "Vendor sent the strata report. You've got 24 hours. Upload it, get a clear summary in 3 minutes, walk into the inspection knowing what to look for.",
                },
                {
                  n: "02",
                  title: "Shortlisting 5–15 properties",
                  price: "$74.99 10-pack",
                  body: "Real diligence on every serious shortlist property. Run StrataSnap on each. Save the $300 inspector report for the one you actually offer on.",
                },
                {
                  n: "03",
                  title: "11pm before contract exchange",
                  price: "$14.99 single",
                  body: "Your conveyancer is asleep. You've got a question about page 147. Upload the report, find the answer, sleep well. Take it to your conveyancer in the morning.",
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="bg-cream p-8 hover:bg-stone transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="mono text-xs text-red">{s.n}</div>
                    <div className="mono text-[10px] uppercase tracking-widest text-ink/50">
                      {s.price}
                    </div>
                  </div>
                  <h3 className="serif text-2xl font-bold mb-4">{s.title}</h3>
                  <p className="text-ink/70 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SAMPLE */}
          <section id="sample" className="bg-ink text-cream py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-12 gap-8 mb-12">
                <div className="md:col-span-6">
                  <div className="mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
                    § 03 — Sample output
                  </div>
                  <h2 className="serif text-5xl font-bold leading-tight">
                    This is what you get back.
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8 flex items-end">
                  <p className="text-cream/70">
                    A sample summary based on a Sydney-area report. Building
                    details anonymised. Each finding cites the source page and
                    the relevant section of the Strata Schemes Management Act
                    2015 (NSW).
                  </p>
                </div>
              </div>

              <SampleReport />

              <div className="mt-10 flex items-center gap-6">
                <a
                  href="#tool"
                  className="bg-gold text-ink px-8 py-4 font-medium hover:bg-cream transition-colors flex items-center gap-2"
                >
                  Summarise your own report <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </section>

          {/* TRUST / INDEPENDENCE */}
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-5">
                <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
                  § 04 — Independence
                </div>
                <h2 className="serif text-4xl md:text-5xl font-bold leading-tight">
                  No relationship with
                  <br />
                  <span className="italic font-normal">
                    the vendor, the agent, or the inspector.
                  </span>
                </h2>
              </div>
              <div className="md:col-span-6 md:col-start-7 space-y-5 text-ink/80 leading-relaxed">
                <p>
                  StrataSnap has no relationship with the vendor, the agent, or
                  the inspector. It reads what's in the documents you upload —
                  in plain English, with page citations and references to the
                  actual sections of the Strata Schemes Management Act 2015
                  (NSW).
                </p>
                <p>
                  Upload the vendor's report, a pre-existing report you
                  downloaded for $29, or owners corporation records you
                  requested directly. The summary you get back is the same
                  regardless of who paid for the document.
                </p>
              </div>
            </div>
          </section>

          {/* TOOL */}
          <section id="tool" className="max-w-5xl mx-auto px-6 py-24">
            <div className="text-center mb-12">
              <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
                § 05 — Run a summary
              </div>
              <h2 className="serif text-5xl md:text-6xl font-bold leading-tight">
                Upload your strata report.
              </h2>
              <p className="text-lg text-ink/70 mt-4 max-w-xl mx-auto">
                Preview the summary. Pay only when you download the PDF.
              </p>
            </div>

            {/* Consent notice */}
            <div className="border border-ink/20 bg-white p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Info size={20} className="text-red mt-0.5 shrink-0" />
                <div>
                  <div className="serif text-lg font-bold mb-2">
                    Before you upload
                  </div>
                  <ul className="text-sm text-ink/75 space-y-2 list-disc pl-5">
                    <li>
                      StrataSnap is an information tool. Not legal, financial,
                      or property advice.
                    </li>
                    <li>
                      Your document will be processed using AI services located
                      outside Australia (United States). Do not upload documents
                      containing information you're not comfortable with being
                      processed this way.
                    </li>
                    <li>
                      We delete your document and summary 30 days after
                      delivery, or sooner on request.
                    </li>
                    <li>
                      We don't use your document to train AI, share it with
                      anyone, or use it for marketing.
                    </li>
                  </ul>
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer mt-4 pt-4 border-t border-ink/10">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-red cursor-pointer"
                />
                <span className="text-sm text-ink/85">
                  I have read the above and consent to my strata document being
                  processed by StrataSnap on these terms. I have read the{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-2 hover:text-red"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => consent && fileInputRef.current?.click()}
              className={`border-2 border-dashed p-16 text-center transition-colors group ${
                consent
                  ? "border-ink/30 hover:border-red hover:bg-ink/[0.02] cursor-pointer"
                  : "border-ink/15 bg-ink/[0.02] cursor-not-allowed opacity-60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <Upload
                size={48}
                className={`mx-auto mb-6 transition-colors ${
                  consent
                    ? "text-ink/40 group-hover:text-red"
                    : "text-ink/20"
                }`}
                strokeWidth={1.5}
              />
              <div className="serif text-2xl md:text-3xl font-bold mb-2">
                {consent
                  ? "Drop your strata report here"
                  : "Tick the consent box above to upload"}
              </div>
              <div className="text-ink/60">PDF only · up to 50MB</div>
              {consent && (
                <div className="mono text-[10px] uppercase tracking-widest text-ink/40 mt-8 flex items-center justify-center gap-2">
                  <Shield size={12} /> Encrypted in transit · Auto-deleted after
                  30 days
                </div>
              )}
            </div>

            {pendingFile && !consent && (
              <div className="mt-4 p-4 bg-gold/20 border border-gold flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="text-ink shrink-0 mt-0.5"
                />
                <div className="text-sm">
                  <div className="font-medium">File ready: {pendingFile.name}</div>
                  <div className="text-ink/70">
                    Tick the consent box above to continue.
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* PRICING */}
          <section id="pricing" className="border-t border-ink/15 py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-12 gap-8 mb-16">
                <div className="md:col-span-5">
                  <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
                    § 06 — Pricing
                  </div>
                  <h2 className="serif text-5xl font-bold leading-tight">
                    One report or a pack.
                    <br />
                    <span className="italic font-normal">
                      Use them when you need them.
                    </span>
                  </h2>
                </div>
                <div className="md:col-span-6 md:col-start-7 flex items-end">
                  <p className="text-ink/75 leading-relaxed">
                    Most buyers shortlist 5–15 properties. The 10-pack is what
                    most active buyers end up using. Singles are for one-off
                    curiosity.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <PricingCard
                  tier="Single report"
                  price="$14.99"
                  unit="$14.99 per report"
                  features={[
                    "One AI summary",
                    "PDF + browser version",
                    "Page-cited findings",
                  ]}
                  cta="Buy single"
                  href={PAYMENT_LINKS.single}
                />
                <PricingCard
                  tier="5-pack"
                  price="$44.99"
                  unit="$9 per report"
                  features={[
                    "5 AI summaries",
                    "Use anytime, no expiry",
                    "40% off single price",
                  ]}
                  cta="Buy 5-pack"
                  href={PAYMENT_LINKS.fivepack}
                />
                <PricingCard
                  tier="10-pack"
                  price="$74.99"
                  unit="$7.50 per report"
                  features={[
                    "10 AI summaries",
                    "Use anytime, no expiry",
                    "50% off single price",
                    "Built for serious shortlisters",
                  ]}
                  cta="Buy 10-pack"
                  href={PAYMENT_LINKS.tenpack}
                  featured
                />
              </div>

              <p className="text-sm text-ink/60 mt-8 text-center">
                All prices in AUD. One-time payment. Bundles never expire.
              </p>

              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <Link
                  href="/conveyancers"
                  className="border border-ink/20 p-6 hover:border-ink transition-colors group"
                >
                  <div className="mono text-[10px] uppercase tracking-widest text-red mb-2">
                    For conveyancers →
                  </div>
                  <div className="serif text-2xl font-bold mb-2">
                    White-label summaries for your firm
                  </div>
                  <p className="text-sm text-ink/70">
                    $39 wholesale · $200/mo minimum · your branding on every summary
                  </p>
                </Link>
                <Link
                  href="/buyers-agents"
                  className="border border-ink/20 p-6 hover:border-ink transition-colors group"
                >
                  <div className="mono text-[10px] uppercase tracking-widest text-red mb-2">
                    For buyers' agents →
                  </div>
                  <div className="serif text-2xl font-bold mb-2">
                    Free tier for verified partners
                  </div>
                  <p className="text-sm text-ink/70">
                    10 free reports/month · PIPA/REBAA verification · apply to partner
                  </p>
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
                  § 07 — Common questions
                </div>
                <h2 className="serif text-4xl font-bold leading-tight">
                  Questions we get before people upload.
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6 space-y-8">
                <Faq
                  q="Is this a substitute for a full strata inspection?"
                  a="No. A full strata inspection ($250–450) is prepared by a professional inspector and is the right tool for the property you're actually buying. StrataSnap is a shortlisting tool — it helps you understand any strata document you have access to, at the diligence stage before you commit to one property."
                />
                <Faq
                  q="What documents can I upload?"
                  a="Anything from a NSW strata scheme: the vendor's report, a $29 pre-existing report download, a Section 184 certificate you requested from the owners corporation, AGM minutes, financial statements, by-laws. If it's strata records, we read it."
                />
                <Faq
                  q="How accurate is the summary?"
                  a="The summary extracts facts from the document you upload, with page citations, so you can verify each finding against the source. AI can make mistakes — we tell you where each finding came from so nothing is opaque. If you spot an error, email us and we'll review it."
                />
                <Faq
                  q="Is this legal advice?"
                  a="No. StrataSnap provides information — plain-English extracts from your strata document, with references to the relevant sections of the Strata Schemes Management Act 2015 (NSW). We don't tell you whether to buy the property, whether a by-law is enforceable, or what a court would decide. Take the summary to a qualified conveyancer or solicitor for advice."
                />
                <Faq
                  q="What happens to my document after processing?"
                  a="It's stored on our servers for 30 days so you can re-access your summary. After 30 days it's automatically deleted. You can request earlier deletion any time by emailing hello@stratasnap.com.au. We never share your document, never use it for training AI, never use it for marketing."
                />
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-ink text-cream py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-12 mb-12">
                <div>
                  <div className="serif text-2xl font-bold">StrataSnap</div>
                  <p className="text-sm text-cream/60 mt-2 mono">
                    / Strata reports, in plain English.
                  </p>
                </div>
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest text-cream/40 mb-3">
                    Important
                  </div>
                  <p className="text-xs text-cream/60 leading-relaxed">
                    StrataSnap provides information, not advice. Summaries are
                    AI-generated from documents you upload and are intended to
                    help you understand what is in those documents. They are not
                    a substitute for advice from a qualified conveyancer,
                    solicitor, or strata inspector. Before making any property
                    purchase decision, obtain professional advice. StrataSnap is
                    a service of Vapour Film Lighting Pty Ltd, trading as
                    StrataSnap. We are not a law firm, licensed conveyancer, or
                    registered strata inspector.
                  </p>
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
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-cream/60">
                    <Link
                      href="/guides/how-to-get-a-strata-report-nsw"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      How to get a strata report
                    </Link>
                    <Link
                      href="/conveyancers"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      For conveyancers
                    </Link>
                    <Link
                      href="/buyers-agents"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      For buyers' agents
                    </Link>
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/terms"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      Terms
                    </Link>
                    <Link
                      href="/refund"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      Refunds
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border-t border-cream/15 pt-6 flex flex-wrap items-center justify-between mono text-[10px] uppercase tracking-widest text-cream/40">
                <span>
                  © 2026 Vapour Film Lighting Pty Ltd · trading as StrataSnap
                </span>
                <span>Built in Sydney</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {stage === "analysing" && (
        <section className="max-w-3xl mx-auto px-6 py-32 min-h-[80vh] flex flex-col justify-center">
          <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
            Reading · {fileName}
          </div>
          <h2 className="serif text-5xl font-bold mb-12 leading-tight">
            Reading your report.
          </h2>
          <div className="space-y-3">
            {ANALYSIS_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-4 text-lg">
                {i < progress ? (
                  <CheckCircle2 size={20} className="text-red" />
                ) : i === progress ? (
                  <Loader2 size={20} className="animate-spin text-ink" />
                ) : (
                  <div className="w-5 h-5 border border-ink/20 rounded-full" />
                )}
                <span className={i <= progress ? "text-ink" : "text-ink/30"}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink/50 mt-12">
            This usually takes 30–90 seconds depending on report size. Don't
            close the page.
          </p>
        </section>
      )}

      {stage === "error" && (
        <section className="max-w-3xl mx-auto px-6 py-32 min-h-[80vh] flex flex-col justify-center">
          <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
            Couldn't process
          </div>
          <h2 className="serif text-5xl font-bold mb-6 leading-tight">
            Something went wrong.
          </h2>
          <p className="text-lg text-ink/80 leading-relaxed mb-8 max-w-2xl">
            {errorMessage}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={reset}
              className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors flex items-center gap-2"
            >
              Try another document <ArrowRight size={18} />
            </button>
            <a
              href="mailto:hello@stratasnap.com.au"
              className="text-sm underline underline-offset-4 hover:text-red"
            >
              Email us — we'll have a look
            </a>
          </div>
        </section>
      )}

      {stage === "result" && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="mono text-xs uppercase tracking-[0.2em] text-red">
                Summary ready
              </div>
              <h2 className="serif text-4xl font-bold mt-2">
                Your StrataSnap summary.
              </h2>
            </div>
            <button
              onClick={reset}
              className="mono text-xs uppercase tracking-widest text-ink/60 hover:text-red"
            >
              ← Run another
            </button>
          </div>

          <div className="border-l-4 border-red bg-white p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-red shrink-0 mt-0.5" />
              <div className="text-sm text-ink/85 leading-relaxed">
                <div className="font-bold mb-2 serif text-base text-ink">
                  What this is — and isn't
                </div>
                <p className="mb-2">
                  This is an AI-generated summary of the strata documents you
                  uploaded. It pulls out facts and explains them in plain
                  English, with references to the relevant sections of the
                  Strata Schemes Management Act 2015 (NSW).
                </p>
                <p>
                  This is not legal advice, financial advice, or a formal strata
                  inspection report. It is not a substitute for review by a
                  qualified conveyancer or solicitor. AI can misread or omit
                  information. Always have a qualified professional review your
                  strata report before you make a purchase decision.
                </p>
              </div>
            </div>
          </div>

          {report && report.summary ? (
            <LiveReport report={report} />
          ) : (
            <SampleReport light />
          )}

          <div className="border-t border-ink/15 mt-10 pt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-red mb-2">
                  Next steps
                </div>
                <p className="text-sm text-ink/80 leading-relaxed">
                  Take this summary to your conveyancer. The "Items to discuss
                  with your conveyancer" section is a good starting list.
                </p>
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-red mb-2">
                  Found an error?
                </div>
                <p className="text-sm text-ink/80 leading-relaxed">
                  AI gets things wrong sometimes. If you spot something in our
                  summary that doesn't match your document, email{" "}
                  <a
                    href="mailto:hello@stratasnap.com.au"
                    className="underline underline-offset-2 hover:text-red"
                  >
                    hello@stratasnap.com.au
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={PAYMENT_LINKS.single}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors flex items-center gap-2"
            >
              Pay $14.99 & email me the PDF <ArrowRight size={18} />
            </a>
            <a
              href={PAYMENT_LINKS.tenpack}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline underline-offset-4 hover:text-red flex items-center gap-2"
            >
              <Package size={14} /> Or get the 10-pack for $74.99
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

function PricingCard({ tier, price, unit, features, cta, href, featured }) {
  if (featured) {
    return (
      <div className="border-2 border-red p-8 bg-ink text-cream relative">
        <div className="absolute -top-3 left-6 bg-red text-cream mono text-[10px] uppercase tracking-widest px-2 py-1">
          Most popular
        </div>
        <div className="mono text-[10px] uppercase tracking-widest text-gold mb-2">
          {tier}
        </div>
        <div className="serif text-6xl font-bold mb-1">{price}</div>
        <div className="text-sm text-cream/60 mb-6">{unit}</div>
        <ul className="space-y-2 text-sm text-cream/85 mb-8">
          {features.map((f) => (
            <li key={f} className="flex gap-2">
              <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-red text-cream px-6 py-3 font-medium hover:bg-cream hover:text-ink transition-colors"
        >
          {cta}
        </a>
      </div>
    );
  }
  return (
    <div className="border border-ink/30 p-8 bg-cream hover:border-ink transition-colors">
      <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">
        {tier}
      </div>
      <div className="serif text-6xl font-bold mb-1">{price}</div>
      <div className="text-sm text-ink/60 mb-6">{unit}</div>
      <ul className="space-y-2 text-sm text-ink/80 mb-8">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <CheckCircle2 size={16} className="text-ink/40 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center border-2 border-ink text-ink px-6 py-3 font-medium hover:bg-ink hover:text-cream transition-colors"
      >
        {cta}
      </a>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <div className="border-t border-ink/15 pt-6">
      <div className="serif text-xl font-bold mb-3">{q}</div>
      <p className="text-ink/75 leading-relaxed">{a}</p>
    </div>
  );
}
