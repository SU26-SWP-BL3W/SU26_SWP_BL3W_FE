import { CoordinatorEventDetailView } from "@/views/CoordinatorEventDetailView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminEventDetailPage() {
  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <CoordinatorEventDetailView />
    </RoleGuard>
  );
}
