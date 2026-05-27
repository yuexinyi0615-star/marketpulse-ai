export type ReportType =
  | "Daily Market Report"
  | "Weekly Market Report"
  | "Monthly Market Report"
  | "Quarterly Market Report"
  | "Annual Market Report"
  | "Company Annual Report Summary"
  | "Company Quarterly Report Summary"
  | "Economic Data Report"
  | "Sector Rotation Report"
  | "Prediction Accuracy Report";

export type ReportNewsItem = {
  title: string;
  source: string;
  url: string;
};

export type ReportSectorPerformance = {
  sector: string;
  performance: number;
  tone: "positive" | "neutral" | "negative";
};

export type ReportChartPoint = {
  label: string;
  impact: number;
  sentiment: number;
};

export type ReportSummaryStat = {
  label: string;
  value: string;
  tone: "teal" | "amber" | "red" | "slate";
};

export type ResearchReport = {
  id?: string;
  slug: string;
  report_type: ReportType;
  title: string;
  period_label: string;
  period_start: string;
  period_end: string;
  status: "draft" | "published" | "scheduled" | "mock";
  executive_summary: string;
  important_market_movements: string[];
  top_news: ReportNewsItem[];
  related_stocks: string[];
  related_etfs: string[];
  sector_performance: ReportSectorPerformance[];
  technical_analysis: string;
  fundamental_analysis: string;
  macro_analysis: string;
  sentiment_analysis: string;
  ai_market_interpretation: string;
  risks_to_watch: string[];
  educational_explanation: string;
  learning_takeaways: string[];
  disclaimer: string;
  chart_points: ReportChartPoint[];
  summary_stats: ReportSummaryStat[];
  generation_status: "mock" | "scheduled-placeholder" | "generated";
  scheduled_placeholder: string;
  created_at: string;
  updated_at: string;
};

const disclaimer = "This report is for financial education and research workflow support only. It is not investment advice or a recommendation to buy or sell securities.";
const now = new Date().toISOString();

const baseChart: ReportChartPoint[] = [
  { label: "Start", impact: 45, sentiment: 48 },
  { label: "Mid", impact: 58, sentiment: 55 },
  { label: "Close", impact: 67, sentiment: 61 }
];

function buildReport(
  slug: string,
  reportType: ReportType,
  title: string,
  periodLabel: string,
  summary: string,
  stocks: string[],
  etfs: string[],
  sectors: ReportSectorPerformance[],
  stats: ReportSummaryStat[]
): ResearchReport {
  return {
    slug,
    report_type: reportType,
    title,
    period_label: periodLabel,
    period_start: "2026-05-01",
    period_end: "2026-05-25",
    status: "mock",
    executive_summary: summary,
    important_market_movements: [
      "Rates-sensitive assets reacted to Treasury yield movement.",
      "Technology leadership remained tied to AI and earnings expectations.",
      "Cross-asset sentiment stayed dependent on inflation and Federal Reserve expectations."
    ],
    top_news: [
      { title: "Fed rate expectations remain central to market direction", source: "MarketPulse Sample", url: "https://example.com/fed-rates" },
      { title: "AI-linked technology stocks continue to anchor index performance", source: "MarketPulse Sample", url: "https://example.com/ai-tech" },
      { title: "Energy and financials rotate around macro and yield signals", source: "MarketPulse Sample", url: "https://example.com/sector-rotation" }
    ],
    related_stocks: stocks,
    related_etfs: etfs,
    sector_performance: sectors,
    technical_analysis: "Technical analysis placeholder: compare trend, momentum, breadth, support/resistance, and volume confirmation for the period.",
    fundamental_analysis: "Fundamental analysis placeholder: review earnings revisions, margins, free cash flow, leverage, and valuation changes.",
    macro_analysis: "Macro analysis placeholder: connect inflation, Fed policy, Treasury yields, dollar strength, oil, and credit conditions to asset performance.",
    sentiment_analysis: "Sentiment analysis placeholder: classify the period's dominant tone using news intensity, price reaction, volatility, and breadth.",
    ai_market_interpretation: "AI interpretation: the market is balancing growth optimism against rate sensitivity. Confirm signals with source data before forming conclusions.",
    risks_to_watch: ["Inflation surprise", "Treasury yield spike", "Earnings guidance cuts", "Liquidity and positioning reversal"],
    educational_explanation: "A report turns market events into a structured learning artifact: what moved, why it mattered, what evidence supports it, and what to watch next.",
    learning_takeaways: [
      "Separate price movement from business fundamentals.",
      "Connect news catalysts to sectors and ETFs.",
      "Track whether market reaction confirms or rejects the narrative."
    ],
    disclaimer,
    chart_points: baseChart,
    summary_stats: stats,
    generation_status: "mock",
    scheduled_placeholder: "Scheduled generation placeholder: future cron jobs can generate this report type automatically from collected news, market data, and AI analysis.",
    created_at: now,
    updated_at: now
  };
}

export const MOCK_REPORTS: ResearchReport[] = [
  buildReport(
    "daily-market-report",
    "Daily Market Report",
    "Daily Market Report",
    "Today",
    "A concise daily snapshot of market tone, leading catalysts, sector pressure, and next-session risks.",
    ["AAPL", "MSFT", "NVDA", "JPM"],
    ["SPY", "QQQ", "XLF"],
    [
      { sector: "Technology", performance: 1.4, tone: "positive" },
      { sector: "Financials", performance: 0.3, tone: "neutral" },
      { sector: "Energy", performance: -0.6, tone: "negative" }
    ],
    [
      { label: "Market tone", value: "Neutral+", tone: "amber" },
      { label: "Impact", value: "67", tone: "teal" },
      { label: "Risk", value: "Moderate", tone: "amber" }
    ]
  ),
  buildReport("weekly-market-report", "Weekly Market Report", "Weekly Market Report", "This week", "A weekly review of index leadership, top news, sector rotation, and macro pressure.", ["NVDA", "TSLA", "XOM"], ["SPY", "QQQ", "XLE"], [
    { sector: "Technology", performance: 3.2, tone: "positive" },
    { sector: "Energy", performance: 1.1, tone: "positive" },
    { sector: "Healthcare", performance: -0.8, tone: "negative" }
  ], [
    { label: "Breadth", value: "Mixed", tone: "amber" },
    { label: "Top ETF", value: "QQQ", tone: "teal" },
    { label: "Volatility", value: "Stable", tone: "slate" }
  ]),
  buildReport("monthly-market-report", "Monthly Market Report", "Monthly Market Report", "This month", "A monthly synthesis of performance, valuation, macro conditions, and sector leadership.", ["AAPL", "AMZN", "META"], ["SPY", "QQQ", "XLK"], [
    { sector: "Communication Services", performance: 4.8, tone: "positive" },
    { sector: "Technology", performance: 4.1, tone: "positive" },
    { sector: "Small Caps", performance: -1.2, tone: "negative" }
  ], [
    { label: "Momentum", value: "Positive", tone: "teal" },
    { label: "Macro", value: "Rates-led", tone: "amber" },
    { label: "Learning focus", value: "Rotation", tone: "slate" }
  ]),
  buildReport("quarterly-market-report", "Quarterly Market Report", "Quarterly Market Report", "This quarter", "A quarterly report connecting earnings trends, macro data, policy expectations, and factor rotation.", ["MSFT", "GOOGL", "JPM"], ["DIA", "QQQ", "XLF"], [
    { sector: "Financials", performance: 5.6, tone: "positive" },
    { sector: "Technology", performance: 6.7, tone: "positive" },
    { sector: "Energy", performance: 0.2, tone: "neutral" }
  ], [
    { label: "Earnings", value: "Constructive", tone: "teal" },
    { label: "Policy", value: "Uncertain", tone: "amber" },
    { label: "Risk level", value: "Medium", tone: "amber" }
  ]),
  buildReport("annual-market-report", "Annual Market Report", "Annual Market Report", "This year", "An annual market narrative summarizing leadership, macro cycles, valuation changes, and learning themes.", ["NVDA", "AAPL", "XOM"], ["SPY", "QQQ", "IWM"], [
    { sector: "Technology", performance: 22.4, tone: "positive" },
    { sector: "Energy", performance: 8.2, tone: "positive" },
    { sector: "Small Caps", performance: 3.1, tone: "neutral" }
  ], [
    { label: "Annual tone", value: "Risk-on", tone: "teal" },
    { label: "Main driver", value: "AI + rates", tone: "teal" },
    { label: "Watch", value: "Valuation", tone: "amber" }
  ]),
  buildReport("company-annual-report-summary", "Company Annual Report Summary", "Company Annual Report Summary", "FY review", "A company-level annual report summary focused on business performance, financial quality, risk factors, and valuation.", ["AAPL", "MSFT", "NVDA"], ["QQQ", "XLK"], [
    { sector: "Technology", performance: 18.6, tone: "positive" },
    { sector: "Semiconductors", performance: 31.2, tone: "positive" },
    { sector: "Software", performance: 12.4, tone: "positive" }
  ], [
    { label: "Quality", value: "High", tone: "teal" },
    { label: "Cash flow", value: "Strong", tone: "teal" },
    { label: "Valuation", value: "Demanding", tone: "amber" }
  ]),
  buildReport("company-quarterly-report-summary", "Company Quarterly Report Summary", "Company Quarterly Report Summary", "Latest quarter", "A quarterly company report template for earnings, guidance, margins, cash flow, and market reaction.", ["TSLA", "AMZN", "META"], ["QQQ", "SPY"], [
    { sector: "Consumer Discretionary", performance: 2.6, tone: "positive" },
    { sector: "Communication Services", performance: 5.4, tone: "positive" },
    { sector: "Technology", performance: 3.9, tone: "positive" }
  ], [
    { label: "Earnings read", value: "Mixed", tone: "amber" },
    { label: "Guidance", value: "Key", tone: "amber" },
    { label: "Reaction", value: "Selective", tone: "slate" }
  ]),
  buildReport("economic-data-report", "Economic Data Report", "Economic Data Report", "Latest macro cycle", "A macro report connecting inflation, labor data, Treasury yields, and Federal Reserve expectations to markets.", ["JPM", "XOM"], ["SPY", "DIA", "IWM"], [
    { sector: "Financials", performance: 1.8, tone: "positive" },
    { sector: "Energy", performance: 0.9, tone: "neutral" },
    { sector: "Small Caps", performance: -0.4, tone: "negative" }
  ], [
    { label: "Inflation", value: "Watch", tone: "amber" },
    { label: "Rates", value: "Driver", tone: "amber" },
    { label: "Macro risk", value: "Medium", tone: "amber" }
  ]),
  buildReport("sector-rotation-report", "Sector Rotation Report", "Sector Rotation Report", "Current rotation", "A sector rotation report comparing leadership, laggards, ETF flows, and macro catalysts.", ["NVDA", "JPM", "XOM"], ["XLK", "XLF", "XLE", "XLV"], [
    { sector: "Technology", performance: 2.9, tone: "positive" },
    { sector: "Financials", performance: 1.2, tone: "positive" },
    { sector: "Healthcare", performance: -0.5, tone: "negative" }
  ], [
    { label: "Leader", value: "XLK", tone: "teal" },
    { label: "Laggard", value: "XLV", tone: "red" },
    { label: "Rotation", value: "Growth-led", tone: "teal" }
  ]),
  buildReport("prediction-accuracy-report", "Prediction Accuracy Report", "Prediction Accuracy Report", "Research tracker", "A review of prior market hypotheses, outcomes, accuracy, and lessons for improving research discipline.", ["AAPL", "NVDA", "JPM"], ["SPY", "QQQ", "XLF"], [
    { sector: "Technology", performance: 2.1, tone: "positive" },
    { sector: "Financials", performance: 0.6, tone: "neutral" },
    { sector: "Broad Market", performance: 1.0, tone: "positive" }
  ], [
    { label: "Hit rate", value: "64%", tone: "teal" },
    { label: "Bias", value: "Growth tilt", tone: "amber" },
    { label: "Improve", value: "Risk cases", tone: "slate" }
  ])
];

export function getMockReport(slug: string) {
  return MOCK_REPORTS.find((report) => report.slug === slug) ?? MOCK_REPORTS[0];
}
