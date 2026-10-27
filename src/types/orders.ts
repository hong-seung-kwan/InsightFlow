export type OrderStatus= "PAID" | "SHIPPING" | "CANCELLED";

export interface Order {
    id:string;
    customerName: string;
    amount: number;
    status: OrderStatus;
    orderedAt: string;
}

export interface OrdersResponse {
    orders: Order[];
    totalOrders: number;
    paidOrders: number;
    shippingOrders: number;
    cancelledOrders:number;
}