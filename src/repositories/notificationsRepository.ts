import apiClient from "@/models/apiClient";
import type { BaseResponse } from "@/models/entities";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "danger";
  createdAt: string;
  isRead: boolean;
  linkUrl?: string;
}

export const notificationsRepository = {
  /** Fetch notifications for current authenticated user */
  async getNotifications(): Promise<BaseResponse<SystemNotification[]>> {
    try {
      const res = await apiClient.get<BaseResponse<SystemNotification[]>>("/Notifications/my-notifications");
      return res.data;
    } catch (error: any) {
      console.warn("[SEAL BE-DATA MISSING] GET /api/Notifications/my-notifications error:", error?.message);
      return {
        success: false,
        data: [],
        message: "Chưa có thông báo từ Backend API",
      };
    }
  },

  /** Mark notification as read */
  async markAsRead(notificationId: string): Promise<BaseResponse<boolean>> {
    try {
      const res = await apiClient.put<BaseResponse<boolean>>(`/Notifications/${notificationId}/read`);
      return res.data;
    } catch (error: any) {
      console.warn("[SEAL BE-DATA MISSING] PUT /api/Notifications/" + notificationId + "/read error:", error?.message);
      return { success: false, data: false, message: "Lỗi cập nhật trạng thái thông báo" };
    }
  },
};
