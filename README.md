# MarketPulse AI

Stage 1 MVP foundation for a visual-first market intelligence and financial education workspace.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase client and server storage route helpers
- Daily Financial News Collection API routes
- OpenAI-powered News-to-Market Impact Engine
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
SUPABASE_SERVICE_ROLE_KEY=
NEWSAPI_API_KEY=
FMP_API_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

`SUPABASE_SERVICE_ROLE_KEY`, `NEWSAPI_API_KEY`, `FMP_API_KEY`, and `OPENAI_API_KEY` are server-only values. Do not prefix them with `NEXT_PUBLIC_`, and do not commit them.

If provider, Supabase, or OpenAI keys are missing, `/api/news/fetch` and `/api/news/list` return mock fallback articles and fallback impact analysis so the News Impact page still works during development.

## Daily News Collection

Apply the Supabase migrations in `supabase/migrations/` to create `news_articles` and add the market impact fields.

Routes:

- `POST /api/news/fetch`: fetches daily financial news from NewsAPI first, then Financial Modeling Prep if configured, normalizes related tickers, generates OpenAI market impact analysis, and stores articles plus analysis in Supabase.
- `GET /api/news/list`: lists stored articles from Supabase with mock fallback data if credentials are missing.

Tracked themes include U.S. stock market, Federal Reserve, interest rates, inflation, Treasury yields, technology stocks, energy, banks, crypto, commodities, major earnings, selected large-cap tickers, and sector ETFs.

The impact engine stores summary, financial relevance, related companies, related tickers, related ETFs, related sectors, bullish/bearish/neutral classification, MarketImpactScore, confidence score, short-term impact, medium-term impact, risk factors, alternative scenario, and a beginner-friendly explanation.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The news collection module uses server-side Next.js API routes, so GitHub Pages static hosting cannot run the full app. Deploy to a Next.js server host such as Vercel, Netlify, Render, or a Node server when using `/api/news/fetch` and Supabase storage.

The included GitHub Actions workflow now validates `npm run build` for the server app instead of attempting a static Pages export.

## Disclaimer

MarketPulse AI is for financial education and research workflow support. It does not provide investment advice, personalized recommendations, or instructions to buy or sell securities. Live source data, headline labels, and browser-generated scores must be independently verified before use in any financial decision.
