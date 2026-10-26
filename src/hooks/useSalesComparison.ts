import { useMemo } from "react";
import type { SalesData } from "@/src/types/analytics";

export function useSalesComparison(
    sales: SalesData[] | undefined,
    previousSales: SalesData[] | undefined
) {
    return useMemo(() => {
        if (!sales) return [];

        return sales.map((item, index) => ({
            date: item.date,
            currentRevenue: item.revenue,
            previousRevenue: previousSales?.[index]?.revenue ?? null,
        }));
    }, [sales, previousSales]);
}