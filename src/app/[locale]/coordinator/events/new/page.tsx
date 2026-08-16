import { redirect } from "next/navigation";

export default function CreateEventPage() {
  // EC không có quyền khởi tạo Sự kiện Phase 1. Chuyển hướng EC về Dashboard để cấu hình sự kiện được phân công.
  redirect("/coordinator/dashboard");
}
