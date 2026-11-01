import { demoOrders } from "@/src/lib/demoData";
import { shopifyGraphQL } from "@/src/lib/shopify";
import type { Order, OrderStatus } from "@/src/types/orders";
import type {
    ShopifyOrder,
    ShopifyOrdersResponse,
} from "@/src/types/shopify";

function mapOrderStatus(order: ShopifyOrder): OrderStatus {
    if (order.cancelledAt) {
        return "CANCELLED";
    }

    if (order.displayFinancialStatus !== "PAID") {
        return "PENDING";
    }

    if (order.displayFulfillmentStatus === "FULFILLED") {
        return "FULFILLED";
    }

    if (order.displayFulfillmentStatus === "PARTIALLY_FULFILLED") {
        return "PARTIALLY_FULFILLED";
    }

    return "PAID";
}


function mapShopifyOrder(order: ShopifyOrder): Order {
    const firstName = order.customer?.firstName ?? "";
    const lastName = order.customer?.lastName ?? "";

    return {
        id: order.name,
        customerName:
            `${firstName} ${lastName}`.trim() || "고객 정보 없음",
        amount: Number(order.totalPriceSet.shopMoney.amount),
        currencyCode: order.totalPriceSet.shopMoney.currencyCode,
        status: mapOrderStatus(order),
        orderedAt: order.createdAt.slice(0, 10),
    };
}

function createOrdersResponse(orders: Order[]) {
    return {
        orders,
        totalOrders: orders.length,
        pendingOrders: orders.filter(
            (order) => order.status === "PENDING"
        ).length,
        paidOrders: orders.filter(
            (order) => order.status === "PAID"
        ).length,
        shippingOrders: orders.filter(
            (order) =>
                order.status === "FULFILLED" ||
                order.status === "PARTIALLY_FULFILLED"
        ).length,
        cancelledOrders: orders.filter(
            (order) => order.status === "CANCELLED"
        ).length,
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get("mode") ?? "shopify";

    if (mode !== "shopify" && mode !== "demo") {
        return Response.json(
            { message: "지원하지 않는 모드입니다." },
            { status: 400 }
        )
    }

    if (mode === "demo") {
        return Response.json(createOrdersResponse(demoOrders));
    }

    try {
        const query = `
            query {
                orders(first: 50, sortKey: CREATED_AT, reverse: true) {
                    nodes {
                        id
                        name
                        createdAt
                        cancelledAt
                        displayFinancialStatus
                        displayFulfillmentStatus
                        customer {
                            firstName
                            lastName
                        }
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
            await shopifyGraphQL<ShopifyOrdersResponse>(query);

        const orders: Order[] =
            data.orders.nodes.map(mapShopifyOrder);

        return Response.json(createOrdersResponse(orders));
    } catch (error) {
        console.error("Shopify 주문 조회 오류:", error);

        return Response.json(
            { message: "주문 데이터를 불러오지 못했습니다." },
            { status: 500 }
        );
    }
}