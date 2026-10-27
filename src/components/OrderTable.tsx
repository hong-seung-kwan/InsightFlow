import type { Order, OrderStatus } from "../types/orders";

interface OrderTableProps {
    orders: Order[]
}

const statusLabels: Record<OrderStatus, string> = {
    PAID: "결제 완료",
    SHIPPING: "배송 중",
    CANCELLED: "취소",
}
const statusStyles: Record<OrderStatus, string> = {
    PAID: "bg-green-100 text-green-700",
    SHIPPING: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderTable({ orders }: OrderTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="p-4">주문번호</th>
                        <th className="p-4">고객명</th>
                        <th className="p-4">주문 금액</th>
                        <th className="p-4">상태</th>
                        <th className="p-4">주문일</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.id}
                            className="border-t border-slate-200 transition-colors hover:bg-slate-50"
                        >
                            <td className="p-4 font-medium text-slate-900">{order.id}</td>
                            <td className="p-4">{order.customerName}</td>
                            <td className="p-4">{order.amount.toLocaleString("ko-KR")}원</td>
                            <td className="p-4">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                                >
                                    {statusLabels[order.status]}
                                </span>
                            </td>
                            <td className="p-4">{order.orderedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}