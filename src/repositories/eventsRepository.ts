import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { Event, Round } from "@/models/entities";
import type { MockRound } from "@/viewModels/mockEventsData";

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

export async function createEvent(data: Partial<Event>): Promise<Event> {
  const response = await apiClient.post<Event>("/Events", data);
  return response.data;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event> {
  const response = await apiClient.put<Event>(`/Events/${id}`, data);
  return response.data;
}
