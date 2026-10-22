"use client";
import KpiCard from "@/src/components/KpiCard";
import { useQuery } from "@tanstack/react-query";

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

export default function DashboardPage() {
    const { data, isPending, isError, isFetching } = useQuery<KpiData[]>({
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
        return <p>데이터를 불러오는 중입니다...</p>
    }
    if (isError) {
        return <p>데이터를 불러오지 못했습니다...</p>
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
                    />
                ))}
            </div>
        </main>
    )
}