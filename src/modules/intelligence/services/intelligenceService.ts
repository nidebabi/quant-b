import { buildAlerts, buildClusters, buildMappings, buildOverviewCards, getFallbackAlerts } from "../mappers";
import { fetchOverviewFromServerless, fetchPublicNewsFallback, getFallbackAssets, getFallbackClusters } from "../api/marketIntelligenceApi";
import type { MarketIntelligenceOverview, SourceStatus } from "../types";
import { formatDateTime } from "../utils/format";

const fallbackSourceStatus: SourceStatus[] = [
  { source: "Reuters News", status: "fallback", message: "使用前端回退快讯" },
  { source: "TwelveData", status: "fallback", message: "使用本地关键资产快照" },
];

export const getMarketIntelligenceOverview = async (): Promise<MarketIntelligenceOverview> => {
  const now = formatDateTime(Date.now());

  try {
    const payload = await fetchOverviewFromServerless();
    const feed = payload.feed?.length ? payload.feed : await fetchPublicNewsFallback();
    const assets = payload.assets?.length ? payload.assets : getFallbackAssets();
    const clusters = buildClusters(feed);
    const alerts = buildAlerts(feed, clusters);
    const mappings = buildMappings(feed);
    const sourceStatus = payload.sourceStatus?.length ? payload.sourceStatus : fallbackSourceStatus;

    return {
      overviewCards: buildOverviewCards({ lastUpdated: now, sourceStatus, feed, alerts }),
      feed,
      clusters: clusters.length ? clusters : getFallbackClusters(),
      assets,
      mappings,
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
