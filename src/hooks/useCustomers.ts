import { useQuery } from "@tanstack/react-query";
import type { CustomersResponse } from "../types/customers";
import type { DataMode } from "../contexts/DataModeContext";

export function useCustomers(mode: DataMode) {
    return useQuery<CustomersResponse>({
        queryKey: ["customers", mode],

        queryFn: async () => {
            const response = await fetch(`/api/customers?mode=${mode}`);

            if(!response.ok){
                throw new Error("고객 데이터 요청 실패");
            }

            return response.json();
        },

        staleTime: 1000 * 60,
    })
}