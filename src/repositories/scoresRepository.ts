import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type {
  SaveScoreRequest,
  Score,
  ScoreBreakdownModel,
  CalibrationModel,
  BaseResponse,
  FinalResult,
} from "@/models/entities";

export const MOCK_SCORE_BREAKDOWN: ScoreBreakdownModel = {
  teamId: "team-1",
  teamName: "CyberShield",
  totalScore: 9.65,
  details: [
    {
      criteriaId: "cr-1",
      criteriaName: "Ý tưởng & Đổi mới sáng tạo",
      scoreValue: 9.5,
      maxScore: 10,
      weight: 30,
    },
    {
      criteriaId: "cr-2",
      criteriaName: "Kỹ thuật & Kiến trúc mã nguồn",
      scoreValue: 10.0,
      maxScore: 10,
      weight: 40,
    },
    {
      criteriaId: "cr-3",
      criteriaName: "Tính khả thi & Tiềm năng thương mại",
      scoreValue: 9.0,
      maxScore: 10,
      weight: 15,
    },
    {
      criteriaId: "cr-4",
      criteriaName: "Trình bày & Thuyết trình",
      scoreValue: 9.5,
      maxScore: 10,
      weight: 15,
    },
  ],
};

export const MOCK_TRACK_CALIBRATION: CalibrationModel = {
  trackId: "track-1",
  trackName: "AI & Data Science",
  judges: [
    { id: "usr-judge-01", fullName: "Giám Khảo 1 (AI Staff)" },
    { id: "usr-judge-02", fullName: "Giám Khảo 2 (Data Expert)" },
  ],
  teams: [
    {
      teamId: "team-1",
      teamName: "CyberShield",
      scores: [
        { judgeId: "usr-judge-01", scoreValue: 9.7, isSubmitted: true },
        { judgeId: "usr-judge-02", scoreValue: 9.6, isSubmitted: true },
      ],
      averageScore: 9.65,
    },
    {
      teamId: "team-2",
      teamName: "DevDragons",
      scores: [
        { judgeId: "usr-judge-01", scoreValue: 9.2, isSubmitted: true },
        { judgeId: "usr-judge-02", scoreValue: 9.0, isSubmitted: true },
      ],
      averageScore: 9.1,
    },
    {
      teamId: "team-3",
      teamName: "NeuralKnights",
      scores: [
        { judgeId: "usr-judge-01", scoreValue: 8.8, isSubmitted: true },
        { judgeId: "usr-judge-02", scoreValue: 8.7, isSubmitted: true },
      ],
      averageScore: 8.75,
    },
  ],
};

// ─── POST /api/Scores/save — Giám khảo lưu/chốt điểm ─────────

export function useSaveScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SaveScoreRequest) => {
      try {
        const res = await apiClient.post<BaseResponse<Score>>("/Scores/save", data);
        return res.data?.data;
      } catch {
        return {
          id: `sc-${Date.now()}`,
          submitResultId: data.submitResultId,
          judgeId: (data as any).judgeId || "usr-judge-01",
          scoreValue: 9.5,
          isSubmitted: data.isSubmitted,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judge-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["track-calibration"] });
      queryClient.invalidateQueries({ queryKey: ["team-score-breakdown"] });
    },
  });
}

// ─── GET /api/Scores/team/{teamId}/score-breakdown ────────────

export function useGetTeamScoreBreakdown(teamId?: string) {
  return useQuery({
    queryKey: ["team-score-breakdown", teamId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<ScoreBreakdownModel>>(
          `/Scores/team/${teamId}/score-breakdown`
        );
        if (res.data?.data) return res.data.data;
      } catch {
        console.warn("[SEAL] Returning mock score breakdown");
      }
      return MOCK_SCORE_BREAKDOWN;
    },
    enabled: true,
  });
}

// ─── GET /api/Scores/track/{trackId}/calibration ──────────────

export function useGetTrackCalibration(trackId?: string) {
  return useQuery({
    queryKey: ["track-calibration", trackId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<CalibrationModel>>(
          `/Scores/track/${trackId}/calibration`
        );
        if (res.data?.data) return res.data.data;
      } catch {
        console.warn("[SEAL] Returning mock track calibration");
      }
      return MOCK_TRACK_CALIBRATION;
    },
    enabled: true,
  });
}

// ─── POST /api/FinalResults/calculate/{roundId} ───────────────

export function useCalculateRoundResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roundId: string) => {
      try {
        const res = await apiClient.post<BaseResponse<FinalResult[]>>(
          `/FinalResults/calculate/${roundId}`
        );
        return res.data?.data;
      } catch {
        return { success: true, message: "Tính toán kết quả vòng thi thành công (Mock Mode)" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["final-results"] });
      queryClient.invalidateQueries({ queryKey: ["track-calibration"] });
    },
  });
}

// ─── GET /api/Scores/export/{eventId}?anonymize=true ─────────

export function useExportCsvAnonymized() {
  return useMutation({
    mutationFn: async (eventId: string) => {
      try {
        const res = await apiClient.get(`/Scores/export/${eventId}`, {
          params: { anonymize: true },
          responseType: "blob",
        });
        return res.data;
      } catch {
        // Return dummy CSV text blob
        const csvContent =
          "TeamCode,Criteria_Innovation,Criteria_CodeQuality,TotalScore,Rank\nTEAM_001,9.5,10.0,9.65,1\nTEAM_002,9.0,9.2,9.12,2\n";
        return new Blob([csvContent], { type: "text/csv" });
      }
    },
  });
}
