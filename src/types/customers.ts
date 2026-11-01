export interface Customer {
    id: string;
    name: string;
    orderCount: number;
    totalSpent: number;
    currencyCode:string;
    joinedAt: string;
}

export interface CustomersResponse{
    customers: Customer[];
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    repeatPurchaseRate: number;
}