type ShopifyTokenResponse = {
    access_token: string;
    expires_in: number;
    scope: string;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getShopifyAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const shop = process.env.SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!shop || !clientId || !clientSecret) {
        throw new Error("Shopify 환경변수가 없습니다.");
    }

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
        throw new Error("Shopify Access Token 발급 실패");
    }

    const data: ShopifyTokenResponse = await response.json();

    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return cachedToken;
}

export async function shopifyGraphQL<T>(
    query: string
): Promise<T> {
    const shop = process.env.SHOPIFY_STORE_DOMAIN;
    if (!shop) {
        throw new Error("Shopify 스토어 도메인이 없습니다.");
    }

    const accessToken = await getShopifyAccessToken();

    const response = await fetch(
        `https://${shop}/admin/api/2026-10/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({ query }),
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(`Shopify API 요청 실패: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(
            `Shopify GraphQL 오류: ${JSON.stringify(result.errors)}`
        );
    }

    return result.data as T;
}