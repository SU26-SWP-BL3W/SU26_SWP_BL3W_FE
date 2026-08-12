import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { TeamEntity, TeamMemberModel, TeamInvitation, BaseResponse, PagedResult, EventEntity } from "@/models/entities";

export interface MyTeamResponse {
  team: TeamEntity | null;
  members: TeamMemberModel[];
  invitations?: TeamInvitation[];
  event?: EventEntity | null;
}

// ─── GET /api/Teams/my-team ──────────────────────────────────

export function useMyTeam() {
  return useQuery({
    queryKey: ["my-team"],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<MyTeamResponse>>("/Teams/my-team");
      return res.data.data ?? res.data;
    },
    retry: false,
  });
}

// ─── POST /api/Teams — Tạo team mới (Forming) ────────────────

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { teamName: string; description?: string; eventId: string }) => {
      const res = await apiClient.post<BaseResponse<TeamEntity>>("/Teams", data);
      return res.data.data;
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
      const res = await apiClient.post<BaseResponse<TeamInvitation>>(`/Teams/${teamId}/invitations`, { email });
      return res.data;
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
    mutationFn: async ({ invitationId, isAccepted }: { invitationId: string; isAccepted: boolean }) => {
      const res = await apiClient.post(`/Teams/invitations/${invitationId}/respond`, null, {
        params: { isAccepted },
      });
      return res.data;
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
      const res = await apiClient.post<BaseResponse<TeamEntity>>(`/Teams/${teamId}/confirm-registration`);
      return res.data;
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
      const res = await apiClient.get<BaseResponse<PagedResult<TeamEntity>>>("/Teams", {
        params: { ...params, status: "PendingApproval" },
      });
      return res.data.data;
    },
  });
}

// ─── EC/Admin: POST /api/Teams/{teamId}/approve-registration 

export function useApproveTeamRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await apiClient.post(`/Teams/${teamId}/approve-registration`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teams"] });
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

// ─── EC/Admin: POST /api/Teams/{teamId}/reject-registration ─

export function useRejectTeamRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, reason }: { teamId: string; reason: string }) => {
      const res = await apiClient.post(`/Teams/${teamId}/reject-registration`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teams"] });
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

// ─── POST /api/Teams/{teamId}/transfer-leader ────────────────

export function useTransferTeamLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, newLeaderUserId }: { teamId: string; newLeaderUserId: string }) => {
      const res = await apiClient.post(`/Teams/${teamId}/transfer-leader`, { newLeaderUserId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}
