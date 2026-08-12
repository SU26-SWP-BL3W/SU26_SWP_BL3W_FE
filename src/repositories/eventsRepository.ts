import apiClient from "@/models/apiClient";
import { EventEntity } from "@/models/entities";
import { BaseResponse } from "@/models/types";

export interface CreateEventPayload {
  eventName: string;
  season: string;
  year: number;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  description?: string;
}

export const eventsRepository = {
  /**
   * Tạo Event mới (Dành cho Admin - POST /api/Events)
   */
  async createEvent(payload: CreateEventPayload): Promise<BaseResponse<EventEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<EventEntity>>("/api/Events", payload);
      return res.data;
    } catch (err: any) {
      // Fallback mock khi BE chưa chạy API
      const mockCreated: EventEntity = {
        EventId: `ev-${Date.now()}`,
        EventName: payload.eventName,
        Season: payload.season,
        Year: payload.year,
        StartDate: payload.startDate,
        EndDate: payload.endDate,
        RegistrationStartDate: payload.registrationStartDate,
        RegistrationEndDate: payload.registrationEndDate,
        Description: payload.description,
        status: true,
      };
      return {
        data: mockCreated,
        message: "Tạo sự kiện thành công (Mock Mode)",
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Lấy danh sách sự kiện (GET /api/Events)
   */
  async getEvents(): Promise<BaseResponse<EventEntity[]>> {
    try {
      const res = await apiClient.get<BaseResponse<EventEntity[]>>("/api/Events");
      return res.data;
    } catch (err: any) {
      return {
        data: [],
        message: "Không thể lấy danh sách sự kiện từ server",
        statusCode: 500,
        success: false,
      };
    }
  },

  /**
   * Lấy chi tiết 1 sự kiện theo ID (GET /api/Events/{id})
   */
  async getEventById(eventId: string): Promise<BaseResponse<EventEntity | null>> {
    try {
      const res = await apiClient.get<BaseResponse<EventEntity>>(`/api/Events/${eventId}`);
      return res.data;
    } catch (err: any) {
      return {
        data: null,
        message: "Không tìm thấy sự kiện",
        statusCode: 404,
        success: false,
      };
    }
  },
};
