type SourceStatus = { source: string; status: "ok" | "fallback" | "error"; message: string };

type FeedItem = {
  id: string;
  time: string;
  source: string;
  region: string;
  tag: string;
  level: "高" | "中" | "低";
  title: string;
  impact: string;
};

type AssetItem = { asset: string; price: string; change: string; note: string };

const safeFetch = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const mapNews = (items: Array<{ title: string; pubDate?: string }>): FeedItem[] =>
  items.slice(0, 8).map((item, index) => ({
    id: `news-${index}`,
    time: item.pubDate
      ? new Date(item.pubDate).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Shanghai" })
      : "--:--",
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

  try {
    const newsJson = await safeFetch("https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/reuters/worldNews");
    if (Array.isArray(newsJson.items)) {
      feed.push(...mapNews(newsJson.items));
      sourceStatus.push({ source: "Reuters News", status: "ok", message: "rss2json 代理可用" });
    }
  } catch (error) {
    sourceStatus.push({ source: "Reuters News", status: "fallback", message: `不可用: ${String(error)}` });
  }

  const tdKey = process.env.TWELVEDATA_API_KEY;
  if (tdKey) {
    try {
      const symbols = ["XAU/USD", "USDX", "XTI/USD", "US10Y"];
      const requests = symbols.map((symbol) =>
        safeFetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${tdKey}`),
      );
      const rows = await Promise.all(requests);
      rows.forEach((row, idx) => assets.push(mapAsset(symbols[idx].replace("/", ""), row)));
      sourceStatus.push({ source: "TwelveData", status: "ok", message: "关键资产实时接口可用" });
    } catch (error) {
      sourceStatus.push({ source: "TwelveData", status: "fallback", message: `接口异常: ${String(error)}` });
    }
  } else {
    sourceStatus.push({ source: "TwelveData", status: "fallback", message: "未配置 TWELVEDATA_API_KEY" });
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
  res.status(200).json({ feed, assets, sourceStatus });
}
