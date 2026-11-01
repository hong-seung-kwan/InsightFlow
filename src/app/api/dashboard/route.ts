import { demoOrders } from "@/src/lib/demoData";
import { shopifyGraphQL } from "@/src/lib/shopify";

interface ShopifyDashboardOrder {
    id: string;
    cancelledAt: string | null;
    displayFinancialStatus: string;
    totalPriceSet: {
        shopMoney: {
            amount: string;
            currencyCode: string;
        };
    };
}

interface ShopifyDashboardResponse {
    orders: {
        nodes: ShopifyDashboardOrder[];
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") ?? "demo";

    if (mode !== "shopify" && mode !== "demo") {
        return Response.json(
            { message: "지원하지 않는 모드입니다." },
            { status: 400 }
        )
    }

    if (mode === "demo") {
        const paidOrders = demoOrders.filter(
            (order) =>
                order.status === "PAID" ||
                order.status === "FULFILLED" ||
                order.status === "PARTIALLY_FULFILLED"
        )

        const totalRevenue = paidOrders.reduce(
            (sum, order) => sum + order.amount,
            0
        )

        const totalOrders = demoOrders.length;

        const demoVisits = 5000;

        const conversionRate =
            (totalOrders / demoVisits) * 100;
            
        return Response.json([
            {
                id: "revenue",
                title: "총매출",
                value: totalRevenue,
                currencyCode: "USD",
            },
            {
                id: "orders",
                title: "주문 수",
                value: totalOrders,
            },
            {
                id: "visits",
                title: "방문 세션",
                value: demoVisits,
            },
            {
                id: "conversion",
                title: "전환율",
                value: Number(conversionRate.toFixed(2)),
            },
        ]);
    }
    try {
        const query = `
            query {
                orders(first: 50) {
                    nodes {
                        id
                        cancelledAt
                        displayFinancialStatus
                        totalPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
            }
        `;

        const data =
            await shopifyGraphQL<ShopifyDashboardResponse>(query);

        const orders = data.orders.nodes;

        // 취소되지 않은 결제 완료 주문
        const paidOrders = orders.filter(
            (order) =>
                !order.cancelledAt &&
                order.displayFinancialStatus === "PAID"
        );

        // 결제 완료 주문 금액 합산
        const totalRevenue = paidOrders.reduce(
            (sum, order) =>
                sum + Number(order.totalPriceSet.shopMoney.amount),
            0
        );

        const kpiData = [
            {
                id: "revenue",
                title: "총매출",
                value: totalRevenue,
                currencyCode: paidOrders[0]?.totalPriceSet.shopMoney.currencyCode ?? "USD",
            },
            {
                id: "orders",
                title: "주문 수",
                value: orders.length,
            },
            {
                id: "visits",
                title: "방문 세션",
                value: null,
            },
            {
                id: "conversion",
                title: "전환율",
                value: null,
            },
        ];

        return Response.json(kpiData);
    } catch (error) {
        console.error("Shopify 대시보드 조회 오류:", error);

        return Response.json(
            { message: "대시보드 데이터를 불러오지 못했습니다." },
            { status: 500 }
        );
    }
}