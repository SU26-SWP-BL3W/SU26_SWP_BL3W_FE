import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { School, BaseResponse, PagedResult } from "@/models/entities";

export const MOCK_SCHOOLS_LIST: School[] = [
  {
    id: "sch-01",
    schoolId: "sch-01",
    schoolName: "Đại học FPT HCM (FPTU)",
    code: "FPTU_HCM",
    address: "Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh",
  },
  {
    id: "sch-02",
    schoolId: "sch-02",
    schoolName: "Đại học Bách Khoa HCM (HCMUT)",
    code: "HCMUT",
    address: "268 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh",
  },
  {
    id: "sch-03",
    schoolId: "sch-03",
    schoolName: "Đại học Khoa học Tự nhiên (HCMUS)",
    code: "HCMUS",
    address: "227 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
  },
  {
    id: "sch-04",
    schoolId: "sch-04",
    schoolName: "Đại học Công Nghệ Thông Tin (UIT)",
    code: "UIT",
    address: "Khu phố 6, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh",
  },
  {
    id: "sch-05",
    schoolId: "sch-05",
    schoolName: "Đại học Văn Lang (VLU)",
    code: "VLU",
    address: "69/68 Đặng Thùy Trâm, Q. Bình Thạnh, TP. Hồ Chí Minh",
  },
  {
    id: "sch-06",
    schoolId: "sch-06",
    schoolName: "Đại học Bách Khoa Hà Nội (HUST)",
    code: "HUST",
    address: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
  },
];

/** GET /api/Schools — Lấy danh sách trường học */
export function useGetSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<PagedResult<School>>>("/Schools", {
          params: { PageNumber: 1, PageSize: 100 },
        });
        if (res.data?.data?.data && res.data.data.data.length > 0) {
          return res.data.data.data;
        }
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      } catch {
        console.warn("[SEAL] Returning mock schools list");
      }
      return MOCK_SCHOOLS_LIST;
    },
    staleTime: 1000 * 60 * 10,
  });
}

/** GET /api/Schools/with-user-count — Lấy danh sách trường học kèm số lượng sinh viên */
export function useGetSchoolsWithUserCount() {
  return useQuery({
    queryKey: ["schools-with-user-count"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<any[]>>("/Schools/with-user-count");
        if (res.data?.data && Array.isArray(res.data.data)) {
          return res.data.data;
        }
        if (Array.isArray(res.data)) {
          return res.data;
        }
      } catch (err) {
        console.warn("[SEAL] Failed to fetch schools with user count, falling back to /Schools");
      }
      const fallbackRes = await apiClient.get<BaseResponse<PagedResult<School>>>("/Schools", {
        params: { PageNumber: 1, PageSize: 100 },
      });
      return fallbackRes.data?.data?.data || MOCK_SCHOOLS_LIST;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/** POST /api/Schools — Tạo trường mới (Admin) */
export function useCreateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { schoolName: string; code?: string; address?: string }) => {
      const res = await apiClient.post("/Schools", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      queryClient.invalidateQueries({ queryKey: ["schools-with-user-count"] });
    },
  });
}

/** PUT /api/Schools/{id} — Cập nhật trường học (Admin) */
export function useUpdateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { schoolName: string; code?: string; address?: string } }) => {
      const res = await apiClient.put(`/Schools/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      queryClient.invalidateQueries({ queryKey: ["schools-with-user-count"] });
    },
  });
}

/** DELETE /api/Schools/{id} — Xóa trường học (Admin) */
export function useDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/Schools/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      queryClient.invalidateQueries({ queryKey: ["schools-with-user-count"] });
    },
  });
}
