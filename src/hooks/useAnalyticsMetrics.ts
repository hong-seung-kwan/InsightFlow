import { useMemo } from "react";
import { SalesData } from "../types/analytics";

function calculateGrowthRate(
    current: number,
    previous: number
) {
    if (previous === 0) {
        return null;
    }

    return ((current - previous) / previous) * 100;
}

export function useAnalyticsMetrics(
    sales: SalesData[] | undefined,
    previousTotalRevenue: number | undefined
) {
    return useMemo(() => {
        const items = sales ?? [];

        const totalRevenue = items.reduce(
            (sum, item) => sum + item.revenue,
            0
        );

        const averageRevenue =
            items.length > 0
                ? totalRevenue / items.length
                : 0;

        const maxRevenue =
            items.length > 0
                ? Math.max(...items.map((item) => item.revenue))
                : 0;

        const growthRate =
            previousTotalRevenue === undefined
                ? null
                : calculateGrowthRate(
                    totalRevenue,
                    previousTotalRevenue
                );

        return {
            totalRevenue,
            averageRevenue,
            maxRevenue,
            growthRate,
        };
    }, [sales,previousTotalRevenue]);
}