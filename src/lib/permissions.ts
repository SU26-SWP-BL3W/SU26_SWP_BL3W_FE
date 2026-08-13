import { User, EventRole } from "@/models/entities";

/**
 * Kiểm tra xem người dùng hiện tại có quyền Thao tác (Mutation / Control) trên Sự kiện chỉ định hay không.
 * - Admin: Toàn quyền trên MỌI Sự kiện (Return true).
 * - Event Coordinator / Mentor / Judge: CHỈ ĐƯỢC THAO TÁC trên các Sự kiện mà họ được phân công / mời vào.
 * - Nếu không được phân công ➔ Trả về false (Chỉ cho phép XEM - Read-Only).
 */
export function hasEventPermission(
  user: User | null,
  activeRole: EventRole | null,
  eventId: string = "event-seal-2026"
): boolean {
  if (!user) return false;

  // 1. Admin hệ thống có quyền thao tác trên tất cả các sự kiện
  if (user.IsAdmin || user.isAdmin) {
    return true;
  }

  const roleName = activeRole?.RoleName || activeRole?.roleName;

  // 2. Nếu là Guest hoặc không có vai trò ➔ Không có quyền quản trị
  if (!roleName || roleName === "Guest") {
    return false;
  }

  // 3. Danh sách các sự kiện mà User hiện tại được gán quyền (Assigned Events)
  // Mặc định trong phiên Mock: User được gán quyền cho "event-seal-2026"
  const assignedEventIds: string[] = activeRole?.assignedEventIds ||
    (activeRole as any)?.AssignedEventIds || ["event-seal-2026"];

  return assignedEventIds.includes(eventId);
}
