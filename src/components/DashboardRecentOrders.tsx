"use client"

import Link from "next/link";
import { useDataMode } from "../contexts/DataModeContext"
import { useOrders } from "../hooks/useOrders";
import { formatCurrency } from "../utils/formatCurrency";
import OrderStatusBadge from "./OrderStatusBadge";


export default function DashboardRecentOrders() {
    const { mode } = useDataMode();

    const { data, isPending, isError, refetch } = useOrders(mode);

    const recentOrders = [...(data?.orders ?? [])]
        .sort((a, b) => b.orderedAt.localeCompare(a.orderedAt))
        .slice(0, 5);

    return (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">
                        최근 주문 내역
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        가장 최근에 발생한 주문 5건입니다.
                    </p>
                </div>

                <Link
                    href="/orders"
                    className="shrink-0 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline"
                >
                    전체 주문 보기
                </Link>
            </div>

            {isPending ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={index}
                            className="h-12 animate-pulse rounded-lg bg-slate-100"
                        />
                    ))}
                </div>
            ) : isError ? (
                <div className="py-12 text-center">
                    <p className="text-sm text-red-500">
                        주문 데이터를 불러오지 못했습니다.
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-3 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white"
                    >
                        다시 시도
                    </button>
                </div>
            ) : recentOrders.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                    등록된 주문이 없습니다.
                </p>
            ) : (
                <div className="w-full min-w-0 overflow-x-auto">
                    <table className="w-full min-w-[650px] whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">주문번호</th>
                                <th className="px-4 py-3 font-medium">고객명</th>
                                <th className="px-4 py-3 font-medium">주문일</th>
                                <th className="px-4 py-3 font-medium">금액</th>
                                <th className="px-4 py-3 font-medium">상태</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {recentOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-4 py-4 font-medium">
                                        {order.id}
                                    </td>

                                    <td className="px-4 py-4">
                                        {order.customerName}
                                    </td>

                                    <td className="px-4 py-4 text-slate-500">
                                        {order.orderedAt}
                                    </td>

                                    <td className="px-4 py-4 font-medium">
                                        {formatCurrency(
                                            order.amount,
                                            order.currencyCode
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <OrderStatusBadge status={order.status}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}