import { useQuery } from "@tanstack/react-query";
import type {
    AnalyticsResponse,
    Period,
} from "@/src/types/analytics";

export type AnalyticsMode = "shopify" | "demo";

export function useAnalytics(
    period: Period,
    mode: AnalyticsMode = "shopify"
) {
    return useQuery<AnalyticsResponse>({
        queryKey: ["analytics", period, mode],
        queryFn: async () => {
            const response = await fetch(
                `/api/analytics?period=${period}&mode=${mode}`
            );

            if (!response.ok) {
                throw new Error("매출 데이터 요청 실패");
            }

            return response.json();
        },

        staleTime: 1000 * 60,
    })
}