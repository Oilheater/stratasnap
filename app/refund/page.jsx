import Link from "next/link";

export const metadata = {
  title: "Refund Policy",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <nav className="border-b border-ink/15 bg-cream sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="serif text-2xl font-bold tracking-tight">
            StrataSnap
          </Link>
          <Link href="/" className="text-sm underline underline-offset-4 hover:text-red">
            ← Home
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
          Effective 16 July 2026
        </div>
        <h1 className="serif text-5xl font-bold leading-tight mb-8">Refund Policy</h1>

        <div className="prose prose-lg text-ink/85 leading-relaxed space-y-6">
          <h2 className="serif text-2xl font-bold mt-10">When we refund you</h2>
          <p>
            We refund your purchase in full if:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We couldn't process your document (scanned PDF, corrupted file, wrong document type).</li>
            <li>The service was unavailable when you tried to use your bundle credits and we can't restore access within 7 days.</li>
            <li>You paid twice for the same thing.</li>
          </ul>

          <h2 className="serif text-2xl font-bold mt-10">When we can't refund you</h2>
          <p>
            Because the service is digital and delivered immediately:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Once you have received a summary, we don't refund it. If the summary contains an error, email us at hello@stratasnap.com.au — we'll review and correct it, or refund that specific summary if we can't.</li>
            <li>Bundle credits (5-pack, 10-pack) don't expire, so we don't refund unused credits under normal circumstances.</li>
          </ul>
          <p>
            Where a refund is issued at our discretion (rather than for a fault or failure on our part), any non-recoverable payment processing fee may be deducted. Refunds for a fault or failure on our part are always made in full.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">How to request a refund</h2>
          <p>
            Email hello@stratasnap.com.au with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The email address you used to purchase</li>
            <li>Your Stripe receipt number (starts with "in_" or "pi_")</li>
            <li>Why you're requesting the refund</li>
          </ul>
          <p>
            We respond within 2 business days. Approved refunds are processed within 5 business days to your original payment method.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Your rights under Australian Consumer Law</h2>
          <p>
            Nothing in this policy limits your rights under Australian Consumer Law, including guarantees around fitness for purpose and services being provided with due care and skill. These rights apply regardless of what our policy says.
          </p>
        </div>
      </article>
    </div>
  );
}
