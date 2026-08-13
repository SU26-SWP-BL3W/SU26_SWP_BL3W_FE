import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { School, BaseResponse, PagedResult } from "@/models/entities";

/** GET /api/Schools — Lấy danh sách trường học (cho Non-FPT profile) */
export function useGetSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<PagedResult<School>>>("/Schools", {
        params: { PageNumber: 1, PageSize: 100 },
      });
      return res.data.data?.data ?? [];
    },
    staleTime: 1000 * 60 * 10, // cache 10 phút
  });
}

/** POST /api/Schools — Tạo trường mới (Admin) */
export function useCreateSchool() {
  return useMutation({
    mutationFn: async (data: { schoolName: string; address?: string }) => {
      const res = await apiClient.post("/Schools", data);
      return res.data;
    },
  });
}
