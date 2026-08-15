"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useGetEventRolesByUserId } from "@/repositories/eventRolesRepository";
import apiClient from "@/models/apiClient";
import { useQueries } from "@tanstack/react-query";
import type { BaseResponse, PagedResult } from "@/models/types";
import type { TrackWithStaffModel } from "@/repositories/tracksRepository";

async function fetchTracksByEvent(eventId: string): Promise<TrackWithStaffModel[]> {
  try {
    const res = await apiClient.get<BaseResponse<PagedResult<TrackWithStaffModel>>>("/Tracks/event", {
      params: { EventId: eventId, PageSize: 100 },
    });
    return res.data.data?.data ?? [];
  } catch {
    return [];
  }
}

/**
 * Hạng mục (Track) mà user hiện tại (Mentor) được phân công — suy ra THẬT từ
 * GET /EventRoles/user (vai trò Mentor kèm TrackId), không hardcode 1 Event cố định.
 * Mentor có thể được phân công ở nhiều Event khác nhau: mỗi Event liên quan được
 * gọi GET /Tracks/event riêng (song song), rồi lọc lại đúng các Track có TrackId
 * khớp với vai trò Mentor của user.
 */
export function useMyAssignedTracks() {
  const { user } = useAuth();
  const userId = user?.userId || user?.UserID || user?.id;

  const { data: myRoles = [], isLoading: isLoadingRoles, refetch: refetchRoles } = useGetEventRolesByUserId(userId);

  const mentorRoles = myRoles.filter((r) => (r.roleName || r.RoleName) === "Mentor");

  const mentorTrackIds = new Set(mentorRoles.map((r) => r.trackId || r.TrackId).filter(Boolean) as string[]);

  const eventIds = Array.from(new Set(mentorRoles.map((r) => r.eventId || r.EventId).filter(Boolean) as string[]));

  const trackQueries = useQueries({
    queries: eventIds.map((eventId) => ({
      queryKey: ["tracks-by-event", eventId],
      queryFn: () => fetchTracksByEvent(eventId),
      enabled: !!eventId,
    })),
  });

  const isLoadingTracks = trackQueries.some((q) => q.isLoading);
  // Danh sách nhỏ (vài chục Track) — không cần memo hoá, tính lại mỗi render là đủ rẻ.
  const allTracks: TrackWithStaffModel[] = trackQueries.flatMap((q) => q.data ?? []);
  const myTracks = allTracks.filter((t) => mentorTrackIds.has((t.id || t.Id) as string));

  const refetch = () => {
    refetchRoles();
    trackQueries.forEach((q) => q.refetch());
  };

  return { myTracks, allTracks, isLoading: isLoadingRoles || isLoadingTracks, refetch };
}
