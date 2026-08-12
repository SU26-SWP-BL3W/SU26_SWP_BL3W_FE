import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";

export interface Team {
  TeamId: string;
  EventId: string;
  TeamName: string;
  Description?: string;
  Status: string; // Forming, PendingApproval, Registered, Disqualified
}

export interface TeamMember {
  EventRoleId: string;
  UserId: string;
  FullName: string;
  Email: string;
  RoleName: string; // TeamLeader, TeamMember
  IsApproved: boolean; // Dùng để check warning nếu chưa duyệt profile
}

export function useMyTeam() {
  return useQuery({
    queryKey: ["my-team"],
    queryFn: async () => {
      const res = await apiClient.get<{ team: Team | null; members: TeamMember[] }>("/Teams/my-team");
      return res.data;
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { TeamName: string; Description?: string; EventId: string }) => {
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
