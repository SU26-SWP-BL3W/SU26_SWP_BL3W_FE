import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { EventEntity, BaseResponse } from "@/models/entities";
import { MOCK_EVENTS, MockEvent, MockRound } from "@/viewModels/mockEventsData";

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
      return res.data && res.data.length > 0 ? res.data : MOCK_EVENTS;
    },
  });
}

export const useEvents = useGetEvents;

export const eventsRepository = {
  /**
   * Tạo Event mới (Dành cho Admin - POST /Events)
   */
  async createEvent(payload: CreateEventPayload | Partial<EventEntity>): Promise<BaseResponse<EventEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<EventEntity>>("/Events", payload);
      return res.data;
    } catch (err: any) {
      const mockCreated: EventEntity = {
        id: `ev-${Date.now()}`,
        EventId: `ev-${Date.now()}`,
        eventName: (payload as any).eventName || (payload as any).EventName || "Sự kiện Mới",
        season: (payload as any).season || "Mùa Hè",
        year: (payload as any).year || 2026,
        startDate: (payload as any).startDate,
        endDate: (payload as any).endDate,
        minTeamSize: (payload as any).minTeamSize ?? 3,
        maxTeamSize: (payload as any).maxTeamSize ?? 5,
        maxTeams: (payload as any).maxTeams ?? 50,
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
  async getEvents(): Promise<BaseResponse<any[]>> {
    try {
      const res = await apiClient.get<any>("/Events");
      const rawData = res.data?.data;
      let eventsList: any[] = [];

      if (Array.isArray(res.data)) {
        eventsList = res.data;
      } else if (Array.isArray(rawData)) {
        eventsList = rawData;
      } else if (rawData && Array.isArray(rawData.data)) {
        eventsList = rawData.data;
      }

      if (eventsList.length === 0) {
        eventsList = MOCK_EVENTS;
      }

      return {
        data: eventsList,
        message: res.data?.message || "Thành công",
        statusCode: res.data?.statusCode || 200,
        success: res.data?.success ?? true,
      };
    } catch (err: any) {
      return {
        data: MOCK_EVENTS,
        message: "Offline Mock Mode",
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Lấy chi tiết 1 sự kiện theo ID (GET /Events/{id})
   */
  async getEventById(eventId: string): Promise<BaseResponse<any | null>> {
    try {
      const res = await apiClient.get<any>(`/Events/${eventId}`);
      const rawData = res.data?.data ?? res.data;
      return {
        data: rawData || MOCK_EVENTS[0],
        message: res.data?.message,
        statusCode: res.data?.statusCode || 200,
        success: res.data?.success ?? true,
      };
    } catch (err: any) {
      const found = MOCK_EVENTS.find((e) => e.id === eventId) || MOCK_EVENTS[0];
      return {
        data: found,
        message: "Offline Mock Mode",
        statusCode: 200,
        success: true,
      };
    }
  },

  updateEvent: async (id: string, data: Partial<EventEntity>) => {
    try {
      const response = await apiClient.put<EventEntity>(`/Events/${id}`, data);
      return response.data;
    } catch {
      return { id, ...data };
    }
  },
};

export function useEventDetail(eventId: string) {
  return useQuery({
    queryKey: ["event-detail", eventId],
    queryFn: async () => {
      const res = await eventsRepository.getEventById(eventId);
      return res.data;
    },
    enabled: !!eventId,
  });
}

export function useEventRounds(eventId: string) {
  return useQuery({
    queryKey: ["event-rounds", eventId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<MockRound[]>(`/Events/${eventId}/rounds`);
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch {
        // Fallback mock rounds
      }
      const found = MOCK_EVENTS.find((e) => e.id === eventId);
      return found?.rounds ?? MOCK_EVENTS[0].rounds;
    },
    enabled: !!eventId,
  });
}

export async function createEvent(data: Partial<EventEntity>): Promise<any> {
  return eventsRepository.createEvent(data);
}

export async function updateEvent(id: string, data: Partial<EventEntity>): Promise<any> {
  return eventsRepository.updateEvent(id, data);
}
