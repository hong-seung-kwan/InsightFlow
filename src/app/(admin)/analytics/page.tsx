"use client"

import GrowthRateCard from "@/src/components/GrowthRateCard";
import KpiCard from "@/src/components/KpiCard";
import SalesComparisonChart from "@/src/components/SalesComparisonChart";
import { useAnalytics } from "@/src/hooks/useAnalytics";
import { useAnalyticsMetrics } from "@/src/hooks/useAnalyticsMetrics";
import { useSalesComparison } from "@/src/hooks/useSalesComparison";
import type { Period } from "@/src/types/analytics";
import { useState } from "react";


function formatCurrency(value: number) {
    return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<Period>("7d");

    const { data, isPending, isError, isFetching } =
        useAnalytics(period);
    const sales = data?.sales;
    const previousTotalRevenue = data?.previousTotalRevenue;

    const {
        totalRevenue,
        averageRevenue,
        maxRevenue,
        growthRate,
    } = useAnalyticsMetrics(sales, previousTotalRevenue);

    const comparisonData = useSalesComparison(
        data?.sales,
        data?.previousSales
    );

    const growthTitle = {
        "7d": "이전 7일 대비 매출 증감률",
        "30d": "이전 30일 대비 매출 증감률",
        "90d": "이전 90일 대비 매출 증감률",
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
                    현재 기간 vs 이전 기간 매출 비교
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
                {isPending ? (
                    <div className="flex h-80 items-center justify-center text-slate-500">
                        매출 데이터를 불러오는 중...
                    </div>
                ) : isError ? (
                    <div className="flex h-80 items-center justify-center text-red-500">
                        매출 데이터를 불러오지 못했습니다.
                    </div>
                ) : (
                    <SalesComparisonChart data={comparisonData} />
                )}

            </div>
        </div>
    );
}
