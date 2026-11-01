import { demoCustomers, demoOrders } from "@/src/lib/demoData";
import { shopifyGraphQL } from "@/src/lib/shopify";
import type { Customer } from "@/src/types/customers";
import { ShopifyCustomer, ShopifyCustomersResponse } from "@/src/types/shopifyCustomer";

function mapShopifyCustomer(customer: ShopifyCustomer): Customer {
    const firstName = customer.firstName ?? "";
    const lastName = customer.lastName ?? "";

    return {
        id: customer.id,
        name: `${firstName} ${lastName}`.trim() || "이름 없음",
        orderCount: Number(customer.numberOfOrders),
        totalSpent: Number(customer.amountSpent.amount),
        currencyCode: customer.amountSpent.currencyCode,
        joinedAt: customer.createdAt.slice(0, 10),
    }
}

function createCustomersResponse(customers: Customer[]) {
    const totalCustomers = customers.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

    const newCustomers = customers.filter(
        (customer) => new Date(customer.joinedAt) >= thirtyDaysAgo
    ).length;

    const repeatCustomers = customers.filter(
        (customer) => customer.orderCount >= 2
    ).length;

    const repeatPurchaseRate =
        totalCustomers > 0
            ? Number(
                ((repeatCustomers / totalCustomers) * 100).toFixed(1)
            )
            : 0;

    return {
        customers,
        totalCustomers,
        newCustomers,
        repeatCustomers,
        repeatPurchaseRate,
    };
}

function getDemoCustomers(): Customer[] {
    return demoCustomers.map((customer) => {
        const customerOrders = demoOrders.filter(
            (order) =>
                order.customerName === customer.name &&
                order.status !== "CANCELLED"
        );

        const paidOrders = customerOrders.filter(
            (order) =>
                order.status === "PAID" ||
                order.status === "FULFILLED" ||
                order.status === "PARTIALLY_FULFILLED"
        );

        const totalSpent = paidOrders.reduce(
            (sum, order) => sum + order.amount,
            0
        );

        return {
            id: customer.id,
            name: customer.name,
            orderCount: customerOrders.length,
            totalSpent,
            currencyCode: "USD",
            joinedAt: customer.joinedAt,
        };
    });
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
        const customers = getDemoCustomers();

        return Response.json(createCustomersResponse(customers));
    }

    try {
        const query = `
            query {
                customers(first: 50) {
                    nodes {
                        id
                        firstName
                        lastName
                        createdAt
                        numberOfOrders
                        amountSpent {
                            amount
                            currencyCode
                        }
                    }
                }
            }
        `;

        const data = await shopifyGraphQL<ShopifyCustomersResponse>(query);

        const customers: Customer[] =
            data.customers.nodes.map(mapShopifyCustomer);

        return Response.json(createCustomersResponse(customers));
    } catch (error) {
        console.error("Shopify 고객 조회 오류:", error);

        return Response.json(
            { message: "고객 데이터를 불러오지 못했습니다." },
            { status: 500 }
        );
    }
}