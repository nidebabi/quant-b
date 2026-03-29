export type SourceState = "ok" | "fallback" | "error";
export type SourceMode = "real" | "fallback";

export interface SourceStatus {
  source: string;
  status: SourceState;
  mode: SourceMode;
  cached: boolean;
  failed: boolean;
  message: string;
}

export interface OverviewCard {
  title: "情报刷新频率" | "监控范围" | "情报系统状态" | "高优先级事件";
  value: string;
  detail: string;
  footnote: string;
  toneClass: string;
  cardClass: string;
}

export interface IntelFeedItem {
  id: string;
  publishedAt: string | null;
  fetchedAt: string;
  displayTime: string;
  source: string;
  region: string;
  tag: string;
  level: "高" | "中" | "低";
  title: string;
  impact: string;
}

export interface IntelCluster {
  theme: string;
  count: string;
  summary: string;
  tone: string;
}

export interface IntelAsset {
  asset: string;
  price: string;
  change: string;
  note: string;
}

export interface IntelMapping {
  event: string;
  sectors: string;
  stocks: string;
  action: string;
}

export interface IntelAlert {
  name: string;
  status: string;
  desc: string;
  active: boolean;
}

export interface MarketIntelligenceOverview {
  overviewCards: OverviewCard[];
  feed: IntelFeedItem[];
  clusters: IntelCluster[];
  assets: IntelAsset[];
  mappings: IntelMapping[];
  alerts: IntelAlert[];
  sourceStatus: SourceStatus[];
  lastUpdated: string;
  dataMode: SourceMode;
  cached: boolean;
  hasSourceFailure: boolean;
  allSourcesFailed: boolean;
}
