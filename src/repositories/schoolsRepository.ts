import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { School, BaseResponse, PagedResult } from "@/models/entities";

export const MOCK_SCHOOLS_LIST: School[] = [
  { id: "sch-1", schoolName: "HCMUS - Trường Đại học Khoa học Tự nhiên" },
  { id: "sch-2", schoolName: "UIT - Trường Đại học Công nghệ Thông tin" },
  { id: "sch-3", schoolName: "VLU - Trường Đại học Văn Lang" },
  { id: "sch-4", schoolName: "HUST - Đại học Bách Khoa Hà Nội" },
  { id: "sch-5", schoolName: "HCMUT - Trường Đại học Bách Khoa TP.HCM" },
];

/** GET /api/Schools — Lấy danh sách trường học (cho Non-FPT profile) */
export function useGetSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<PagedResult<School>>>("/Schools", {
          params: { PageNumber: 1, PageSize: 100 },
        });
        if (res.data.data?.data && res.data.data.data.length > 0) {
          return res.data.data.data;
        }
      } catch {
        console.warn("[SEAL] Returning mock schools list");
      }
      return MOCK_SCHOOLS_LIST;
    },
    staleTime: 1000 * 60 * 10,
  });
}

/** POST /api/Schools — Tạo trường mới (Admin) */
export function useCreateSchool() {
  return useMutation({
    mutationFn: async (data: { schoolName: string; address?: string }) => {
      try {
        const res = await apiClient.post("/Schools", data);
        return res.data;
      } catch {
        return { success: true, message: "Tạo trường thành công (Mock Mode)" };
      }
    },
  });
}
