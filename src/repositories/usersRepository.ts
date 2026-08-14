import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { User, UserRejection, BaseResponse, PagedResult } from "@/models/entities";

export const MOCK_USERS_LIST: User[] = [
  {
    id: "usr-admin-01",
    email: "admin.system@seal.edu.vn",
    fullName: "Quản Trị Viên (System Admin)",
    isAdmin: true,
    isApproved: true,
    isFpt: true,
    isStudent: false,
    schoolName: "Đại học FPT HCM",
    createdTime: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-ec-01",
    email: "ec.coordinator@seal.edu.vn",
    fullName: "Điều Phối Viên (Event Coordinator)",
    isAdmin: false,
    isApproved: true,
    isFpt: true,
    isStudent: false,
    schoolName: "Đại học FPT HCM",
    createdTime: "2026-01-05T00:00:00Z",
  },
  {
    id: "usr-judge-01",
    email: "judge.ai@seal.edu.vn",
    fullName: "TS. Giám Khảo AI",
    isAdmin: false,
    isApproved: true,
    isFpt: false,
    isStudent: false,
    schoolName: "Đại học Bách Khoa HCM (HCMUT)",
    createdTime: "2026-02-10T00:00:00Z",
  },
  {
    id: "usr-mentor-01",
    email: "mentor.cybershield@seal.edu.vn",
    fullName: "ThS. Cố Vấn Chuyên Môn",
    isAdmin: false,
    isApproved: true,
    isFpt: true,
    isStudent: false,
    schoolName: "Đại học FPT Hà Nội",
    createdTime: "2026-02-12T00:00:00Z",
  },
  {
    id: "usr-leader-01",
    email: "leader.cybershield@fpt.edu.vn",
    fullName: "Trần Minh Quân (Leader CyberShield)",
    studentCode: "SE170123",
    isAdmin: false,
    isApproved: true,
    isFpt: true,
    isStudent: true,
    schoolName: "Đại học FPT HCM",
    createdTime: "2026-03-01T00:00:00Z",
  },
  {
    id: "usr-member-02",
    email: "member.cybershield@fpt.edu.vn",
    fullName: "Nguyễn Hoàng Nam (Member CyberShield)",
    studentCode: "SE170456",
    isAdmin: false,
    isApproved: true,
    isFpt: true,
    isStudent: true,
    schoolName: "Đại học FPT HCM",
    createdTime: "2026-03-02T00:00:00Z",
  },
  {
    id: "usr-invited-03",
    email: "student.invited@fpt.edu.vn",
    fullName: "Lê Quốc Bảo (SV FPT)",
    studentCode: "SE170888",
    isAdmin: false,
    isApproved: true,
    isFpt: true,
    isStudent: true,
    schoolName: "Đại học FPT HCM",
    createdTime: "2026-03-05T00:00:00Z",
  },
  {
    id: "usr-nonfpt-01",
    email: "an.tran@hcmus.edu.vn",
    fullName: "Trần Văn An (Non-FPT HCMUS)",
    studentCode: "21120001",
    isAdmin: false,
    isApproved: false,
    isFpt: false,
    isStudent: true,
    photoStudentCardUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    schoolName: "Đại học Khoa học Tự nhiên (HCMUS)",
    rejectionCount: 0,
    createdTime: "2026-04-10T00:00:00Z",
  },
  {
    id: "usr-locked-99",
    email: "student.locked@vlu.edu.vn",
    fullName: "Nguyễn Văn Khóa (SV VLU Locked 2 Gậy)",
    studentCode: "217VLU999",
    isAdmin: false,
    isApproved: false,
    isFpt: false,
    isStudent: true,
    photoStudentCardUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    schoolName: "Đại học Văn Lang (VLU)",
    rejectionCount: 2,
    rejectionReason: "Ảnh chụp thẻ SV bị mờ nét và sai mã sinh viên 2 lần.",
    createdTime: "2026-04-12T00:00:00Z",
  },
];

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
        // Mock fallback
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
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<PagedResult<User>>>("/Users", { params });
        if (res.data?.data?.data && res.data.data.data.length > 0) {
          return res.data.data;
        }
        if (Array.isArray(res.data) && res.data.length > 0) {
          return {
            data: res.data,
            currentPage: 1,
            pageSize: 50,
            totalItems: res.data.length,
            totalPages: 1,
            hasPreviousPage: false,
            hasNextPage: false,
          };
        }
      } catch {
        console.warn("[SEAL] Returning mock users list for Admin view");
      }
      return {
        data: MOCK_USERS_LIST,
        currentPage: 1,
        pageSize: 50,
        totalItems: MOCK_USERS_LIST.length,
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
        const res = await apiClient.post(`/Users/${userId}/approve`);
        return res.data;
      } catch {
        return { success: true, message: "Duyệt hồ sơ user thành công (Mock Mode)" };
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
    mutationFn: async (params: { userId: string; reason: string }) => {
      try {
        const res = await apiClient.post(`/Users/${params.userId}/reject`, {
          reason: params.reason,
        });
        return res.data;
      } catch {
        return { success: true, message: "Từ chối hồ sơ user (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/** GET /api/fpt-mock/students/{studentCode} — Xác minh SV FPT */
export function useFptStudentLookup(studentCode: string | null) {
  return useQuery({
    queryKey: ["fptStudent", studentCode],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/fpt-mock/students/${studentCode}`);
        return res.data?.data ?? res.data;
      } catch {
        return {
          studentCode: studentCode || "SE170123",
          fullName: "Nguyễn Văn A (FPT Student Verified)",
          email: `${studentCode?.toLowerCase() || "se170123"}@fpt.edu.vn`,
          isFpt: true,
          isVerified: true,
        };
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
    } catch {
      // Fallback
    }
    const mockFound = MOCK_USERS_LIST.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    return mockFound ?? null;
  },
};
