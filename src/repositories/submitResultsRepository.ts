import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { SubmitResult, BaseResponse, PagedResult } from "@/models/entities";

export interface SubmitResultRequest {
  TeamId?: string;
  TrackId?: string;
  RoundId?: string;
  SubmissionUrl?: string;
  Description?: string;
  teamId?: string;
  trackId?: string;
  roundId?: string;
  submissionUrl?: string;
  description?: string;
}

export const MOCK_SUBMISSIONS_LIST: SubmitResult[] = [
  {
    id: "sub-101",
    teamId: "team-1",
    teamName: "CyberShield",
    trackId: "track-1",
    submissionUrl: "https://github.com/cybershield/seal-hackathon-2026",
    description: "Hệ thống phát hiện lỗ hổng bảo mật tự động tích hợp mô hình AI LLM.",
    submittedAt: "2026-08-01T15:00:00Z",
    isEliminated: false,
  },
  {
    id: "sub-102",
    teamId: "team-2",
    teamName: "DevDragons",
    trackId: "track-1",
    submissionUrl: "https://github.com/devdragons/agri-blockchain-supply",
    description: "Nền tảng quản lý nguồn gốc nông sản bằng Web3 Smart Contract.",
    submittedAt: "2026-08-02T11:20:00Z",
    isEliminated: false,
  },
  {
    id: "sub-103",
    teamId: "team-3",
    teamName: "NeuralKnights",
    trackId: "track-1",
    submissionUrl: "https://github.com/neuralknights/med-ai-diagnostic",
    description: "Mô hình AI phân tích ảnh chụp x-quang hỗ trợ bác sĩ chẩn đoán nhanh.",
    submittedAt: "2026-08-03T16:45:00Z",
    isEliminated: false,
  },
];

// ─── GET /api/Teams/my-submissions ──────────────────────────

export function useMySubmissions(teamId?: string) {
  return useQuery({
    queryKey: ["my-submissions", teamId],
    queryFn: async () => {
      try {
        const url = teamId ? `/SubmitResults/team/${teamId}` : "/Teams/my-submissions";
        const res = await apiClient.get<any>(url);
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch {
        console.warn("[SEAL] Returning mock my-submissions");
      }
      return MOCK_SUBMISSIONS_LIST;
    },
  });
}

// ─── POST /api/SubmitResults — Nộp bài thi ───────────────────

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmitResultRequest) => {
      try {
        const res = await apiClient.post<BaseResponse<SubmitResult>>("/SubmitResults", data);
        return res.data?.data ?? res.data;
      } catch {
        return {
          id: `sub-${Date.now()}`,
          teamId: data.teamId || data.TeamId || "team-1",
          trackId: data.trackId || data.TrackId || "track-1",
          submissionUrl: data.submissionUrl || data.SubmissionUrl || "",
          description: data.description || data.Description || "",
          submittedAt: new Date().toISOString(),
          isEliminated: false,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["judge-submissions"] });
    },
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubmitResultRequest> }) => {
      try {
        const res = await apiClient.put(`/SubmitResults/${id}`, data);
        return res.data;
      } catch {
        return { id, ...data };
      }
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
      try {
        const res = await apiClient.delete(`/SubmitResults/${id}`);
        return res.data;
      } catch {
        return { success: true, message: "Xóa bài nộp (Mock Mode)" };
      }
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
      try {
        const res = await apiClient.get<BaseResponse<PagedResult<SubmitResult>>>("/SubmitResults", {
          params: { trackId, pageSize: 100 },
        });
        if (res.data?.data?.data && res.data.data.data.length > 0) {
          return res.data.data.data;
        }
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      } catch {
        console.warn("[SEAL] Returning mock judge submissions list");
      }

      return MOCK_SUBMISSIONS_LIST;
    },
    enabled: true,
  });
}
