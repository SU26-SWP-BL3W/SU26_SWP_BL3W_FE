import { CoordinatorStaffView } from "@/views/CoordinatorStaffView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const metadata = {
  title: "Phân Công Nhân Sự — SEAL Coordinator",
  description: "Mời Giám khảo và Cố vấn tham gia sự kiện qua email",
};

export default function CoordinatorStaffPage() {
  return (
    <RoleGuard allowedRoles={["Coordinator", "Admin"]}>
      <CoordinatorStaffView />
    </RoleGuard>
  );
}
