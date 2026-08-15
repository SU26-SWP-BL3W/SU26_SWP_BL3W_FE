import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { BaseResponse, PagedResult } from "@/models/types";

export interface EventRoleModel {
  id?: string;
  Id?: string;
  userId?: string;
  UserId?: string;
  eventId?: string;
  EventId?: string;
  trackId?: string;
  TrackId?: string;
  teamId?: string;
  TeamId?: string;
  roleName?: string;
  RoleName?: string;
}

/**
 * Toàn bộ vai trò (EventRole) thật của 1 user (GET /api/EventRoles/user) — dùng để
 * tự suy ra Event/Track được phân công (vd. Mentor/Judge), không hardcode EventId.
 */
export function useGetEventRolesByUserId(userId?: string) {
  return useQuery({
    queryKey: ["event-roles-by-user", userId],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<PagedResult<EventRoleModel>>>("/EventRoles/user", {
        params: { UserId: userId, PageSize: 200 },
      });
      return res.data.data?.data ?? [];
    },
    enabled: !!userId,
  });
}

// ─── Event Role Invitations ───────────────────────────────────

/** POST /api/EventRoles/invitations/{invitationId}/respond — Đồng ý/từ chối lời mời vai trò sự kiện (Judge/Mentor/EventCoordinator) */
export function useRespondEventRoleInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invitationId, isAccepted }: { invitationId: string; isAccepted: boolean }) => {
      const res = await apiClient.post(`/EventRoles/invitations/${invitationId}/respond`, { isAccepted });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    },
  });
}
