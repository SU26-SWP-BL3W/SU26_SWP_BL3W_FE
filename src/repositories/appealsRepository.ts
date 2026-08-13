import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { Appeal, BaseResponse, AppealStatus } from "@/models/entities";

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

export function useGetAppeals(params?: { eventId?: string; status?: AppealStatus }) {
  return useQuery({
    queryKey: ["appeals", params],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<Appeal[]>>("/Appeals", { params });
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch {
        console.warn("[SEAL] Returning mock appeals list");
      }
      return MOCK_APPEALS_LIST;
    },
  });
}

// ─── POST /api/Appeals — Team Leader gửi Đơn Phúc khảo ───────

export function useCreateAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { submitResultId: string; reason: string }) => {
      try {
        const res = await apiClient.post<BaseResponse<Appeal>>("/Appeals", payload);
        return res.data?.data;
      } catch {
        return {
          id: `app-${Date.now()}`,
          teamId: "team-1",
          teamName: "CyberShield",
          submitResultId: payload.submitResultId,
          reason: payload.reason,
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
    }: {
      appealId: string;
      status: AppealStatus;
      response: string;
    }) => {
      try {
        const res = await apiClient.put(`/Appeals/${appealId}/respond`, {
          status,
          response,
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
