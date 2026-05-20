import type {
  Company,
  LearningModule,
  MarketMetric,
  NewsImpact,
  Prediction,
  Report,
  SectorSignal
} from "@/types/market";

export const marketMetrics: MarketMetric[] = [
  { label: "S&P 500 Pulse", value: "5,318", change: "+0.8%", tone: "positive" },
  { label: "Nasdaq AI Basket", value: "142.6", change: "+1.9%", tone: "positive" },
  { label: "Volatility Watch", value: "16.4", change: "+2.1 pts", tone: "neutral" },
  { label: "Macro Risk", value: "Moderate", change: "Rates in focus", tone: "neutral" }
];

export const sectorSignals: SectorSignal[] = [
  { name: "AI Infrastructure", score: 91, momentum: "Hot" },
  { name: "Cloud Software", score: 74, momentum: "Hot" },
  { name: "Healthcare", score: 68, momentum: "Watch" },
  { name: "Financials", score: 55, momentum: "Watch" },
  { name: "Energy", score: 47, momentum: "Cool" },
  { name: "Consumer", score: 39, momentum: "Cool" }
];

export const trendSeries = [
  { label: "Mon", impact: 48, sentiment: 52 },
  { label: "Tue", impact: 56, sentiment: 58 },
  { label: "Wed", impact: 61, sentiment: 63 },
  { label: "Thu", impact: 58, sentiment: 54 },
  { label: "Fri", impact: 74, sentiment: 71 },
  { label: "Today", impact: 79, sentiment: 73 }
];

export const newsImpacts: NewsImpact[] = [
  {
    headline: "Chip suppliers rally as data center spending outlook improves.",
    asset: "NVDA",
    impactScore: 88,
    sentiment: "Positive",
    confidence: 84,
    drivers: ["AI capex read-through", "Supplier backlog", "Margin expansion"]
  },
  {
    headline: "Banks trade mixed after credit-loss commentary turns cautious.",
    asset: "JPM",
    impactScore: 61,
    sentiment: "Neutral",
    confidence: 66,
    drivers: ["Credit quality", "Rate sensitivity", "Deposit costs"]
  },
  {
    headline: "EV pricing pressure renews concern over near-term margins.",
    asset: "TSLA",
    impactScore: 72,
    sentiment: "Negative",
    confidence: 75,
    drivers: ["Gross margin", "Demand elasticity", "Inventory levels"]
  }
];

export const companies: Company[] = [
  {
    ticker: "NVDA",
    name: "Nvidia",
    sector: "Semiconductors",
    marketCap: "$3.2T",
    priceMove: "+3.4%",
    riskLevel: "Medium",
    thesis: "AI accelerator demand remains the main driver, with export controls and customer concentration as key risks."
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    sector: "Software",
    marketCap: "$3.1T",
    priceMove: "+1.2%",
    riskLevel: "Low",
    thesis: "Cloud scale and AI attach rates support durable growth while capex intensity pressures near-term cash flow."
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    sector: "Automobiles",
    marketCap: "$590B",
    priceMove: "-2.1%",
    riskLevel: "High",
    thesis: "Pricing, delivery cadence, and autonomy optionality create a high-variance thesis."
  }
];

export const reports: Report[] = [
  {
    title: "AI Infrastructure Weekly",
    category: "Sector brief",
    audience: "Graduate",
    status: "Ready",
    summary: "Tracks revenue durability, hyperscaler capex, backlog language, and valuation sensitivity."
  },
  {
    title: "Beginner Earnings Checklist",
    category: "Learning template",
    audience: "Undergraduate",
    status: "Template",
    summary: "A guided workflow for turning an earnings release into a thesis, risks, and follow-up questions."
  },
  {
    title: "Credit Quality Watch",
    category: "Professional note",
    audience: "Professional",
    status: "Draft",
    summary: "Compares bank commentary across charge-offs, deposits, net interest income, and provision outlooks."
  }
];

export const predictions: Prediction[] = [
  {
    thesis: "AI infrastructure leaders will outperform broad software through the next earnings cycle.",
    horizon: "6 weeks",
    confidence: 72,
    status: "Tracking"
  },
  {
    thesis: "Tesla's next-day move will be more sensitive to margin language than delivery volume.",
    horizon: "1 quarter",
    confidence: 61,
    status: "Needs review"
  },
  {
    thesis: "Large-cap banks will trade with credit risk commentary more than headline EPS.",
    horizon: "1 month",
    confidence: 58,
    status: "Tracking"
  }
];

export const learningModules: LearningModule[] = [
  {
    title: "Read a Market Moving Headline",
    audience: "Undergraduate",
    duration: "18 min",
    goal: "Separate facts, interpretation, and likely price channels."
  },
  {
    title: "Build an Evidence-Weighted Thesis",
    audience: "Graduate",
    duration: "35 min",
    goal: "Connect filings, market data, and news events with clear assumptions."
  },
  {
    title: "Turn Signals into a Research Brief",
    audience: "Professional",
    duration: "24 min",
    goal: "Translate market signals into a concise decision memo."
  }
];
