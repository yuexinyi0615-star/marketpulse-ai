create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text,
  url text not null unique,
  published_time timestamptz,
  raw_description text,
  related_tickers text[] not null default '{}',
  provider text not null default 'manual',
  created_time timestamptz not null default now()
);

create index if not exists news_articles_published_time_idx
  on public.news_articles (published_time desc nulls last);

create index if not exists news_articles_created_time_idx
  on public.news_articles (created_time desc);

create index if not exists news_articles_related_tickers_idx
  on public.news_articles using gin (related_tickers);

alter table public.news_articles enable row level security;
