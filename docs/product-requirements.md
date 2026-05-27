# MarketPulse AI Product Requirements

## Product Vision

MarketPulse AI is a visual-first financial intelligence and education platform that helps users understand how market news, company fundamentals, macro data, sector rotation, filings, and investor sentiment connect to stock and ETF performance.

The product should feel like a research cockpit: fast to scan, rich in charts and cards, and structured enough for students while still useful for graduate-level and professional workflows.

MarketPulse AI is not an investment advisor. It is an educational and research workflow product that helps users organize evidence, understand market context, and practice disciplined analysis.

## Target Users

- Undergraduate students learning financial markets, company analysis, and market vocabulary.
- Graduate students building evidence-weighted research and thesis workflows.
- Professional users triaging market news, company data, macro conditions, and recurring reports.

## Core Product Principles

- Visual-first: dashboards should prioritize charts, gauges, heatmaps, scorecards, cards, and summary graphics.
- Explainable: AI outputs must show why something matters, what evidence supports it, and what could go wrong.
- Education-aware: every advanced insight should have a beginner-friendly explanation.
- Secure-by-default: API keys and service-role credentials must stay server-side.
- Fallback-ready: every major feature should work with mock data when provider keys are missing.
- Research-first: the app should help users form, test, and review market hypotheses without giving personalized financial advice.

## Major Product Modules

### 1. Visual-First Financial Dashboard

The dashboard is the main landing experience for market awareness.

Required capabilities:

- Market overview cards
- Watchlist movement
- Market heat tiles
- Sector performance summary
- Daily market scorecard
- Latest market news
- Financial education disclaimer
- Singapore-time timestamp display
- Mock fallback mode when live provider access is unavailable

### 2. News-to-Market Impact Engine

The system collects financial news and converts it into structured market-impact analysis.

Required article fields:

- Title
- Source
- URL
- Published time
- Raw description
- Related tickers
- Created time

Required AI-generated fields:

- Short summary
- Why it matters financially
- Related companies
- Related stock tickers
- Related ETFs
- Related sectors
- Bullish, bearish, or neutral classification
- MarketImpactScore from 0 to 100
- Confidence score
- Short-term impact, 1-3 days
- Medium-term impact, 1-4 weeks
- Risk factors
- Alternative scenario
- Beginner-friendly explanation
- Citations and source links

### 3. AI Market Scenario Analysis

The scenario analysis module should help users explore what could happen next.

Required scenarios:

- Base case
- Bull case
- Bear case
- Alternative scenario
- Key catalysts
- Risk triggers
- Time horizon assumptions
- Related stocks, ETFs, and sectors

### 4. Technical Analysis

The technical analysis module should support visual market structure review.

Required capabilities:

- Price trend placeholder
- Moving average placeholder
- Relative strength placeholder
- Support and resistance placeholder
- Volume confirmation placeholder
- Momentum and trend notes

Initial implementation may use placeholders; later stages should add live charting.

### 5. Fundamental Analysis

The fundamental analysis module should help users understand business and valuation quality.

Required fields:

- Revenue
- EPS
- Free cash flow
- Debt
- Margins
- ROE
- ROA
- Valuation ratios
- Business description
- Peer and competitor context
- AI interpretation
- Learning explanation

### 6. Macro Analysis

The macro analysis module should connect economic data to market behavior.

Required themes:

- Federal Reserve
- Interest rates
- Inflation
- Treasury yields
- Labor market
- Credit conditions
- Energy prices
- Commodities
- Currency and dollar strength

### 7. Sentiment Analysis

The sentiment module should classify market tone from news and price reaction.

Required outputs:

- Bullish, bearish, or neutral tone
- Confidence score
- Sentiment drivers
- News intensity
- Sector sentiment
- Ticker sentiment
- Beginner-friendly interpretation

### 8. Sector Rotation

The sector rotation module should show which sectors are leading or lagging.

Required views:

- Sector heatmap
- Sector performance bars
- Related ETF badges
- Rotation narrative
- Risk-on versus risk-off interpretation
- Macro explanation for sector moves

### 9. Daily Market Scorecard

The daily scorecard should summarize the market after U.S. market close.

Required fields:

- Overall market tone
- MarketImpactScore
- Breadth
- Top sectors
- Weak sectors
- Top news catalysts
- Macro drivers
- Watchlist
- Risks for next session
- Generated time in Singapore time

### 10. Reports Library

The reports library stores and displays recurring research reports.

Report types:

- Daily Market Report
- Weekly Market Report
- Monthly Market Report
- Quarterly Market Report
- Annual Market Report
- Company Annual Report Summary
- Company Quarterly Report Summary
- Economic Data Report
- Sector Rotation Report
- Prediction Accuracy Report

Each report should include:

- Executive summary
- Important market movements
- Top news
- Related stocks and ETFs
- Sector performance
- Technical analysis
- Fundamental analysis
- Macro analysis
- Sentiment analysis
- AI market interpretation
- Risks to watch
- Educational explanation
- What I should learn from this period
- Disclaimer

Visual requirements:

- Charts
- Cards
- Summary graphics
- Sector bars
- Related stock and ETF badges
- Top news links
- Risk cards
- Learning takeaway sections

### 11. Company Search

The company search module lets users search by:

- Ticker
- Company name
- Sector
- Industry
- ETF
- Keyword

Company detail pages should show:

- Company overview
- Ticker
- Exchange
- Sector
- Industry
- Business description
- Market cap
- Price
- Daily, weekly, monthly, and yearly performance
- 52-week high and low
- Volume
- Valuation ratios
- Revenue
- EPS
- Free cash flow
- Debt
- Margins
- ROE
- ROA
- Latest news
- Related ETFs
- Competitors
- AI analysis
- Technical analysis placeholder
- Fundamental analysis placeholder
- How to analyze this company learning section

### 12. SEC Filing Summaries

The SEC filings module should help users interpret company filings.

Required filing types:

- 10-K
- 10-Q
- 8-K
- S-1
- DEF 14A
- Insider transaction summaries

Required outputs:

- Filing summary
- Key business changes
- Financial highlights
- Risk factors
- Management discussion highlights
- Beginner-friendly filing explanation
- Source filing link

### 13. Prediction Tracker

The prediction tracker should help users create and review market hypotheses.

Required fields:

- Prediction thesis
- Related ticker, ETF, sector, or macro variable
- Time horizon
- Confidence score
- Supporting evidence
- Risk factors
- Outcome
- Accuracy status
- Post-mortem explanation

This is a learning and research discipline feature, not a recommendation engine.

### 14. Watchlist

The watchlist should let users monitor selected tickers and ETFs.

Required capabilities:

- Add/remove tickers
- View price and performance
- Show latest news
- Show impact scores
- Show sector and ETF relationships
- Store user watchlist in Supabase in later stages

### 15. Stock Screener

The stock screener should help users filter companies.

Potential filters:

- Sector
- Industry
- Market cap
- Valuation ratios
- Revenue growth
- Margins
- ROE
- ROA
- Debt
- Free cash flow
- Price performance
- Sentiment
- MarketImpactScore

### 16. Research Copilot

The research copilot should guide users through structured research questions.

Required capabilities:

- Explain market events
- Help compare companies
- Summarize filings and reports
- Generate research checklists
- Help form a thesis
- Identify missing evidence
- Explain concepts for beginner, graduate, and professional levels

The copilot must cite source content where available and avoid giving personalized financial advice.

## Viewing Modes

MarketPulse AI should support three viewing modes.

### Student Mode

- Beginner-friendly explanations
- Definitions of financial terms
- Guided workflows
- More educational context
- Lower information density

### Graduate Mode

- Evidence-weighted analysis
- Methodology prompts
- Research templates
- Thesis and risk framing
- Moderate information density

### Professional Mode

- Fast triage
- Compact dashboards
- More metrics per screen
- Decision-ready summaries
- Higher information density

## Data Sources

Primary providers:

- Financial Modeling Prep
- NewsAPI
- OpenAI API
- Supabase
- SEC EDGAR in future stages

Fallback behavior:

- If provider keys are missing, use mock data.
- Mock data must clearly identify itself as fallback or mock mode.
- The app must continue to build and render without external API keys.

## Security Requirements

- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `NEWSAPI_API_KEY`, `FMP_API_KEY`, `OPENAI_API_KEY`, or `CRON_SECRET` to the frontend.
- Only `NEXT_PUBLIC_*` environment variables may be used client-side.
- Cron and admin refresh routes must require bearer-token authorization.
- API keys must be stored as server environment variables.
- GitHub Pages static hosting cannot run server API routes; deploy the full app to a Next.js server host such as Vercel.

## Database Requirements

Supabase tables:

- `news_articles`
- `daily_market_outlooks`
- `reports`
- Future: `watchlists`
- Future: `predictions`
- Future: `sec_filings`
- Future: `screener_presets`
- Future: `copilot_threads`

Migrations live in:

- `supabase/migrations/`

## Scheduling Requirements

The automatic daily update should run after U.S. market close.

Current Vercel Cron schedule:

- `22:30 UTC` Monday-Friday
- `06:30 Singapore time` Tuesday-Saturday

The daily update should:

- Check `CRON_SECRET` authorization.
- Fetch latest financial news.
- Store new articles.
- Generate AI summaries and market-impact analysis.
- Generate daily market outlook.
- Save results to Supabase.
- Return JSON counts for fetched articles, stored articles, analyses, and outlook generation.

## Disclaimer Requirements

Every major market, company, report, prediction, and copilot experience should include or link to a disclaimer.

Required disclaimer meaning:

- MarketPulse AI is for education and research workflow support.
- It does not provide investment advice.
- It does not provide personalized recommendations.
- It does not instruct users to buy or sell securities.
- Users must verify source data independently.
- Users should consult qualified professionals before making financial decisions.

## Staged Build Roadmap

### Stage 1: MVP Foundation

- Next.js, TypeScript, Tailwind CSS foundation
- Home dashboard
- Market dashboard
- News Impact page
- Company Search placeholder
- Reports Library placeholder
- Learning Center placeholder
- Financial education disclaimer
- Mock data fallback

### Stage 2: Live News and Market Data

- Daily financial news collection
- NewsAPI or Financial Modeling Prep integration
- Supabase article storage
- Browser-safe fallback data
- Server-side API routes

### Stage 3: News-to-Market Impact Engine

- OpenAI-generated article summaries
- MarketImpactScore
- Sentiment classification
- Related stocks, ETFs, sectors, and companies
- Short-term and medium-term impact
- Risk and alternative scenario analysis

### Stage 4: Automatic Daily Update

- Secure cron route
- Vercel Cron schedule
- Daily market outlook
- Admin manual refresh page
- Singapore-time display

### Stage 5: Company Research

- Company search
- Company detail pages
- FMP-backed company data
- Mock fallback data
- Technical and fundamental placeholders
- Company-specific learning sections

### Stage 6: Reports Library

- Reports table
- Reports list page
- Individual report pages
- Ten report types
- Mock reports
- Scheduled report generation placeholders
- Visual report graphics

### Stage 7: SEC Filings

- SEC EDGAR integration
- Filing list by company
- Filing summaries
- Risk factor extraction
- Filing learning explanations

### Stage 8: Prediction Tracker

- Prediction creation
- Outcome tracking
- Accuracy report
- Post-mortem workflow
- Learning-focused research discipline

### Stage 9: Watchlist and Screener

- User watchlists
- Screener filters
- Saved screener presets
- Ticker impact alerts
- Sector and ETF relationship views

### Stage 10: Research Copilot and User Modes

- Copilot chat workflow
- Student, graduate, and professional modes
- Source-cited explanations
- Research templates
- More personalized interface settings without providing investment advice

## Build Requirements

The app must pass:

```bash
npm run build
```

If local npm is unavailable in the environment, the equivalent Next.js production build must pass.

## Success Criteria

- Users can scan a visual-first financial dashboard.
- Users can understand why news matters to stocks, ETFs, sectors, and macro conditions.
- Users can search companies and open detailed company profiles.
- Users can read visual reports and individual report pages.
- Users can see daily market scorecards and outlooks after market close.
- Future users can track predictions, filings, watchlists, screeners, and copilot research.
- All sensitive keys remain server-only.
- Mock fallback mode works without external provider keys.
- Production build succeeds.
