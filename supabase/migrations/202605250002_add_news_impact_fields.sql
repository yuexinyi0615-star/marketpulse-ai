alter table public.news_articles
  add column if not exists short_summary text,
  add column if not exists why_it_matters_financially text,
  add column if not exists related_companies text[] not null default '{}',
  add column if not exists related_etfs text[] not null default '{}',
  add column if not exists related_sectors text[] not null default '{}',
  add column if not exists market_classification text check (market_classification in ('bullish', 'bearish', 'neutral')),
  add column if not exists market_impact_score integer check (market_impact_score between 0 and 100),
  add column if not exists confidence_score integer check (confidence_score between 0 and 100),
  add column if not exists short_term_impact text,
  add column if not exists medium_term_impact text,
  add column if not exists risk_factors text[] not null default '{}',
  add column if not exists alternative_scenario text,
  add column if not exists beginner_explanation text,
  add column if not exists impact_generated_at timestamptz,
  add column if not exists impact_model text;

create index if not exists news_articles_market_classification_idx
  on public.news_articles (market_classification);

create index if not exists news_articles_market_impact_score_idx
  on public.news_articles (market_impact_score desc nulls last);
