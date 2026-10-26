import { useQuery } from "@tanstack/react-query";
import type {
    AnalyticsResponse,
    Period,
} from "@/src/types/analytics";

export function useAnalytics(period: Period) {
    return useQuery<AnalyticsResponse>({
        queryKey: ["analytics", period],
        queryFn: async () => {
            const response = await fetch(
                `/api/analytics?period=${period}`
            );

            if (!response.ok) {
                throw new Error("매출 데이터 요청 실패");
            }

            return response.json();
        },

        staleTime: 1000 * 60,
    })
}