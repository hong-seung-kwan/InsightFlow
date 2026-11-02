"use client";
import ErrorState from "@/src/components/ErrorState";
import KpiCard from "@/src/components/KpiCard";
import KpiCardSkeleton from "@/src/components/KpiCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, TrendingUp, Users, Wallet } from "lucide-react";

type KpiId = "revenue" | "orders" | "visits" | "conversion";

interface KpiData {
    id: KpiId;
    title: string,
    value: number | null;
    currencyCode?: string;
}

import { formatCurrency } from "@/src/utils/formatCurrency";
import { useDataMode } from "@/src/contexts/DataModeContext";
import { useAnalytics } from "@/src/hooks/useAnalytics";
import DashboardSalesChart from "@/src/components/DashboardSalesChart";
import DashboardRecentOrders from "@/src/components/DashboardRecentOrders";
import DashboardOrderStatus from "@/src/components/DashboardOrderStatus";

function formatKpiValue(
    id: KpiId,
    value: number | null,
    currencyCode?: string
): string {
    if (value === null) {
        return "-";
    }

    if (id === "revenue") {
        return formatCurrency(value, currencyCode ?? "USD");
    }

    if (id === "orders") {
        return `${new Intl.NumberFormat("ko-KR").format(value)}건`;
    }

    if (id === "visits") {
        return new Intl.NumberFormat("ko-KR").format(value);
    }

    if (id === "conversion") {
        return `${new Intl.NumberFormat("ko-KR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)}%`;
    }

    return String(value);
}

const kpiConfig = {
    revenue: {
        icon: <Wallet size={20} />,
        color: "blue",
    },
    orders: {
        icon: <ShoppingBag size={20} />,
        color: "green",
    },
    visits: {
        icon: <Users size={20} />,
        color: "orange",
    },
    conversion: {
        icon: <TrendingUp size={20} />,
        color: "red",
    },
} as const;

export default function DashboardPage() {
    const { mode } = useDataMode();
    const {
        data: salesData,
        isPending: isSalesPending,
        isError: isSalesError,
        refetch: refetchSales,
    } = useAnalytics("7d", mode);

    const { data, isPending, isError, isFetching, refetch } = useQuery<KpiData[]>({
        queryKey: ["dashboard", mode],

        queryFn: async () => {

            const response = await fetch(`/api/dashboard?mode=${mode}`);

            if (!response.ok) {
                throw new Error("대시보드 데이터 요청 실패");
            }
            return response.json();
        },
        staleTime: 1000 * 60,
    })

    if (isPending) {
        return (
            <main className="p-8">
                <h1 className="text-3xl font-bold">
                    InsightFlow Dashboard
                </h1>
                <p className="mt-2 text-gray-500">
                    쇼핑몰 매출 및 고객 분석 대시보드
                </p>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => (
                        <KpiCardSkeleton key={index} />
                    ))}
                </div>
            </main>
        );
    }
    if (isError) {
        return (
            <main className="p-8">
                <h1 className="text-3xl font-bold">
                    InsightFlow Dashboard
                </h1>

                <div className="mt-6">
                    <ErrorState
                        message="대시보드 데이터를 불러오지 못했습니다."
                        onRetry={() => refetch()}
                        isRetrying={isFetching}
                    />
                </div>
            </main>
        )
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">InsightFlow Dashboard</h1>
            <p className="mt-2 text-gray-500">쇼핑몰 매출 및 고객 분석 대시보드</p>

            {mode === "demo" && (
                <p className="mt-3 text-sm text-amber-700">
                    현재 가상 쇼핑몰 데이터를 표시하고 있습니다.
                    실제 Shopify 데이터와는 무관합니다.
                </p>
            )}
            {isFetching && (
                <p className="mt-2 text-sm text-blue-600">
                    최신 데이터를 업데이트하는 중...
                </p>
            )}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {data.map((item) => (
                    <KpiCard
                        key={item.id}
                        title={item.title}
                        value={formatKpiValue(item.id, item.value, item.currencyCode)}
                        icon={kpiConfig[item.id].icon}
                        color={kpiConfig[item.id].color}
                    />
                ))}
            </div>
            <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                        최근 7일 매출 추이
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        최근 7일 동안 발생한 매출을 확인할 수 있습니다.
                    </p>
                </div>

                {isSalesPending ? (
                    <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
                ) : isSalesError ? (
                    <div className="flex h-72 flex-col items-center justify-center gap-3">
                        <p className="text-sm text-red-500">
                            매출 데이터를 불러오지 못했습니다.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetchSales()}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : (
                    <DashboardSalesChart
                        data={salesData?.sales ?? []}
                        currencyCode={salesData?.currencyCode ?? "USD"}
                    />
                )
                }
            </section>

            <DashboardOrderStatus />

            <DashboardRecentOrders />


        </main>
    )
}