import type { ReactNode } from "react";
import { useMarketIntelligence } from "../hooks/useMarketIntelligence";

interface HeaderProps {
  title: string;
  desc: string;
  primary: string;
  secondary: string;
  onPrimaryClick?: () => void;
  primaryDisabled?: boolean;
}

export const MarketIntelligencePage = ({
  renderHeader,
}: {
  renderHeader: (props: HeaderProps) => ReactNode;
}) => {
  const { data, loading, error, refresh, refreshState } = useMarketIntelligence();

  return (
    <div className="space-y-7">
      {renderHeader({
        title: "市场情报",
        desc: "独立查看 7×24 市场情报流、主题聚类、影响映射、关键资产与告警中心。每个功能框都补了推荐接口来源，后面接数据时可以直接对照。",
        primary: loading ? "刷新中..." : "刷新情报流",
        secondary: "导出情报摘要",
        onPrimaryClick: refresh,
        primaryDisabled: loading,
      })}

      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-xl shadow-[0_12px_50px_rgba(2,6,23,0.35)]">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <div className="text-lg font-semibold text-white">市场情报总览</div>
              <div className="text-sm text-slate-400">7×24 监控国内政策、国际形势、海外宏观、大宗商品与关键资产异动。</div>
            </div>
            <div className="text-xs text-slate-400">最近更新时间：{data?.lastUpdated || "--"}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(data?.overviewCards || []).map((card) => (
              <div key={card.title} className={card.cardClass}>
                <div className="text-sm text-slate-400">{card.title}</div>
                <div className={`mt-3 text-lg font-semibold ${card.toneClass}`}>{card.value}</div>
                <div className="mt-2 text-[11px] leading-5 text-slate-500">{card.detail}</div>
                <div className="mt-2 text-[11px] leading-5 text-slate-500">{card.footnote}</div>
              </div>
            ))}
          </div>

          {error && <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">{error}</div>}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-white">实时快讯流</div>
                  <div className="mt-1 text-sm text-slate-400">按时间倒序展示，优先展示高影响等级消息。</div>
                </div>
                <div className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-3 py-1 text-xs font-semibold text-cyan-300">Live Feed</div>
              </div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：时间 / 来源 / 地区 / 标签 / 影响等级 / 标题 / 影响映射</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：AKShare（国内资讯代理）/ GDELT（国际新闻）/ Finnhub（海外金融快讯）</div>
              <div className="mt-4 space-y-3">
                {loading && <div className="text-sm text-slate-400">正在拉取最新快讯...</div>}
                {!loading && (data?.feed.length || 0) === 0 && <div className="text-sm text-slate-400">暂无快讯数据</div>}
                {(data?.feed || []).map((item) => (
                  <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-200">{item.displayTime}</span>
                      <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-300">{item.source}</span>
                      <span className="rounded-full border border-fuchsia-300/15 bg-fuchsia-400/8 px-2.5 py-1 text-xs text-fuchsia-200">{item.region}</span>
                      <span className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-2.5 py-1 text-xs text-cyan-200">{item.tag}</span>
                      <span className={`rounded-full border px-2.5 py-1 text-xs ${item.level === "高" ? "border-rose-300/15 bg-rose-400/8 text-rose-200" : "border-amber-300/15 bg-amber-400/8 text-amber-200"}`}>影响等级 {item.level}</span>
                    </div>
                    <div className="mt-3 text-sm font-medium leading-7 text-white">{item.title}</div>
                    <div className="mt-2 text-sm text-slate-400">影响映射：{item.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
              <div className="text-lg font-semibold text-white">影响映射</div>
              <div className="mt-1 text-sm text-slate-400">把新闻情报翻译成板块、个股和动作建议。</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：事件主题 / 影响板块 / 关联个股 / 一句话动作建议</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：实时快讯流 + 自建板块/个股映射表 + AI 总结</div>
              <div className="mt-4 space-y-3">
                {(data?.mappings || []).map((item) => (
                  <div key={item.event} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-base font-semibold text-white">{item.event}</div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div><div className="text-slate-500">影响板块</div><div className="mt-1 text-slate-200 leading-6">{item.sectors}</div></div>
                      <div><div className="text-slate-500">关联标的</div><div className="mt-1 text-slate-200 leading-6">{item.stocks}</div></div>
                      <div><div className="text-slate-500">动作建议</div><div className="mt-1 text-cyan-300 leading-6">{item.action}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
              <div className="text-lg font-semibold text-white">新闻主题分类 / 情报聚类</div>
              <div className="mt-1 text-sm text-slate-400">先按主题归并，再看近6小时热度和摘要。</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：主题名称 / 近6小时条数 / 摘要 / 热度变化 / 是否重点监控</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：GDELT / Finnhub / AKShare + 关键词规则 / AI 聚类</div>
              <div className="mt-4 space-y-3">
                {(data?.clusters || []).map((item) => (
                  <div key={item.theme} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-white">{item.theme}</div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${item.tone}`}>{item.count}</span>
                    </div>
                    <div className="mt-3 text-sm leading-7 text-slate-300">{item.summary}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
              <div className="text-lg font-semibold text-white">关键资产监控</div>
              <div className="mt-1 text-sm text-slate-400">盯住会影响 A 股风险偏好的关键全球资产。</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：资产名称 / 最新价格 / 涨跌幅 / 对 A 股影响说明</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：yfinance（海外资产）/ AKShare（国内商品、汇率、宏观代理）/ Finnhub（补充）</div>
              <div className="mt-4 overflow-hidden rounded-3xl border border-white/10">
                <table className="w-full text-sm"><thead className="bg-white/6 text-slate-300"><tr><th className="px-4 py-3 text-left">资产</th><th className="px-4 py-3 text-left">价格</th><th className="px-4 py-3 text-left">涨跌</th><th className="px-4 py-3 text-left">说明</th></tr></thead>
                  <tbody>
                    {(data?.assets || []).map((item) => (
                      <tr key={item.asset} className="border-t border-white/8 bg-slate-950/18 hover:bg-white/6">
                        <td className="px-4 py-4 text-slate-200">{item.asset}</td><td className="px-4 py-4 text-slate-200">{item.price}</td>
                        <td className={`px-4 py-4 font-semibold ${String(item.change).startsWith("+") ? "text-emerald-300" : "text-rose-300"}`}>{item.change}</td>
                        <td className="px-4 py-4 text-slate-400">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
              <div className="text-lg font-semibold text-white">情报告警中心</div>
              <div className="mt-1 text-sm text-slate-400">后续可接关键词告警、资产阈值告警和联合条件告警。</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：告警名称 / 开关状态 / 触发规则 / 推送方式</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：无单独行情接口，来自快讯流 / 资产监控结果 + 规则引擎 / Webhook</div>
              <div className="mt-4 space-y-3">
                {(data?.alerts || []).map((item) => (
                  <div key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-white">{item.name}</div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${item.active ? "border-rose-300/15 bg-rose-400/8 text-rose-200" : "border-emerald-300/15 bg-emerald-400/8 text-emerald-200"}`}>{item.status}</span>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">source status</div>
              <div className="mt-2 space-y-1 text-xs text-slate-300">
                <div>feed source：{data?.feedSource || "--"}</div>
                <div>refresh state：{refreshState}</div>
                <div>last refresh：{data?.lastUpdated || "--"}</div>
                <div>cache：{data?.cacheStatus || "unknown"}</div>
                <div>fallback：{data?.isFallback ? "yes" : "no"}</div>
                {error && <div>error：{error}</div>}
                {(data?.sourceStatus || []).map((item) => (
                  <div key={item.source}>
                    {item.source}：{item.status}（{item.message}）
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
