"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../utils/formatCurrency";
import { AnalyticsResponse } from "../types/analytics";


interface DashboardSalesChartProps {
    data: AnalyticsResponse["sales"];
    currencyCode: string;
}

export default function DashboardSalesChart({
    data,
    currencyCode,
}: DashboardSalesChartProps) {
    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="date"
                        tickFormatter={(value: string) =>
                            value.slice(5)
                        }
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        tickFormatter={(value: number) =>
                            formatCurrency(value, currencyCode)
                        }
                        tick={{ fontSize: 12 }}
                        width={80}
                    />

                    <Tooltip
                        formatter={(value) => [
                            formatCurrency(Number(value ?? 0,), currencyCode),
                            "매출"
                        ]}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}