import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type {
  SaveScoreRequest,
  Score,
  CalibrationModel,
  BaseResponse,
  FinalResult,
} from "@/models/entities";

// ─── Score breakdown (GET /api/Scores/team/{teamId}/breakdown) ────────────────
// Khớp đúng TeamScoreBreakdownModel bên BE — gộp theo bài nộp (Submission), mỗi
// bài nộp có thể có NHIỀU giám khảo (judgeScores[]), mỗi giám khảo chấm đủ các
// tiêu chí (criteria[]). Không phải 1 tổng điểm phẳng duy nhất.

export interface CriterionScoreLine {
  criteriaName: string;
  value: number;
  maxScore: number;
  weight: number;
}

export interface JudgeScoreBreakdown {
  judgeName: string;
  totalScore: number;
  comment?: string | null;
  isSubmitted: boolean;
  criteria: CriterionScoreLine[];
}

export interface SubmissionScoreBreakdown {
  submitResultId: string;
  trackName: string;
  roundId: string;
  roundName: string;
  /** Vòng đã tính/công bố kết quả hay chưa (điểm đã chốt hay còn có thể đổi). */
  roundPublished: boolean;
  judgeScores: JudgeScoreBreakdown[];
}

export interface TeamScoreBreakdownModel {
  teamId: string;
  teamName: string;
  submissions: SubmissionScoreBreakdown[];
}

// ─── POST /api/Scores/save — Giám khảo lưu/chốt điểm ─────────

export function useSaveScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SaveScoreRequest) => {
      const res = await apiClient.post<BaseResponse<Score>>("/Scores/save", data);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judge-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["track-calibration"] });
      queryClient.invalidateQueries({ queryKey: ["team-score-breakdown"] });
    },
  });
}

// ─── GET /api/Scores/team/{teamId}/breakdown ───────────────────

export function useGetTeamScoreBreakdown(teamId?: string) {
  return useQuery({
    queryKey: ["team-score-breakdown", teamId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<TeamScoreBreakdownModel>>(
        `/Scores/team/${teamId}/breakdown`
      );
      return res.data?.data;
    },
    enabled: !!teamId,
  });
}

// ─── GET /api/Scores/track/{trackId}/calibration ──────────────

export function useGetTrackCalibration(trackId?: string) {
  return useQuery({
    queryKey: ["track-calibration", trackId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<CalibrationModel>>(
        `/Scores/track/${trackId}/calibration`
      );
      return res.data?.data;
    },
    enabled: !!trackId,
  });
}

// ─── POST /api/FinalResults/calculate/{roundId} ───────────────

export function useCalculateRoundResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roundId: string) => {
      const res = await apiClient.post<BaseResponse<FinalResult[]>>(
        `/FinalResults/calculate/${roundId}`
      );
      return res.data?.data;
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
      const res = await apiClient.get(`/Scores/export/${eventId}`, {
        params: { anonymize: true },
        responseType: "blob",
      });
      return res.data;
    },
  });
}
