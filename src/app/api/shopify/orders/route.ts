import { NextResponse } from "next/server";

export async function GET() {
    const shop = process.env.SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!shop || !clientId || !clientSecret) {
        return NextResponse.json(
            { message: "Shopify 환경변수가 없습니다." },
            { status: 500 }
        );
    }
    try {
        const tokenResponse = await fetch(
            `https://${shop}/admin/oauth/access_token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "client_credentials",
                    client_id: clientId,
                    client_secret: clientSecret,
                }),
                cache: "no-store",
            }
        );
        if (!tokenResponse.ok) {
            throw new Error("Shopify 인증 실패");
        }

        const { access_token } = await tokenResponse.json();

        const query = `
            query {
                orders(first: 5) {
                    nodes {
                        id
                        name
                        createdAt
                        displayFinancialStatus
                        displayFulfillmentStatus
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

        const response = await fetch(
            `https://${shop}/admin/api/2026-10/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": access_token,
                },
                body: JSON.stringify({query}),
                cache: "no-store",
            }
        )

        if(!response.ok) {
            throw new Error("Shopify 주문 조회 실패");
        }

        const result = await response.json()

        if(result.errors) {
            return NextResponse.json(
                {message: "GraphQL 오류", errors:result.errors},
                {status: 502}
            );
        }

        return NextResponse.json(result.data.orders.nodes);
    } catch (error) {
        console.error("Shopify API 오류:", error);

        return NextResponse.json(
            {message: "주문 데이터를 불러오지 못했습니다."},
            {status: 500}
        )
    }
}