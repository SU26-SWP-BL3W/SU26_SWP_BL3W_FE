import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { BaseResponse, PagedResult } from "@/models/types";

export interface TeamListItem {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  eventId?: string;
  EventId?: string;
}

/** Danh sách đội thi theo sự kiện (GET /api/Teams?EventId=...) — dùng để tra tên đội theo TeamId. */
export function useGetTeamsByEvent(eventId?: string) {
  return useQuery({
    queryKey: ["teams-by-event", eventId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<PagedResult<TeamListItem>>>("/Teams", {
        params: { EventId: eventId, PageSize: 200 },
      });
      return res.data.data?.data ?? [];
    },
    enabled: !!eventId,
  });
}

export interface Team {
  TeamId: string;
  EventId: string;
  TeamName: string;
  Description?: string;
  Status: "Forming" | "PendingApproval" | "Registered" | "Disqualified";
}

export interface TeamMember {
  EventRoleId: string;
  UserId: string;
  FullName: string;
  Email: string;
  RoleName: "TeamLeader" | "TeamMember";
  IsApproved: boolean;
  School?: string;
}

export interface TeamInvitation {
  InvitationId: string;
  TeamId: string;
  Email: string;
  Status: "Pending" | "Accepted" | "Declined" | "Expired";
  SentAt: string;
  ExpiresAt: string;
}

export function useMyTeam() {
  return useQuery({
    queryKey: ["my-team"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ team: Team | null; members: TeamMember[]; invitations?: TeamInvitation[] }>("/Teams/my-team");
        return res.data;
      } catch {
        return null;
      }
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { TeamName: string; Description?: string; EventId: string; TrackId?: string }) => {
      const res = await apiClient.post<Team>("/Teams", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string; email: string }) => {
      const res = await apiClient.post(`/Teams/${teamId}/invitations`, { email });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

export function useCancelInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, invitationId }: { teamId: string; invitationId: string }) => {
      await apiClient.delete(`/Teams/${teamId}/invitations/${invitationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

export const useRespondInvitation = useCancelInvitation;

export function useAcceptOrDeclineInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invitationId, isAccepted }: { invitationId: string; isAccepted: boolean }) => {
      const res = await apiClient.post(`/Teams/invitations/${invitationId}/respond`, { isAccepted });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

export function useConfirmRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await apiClient.post(`/Teams/${teamId}/confirm-registration`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

export function useGetPendingTeams() {
  return useQuery({
    queryKey: ["pending-teams"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<Team[]>("/Teams/pending");
        return res.data;
      } catch {
        return [];
      }
    },
  });
}

export function useApproveTeamRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await apiClient.post(`/Teams/${teamId}/approve-registration`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teams"] });
    },
  });
}

export function useRejectTeamRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, reason }: { teamId: string; reason?: string }) => {
      const res = await apiClient.post(`/Teams/${teamId}/reject-registration`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-teams"] });
    },
  });
}

export function useTransferLeadership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, targetUserId }: { teamId: string; targetUserId: string }) => {
      const res = await apiClient.post(`/Teams/${teamId}/transfer-leader`, { targetUserId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}

export function useLeaveTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await apiClient.post(`/Teams/${teamId}/leave`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
}
