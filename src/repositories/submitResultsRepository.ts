import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { MockSubmission } from "@/viewModels/mockTeamData";

export interface SubmitResultRequest {
  TeamId: string;
  TrackId: string;
  RoundId: string;
  SubmissionUrl: string;
  Description?: string;
}

export function useMySubmissions(teamId?: string) {
  return useQuery({
    queryKey: ["my-submissions", teamId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<MockSubmission[]>(`/SubmitResults/team/${teamId}`);
        return res.data;
      } catch {
        return [];
      }
    },
    enabled: !!teamId,
  });
}

export const useGetJudgeSubmissions = useMySubmissions;

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmitResultRequest) => {
      const res = await apiClient.post<MockSubmission>("/SubmitResults", data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions", variables.TeamId] });
    },
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubmitResultRequest> }) => {
      const res = await apiClient.put<MockSubmission>(`/SubmitResults/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/SubmitResults/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
}
