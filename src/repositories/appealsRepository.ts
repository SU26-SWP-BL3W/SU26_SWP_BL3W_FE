import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";

export interface AppealDTO {
  AppealId: string;
  SubmissionId: string;
  TeamId: string;
  TeamName: string;
  Reason: string;
  Status: "Filed" | "Approved" | "Rejected";
  ResponseReason?: string;
  CreatedAt: string;
  RespondedAt?: string;
}

export function useAppeals({ roundId, teamId }: { roundId?: string; teamId?: string } = {}) {
  return useQuery({
    queryKey: ["appeals", roundId, teamId],
    queryFn: async () => {
      try {
        if (roundId) {
          const res = await apiClient.get<any>(`/Appeals/round/${roundId}`);
          const items = res.data?.data?.data || res.data?.data || res.data || [];
          return Array.isArray(items) ? items : [];
        }
        if (teamId) {
          const res = await apiClient.get<any>(`/Appeals/team/${teamId}`);
          const items = res.data?.data?.data || res.data?.data || res.data || [];
          return Array.isArray(items) ? items : [];
        }
        return [];
      } catch {
        return [];
      }
    },
    enabled: !!roundId || !!teamId,
  });
}

export const useGetAppeals = useAppeals;

export function useCreateAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { SubmissionId: string; Reason: string }) => {
      const res = await apiClient.post<AppealDTO>("/Appeals", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
    },
  });
}

export function useRespondAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appealId, status, responseReason }: { appealId: string; status: "Approved" | "Rejected"; responseReason: string }) => {
      const res = await apiClient.put(`/Appeals/${appealId}/respond`, { status, responseReason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
    },
  });
}
