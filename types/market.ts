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

export type Report = {
  title: string;
  category: string;
  audience: Audience;
  status: "Draft" | "Ready" | "Template";
  summary: string;
};

export type LearningModule = {
  title: string;
  audience: Audience;
  duration: string;
  goal: string;
};
