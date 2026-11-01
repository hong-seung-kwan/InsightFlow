"use client";

import { formatCurrency } from "@/src/utils/formatCurrency";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ComparisonData {
    date: string;
    currentRevenue: number;
    previousRevenue: number | null;
}

interface SalesComparisonChartProps {
    data: ComparisonData[];
    currencyCode: string;
}

export default function SalesComparisonChart({
    data,
    currencyCode,
}: SalesComparisonChartProps) {

    // Y축 금액 표시
    function formatRevenue(value: number) {
        return new Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    }

    // X축 날짜 표시
    function formatDate(value: string) {
        return value.slice(5).replace("-", "/");
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        minTickGap={25}
                    />

                    <YAxis
                        tickFormatter={formatRevenue}
                        width={65}
                    />

                    <Tooltip
                        formatter={(value, name) => [
                            value == null
                                ? "-"
                                : formatCurrency(
                                    Number(value),
                                    currencyCode
                                ),
                            name,
                        ]}
                        labelFormatter={(label) =>
                            `현재 기간: ${String(label)}`
                        }
                    />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="currentRevenue"
                        name="현재 기간"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="previousRevenue"
                        name="이전 기간"
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}