export type LiveQuote = {
  symbol: string;
  date: string;
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
};

export type LiveNewsItem = {
  title: string;
  source: string;
  link: string;
  publishedAt: string;
  impact: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  drivers: string[];
};

export const DEFAULT_SYMBOLS = ["SPY.US", "QQQ.US", "DIA.US", "AAPL.US", "MSFT.US", "NVDA.US", "TSLA.US", "JPM.US"];
export const DEFAULT_NEWS_QUERY = "stock market finance earnings when:1d";

const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const RSS_JSON_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";
const NEWS_KEYWORDS = [
  "earnings",
  "guidance",
  "rates",
  "inflation",
  "fed",
  "tariff",
  "chips",
  "ai",
  "oil",
  "debt",
  "jobs",
  "revenue",
  "margin",
  "merger"
];

function proxied(url: string) {
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
}

async function fetchWithTimeout(url: string, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function parseNumber(value: string) {
  const parsed = Number(value.replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (const character of line) {
    if (character === "\"") {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current);
  return values.map((value) => value.trim());
}

export async function fetchLiveQuotes(symbols: string[]): Promise<LiveQuote[]> {
  const normalizedSymbols = symbols
    .map((symbol) => symbol.trim().toLowerCase())
    .filter(Boolean);

  if (normalizedSymbols.length === 0) {
    return [];
  }

  const quoteUrl = `https://stooq.com/q/l/?s=${normalizedSymbols.join("+")}&f=sd2t2ohlcv&h&e=csv`;
  const response = await fetchWithTimeout(proxied(quoteUrl));

  if (!response.ok) {
    throw new Error(`Quote source returned ${response.status}`);
  }

  const csv = await response.text();
  const rows = csv.trim().split(/\r?\n/).slice(1);

  return rows
    .map((row) => {
      const [symbol, date, time, open, high, low, close, volume] = parseCsvLine(row);
      const openPrice = parseNumber(open);
      const closePrice = parseNumber(close);
      const change = closePrice - openPrice;
      const changePercent = openPrice ? (change / openPrice) * 100 : 0;

      return {
        symbol: symbol?.replace(".US", "") ?? "",
        date,
        time,
        open: openPrice,
        high: parseNumber(high),
        low: parseNumber(low),
        close: closePrice,
        volume: parseNumber(volume),
        change,
        changePercent
      };
    })
    .filter((quote) => quote.symbol && quote.close > 0);
}

function getText(parent: Element, selector: string) {
  return parent.querySelector(selector)?.textContent?.trim() ?? "";
}

function scoreHeadline(title: string): Pick<LiveNewsItem, "impact" | "sentiment" | "drivers"> {
  const lowerTitle = title.toLowerCase();
  const matchedDrivers = NEWS_KEYWORDS.filter((keyword) => lowerTitle.includes(keyword));
  const negativeWords = ["fall", "falls", "slump", "loss", "risk", "cuts", "warning", "down", "selloff"];
  const positiveWords = ["rise", "rises", "gain", "surge", "beats", "record", "up", "rally", "growth"];
  const negativeHits = negativeWords.filter((word) => lowerTitle.includes(word)).length;
  const positiveHits = positiveWords.filter((word) => lowerTitle.includes(word)).length;
  const impact = Math.min(95, 45 + matchedDrivers.length * 8 + Math.max(positiveHits, negativeHits) * 7);

  let sentiment: LiveNewsItem["sentiment"] = "Neutral";
  if (positiveHits > negativeHits) sentiment = "Positive";
  if (negativeHits > positiveHits) sentiment = "Negative";

  return {
    impact,
    sentiment,
    drivers: matchedDrivers.length ? matchedDrivers.slice(0, 4) : ["market context"]
  };
}

export async function fetchFinancialNews(query: string): Promise<LiveNewsItem[]> {
  const newsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  const jsonResponse = await fetchWithTimeout(`${RSS_JSON_PROXY}${encodeURIComponent(newsUrl)}`);
  if (jsonResponse.ok) {
    const payload = await jsonResponse.json() as {
      items?: Array<{
        title?: string;
        link?: string;
        pubDate?: string;
        author?: string;
      }>;
    };

    const items = payload.items ?? [];
    return items.slice(0, 12).map((item) => {
      const title = item.title ?? "";
      const scored = scoreHeadline(title);

      return {
        title,
        source: item.author || "Google News",
        link: item.link ?? "",
        publishedAt: item.pubDate ?? "",
        ...scored
      };
    }).filter((item) => item.title && item.link);
  }

  const response = await fetchWithTimeout(proxied(newsUrl));
  if (!response.ok) {
    throw new Error(`News source returned ${response.status}`);
  }
  const xml = await response.text();
  const document = new DOMParser().parseFromString(xml, "text/xml");

  return Array.from(document.querySelectorAll("item"))
    .slice(0, 12)
    .map((item) => {
      const title = getText(item, "title");
      const source = getText(item, "source") || "Google News";
      const link = getText(item, "link");
      const publishedAt = getText(item, "pubDate");
      const scored = scoreHeadline(title);

      return {
        title,
        source,
        link,
        publishedAt,
        ...scored
      };
    })
    .filter((item) => item.title && item.link);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 100 ? 2 : 3
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
