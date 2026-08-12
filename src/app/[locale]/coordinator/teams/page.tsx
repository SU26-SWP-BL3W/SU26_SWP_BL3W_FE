import { CoordinatorTeamsView } from "@/views/CoordinatorTeamsView";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const metadata = {
  title: "Duyệt Đội Thi — SEAL Coordinator",
  description: "Phê duyệt các đội thi đăng ký tham gia SEAL Hackathon",
};

export default function CoordinatorTeamsPage() {
  return (
    <RoleGuard allowedRoles={["Coordinator", "Admin"]}>
      <CoordinatorTeamsView />
    </RoleGuard>
  );
}
