import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Payment complete",
};

export default function SuccessPage({ searchParams }) {
  const tier = searchParams?.tier || "single";
  const tierLabels = {
    single: "Single report",
    fivepack: "5-pack",
    tenpack: "10-pack",
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full">
        <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
          Payment received
        </div>
        <div className="flex items-start gap-4 mb-8">
          <CheckCircle2 size={40} className="text-red mt-1 shrink-0" />
          <div>
            <h1 className="serif text-5xl font-bold leading-tight">Thanks.</h1>
            <p className="text-lg text-ink/70 mt-2">
              Your {tierLabels[tier] || "purchase"} is confirmed.
            </p>
          </div>
        </div>

        <div className="border-l-4 border-red bg-white p-6 mb-8">
          <div className="serif text-lg font-bold mb-3">What happens next</div>
          <ol className="text-sm text-ink/80 space-y-3 leading-relaxed list-decimal pl-5">
            <li>
              Check your email — a receipt from Stripe has arrived (check spam
              too).
            </li>
            <li>
              A second email from StrataSnap will arrive within a few minutes
              with your summary PDF, plus a magic link to view it in your
              browser.
            </li>
            {tier !== "single" && (
              <li>
                Your bundle credits are ready to use. Head back to the upload
                page any time to redeem them.
              </li>
            )}
            <li>
              Take the summary to your conveyancer. It's the starting point for
              a better conversation.
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="bg-ink text-cream px-8 py-4 font-medium hover:bg-red transition-colors"
          >
            Back to home
          </Link>
          <a
            href="mailto:hello@stratasnap.com.au"
            className="text-sm underline underline-offset-4 hover:text-red"
          >
            Something wrong? Email us.
          </a>
        </div>

        <p className="mono text-[10px] uppercase tracking-widest text-ink/40 mt-12">
          If you haven't received your summary email within 15 minutes, email
          hello@stratasnap.com.au with your receipt.
        </p>
      </div>
    </div>
  );
}
