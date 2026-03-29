import { FALLBACK_ASSETS, FALLBACK_CLUSTERS, FALLBACK_FEED } from "../constants";
import { mapReutersNews } from "../mappers";
import type { CacheStatus, IntelAsset, IntelFeedItem, SourceStatus } from "../types";

interface OverviewApiResponse {
  feed?: IntelFeedItem[];
  assets?: IntelAsset[];
  sourceStatus?: SourceStatus[];
  cacheStatus?: CacheStatus;
}

const buildNoCacheUrl = (url: string): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}ts=${Date.now()}`;
};

const safeFetchJson = async <T>(url: string): Promise<{ data: T; cacheStatus: CacheStatus }> => {
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

  return {
    data: (await res.json()) as T,
    cacheStatus: (res.headers.get("x-cache-status") as CacheStatus) || "bypass",
  };
};

export const fetchOverviewFromServerless = async (): Promise<OverviewApiResponse> => {
  const { data, cacheStatus } = await safeFetchJson<OverviewApiResponse>(buildNoCacheUrl("/api/intelligence/overview"));
  return {
    ...data,
    cacheStatus: data.cacheStatus || cacheStatus,
  };
};

export const fetchPublicNewsFallback = async (): Promise<IntelFeedItem[]> => {
  const url = buildNoCacheUrl("https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/reuters/worldNews");
  const { data } = await safeFetchJson<{ items?: Array<{ title: string; pubDate?: string }> }>(url);
  const items = data.items || [];
  if (!items.length) {
    throw new Error("fallback news source returned no items");
  }

  return mapReutersNews(items);
};

export const getFallbackAssets = (): IntelAsset[] => FALLBACK_ASSETS;
export const getFallbackClusters = () => FALLBACK_CLUSTERS;
export const getStaticFallbackFeed = (): IntelFeedItem[] => FALLBACK_FEED;
