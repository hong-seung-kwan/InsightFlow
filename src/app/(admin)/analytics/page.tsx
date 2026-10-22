"use client"

import GrowthRateCard from "@/src/components/GrowthRateCard";
import KpiCard from "@/src/components/KpiCard";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Period = "7d" | "30d" | "90d";

interface SalesData {
    date: string;
    revenue: number;
}

interface AnalyticsResponse {
    period: Period;
    sales: SalesData[];
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
function calculateGrowthRate(
    current: number,
    previous: number
) {
    if (previous === 0) {
        return null;
    }

    return ((current - previous) / previous) * 100;
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<Period>("7d");

    const { data, isPending, isError, isFetching } =
        useQuery<AnalyticsResponse>({
            queryKey: ["analytics", period],
            queryFn: async () => {
                const response = await fetch(
                    `/api/analytics?period=${period}`
                );

                if (!response.ok) {
                    throw new Error("매출 데이터 요청 실패")
                }
                return response.json();
            },

            staleTime: 1000 * 60,
        })
    const sales = data?.sales;
    const { totalRevenue, averageRevenue, maxRevenue, growthRate } = useMemo(() => {
        const items = sales ?? [];

        const totalRevenue = items.reduce((sum, item) => {
            return sum + item.revenue;
        }, 0);

        const averageRevenue =
            items.length > 0 ? totalRevenue / items.length : 0;

        const maxRevenue = items.length > 0
            ? Math.max(...items.map((item) => item.revenue))
            : 0;
        const currentRevenue = items.at(-1)?.revenue ?? 0;
        const previousRevenue = items.at(-2)?.revenue ?? 0;

        const growthRate =
            items.length >= 2
                ? calculateGrowthRate(currentRevenue, previousRevenue)
                : null;

        return { totalRevenue, averageRevenue, maxRevenue, growthRate };

    }, [sales]);

    const growthTitle = {
        "7d": "전일 대비 매출 증감률",
        "30d": "전주 대비 매출 증감률",
        "90d": "전월 대비 매출 증감률",
    };

    function getKpiValue(value: number) {
        if (isPending) return "불러오는 중...";
        if (isError) return "조회 실패";

        return formatCurrency(value);
    }
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">매출 분석</h1>
            <p className="mt-2 text-slate-500">
                기간별 매출 추이를 확인할 수 있습니다.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard
                    title="총매출"
                    value={getKpiValue(totalRevenue)}
                />
                <KpiCard
                    title="평균 매출"
                    value={getKpiValue(averageRevenue)}
                />
                <KpiCard
                    title="최고 매출"
                    value={getKpiValue(maxRevenue)}
                />
            </div>

            <div className="mt-4">
                <GrowthRateCard
                    title={growthTitle[period]}
                    growthRate={growthRate}
                    isPending={isPending}
                    isError={isError}
                />
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold">
                    매출 추이
                </h2>

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                        {(["7d", "30d", "90d"] as const).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setPeriod(item)}
                                className={`rounded-lg px-4 py-2 text-sm ${period === item
                                    ? "bg-blue-600 text-white"
                                    : "border border-slate-200 bg-white text-slate-600"
                                    }`}
                            >
                                {item === "7d" ? "7일" : item === "30d" ? "30일" : "90일"}
                            </button>
                        ))}
                    </div>

                    <p className="min-h-5 text-sm text-slate-400">
                        {isFetching && !isPending
                            ? "최신 매출 데이터를 업데이트하는 중..."
                            : ""}
                    </p>
                </div>

                <div className="h-80 w-full">
                    {isPending ? (
                        <div className="flex h-full items-center justify-center text-slate-500">
                            매출 데이터를 불러오는 중...
                        </div>
                    ) : isError ? (
                        <div className="flex h-full items-center justify-center text-red-500">
                            매출 데이터를 불러오지 못했습니다.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.sales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={formatRevenue} width={85} />
                                <Tooltip
                                    formatter={(value) => [
                                        `${Number(value).toLocaleString("ko-KR")}원`,
                                        "매출",
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
