import type { LearningModule, Report } from "@/types/market";

export const reports: Report[] = [
  {
    title: "Live Market Brief Template",
    category: "Research workflow",
    audience: "Graduate",
    status: "Template",
    summary: "A reusable structure for turning live quotes, headline flow, and source links into a research note."
  },
  {
    title: "Beginner Headline Checklist",
    category: "Learning template",
    audience: "Undergraduate",
    status: "Template",
    summary: "A guided workflow for separating facts, interpretation, likely price channels, and unanswered questions."
  },
  {
    title: "Professional Source Review",
    category: "Decision note",
    audience: "Professional",
    status: "Draft",
    summary: "A compact review format for documenting market data source quality, timing, and decision relevance."
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
