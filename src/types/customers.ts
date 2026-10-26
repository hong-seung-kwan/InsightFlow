export interface Customer {
    id: number;
    name: string;
    orderCount: number;
    totalSpent: number;
    joinedAt: string;
}

export interface CustomersResponse{
    customers: Customer[];
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    repeatPurchaseRate: number;
}