type SourceStatus = { source: string; status: "ok" | "fallback" | "error"; message: string };

type FeedItem = {
  id: string;
  publishedAt?: string;
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
type GdeltArticle = { url?: string; title?: string; sourcecountry?: string; seendate?: string; socialimage?: string };
type GdeltResponse = { articles?: GdeltArticle[] };

const formatPublishedTimeLabel = (publishedAt?: string, fetchedAt?: string): string => {
  const picked = publishedAt || fetchedAt;
  if (!picked) return "发布时间：未知";

  const date = new Date(picked);
  if (Number.isNaN(date.getTime())) return "发布时间：未知";

  const year = date.toLocaleString("zh-CN", { year: "numeric", timeZone: "Asia/Shanghai" });
  const month = date.toLocaleString("zh-CN", { month: "2-digit", timeZone: "Asia/Shanghai" });
  const day = date.toLocaleString("zh-CN", { day: "2-digit", timeZone: "Asia/Shanghai" });
  const hour = date.toLocaleString("zh-CN", { hour: "2-digit", hour12: false, timeZone: "Asia/Shanghai" });
  const minute = date.toLocaleString("zh-CN", { minute: "2-digit", timeZone: "Asia/Shanghai" });
  return `发布时间：${year}年${month}月${day}日 ${hour}点${minute}分`;
};

const safeFetch = async (url: string) => {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  const age = response.headers.get("age");
  const xCache = response.headers.get("x-cache");
  const cached = Boolean((age && Number(age) > 0) || (xCache && /hit/i.test(xCache)));
  return { json, cached };
};

const dedupeFeed = (items: FeedItem[]): FeedItem[] => {
  const picked = new Map<string, FeedItem>();
  items.forEach((item) => {
    const key = `${item.title}::${item.publishedAt || ""}`;
    if (!picked.has(key)) {
      picked.set(key, item);
    }
  });
  return Array.from(picked.values()).slice(0, 8);
};

const mapNews = (items: Array<{ title: string; pubDate?: string }>): FeedItem[] =>
  items
    .slice()
    .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
    .slice(0, 8)
    .map((item, index) => ({
    id: `news-${item.pubDate || "no-pub"}-${index}`,
    publishedAt: item.pubDate,
    fetchedAt: new Date().toISOString(),
    displayTime: formatPublishedTimeLabel(item.pubDate, new Date().toISOString()),
    source: "Reuters",
    region: /Fed|U\.S|Treasury|inflation/i.test(item.title) ? "海外宏观" : "国际形势",
    tag: /oil|crude|OPEC/i.test(item.title) ? "原油" : /gold/i.test(item.title) ? "黄金" : "宏观",
    level: /surge|jump|war|sanction|rate/i.test(item.title) ? "高" : "中",
    title: item.title,
    impact: /oil|crude/i.test(item.title) ? "关注油气 / 航运，留意成本端压力" : "关注市场风险偏好变化",
  }));

const mapGdeltNews = (items: GdeltArticle[]): FeedItem[] =>
  items
    .filter((item) => item.title)
    .map((item, index) => ({
      id: `gdelt-${item.seendate || "no-time"}-${index}`,
      publishedAt: item.seendate,
      fetchedAt: new Date().toISOString(),
      displayTime: formatPublishedTimeLabel(item.seendate, new Date().toISOString()),
      source: "GDELT",
      region: /United States|USA|US/i.test(item.sourcecountry || "") ? "海外宏观" : "国际形势",
      tag: /oil|crude|opec/i.test(item.title || "") ? "原油" : /gold/i.test(item.title || "") ? "黄金" : "宏观",
      level: (/surge|jump|war|sanction|rate|tariff|conflict/i.test(item.title || "") ? "高" : "中") as "高" | "中" | "低",
      title: item.title as string,
      impact: /oil|crude/i.test(item.title || "") ? "关注油气 / 航运，留意成本端压力" : "关注市场风险偏好变化",
    }))
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

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

export default async function handler(_req: any, res: any) {
  const sourceStatus: SourceStatus[] = [];
  const feed: FeedItem[] = [];
  const assets: AssetItem[] = [];
  let feedDataSource: "real" | "fallback" | "cached" = "fallback";

  try {
    const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
      "(stock OR market OR fed OR inflation OR oil OR gold) AND sourcelang:english",
    )}&mode=artlist&maxrecords=50&format=json&sort=datedesc`;
    const gdeltResp = await safeFetch(`${gdeltUrl}&t=${Date.now()}`);
    const gdeltItems = Array.isArray((gdeltResp.json as GdeltResponse).articles) ? (gdeltResp.json as GdeltResponse).articles || [] : [];
    if (gdeltItems.length > 0) {
      feed.push(...dedupeFeed(mapGdeltNews(gdeltItems)));
      feedDataSource = gdeltResp.cached ? "cached" : "real";
      sourceStatus.push({
        source: "GDELT News",
        status: "ok",
        message: gdeltResp.cached ? `GDELT 返回缓存结果（${gdeltItems.length} 条）` : `GDELT 返回实时结果（${gdeltItems.length} 条）`,
      });
    } else {
      sourceStatus.push({ source: "GDELT News", status: "fallback", message: "GDELT 未返回可用快讯" });
    }
  } catch (error) {
    sourceStatus.push({ source: "GDELT News", status: "fallback", message: `不可用: ${String(error)}` });
  }

  if (!feed.length) {
    try {
      const reutersResp = await safeFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://feeds.reuters.com/reuters/worldNews")}&t=${Date.now()}`);
      if (Array.isArray(reutersResp.json.items) && reutersResp.json.items.length > 0) {
        feed.push(...dedupeFeed(mapNews(reutersResp.json.items)));
        feedDataSource = reutersResp.cached ? "cached" : "real";
        sourceStatus.push({
          source: "Reuters News",
          status: "ok",
          message: reutersResp.cached ? `Reuters 代理返回缓存结果（${reutersResp.json.items.length} 条）` : `Reuters 代理可用（${reutersResp.json.items.length} 条）`,
        });
      } else {
        sourceStatus.push({ source: "Reuters News", status: "fallback", message: "Reuters 代理未返回可用快讯" });
      }
    } catch (error) {
      sourceStatus.push({ source: "Reuters News", status: "fallback", message: `不可用: ${String(error)}` });
    }
  }

  const tdKey = process.env.TWELVEDATA_API_KEY;
  if (tdKey) {
    try {
      const symbols = ["XAU/USD", "USDX", "XTI/USD", "US10Y"];
      const requests = symbols.map((symbol) => safeFetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${tdKey}&t=${Date.now()}`));
      const rows = await Promise.all(requests);
      rows.forEach((row, idx) => assets.push(mapAsset(symbols[idx].replace("/", ""), row.json)));
      sourceStatus.push({ source: "TwelveData", status: "ok", message: "关键资产实时接口可用" });
    } catch (error) {
      sourceStatus.push({ source: "TwelveData", status: "fallback", message: `接口异常: ${String(error)}` });
    }
  } else {
    sourceStatus.push({ source: "TwelveData", status: "fallback", message: "未配置 TWELVEDATA_API_KEY" });
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).json({ feed, assets, sourceStatus, feedDataSource });
}
