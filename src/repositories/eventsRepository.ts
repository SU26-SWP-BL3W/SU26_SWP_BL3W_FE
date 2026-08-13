import { useQuery } from "@tanstack/react-query";
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
  minTeamSize?: number;
  maxTeamSize?: number;
  maxTeams?: number;
}

export function useGetEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await eventsRepository.getEvents();
      return res.data ?? [];
    },
  });
}

export const eventsRepository = {
  /**
   * Tạo Event mới (Dành cho Admin - POST /Events)
   */
  async createEvent(payload: CreateEventPayload): Promise<BaseResponse<EventEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<EventEntity>>("/Events", payload);
      return res.data;
    } catch (err: any) {
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
        minTeamSize: payload.minTeamSize ?? 3,
        maxTeamSize: payload.maxTeamSize ?? 5,
        maxTeams: payload.maxTeams ?? 50,
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
   * Lấy danh sách sự kiện (GET /Events)
   */
  async getEvents(): Promise<BaseResponse<EventEntity[]>> {
    try {
      const res = await apiClient.get<any>("/Events");
      const rawData = res.data?.data;
      let eventsList: EventEntity[] = [];

      if (Array.isArray(rawData)) {
        eventsList = rawData;
      } else if (rawData && Array.isArray(rawData.data)) {
        eventsList = rawData.data;
      }

      return {
        data: eventsList,
        message: res.data?.message || "Thành công",
        statusCode: res.data?.statusCode || 200,
        success: res.data?.success ?? true,
      };
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
   * Lấy chi tiết 1 sự kiện theo ID (GET /Events/{id})
   */
  async getEventById(eventId: string): Promise<BaseResponse<EventEntity | null>> {
    try {
      const res = await apiClient.get<any>(`/Events/${eventId}`);
      const rawData = res.data?.data;
      return {
        data: rawData || null,
        message: res.data?.message,
        statusCode: res.data?.statusCode || 200,
        success: res.data?.success ?? true,
      };
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
