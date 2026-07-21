"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Download } from "lucide-react";
import LiveReport from "@/components/LiveReport";

export default function ReportViewClient({ reportId }) {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/report?id=${reportId}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        if (r.status === 404) {
          setError("Report not found or has been deleted.");
          return null;
        }
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((json) => {
        if (json) setReport(json);
      })
      .catch(() => setError("Something went wrong loading this report."))
      .finally(() => setLoading(false));
  }, [reportId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="mono text-sm text-ink/50">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <nav className="border-b border-ink/15 bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/dashboard" className="text-sm underline underline-offset-4 hover:text-red flex items-center gap-2">
              <ArrowLeft size={14} /> Back to dashboard
            </Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-6 py-24">
          <h1 className="serif text-4xl font-bold mb-4">Report not found</h1>
          <p className="text-ink/70">{error}</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <nav className="border-b border-ink/15 bg-cream">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm underline underline-offset-4 hover:text-red flex items-center gap-2">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
          <Link href="/" className="serif text-xl font-bold">
            StrataSnap
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-3">
          Your summary
        </div>
        <h1 className="serif text-4xl font-bold mb-6">
          {report.property_address || "Strata summary"}
        </h1>

        {/* Disclaimer banner */}
        <div className="border-l-4 border-red bg-white p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-red shrink-0 mt-0.5" />
            <div className="text-sm text-ink/85 leading-relaxed">
              <div className="font-bold mb-2 serif text-base text-ink">
                What this is — and isn't
              </div>
              <p className="mb-2">
                This is an AI-generated summary of the strata documents you uploaded. It pulls out facts and explains them in plain English, with references to the Strata Schemes Management Act 2015 (NSW).
              </p>
              <p>
                This is not legal advice, financial advice, or a formal strata inspection report. AI can misread or omit information. Always have a qualified conveyancer or solicitor review your strata report before you make a purchase decision.
              </p>
            </div>
          </div>
        </div>

        <LiveReport report={{ summary: report.summary_json }} />

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={() => window.print()}
            className="border-2 border-ink text-ink px-6 py-3 font-medium hover:bg-ink hover:text-cream transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Print or save as PDF
          </button>
          <span className="text-sm text-ink/60">
            This summary will be automatically deleted 30 days after generation.
          </span>
        </div>
      </div>
    </div>
  );
}
