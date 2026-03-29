import { buildAlerts, buildClusters, buildMappings, buildOverviewCards, getFallbackAlerts } from "../mappers";
import { fetchOverviewFromServerless, fetchPublicNewsFallback, getFallbackAssets, getFallbackClusters } from "../api/marketIntelligenceApi";
import type { IntelAsset, IntelFeedItem, MarketIntelligenceOverview, SourceStatus } from "../types";
import { formatDateTime } from "../utils/format";

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
}) => {
  const feed = payload.feed?.length ? payload.feed : await fetchPublicNewsFallback();
  const assets = payload.assets?.length ? payload.assets : getFallbackAssets();

  const sourceStatus = withFallbackSourceStatus({
    sourceStatus: payload.sourceStatus?.length ? payload.sourceStatus : fallbackSourceStatus,
    usedFallbackFeed: (payload.feed?.length ?? 0) === 0,
    usedFallbackAssets: (payload.assets?.length ?? 0) === 0,
  });

  return { feed, assets, sourceStatus };
};

export const getMarketIntelligenceOverview = async (): Promise<MarketIntelligenceOverview> => {
  const now = formatDateTime(Date.now());

  try {
    const payload = await fetchOverviewFromServerless();
    const { feed, assets, sourceStatus } = await resolveDataWithFallback(payload);
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
    };
  } catch (error) {
    console.warn("[intelligence] aggregated request failed, fallback mode", error);
    const feed = await fetchPublicNewsFallback();
    const clusters = buildClusters(feed);
    const alerts = getFallbackAlerts();

    return {
      overviewCards: buildOverviewCards({ lastUpdated: now, sourceStatus: fallbackSourceStatus, feed, alerts }),
      feed,
      clusters: clusters.length ? clusters : getFallbackClusters(),
      assets: getFallbackAssets(),
      mappings: buildMappings(feed),
      alerts,
      sourceStatus: fallbackSourceStatus,
      lastUpdated: now,
    };
  }
};
