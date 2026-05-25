create table if not exists public.daily_market_outlooks (
  id uuid primary key default gen_random_uuid(),
  outlook_date date not null unique,
  generated_at timestamptz not null default now(),
  market_tone text not null check (market_tone in ('bullish', 'bearish', 'neutral')),
  outlook_summary text not null,
  key_themes text[] not null default '{}',
  opportunities text[] not null default '{}',
  risks text[] not null default '{}',
  watchlist text[] not null default '{}',
  beginner_explanation text not null,
  source_article_ids uuid[] not null default '{}',
  model text not null
);

create index if not exists daily_market_outlooks_generated_at_idx
  on public.daily_market_outlooks (generated_at desc);

alter table public.daily_market_outlooks enable row level security;
