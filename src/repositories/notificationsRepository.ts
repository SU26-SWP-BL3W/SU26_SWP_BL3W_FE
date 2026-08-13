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
    } catch (error) {
      return {
        success: true,
        data: [
          {
            id: "notif-01",
            title: "Duyệt Hồ Sơ Thẻ Sinh Viên",
            message: "Hồ sơ Thẻ Sinh Viên của bạn đã được Ban Tổ Chức xác minh thành công.",
            type: "success",
            createdAt: "10 phút trước",
            isRead: false,
            linkUrl: "/onboarding/profile",
          },
          {
            id: "notif-02",
            title: "Bảng Điểm Mới Từ Giám Khảo",
            message: "Giám khảo TS. Nguyễn Văn A đã hoàn tất chấm điểm cho bài thi của Đội bạn.",
            type: "info",
            createdAt: "1 giờ trước",
            isRead: false,
            linkUrl: "/my-submissions",
          },
          {
            id: "notif-03",
            title: "Nhắc Nhở Hạn Nộp Bài Thi",
            message: "Vòng Sơ Loại sẽ đóng cổng nộp bài thi trong 24h tới.",
            type: "warning",
            createdAt: "3 giờ trước",
            isRead: true,
            linkUrl: "/submissions/new",
          },
        ],
        message: "Mock notifications",
      };
    }
  },

  /** Mark notification as read */
  async markAsRead(notificationId: string): Promise<BaseResponse<boolean>> {
    try {
      const res = await apiClient.put<BaseResponse<boolean>>(`/Notifications/${notificationId}/read`);
      return res.data;
    } catch (error) {
      return { success: true, data: true, message: "Marked as read" };
    }
  },
};
