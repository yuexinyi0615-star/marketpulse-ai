# MarketPulse AI

Stage 1 MVP foundation for a visual-first market intelligence and financial education workspace.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase placeholder client
- Browser-loaded public market quotes and financial news RSS
- Static report and learning templates

## Pages

- Home Dashboard: `/`
- Market Dashboard: `/market`
- News Impact Page: `/news-impact`
- Company Search: `/company-search`
- Reports Library Placeholder: `/reports`
- Learning Center Placeholder: `/learning`

## Target Users

- Undergraduate students learning how market signals connect to business fundamentals
- Graduate students building evidence-weighted research workflows
- Professional users triaging news, sectors, reports, and live watchlists

## Environment

Copy `.env.example` to `.env.local` when adding real services. Do not commit secrets.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The current GitHub Pages build does not require API keys. Live quotes and news are loaded in the visitor's browser from public sources, and watchlist settings are stored in browser local storage. For production-grade reliability, route licensed data providers through Supabase Edge Functions or another backend so private keys are never exposed.

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

MarketPulse AI is for financial education and research workflow support. It does not provide investment advice, personalized recommendations, or instructions to buy or sell securities. Live source data, headline labels, and browser-generated scores must be independently verified before use in any financial decision.
