"use client";

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
}

function formatRevenue(value: number) {
    return `${(value / 10000).toLocaleString("ko-KR")}만`;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function SalesComparisonChart({
    data,
}: SalesComparisonChartProps) {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis
                        tickFormatter={formatRevenue}
                        width={85}
                    />

                    <Tooltip
                        formatter={(value, name) => [
                            formatCurrency(Number(value)),
                            name,
                        ]}
                    />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="currentRevenue"
                        name="현재 기간"
                        stroke="#2563eb"
                        strokeWidth={2}
                    />

                    <Line
                        type="monotone"
                        dataKey="previousRevenue"
                        name="이전 기간"
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}