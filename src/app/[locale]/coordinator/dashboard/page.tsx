import { CoordinatorDashboardView } from "@/views/CoordinatorDashboardView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CoordinatorDashboardPage() {
  return (
    <RoleGuard allowedRoles={["Coordinator", "Admin"]}>
      <CoordinatorDashboardView />
    </RoleGuard>
  );
}
