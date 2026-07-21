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
      </head>
      <body className="bg-cream text-ink">{children}</body>
    </html>
  );
}
