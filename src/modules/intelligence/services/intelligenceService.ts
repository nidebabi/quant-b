import { buildAlerts, buildClusters, buildMappings, buildOverviewCards, getFallbackAlerts } from "../mappers";
import { fetchOverviewFromServerless, fetchPublicNewsFallback, getFallbackAssets, getFallbackClusters } from "../api/marketIntelligenceApi";
import type { MarketIntelligenceOverview, SourceStatus } from "../types";
import { formatDateTime } from "../utils/format";

const fallbackSourceStatus: SourceStatus[] = [
  { source: "Reuters News", status: "fallback", mode: "fallback", cached: false, failed: true, message: "使用前端回退快讯" },
  { source: "TwelveData", status: "fallback", mode: "fallback", cached: false, failed: true, message: "使用本地关键资产快照" },
];

const sortFeedByPublishedAtDesc = <T extends { publishedAt: string | null; fetchedAt: string }>(feed: T[]) =>
  [...feed].sort((a, b) => Date.parse(b.publishedAt || b.fetchedAt) - Date.parse(a.publishedAt || a.fetchedAt));

export const getMarketIntelligenceOverview = async (): Promise<MarketIntelligenceOverview> => {
  const now = formatDateTime(Date.now());

  try {
    const payload = await fetchOverviewFromServerless();
    const feed = sortFeedByPublishedAtDesc(payload.feed?.length ? payload.feed : await fetchPublicNewsFallback());
    const assets = payload.assets?.length ? payload.assets : getFallbackAssets();
    const clusters = buildClusters(feed);
    const alerts = buildAlerts(feed, clusters);
    const mappings = buildMappings(feed);
    const sourceStatus = payload.sourceStatus?.length ? payload.sourceStatus : fallbackSourceStatus;
    const hasSourceFailure = sourceStatus.some((item) => item.failed);
    const allSourcesFailed = sourceStatus.length > 0 && sourceStatus.every((item) => item.failed);
    const dataMode = sourceStatus.some((item) => item.mode === "real") ? "real" : "fallback";
    const cached = sourceStatus.some((item) => item.cached) || Boolean(payload.cached);

    const lastUpdated = formatDateTime(payload.fetchedAt || Date.now());
    return {
      overviewCards: buildOverviewCards({ lastUpdated: now, sourceStatus, feed, alerts }),
      feed,
      clusters: clusters.length ? clusters : getFallbackClusters(),
      assets,
      mappings,
      alerts,
      sourceStatus,
      lastUpdated,
      dataMode,
      cached,
      hasSourceFailure,
      allSourcesFailed,
    };
  } catch (error) {
    console.warn("[intelligence] aggregated request failed, fallback mode", error);
    const feed = sortFeedByPublishedAtDesc(await fetchPublicNewsFallback());
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
      dataMode: "fallback",
      cached: false,
      hasSourceFailure: true,
      allSourcesFailed: true,
    };
  }
};
