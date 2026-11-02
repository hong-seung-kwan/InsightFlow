
"use client";

import Link from "next/link";
import {
    CreditCard,
    PackageCheck,
    Truck,
    Clock,
    XCircle,
} from "lucide-react";

import { useOrders } from "@/src/hooks/useOrders";
import { useDataMode } from "@/src/contexts/DataModeContext";
import type { OrderStatus } from "@/src/types/orders";

const statusConfig = [
    {
        status: "PAID",
        label: "결제 완료",
        icon: CreditCard,
        color: "text-blue-600",
        background: "bg-blue-50",
    },
    {
        status: "FULFILLED",
        label: "배송 완료",
        icon: PackageCheck,
        color: "text-green-600",
        background: "bg-green-50",
    },
    {
        status: "PARTIALLY_FULFILLED",
        label: "부분 배송",
        icon: Truck,
        color: "text-amber-600",
        background: "bg-amber-50",
    },
    {
        status: "PENDING",
        label: "결제 대기",
        icon: Clock,
        color: "text-slate-600",
        background: "bg-slate-100",
    },
    {
        status: "CANCELLED",
        label: "취소",
        icon: XCircle,
        color: "text-red-600",
        background: "bg-red-50",
    },
] as const;

export default function DashboardOrderStatus() {
    const { mode } = useDataMode();

    const { data, isPending, isError, refetch } = useOrders(mode);

    const orders = data?.orders ?? [];

    const statusCounts = orders.reduce<Record<OrderStatus, number>>(
        (acc, order) => {
            acc[order.status] += 1;
            return acc;
        },
        {
            PAID: 0,
            FULFILLED: 0,
            PARTIALLY_FULFILLED: 0,
            PENDING: 0,
            CANCELLED: 0,
        }
    );

    return (
        <section className="mt-8">
            <div className="mb-5">
                <h2 className="text-xl font-semibold">
                    주문 상태별 현황
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    조회된 주문의 상태별 개수를 확인할 수 있습니다.
                </p>
            </div>

            {isPending ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={index}
                            className="h-32 animate-pulse rounded-xl bg-slate-200"
                        />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-sm text-red-500">
                        주문 상태 데이터를 불러오지 못했습니다.
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-3 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white"
                    >
                        다시 시도
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {statusConfig.map((item) => {
                        const Icon = item.icon;
                        const count = statusCounts[item.status];
                        const percentage = orders.length
                            ? (count / orders.length) * 100
                            : 0;

                        return (
                            <Link
                                key={item.status}
                                href={`/orders?status=${item.status}`}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        {item.label}
                                    </p>

                                    <div className={`rounded-lg p-2 ${item.background}`}>
                                        <Icon size={20} className={item.color} />
                                    </div>
                                </div>

                                <p className="mt-3 text-2xl font-bold">
                                    {count}건
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    전체 조회 주문의 {percentage.toFixed(1)}%
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
