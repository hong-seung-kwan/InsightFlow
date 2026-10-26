"use client";

import CustomerDistributionChart from "@/src/components/CustomerDistributionChart";
import CustomerTable from "@/src/components/CustomerTable";
import KpiCard from "@/src/components/KpiCard";
import { useCustomers } from "@/src/hooks/useCustomers";

export default function CustomersPage() {

    const { data, isPending, isError } = useCustomers();

    function getKpiValue(value: number | undefined, suffix: string) {
        if (isPending) return "불러오는 중...";
        if (isError) return "조회 실패";

        return `${value?.toLocaleString("ko-KR") ?? "0"}${suffix}`;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">고객 분석</h1>
            <KpiCard
                title="전체 고객"
                value={getKpiValue(data?.totalCustomers, "명")}
            />
            <KpiCard
                title="신규 고객"
                value={getKpiValue(data?.newCustomers, "명")}
            />
            <KpiCard
                title="재구매 고객"
                value={getKpiValue(data?.repeatCustomers, "명")}
            />
            <KpiCard
                title="재구매율"
                value={getKpiValue(data?.repeatPurchaseRate, "%")}
            />

            {data && (
                <CustomerDistributionChart
                    totalCustomers={data.totalCustomers}
                    newCustomers={data.newCustomers}
                />
            )}

            {data && (
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold">고객 목록</h2>
                    <CustomerTable customers={data.customers} />
                </div>
            )}
        </div>
    );
}
