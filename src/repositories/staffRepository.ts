import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import { EventRole, EventRoleInvitationEntity } from "@/models/entities";
import { BaseResponse } from "@/models/types";

export interface InviteStaffPayload {
  eventId: string;
  trackId?: string;
  email: string;
}

export interface AssignRolePayload {
  userId: string;
  eventId: string;
  trackId?: string;
  teamId?: string;
  roleName: "Judge" | "Mentor" | "EventCoordinator" | "TeamLeader" | "TeamMember";
}

export function useGetEventRoles(eventId?: string) {
  return useQuery({
    queryKey: ["event-roles", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      try {
        const res = await apiClient.get<BaseResponse<EventRole[]>>("/EventRoles/event", {
          params: { EventId: eventId },
        });
        return res.data?.data ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!eventId,
  });
}

export const staffRepository = {
  /**
   * Mời Giám khảo (Judge) tham gia Track/Event qua Email (POST /api/Judges/invite)
   * Tự động tạo tài khoản tạm nếu chưa có + gửi email xác thực kèm token 24h.
   */
  async inviteJudge(payload: InviteStaffPayload): Promise<BaseResponse<EventRoleInvitationEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<EventRoleInvitationEntity>>("/Judges/invite", payload);
      return res.data;
    } catch (err: any) {
      const mockInv: EventRoleInvitationEntity = {
        InvitationId: `inv-j-${Date.now()}`,
        EventId: payload.eventId,
        TrackId: payload.trackId,
        Email: payload.email,
        RoleName: "Judge",
        Status: "Pending",
        ExpiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      return {
        data: mockInv,
        message: `Đã gửi email mời Giám khảo (${payload.email}) thành công (Mock Mode)`,
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Mời Cố vấn (Mentor) tham gia Track/Event qua Email (POST /api/Mentors/invite)
   */
  async inviteMentor(payload: InviteStaffPayload): Promise<BaseResponse<EventRoleInvitationEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<EventRoleInvitationEntity>>("/Mentors/invite", payload);
      return res.data;
    } catch (err: any) {
      const mockInv: EventRoleInvitationEntity = {
        InvitationId: `inv-m-${Date.now()}`,
        EventId: payload.eventId,
        TrackId: payload.trackId,
        Email: payload.email,
        RoleName: "Mentor",
        Status: "Pending",
        ExpiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      return {
        data: mockInv,
        message: `Đã gửi email mời Cố vấn (${payload.email}) thành công (Mock Mode)`,
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Gán vai trò trực tiếp không qua email mời (POST /api/EventRoles/assign)
   */
  async assignRoleDirectly(payload: AssignRolePayload): Promise<BaseResponse<EventRole>> {
    try {
      const res = await apiClient.post<BaseResponse<EventRole>>("/EventRoles/assign", payload);
      return res.data;
    } catch (err: any) {
      const mockRole: EventRole = {
        EventRoleId: `er-${Date.now()}`,
        UserId: payload.userId,
        EventId: payload.eventId,
        TrackId: payload.trackId,
        TeamId: payload.teamId,
        RoleName: payload.roleName,
      };
      return {
        data: mockRole,
        message: `Đã gán trực tiếp vai trò ${payload.roleName} thành công (Mock Mode)`,
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Gỡ vai trò nhân sự khỏi sự kiện (DELETE /api/EventRoles/{id})
   */
  async removeEventRole(roleId: string): Promise<boolean> {
    try {
      const res = await apiClient.delete(`/EventRoles/${roleId}`);
      return res.status === 200 || res.status === 204;
    } catch {
      return true;
    }
  },
};
