import { useQuery } from "@tanstack/react-query";
import { OrdersResponse } from "../types/orders";

export function useOrders() {
    return useQuery<OrdersResponse>({
        queryKey:["orders"],
        queryFn: async() => {
            const response = await fetch("/api/orders");

            if(!response.ok){
                throw new Error("주문 데이터 요청 실패");
            }

            return response.json();
        },
        staleTime: 1000 * 60,
    })
}