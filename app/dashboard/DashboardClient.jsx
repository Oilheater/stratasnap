"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Upload, FileText, LogOut, Package } from "lucide-react";

export default function DashboardClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="mono text-sm text-ink/50">Loading...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <nav className="border-b border-ink/15 bg-cream">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="serif text-2xl font-bold tracking-tight">
            StrataSnap
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <span className="mono text-xs text-ink/50 hidden md:inline">{data.email}</span>
            <a href="/api/logout" className="flex items-center gap-1 underline underline-offset-4 hover:text-red">
              <LogOut size={14} /> Log out
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
          Your account
        </div>
        <h1 className="serif text-5xl font-bold leading-tight mb-8">
          Welcome back.
        </h1>

        {/* Credits card */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border-2 border-ink p-6">
            <div className="mono text-[10px] uppercase tracking-widest text-red mb-2">
              Credits available
            </div>
            <div className="serif text-5xl font-bold">{data.credits_remaining}</div>
            <div className="text-sm text-ink/60 mt-1">reports remaining</div>
          </div>
          <div className="border border-ink/20 p-6">
            <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">
              Reports generated
            </div>
            <div className="serif text-5xl font-bold text-ink/70">
              {data.credits_used}
            </div>
            <div className="text-sm text-ink/60 mt-1">
              past summaries you can review
            </div>
          </div>
          <div className="border border-ink/20 p-6 flex flex-col justify-between">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">
                Need more credits?
              </div>
              <div className="serif text-lg font-bold leading-snug mb-2">
                Get another bundle at 50% off
              </div>
            </div>
            <Link
              href="/#pricing"
              className="text-sm underline underline-offset-4 hover:text-red inline-flex items-center gap-2"
            >
              See pricing <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Upload CTA */}
        {data.credits_remaining > 0 ? (
          <div className="bg-ink text-cream p-8 mb-12 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-gold mb-2">
                Ready to run one?
              </div>
              <h2 className="serif text-3xl font-bold">
                Upload your next strata report.
              </h2>
            </div>
            <Link
              href="/#tool"
              className="bg-gold text-ink px-8 py-4 font-medium hover:bg-cream transition-colors flex items-center gap-2"
            >
              Upload now <Upload size={18} />
            </Link>
          </div>
        ) : (
          <div className="border-2 border-ink/30 bg-ink/[0.03] p-8 mb-12">
            <div className="mono text-[10px] uppercase tracking-widest text-red mb-2">
              Out of credits
            </div>
            <h2 className="serif text-3xl font-bold mb-3">
              No credits remaining.
            </h2>
            <p className="text-ink/70 mb-4">
              Buy a bundle to keep going. Your past summaries remain available.
            </p>
            <Link
              href="/#pricing"
              className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors inline-flex items-center gap-2"
            >
              Buy more credits <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Past reports */}
        <div>
          <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
            § Past summaries
          </div>
          <h2 className="serif text-3xl font-bold mb-6">Your summaries.</h2>

          {data.reports.length === 0 ? (
            <div className="border border-ink/15 p-8 text-ink/60 text-center">
              No summaries yet. Upload your first strata document to get started.
            </div>
          ) : (
            <div className="border border-ink/15 divide-y divide-ink/15">
              {data.reports.map((r) => (
                <Link
                  key={r.id}
                  href={`/report/${r.id}`}
                  className="block p-6 hover:bg-ink/[0.03] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <FileText size={16} className="text-red shrink-0" />
                        <div className="serif text-lg font-bold truncate">
                          {r.property_address || r.original_filename || "Strata summary"}
                        </div>
                      </div>
                      <div className="mono text-[10px] uppercase tracking-widest text-ink/50">
                        Generated{" "}
                        {new Date(r.created_at).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {r.scheduled_deletion_at && (
                          <>
                            {" · deletes "}
                            {new Date(r.scheduled_deletion_at).toLocaleDateString("en-AU", {
                              day: "numeric",
                              month: "short",
                            })}
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-ink/40 group-hover:text-red transition-colors shrink-0 mt-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
