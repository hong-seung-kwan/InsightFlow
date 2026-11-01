
import type { Order, OrderStatus } from "@/src/types/orders";

export interface DemoCustomer {
    id: string;
    name: string;
    joinedAt: string;
}

export const demoCustomers: DemoCustomer[] = [
    { id: "C001", name: "김민준", joinedAt: "2026-08-10" },
    { id: "C002", name: "이서연", joinedAt: "2026-08-15" },
    { id: "C003", name: "박지훈", joinedAt: "2026-09-02" },
    { id: "C004", name: "최유진", joinedAt: "2026-09-12" },
    { id: "C005", name: "정하늘", joinedAt: "2026-09-25" },
    { id: "C006", name: "한지우", joinedAt: "2026-10-03" },
    { id: "C007", name: "윤도현", joinedAt: "2026-10-08" },
    { id: "C008", name: "강수빈", joinedAt: "2026-10-15" },
    { id: "C009", name: "임서준", joinedAt: "2026-10-21" },
    { id: "C010", name: "오하린", joinedAt: "2026-10-26" },
];

// 고객별 주문 횟수에 차이를 주기 위한 가중치
const customerWeights = [
    8, 7, 6, 5, 4, 4, 3, 2, 1, 1
];

// 주문 상태를 다양하게 분산
const statuses: OrderStatus[] = [
    "PAID",
    "FULFILLED",
    "PAID",
    "PARTIALLY_FULFILLED",
    "FULFILLED",
    "PENDING",
    "PAID",
    "CANCELLED",
];

// 현재 날짜를 UTC 기준으로 정규화
const today = new Date();
today.setUTCHours(12, 0, 0, 0);

export const demoOrders: Order[] = Array.from(
    { length: 50 },
    (_, index) => {
        // 고객 선택에 가중치 적용
        const weightedCustomers = demoCustomers.flatMap(
            (customer, customerIndex) =>
                Array(customerWeights[customerIndex]).fill(customer)
        );

        const customer =
            weightedCustomers[(index * 17) % weightedCustomers.length];

        // 최근 60일 내 주문 날짜 생성
        const date = new Date(today);
        date.setUTCDate(
            date.getUTCDate() - ((index * 13) % 60)
        );

        // 고객 가입일보다 이전이면 가입일로 보정
        const joinedAt = new Date(`${customer.joinedAt}T12:00:00Z`);

        if (date < joinedAt) {
            date.setTime(joinedAt.getTime());
        }

        return {
            id: `#${2001 + index}`,
            customerName: customer.name,
            amount: 30 + ((index * 137) % 970),
            currencyCode: "USD",
            status: statuses[(index * 3 + Math.floor(index / 5)) % statuses.length],
            orderedAt: date.toISOString().slice(0, 10),
        };
    }
);
