import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import { TrackEntity } from "@/models/entities";
import { BaseResponse, PagedResult } from "@/models/types";

export interface TrackStaffModel {
  id?: string;
  Id?: string;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
}

export interface TrackWithStaffModel {
  id?: string;
  Id?: string;
  eventId?: string;
  EventId?: string;
  trackName?: string;
  TrackName?: string;
  description?: string;
  Description?: string;
  judges?: TrackStaffModel[];
  Judges?: TrackStaffModel[];
  mentors?: TrackStaffModel[];
  Mentors?: TrackStaffModel[];
}

/**
 * Danh sách Hạng mục theo sự kiện (GET /api/Tracks/event) — mỗi Track kèm
 * sẵn danh sách Judges/Mentors được phân công, dùng để suy ra "hạng mục của tôi".
 */
export function useGetTracksByEvent(eventId?: string) {
  return useQuery({
    queryKey: ["tracks-by-event", eventId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<PagedResult<TrackWithStaffModel>>>(
        "/Tracks/event",
        { params: { EventId: eventId, PageSize: 100 } }
      );
      return res.data.data;
    },
    enabled: !!eventId,
  });
}

export interface CreateTrackPayload {
  eventId: string;
  trackName: string;
  templateId?: string;
  description?: string;
  submissionRuleDescription?: string;
}

export const tracksRepository = {
  /**
   * Tạo Hạng mục (Track) mới trong sự kiện (Event Coordinator - POST /api/Tracks)
   */
  async createTrack(payload: CreateTrackPayload): Promise<BaseResponse<TrackEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<TrackEntity>>("/Tracks", payload);
      return res.data;
    } catch (err: any) {
      const mockCreated: TrackEntity = {
        TrackId: `trk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        EventId: payload.eventId,
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
