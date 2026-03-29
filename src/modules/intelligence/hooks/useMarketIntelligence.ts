import { useCallback, useEffect, useState } from "react";
import { getMarketIntelligenceOverview } from "../services/intelligenceService";
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
      if (next.allSourcesFailed) {
        setError("当前全部数据源请求失败，页面显示的是降级数据。");
      }
    } catch (e) {
      console.error("[intelligence] refresh failed", e);
      setError("刷新失败，已展示可用数据，请稍后重试。");
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
