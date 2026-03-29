import { ALERT_RULES, FALLBACK_ALERTS } from "./constants";
import type { IntelAlert, IntelCluster, IntelFeedItem, IntelMapping, OverviewCard, SourceStatus } from "./types";

const formatDisplayTime = (value?: string): string => {
  if (!value) return "发布时间：未知";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "发布时间：未知";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `发布时间：${yyyy}年${mm}月${dd}日 ${hh}点${mi}分`;
};

export const withDisplayTime = (item: IntelFeedItem): IntelFeedItem => {
  const fallbackFetchedAt = item.fetchedAt || new Date().toISOString();
  const preferredTime = item.publishedAt || fallbackFetchedAt;
  return {
    ...item,
    fetchedAt: fallbackFetchedAt,
    displayTime: formatDisplayTime(preferredTime),
  };
};

export const normalizeFeedDisplayTime = (feed: IntelFeedItem[]): IntelFeedItem[] => feed.map(withDisplayTime);

const inferLevel = (title: string): IntelFeedItem["level"] => {
  if (/(突发|急升|升级|冲突|降息|政策|制裁|暴涨)/.test(title)) return "高";
  if (/(预期|震荡|调整|关注)/.test(title)) return "中";
  return "低";
};

const inferRegion = (title: string): string => {
  if (/(中国|国内|A股|政策)/.test(title)) return "国内政策";
  if (/(中东|俄乌|地缘|冲突)/.test(title)) return "国际形势";
  if (/(美联储|美债|美国|美元|通胀)/.test(title)) return "海外宏观";
  return "大宗商品";
};

const inferTag = (title: string): string => {
  if (/(原油|油价|天然气)/.test(title)) return "原油";
  if (/(黄金|金价)/.test(title)) return "黄金";
  if (/(美联储|降息|利率|美债)/.test(title)) return "美联储";
  if (/(电力|绿电|煤电|风电)/.test(title)) return "电力";
  return "宏观";
};

const inferImpact = (title: string): string => {
  if (/(原油|油价)/.test(title)) return "关注油气 / 航运，留意成本端压力";
  if (/(黄金|避险)/.test(title)) return "关注贵金属 / 防御资产";
  if (/(降息|美债|美元)/.test(title)) return "影响风险偏好与成长风格";
  if (/(电力|绿电)/.test(title)) return "利好电力 / 绿电方向";
  return "关注市场风险偏好变化";
};

export const mapReutersNews = (items: Array<{ title: string; pubDate?: string; source?: string }>): IntelFeedItem[] =>
  items
    .slice()
    .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
    .slice(0, 8)
    .map((item, index) => ({
    id: `reuters-${item.pubDate || "no-pub"}-${index}`,
    publishedAt: item.pubDate,
    fetchedAt: new Date().toISOString(),
    displayTime: formatDisplayTime(item.pubDate || new Date().toISOString()),
    source: item.source || "Reuters",
    region: inferRegion(item.title),
    tag: inferTag(item.title),
    level: inferLevel(item.title),
    title: item.title,
    impact: inferImpact(item.title),
  }));

export const buildMappings = (feed: IntelFeedItem[]): IntelMapping[] =>
  feed.slice(0, 4).map((item) => ({
    event: item.title,
    sectors: item.tag === "原油" ? "油气 / 航运" : item.tag === "美联储" ? "成长 / 金融" : "电力 / 防御",
    stocks: item.tag === "原油" ? "中国海油 / 中远海能" : item.tag === "美联储" ? "中际旭创 / 东方财富" : "长江电力 / 华银电力",
    action: item.level === "高" ? "提升关注级别，优先跟踪前排反应" : "维持观察，等待二次确认",
  }));

export const buildClusters = (feed: IntelFeedItem[]): IntelCluster[] => {
  const groups = feed.reduce<Record<string, IntelFeedItem[]>>((acc, item) => {
    acc[item.region] = acc[item.region] || [];
    acc[item.region].push(item);
    return acc;
  }, {});

  const toneMap: Record<string, string> = {
    国内政策: "border-cyan-300/20 bg-cyan-400/10 text-cyan-300",
    国际形势: "border-rose-300/20 bg-rose-400/10 text-rose-300",
    海外宏观: "border-amber-300/20 bg-amber-400/10 text-amber-300",
    大宗商品: "border-emerald-300/20 bg-emerald-400/10 text-emerald-300",
  };

  return Object.entries(groups).map(([theme, items]) => ({
    theme,
    count: `近6小时 ${items.length}条`,
    summary: items[0]?.title || "暂无摘要",
    tone: toneMap[theme] || toneMap.国内政策,
  }));
};

export const buildAlerts = (feed: IntelFeedItem[], clusters: IntelCluster[]): IntelAlert[] => {
  const highPriorityCount = feed.filter((item) => item.level === "高").length;
  const hasMacroHot = clusters.some((item) => item.theme === "海外宏观" && Number(item.count.replace(/\D/g, "")) >= 2);

  return ALERT_RULES.map((rule) => {
    let active = false;
    if (rule.name.includes("油价")) {
      active = feed.some((item) => item.tag === "原油" && item.level === "高");
    } else if (rule.name.includes("高优先级")) {
      active = highPriorityCount >= rule.threshold;
    } else {
      active = hasMacroHot;
    }

    return {
      name: rule.name,
      status: active ? "已触发" : "未触发",
      desc: rule.desc,
      active,
    };
  }) as IntelAlert[];
};

export const buildOverviewCards = (params: { lastUpdated: string; sourceStatus: SourceStatus[]; feed: IntelFeedItem[]; alerts: IntelAlert[] }): OverviewCard[] => {
  const highPriorityCount = params.feed.filter((item) => item.level === "高").length;
  const healthySourceCount = params.sourceStatus.filter((s) => s.status === "ok").length;

  return [
    {
      title: "情报刷新频率",
      value: "手动刷新 + 首次自动加载",
      detail: `最近更新时间：${params.lastUpdated}`,
      footnote: `数据源状态：${healthySourceCount}/${params.sourceStatus.length} 可用`,
      toneClass: "text-cyan-300",
      cardClass: "rounded-3xl border border-white/10 bg-slate-950/20 p-4",
    },
    {
      title: "监控范围",
      value: "政策 / 地缘 / 商品 / 海外宏观",
      detail: "覆盖 Reuters 新闻 + TwelveData 关键资产",
      footnote: "字段：监控主题 / 覆盖地区 / 是否启用",
      toneClass: "text-white",
      cardClass: "rounded-3xl border border-white/10 bg-slate-950/20 p-4",
    },
    {
      title: "情报系统状态",
      value: params.sourceStatus.some((s) => s.status === "error") ? "降级运行" : "运行中",
      detail: `告警触发：${params.alerts.filter((a) => a.active).length} 项`,
      footnote: "字段：运行状态 / 异常提示 / 今日推送次数",
      toneClass: params.sourceStatus.some((s) => s.status === "error") ? "text-amber-300" : "text-emerald-300",
      cardClass: params.sourceStatus.some((s) => s.status === "error")
        ? "rounded-3xl border border-amber-300/10 bg-amber-400/6 p-4"
        : "rounded-3xl border border-emerald-300/10 bg-emerald-400/6 p-4",
    },
    {
      title: "高优先级事件",
      value: `${highPriorityCount} 个`,
      detail: params.feed[0]?.title || "暂无高优先级事件",
      footnote: "字段：高优先级数量 / 当前主事件 / 是否已处理",
      toneClass: "text-rose-300",
      cardClass: "rounded-3xl border border-rose-300/10 bg-rose-400/6 p-4",
    },
  ];
};

export const getFallbackAlerts = (): IntelAlert[] => FALLBACK_ALERTS;
