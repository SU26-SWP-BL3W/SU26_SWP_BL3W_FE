import { CoordinatorWorkspaceView } from "@/views/CoordinatorWorkspaceView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CoordinatorResultsPage() {
  return (
    <RoleGuard allowedRoles={["Coordinator", "Admin"]}>
      <CoordinatorWorkspaceView />
    </RoleGuard>
  );
}
