import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { Appeal, BaseResponse, AppealStatus } from "@/models/entities";

// ─── GET /api/Appeals ────────────────────────────────────────

export function useGetAppeals(params?: { eventId?: string; status?: AppealStatus }) {
  return useQuery({
    queryKey: ["appeals", params],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<Appeal[]>>("/Appeals", { params });
      return res.data?.data ?? [];
    },
  });
}

// ─── POST /api/Appeals — Team Leader gửi Đơn Phúc khảo ───────

export function useCreateAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { submitResultId: string; reason: string }) => {
      const res = await apiClient.post<BaseResponse<Appeal>>("/Appeals", payload);
      return res.data?.data;
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
      const res = await apiClient.put(`/Appeals/${appealId}/respond`, {
        status,
        response,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
    },
  });
}
