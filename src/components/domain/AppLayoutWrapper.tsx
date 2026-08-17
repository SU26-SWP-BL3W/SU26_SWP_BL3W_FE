"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { NavigationBar } from "./NavigationBar";
import { Footer } from "./Footer";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const { user, activeRole } = useAuth();
  
  const rawRole = activeRole?.roleName || activeRole?.RoleName;
  const userEmail = (user?.email || user?.Email || "").toLowerCase();
  
  let roleName = "";
  if (user?.isAdmin || user?.IsAdmin) {
    roleName = "Admin";
  } else {
    roleName = rawRole || "";
    if (roleName === "EventCoordinator") roleName = "Coordinator";
    if (!roleName) {
      if (userEmail.includes("ec_") || userEmail.includes("ec.") || userEmail.includes("coordinator")) {
        roleName = "Coordinator";
      } else if (userEmail.includes("judge")) {
        roleName = "Judge";
      } else if (userEmail.includes("mentor")) {
        roleName = "Mentor";
      } else {
        roleName = "Guest";
      }
    }
  }

  const isCoordinatorRoute = pathname.includes("/coordinator");
  const isMentorRoute = pathname.includes("/mentor");
  const isJudgeRoute = pathname.includes("/judge");
  const isAdminRoute = pathname.includes("/admin");
  const isEventDetailRoute = pathname.includes("/events/") && (pathname.split("/events/")[1] || "").length > 0;
  const isEventInnerRoute =
    isEventDetailRoute ||
    pathname.includes("/my-team") ||
    pathname.includes("/my-submissions") ||
    pathname.includes("/appeals") ||
    pathname.includes("/leaderboard");

  const isCoordinatorRole = roleName === "Coordinator" || roleName === "EventCoordinator";
  const isMentorRole = roleName === "Mentor";
  const isJudgeRole = roleName === "Judge";
  const isCandidateRole = roleName === "TeamLeader" || roleName === "TeamMember";

  // Sidebar dọc CHỈ xuất hiện khi các route sau được kích hoạt (khớp 100% với NavigationBar.tsx)
  const hasVerticalSidebar =
    isAdminRoute ||
    isCoordinatorRoute ||
    (isEventInnerRoute && isCoordinatorRole) ||
    isMentorRoute ||
    (isEventInnerRoute && isMentorRole) ||
    isJudgeRoute ||
    (isEventInnerRoute && isJudgeRole) ||
    (isEventInnerRoute && isCandidateRole);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] relative">
      <NavigationBar />
      
      <div className={`flex-1 flex flex-col min-w-0 ${hasVerticalSidebar ? "md:pl-64" : ""}`}>
        <main className="flex-1 flex flex-col w-full min-h-0">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
