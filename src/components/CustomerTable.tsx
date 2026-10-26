import { Customer } from "../types/customers";

interface CustomerTableProps {
    customers: Customer[];
}

export default function CustomerTable({
    customers,
}: CustomerTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="p-4">고객명</th>
                        <th className="p-4">주문 수</th>
                        <th className="p-4">총 구매 금액</th>
                        <th className="p-4">가입일</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer) => (
                        <tr
                            key={customer.id}
                            className="border-t border-slate-200"
                        >
                            <td className="p-4">{customer.name}</td>
                            <td className="p-4">{customer.orderCount}건</td>
                            <td className="p-4">{customer.totalSpent.toLocaleString("ko-KR")}원</td>
                            <td className="p-4">{customer.joinedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}