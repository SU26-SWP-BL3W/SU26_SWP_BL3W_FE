import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { FinalResult, Prize, BaseResponse } from "@/models/entities";

// ─── MOCK DATA DÙNG CHO CHẾ ĐỘ DEMO KHI CHƯA CÓ KẾT NỐI BE ──────────

export const MOCK_FINAL_RESULTS: FinalResult[] = [
  // Event 1: SEAL Hackathon 2026 Mùa Hè — Round 3 (Chung kết)
  {
    id: "fr-1",
    eventId: "seal-2026-mua-he",
    roundId: "r3",
    trackId: "track-1",
    teamId: "team-1",
    teamName: "CyberShield",
    finalScore: 9.65,
    rank: 1,
    isAdvanced: true,
    isPublished: true,
    prizeId: "pz-1",
    prizeName: "Giải Nhất AI & Data Science",
    rewardAmount: 15000000,
  },
  {
    id: "fr-2",
    eventId: "seal-2026-mua-he",
    roundId: "r3",
    trackId: "track-1",
    teamId: "team-2",
    teamName: "DevDragons",
    finalScore: 9.12,
    rank: 2,
    isAdvanced: true,
    isPublished: true,
    prizeId: "pz-2",
    prizeName: "Giải Nhì AI & Data Science",
    rewardAmount: 8000000,
  },
  {
    id: "fr-3",
    eventId: "seal-2026-mua-he",
    roundId: "r3",
    trackId: "track-1",
    teamId: "team-3",
    teamName: "NeuralKnights",
    finalScore: 8.75,
    rank: 3,
    isAdvanced: false,
    isPublished: true,
    prizeId: "pz-3",
    prizeName: "Giải Ba AI & Data Science",
    rewardAmount: 4000000,
  },
  {
    id: "fr-4",
    eventId: "seal-2026-mua-he",
    roundId: "r3",
    trackId: "track-2",
    teamId: "team-4",
    teamName: "ByteBusters",
    finalScore: 9.5,
    rank: 1,
    isAdvanced: true,
    isPublished: true,
    prizeId: "pz-4",
    prizeName: "Giải Nhất Cyber Security",
    rewardAmount: 15000000,
  },
  {
    id: "fr-5",
    eventId: "seal-2026-mua-he",
    roundId: "r3",
    trackId: "track-2",
    teamId: "team-5",
    teamName: "CryptoGuardians",
    finalScore: 8.9,
    rank: 2,
    isAdvanced: true,
    isPublished: true,
    prizeId: "pz-5",
    prizeName: "Giải Nhì Cyber Security",
    rewardAmount: 8000000,
  },
  {
    id: "fr-6",
    eventId: "seal-2026-mua-he",
    roundId: "r3",
    trackId: "track-3",
    teamId: "team-6",
    teamName: "BlockWarriors",
    finalScore: 9.8,
    rank: 1,
    isAdvanced: true,
    isPublished: true,
    prizeId: "pz-6",
    prizeName: "Giải Nhất Web3 & Blockchain",
    rewardAmount: 20000000,
  },

  // Event 2: SEAL AI Sprint 2026
  {
    id: "fr-7",
    eventId: "seal-ai-sprint-2026",
    roundId: "r1",
    trackId: "track-1",
    teamId: "team-7",
    teamName: "VisionTech AI",
    finalScore: 9.4,
    rank: 1,
    isAdvanced: true,
    isPublished: true,
    prizeId: "pz-7",
    prizeName: "Giải Nhất AI Sprint",
    rewardAmount: 10000000,
  },
  {
    id: "fr-8",
    eventId: "seal-ai-sprint-2026",
    roundId: "r1",
    trackId: "track-1",
    teamId: "team-8",
    teamName: "DeepMinders",
    finalScore: 8.85,
    rank: 2,
    isAdvanced: true,
    isPublished: true,
    prizeId: "pz-8",
    prizeName: "Giải Nhì AI Sprint",
    rewardAmount: 5000000,
  },
];

// ─── GET /api/FinalResults/round/{roundId} ───────────────────

export function useGetFinalResultsByRound(roundId?: string, eventId?: string) {
  return useQuery({
    queryKey: ["final-results", roundId, eventId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<FinalResult[]>>(
          `/FinalResults/round/${roundId}`
        );
        if (res.data?.data && res.data.data.length > 0) {
          return res.data.data;
        }
      } catch {
        console.warn("[SEAL] Backend offline, returning mock leaderboard results");
      }

      // Trả về dữ liệu Mock cho Vòng & Event được chọn
      return MOCK_FINAL_RESULTS.filter((r) => {
        const matchEv = !eventId || r.eventId === eventId;
        const matchRnd = !roundId || r.roundId === roundId;
        return matchEv && matchRnd;
      });
    },
    enabled: true,
  });
}

// ─── PUT /api/FinalResults/round/{roundId}/publish-status ────

export function usePublishRoundResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roundId, isPublished }: { roundId: string; isPublished: boolean }) => {
      try {
        const res = await apiClient.put(`/FinalResults/round/${roundId}/publish-status`, {
          isPublished,
        });
        return res.data;
      } catch {
        return { success: true, message: "Cập nhật công bố (Mock Mode)" };
      }
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
      try {
        const res = await apiClient.patch(`/FinalResults/${resultId}/assign-prize`, { prizeId });
        return res.data;
      } catch {
        return { success: true, message: "Gán giải thưởng (Mock Mode)" };
      }
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
      try {
        const res = await apiClient.get<BaseResponse<Prize[]>>("/Prizes", { params });
        if (res.data?.data && res.data.data.length > 0) {
          return res.data.data;
        }
      } catch {
        console.warn("[SEAL] Backend offline, returning mock prizes");
      }

      return [
        {
          id: "pz-1",
          eventId: "seal-2026-mua-he",
          trackId: "track-1",
          prizeName: "Giải Nhất AI & Data Science",
          rewardAmount: 15000000,
          quantity: 1,
        },
        {
          id: "pz-2",
          eventId: "seal-2026-mua-he",
          trackId: "track-1",
          prizeName: "Giải Nhì AI & Data Science",
          rewardAmount: 8000000,
          quantity: 1,
        },
        {
          id: "pz-3",
          eventId: "seal-2026-mua-he",
          trackId: "track-1",
          prizeName: "Giải Ba AI & Data Science",
          rewardAmount: 4000000,
          quantity: 1,
        },
      ];
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
      try {
        const res = await apiClient.post<BaseResponse<Prize>>("/Prizes", payload);
        return res.data?.data;
      } catch {
        return { id: `pz-${Date.now()}`, ...payload };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prizes"] });
    },
  });
}
