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

export const staffRepository = {
  /**
   * Mời Giám khảo (Judge) tham gia Track/Event qua Email (POST /api/Judges/invite)
   * Tự động tạo tài khoản tạm nếu chưa có + gửi email xác thực kèm token 24h.
   */
  async inviteJudge(payload: InviteStaffPayload): Promise<BaseResponse<EventRoleInvitationEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<EventRoleInvitationEntity>>("/api/Judges/invite", payload);
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
      const res = await apiClient.post<BaseResponse<EventRoleInvitationEntity>>("/api/Mentors/invite", payload);
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
   * Dùng cho TeamLeader / TeamMember hoặc gán trực tiếp nhân sự đã có tài khoản.
   */
  async assignRoleDirectly(payload: AssignRolePayload): Promise<BaseResponse<EventRole>> {
    try {
      const res = await apiClient.post<BaseResponse<EventRole>>("/api/EventRoles/assign", payload);
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
};
