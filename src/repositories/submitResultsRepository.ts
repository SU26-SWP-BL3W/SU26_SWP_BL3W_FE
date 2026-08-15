import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { SubmissionItem } from "@/viewModels/teamTypes";
import type { BaseResponse, PagedResult } from "@/models/types";

export interface SubmitResultListItem {
  id?: string;
  Id?: string;
  teamId?: string;
  TeamId?: string;
  trackId?: string;
  TrackId?: string;
  submissionUrl?: string;
  SubmissionUrl?: string;
  createdTime?: string;
  CreatedTime?: string;
}

/** Danh sách bài nộp lọc theo Hạng mục (GET /api/SubmitResults?TrackId=...) — dùng cho Mentor xem tiến độ Track mình phụ trách. */
export function useGetSubmitResultsByTrack(trackId?: string) {
  return useQuery({
    queryKey: ["submit-results-by-track", trackId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<PagedResult<SubmitResultListItem>>>(
        "/SubmitResults",
        { params: { TrackId: trackId, PageSize: 200 } }
      );
      return res.data.data?.data ?? [];
    },
    enabled: !!trackId,
  });
}

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
        const res = await apiClient.get<BaseResponse<PagedResult<SubmitResultListItem>> | any>(
          "/Teams/my-submissions",
          { params: { PageSize: 100 } }
        );
        return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
      } catch (err: any) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/Teams/my-submissions error:", err?.message);
        return [];
      }
    },
  });
}

export const useGetJudgeSubmissions = useMySubmissions;

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmitResultRequest) => {
      const res = await apiClient.post<SubmissionItem>("/SubmitResults", data);
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
      const res = await apiClient.put<SubmissionItem>(`/SubmitResults/${id}`, data);
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
