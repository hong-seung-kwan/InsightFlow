
import type { Period } from "@/src/types/analytics";
import { demoOrders } from "@/src/lib/demoData";

interface SalesData {
    date: string;
    revenue: number;
}

interface DemoAnalyticsResponse {
    period: Period;
    sales: SalesData[];
    previousSales: SalesData[];
    previousTotalRevenue: number;
    currencyCode: string;
}

function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function getDate(daysAgo: number): Date {
    const date = new Date();

    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - daysAgo);

    return date;
}

// 날짜별 실제 데모 주문 매출 합산
function getDailyRevenue(date: string): number {
    return demoOrders
        .filter(
            (order) =>
                order.orderedAt === date &&
                (
                    order.status === "PAID" ||
                    order.status === "FULFILLED" ||
                    order.status === "PARTIALLY_FULFILLED"
                )
        )
        .reduce((sum, order) => sum + order.amount, 0);
}

export function generateDemoAnalytics(
    period: Period
): DemoAnalyticsResponse {
    const days = Number(period.replace("d", ""));

    const sales: SalesData[] = [];
    const previousSales: SalesData[] = [];

    for (let i = 0; i < days; i++) {
        const currentDaysAgo = days - 1 - i;
        const previousDaysAgo = days * 2 - 1 - i;

        const currentDate = formatDate(getDate(currentDaysAgo));
        const previousDate = formatDate(getDate(previousDaysAgo));

        sales.push({
            date: currentDate,
            revenue: getDailyRevenue(currentDate),
        });

        previousSales.push({
            date: previousDate,
            revenue: getDailyRevenue(previousDate),
        });
    }

    const previousTotalRevenue = previousSales.reduce(
        (sum, item) => sum + item.revenue,
        0
    );

    return {
        period,
        sales,
        previousSales,
        previousTotalRevenue,
        currencyCode: "USD",
    };
}
