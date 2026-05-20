# MarketPulse AI

Stage 1 MVP foundation for a visual-first market intelligence and financial education workspace.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase placeholder client
- Mock market, news, company, report, learning, and prediction data

## Pages

- Home Dashboard: `/`
- Market Dashboard: `/market`
- News Impact Page: `/news-impact`
- Company Search Placeholder: `/company-search`
- Reports Library Placeholder: `/reports`
- Learning Center Placeholder: `/learning`
- Prediction Tracker Placeholder: `/predictions`

## Target Users

- Undergraduate students learning how market signals connect to business fundamentals
- Graduate students building evidence-weighted research workflows
- Professional users triaging news, sectors, reports, and prediction outcomes

## Environment

Copy `.env.example` to `.env.local` when adding real services. Do not commit secrets.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If Supabase keys are missing, the app uses mock data mode.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

This repo includes a GitHub Actions workflow that builds the static Next.js export and deploys it to GitHub Pages. After the code is pushed, enable Pages in the repository settings with **GitHub Actions** as the source. The site will publish at:

```text
https://yuexinyi0615-star.github.io/marketpulse-ai/
```

## Disclaimer

MarketPulse AI is for financial education and research workflow support. It does not provide investment advice, personalized recommendations, or instructions to buy or sell securities. All mock scores and predictions must be independently verified before use in any financial decision.
