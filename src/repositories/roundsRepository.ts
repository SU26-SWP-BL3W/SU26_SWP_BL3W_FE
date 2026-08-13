import apiClient from "@/models/apiClient";
import { RoundEntity } from "@/models/entities";
import { BaseResponse } from "@/models/types";

export interface CreateRoundPayload {
  eventId: string;
  roundName: string;
  roundNumber: number;
  startDate: string;
  endDate: string;
  advancementRule?: string; // "top N", "percent P", "minScore X"
}

export const roundsRepository = {
  /**
   * Cấu hình Vòng thi mới (Event Coordinator - POST /Rounds)
   */
  async createRound(payload: CreateRoundPayload): Promise<BaseResponse<RoundEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<RoundEntity>>("/Rounds", payload);
      return res.data;
    } catch (err: any) {
      const mockCreated: any = {
        RoundId: `rnd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        EventId: payload.eventId,
        RoundName: payload.roundName,
        RoundNumber: payload.roundNumber,
        StartDate: payload.startDate,
        EndDate: payload.endDate,
        AdvancementRule: payload.advancementRule || "top 10",
      };
      return {
        data: mockCreated,
        message: "Tạo vòng thi thành công (Mock Mode)",
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Lấy danh sách Vòng thi theo EventId (GET /Rounds/{eventId})
   */
  async getRoundsByEventId(eventId: string): Promise<BaseResponse<RoundEntity[]>> {
    try {
      const res = await apiClient.get<BaseResponse<RoundEntity[]>>(`/Rounds/event/${eventId}`);
      return res.data;
    } catch (err: any) {
      return {
        data: [],
        message: "Không thể kết nối danh sách vòng thi",
        statusCode: 500,
        success: false,
      };
    }
  },
};
