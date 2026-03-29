import { useCallback, useEffect, useState } from "react";
import { getMarketIntelligenceOverview, MarketIntelligenceRefreshError } from "../services/intelligenceService";
import type { MarketIntelligenceOverview } from "../types";

type RefreshState = "idle" | "loading" | "error";

export const useMarketIntelligence = () => {
  const [data, setData] = useState<MarketIntelligenceOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshState, setRefreshState] = useState<RefreshState>("idle");

  const refresh = useCallback(async () => {
    setLoading(true);
    setRefreshState("loading");
    setError(null);

    try {
      const next = await getMarketIntelligenceOverview();
      setData(next);
      setRefreshState("idle");
    } catch (e) {
      console.error("[intelligence] refresh failed", e);

      if (e instanceof MarketIntelligenceRefreshError) {
        setData(e.fallbackData);
        setError(e.message);
      } else {
        setError("刷新失败，暂无可用数据，请稍后重试。");
      }

      setRefreshState("error");
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
    refreshState,
  };
};
