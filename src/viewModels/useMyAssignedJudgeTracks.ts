import { useEvents } from "@/repositories/eventsRepository";

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

  const events = (Array.isArray(rawEvents) ? rawEvents : (rawEvents as any)?.data) || [];
  const eventsList = Array.isArray(events) ? events : [];

  const assignedTracks: JudgeTrackItem[] = [];

  eventsList.forEach((ev: any) => {
    const eId = ev.id || ev.Id || ev.eventId || ev.EventId;
    const eName = ev.eventName || ev.EventName || "Sự kiện";
    const eSeason = ev.season || ev.Season || "Mùa giải";
    const rounds = ev.rounds || ev.Rounds || [];

    if (Array.isArray(rounds) && rounds.length > 0) {
      rounds.forEach((round: any, rIdx: number) => {
        const rName = round.roundName || round.RoundName || `Vòng ${rIdx + 1}`;
        const roundTracks = round.tracks || round.Tracks || [];
        if (Array.isArray(roundTracks)) {
          roundTracks.forEach((track: any, tIdx: number) => {
            const tId = typeof track === "object" ? (track.id || track.Id || `track-${eId}-${tIdx}`) : `track-${eId}-${tIdx}`;
            const tName = typeof track === "object" ? (track.trackName || track.TrackName || `Hạng mục ${tIdx + 1}`) : track;
            assignedTracks.push({
              eventId: eId,
              eventName: eName,
              season: eSeason,
              roundName: rName,
              trackName: tName,
              trackId: tId,
              totalSubmissions: 0,
              scoredSubmissions: 0,
              pendingSubmissions: 0,
              status: "PENDING",
            });
          });
        }
      });
    } else {
      const tracks = ev.tracks || ev.Tracks || [];
      if (Array.isArray(tracks)) {
        tracks.forEach((track: any, idx: number) => {
          const tId = typeof track === "object" ? (track.id || track.Id || `track-${eId}-${idx}`) : `track-${eId}-${idx}`;
          const tName = typeof track === "object" ? (track.trackName || track.TrackName || `Hạng mục ${idx + 1}`) : track;
          assignedTracks.push({
            eventId: eId,
            eventName: eName,
            season: eSeason,
            roundName: "Vòng Thi Chính Thức",
            trackName: tName,
            trackId: tId,
            totalSubmissions: 0,
            scoredSubmissions: 0,
            pendingSubmissions: 0,
            status: "PENDING",
          });
        });
      }
    }
  });

  return {
    assignedTracks,
    isLoading,
  };
}
