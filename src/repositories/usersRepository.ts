import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { User, UserRejection, BaseResponse, PagedResult } from "@/models/entities";

export const MOCK_PENDING_USERS: User[] = [
  {
    id: "usr-nonfpt-01",
    email: "an.tran@hcmus.edu.vn",
    fullName: "Trần Văn An",
    studentCode: "20120001",
    schoolName: "HCMUS - Trường Đại học Khoa học Tự nhiên",
    isApproved: false,
    isRejected: false,
    isFpt: false,
    isStudent: true,
    studentCardPhotoUrl: "https://s3.cloudfly.vn/seal-bucket/cards/card-an-hcmus.jpg",
    createdTime: "2026-08-10T10:00:00Z",
  },
  {
    id: "usr-nonfpt-02",
    email: "binh.nguyen@vlu.edu.vn",
    fullName: "Nguyễn Thị Bình",
    studentCode: "21700102",
    schoolName: "VLU - Trường Đại học Văn Lang",
    isApproved: false,
    isRejected: false,
    isFpt: false,
    isStudent: true,
    studentCardPhotoUrl: "https://s3.cloudfly.vn/seal-bucket/cards/card-binh-vlu.jpg",
    createdTime: "2026-08-11T14:30:00Z",
  },
  {
    id: "usr-nonfpt-03",
    email: "cuong.le@uit.edu.vn",
    fullName: "Lê Hoàng Cường",
    studentCode: "20520303",
    schoolName: "UIT - Trường Đại học Công nghệ Thông tin",
    isApproved: false,
    isRejected: false,
    isFpt: false,
    isStudent: true,
    studentCardPhotoUrl: "https://s3.cloudfly.vn/seal-bucket/cards/card-cuong-uit.jpg",
    createdTime: "2026-08-12T09:15:00Z",
  },
];

// ─── Current User ────────────────────────────────────────────

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<User>>("/Users/me");
        return res.data.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });
}

// ─── User Profile ─────────────────────────────────────────────

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      try {
        const res = await apiClient.put<BaseResponse<User>>("/Auth/student-profiles", data);
        return res.data.data;
      } catch {
        return data as User;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
}

// ─── User Rejections ─────────────────────────────────────────

/** GET /api/UserRejections/user/{userId} — Lấy lịch sử từ chối hồ sơ */
export function useGetUserRejections(userId: string | undefined) {
  return useQuery({
    queryKey: ["userRejections", userId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<UserRejection[]>>(
          `/UserRejections/user/${userId}`
        );
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch {
        console.warn("[SEAL] Returning mock user rejections");
      }

      return [
        {
          id: "rej-1",
          userId: userId || "usr-locked-99",
          rejectedBy: "EC. Phúc HNV",
          reason: "Ảnh thẻ sinh viên bị mờ, không hiển thị rõ họ tên và mã số SV.",
          createdTime: "2026-08-01",
        },
        {
          id: "rej-2",
          userId: userId || "usr-locked-99",
          rejectedBy: "EC. Phúc HNV",
          reason: "Ảnh tải lên không phải thẻ sinh viên hợp lệ. Hồ sơ tạm bị khóa.",
          createdTime: "2026-08-03",
        },
      ];
    },
    enabled: true,
  });
}

// ─── Admin / Coordinator Actions ─────────────────────────────

/** GET /api/Users — Lấy danh sách users (có thể lọc) */
export function useGetUsers(params?: {
  isApproved?: boolean;
  isRejected?: boolean;
  pageNumber?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<PagedResult<User>>>("/Users", { params });
        if (res.data?.data?.data && res.data.data.data.length > 0) {
          return res.data.data;
        }
      } catch {
        console.warn("[SEAL] Returning mock pending users list");
      }

      return {
        data: MOCK_PENDING_USERS,
        currentPage: 1,
        pageSize: 10,
        totalItems: MOCK_PENDING_USERS.length,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    },
  });
}

/** POST /api/Users/{id}/approve — EC/Admin duyệt hồ sơ */
export function useApproveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        const res = await apiClient.post<BaseResponse<boolean>>(`/Users/${userId}/approve`);
        return res.data;
      } catch {
        return { success: true, message: "Duyệt hồ sơ thành công (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/** POST /api/Users/{id}/reject — EC/Admin từ chối hồ sơ (với lý do) */
export function useRejectUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      try {
        const res = await apiClient.post<BaseResponse<boolean>>(`/Users/${userId}/reject`, {
          reason,
        });
        return res.data;
      } catch {
        return { success: true, message: "Từ chối hồ sơ thành công (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// ─── FPT Student Lookup ──────────────────────────────────────

/** GET /api/fpt-mock/students/{studentCode} — Xác minh SV FPT (GET query) */
export function useFptStudentLookup(studentCode: string | null) {
  return useQuery({
    queryKey: ["fptStudent", studentCode],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>(`/fpt-mock/students/${studentCode}`);
        return res.data?.data ?? res.data;
      } catch {
        console.warn("[SEAL] Returning mock FPT student lookup");
        return {
          studentCode: studentCode || "SE170123",
          fullName: "Nguyễn Văn A (FPT Student)",
          campus: "FPT University HCMC",
          major: "Kỹ Thuật Phần Mềm",
          isFpt: true,
          isValid: true,
        };
      }
    },
    enabled: !!studentCode && studentCode.length >= 5,
    retry: false,
  });
}
