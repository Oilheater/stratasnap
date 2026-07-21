# StrataSnap — production build

Full production site for stratasnap.com.au. Vercel-ready.

## What's in this folder

```
stratasnap-build/
├── app/
│   ├── layout.jsx          Root layout, metadata, fonts
│   ├── page.jsx            Homepage (renders StrataSnap)
│   ├── globals.css         Tailwind + custom styles
│   ├── sitemap.js          SEO sitemap
│   ├── privacy/page.jsx    Privacy policy
│   ├── terms/page.jsx      Terms of service
│   ├── refund/page.jsx     Refund policy
│   └── success/page.jsx    Post-payment success page
├── components/
│   ├── StrataSnap.jsx      Main site component
│   ├── SampleReport.jsx    Sample summary
│   └── LiveReport.jsx      Renders real backend JSON
├── api/
│   ├── analyse.py          AI analysis serverless function
│   └── stripe-webhook.py   Stripe webhook handler
├── public/
│   └── robots.txt
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── vercel.json             Python function config
├── requirements.txt        Python deps
└── .env.example
```

## Deploy steps

### 1. Push to existing GitHub repo

Since Vercel is already connected to `Oilheater/stratasnap`, we push over the placeholder.

```bash
cd stratasnap-build
git init
git remote add origin git@github.com:Oilheater/stratasnap.git
git fetch
git checkout -B main
git add .
git commit -m "Production site — full build"
git push -f origin main
```

**Note the -f (force push).** This overwrites the placeholder. If there's anything on the placeholder repo you want to keep, back it up first.

### 2. Environment variables in Vercel

Go to Vercel → stratasnap project → Settings → Environment Variables. Add:

**Required for the site to work:**
- `ANTHROPIC_API_KEY` — from console.anthropic.com

**Required for payment buttons to work:**
- `NEXT_PUBLIC_PAYMENT_LINK_SINGLE` — from Stripe
- `NEXT_PUBLIC_PAYMENT_LINK_FIVEPACK` — from Stripe
- `NEXT_PUBLIC_PAYMENT_LINK_TENPACK` — from Stripe

**Required for Stripe webhook to work:**
- `STRIPE_SECRET_KEY` — from Stripe
- `STRIPE_WEBHOOK_SECRET` — from Stripe

All should be enabled for Production, Preview, Development scopes.

### 3. Redeploy

Vercel auto-deploys on push. Watch the build. Should complete in ~2 minutes.

### 4. Test

Load stratasnap.com.au. Site should render the full production version.

Try uploading a PDF (need real strata PDF for good test).

## Cost per month

| Item | Cost |
|---|---|
| Vercel Pro | $31 (already paying) |
| Domain | ~$3/mo amortised |
| Anthropic API | ~$1.50-3.00 per report processed |
| Stripe fees | 1.75% + 30c per transaction |
| **Fixed monthly** | **~$34** |

Per-sale margin:
- $19.99 single: ~$15 profit after all costs
- $9.99/report (bundle): ~$6 profit after all costs

## Still to build (post-launch)

- Bundle credit tracking (Supabase)
- Email delivery of PDF summaries (Resend or Postmark)
- PDF generation (React-PDF or Puppeteer)
- Magic link login for viewing past summaries
- Automated 30-day deletion cron
- OCR fallback for scanned PDFs
- Conveyancer white-label portal
- SEO landing pages for specific queries

## To run locally

```bash
cd stratasnap-build
npm install
cp .env.example .env.local
# fill in .env.local with keys
npm run dev
# open http://localhost:3000
```

Note: `npm run dev` won't run Vercel Python functions. For those, use `vercel dev` after installing `npm install -g vercel`.
