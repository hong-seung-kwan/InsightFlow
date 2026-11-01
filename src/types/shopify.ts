export interface ShopifyOrder {
    id: string;
    name: string;
    createdAt: string;
    cancelledAt: string | null;
    displayFinancialStatus: string;
    displayFulfillmentStatus: string;
    customer: {
        firstName: string | null;
        lastName: string | null;
    } | null;
    totalPriceSet: {
        shopMoney: {
            amount: string;
            currencyCode: string;
        };
    };
}

export interface ShopifyOrdersResponse {
    orders: {
        nodes: ShopifyOrder[];
    };
}