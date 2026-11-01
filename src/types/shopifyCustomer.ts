export interface ShopifyCustomer {
    id:string;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
    numberOfOrders: string;
    amountSpent: {
        amount: string;
        currencyCode:string;
    }
}

export interface ShopifyCustomersResponse {
    customers: {
        nodes: ShopifyCustomer[];
    }
}