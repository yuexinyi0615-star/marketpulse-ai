import { buildNewsQuery, extractRelatedTickers, sanitizeArticle, TRACKED_TICKERS, type NewsArticle } from "@/lib/newsCollection";

type NewsApiArticle = {
  source?: {
    name?: string;
  };
  author?: string | null;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  publishedAt?: string | null;
};

type FmpArticle = {
  symbol?: string;
  publishedDate?: string;
  publisher?: string;
  title?: string;
  image?: string;
  site?: string;
  text?: string;
  url?: string;
};

function createdNow() {
  return new Date().toISOString();
}

export async function fetchNewsApiArticles(apiKey: string): Promise<NewsArticle[]> {
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", buildNewsQuery());
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "100");

  const response = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`NewsAPI returned ${response.status}`);
  }

  const payload = await response.json() as { articles?: NewsApiArticle[] };
  return (payload.articles ?? [])
    .filter((article) => article.title && article.url)
    .map((article) => {
      const text = `${article.title ?? ""} ${article.description ?? ""}`;
      return sanitizeArticle({
        title: article.title ?? "",
        source: article.source?.name ?? article.author ?? "NewsAPI",
        url: article.url ?? "",
        published_time: article.publishedAt ?? createdNow(),
        raw_description: article.description ?? "",
        related_tickers: extractRelatedTickers(text),
        provider: "newsapi",
        created_time: createdNow()
      });
    });
}

export async function fetchFmpArticles(apiKey: string): Promise<NewsArticle[]> {
  const symbols = TRACKED_TICKERS.join(",");
  const url = new URL("https://financialmodelingprep.com/stable/news/stock");
  url.searchParams.set("symbols", symbols);
  url.searchParams.set("limit", "100");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Financial Modeling Prep returned ${response.status}`);
  }

  const payload = await response.json() as FmpArticle[];
  return payload
    .filter((article) => article.title && article.url)
    .map((article) => {
      const text = `${article.title ?? ""} ${article.text ?? ""}`;
      return sanitizeArticle({
        title: article.title ?? "",
        source: article.publisher ?? article.site ?? "Financial Modeling Prep",
        url: article.url ?? "",
        published_time: article.publishedDate ?? createdNow(),
        raw_description: article.text ?? "",
        related_tickers: extractRelatedTickers(text, article.symbol),
        provider: "fmp",
        created_time: createdNow()
      });
    });
}
