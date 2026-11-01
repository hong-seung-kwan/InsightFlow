export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "FULFILLED"
    | "PARTIALLY_FULFILLED"
    | "CANCELLED";

export interface Order {
    id: string;
    customerName: string;
    amount: number;
    currencyCode: string;
    status: OrderStatus;
    orderedAt: string;
}

export interface OrdersResponse {
    orders: Order[];
    totalOrders: number;
    paidOrders: number;
    shippingOrders: number;
    cancelledOrders: number;
}