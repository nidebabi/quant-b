import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  BrainCircuit,
  Filter,
  FlaskConical,
  History,
  LayoutDashboard,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Newspaper,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function QuantUIPrototype() {
  const nav = [
    { key: "仪表盘", icon: LayoutDashboard },
    { key: "市场情报", icon: Newspaper },
    { key: "因子选股", icon: Filter },
    { key: "回测中心", icon: FlaskConical },
    { key: "决策中心", icon: ShieldCheck },
    { key: "报告回顾", icon: History },
  ];

  const [activePage, setActivePage] = useState("仪表盘");
  const [selectedIntel, setSelectedIntel] = useState(null);

  const shellBg =
    "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.18),_transparent_24%),linear-gradient(180deg,#060816_0%,#0A1020_42%,#090E1A_100%)] text-slate-100";
  const glass =
    "rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl shadow-[0_12px_50px_rgba(2,6,23,0.35)]";
  const softGlass =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";
  const muted = "text-sm text-slate-400";
  const sectionTitle = "text-lg font-semibold text-white";

  const dashboardStatCards = [
    {
      title: "上证指数",
      value: "3,126.84",
      change: "+0.62%",
      desc: "权重稳，指数偏强",
      tone: "text-emerald-300",
      chip: "bg-emerald-400/15 text-emerald-300 border-emerald-300/20",
      icon: TrendingUp,
    },
    {
      title: "深证成指",
      value: "9,824.11",
      change: "+0.38%",
      desc: "题材活跃，跟涨略弱",
      tone: "text-emerald-300",
      chip: "bg-cyan-400/15 text-cyan-300 border-cyan-300/20",
      icon: Activity,
    },
    {
      title: "创业板指",
      value: "1,921.37",
      change: "-0.14%",
      desc: "高弹性方向分化",
      tone: "text-rose-300",
      chip: "bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-300/20",
      icon: TrendingDown,
    },
    {
      title: "两市成交额",
      value: "1.18 万亿",
      change: "较昨日 +6.7%",
      desc: "量能尚可，承接在",
      tone: "text-cyan-300",
      chip: "bg-sky-400/15 text-sky-300 border-sky-300/20",
      icon: BarChart3,
    },
    {
      title: "涨停 / 跌停",
      value: "68 / 11",
      change: "炸板 17 家",
      desc: "情绪有修复但分歧仍在",
      tone: "text-amber-300",
      chip: "bg-amber-400/15 text-amber-300 border-amber-300/20",
      icon: Zap,
    },
    {
      title: "上涨 / 下跌",
      value: "3,214 / 1,768",
      change: "普涨偏强",
      desc: "市场广度尚可",
      tone: "text-emerald-300",
      chip: "bg-emerald-400/15 text-emerald-300 border-emerald-300/20",
      icon: Layers3,
    },
  ];

  const dashboardHotThemesTimeline = [
    {
      date: "03-24 周一",
      market: "盘后",
      top1: { name: "电力", change: "+4.82%" },
      top2: { name: "煤电", change: "+3.91%" },
      top3: { name: "设备中军", change: "+2.74%" },
      top4: { name: "风电", change: "+2.18%" },
      top5: { name: "商业航天", change: "+1.96%" },
    },
    {
      date: "03-25 周二",
      market: "盘后",
      top1: { name: "算电协同", change: "+5.16%" },
      top2: { name: "电力", change: "+4.27%" },
      top3: { name: "风电", change: "+2.98%" },
      top4: { name: "煤电", change: "+2.63%" },
      top5: { name: "光伏设备", change: "+2.14%" },
    },
    {
      date: "03-26 周三",
      market: "盘后",
      top1: { name: "煤电", change: "+3.87%" },
      top2: { name: "电力", change: "+3.42%" },
      top3: { name: "商业航天", change: "+2.31%" },
      top4: { name: "设备中军", change: "+2.08%" },
      top5: { name: "油气", change: "+1.84%" },
    },
    {
      date: "03-27 周四",
      market: "盘后",
      top1: { name: "电力", change: "+4.36%" },
      top2: { name: "算电协同", change: "+3.66%" },
      top3: { name: "设备中军", change: "+2.44%" },
      top4: { name: "煤电", change: "+2.19%" },
      top5: { name: "风电", change: "+1.92%" },
    },
    {
      date: "03-28 周五",
      market: "盘后",
      top1: { name: "电力", change: "+3.98%" },
      top2: { name: "煤电", change: "+3.21%" },
      top3: { name: "算电协同", change: "+2.87%" },
      top4: { name: "设备中军", change: "+2.32%" },
      top5: { name: "风电", change: "+1.76%" },
    },
  ];

  const dashboardAlerts = [
    { title: "高标状态", value: "未出现全面退潮", tone: "text-emerald-300" },
    { title: "风险提示", value: "后排杂毛淘汰加速", tone: "text-rose-300" },
    { title: "今日结论", value: "能做，但只做前排与中军", tone: "text-cyan-300" },
  ];

  const dashboardLadderCompare = [
    {
      tier: "7板",
      yesterdayCount: 1,
      yesterdayStocks: ["豫能控股"],
      todayCount: 1,
      todayStocks: ["豫能控股"],
      status: "高度维持",
      tone: "text-fuchsia-300",
    },
    {
      tier: "5板",
      yesterdayCount: 2,
      yesterdayStocks: ["华电能源", "中南文化"],
      todayCount: 1,
      todayStocks: ["华电能源"],
      status: "一只掉队",
      tone: "text-amber-300",
    },
    {
      tier: "4板",
      yesterdayCount: 2,
      yesterdayStocks: ["赣能股份", "节能风电"],
      todayCount: 3,
      todayStocks: ["赣能股份", "节能风电", "协鑫能科"],
      status: "梯队扩容",
      tone: "text-cyan-300",
    },
    {
      tier: "3板",
      yesterdayCount: 4,
      yesterdayStocks: ["中国西电", "金开新能", "北京科锐", "顺钠股份"],
      todayCount: 3,
      todayStocks: ["中国西电", "金开新能", "北京科锐"],
      status: "局部淘汰",
      tone: "text-emerald-300",
    },
    {
      tier: "2板",
      yesterdayCount: 7,
      yesterdayStocks: ["华银电力", "明星电力", "郴电国际", "西昌电力", "合众思壮", "中电兴发", "新天绿能"],
      todayCount: 10,
      todayStocks: ["华银电力", "明星电力", "郴电国际", "西昌电力", "合众思壮", "中电兴发", "新天绿能", "广安爱众", "江苏新能", "中闽能源"],
      status: "低位补涨增多",
      tone: "text-sky-300",
    },
  ];

  const dashboardHoldings = [
    { name: "金开新能", pnl: "+2.31%", action: "需观察是否继续走强", tone: "text-emerald-300" },
    { name: "协鑫能科", pnl: "-1.24%", action: "明日重点看开盘承接", tone: "text-amber-300" },
  ];

  const dashboardIntelFeed = [
    {
      time: "07:42",
      source: "财联社",
      region: "国内政策",
      tag: "电力",
      level: "高",
      title: "能源相关政策预期升温，市场关注电力链条后续催化。",
      impact: "利好电力 / 绿电方向",
    },
    {
      time: "08:15",
      source: "GDELT",
      region: "国际形势",
      tag: "原油",
      level: "高",
      title: "中东局势再起波动，国际油价盘中拉升，避险情绪升温。",
      impact: "关注油气 / 黄金 / 航运",
    },
    {
      time: "09:06",
      source: "Finnhub",
      region: "海外宏观",
      tag: "美联储",
      level: "中",
      title: "美债收益率短线波动，市场重新评估年内降息路径。",
      impact: "影响风险偏好与成长风格",
    },
    {
      time: "10:23",
      source: "AKShare",
      region: "大宗商品",
      tag: "铜 / 煤",
      level: "中",
      title: "工业品价格继续分化，铜价偏强、煤炭价格趋稳。",
      impact: "关注资源 / 电力设备链条",
    },
  ];

  const dashboardIntelClusters = [
    {
      theme: "国内政策",
      count: "近6小时 8条",
      summary: "围绕能源、算力基建和产业支持方向反复发酵。",
      tone: "bg-cyan-400/10 text-cyan-300 border-cyan-300/15",
    },
    {
      theme: "国际形势",
      count: "近6小时 12条",
      summary: "地缘冲突消息密集，避险与能源链条敏感度提升。",
      tone: "bg-rose-400/10 text-rose-300 border-rose-300/15",
    },
    {
      theme: "大宗商品",
      count: "近6小时 6条",
      summary: "原油、黄金强于工业金属，风险偏好分化。",
      tone: "bg-amber-400/10 text-amber-300 border-amber-300/15",
    },
    {
      theme: "海外宏观",
      count: "近6小时 5条",
      summary: "美债、美元、纳指期货联动影响成长方向预期。",
      tone: "bg-emerald-400/10 text-emerald-300 border-emerald-300/15",
    },
  ];

  const dashboardIntelAssets = [
    { asset: "布伦特原油", price: "84.20", change: "+2.18%", note: "能源链敏感" },
    { asset: "COMEX 黄金", price: "2358.6", change: "+1.42%", note: "避险升温" },
    { asset: "美元指数", price: "104.12", change: "+0.31%", note: "压制风险偏好" },
    { asset: "纳指期货", price: "18426", change: "-0.58%", note: "成长风格承压" },
    { asset: "离岸人民币", price: "7.24", change: "-0.12%", note: "观察北向情绪" },
  ];

  const dashboardIntelMapping = [
    {
      event: "中东局势升温",
      sectors: "油气 / 黄金 / 航运",
      stocks: "洲际油气 / 湖南黄金 / 招商南油",
      action: "若隔夜继续发酵，关注高开强度与是否有补涨。",
    },
    {
      event: "能源政策催化",
      sectors: "电力 / 绿电 / 算电协同",
      stocks: "豫能控股 / 协鑫能科 / 华银电力",
      action: "优先看前排与中军，不做后排跟风。",
    },
    {
      event: "美债利率波动",
      sectors: "成长科技 / 高估值方向",
      stocks: "算力链 / AI 应用方向",
      action: "盘前需结合纳指期货判断是否压制风险偏好。",
    },
  ];

  const dashboardIntelAlerts = [
    { name: "高优先级政策", status: "已开启", desc: "字段：关键词 / 来源 / 推送渠道 / 优先级" },
    { name: "国际突发与地缘", status: "已开启", desc: "字段：地区 / 关键词 / 影响资产 / 触发时间" },
    { name: "商品异动联动", status: "已开启", desc: "字段：监控资产 / 涨跌阈值 / 对应板块 / 是否推送" },
  ];

  const pageTone = useMemo(() => {
    switch (activePage) {
      case "市场情报":
        return "from-rose-400/20 via-orange-500/10 to-transparent";
      case "因子选股":
        return "from-cyan-400/20 via-sky-500/10 to-transparent";
      case "回测中心":
        return "from-emerald-400/20 via-teal-500/10 to-transparent";
      case "决策中心":
        return "from-fuchsia-400/20 via-violet-500/10 to-transparent";
      case "报告回顾":
        return "from-amber-400/20 via-orange-500/10 to-transparent";
      default:
        return "from-cyan-400/20 via-indigo-500/10 to-transparent";
    }
  }, [activePage]);

  const ScorePill = ({ score }) => {
    const tone = score >= 90
      ? "bg-emerald-400/15 text-emerald-300 border-emerald-300/20"
      : score >= 85
        ? "bg-cyan-400/15 text-cyan-300 border-cyan-300/20"
        : "bg-amber-400/15 text-amber-300 border-amber-300/20";
    return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{score} 分</span>;
  };

  const HeatPill = ({ label }) => {
    const toneMap = {
      S: "bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-300/20",
      "A+": "bg-cyan-400/15 text-cyan-300 border-cyan-300/20",
      A: "bg-emerald-400/15 text-emerald-300 border-emerald-300/20",
      "B+": "bg-amber-400/15 text-amber-300 border-amber-300/20",
    };
    return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneMap[label] || toneMap.A}`}>{label}</span>;
  };

  const SectionHeader = ({ title, desc, action }) => (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div>
        <div className={sectionTitle}>{title}</div>
        <div className={muted}>{desc}</div>
      </div>
      {action}
    </div>
  );

  const PageHeader = ({ title, desc, primary = "主要操作", secondary = "刷新数据" }) => (
    <div className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${pageTone} ${glass} p-7`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.12),transparent_25%)]" />
      <div className="relative flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Quant Workspace
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{desc}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['高辨识度前排', '分歧转一致', '回测联动', '行动卡片化'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-slate-100 transition hover:bg-white/12">
            {secondary}
          </button>
          <button className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            {primary}
          </button>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="space-y-7">
      <div className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${pageTone} ${glass} p-6`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.10),transparent_25%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Market Overview Console
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">仪表盘</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              首页优先看总览信息，所以把市场情报摘要放到最上面；后面再看指数快照、盘后体检、连板生态、热点轮动、提醒与持仓概览。
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[320px]">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                <div className="text-xs text-slate-400">数据更新时间</div>
                <div className="mt-2 text-sm font-semibold text-cyan-300">15:03</div>
                <div className="mt-1 text-[11px] text-slate-500">字段：更新时间 / 来源状态</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                <div className="text-xs text-slate-400">当前阶段</div>
                <div className="mt-2 text-sm font-semibold text-white">盘后</div>
                <div className="mt-1 text-[11px] text-slate-500">字段：盘前/盘中/盘后</div>
              </div>
              <div className="rounded-2xl border border-amber-300/15 bg-amber-400/8 px-4 py-3">
                <div className="text-xs text-slate-400">风险日标签</div>
                <div className="mt-2 text-sm font-semibold text-amber-300">中风险日</div>
                <div className="mt-1 text-[11px] text-slate-500">字段：风险等级 / 一句话建议</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-end">
              <button className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-slate-100 transition hover:bg-white/12">
                刷新市场数据
              </button>
              <button className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                查看今日决策
              </button>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className={`${glass} p-4`}>
          <SectionHeader
            title="市场情报摘要"
            desc="首页只保留紧凑摘要，完整内容通过弹层查看，不再让摘要区占太多空间。"
            action={<button className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200" onClick={() => setActivePage('市场情报')}>进入市场情报</button>}
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-7 rounded-3xl border border-white/10 bg-slate-950/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-white">高优先级情报</div>
                  <div className="mt-1 text-xs text-slate-400">改成紧凑列表，点开后看完整内容。</div>
                </div>
                <span className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">摘要模式</span>
              </div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：时间 / 来源 / 主题 / 影响等级 / 标题摘要；完整消息通过“查看”弹层展示</div>
              <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                {dashboardIntelFeed.map((item) => (
                  <div key={item.time + item.title} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-white/6 px-2 py-1 text-[11px] text-slate-200">{item.time}</span>
                          <span className="rounded-full border border-white/10 bg-white/6 px-2 py-1 text-[11px] text-slate-300">{item.source}</span>
                          <span className="rounded-full border border-fuchsia-300/15 bg-fuchsia-400/8 px-2 py-1 text-[11px] text-fuchsia-200">{item.region}</span>
                          <span className={`rounded-full border px-2 py-1 text-[11px] ${item.level === '高' ? 'border-rose-300/15 bg-rose-400/8 text-rose-200' : 'border-amber-300/15 bg-amber-400/8 text-amber-200'}`}>{item.level}优先级</span>
                        </div>
                        <div className="mt-2 truncate text-sm font-medium text-white">{item.title}</div>
                        <div className="mt-1 truncate text-xs text-slate-400">影响方向：{item.impact}</div>
                      </div>
                      <button
                        className="shrink-0 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-400/15"
                        onClick={() => setSelectedIntel(item)}
                      >
                        查看
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-3 rounded-3xl border border-white/10 bg-slate-950/20 p-4">
              <div className="text-base font-semibold text-white">热点主题 Top3</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：主题名称 / 近6小时条数；摘要压成一句</div>
              <div className="mt-3 space-y-2.5">
                {dashboardIntelClusters.slice(0, 3).map((item) => (
                  <div key={item.theme} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-white">{item.theme}</div>
                      <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${item.tone}`}>{item.count}</span>
                    </div>
                    <div className="mt-2 line-clamp-1 text-xs leading-5 text-slate-300">{item.summary}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-slate-950/20 p-4">
              <div className="text-base font-semibold text-white">告警概览</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：已开启数 / 今日触发 / 最高关注主题</div>
              <div className="mt-3 space-y-2.5">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <div className="text-xs text-slate-400">已开启告警</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-300">3 项</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <div className="text-xs text-slate-400">今日触发</div>
                  <div className="mt-1 text-lg font-semibold text-cyan-300">7 次</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <div className="text-xs text-slate-400">最高关注</div>
                  <div className="mt-1 text-sm font-semibold text-rose-300">国际形势 / 原油</div>
                </div>
              </div>
            </div>
          </div>

          {selectedIntel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm">
              <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,.96),rgba(9,14,26,.98))] shadow-[0_20px_80px_rgba(2,6,23,.55)]">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
                  <div>
                    <div className="text-lg font-semibold text-white">情报详情</div>
                    <div className="mt-1 text-sm text-slate-400">仪表盘内快速查看完整消息，不必把摘要区做得很高。</div>
                  </div>
                  <button
                    className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                    onClick={() => setSelectedIntel(null)}
                  >
                    关闭
                  </button>
                </div>
                <div className="space-y-5 px-6 py-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-200">{selectedIntel.time}</span>
                    <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-300">{selectedIntel.source}</span>
                    <span className="rounded-full border border-fuchsia-300/15 bg-fuchsia-400/8 px-2.5 py-1 text-xs text-fuchsia-200">{selectedIntel.region}</span>
                    <span className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-2.5 py-1 text-xs text-cyan-200">{selectedIntel.tag}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${selectedIntel.level === '高' ? 'border-rose-300/15 bg-rose-400/8 text-rose-200' : 'border-amber-300/15 bg-amber-400/8 text-amber-200'}`}>{selectedIntel.level}优先级</span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">完整标题</div>
                    <div className="mt-2 text-xl font-semibold leading-9 text-white">{selectedIntel.title}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-slate-500">影响方向</div>
                      <div className="mt-2 text-sm leading-7 text-slate-200">{selectedIntel.impact}</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-slate-500">后续可补字段</div>
                      <div className="mt-2 text-sm leading-7 text-slate-300">正文摘要 / 原文链接 / 涉及板块 / 涉及个股 / 情绪判断 / 是否已读</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-200"
                      onClick={() => setActivePage('市场情报')}
                    >
                      去完整情报页
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        {dashboardStatCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className={`relative overflow-hidden ${glass} p-4`}>
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-400">{item.title}</div>
                  <div className={`rounded-2xl border px-2.5 py-2 ${item.chip}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 text-2xl font-semibold text-white">{item.value}</div>
                <div className={`mt-2 text-sm font-medium ${item.tone}`}>{item.change}</div>
                <div className="mt-2 text-xs leading-6 text-slate-400">{item.desc}</div>
                <div className="mt-3 text-[11px] leading-5 text-slate-500">字段：数值 / 涨跌幅 / 辅助说明</div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader
              title="昨日收盘 / 盘后市场体检"
              desc="先看情绪强弱、再看市场广度、最后看结构结论。"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/25 p-5">
                <div className="text-sm text-slate-400">情绪温度</div>
                <div className="mt-1 text-[11px] leading-5 text-slate-500">字段：涨停家数 / 跌停家数 / 连板家数 / 炸板家数</div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-slate-300">涨停家数</span><span className="font-semibold text-emerald-300">68</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-300">跌停家数</span><span className="font-semibold text-rose-300">11</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-300">连板家数</span><span className="font-semibold text-cyan-300">14</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-300">炸板家数</span><span className="font-semibold text-amber-300">17</span></div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/25 p-5">
                <div className="text-sm text-slate-400">市场广度</div>
                <div className="mt-1 text-[11px] leading-5 text-slate-500">字段：上涨家数 / 下跌家数 / 平盘家数 / 量能状态</div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-slate-300">上涨家数</span><span className="font-semibold text-emerald-300">3214</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-300">下跌家数</span><span className="font-semibold text-rose-300">1768</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-300">平盘家数</span><span className="font-semibold text-slate-200">149</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-300">量能状态</span><span className="font-semibold text-cyan-300">温和放量</span></div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/25 p-5">
                <div className="text-sm text-slate-400">结构结论</div>
                <div className="mt-1 text-[11px] leading-5 text-slate-500">字段：主线判断 / 高位状态 / 可做方向 / 回避方向</div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/8 px-3 py-2 text-sm text-emerald-300">主线仍在电力 / 算电</div>
                  <div className="rounded-2xl border border-amber-300/15 bg-amber-400/8 px-3 py-2 text-sm text-amber-300">高位分歧开始放大</div>
                  <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/8 px-3 py-2 text-sm text-cyan-300">前排和中军仍有可做性</div>
                  <div className="rounded-2xl border border-rose-300/15 bg-rose-400/8 px-3 py-2 text-sm text-rose-300">后排杂毛不宜参与</div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,47,73,.20),rgba(15,23,42,.35))] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-400">盘后一句话判断</div>
                  <div className="mt-1 text-[11px] leading-5 text-slate-500">字段：盘后总结 / 风险标签 / 次日方向建议</div>
                  <div className="mt-2 text-base font-medium text-white">市场并非极强普涨，但整体仍偏可做，适合围绕主线前排与中军做右侧博弈。</div>
                </div>
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-300">中性偏强</div>
              </div>
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="连板梯队 / 高标状态" desc="把昨日与今日梯队对照拉平，直接看晋级、掉队与补涨。" />
            <div className="mb-4 text-[11px] leading-5 text-slate-500">字段：梯队名称 / 昨日家数 / 昨日股票名单 / 今日家数 / 今日股票名单 / 晋级或淘汰状态</div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/20">
              <table className="w-full text-sm">
                <thead className="bg-white/6 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-left">梯队</th>
                    <th className="px-4 py-3 text-left">昨日</th>
                    <th className="px-4 py-3 text-left">昨日股票</th>
                    <th className="px-4 py-3 text-left">今日</th>
                    <th className="px-4 py-3 text-left">今日股票</th>
                    <th className="px-4 py-3 text-left">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardLadderCompare.map((item) => (
                    <tr key={item.tier} className="border-t border-white/8 align-top bg-slate-950/18 hover:bg-white/6">
                      <td className="px-4 py-4">
                        <div className={`text-base font-semibold ${item.tone}`}>{item.tier}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-100">{item.yesterdayCount}家</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2 max-w-[280px]">
                          {item.yesterdayStocks.map((stock) => (
                            <span key={stock} className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-200">{stock}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-100">{item.todayCount}家</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2 max-w-[320px]">
                          {item.todayStocks.map((stock) => (
                            <span key={stock} className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-2.5 py-1 text-xs text-cyan-200">{stock}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${item.tone}`}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="持仓概览" desc="个人交易终端里，首页需要把当前持仓也纳入总览。" />
            <div className="mb-4 text-[11px] leading-5 text-slate-500">字段：持仓股票 / 浮盈浮亏 / 风险等级 / 今日应对动作</div>
            <div className="space-y-3">
              {dashboardHoldings.map((item) => (
                <div key={item.name} className="rounded-3xl border border-white/10 bg-slate-950/25 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-white">{item.name}</div>
                      <div className="mt-1 text-sm text-slate-400">{item.action}</div>
                    </div>
                    <div className={`text-sm font-semibold ${item.tone}`}>{item.pnl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader title="热点 / 板块轮动" desc="按最近 5 个交易日做时间线表格，直接看板块领涨顺序变化。" />
            <div className="mb-4 text-[11px] leading-5 text-slate-500">字段：日期 / 今日涨幅前五板块；时间窗口建议默认最近 5 个交易日</div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/20">
              <table className="w-full text-sm">
                <thead className="bg-white/6 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-left">交易日</th>
                    <th className="px-4 py-3 text-left">涨幅第1</th>
                    <th className="px-4 py-3 text-left">涨幅第2</th>
                    <th className="px-4 py-3 text-left">涨幅第3</th>
                    <th className="px-4 py-3 text-left">涨幅第4</th>
                    <th className="px-4 py-3 text-left">涨幅第5</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardHotThemesTimeline.map((day, idx) => (
                    <tr key={day.date} className={`border-t border-white/8 align-top ${idx === dashboardHotThemesTimeline.length - 1 ? 'bg-cyan-400/6' : 'bg-slate-950/18 hover:bg-white/6'}`}>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-100">{day.date}</div>
                        <div className="mt-1 text-xs text-slate-500">{day.market}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/8 px-3 py-2">
                          <div className="text-sm font-medium text-emerald-200">{day.top1.name}</div>
                          <div className="mt-1 text-xs text-emerald-300">{day.top1.change}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/8 px-3 py-2">
                          <div className="text-sm font-medium text-cyan-200">{day.top2.name}</div>
                          <div className="mt-1 text-xs text-cyan-300">{day.top2.change}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="rounded-2xl border border-amber-300/15 bg-amber-400/8 px-3 py-2">
                          <div className="text-sm font-medium text-amber-200">{day.top3.name}</div>
                          <div className="mt-1 text-xs text-amber-300">{day.top3.change}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="rounded-2xl border border-sky-300/15 bg-sky-400/8 px-3 py-2">
                          <div className="text-sm font-medium text-sky-200">{day.top4.name}</div>
                          <div className="mt-1 text-xs text-sky-300">{day.top4.change}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="rounded-2xl border border-violet-300/15 bg-violet-400/8 px-3 py-2">
                          <div className="text-sm font-medium text-violet-200">{day.top5.name}</div>
                          <div className="mt-1 text-xs text-violet-300">{day.top5.change}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="今日提醒" desc="首页只保留最关键的风险与提醒。" />
            <div className="mb-4 text-[11px] leading-5 text-slate-500">字段：高标状态 / 主要风险点 / 今日结论 / 外围异常提醒</div>
            <div className="space-y-3">
              {dashboardAlerts.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3">
                  <div className="text-sm text-slate-400">{item.title}</div>
                  <div className={`mt-2 text-sm font-medium leading-6 ${item.tone}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const IntelligencePage = () => (
    <div className="space-y-7">
      <PageHeader
        title="市场情报"
        desc="独立查看 7×24 市场情报流、主题聚类、影响映射、关键资产与告警中心。每个功能框都补了推荐接口来源，后面接数据时可以直接对照。"
        primary="刷新情报流"
        secondary="导出情报摘要"
      />

      <section className="space-y-6">
        <div className={`${glass} p-6`}>
          <SectionHeader
            title="市场情报总览"
            desc="7×24 监控国内政策、国际形势、海外宏观、大宗商品与关键资产异动。"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-4">
              <div className="text-sm text-slate-400">情报刷新频率</div>
              <div className="mt-3 text-lg font-semibold text-cyan-300">30 秒 / 1 分钟级</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：刷新频率 / 最近更新时间 / 数据源状态</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：GDELT / Finnhub / AKShare</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-4">
              <div className="text-sm text-slate-400">监控范围</div>
              <div className="mt-3 text-lg font-semibold text-white">政策 / 地缘 / 商品 / 海外宏观</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：监控主题 / 覆盖地区 / 是否启用</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：AKShare + GDELT + Finnhub + yfinance</div>
            </div>
            <div className="rounded-3xl border border-emerald-300/10 bg-emerald-400/6 p-4">
              <div className="text-sm text-slate-400">情报系统状态</div>
              <div className="mt-3 text-lg font-semibold text-emerald-300">运行中</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：运行状态 / 异常提示 / 今日推送次数</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：无外部数据接口，来自系统任务调度与日志</div>
            </div>
            <div className="rounded-3xl border border-rose-300/10 bg-rose-400/6 p-4">
              <div className="text-sm text-slate-400">高优先级事件</div>
              <div className="mt-3 text-lg font-semibold text-rose-300">2 个</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">字段：高优先级数量 / 当前主事件 / 是否已处理</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：快讯流聚合结果 + 关键词规则 / AI 评级</div>
            </div>
          </div>
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
                {dashboardIntelFeed.map((item) => (
                  <div key={item.time + item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-200">{item.time}</span>
                      <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-slate-300">{item.source}</span>
                      <span className="rounded-full border border-fuchsia-300/15 bg-fuchsia-400/8 px-2.5 py-1 text-xs text-fuchsia-200">{item.region}</span>
                      <span className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-2.5 py-1 text-xs text-cyan-200">{item.tag}</span>
                      <span className={`rounded-full border px-2.5 py-1 text-xs ${item.level === '高' ? 'border-rose-300/15 bg-rose-400/8 text-rose-200' : 'border-amber-300/15 bg-amber-400/8 text-amber-200'}`}>影响等级 {item.level}</span>
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
                {dashboardIntelMapping.map((item) => (
                  <div key={item.event} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-base font-semibold text-white">{item.event}</div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-slate-500">影响板块</div>
                        <div className="mt-1 text-slate-200 leading-6">{item.sectors}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">关联标的</div>
                        <div className="mt-1 text-slate-200 leading-6">{item.stocks}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">动作建议</div>
                        <div className="mt-1 text-cyan-300 leading-6">{item.action}</div>
                      </div>
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
                {dashboardIntelClusters.map((item) => (
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
                <table className="w-full text-sm">
                  <thead className="bg-white/6 text-slate-300">
                    <tr>
                      <th className="px-4 py-3 text-left">资产</th>
                      <th className="px-4 py-3 text-left">价格</th>
                      <th className="px-4 py-3 text-left">涨跌</th>
                      <th className="px-4 py-3 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardIntelAssets.map((item) => (
                      <tr key={item.asset} className="border-t border-white/8 bg-slate-950/18 hover:bg-white/6">
                        <td className="px-4 py-4 text-slate-200">{item.asset}</td>
                        <td className="px-4 py-4 text-slate-200">{item.price}</td>
                        <td className={`px-4 py-4 font-semibold ${String(item.change).startsWith('+') ? 'text-emerald-300' : 'text-rose-300'}`}>{item.change}</td>
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
                {dashboardIntelAlerts.map((item) => (
                  <div key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-white">{item.name}</div>
                      <span className="rounded-full border border-emerald-300/15 bg-emerald-400/8 px-3 py-1 text-xs font-semibold text-emerald-200">{item.status}</span>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const FactorPage = () => (
    <div className="space-y-7">
      <PageHeader
        title="因子选股"
        desc="重构成‘股票池范围 + 硬过滤 + AI 智能筛选 + 结果工作台’的工作流。每个功能框都标出后续要补的数据字段与推荐接口。"
        primary="开始筛选"
        secondary="保存当前方案"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader title="股票池范围" desc="先限定战场，再做硬过滤和 AI 精筛。" />
            <div className="text-[11px] leading-5 text-slate-500">字段：股票池类型 / 市场范围 / 是否主板 / 行业范围 / 自建主线池 / 黑白名单</div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：AKShare（A 股基础列表）/ BaoStock（历史补库）/ 自建行业词典 / 自建主线主题池</div>
            <div className="mt-4 space-y-3">
              {[
                ["股票池类型", "全市场 / 主板 / 自定义池"],
                ["行业范围", "申万映射 / 自定义主题"],
                ["主线主题池", "电力 / 算电 / 商业航天"],
                ["黑白名单", "持仓关联 / 剔除 ST / 剔除停牌"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-sm text-slate-400">{k}</div>
                  <div className="mt-2 text-sm font-medium text-white">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="硬过滤条件" desc="这一层只保留客观数据，不处理模糊判断。" />
            <div className="text-[11px] leading-5 text-slate-500">字段：成交额 / 换手率 / 量比 / 近1日涨跌幅 / 近3日涨跌幅 / 流通市值 / 是否涨停 / 是否连板 / 是否 ST</div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：AKShare（主数据）/ BaoStock（历史数据）/ Pytdx（可选实时补充）</div>
            <div className="mt-4 space-y-3">
              {[
                ["成交额下限", "1.5 亿"],
                ["换手率区间", "3% - 18%"],
                ["量比下限", "1.2"],
                ["近3日涨跌幅", "2% - 15%"],
                ["流通市值", "20 亿 - 300 亿"],
                ["状态过滤", "非 ST / 非停牌 / 主板优先"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-slate-400">{k}</div>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">{v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="策略模板 / 方案管理" desc="把常用筛选条件和 AI 指令保存成模板。" />
            <div className="text-[11px] leading-5 text-slate-500">字段：模板名称 / 适用场景 / 硬过滤条件 / AI 指令 / 最近使用时间 / 是否默认模板</div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：无外部行情接口；前期可用本地 JSON / SQLite / Session，后期接后端配置存储</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {['右侧低吸', '强趋势中军', '主线前排', '隔夜溢价', '分歧修复'].map((tag, i) => (
                <button
                  key={tag}
                  className={`rounded-2xl border px-3 py-2 text-sm font-medium ${
                    i === 2
                      ? 'border-cyan-300/20 bg-cyan-400/12 text-cyan-300'
                      : 'border-white/10 bg-white/8 text-slate-200 hover:bg-white/12'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader
              title="AI 智能筛选"
              desc="模糊条件交给 AI 判断，但只允许它在当前候选池内筛选和解释。"
              action={<button className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-100 hover:bg-white/12">查看 AI 规则</button>}
            />
            <div className="text-[11px] leading-5 text-slate-500">字段：自然语言选股意图 / 当前候选池数量 / AI 意图拆解 / AI 排序结果 / 风险点 / 是否推送决策中心</div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：OpenAI 模型（或你的 AI 服务）+ 上层候选池数据（AKShare / BaoStock）+ 自建行业词典 / 主线主题池</div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-3xl border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(8,47,73,.35),rgba(15,23,42,.5))] p-5">
                <div className="text-sm text-slate-400">自然语言筛选指令</div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4 text-sm leading-7 text-slate-200">
                  例：帮我筛化工方向里更像龙头、近期具备潜在右侧结构、且不是高位末端加速的票。
                </div>
                <div className="mt-3 text-xs text-slate-500">说明：AI 只做筛选、排序、解释，不直接输出交易指令。</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
                <div className="text-sm text-slate-400">当前候选池</div>
                <div className="mt-3 text-3xl font-semibold text-cyan-300">58</div>
                <div className="mt-2 text-sm text-slate-300">硬过滤后剩余</div>
                <div className="mt-4 text-xs leading-6 text-slate-500">字段：原始股票池数 / 过滤后数量 / AI 二次筛选后数量</div>
              </div>
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader
              title="候选结果工作台"
              desc="主视图改成可排序表格，卡片只留给单股解释。"
              action={
                <div className="flex gap-2">
                  <button className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-100 hover:bg-white/12">导出结果</button>
                  <button className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">推送至决策中心</button>
                </div>
              }
            />
            <div className="text-[11px] leading-5 text-slate-500">字段：股票 / 行业或主题 / 成交额 / 换手率 / 量比 / 近3日涨跌幅 / AI 标签 / AI 结论 / 是否加入观察池</div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：AKShare / BaoStock（客观字段）+ AI 输出（标签、解释、排序）</div>
            <div className="mt-4 overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/6 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-left">股票</th>
                    <th className="px-4 py-3 text-left">行业 / 主题</th>
                    <th className="px-4 py-3 text-left">成交额</th>
                    <th className="px-4 py-3 text-left">换手率</th>
                    <th className="px-4 py-3 text-left">量比</th>
                    <th className="px-4 py-3 text-left">近3日</th>
                    <th className="px-4 py-3 text-left">AI 标签</th>
                    <th className="px-4 py-3 text-left">AI 结论</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["协鑫能科", "电力 / 算电", "18.4 亿", "9.2%", "1.8", "+8.6%", "中军 / 高辨识度", "适合进观察池"],
                    ["赣能股份", "电力", "11.2 亿", "7.4%", "1.5", "+6.3%", "前排 / 潜在右侧", "等待更舒服承接"],
                    ["华银电力", "绿电", "9.8 亿", "13.1%", "2.2", "+12.8%", "高弹性 / 波动大", "更偏激进风格"],
                    ["中国西电", "设备中军", "22.6 亿", "5.6%", "1.4", "+4.1%", "容量中军 / 稳定", "适合稳健观察"],
                  ].map((row) => (
                    <tr key={row.join('-')} className="border-t border-white/8 bg-slate-950/18 hover:bg-white/6">
                      {row.map((cell, i) => (
                        <td key={i} className={`px-4 py-4 ${i === 7 ? 'text-cyan-300' : 'text-slate-300'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${glass} p-6`}>
              <SectionHeader title="单股解释层" desc="每只票都应该能展开“为什么入选”。" />
              <div className="text-[11px] leading-5 text-slate-500">字段：命中的硬过滤条件 / AI 选择理由 / 风险点 / 板块位置判断 / 是否建议推送决策中心</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：硬过滤结果 + AI 解释输出，无需额外行情接口</div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
                当前选中：协鑫能科。<br />
                入选原因：成交额和承接稳定，属于当前主线中军，AI 判断其不是末端加速，近期具备潜在右侧结构。<br />
                风险点：若板块分歧扩大或开盘弱于预期，应降级处理。
              </div>
            </div>

            <div className={`${glass} p-6`}>
              <SectionHeader title="结果联动动作" desc="选股页不应是孤岛，要能接到后续模块。" />
              <div className="text-[11px] leading-5 text-slate-500">字段：加入观察池 / 推送决策中心 / 加入回测样本 / 标记重点观察 / 导出报告</div>
              <div className="mt-2 text-[11px] leading-5 text-slate-500">接口建议：无外部行情接口；来自前端状态、后端任务或本地配置存储</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {['加入观察池', '推送决策中心', '加入回测样本', '导出报告'].map((item) => (
                  <button key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200 hover:bg-white/10">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BacktestPage = () => (
    <div className="space-y-7">
      <PageHeader
        title="回测中心"
        desc="参考专业回测界面的结构：参数区放顶部，指标区靠左，曲线和交易明细占主视图。"
        primary="开始回测"
        secondary="重置参数"
      />

      <div className={`${glass} p-6`}>
        <SectionHeader title="回测参数" desc="参数也尽量做出层次和色彩，而不是纯白表单。" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            ["样本范围", "候选股 Top 10"],
            ["买入方式", "次日开盘买入"],
            ["卖出方式", "收盘卖出 / 盘中止损"],
            ["止损线", "5%"],
            ["回测区间", "2024-01-01 ~ 2025-12-31"],
          ].map(([k, v], idx) => (
            <div key={k} className="rounded-3xl border border-white/10 bg-slate-950/20 p-4">
              <div className="text-sm text-slate-400">{k}</div>
              <div className="mt-3 text-base font-semibold text-white">{v}</div>
              <div className="mt-4 h-1.5 rounded-full bg-white/8">
                <div className={`h-1.5 rounded-full ${idx % 2 === 0 ? 'bg-gradient-to-r from-cyan-400 to-sky-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`} style={{ width: `${56 + idx * 8}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader title="核心指标" desc="收益、胜率、回撤分色展示。" />
            <div className="space-y-3">
              {[
                ["总收益率", "+26.8%", "text-emerald-300", TrendingUp],
                ["胜率", "61.2%", "text-cyan-300", Activity],
                ["最大回撤", "-7.9%", "text-rose-300", TrendingDown],
                ["总交易数", "83", "text-amber-300", Layers3],
                ["平均单笔收益", "+1.9%", "text-fuchsia-300", Target],
              ].map(([k, v, tone, Icon]) => (
                <div key={k} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/8 p-2">
                      <Icon className={`h-4 w-4 ${tone}`} />
                    </div>
                    <span className="text-sm text-slate-300">{k}</span>
                  </div>
                  <span className={`font-semibold ${tone}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="回测结论" desc="结论块单独突出。" />
            <div className="rounded-3xl border border-emerald-300/10 bg-emerald-400/6 p-5 text-sm leading-8 text-slate-200">
              当前策略更适合主线持续、热点集中、前排明确的环境。在退潮或轮动过快的时候，胜率和盈亏比会明显下滑。
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader title="收益曲线" desc="曲线区域直接做成深色主舞台。" />
            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(6,182,212,.1),rgba(15,23,42,.55))] p-5">
              <div className="h-72 rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                <div className="flex h-full items-end gap-2">
                  {[48, 60, 56, 74, 86, 82, 96, 90, 108, 120, 114, 132, 126].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-2xl bg-gradient-to-t from-emerald-500/25 via-cyan-400/45 to-cyan-200/75" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="交易明细" desc="表格颜色更克制，但重点数据要有色彩。" />
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/6 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-left">日期</th>
                    <th className="px-4 py-3 text-left">股票</th>
                    <th className="px-4 py-3 text-left">买入</th>
                    <th className="px-4 py-3 text-left">卖出</th>
                    <th className="px-4 py-3 text-left">收益率</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["2025-03-06", "协鑫能科", "16.82", "17.31", "+2.91%"],
                    ["2025-03-07", "豫能控股", "9.76", "10.12", "+3.69%"],
                    ["2025-03-10", "华电能源", "4.13", "4.05", "-1.94%"],
                  ].map((row) => (
                    <tr key={row.join('-')} className="border-t border-white/8 bg-slate-950/18 hover:bg-white/6">
                      {row.map((cell, i) => (
                        <td key={i} className={`px-4 py-4 ${i === 4 ? (String(cell).startsWith('+') ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold') : 'text-slate-300'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DecisionPage = () => (
    <div className="space-y-7">
      <PageHeader
        title="决策中心"
        desc="把这个页面做成真正的盘前作战台：先看风险总评，再看持仓，再看候选股动作卡和最终执行方案。"
        primary="生成明日计划"
        secondary="同步候选池"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader title="风险总评" desc="结论先行，色彩辅助决策。" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 rounded-3xl border border-fuchsia-300/15 bg-fuchsia-400/10 p-5">
                <div className="text-sm text-fuchsia-200/80">今日评级</div>
                <div className="mt-3 text-3xl font-semibold text-white">中风险</div>
                <div className="mt-2 text-sm text-fuchsia-100/70">适合右侧试错，不适合无脑追高</div>
              </div>
              {[
                ["情绪周期", "分歧修复中", "text-cyan-300"],
                ["主线强度", "电力 / 算电占优", "text-emerald-300"],
                ["操作节奏", "只做前排，不碰杂毛", "text-amber-300"],
              ].map(([k, v, tone]) => (
                <div key={k} className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
                  <div className="text-sm text-slate-400">{k}</div>
                  <div className={`mt-3 text-lg font-semibold ${tone}`}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader
              title="持仓处理"
              desc="每只持仓都要给减仓点、清仓点和继续持有条件。"
              action={<button className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-100 hover:bg-white/12">新增持仓</button>}
            />
            <div className="space-y-4">
              {[
                ["金开新能", "趋势中军", "若跌破关键低点且不能快速收回，先减仓；若回踩后重新放量上攻，可继续观察。", "bg-cyan-400/10 text-cyan-300 border-cyan-300/20"],
                ["协鑫能科", "高波动", "只要开盘不明显弱于预期，可继续盯分歧承接；若板块走弱则优先兑现。", "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-300/20"],
              ].map(([name, type, desc, tone]) => (
                <div key={name} className="rounded-3xl border border-white/10 bg-slate-950/20 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-white">{name}</div>
                      <div className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>票型：{type}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-300">减仓点</button>
                      <button className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-300">清仓点</button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader title="候选股动作卡" desc="把买点、放弃条件做成卡片。" />
            <div className="space-y-4">
              {[
                ["豫能控股", "买点：分歧后重新走强", "text-cyan-300"],
                ["华电能源", "买点：高开不弱且板块联动", "text-emerald-300"],
                ["赣能股份", "放弃：开盘直接弱于预期", "text-rose-300"],
              ].map(([name, tip, tone]) => (
                <div key={name} className="rounded-3xl border border-white/10 bg-slate-950/20 p-4">
                  <div className="font-semibold text-white">{name}</div>
                  <div className={`mt-3 text-sm leading-6 ${tone}`}>{tip}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="最终执行方案" desc="最后一块给一句清晰结论。" />
            <div className="rounded-3xl border border-emerald-300/10 bg-emerald-400/6 p-5 text-sm leading-8 text-slate-200">
              明天优先看主线前排是否继续给舒服买点。若高标和板块同时走强，可小仓位试错；若开盘即分歧扩大，则以处理持仓和空仓观察为主。
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReviewPage = () => (
    <div className="space-y-7">
      <PageHeader
        title="报告回顾"
        desc="参考研究终端的历史工作流页面：左边时间轴，右边详情和关联结果，便于复盘与恢复。"
        primary="恢复为当前结果"
        secondary="按日期筛选"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <div className={`${glass} p-6`}>
            <SectionHeader title="历史记录" desc="最近报告按日期和类型分层。" />
            <div className="space-y-3">
              {[
                ["2026-03-27", "盘前决策报告", "中风险 / 以观察为主", "text-fuchsia-300"],
                ["2026-03-26", "候选池选股结果", "共筛出 6 只", "text-cyan-300"],
                ["2026-03-25", "单股回测结果", "总收益 +12.6%", "text-emerald-300"],
                ["2026-03-24", "盘后复盘摘要", "主线继续聚焦电力", "text-amber-300"],
              ].map(([date, type, desc, tone]) => (
                <div key={date + type} className="rounded-3xl border border-white/10 bg-slate-950/20 p-4 transition hover:bg-white/6 cursor-pointer">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-white">{type}</div>
                    <span className={`text-xs font-medium ${tone}`}>已归档</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{date}</div>
                  <div className={`mt-3 text-sm ${tone}`}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className={`${glass} p-6`}>
            <SectionHeader title="报告详情" desc="正文区单独强调。" />
            <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-6 text-sm leading-8 text-slate-200">
              这里展示历史报告正文。后续可以接入会话历史中的选股、回测、决策结果，支持一键恢复为当前面板状态，避免你来回切页面找记录。
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <SectionHeader title="关联结果" desc="关键字段做成彩色小卡。" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ["候选股数量", "6", "text-cyan-300"],
                ["风险等级", "中风险", "text-amber-300"],
                ["建议动作", "先观察，再等分歧承接", "text-emerald-300"],
              ].map(([k, v, tone]) => (
                <div key={k} className="rounded-3xl border border-white/10 bg-slate-950/20 p-4">
                  <div className="text-sm text-slate-400">{k}</div>
                  <div className={`mt-3 text-lg font-semibold ${tone}`}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "市场情报":
        return <IntelligencePage />;
      case "因子选股":
        return <FactorPage />;
      case "回测中心":
        return <BacktestPage />;
      case "决策中心":
        return <DecisionPage />;
      case "报告回顾":
        return <ReviewPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className={shellBg}>
      <div className="flex min-h-screen">
        <aside className="w-80 shrink-0 border-r border-white/8 bg-slate-950/45 px-6 py-6 backdrop-blur-xl">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="rounded-3xl border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(34,211,238,.12),rgba(99,102,241,.08))] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-white">A股量化决策台</div>
                    <div className="mt-1 text-xs text-slate-400">选股 / 回测 / 决策 / 复盘 一体化原型</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">搜索页面、字段、标的...</span>
              </div>

              <nav className="mt-6 space-y-2">
                {nav.map((item) => {
                  const isActive = activePage === item.key;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActivePage(item.key)}
                      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                        isActive
                          ? 'border border-cyan-300/15 bg-cyan-400/10 text-white shadow-[0_0_0_1px_rgba(34,211,238,.08)]'
                          : 'border border-transparent text-slate-300 hover:border-white/8 hover:bg-white/6'
                      }`}
                    >
                      <div className={`rounded-xl p-2 ${isActive ? 'bg-cyan-400/15 text-cyan-300' : 'bg-white/5 text-slate-400 group-hover:text-slate-200'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>{item.key}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">当前模式</div>
                  <Bell className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="mt-2 text-base font-semibold text-white">短线右侧 / 次日溢价</div>
                <div className="mt-3 text-xs leading-6 text-slate-400">
                  聚焦强势板块前排、分歧转一致、候选池 + 回测 + 次日决策联动。
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-300/10 bg-emerald-400/6 p-4">
                <div className="text-sm text-emerald-200/80">模型状态</div>
                <div className="mt-2 text-base font-semibold text-white">Ready</div>
                <div className="mt-2 text-xs leading-6 text-slate-300">页面已升级为深色高保真方向，支持多页面预览切换。</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-8">{renderPage()}</main>
      </div>
    </div>
  );
}
