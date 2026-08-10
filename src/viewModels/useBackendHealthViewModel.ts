"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5180/api";

// ViewModel — chứa toàn bộ state/logic của màn hình, View chỉ đọc data ra render.
// Gọi thẳng /health bằng axios trần (không qua models/apiClient) vì /health không
// nằm trong envelope BaseResponse mà apiClient tự động bóc.
export function useBackendHealthViewModel() {
  const query = useQuery({
    queryKey: ["scaffold-health"],
    queryFn: async () => {
      const { data } = await axios.get<{ status: string }>(
        `${API_URL.replace(/\/api$/, "")}/health`,
      );
      return data;
    },
    retry: 1,
  });

  return {
    apiUrl: API_URL,
    status: query.data?.status ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
