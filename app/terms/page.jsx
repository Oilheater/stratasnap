import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
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
        <h1 className="serif text-5xl font-bold leading-tight mb-8">Terms of Service</h1>

        <div className="prose prose-lg text-ink/85 leading-relaxed space-y-6">
          <h2 className="serif text-2xl font-bold mt-10">1. What StrataSnap is</h2>
          <p>
            StrataSnap is an information tool. It reads NSW strata documents you upload and returns a plain-English summary using AI. It is not legal advice, financial advice, or a formal strata inspection report.
          </p>
          <p>
            StrataSnap is a service of Vapour Film Lighting Pty Ltd, trading as StrataSnap. We are not a law firm, licensed conveyancer, real estate agent, or registered strata inspector.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">2. What you agree to by using the service</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You will only upload strata documents relating to properties in NSW that you have a legitimate interest in (buying, investigating for a client, etc.).</li>
            <li>You understand the summaries are AI-generated and may contain errors or omissions.</li>
            <li>You will not rely on the summary as legal or financial advice.</li>
            <li>You will consult a qualified conveyancer or solicitor before making a property purchase decision.</li>
            <li>You will not upload documents containing information you don't have the right to process (e.g. documents you obtained unlawfully).</li>
            <li>You will not use StrataSnap to breach anyone else's privacy.</li>
          </ul>

          <h2 className="serif text-2xl font-bold mt-10">3. Payment</h2>
          <p>
            Prices are shown in Australian dollars, inclusive of GST where applicable. Payment is processed by Stripe. We do not store your card details.
          </p>
          <p>
            Bundle credits (5-pack, 10-pack) do not expire and can be used any time.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">4. Refunds</h2>
          <p>
            See our <Link href="/refund" className="underline underline-offset-2 hover:text-red">Refund Policy</Link>. In short: if we can't process your document, we refund you.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">5. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, our total liability for any claim relating to the service is limited to the amount you paid for the summary in question. Nothing in these terms excludes or limits rights you have under Australian Consumer Law that cannot be excluded.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">6. Intellectual property</h2>
          <p>
            You retain all rights in the documents you upload. We claim no ownership of your content. The AI-generated summary is provided to you for your use in connection with your property purchase decision.
          </p>
          <p>
            StrataSnap's brand, code, prompts, and site design are our property.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">7. Privacy</h2>
          <p>
            How we handle your data is covered in our <Link href="/privacy" className="underline underline-offset-2 hover:text-red">Privacy Policy</Link>.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">8. Changes to the service</h2>
          <p>
            We may update, change, or discontinue features at any time. If we shut down the service, we will honour any outstanding bundle credits or refund the unused portion.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">9. Governing law</h2>
          <p>
            These terms are governed by the laws of New South Wales, Australia. Any disputes will be dealt with by the courts of NSW.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">10. Contact</h2>
          <p>
            Email hello@stratasnap.com.au for any questions about these terms.
          </p>
        </div>
      </article>
    </div>
  );
}
