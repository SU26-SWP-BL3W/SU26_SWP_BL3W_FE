import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { SubmitResult, BaseResponse, PagedResult } from "@/models/entities";

// ─── GET /api/Teams/my-submissions ──────────────────────────

export function useMySubmissions() {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<SubmitResult[]>>("/Teams/my-submissions");
      return res.data?.data ?? res.data;
    },
  });
}

// ─── POST /api/SubmitResults — Nộp bài thi ───────────────────

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      teamId: string;
      trackId: string;
      submissionUrl: string;
      description?: string;
    }) => {
      const res = await apiClient.post<BaseResponse<SubmitResult>>("/SubmitResults", data);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
}

// ─── GET /api/SubmitResults?trackId=... — Giám khảo nhận bài nộp ─

export function useGetJudgeSubmissions(trackId?: string) {
  return useQuery({
    queryKey: ["judge-submissions", trackId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<PagedResult<SubmitResult>>>("/SubmitResults", {
        params: { trackId, pageSize: 100 },
      });
      return res.data?.data?.data ?? [];
    },
    enabled: !!trackId,
  });
}
