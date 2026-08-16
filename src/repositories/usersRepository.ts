import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { User, UserRejection, BaseResponse, PagedResult } from "@/models/entities";

export const DEFAULT_USERS_LIST: User[] = [];

// ─── Current User ────────────────────────────────────────────

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<User>>("/Users/profile");
      return res.data.data;
    },
    retry: false,
  });
}

// ─── User Profile ─────────────────────────────────────────────

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await apiClient.put<BaseResponse<User>>("/Auth/student-profiles", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
}

// ─── My Invitations (chuông thông báo) ───────────────────────
// GET /api/Users/my-invitations — gộp SẴN lời mời vào đội (TEAM) và lời mời
// vai trò sự kiện (EVENT_ROLE: Judge/Mentor/EventCoordinator) trong 1 lần
// gọi. Đây là endpoint ĐÚNG cho màn "Lời mời của tôi" — KHÔNG dùng
// /Teams/{teamId}/my-invitation (đó là API khác: BE bên đó bắt buộc biết
// trước teamId, chỉ dùng khi đã ở trong ngữ cảnh 1 đội cụ thể).

export type MyInvitationType = "TEAM" | "EVENT_ROLE";
export type MyInvitationStatus = "PendingAccept" | "Accepted" | "Declined";

export interface MyInvitationItem {
  invitationId: string;
  type: MyInvitationType;
  /** Tên đội (TEAM) hoặc tên sự kiện (EVENT_ROLE). */
  targetName: string;
  inviterName: string;
  role: string;
  /** Chỉ có với Judge/Mentor theo hạng mục; null với EC/lời mời đội. */
  trackName?: string | null;
  status: MyInvitationStatus;
  respondedAt?: string | null;
  expiresAt: string;
}

export interface MyInvitationsResponse {
  totalPending: number;
  invitations: MyInvitationItem[];
}

/** GET /api/Users/my-invitations — Lấy toàn bộ lời mời (đội + vai trò sự kiện) của user hiện tại */
export function useMyInvitations() {
  return useQuery({
    queryKey: ["my-invitations"],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<MyInvitationsResponse>>("/Users/my-invitations");
      return res.data.data ?? { totalPending: 0, invitations: [] };
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
        if (res.data?.data) return res.data.data;
      } catch {
        // Fallback
      }
      return [];
    },
    enabled: !!userId,
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
    // LUÔN trả PagedResult<User> (một kiểu duy nhất) để mọi consumer đọc .data đồng nhất.
    // Trước đây nhánh thành công trả thẳng mảng, các nhánh khác trả PagedResult -> lệch kiểu,
    // màn nào đọc .data mà quên phòng thủ Array.isArray sẽ ra rỗng dù API có dữ liệu.
    queryFn: async (): Promise<PagedResult<User>> => {
      const res = await apiClient.get<BaseResponse<PagedResult<User>>>("/Users", { params });
      const payload = res.data as unknown; // sau interceptor bóc BaseResponse = PagedResult
      const emptyPage: PagedResult<User> = {
        data: [],
        currentPage: 1,
        pageSize: 50,
        totalItems: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      if (payload && typeof payload === "object" && Array.isArray((payload as PagedResult<User>).data)) {
        return payload as PagedResult<User>;
      }
      if (Array.isArray(payload)) {
        const arr = payload as User[];
        return { ...emptyPage, data: arr, pageSize: arr.length, totalItems: arr.length };
      }
      return emptyPage;
    },
  });
}

/** POST /api/Users/{id}/approve — EC/Admin duyệt hồ sơ */
export function useApproveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiClient.post(`/Users/${userId}/approve`);
      return res.data;
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
    mutationFn: async (params: { userId: string; reason: string }) => {
      const res = await apiClient.post(`/Users/${params.userId}/reject`, {
        reason: params.reason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/** GET /api/FptStudents/{studentCode} — Xác minh SV FPT */
export function useFptStudentLookup(studentCode: string | null) {
  return useQuery({
    queryKey: ["fptStudent", studentCode],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/FptStudents/${studentCode}`);
        return res.data?.data ?? res.data;
      } catch (err: any) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/FptStudents/" + studentCode + " error:", err?.message);
        return null;
      }
    },
    enabled: !!studentCode && studentCode.length >= 5,
    retry: false,
  });
}

export const usersRepository = {
  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    try {
      const res = await apiClient.get<BaseResponse<PagedResult<User>>>("/Users");
      const list = res.data?.data?.data ?? [];
      const found = list.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase() || (u as any).Email?.toLowerCase() === email.toLowerCase()
      );
      if (found) return found;
    } catch (err: any) {
      console.warn("[SEAL BE-DATA MISSING] GET /api/Users error:", err?.message);
    }
    return null;
  },
};
