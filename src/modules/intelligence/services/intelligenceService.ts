import { buildAlerts, buildClusters, buildMappings, buildOverviewCards, getFallbackAlerts, normalizeFeedDisplayTime } from "../mappers";
import { fetchOverviewFromServerless, fetchPublicNewsFallback, getFallbackAssets, getFallbackClusters } from "../api/marketIntelligenceApi";
import type { FeedDataSource, IntelAsset, IntelFeedItem, MarketIntelligenceOverview, SourceStatus } from "../types";
import { formatDateTime } from "../utils/format";

export class IntelligenceRefreshError extends Error {
  fallbackData: MarketIntelligenceOverview;

  constructor(message: string, fallbackData: MarketIntelligenceOverview) {
    super(message);
    this.name = "IntelligenceRefreshError";
    this.fallbackData = fallbackData;
  }
}

const fallbackSourceStatus: SourceStatus[] = [
  { source: "Reuters News", status: "fallback", message: "使用前端回退快讯" },
  { source: "TwelveData", status: "fallback", message: "使用本地关键资产快照" },
];

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

const resolveDataWithFallback = async (payload: {
  feed?: IntelFeedItem[];
  assets?: IntelAsset[];
  sourceStatus?: SourceStatus[];
  feedDataSource?: FeedDataSource;
}) => {
  const feed = payload.feed?.length ? payload.feed : await fetchPublicNewsFallback();
  const assets = payload.assets?.length ? payload.assets : getFallbackAssets();

  const sourceStatus = withFallbackSourceStatus({
    sourceStatus: payload.sourceStatus?.length ? payload.sourceStatus : fallbackSourceStatus,
    usedFallbackFeed: (payload.feed?.length ?? 0) === 0,
    usedFallbackAssets: (payload.assets?.length ?? 0) === 0,
  });

  const feedDataSource: FeedDataSource = (payload.feed?.length ?? 0) === 0 ? "fallback" : payload.feedDataSource || "real";

  return { feed: normalizeFeedDisplayTime(feed), assets, sourceStatus, feedDataSource };
};

const buildOverview = ({
  now,
  feed,
  assets,
  sourceStatus,
  feedDataSource,
}: {
  now: string;
  feed: IntelFeedItem[];
  assets: IntelAsset[];
  sourceStatus: SourceStatus[];
  feedDataSource: FeedDataSource;
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
    feedDataSource,
    lastUpdated: now,
  };
};

export const getMarketIntelligenceOverview = async (): Promise<MarketIntelligenceOverview> => {
  const now = formatDateTime(Date.now());

  try {
    const payload = await fetchOverviewFromServerless();
    const { feed, assets, sourceStatus, feedDataSource } = await resolveDataWithFallback(payload);

    return buildOverview({ now, feed, assets, sourceStatus, feedDataSource });
  } catch (error) {
    console.warn("[intelligence] aggregated request failed, fallback mode", error);
    const feed = normalizeFeedDisplayTime(await fetchPublicNewsFallback());
    const clusters = buildClusters(feed);
    const alerts = getFallbackAlerts();
    const fallbackData = {
      overviewCards: buildOverviewCards({ lastUpdated: now, sourceStatus: fallbackSourceStatus, feed, alerts }),
      feed,
      clusters: clusters.length ? clusters : getFallbackClusters(),
      assets: getFallbackAssets(),
      mappings: buildMappings(feed),
      alerts,
      sourceStatus: fallbackSourceStatus,
      feedDataSource: "fallback" as const,
      lastUpdated: now,
    };

    throw new IntelligenceRefreshError("刷新失败：已切换为 fallback 数据。", fallbackData);
  }
};
