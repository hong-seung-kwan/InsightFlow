import { useQuery } from "@tanstack/react-query";
import { CustomersResponse } from "../types/customers";

export function useCustomers() {
    return useQuery<CustomersResponse>({
        queryKey: ["customers"],

        queryFn: async () => {
            const response = await fetch("/api/customers");

            if(!response.ok){
                throw new Error("고객 데이터 요청 실패");
            }

            return response.json();
        },

        staleTime: 1000 * 60,
    })
}