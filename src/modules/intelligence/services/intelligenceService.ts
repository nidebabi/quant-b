import { buildAlerts, buildClusters, buildMappings, buildOverviewCards, getFallbackAlerts } from "../mappers";
import {
  fetchOverviewFromServerless,
  fetchPublicNewsFallback,
  getFallbackAssets,
  getFallbackClusters,
  getStaticFallbackFeed,
} from "../api/marketIntelligenceApi";
import type { CacheStatus, FeedSource, IntelAsset, IntelFeedItem, MarketIntelligenceOverview, SourceStatus } from "../types";
import { formatDateTime } from "../utils/format";

const fallbackSourceStatus: SourceStatus[] = [
  { source: "Reuters News", status: "fallback", message: "使用前端回退快讯" },
  { source: "TwelveData", status: "fallback", message: "使用本地关键资产快照" },
];

export class MarketIntelligenceRefreshError extends Error {
  fallbackData: MarketIntelligenceOverview;

  constructor(message: string, fallbackData: MarketIntelligenceOverview) {
    super(message);
    this.name = "MarketIntelligenceRefreshError";
    this.fallbackData = fallbackData;
  }
}

const withFallbackSourceStatus = ({
  sourceStatus,
  usedFallbackFeed,
  usedFallbackAssets,
}: {
  sourceStatus: SourceStatus[];
  usedFallbackFeed: boolean;
  usedFallbackAssets: boolean;
}): SourceStatus[] => {
  const bySource = new Map(sourceStatus.map((item) => [item.source, item]));

  if (usedFallbackFeed) {
    bySource.set("Reuters News", {
      source: "Reuters News",
      status: "fallback",
      message: "聚合接口未返回可用快讯，自动切换前端回退快讯",
    });
  }

  if (usedFallbackAssets) {
    bySource.set("TwelveData", {
      source: "TwelveData",
      status: "fallback",
      message: "聚合接口未返回可用资产，自动切换本地关键资产快照",
    });
  }

  return Array.from(bySource.values());
};

const buildOverview = ({
  now,
  feed,
  assets,
  sourceStatus,
  feedSource,
  cacheStatus,
}: {
  now: string;
  feed: IntelFeedItem[];
  assets: IntelAsset[];
  sourceStatus: SourceStatus[];
  feedSource: FeedSource;
  cacheStatus: CacheStatus;
}): MarketIntelligenceOverview => {
  const clusters = buildClusters(feed);
  const alerts = buildAlerts(feed, clusters);

  return {
    overviewCards: buildOverviewCards({ lastUpdated: now, sourceStatus, feed, alerts }),
    feed,
    clusters: clusters.length ? clusters : getFallbackClusters(),
    assets,
    mappings: buildMappings(feed),
    alerts,
    sourceStatus,
    lastUpdated: now,
    feedSource,
    isFallback: sourceStatus.some((item) => item.status !== "ok") || feedSource === "fallback",
    cacheStatus,
  };
};

const buildHardFallbackOverview = async (now: string): Promise<MarketIntelligenceOverview> => {
  let fallbackFeed = getStaticFallbackFeed();

  try {
    fallbackFeed = await fetchPublicNewsFallback();
  } catch (fallbackError) {
    console.warn("[intelligence] fallback news source unavailable, use static feed", fallbackError);
  }

  const alerts = getFallbackAlerts();
  const sourceStatus = fallbackSourceStatus;

  return {
    overviewCards: buildOverviewCards({ lastUpdated: now, sourceStatus, feed: fallbackFeed, alerts }),
    feed: fallbackFeed,
    clusters: buildClusters(fallbackFeed).length ? buildClusters(fallbackFeed) : getFallbackClusters(),
    assets: getFallbackAssets(),
    mappings: buildMappings(fallbackFeed),
    alerts,
    sourceStatus,
    lastUpdated: now,
    feedSource: "fallback",
    isFallback: true,
    cacheStatus: "bypass",
  };
};

const resolveDataWithFallback = async (payload: {
  feed?: IntelFeedItem[];
  assets?: IntelAsset[];
  sourceStatus?: SourceStatus[];
  cacheStatus?: CacheStatus;
}) => {
  const usedFallbackFeed = (payload.feed?.length ?? 0) === 0;
  const usedFallbackAssets = (payload.assets?.length ?? 0) === 0;

  let feed = payload.feed || [];
  if (usedFallbackFeed) {
    try {
      feed = await fetchPublicNewsFallback();
    } catch (error) {
      console.warn("[intelligence] public news fallback request failed, use static feed", error);
      feed = getStaticFallbackFeed();
    }
  }

  const assets = payload.assets?.length ? payload.assets : getFallbackAssets();
  const sourceStatus = withFallbackSourceStatus({
    sourceStatus: payload.sourceStatus?.length ? payload.sourceStatus : fallbackSourceStatus,
    usedFallbackFeed,
    usedFallbackAssets,
  });

  return {
    feed,
    assets,
    sourceStatus,
    feedSource: usedFallbackFeed ? ("fallback" as const) : ("real" as const),
    cacheStatus: payload.cacheStatus || "unknown",
  };
};

export const getMarketIntelligenceOverview = async (): Promise<MarketIntelligenceOverview> => {
  const now = formatDateTime(Date.now());

  try {
    const payload = await fetchOverviewFromServerless();
    const resolved = await resolveDataWithFallback(payload);
    return buildOverview({ now, ...resolved });
  } catch (error) {
    console.error("[intelligence] aggregated request failed", error);
    const fallbackData = await buildHardFallbackOverview(now);
    throw new MarketIntelligenceRefreshError("刷新失败，当前展示 fallback 数据。", fallbackData);
  }
};
