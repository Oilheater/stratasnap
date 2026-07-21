"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginClient() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const err = params.get("error");
    if (err === "expired") setError("That link has expired or already been used. Enter your email below to get a new one.");
    if (err === "missing") setError("Login link was invalid. Enter your email below to get a new one.");
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong. Please try again or email hello@stratasnap.com.au.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <nav className="border-b border-ink/15 bg-cream">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="serif text-2xl font-bold tracking-tight">
            StrataSnap
          </Link>
          <Link href="/" className="text-sm underline underline-offset-4 hover:text-red">
            ← Home
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 py-24">
        {submitted ? (
          <div>
            <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
              Check your email
            </div>
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle2 size={32} className="text-red mt-1 shrink-0" />
              <div>
                <h1 className="serif text-4xl font-bold leading-tight">
                  Link sent.
                </h1>
              </div>
            </div>
            <p className="text-ink/75 leading-relaxed mb-4">
              If <strong>{email}</strong> is on file, we've sent you a login link. It expires in 15 minutes.
            </p>
            <p className="text-sm text-ink/60">
              Can't find it? Check spam. Still nothing? Email <a href="mailto:hello@stratasnap.com.au" className="underline hover:text-red">hello@stratasnap.com.au</a>.
            </p>
          </div>
        ) : (
          <div>
            <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
              Log in
            </div>
            <h1 className="serif text-5xl font-bold leading-tight mb-4">
              Access your dashboard.
            </h1>
            <p className="text-ink/70 mb-8">
              Enter your email. We'll send you a login link — no password needed.
            </p>

            {error && (
              <div className="text-sm text-red bg-red/10 border border-red/30 px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mono text-[10px] uppercase tracking-widest text-ink/60 mb-2 block">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-ink/20 px-4 py-3 text-ink focus:outline-none focus:border-red"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending link..." : "Email me a login link"} <ArrowRight size={18} />
              </button>
            </form>

            <p className="text-sm text-ink/60 mt-8">
              Don't have an account yet? <Link href="/#pricing" className="underline hover:text-red">See pricing →</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
