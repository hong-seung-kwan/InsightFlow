import { generateDemoAnalytics } from "@/src/lib/demoAnalytics";
import { shopifyGraphQL } from "@/src/lib/shopify";

type Period = "7d" | "30d" | "90d";

interface ShopifyOrder {
    id: string;
    createdAt: string;
    cancelledAt: string | null;
    displayFinancialStatus: string;
    totalPriceSet: {
        shopMoney: {
            amount: string;
            currencyCode: string;
        };
    };
}

interface ShopifyOrdersResponse {
    orders: {
        nodes: ShopifyOrder[];
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
        };
    };
}

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function getStartDate(daysAgo: number) {
    const date = new Date();

    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - daysAgo);

    return date;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const period = searchParams.get("period") ?? "7d";

    if (period !== "7d" && period !== "30d" && period !== "90d") {
        return Response.json(
            { message: "지원하지 않는 기간입니다." },
            { status: 400 }
        );
    }

    const mode = searchParams.get("mode") ?? "shopify";

    if (mode !== "shopify" && mode !== "demo") {
        return Response.json(
            {message : "지원하지 않는 데이터 모드입니다."},
            {status: 400}
        );
    }

    if (mode === "demo") {
        return Response.json(generateDemoAnalytics(period));
    }

    try {
        const days = Number(period.replace("d", ""));

        // 현재 기간과 이전 기간을 모두 포함하는 시작일
        const startDate = getStartDate(days * 2 - 1);

        const orders: ShopifyOrder[] = [];
        let cursor: string | null = null;

        // Shopify GraphQL 커서 기반 페이지네이션
        do {
            const after: string = cursor
                ? `, after: ${JSON.stringify(cursor)}`
                : "";

            const query: string = `
        query {
            orders(
                first: 100
                sortKey: CREATED_AT
                reverse: false
                query: "created_at:>=${formatDate(startDate)}"
                ${after}
            ) {
                nodes {
                    id
                    createdAt
                    cancelledAt
                    displayFinancialStatus
                    totalPriceSet {
                        shopMoney {
                            amount
                            currencyCode
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `;

            const data: ShopifyOrdersResponse =
                await shopifyGraphQL<ShopifyOrdersResponse>(query);

            orders.push(...data.orders.nodes);

            cursor = data.orders.pageInfo.hasNextPage
                ? data.orders.pageInfo.endCursor
                : null;

        } while (cursor);

        // 결제 완료 및 취소되지 않은 주문
        const paidOrders = orders.filter(
            (order) =>
                !order.cancelledAt &&
                order.displayFinancialStatus === "PAID"
        );

        // 날짜별 매출 집계
        const revenueByDate = new Map<string, number>();

        for (const order of paidOrders) {
            const date = order.createdAt.slice(0, 10);
            const revenue = Number(
                order.totalPriceSet.shopMoney.amount
            );

            revenueByDate.set(
                date,
                (revenueByDate.get(date) ?? 0) + revenue
            );
        }

        // 현재 기간과 이전 기간의 일별 데이터 생성
        const sales = [];
        const previousSales = [];

        for (let i = 0; i < days; i++) {
            const currentDate = getStartDate(days - 1 - i);
            const previousDate = getStartDate(days * 2 - 1 - i);

            const currentKey = formatDate(currentDate);
            const previousKey = formatDate(previousDate);

            sales.push({
                date: currentKey,
                revenue: revenueByDate.get(currentKey) ?? 0,
            });

            previousSales.push({
                date: previousKey,
                revenue: revenueByDate.get(previousKey) ?? 0,
            });
        }

        const previousTotalRevenue = previousSales.reduce(
            (sum, item) => sum + item.revenue,
            0
        );

        return Response.json({
            period,
            sales,
            previousSales,
            previousTotalRevenue,
            currencyCode:
                paidOrders[0]?.totalPriceSet.shopMoney.currencyCode ?? "USD",
        });
    } catch (error) {
        console.error("Shopify 매출 분석 오류:", error);

        return Response.json(
            { message: "매출 분석 데이터를 불러오지 못했습니다." },
            { status: 500 }
        );
    }
}