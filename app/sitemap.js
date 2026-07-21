export default function sitemap() {
  const base = "https://stratasnap.com.au";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/guides/how-to-get-a-strata-report-nsw`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/conveyancers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/buyers-agents`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
