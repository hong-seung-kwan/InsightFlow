import { NextResponse } from "next/server";

export async function GET() {
    const shop = process.env.SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!shop || !clientId || !clientSecret) {
        return NextResponse.json(
            { message: "Shopify 환경변수가 설정되지 않았습니다." },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
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

        if (!response.ok) {
            return NextResponse.json(
                { message: "Shopify 인증 요청에 실패했습니다." },
                { status: 502 }
            );
        }

        const tokenData = await response.json();

        return NextResponse.json({
            success: true,
            message: "Shopify 인증 성공!",
            scopes: tokenData.scope,
        });
    } catch {
        return NextResponse.json(
            { message: "Shopify 서버 연결 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}