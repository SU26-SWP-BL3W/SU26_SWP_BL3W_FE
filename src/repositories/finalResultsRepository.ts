import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { FinalResult, Prize, BaseResponse } from "@/models/entities";

// ─── GET /api/FinalResults/round/{roundId} ───────────────────

export function useGetFinalResultsByRound(roundId?: string) {
  return useQuery({
    queryKey: ["final-results", roundId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<FinalResult[]>>(
        `/FinalResults/round/${roundId}`
      );
      return res.data?.data ?? [];
    },
    enabled: !!roundId,
  });
}

// ─── PUT /api/FinalResults/round/{roundId}/publish-status ────

export function usePublishRoundResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roundId, isPublished }: { roundId: string; isPublished: boolean }) => {
      const res = await apiClient.put(`/FinalResults/round/${roundId}/publish-status`, {
        isPublished,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["final-results"] });
    },
  });
}

// ─── PATCH /api/FinalResults/{id}/assign-prize ────────────────

export function useAssignPrize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ resultId, prizeId }: { resultId: string; prizeId: string | null }) => {
      const res = await apiClient.patch(`/FinalResults/${resultId}/assign-prize`, { prizeId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["final-results"] });
    },
  });
}

// ─── GET /api/Prizes ─────────────────────────────────────────

export function useGetPrizes(params?: { eventId?: string; trackId?: string }) {
  return useQuery({
    queryKey: ["prizes", params],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<Prize[]>>("/Prizes", { params });
      return res.data?.data ?? [];
    },
  });
}

// ─── POST /api/Prizes — Tạo Giải thưởng mới cho Track ────────

export function useCreatePrize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      eventId?: string;
      trackId?: string;
      prizeName: string;
      rewardAmount: number;
      quantity: number;
      description?: string;
    }) => {
      const res = await apiClient.post<BaseResponse<Prize>>("/Prizes", payload);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prizes"] });
    },
  });
}
