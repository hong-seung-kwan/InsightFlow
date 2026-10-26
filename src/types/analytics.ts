export type Period = "7d" | "30d" | "90d";

export interface SalesData {
    date: string;
    revenue: number;
}

export interface AnalyticsResponse {
    period: Period;
    sales: SalesData[];
    previousSales: SalesData[];
    previousTotalRevenue: number;
}