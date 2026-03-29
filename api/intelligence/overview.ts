type SourceStatus = {
  source: string;
  status: "ok" | "fallback" | "error";
  mode: "real" | "fallback";
  cached: boolean;
  failed: boolean;
  message: string;
};

type FeedItem = {
  id: string;
  publishedAt: string | null;
  fetchedAt: string;
  displayTime: string;
  source: string;
  region: string;
  tag: string;
  level: "高" | "中" | "低";
  title: string;
  impact: string;
};

type AssetItem = { asset: string; price: string; change: string; note: string };

const safeFetch = async (url: string) => {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "cache-control": "no-cache", pragma: "no-cache" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const formatHHmm = (isoText: string) =>
  new Date(isoText).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  });

const mapNews = (
  items: Array<{ title: string; pubDate?: string; guid?: string }>,
  source: string,
  fetchedAt: string,
): FeedItem[] =>
  items.map((item, index) => {
    const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : null;
    const displayTime = publishedAt ? formatHHmm(publishedAt) : `fetch@${formatHHmm(fetchedAt)}`;

    return {
      id: `${source}-${item.guid || index}-${publishedAt || fetchedAt}`,
      publishedAt,
      fetchedAt,
      displayTime,
      source,
      region: /Fed|U\.S|Treasury|inflation/i.test(item.title) ? "海外宏观" : "国际形势",
      tag: /oil|crude|OPEC/i.test(item.title) ? "原油" : /gold/i.test(item.title) ? "黄金" : "宏观",
      level: /surge|jump|war|sanction|rate|tariff/i.test(item.title) ? "高" : "中",
      title: item.title,
      impact: /oil|crude/i.test(item.title) ? "关注油气 / 航运，留意成本端压力" : "关注市场风险偏好变化",
    };
  });

const dedupeAndSortFeed = (feed: FeedItem[]): FeedItem[] => {
  const seen = new Set<string>();
  const uniq = feed.filter((item) => {
    const key = `${item.source}::${item.title}::${item.publishedAt || item.fetchedAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniq
    .sort((a, b) => {
      const aTs = Date.parse(a.publishedAt || a.fetchedAt);
      const bTs = Date.parse(b.publishedAt || b.fetchedAt);
      return bTs - aTs;
    })
    .slice(0, 12);
};

const mapAsset = (symbol: string, value: any): AssetItem => {
  const price = Number(value.close ?? value.price ?? 0);
  const prev = Number(value.previous_close ?? value.prev_close ?? price);
  const pct = prev ? ((price - prev) / prev) * 100 : 0;
  const change = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
  const map: Record<string, [string, string]> = {
    XAUUSD: ["COMEX 黄金", "避险交易温度计，需结合美元和利率一起看"],
    USDX: ["美元指数 DXY", "美元偏强时，风险资产波动通常放大"],
    XTIUSD: ["WTI 原油", "油价抬升时需关注通胀与成本线"],
    US10Y: ["10Y 美债收益率", "利率上行通常压制高估值资产"],
  };
  const [asset, note] = map[symbol] || [symbol, "关键资产监控"];
  return { asset, price: price ? price.toString() : "--", change, note };
};

const loadReuters = async (fetchedAt: string) => {
  const urls = [
    { label: "Reuters World", feedUrl: "https://feeds.reuters.com/reuters/worldNews" },
    { label: "Reuters Business", feedUrl: "https://feeds.reuters.com/reuters/businessNews" },
  ];

  const status: SourceStatus[] = [];
  const feed: FeedItem[] = [];

  await Promise.all(
    urls.map(async ({ label, feedUrl }) => {
      try {
        const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&_=${Date.now()}`;
        const json = await safeFetch(url);
        if (Array.isArray(json.items) && json.items.length) {
          feed.push(...mapNews(json.items, label, fetchedAt));
          status.push({ source: label, status: "ok", mode: "real", cached: false, failed: false, message: "实时拉取成功" });
        } else {
          status.push({ source: label, status: "fallback", mode: "fallback", cached: false, failed: true, message: "源返回空数据" });
        }
      } catch (error) {
        status.push({ source: label, status: "fallback", mode: "fallback", cached: false, failed: true, message: `不可用: ${String(error)}` });
      }
    }),
  );

  return { feed: dedupeAndSortFeed(feed), status };
};

export default async function handler(_req: any, res: any) {
  const fetchedAt = new Date().toISOString();
  const sourceStatus: SourceStatus[] = [];
  const assets: AssetItem[] = [];

  const news = await loadReuters(fetchedAt);
  sourceStatus.push(...news.status);

  const tdKey = process.env.TWELVEDATA_API_KEY;
  if (tdKey) {
    try {
      const symbols = ["XAU/USD", "USDX", "XTI/USD", "US10Y"];
      const requests = symbols.map((symbol) => safeFetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${tdKey}&source=docs`));
      const rows = await Promise.all(requests);
      rows.forEach((row, idx) => assets.push(mapAsset(symbols[idx].replace("/", ""), row)));
      sourceStatus.push({ source: "TwelveData", status: "ok", mode: "real", cached: false, failed: false, message: "关键资产实时接口可用" });
    } catch (error) {
      sourceStatus.push({ source: "TwelveData", status: "fallback", mode: "fallback", cached: false, failed: true, message: `接口异常: ${String(error)}` });
    }
  } else {
    sourceStatus.push({ source: "TwelveData", status: "fallback", mode: "fallback", cached: false, failed: true, message: "未配置 TWELVEDATA_API_KEY" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).json({ feed: news.feed, assets, sourceStatus, fetchedAt, cached: false });
}
