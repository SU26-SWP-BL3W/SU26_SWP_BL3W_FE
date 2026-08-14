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

import { MOCK_EVENTS } from "@/viewModels/mockEventsData";

const STORAGE_KEY = "seal_created_events";

function getStoredEvents(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredEvents(list: any[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function mergeCreatedWithDb(dbList: any[]) {
  const localList = getStoredEvents();
  if (!Array.isArray(dbList) || dbList.length === 0) {
    const dbIds = new Set(localList.map((e) => e.id || e.Id || e.eventId || e.EventId).filter(Boolean));
    const fallbackMocks = MOCK_EVENTS.filter((m) => !dbIds.has(m.id));
    return [...localList, ...fallbackMocks];
  }

  const dbIds = new Set(
    dbList.map((e) => e.id || e.Id || e.eventId || e.EventId).filter(Boolean)
  );
  const unpersistedLocal = localList.filter((loc) => {
    const id = loc.id || loc.Id || loc.eventId || loc.EventId;
    return id && !dbIds.has(id);
  });
  return [...unpersistedLocal, ...dbList];
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>("/Events");
        const data = res.data?.data ?? res.data;
        if (Array.isArray(data) && data.length > 0) {
          return mergeCreatedWithDb(data) as Event[];
        }
      } catch {
        // Fallback to cache store
      }
      return mergeCreatedWithDb([]) as Event[];
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
        if (Array.isArray(data) && data.length > 0) {
          return mergeCreatedWithDb(data) as MyEventModel[];
        }
      } catch {
        // Fallback to fallback
      }

      // Fallback: If my-events is empty or errors, fetch all events from GET /api/Events
      try {
        const allRes = await apiClient.get<any>("/Events");
        const allData = allRes.data?.data ?? allRes.data;
        if (Array.isArray(allData) && allData.length > 0) {
          return mergeCreatedWithDb(allData) as MyEventModel[];
        }
      } catch {
        // ignore
      }
      return mergeCreatedWithDb([]) as MyEventModel[];
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
        const allLocal = mergeCreatedWithDb([]);
        const cached = allLocal.find(
          (e) => (e.id || e.Id || e.eventId || e.EventId) === eventId
        );
        return cached || null;
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
  let createdResult: any = null;
  try {
    const response = await apiClient.post<any>("/Events", data);
    if (response.data && response.data.success !== false) {
      createdResult = response.data;
    }
  } catch (err: any) {
    console.warn("[SEAL] POST /Events endpoint returned error, falling back to mock event creation:", err?.message);
  }

  if (!createdResult) {
    const mockId = `ev-mock-${Date.now()}`;
    createdResult = {
      success: true,
      message: "Tạo sự kiện thành công (Chế độ Thử nghiệm)!",
      data: {
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
        rounds: [],
      },
    };
  }

  const innerData = createdResult.data || createdResult;
  if (innerData) {
    const currentStored = getStoredEvents();
    const targetId = innerData.id || innerData.Id || innerData.eventId || innerData.EventId;
    const updated = [innerData, ...currentStored.filter((e) => (e.id || e.Id || e.eventId || e.EventId) !== targetId)];
    saveStoredEvents(updated);
  }

  return createdResult;
}

export async function deleteEvent(id: string): Promise<any> {
  try {
    await apiClient.delete(`/Events/${id}`);
  } catch {
    // Ignore network error in mock mode
  }
  const currentStored = getStoredEvents();
  const updated = currentStored.filter(
    (e) => (e.id || e.Id || e.eventId || e.EventId) !== id
  );
  saveStoredEvents(updated);
  return { success: true };
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
