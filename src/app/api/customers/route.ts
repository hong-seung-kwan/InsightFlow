import type { Customer } from "@/src/types/customers";

const customers: Customer[] = [
    {
        id: 1,
        name: "김민수",
        orderCount: 12,
        totalSpent: 1250000,
        joinedAt: "2026-10-01",
    },
    {
        id: 2,
        name: "이지은",
        orderCount: 8,
        totalSpent: 780000,
        joinedAt: "2026-10-05",
    },
    {
        id: 3,
        name: "박서준",
        orderCount: 3,
        totalSpent: 245000,
        joinedAt: "2026-10-10",
    },
    {
        id: 4,
        name: "최유진",
        orderCount: 1,
        totalSpent: 89000,
        joinedAt: "2026-10-15",
    },
];

export async function GET() {
    
    return Response.json({
      customers: customers,
      totalCustomers: 1250,
      newCustomers: 320,
      repeatCustomers: 410,
      repeatPurchaseRate: 32.8,  
    })

}