import { formatCurrency } from "../utils/formatCurrency";
import type { Order } from "../types/orders";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderTableProps {
    orders: Order[]
}

export default function OrderTable({ orders }: OrderTableProps) {
    return (
        <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[700px] whitespace-nowrap text-left text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="p-4">주문번호</th>
                        <th className="whitespace-nowrap px-4 py-3">고객명</th>
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
                            <td className="whitespace-nowrap px-4 py-4">{order.customerName}</td>
                            <td className="p-4">{formatCurrency(order.amount, order.currencyCode)}</td>
                            <td className="p-4">
                                <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="p-4">{order.orderedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}