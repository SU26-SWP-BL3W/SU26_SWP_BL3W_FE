"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useGetTracksByEvent, type TrackWithStaffModel } from "@/repositories/tracksRepository";

export const MENTOR_EVENT_ID = "event-seal-2026";

/**
 * Hạng mục (Track) mà user hiện tại (Mentor) được phân công — suy ra từ mảng
 * Mentors gắn sẵn trên mỗi Track (GET /Tracks/event), không cần endpoint riêng.
 */
export function useMyAssignedTracks() {
  const { user } = useAuth();
  const { data: tracksPage, isLoading, refetch } = useGetTracksByEvent(MENTOR_EVENT_ID);

  const userId = user?.userId || user?.UserID || user?.id;

  const allTracks: TrackWithStaffModel[] = tracksPage?.data ?? [];
  const myTracks = allTracks.filter((t) => {
    const mentors = t.mentors || t.Mentors || [];
    return mentors.some((m) => (m.id || m.Id) === userId);
  });

  return { myTracks, allTracks, isLoading, refetch };
}
