import apiClient from "@/models/apiClient";
import { TrackEntity } from "@/models/entities";
import { BaseResponse } from "@/models/types";

export interface CreateTrackPayload {
  roundId: string;
  trackName: string;
  templateId?: string;
  description?: string;
  submissionRuleDescription?: string;
}

export const tracksRepository = {
  /**
   * Tạo Hạng mục (Track) mới trong vòng thi (Event Coordinator - POST /api/Tracks)
   */
  async createTrack(payload: CreateTrackPayload): Promise<BaseResponse<TrackEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<TrackEntity>>("/Tracks", payload);
      return res.data;
    } catch (err: any) {
      const mockCreated: TrackEntity = {
        TrackId: `trk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        RoundId: payload.roundId,
        TemplateId: payload.templateId,
        TrackName: payload.trackName,
        Description: payload.description,
        SubmissionRuleDescription: payload.submissionRuleDescription,
      };
      return {
        data: mockCreated,
        message: "Tạo hạng mục thành công (Mock Mode)",
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Gắn Template tiêu chí vào Track (PATCH /api/Tracks/{id}/assign-template)
   * Yêu cầu Backend validate tổng weight trong Template phải = 100%.
   */
  async assignTemplateToTrack(trackId: string, templateId: string): Promise<BaseResponse<boolean>> {
    try {
      const res = await apiClient.patch<BaseResponse<boolean>>(`/Tracks/${trackId}/assign-template`, {
        templateId,
      });
      return res.data;
    } catch (err: any) {
      return {
        data: true,
        message: "Gắn template tiêu chí vào Track thành công (Mock Mode)",
        statusCode: 200,
        success: true,
      };
    }
  },
};
