"use client";

import CustomerDistributionChart from "@/src/components/CustomerDistributionChart";
import CustomerTable from "@/src/components/CustomerTable";
import ErrorState from "@/src/components/ErrorState";
import KpiCard from "@/src/components/KpiCard";
import KpiCardSkeleton from "@/src/components/KpiCardSkeleton";
import TableSkeleton from "@/src/components/TableSkeleton";
import { useCustomers } from "@/src/hooks/useCustomers";
import { TrendingUp, UserCheck, UserPlus, Users } from "lucide-react";
import { useState } from "react";

export default function CustomersPage() {
    const [search, setSearch] = useState("");
    const { data, isPending, isError, isFetching, refetch } = useCustomers();

    const filteredCustomers = (data?.customers ?? []).filter((customer) => {
        return customer.name.includes(search.trim());
    })

    function getKpiValue(value: number | undefined, suffix: string) {
        if (isPending) return "불러오는 중...";
        if (isError) return "조회 실패";

        return `${value?.toLocaleString("ko-KR") ?? "0"}${suffix}`;
    }

    if (isError) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold">고객 분석</h1>

                <div className="mt-6">
                    <ErrorState
                        message="고객 데이터를 불러오지 못했습니다."
                        onRetry={() => refetch()}
                        isRetrying={isFetching}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">고객 분석</h1>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {isPending ? (
                    Array.from({ length: 4 }, (_, index) => (
                        <KpiCardSkeleton key={index} />
                    ))
                ) : (
                    <>
                        <KpiCard
                            title="전체 고객"
                            value={getKpiValue(data?.totalCustomers, "명")}
                            icon={<Users size={20} />}
                            color="blue"
                        />
                        <KpiCard
                            title="신규 고객"
                            value={getKpiValue(data?.newCustomers, "명")}
                            icon={<UserPlus size={20} />}
                            color="green"
                        />
                        <KpiCard
                            title="재구매 고객"
                            value={getKpiValue(data?.repeatCustomers, "명")}
                            icon={<UserCheck size={20} />}
                            color="orange"
                        />
                        <KpiCard
                            title="재구매율"
                            value={getKpiValue(data?.repeatPurchaseRate, "%")}
                            icon={<TrendingUp size={20} />}
                            color="red"
                        />
                    </>
                )}
            </div>

            {data && (
                <section className="mt-8">
                    <h2 className="mb-1 text-xl font-semibold">
                        고객 구성 비율
                    </h2>
                    <p className="mb-4 text-sm text-slate-500">
                        전체 고객 중 신규 고객과 기존 고객의 비율
                    </p>

                    {isPending ? (
                        <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
                    ) : isError ? (
                        <div className="flex h-72 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-500">
                            고객 구성 데이터를 불러오지 못했습니다.
                        </div>
                    ) : data ? (
                        <CustomerDistributionChart
                            totalCustomers={data.totalCustomers}
                            newCustomers={data.newCustomers}
                        />
                    ) : (
                        <p className="py-8 text-center text-slate-500">
                            고객 구성 데이터가 없습니다.
                        </p>
                    )}
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
                            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2 sm:w-64"
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
                    <TableSkeleton rows={5} columns={4} />
                ) : isError ? (
                    <p>고객 목록을 불러오지 못했습니다.</p>
                ) : filteredCustomers.length === 0 ? (
                    <p>검색 결과가 없습니다.</p>
                ) : (
                    <CustomerTable customers={filteredCustomers} />
                )}
            </div>
        </div>
    );
}
