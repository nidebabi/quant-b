export const formatLocalTime = (input: string | number | Date): string => {
  const date = new Date(input);
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(date);
};

export const formatDateTime = (input: string | number | Date): string => {
  const date = new Date(input);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(date);
};

export const formatPublishedTimeLabel = (publishedAt?: string, fetchedAt?: string): string => {
  const picked = publishedAt || fetchedAt;
  if (!picked) return "发布时间：未知";

  const date = new Date(picked);
  if (Number.isNaN(date.getTime())) return "发布时间：未知";

  const year = date.toLocaleString("zh-CN", { year: "numeric", timeZone: "Asia/Shanghai" });
  const month = date.toLocaleString("zh-CN", { month: "2-digit", timeZone: "Asia/Shanghai" });
  const day = date.toLocaleString("zh-CN", { day: "2-digit", timeZone: "Asia/Shanghai" });
  const hour = date.toLocaleString("zh-CN", { hour: "2-digit", hour12: false, timeZone: "Asia/Shanghai" });
  const minute = date.toLocaleString("zh-CN", { minute: "2-digit", timeZone: "Asia/Shanghai" });

  return `发布时间：${year}年${month}月${day}日 ${hour}点${minute}分`;
};
