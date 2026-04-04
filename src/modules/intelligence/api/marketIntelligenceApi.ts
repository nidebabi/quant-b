import { FALLBACK_ASSETS, FALLBACK_CLUSTERS, FALLBACK_FEED } from "../constants";
import { normalizeFeedDisplayTime } from "../mappers";
import type { IntelAsset, IntelFeedItem, SourceStatus } from "../types";
import { formatPublishedTimeLabel } from "../utils/format";

interface OverviewApiResponse {
  feed?: IntelFeedItem[];
  assets?: IntelAsset[];
  sourceStatus?: SourceStatus[];
  feedDataSource?: "real" | "fallback" | "cached";
}

const safeFetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
};

export const fetchOverviewFromServerless = async (): Promise<OverviewApiResponse> => {
  return safeFetchJson<OverviewApiResponse>(`/api/intelligence/overview?t=${Date.now()}`);
};

export const fetchPublicNewsFallback = async (): Promise<IntelFeedItem[]> => {
  try {
    const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
      "(stock OR market OR fed OR inflation OR oil OR gold) AND sourcelang:english",
    )}&mode=artlist&maxrecords=30&format=json&sort=datedesc&t=${Date.now()}`;
    const json = await safeFetchJson<{ articles?: Array<{ title?: string; seendate?: string }> }>(gdeltUrl);
    const items = json.articles || [];
    if (!items.length) return normalizeFeedDisplayTime(FALLBACK_FEED);
    return items
      .slice()
      .filter((item) => item.title)
      .sort((a, b) => new Date(b.seendate || 0).getTime() - new Date(a.seendate || 0).getTime())
      .slice(0, 8)
      .map((item, index) => ({
      id: `gdelt-fallback-${item.seendate || "no-pub"}-${index}`,
      publishedAt: item.seendate,
      fetchedAt: new Date().toISOString(),
      displayTime: formatPublishedTimeLabel(item.seendate, new Date().toISOString()),
      source: "GDELT",
      region: "国际形势",
      tag: "宏观",
      level: index < 2 ? "高" : "中",
      title: item.title as string,
      impact: "关注市场风险偏好变化",
    }));
  } catch {
    return normalizeFeedDisplayTime(FALLBACK_FEED);
  }
};

export const getFallbackAssets = (): IntelAsset[] => FALLBACK_ASSETS;
export const getFallbackClusters = () => FALLBACK_CLUSTERS;
