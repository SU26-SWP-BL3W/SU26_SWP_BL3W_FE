import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { Event, Round } from "@/models/entities";
import type { EventRoundItem } from "@/viewModels/eventsMetadata";

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

export function usePublicEvents() {
  return useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>("/Events/upcoming", { params: { PageSize: 50 } });
        return res.data?.data?.data || res.data?.data || res.data || [];
      } catch {
        const res = await apiClient.get<any>("/Events");
        return res.data?.data || res.data || [];
      }
    },
  });
}

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
    return localList;
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
      } catch (err: any) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/Events error:", err?.message);
      }
      const localEvents = mergeCreatedWithDb([]);
      if (localEvents.length === 0) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/Events returned 0 items from Backend DB.");
      }
      return localEvents as Event[];
    },
  });
}

export function useMyEvents() {
  return useQuery({
    queryKey: ["my-events"],
    queryFn: async (): Promise<MyEventModel[]> => {
      try {
        const res = await apiClient.get<any>("/Events/my-events");
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
          ? raw.items
          : [];

        return list as MyEventModel[];
      } catch (err: any) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/Events/my-events error:", err?.message);
      }
      return [];
    },
  });
}

export function useEventDetail(eventId: string) {
  return useQuery({
    queryKey: ["event-detail", eventId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<Event>(`/Events/${eventId}`);
        if (res.data) return res.data;
      } catch (err: any) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/Events/" + eventId + " error:", err?.message);
      }
      const allLocal = mergeCreatedWithDb([]);
      const cached = allLocal.find(
        (e) => (e.id || e.Id || e.eventId || e.EventId) === eventId
      );
      if (!cached) {
        console.warn("[SEAL BE-DATA MISSING] Event detail not found in Real API for ID:", eventId);
      }
      return cached || null;
    },
    enabled: !!eventId,
  });
}

export function useEventRounds(eventId: string) {
  return useQuery({
    queryKey: ["event-rounds", eventId],
    queryFn: async () => {
      const res = await apiClient.get<any>(`/Rounds/event`, {
        params: { EventId: eventId, PageSize: 100 },
      });
      const data = res.data?.data?.data || res.data?.data?.items || res.data?.data || res.data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!eventId,
  });
}

export async function createEvent(data: Partial<Event>): Promise<any> {
  try {
    const response = await apiClient.post<any>("/Events", data);
    const createdResult = response.data;

    const innerData = createdResult?.data || createdResult;
    if (innerData) {
      const currentStored = getStoredEvents();
      const targetId = innerData.id || innerData.Id || innerData.eventId || innerData.EventId;
      if (targetId) {
        const updated = [innerData, ...currentStored.filter((e) => (e.id || e.Id || e.eventId || e.EventId) !== targetId)];
        saveStoredEvents(updated);
      }
    }

    return createdResult;
  } catch (err: any) {
    const responseData = err?.response?.data;
    let msg = responseData?.message || err?.message;

    const rawErrorDetail = responseData?.details || responseData?.data || responseData?.errors || responseData?.errorMessage;

    if (rawErrorDetail) {
      if (typeof rawErrorDetail === "string") {
        msg = `${msg}: ${rawErrorDetail}`;
      } else if (Array.isArray(rawErrorDetail)) {
        const parsedMsgs = rawErrorDetail.map((item: any) => {
          if (typeof item === "string") return item;
          if (item?.Key || item?.key || item?.KeyName) {
            const k = item.Key || item.key || item.KeyName;
            const vRaw = item.Value ?? item.value;
            const vals = Array.isArray(vRaw) ? vRaw.join(", ") : String(vRaw ?? "");
            return `${k}: ${vals}`;
          }
          if (item?.ErrorMessage || item?.errorMessage) return item.ErrorMessage || item.errorMessage;
          return JSON.stringify(item);
        });
        if (parsedMsgs.length > 0) msg = `${msg} (${parsedMsgs.join("; ")})`;
      } else if (typeof rawErrorDetail === "object") {
        const parsedMsgs = Object.entries(rawErrorDetail).map(([k, v]: [string, any]) => {
          const vals = Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v);
          return `${k}: ${vals}`;
        });
        if (parsedMsgs.length > 0) msg = `${msg} (${parsedMsgs.join("; ")})`;
      }
    }

    return {
      success: false,
      message: msg || "Tạo sự kiện thất bại. Dữ liệu chưa đúng định dạng yêu cầu từ máy chủ.",
    };
  }
}

export async function deleteEvent(id: string): Promise<any> {
  try {
    await apiClient.delete(`/Events/${id}`);
  } catch {
    // Ignore network error in local mode
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
