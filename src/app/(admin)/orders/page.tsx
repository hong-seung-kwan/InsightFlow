"use client";

import ErrorState from "@/src/components/ErrorState";
import KpiCard from "@/src/components/KpiCard";
import KpiCardSkeleton from "@/src/components/KpiCardSkeleton";
import OrderTable from "@/src/components/OrderTable";
import TableSkeleton from "@/src/components/TableSkeleton";
import { useOrders } from "@/src/hooks/useOrders";
import type { OrderStatus } from "@/src/types/orders";
import { CheckCircle2, ShoppingBag, Truck, XCircle } from "lucide-react";
import { useState } from "react";

type SortOption = "latest" | "priceHigh" | "priceLow";

const statusOptions: {
    label: string;
    value: OrderStatus | "ALL";
}[] = [
        { label: "전체", value: "ALL" },
        { label: "결제 완료", value: "PAID" },
        { label: "배송 중", value: "SHIPPING" },
        { label: "취소", value: "CANCELLED" }
    ]

export default function OrdersPage() {
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [search, setSearch] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("latest");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { data, isPending, isError, isFetching, refetch } = useOrders();
    const keyword = search.trim().toLowerCase();
    const filteredOrders = (data?.orders ?? []).filter((order) => {
        const matchesSearch = order.customerName.toLowerCase().includes(keyword) || order.id.toLowerCase().includes(keyword);
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    })

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortOption === "priceHigh") {
            return b.amount - a.amount;
        }

        if (sortOption === "priceLow") {
            return a.amount - b.amount;
        }

        return b.orderedAt.localeCompare(a.orderedAt);
    })
    const totalPages = Math.ceil(sortedOrders.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;

    const paginatedOrders = sortedOrders.slice(
        startIndex,
        startIndex + pageSize
    )


    function getKpiValue(value: number | undefined, suffix: string) {
        return `${value?.toLocaleString("ko-KR") ?? "0"}${suffix}`;
    }

    if (isError) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold">
                    주문 관리
                </h1>

                <div className="mt-6">
                    <ErrorState
                        message="주문 데이터를 불러오지 못했습니다."
                        onRetry={() => refetch()}
                        isRetrying={isFetching}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">주문 관리</h1>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {isPending ? (
                    Array.from({ length: 4 }, (_, index) => (
                        <KpiCardSkeleton key={index} />
                    ))
                ) : (
                    <>
                        <KpiCard
                            title="전체 주문"
                            value={getKpiValue(data?.totalOrders, "건")}
                            icon={<ShoppingBag size={20} />}
                            color="blue"
                        />
                        <KpiCard
                            title="결제 완료"
                            value={getKpiValue(data?.paidOrders, "건")}
                            icon={<CheckCircle2 size={20} />}
                            color="green"
                        />
                        <KpiCard
                            title="배송 중"
                            value={getKpiValue(data?.shippingOrders, "건")}
                            icon={<Truck size={20} />}
                            color="orange"
                        />
                        <KpiCard
                            title="취소 주문"
                            value={getKpiValue(data?.cancelledOrders, "건")}
                            icon={<XCircle size={20} />}
                            color="red"
                        />
                    </>
                )}
            </div>

            <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">
                    주문 목록
                </h2>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                    <input
                        type="text"
                        placeholder="주문번호 또는 고객명 검색"
                        value={search}
                        onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }}
                        className="rounded-lg border border-slate-300 px-4 py-2 sm:flex-1"
                    />

                    <button
                        type="button"
                        onClick={() => { setSearch(""); setCurrentPage(1) }}
                        disabled={!search}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-white disabled:opacity-50"
                    >
                        초기화
                    </button>
                    <select
                        value={sortOption}
                        onChange={(event) => {
                            setSortOption(event.target.value as SortOption);
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2"
                    >
                        <option value="latest">최신 주문순</option>
                        <option value="priceHigh">금액 높은순</option>
                        <option value="priceLow">금액 낮은순</option>
                    </select>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => { setStatusFilter(option.value); setCurrentPage(1) }}
                            className={`rounded-lg px-4 py-2 ${statusFilter === option.value
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}

                </div>
                {isPending ? (
                    <TableSkeleton rows={5} columns={5} />
                ) : sortedOrders.length === 0 ? (
                    <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                        {search.trim() || statusFilter !== "ALL"
                            ? "검색 조건에 맞는 주문이 없습니다."
                            : "등록된 주문이 없습니다."}
                    </p>
                ) : (
                    <OrderTable orders={paginatedOrders} />
                )}

                {!isPending && totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1}
                            className="rounded-lg border px-3 py-2 disabled:opacity-40"
                        >
                            이전
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`rounded-lg px-3 py-2 ${currentPage === index + 1
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-200 bg-white"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border px-3 py-2 disabled:opacity-40"
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
