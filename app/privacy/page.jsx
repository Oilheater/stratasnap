import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
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
        <h1 className="serif text-5xl font-bold leading-tight mb-8">Privacy Policy</h1>

        <div className="prose prose-lg text-ink/85 leading-relaxed space-y-6">
          <p>
            This privacy policy explains how StrataSnap collects, uses, stores, and discloses personal information. It is written to align with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth), even where StrataSnap as a small business under the $3 million annual turnover threshold may not currently be bound by the Act.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Who we are</h2>
          <p>
            StrataSnap is operated by Vapour Film Lighting Pty Ltd, trading as StrataSnap, based in Sydney, Australia.
          </p>
          <p>
            Contact for privacy enquiries: hello@stratasnap.com.au
          </p>

          <h2 className="serif text-2xl font-bold mt-10">What we collect</h2>
          <p>When you use StrataSnap:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your email address (to deliver your summary)</li>
            <li>The strata document you upload (to generate your summary)</li>
            <li>Payment information — processed by Stripe, we do not store card details</li>
            <li>Basic web analytics — IP, browser, pages visited</li>
            <li>The summary we generate for you, kept 30 days</li>
          </ul>
          <p>
            We do not collect sensitive information as defined in the Privacy Act. We ask that you do not upload documents containing sensitive information (health, religion, sexual orientation).
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Why we collect it</h2>
          <p>
            Primary purpose: to generate the strata summary you have requested and deliver it to you. Directly related secondary purposes: to respond to support requests, detect fraud or abuse, comply with legal obligations, and improve our service using aggregated de-identified data only.
          </p>
          <p>
            We do NOT use your document or summary for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI model training</li>
            <li>Marketing case studies</li>
            <li>Sharing with conveyancers, agents, or third parties without consent</li>
            <li>Resale to data brokers</li>
          </ul>

          <h2 className="serif text-2xl font-bold mt-10">Cross-border disclosure</h2>
          <p>
            To generate your summary, your document is sent to Anthropic's Claude AI service. Anthropic is a US-based company. This is a cross-border disclosure of personal information under Australian Privacy Principle 8.
          </p>
          <p>
            We obtain your express consent at the time of upload via the consent checkbox. If you do not consent, do not upload. Anthropic's API terms commit them to not training on customer data sent through the API.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Storage and deletion</h2>
          <p>
            Documents and summaries are stored on infrastructure provided by Vercel. Data in transit is encrypted (HTTPS). Documents and summaries are automatically deleted 30 days after delivery. You can request earlier deletion any time by emailing hello@stratasnap.com.au — we action within 7 business days.
          </p>
          <p>
            Transactional records (payment date, email, amount) are retained for 7 years to comply with ATO record-keeping. The contents of your document are not retained for this period.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Your rights</h2>
          <p>
            Under APPs 12 and 13, you can request access to, correction of, or deletion of your personal information. Email hello@stratasnap.com.au with the subject line "Privacy Access Request," "Privacy Correction Request," or "Deletion Request." We respond within 30 days.
          </p>
          <p>
            If you're not satisfied with our response, you can complain to the Office of the Australian Information Commissioner at oaic.gov.au or 1300 363 992.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Anonymity</h2>
          <p>
            You may use a pseudonymous email if you prefer. We require an email address to deliver your summary but it does not need to identify you personally.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Direct marketing</h2>
          <p>
            We do not send marketing emails. If we start, we will only send to people who have opted in, with unsubscribe links.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Children</h2>
          <p>
            StrataSnap is not directed at children. We do not knowingly collect information from anyone under 18.
          </p>

          <h2 className="serif text-2xl font-bold mt-10">Changes</h2>
          <p>
            We may update this policy. The current version is always at stratasnap.com.au/privacy. Substantive changes are flagged at the top of the page for at least 30 days.
          </p>

          <p className="border-t border-ink/15 pt-6 mt-10 text-sm text-ink/60">
            StrataSnap is a service of Vapour Film Lighting Pty Ltd, trading as StrataSnap.
          </p>
        </div>
      </article>
    </div>
  );
}
