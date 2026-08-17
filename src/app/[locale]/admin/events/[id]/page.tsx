import { AdminEditEventView } from "@/views/AdminEditEventView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminEventDetailPage() {
  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <AdminEditEventView />
    </RoleGuard>
  );
}
