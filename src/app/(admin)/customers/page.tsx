"use client";

import CustomerDistributionChart from "@/src/components/CustomerDistributionChart";
import CustomerTable from "@/src/components/CustomerTable";
import KpiCard from "@/src/components/KpiCard";
import { useCustomers } from "@/src/hooks/useCustomers";
import { useState } from "react";

export default function CustomersPage() {
    const [search, setSearch] = useState("");
    const { data, isPending, isError } = useCustomers();

    const filteredCustomers = (data?.customers ?? []).filter((customer) => {
        return customer.name.includes(search.trim());
    })

    function getKpiValue(value: number | undefined, suffix: string) {
        if (isPending) return "불러오는 중...";
        if (isError) return "조회 실패";

        return `${value?.toLocaleString("ko-KR") ?? "0"}${suffix}`;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">고객 분석</h1>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            </div>

            {data && (
                <section className="mt-8">
                    <h2 className="mb-1 text-xl font-semibold">
                        고객 구성 비율
                    </h2>
                    <p className="mb-4 text-sm text-slate-500">
                        전체 고객 중 신규 고객과 기존 고객의 비율
                    </p>

                    <CustomerDistributionChart
                        totalCustomers={data.totalCustomers}
                        newCustomers={data.newCustomers}
                    />
                </section>
            )}



            <div className="mt-8">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="mb-4 text-xl font-semibold">고객 목록</h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="고객 이름 검색"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="mon-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2 sm:w-64"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                            }}
                            disabled={!search}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            초기화
                        </button>
                    </div>
                </div>
                {isPending ? (
                    <p>고객 목록을 불러오는 중...</p>
                ) : isError ? (
                    <p>고객 목록을 불러오지 못했습니다.</p>
                ) : filteredCustomers.length === 0 ? (
                    <p className="py-8 text-center text-slate-500">
                        {search.trim()
                            ? "검색 결과가 없습니다."
                            : "등록된 고객이 없습니다."}
                    </p>
                ) : (
                    <CustomerTable customers={filteredCustomers} />
                )}
            </div>
        </div>
    );
}
