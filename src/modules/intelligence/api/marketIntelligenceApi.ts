import { FALLBACK_ASSETS, FALLBACK_CLUSTERS, FALLBACK_FEED } from "../constants";
import type { IntelAsset, IntelFeedItem, SourceStatus } from "../types";

interface OverviewApiResponse {
  feed?: IntelFeedItem[];
  assets?: IntelAsset[];
  sourceStatus?: SourceStatus[];
  feedDataSource?: "real" | "fallback" | "cached";
}

const safeFetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
};

export const fetchOverviewFromServerless = async (): Promise<OverviewApiResponse> => {
  return safeFetchJson<OverviewApiResponse>(`/api/intelligence/overview?t=${Date.now()}`);
};

export const fetchPublicNewsFallback = async (): Promise<IntelFeedItem[]> => {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/reuters/worldNews";
  try {
    const json = await safeFetchJson<{ items?: Array<{ title: string; pubDate?: string }> }>(`${url}&t=${Date.now()}`);
    const items = json.items || [];
    if (!items.length) return FALLBACK_FEED;
    return items
      .slice()
      .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
      .slice(0, 8)
      .map((item, index) => ({
      id: `rss-${item.pubDate || "no-pub"}-${index}`,
      publishedAt: item.pubDate,
      fetchedAt: new Date().toISOString(),
      displayTime: item.pubDate
        ? new Date(item.pubDate).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
        : new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      source: "Reuters",
      region: "国际形势",
      tag: "宏观",
      level: index < 2 ? "高" : "中",
      title: item.title,
      impact: "关注市场风险偏好变化",
    }));
  } catch {
    return FALLBACK_FEED;
  }
};

export const getFallbackAssets = (): IntelAsset[] => FALLBACK_ASSETS;
export const getFallbackClusters = () => FALLBACK_CLUSTERS;
