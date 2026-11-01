import { useQuery } from "@tanstack/react-query";
import { OrdersResponse } from "../types/orders";

export type OrdersMode = "shopify" | "demo";

export function useOrders(mode: OrdersMode = "shopify") {
    return useQuery<OrdersResponse>({
        queryKey:["orders", mode],
        queryFn: async() => {
            const response = await fetch(`/api/orders?mode=${mode}`);

            if(!response.ok){
                throw new Error("주문 데이터 요청 실패");
            }

            return response.json();
        },
        staleTime: 1000 * 60,
    })
}