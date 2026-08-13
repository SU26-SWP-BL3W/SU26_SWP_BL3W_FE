import { useEvents } from "@/repositories/eventsRepository";
import { MOCK_EVENTS } from "@/viewModels/mockEventsData";

export interface JudgeTrackItem {
  eventId: string;
  eventName: string;
  season: string;
  roundName: string;
  trackName: string;
  trackId: string;
  totalSubmissions: number;
  scoredSubmissions: number;
  pendingSubmissions: number;
  status: string;
}

export function useMyAssignedJudgeTracks() {
  const { data: rawEvents, isLoading } = useEvents();

  const events = (Array.isArray(rawEvents) ? rawEvents : (rawEvents as any)?.data) || MOCK_EVENTS;
  const eventsList = Array.isArray(events) && events.length > 0 ? events : MOCK_EVENTS;

  const assignedTracks: JudgeTrackItem[] = [];

  eventsList.forEach((ev) => {
    const tracks = ev.tracks || ["AI & Machine Learning", "Bảo mật & An ninh mạng", "Phát triển Web", "IoT & Phần cứng thông minh"];
    tracks.forEach((track, idx) => {
      assignedTracks.push({
        eventId: ev.id,
        eventName: ev.eventName,
        season: ev.season,
        roundName: "Vòng 2: Bán Kết",
        trackName: track,
        trackId: `track-j-${idx + 1}`,
        totalSubmissions: 12 + idx * 3,
        scoredSubmissions: 8 + idx * 2,
        pendingSubmissions: 4 + idx,
        status: idx === 0 ? "IN_PROGRESS" : "PENDING",
      });
    });
  });

  return {
    assignedTracks,
    isLoading,
  };
}
