import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { MockEvent, MockRound } from "@/viewModels/mockEventsData";

export interface EventDTO {
  EventId: string;
  EventName: string;
  Season: string;
  Year: number;
  Tagline?: string;
  Description?: string;
  StartDate: string;
  EndDate: string;
  RegistrationStartDate: string;
  RegistrationEndDate: string;
  MaxTeams: number;
  TeamCount: number;
  TotalPrizeVnd: number;
  Tracks: string[];
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<EventDTO[]>("/Events");
        return res.data;
      } catch {
        // Fallback to mock data if API is not available
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
        const res = await apiClient.get<EventDTO>(`/Events/${eventId}`);
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
        const res = await apiClient.get<MockRound[]>(`/Events/${eventId}/rounds`);
        return res.data;
      } catch {
        return [];
      }
    },
    enabled: !!eventId,
  });
}
