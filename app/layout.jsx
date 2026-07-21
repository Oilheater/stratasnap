import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://stratasnap.com.au"),
  title: {
    default: "Strata Report Summaries in Plain English, NSW — StrataSnap",
    template: "%s · StrataSnap",
  },
  description:
    "Upload any NSW strata report — vendor's, $29 download, or owners corporation records — and get a plain-English summary in three minutes with references to the Strata Schemes Management Act 2015.",
  keywords: [
    "strata report",
    "NSW strata report",
    "strata inspection",
    "apartment buyer",
    "strata report summary",
    "Section 184 certificate",
    "owners corporation records",
  ],
  openGraph: {
    title: "StrataSnap — Diligence on every apartment",
    description:
      "AI-powered summaries of NSW strata reports. In plain English. In about three minutes.",
    url: "https://stratasnap.com.au",
    siteName: "StrataSnap",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StrataSnap",
    description: "Diligence on every apartment, not just the one you buy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800;9..144,900&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://stratasnap.com.au/#organization",
                  "name": "StrataSnap",
                  "url": "https://stratasnap.com.au",
                  "description": "AI-powered plain-English summaries of NSW strata reports for apartment buyers.",
                  "areaServed": "New South Wales, Australia"
                },
                {
                  "@type": "WebSite",
                  "@id": "https://stratasnap.com.au/#website",
                  "url": "https://stratasnap.com.au",
                  "name": "StrataSnap",
                  "publisher": { "@id": "https://stratasnap.com.au/#organization" }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Is StrataSnap legal or financial advice?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. StrataSnap provides information only — plain-English extracts from your strata document with references to the Strata Schemes Management Act 2015 (NSW). It does not tell you whether to buy, whether a by-law is enforceable, or what a court would decide. Take the summary to a qualified conveyancer or solicitor for advice."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What does StrataSnap summarise?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "StrataSnap reads NSW strata documents — including Section 184 certificates and owners corporation records — and produces a plain-English summary covering finances, capital works funds, special levies, insurance, by-laws, defects and disputes, with references to the relevant sections of the Strata Schemes Management Act 2015."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How much does a strata report summary cost?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A single summary is $14.99. Bundles are available: $44.99 for five reports and $74.99 for ten, suited to buyers comparing multiple apartments."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className="bg-cream text-ink">{children}</body>
    </html>
  );
}
