import { CoordinatorWorkspaceView } from "@/views/CoordinatorWorkspaceView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CoordinatorAppealsPage() {
  return (
    <RoleGuard allowedRoles={["Coordinator", "Admin"]}>
      <CoordinatorWorkspaceView />
    </RoleGuard>
  );
}
