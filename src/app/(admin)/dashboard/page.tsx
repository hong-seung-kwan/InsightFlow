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
    value: number;
}

function formatKpiValue(
    id: KpiId,
    value: number
): string {
    if (id === "revenue") {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(value)
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
            maximumFractionDigits: 2
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
    const { data, isPending, isError, isFetching, refetch } = useQuery<KpiData[]>({
        queryKey: ["dashboard"],
        queryFn: async () => {

            const response = await fetch("/api/dashboard");

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
                        value={formatKpiValue(item.id, item.value)}
                        icon={kpiConfig[item.id].icon}
                        color={kpiConfig[item.id].color}
                    />
                ))}
            </div>
        </main>
    )
}