import type { Order } from "@/src/types/orders";

const orders: Order[] = [
    {
        id: "ORD-001",
        customerName: "김민수",
        amount: 125000,
        status: "PAID",
        orderedAt: "2026-10-25",
    },
    {
        id: "ORD-002",
        customerName: "이지은",
        amount: 89000,
        status: "SHIPPING",
        orderedAt: "2026-10-24",
    },
    {
        id: "ORD-003",
        customerName: "박서준",
        amount: 210000,
        status: "CANCELLED",
        orderedAt: "2026-10-23",
    },
    {
        id: "ORD-004",
        customerName: "최유진",
        amount: 45000,
        status: "PAID",
        orderedAt: "2026-10-22",
    },
    {
        id: "ORD-005",
        customerName: "정현우",
        amount: 320000,
        status: "SHIPPING",
        orderedAt: "2026-10-21",
    },
    {
        id: "ORD-006",
        customerName: "한지민",
        amount: 78000,
        status: "PAID",
        orderedAt: "2026-10-20",
    },
    {
        id: "ORD-007",
        customerName: "오세훈",
        amount: 159000,
        status: "CANCELLED",
        orderedAt: "2026-10-19",
    },
    {
        id: "ORD-008",
        customerName: "강수빈",
        amount: 56000,
        status: "SHIPPING",
        orderedAt: "2026-10-18",
    },
    {
        id: "ORD-009",
        customerName: "윤도현",
        amount: 430000,
        status: "PAID",
        orderedAt: "2026-10-17",
    },
    {
        id: "ORD-010",
        customerName: "송하윤",
        amount: 99000,
        status: "SHIPPING",
        orderedAt: "2026-10-16",
    },
    {
        id: "ORD-011",
        customerName: "임재현",
        amount: 185000,
        status: "PAID",
        orderedAt: "2026-10-15",
    },
    {
        id: "ORD-012",
        customerName: "배지수",
        amount: 67000,
        status: "CANCELLED",
        orderedAt: "2026-10-14",
    },
    {
        id: "ORD-013",
        customerName: "신동욱",
        amount: 275000,
        status: "SHIPPING",
        orderedAt: "2026-10-13",
    },
    {
        id: "ORD-014",
        customerName: "문채원",
        amount: 112000,
        status: "PAID",
        orderedAt: "2026-10-12",
    },
    {
        id: "ORD-015",
        customerName: "조민재",
        amount: 39000,
        status: "PAID",
        orderedAt: "2026-10-11",
    },
];

export async function GET() {
    return Response.json({
        orders,
        totalOrders: orders.length,
        paidOrders: orders.filter(
            (order) => order.status === "PAID"
        ).length,
        shippingOrders: orders.filter(
            (order) => order.status === "SHIPPING"
        ).length,
        cancelledOrders: orders.filter(
            (order) => order.status === "CANCELLED"
        ).length,
    });
}