export type Period = "7d" | "30d" | "90d";

export interface SalesData {
    date: string;
    revenue: number;
}

export interface AnalyticsResponse {
    period: Period;
    sales: {
        date: string;
        revenue: number;
    }[];
    previousSales: {
        date: string;
        revenue: number;
    }[];
    previousTotalRevenue: number;
    currencyCode: string;
}