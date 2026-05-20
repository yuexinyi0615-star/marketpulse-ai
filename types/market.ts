export type Audience = "Undergraduate" | "Graduate" | "Professional";

export type MarketMetric = {
  label: string;
  value: string;
  change: string;
  tone: "positive" | "neutral" | "negative";
};

export type SectorSignal = {
  name: string;
  score: number;
  momentum: "Hot" | "Watch" | "Cool";
};

export type NewsImpact = {
  headline: string;
  asset: string;
  impactScore: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  confidence: number;
  drivers: string[];
};

export type Company = {
  ticker: string;
  name: string;
  sector: string;
  marketCap: string;
  priceMove: string;
  riskLevel: "Low" | "Medium" | "High";
  thesis: string;
};

export type Report = {
  title: string;
  category: string;
  audience: Audience;
  status: "Draft" | "Ready" | "Template";
  summary: string;
};

export type Prediction = {
  thesis: string;
  horizon: string;
  confidence: number;
  status: "Tracking" | "Needs review" | "Closed";
};

export type LearningModule = {
  title: string;
  audience: Audience;
  duration: string;
  goal: string;
};
