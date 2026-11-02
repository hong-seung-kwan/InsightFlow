
import type { OrderStatus } from "@/src/types/orders";

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<
    OrderStatus,
    { label: string; className: string }
> = {
    PAID: {
        label: "결제 완료",
        className: "bg-blue-100 text-blue-700",
    },
    FULFILLED: {
        label: "배송 완료",
        className: "bg-green-100 text-green-700",
    },
    PARTIALLY_FULFILLED: {
        label: "부분 배송",
        className: "bg-amber-100 text-amber-700",
    },
    PENDING: {
        label: "결제 대기",
        className: "bg-slate-100 text-slate-700",
    },
    CANCELLED: {
        label: "취소",
        className: "bg-red-100 text-red-700",
    },
};

export default function OrderStatusBadge({
    status,
}: OrderStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
}
