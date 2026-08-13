import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { Appeal, BaseResponse, AppealStatus } from "@/models/entities";

export interface AppealDTO {
  AppealId?: string;
  SubmissionId?: string;
  TeamId?: string;
  TeamName?: string;
  Reason?: string;
  Status?: "Filed" | "Approved" | "Rejected" | number;
  ResponseReason?: string;
  CreatedAt?: string;
  RespondedAt?: string;
}

export const MOCK_APPEALS_LIST: Appeal[] = [
  {
    id: "app-101",
    teamId: "team-1",
    teamName: "CyberShield",
    submitResultId: "sub-101",
    reason: "Đội CyberShield xin khiếu nại về điểm tiêu chí Kỹ thuật do ban đầu chưa được tính điểm phần video demo live trên server.",
    status: 0, // Pending
    response: null,
    createdTime: "2026-08-08T10:00:00Z",
  },
  {
    id: "app-102",
    teamId: "team-2",
    teamName: "DevDragons",
    submitResultId: "sub-102",
    reason: "Đội DevDragons xin giải trình bổ sung về mã nguồn Smart Contract đã được verify trên Etherscan.",
    status: 1, // Approved
    response: "Hội đồng Giám khảo đã kiểm tra bản verify và điều chỉnh điểm tổng từ 9.0 thành 9.12.",
    createdTime: "2026-08-07T14:30:00Z",
  },
];

// ─── GET /api/Appeals ────────────────────────────────────────

export function useAppeals(params?: { eventId?: string; status?: any } | string) {
  const queryParams = typeof params === "string" ? { teamId: params } : params;
  return useQuery({
    queryKey: ["appeals", queryParams],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<Appeal[]>>("/Appeals", { params: queryParams });
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch {
        console.warn("[SEAL] Returning mock appeals list");
      }
      return MOCK_APPEALS_LIST;
    },
  });
}

export const useGetAppeals = useAppeals;

// ─── POST /api/Appeals — Team Leader gửi Đơn Phúc khảo ───────

export function useCreateAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { submitResultId?: string; SubmissionId?: string; reason?: string; Reason?: string }) => {
      try {
        const submissionId = payload.submitResultId || payload.SubmissionId || "";
        const reasonStr = payload.reason || payload.Reason || "";
        const res = await apiClient.post<BaseResponse<Appeal>>("/Appeals", {
          submitResultId: submissionId,
          SubmissionId: submissionId,
          reason: reasonStr,
          Reason: reasonStr,
        });
        return res.data?.data ?? res.data;
      } catch {
        return {
          id: `app-${Date.now()}`,
          teamId: "team-1",
          teamName: "CyberShield",
          submitResultId: payload.submitResultId || payload.SubmissionId,
          reason: payload.reason || payload.Reason,
          status: 0,
          response: null,
          createdTime: new Date().toISOString(),
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
    },
  });
}

// ─── PUT /api/Appeals/{id}/respond — EC duyệt/từ chối ────────

export function useRespondAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      appealId,
      status,
      response,
      responseReason,
    }: {
      appealId: string;
      status: any;
      response?: string;
      responseReason?: string;
    }) => {
      try {
        const res = await apiClient.put(`/Appeals/${appealId}/respond`, {
          status,
          response: response || responseReason,
          responseReason: responseReason || response,
        });
        return res.data;
      } catch {
        return { success: true, message: "Phản hồi đơn phúc khảo (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
    },
  });
}
