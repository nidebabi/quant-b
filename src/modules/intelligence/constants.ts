import type { IntelAlert, IntelAsset, IntelCluster, IntelFeedItem } from "./types";

export const FALLBACK_FEED: IntelFeedItem[] = [
  { id: "f1", publishedAt: null, fetchedAt: new Date().toISOString(), displayTime: "fetch@--:--", source: "财联社", region: "国内政策", tag: "电力", level: "高", title: "能源相关政策预期升温，市场关注电力链条后续催化。", impact: "利好电力 / 绿电方向" },
  { id: "f2", publishedAt: null, fetchedAt: new Date().toISOString(), displayTime: "fetch@--:--", source: "GDELT", region: "国际形势", tag: "原油", level: "高", title: "中东局势再起波动，国际油价盘中拉升，避险情绪升温。", impact: "关注油气 / 黄金 / 航运" },
  { id: "f3", publishedAt: null, fetchedAt: new Date().toISOString(), displayTime: "fetch@--:--", source: "Finnhub", region: "海外宏观", tag: "美联储", level: "中", title: "美债收益率短线波动，市场重新评估年内降息路径。", impact: "影响风险偏好与成长风格" },
  { id: "f4", publishedAt: null, fetchedAt: new Date().toISOString(), displayTime: "fetch@--:--", source: "AKShare", region: "大宗商品", tag: "铜 / 煤", level: "中", title: "工业品价格继续分化，铜价偏强、煤炭价格趋稳。", impact: "关注资源 / 电力设备链条" },
];

export const FALLBACK_CLUSTERS: IntelCluster[] = [
  { theme: "国内政策", count: "近6小时 8条", summary: "能源与新型电力系统相关政策预期升温，资金关注高辨识度主线。", tone: "border-cyan-300/20 bg-cyan-400/10 text-cyan-300" },
  { theme: "国际形势", count: "近6小时 5条", summary: "地缘扰动提升商品波动，油气和黄金方向敏感度上升。", tone: "border-rose-300/20 bg-rose-400/10 text-rose-300" },
  { theme: "海外宏观", count: "近6小时 4条", summary: "海外利率与美元预期来回拉扯，成长与价值风格仍在切换。", tone: "border-amber-300/20 bg-amber-400/10 text-amber-300" },
];

export const FALLBACK_ASSETS: IntelAsset[] = [
  { asset: "WTI 原油", price: "81.64", change: "+1.54%", note: "油价上行会抬升通胀预期，压制成长估值" },
  { asset: "美元指数 DXY", price: "104.21", change: "+0.27%", note: "美元偏强时，风险资产波动通常放大" },
  { asset: "COMEX 黄金", price: "2188.3", change: "-0.42%", note: "避险交易降温，需结合利率与地缘消息看" },
  { asset: "10Y 美债收益率", price: "4.24%", change: "+0.05%", note: "长端收益率抬升会影响高估值板块风险偏好" },
];

export const ALERT_RULES = [
  { name: "国际油价异动告警", threshold: 1.2, desc: "WTI/Brent 单日涨跌幅超过阈值时触发。" },
  { name: "高优先级快讯密度告警", threshold: 2, desc: "近一轮快讯中高优先级事件数量超过阈值时触发。" },
  { name: "海外宏观波动告警", threshold: 1, desc: "海外宏观主题在近一轮聚类中出现明显升温时触发。" },
] as const;

export const FALLBACK_ALERTS: IntelAlert[] = ALERT_RULES.map((rule) => ({
  name: rule.name,
  status: "未触发",
  desc: rule.desc,
  active: false,
}));
