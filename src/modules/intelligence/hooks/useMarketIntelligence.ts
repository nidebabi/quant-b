import { useCallback, useEffect, useState } from "react";
import { getMarketIntelligenceOverview, IntelligenceRefreshError } from "../services/intelligenceService";
import type { MarketIntelligenceOverview } from "../types";

export const useMarketIntelligence = () => {
  const [data, setData] = useState<MarketIntelligenceOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await getMarketIntelligenceOverview();
      setData(next);
      if (next.feedDataSource === "fallback") {
        setError("刷新完成，但当前为 fallback 数据。");
      } else if (next.feedDataSource === "cached") {
        setError("刷新完成，但当前为 cached 数据（非最新直连结果）。");
      }
    } catch (e) {
      console.error("[intelligence] refresh failed", e);
      if (e instanceof IntelligenceRefreshError) {
        setData(e.fallbackData);
        setError(e.message);
      } else {
        setError("刷新失败，请检查网络后重试。");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
};
