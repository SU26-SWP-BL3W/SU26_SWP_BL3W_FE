import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type {
  TeamEntity,
  TeamMemberModel,
  TeamInvitation,
  BaseResponse,
  PagedResult,
  EventEntity,
} from "@/models/entities";

export interface MyTeamResponse {
  team: TeamEntity | null;
  members: TeamMemberModel[];
  invitations?: TeamInvitation[];
  event?: EventEntity | null;
}

// ─── MOCK DATA FALLBACK FOR TEAMS ─────────────────────────────

export const MOCK_MY_TEAM_RESPONSE: MyTeamResponse = {
  team: {
    id: "team-1",
    teamName: "CyberShield",
    description: "Đội thi phát triển giải pháp bảo mật tự động bằng AI.",
    status: "Registered",
    eventId: "seal-2026-mua-he",
    leaderId: "usr-leader-01",
    createdTime: "2026-06-15T00:00:00Z",
  },
  event: {
    id: "seal-2026-mua-he",
    eventName: "SEAL Hackathon 2026 Mùa Hè",
    minTeamSize: 3,
    maxTeamSize: 5,
    maxTeams: 50,
  },
  members: [
    {
      id: "tm-1",
      teamId: "team-1",
      userId: "usr-leader-01",
      fullName: "Trưởng Nhóm CyberShield",
      email: "leader.cybershield@fpt.edu.vn",
      role: "Leader",
      isLeader: true,
      joinedTime: "2026-06-15T00:00:00Z",
    },
    {
      id: "tm-2",
      teamId: "team-1",
      userId: "usr-member-02",
      fullName: "Thành Viên Đội CyberShield",
      email: "member.cybershield@fpt.edu.vn",
      role: "Member",
      isLeader: false,
      joinedTime: "2026-06-16T10:00:00Z",
    },
    {
      id: "tm-3",
      teamId: "team-1",
      userId: "usr-member-03",
      fullName: "Nguyễn Văn C (SV UIT)",
      email: "cuong.le@uit.edu.vn",
      role: "Member",
      isLeader: false,
      joinedTime: "2026-06-17T14:20:00Z",
    },
  ],
  invitations: [
    {
      id: "inv-101",
      teamId: "team-1",
      invitedEmail: "student.invited@fpt.edu.vn",
      status: "Pending",
      createdTime: "2026-08-01",
    },
  ],
};

export const MOCK_PENDING_TEAMS_LIST: TeamEntity[] = [
  {
    id: "team-2",
    teamName: "DevDragons",
    description: "Giải pháp Web3 quản lý chuỗi cung ứng nông sản.",
    status: "PendingApproval",
    eventId: "seal-2026-mua-he",
    leaderId: "usr-dev-02",
    createdTime: "2026-08-05T09:00:00Z",
  },
  {
    id: "team-3",
    teamName: "NeuralKnights",
    description: "Ứng dụng AI chẩn đoán hình ảnh y tế trực tuyến.",
    status: "PendingApproval",
    eventId: "seal-2026-mua-he",
    leaderId: "usr-neural-03",
    createdTime: "2026-08-06T11:30:00Z",
  },
];

export const MOCK_MY_INVITATIONS: TeamInvitation[] = [
  {
    id: "inv-202",
    teamId: "team-2",
    teamName: "DevDragons",
    invitedEmail: "student.invited@fpt.edu.vn",
    invitedByName: "Trần Văn An (Leader DevDragons)",
    status: "Pending",
    createdTime: "2026-08-10T08:00:00Z",
  },
];

// ─── GET /api/Teams/my-team ──────────────────────────────────

export function useMyTeam() {
  return useQuery({
    queryKey: ["my-team"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<MyTeamResponse>>("/Teams/my-team");
        if (res.data?.data) return res.data.data;
      } catch {
        console.warn("[SEAL] Returning mock my-team data");
      }
      return MOCK_MY_TEAM_RESPONSE;
    },
    retry: false,
  });
}

// ─── GET /api/Teams/my-invitations ────────────────────────────

export function useGetMyInvitations() {
  return useQuery({
    queryKey: ["my-invitations"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<TeamInvitation[]>>("/Teams/my-invitations");
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch {
        console.warn("[SEAL] Returning mock invitations data");
      }
      return MOCK_MY_INVITATIONS;
    },
  });
}

// ─── POST /api/Teams — Tạo team mới (Forming) ────────────────

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { teamName: string; description?: string; eventId: string }) => {
      try {
        const res = await apiClient.post<BaseResponse<TeamEntity>>("/Teams", data);
        return res.data.data;
      } catch {
        return {
          id: `team-${Date.now()}`,
          teamName: data.teamName,
          description: data.description,
          status: "Forming",
          eventId: data.eventId,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

// ─── POST /api/Teams/{teamId}/invitations — Mời thành viên ──

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string; email: string }) => {
      try {
        const res = await apiClient.post<BaseResponse<TeamInvitation>>(
          `/Teams/${teamId}/invitations`,
          { email }
        );
        return res.data;
      } catch {
        return {
          id: `inv-${Date.now()}`,
          teamId,
          invitedEmail: email,
          status: "Pending",
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

// ─── POST /api/Teams/invitations/{invitationId}/respond ──────

export function useRespondInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      invitationId,
      isAccepted,
    }: {
      invitationId: string;
      isAccepted: boolean;
    }) => {
      try {
        const res = await apiClient.post(`/Teams/invitations/${invitationId}/respond`, null, {
          params: { isAccepted },
        });
        return res.data;
      } catch {
        return { success: true, message: "Phản hồi lời mời (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    },
  });
}

// ─── POST /api/Teams/{teamId}/confirm-registration ─────────

export function useConfirmRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      try {
        const res = await apiClient.post<BaseResponse<TeamEntity>>(
          `/Teams/${teamId}/confirm-registration`
        );
        return res.data;
      } catch {
        return { success: true, message: "Chốt danh sách đăng ký (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

// ─── EC/Admin: GET /api/Teams?status=PendingApproval ─────────

export function useGetPendingTeams(params?: { pageNumber?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["pending-teams", params],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<PagedResult<TeamEntity>>>("/Teams", {
          params: { ...params, status: "PendingApproval" },
        });
        if (res.data?.data?.data && res.data.data.data.length > 0) return res.data.data;
      } catch {
        console.warn("[SEAL] Returning mock pending teams");
      }
      return {
        data: MOCK_PENDING_TEAMS_LIST,
        currentPage: 1,
        pageSize: 10,
        totalItems: MOCK_PENDING_TEAMS_LIST.length,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    },
  });
}

// ─── EC/Admin: POST /api/Teams/{teamId}/approve-registration ─

export function useApproveTeamRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      try {
        const res = await apiClient.post(`/Teams/${teamId}/approve-registration`);
        return res.data;
      } catch {
        return { success: true, message: "Duyệt đăng ký đội thi (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teams"] });
    },
  });
}

// ─── EC/Admin: POST /api/Teams/{teamId}/reject-registration ──

export function useRejectTeamRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, reason }: { teamId: string; reason: string }) => {
      try {
        const res = await apiClient.post(`/Teams/${teamId}/reject-registration`, { reason });
        return res.data;
      } catch {
        return { success: true, message: "Từ chối đăng ký đội thi (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teams"] });
    },
  });
}

// ─── POST /api/Teams/{teamId}/transfer-leader ────────────────

export function useTransferTeamLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, newLeaderId }: { teamId: string; newLeaderId: string }) => {
      try {
        const res = await apiClient.post(`/Teams/${teamId}/transfer-leader`, { newLeaderId });
        return res.data;
      } catch {
        return { success: true, message: "Chuyển quyền đội trưởng (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}
