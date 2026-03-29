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

const safeFetch = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  const age = response.headers.get("age");
  const xCache = response.headers.get("x-cache");
  const cached = Boolean((age && Number(age) > 0) || (xCache && /hit/i.test(xCache)));
  return { json, cached };
};

const formatDisplayTime = (value?: string): string => {
  if (!value) return "发布时间：未知";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "发布时间：未知";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `发布时间：${yyyy}年${mm}月${dd}日 ${hh}点${mi}分`;
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
    displayTime: formatDisplayTime(item.pubDate || new Date().toISOString()),
    source: "Reuters",
    region: /Fed|U\.S|Treasury|inflation/i.test(item.title) ? "海外宏观" : "国际形势",
    tag: /oil|crude|OPEC/i.test(item.title) ? "原油" : /gold/i.test(item.title) ? "黄金" : "宏观",
    level: /surge|jump|war|sanction|rate/i.test(item.title) ? "高" : "中",
    title: item.title,
    impact: /oil|crude/i.test(item.title) ? "关注油气 / 航运，留意成本端压力" : "关注市场风险偏好变化",
  }));

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
    const newsResp = await safeFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://feeds.reuters.com/reuters/worldNews")}&t=${Date.now()}`);
    if (Array.isArray(newsResp.json.items) && newsResp.json.items.length > 0) {
      feed.push(...mapNews(newsResp.json.items));
      feedDataSource = newsResp.cached ? "cached" : "real";
      sourceStatus.push({ source: "Reuters News", status: "ok", message: newsResp.cached ? "rss2json 返回缓存结果" : "rss2json 代理可用" });
    } else {
      sourceStatus.push({ source: "Reuters News", status: "fallback", message: "rss2json 未返回可用快讯" });
    }
  } catch (error) {
    sourceStatus.push({ source: "Reuters News", status: "fallback", message: `不可用: ${String(error)}` });
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

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).json({ feed, assets, sourceStatus, feedDataSource });
}
