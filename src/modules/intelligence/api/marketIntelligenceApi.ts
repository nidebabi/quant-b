import { FALLBACK_ASSETS, FALLBACK_CLUSTERS, FALLBACK_FEED } from "../constants";
import type { IntelAsset, IntelFeedItem, SourceStatus } from "../types";

interface OverviewApiResponse {
  feed?: IntelFeedItem[];
  assets?: IntelAsset[];
  sourceStatus?: SourceStatus[];
  fetchedAt?: string;
  cached?: boolean;
}

const safeFetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
};

export const fetchOverviewFromServerless = async (): Promise<OverviewApiResponse> => {
  const url = `/api/intelligence/overview?t=${Date.now()}`;
  return safeFetchJson<OverviewApiResponse>(url);
};

export const fetchPublicNewsFallback = async (): Promise<IntelFeedItem[]> => {
  const now = new Date().toISOString();
  const url = `https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/reuters/worldNews&_=${Date.now()}`;
  try {
    const json = await safeFetchJson<{ items?: Array<{ title: string; pubDate?: string }> }>(url);
    const items = json.items || [];
    if (!items.length) return FALLBACK_FEED;
    return items.slice(0, 8).map((item, index) => ({
      id: `rss-${index}`,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      fetchedAt: now,
      displayTime: item.pubDate
        ? new Date(item.pubDate).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
        : `fetch@${new Date(now).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}`,
      source: "Reuters",
      region: "国际形势",
      tag: "宏观",
      level: index < 2 ? "高" : "中",
      title: item.title,
      impact: "关注市场风险偏好变化",
    }));
  } catch {
    return FALLBACK_FEED.map((item, index) => ({
      ...item,
      id: `fallback-${index}-${Date.now()}`,
      fetchedAt: now,
      displayTime: `fetch@${new Date(now).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}`,
    }));
  }
};

export const getFallbackAssets = (): IntelAsset[] => FALLBACK_ASSETS;
export const getFallbackClusters = () => FALLBACK_CLUSTERS;
