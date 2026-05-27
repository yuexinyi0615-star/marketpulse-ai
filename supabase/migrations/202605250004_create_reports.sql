create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  report_type text not null,
  title text not null,
  period_label text not null,
  period_start date,
  period_end date,
  status text not null default 'published',
  executive_summary text not null,
  important_market_movements text[] not null default '{}',
  top_news jsonb not null default '[]'::jsonb,
  related_stocks text[] not null default '{}',
  related_etfs text[] not null default '{}',
  sector_performance jsonb not null default '[]'::jsonb,
  technical_analysis text not null,
  fundamental_analysis text not null,
  macro_analysis text not null,
  sentiment_analysis text not null,
  ai_market_interpretation text not null,
  risks_to_watch text[] not null default '{}',
  educational_explanation text not null,
  learning_takeaways text[] not null default '{}',
  disclaimer text not null,
  chart_points jsonb not null default '[]'::jsonb,
  summary_stats jsonb not null default '[]'::jsonb,
  generation_status text not null default 'mock',
  scheduled_placeholder text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_report_type_idx
  on public.reports (report_type);

create index if not exists reports_period_end_idx
  on public.reports (period_end desc nulls last);

alter table public.reports enable row level security;
