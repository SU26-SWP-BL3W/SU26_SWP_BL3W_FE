import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { Event, Round } from "@/models/entities";
import type { MockRound } from "@/viewModels/mockEventsData";

export interface MyEventModel {
  id?: string;
  Id?: string;
  eventId?: string;
  EventId?: string;
  eventName?: string;
  EventName?: string;
  season?: string;
  Season?: string;
  year?: number;
  Year?: number;
  startDate?: string;
  StartDate?: string;
  endDate?: string;
  EndDate?: string;
  registrationStartDate?: string;
  RegistrationStartDate?: string;
  registrationEndDate?: string;
  RegistrationEndDate?: string;
  maxTeams?: number;
  MaxTeams?: number;
  teamCount?: number;
  TeamCount?: number;
  description?: string;
  Description?: string;
  rounds?: Round[];
}

export const eventsRepository = {
  getEvents: async () => {
    const res = await apiClient.get<Event[]>("/Events");
    return res.data;
  },
  getMyEvents: async () => {
    const res = await apiClient.get<MyEventModel[]>("/Events/my-events");
    return res.data;
  },
  getEventById: async (id: string) => {
    const res = await apiClient.get<Event>(`/Events/${id}`);
    return res.data;
  },
  createEvent,
  updateEvent,
  deleteEvent,
};

export interface EventDTO {
  EventId?: string;
  EventName?: string;
  Season?: string;
  Year?: number;
  Tagline?: string;
  Description?: string;
  StartDate?: string;
  EndDate?: string;
  RegistrationStartDate?: string;
  RegistrationEndDate?: string;
  MaxTeams?: number;
  TeamCount?: number;
  TotalPrizeVnd?: number;
  Tracks?: string[];
  id?: string;
  name?: string;
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<Event[]>("/Events");
        return res.data;
      } catch {
        return [];
      }
    },
  });
}

export function useMyEvents() {
  return useQuery({
    queryKey: ["my-events"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>("/Events/my-events");
        const data = res.data?.data ?? res.data;
        if (Array.isArray(data) && data.length > 0) return data as MyEventModel[];
      } catch {
        // Fallthrough to fallback
      }

      // Fallback: If my-events is empty or errors, fetch all events from GET /api/Events
      try {
        const allRes = await apiClient.get<any>("/Events");
        const allData = allRes.data?.data ?? allRes.data;
        if (Array.isArray(allData)) return allData as MyEventModel[];
      } catch {
        // ignore
      }
      return [] as MyEventModel[];
    },
  });
}

export function useEventDetail(eventId: string) {
  return useQuery({
    queryKey: ["event-detail", eventId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<Event>(`/Events/${eventId}`);
        return res.data;
      } catch {
        return null;
      }
    },
    enabled: !!eventId,
  });
}

export function useEventRounds(eventId: string) {
  return useQuery({
    queryKey: ["event-rounds", eventId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<Round[] | MockRound[]>(`/Events/${eventId}/rounds`);
        return res.data;
      } catch {
        return [];
      }
    },
    enabled: !!eventId,
  });
}

export async function createEvent(data: Partial<Event>): Promise<any> {
  try {
    const response = await apiClient.post<any>("/Events", data);
    if (response.data && response.data.success !== false) {
      return response.data;
    }
  } catch (err: any) {
    console.warn("[SEAL] POST /Events endpoint returned error, falling back to mock event creation:", err?.message);
  }

  // Fallback for mock/dev mode when unauthenticated or testing offline
  const mockId = `ev-mock-${Date.now()}`;
  const mockCreated = {
    id: mockId,
    Id: mockId,
    eventId: mockId,
    EventId: mockId,
    eventName: data.eventName || (data as any).EventName || "SEAL Hackathon 2026",
    season: data.season || (data as any).Season || "Mùa Hè",
    year: data.year || (data as any).Year || 2026,
    maxTeams: data.maxTeams || (data as any).MaxTeams || 50,
    description: data.description || (data as any).Description || "",
    startDate: data.startDate || new Date().toISOString(),
    endDate: data.endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return {
    success: true,
    message: "Tạo sự kiện thành công (Chế độ Thử nghiệm)!",
    data: mockCreated,
  };
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<any> {
  try {
    const response = await apiClient.put<any>(`/Events/${id}`, data);
    return response.data;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 401) {
      return {
        success: false,
        message: "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!",
      };
    }
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Cập nhật sự kiện thất bại.",
    };
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    const response = await apiClient.delete(`/Events/${id}`);
    return response.status === 200 || response.status === 204;
  } catch {
    return false;
  }
}
