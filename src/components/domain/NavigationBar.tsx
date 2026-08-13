"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Link } from "@/i18n/routing";
import { getMockTeam } from "@/viewModels/mockTeamData";
import { SealShield } from "./SealShield";
import { NotificationBell } from "./NotificationBell";

export function NavigationBar() {
  const pathname = usePathname() || "";
  const { user, activeRole, login, logout } = useAuth();
  const roleName = activeRole?.RoleName || (user?.IsAdmin ? "Admin" : "Guest");
  const team = getMockTeam();
  const currentEventId = team?.eventId || "event-seal-2026";

  // XÁC ĐỊNH NGHIỆP VỤ RENDER THANH NAVBAR DỌC HOẶC NGANG
  // 1. Sidebar Dọc (Vertical Panel) CHỈ RENDER khi đang nằm trong trang Dashboard / Workspace chuyên biệt:
  const isCoordinatorRoute = pathname.includes("/coordinator");
  const isMentorRoute = pathname.includes("/mentor");
  const isAdminRoute = pathname.includes("/admin");

  const showCoordinatorSidebar = isCoordinatorRoute;
  const showMentorSidebar = isMentorRoute;

  // ─────────────────────────────────────────────────────────────
  // CHẾ ĐỘ 1A: NAVBAR DỌC DÀNH RIÊNG CHO EVENT COORDINATOR (BTC)
  // ─────────────────────────────────────────────────────────────
  if (showCoordinatorSidebar) {
    return (
      <aside className="w-full md:w-64 bg-[var(--bg-panel)] border-b md:border-b-0 md:border-r border-[#a855f7]/40 flex flex-col justify-between p-5 shrink-0 z-50 md:fixed md:left-0 md:top-0 md:bottom-0">
        <div className="flex flex-col gap-6">
          {/* Brand Logo & Notification Bell */}
          <div className="flex flex-col gap-3 pb-4 border-b border-[var(--border-muted)]">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-display font-bold text-lg text-[#a855f7] tracking-widest uppercase flex items-center gap-2">
                <SealShield className="h-6 w-6 text-[#a855f7]" />
                <span>COORD PANEL</span>
              </Link>
              <NotificationBell align="left" />
            </div>
            <Link
              href="/"
              className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[#a855f7] flex items-center gap-1.5 transition-colors"
            >
              <span>←</span> Quay lại trang chủ
            </Link>
          </div>

          {/* Coordinator Profile Card */}
          <div className="p-3 bg-[var(--bg-input)] border border-[#a855f7]/40 hud-clipped flex flex-col gap-1">
            <span className="font-mono text-[9px] text-[#a855f7] font-bold uppercase tracking-widest">
              EVENT COORDINATOR
            </span>
            <span className="font-display text-xs font-bold text-[var(--text-primary)] truncate">
              {user?.FullName || "Trần Văn Điều Phối"}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              Sự kiện: SEAL Hackathon 2026
            </span>
          </div>

          {/* Vertical Coordinator Menu Section */}
          <nav className="flex flex-col gap-1.5 font-mono text-xs">
            <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mb-1">
              MENU BAN TỔ CHỨC
            </span>

            <Link
              href="/coordinator/dashboard"
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname === "/coordinator/dashboard"
                  ? "bg-[#a855f7] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>🎯</span> Control Center BTC
            </Link>

            <Link
              href="/coordinator/events/new"
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/events/new")
                  ? "bg-[var(--accent-primary)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>⚡</span> Tạo Sự Kiện Mới (Wizard)
            </Link>

            <Link
              href={`/events/${currentEventId}/leaderboard`}
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/leaderboard")
                  ? "bg-[var(--accent-judge)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-judge)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>🏆</span> Bảng Xếp Hạng Giải
            </Link>
          </nav>
        </div>

        {/* Bottom User Info & Role Switcher */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-[var(--border-muted)]">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--text-muted)]">Vai trò:</span>
            <span className="text-[#a855f7] font-bold">Coordinator</span>
          </div>

          {/* Role Switcher Bar */}
          <div className="flex items-center justify-between gap-1 p-1.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-[10px]">
            <button onClick={() => login("TeamLeader")} className="text-[var(--accent-team)] font-bold hover:underline" title="Đội Trưởng">Leader</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("TeamMember")} className="text-[var(--accent-team)] hover:underline" title="Thành Viên">Member</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Mentor")} className="text-[#2dd4bf] font-bold hover:underline" title="Cố Vấn">Mentor</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Judge")} className="text-[var(--accent-judge)] hover:underline" title="Giám Khảo">Judge</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Coordinator")} className="text-[#a855f7] font-bold hover:underline" title="Ban Tổ Chức">Coord</button>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full py-2 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/50 text-[var(--color-danger)] font-mono text-xs font-bold uppercase hover:bg-[var(--color-danger)] hover:text-white transition-all hud-clipped cursor-pointer relative z-50 mb-4"
          >
            🚪 ĐĂNG XUẤT
          </button>
        </div>
      </aside>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CHẾ ĐỘ 1B: NAVBAR DỌC DÀNH RIÊNG CHO MENTOR CỐ VẤN
  // ─────────────────────────────────────────────────────────────
  if (showMentorSidebar) {
    return (
      <aside className="w-full md:w-64 bg-[var(--bg-panel)] border-b md:border-b-0 md:border-r border-[#2dd4bf]/30 flex flex-col justify-between p-5 shrink-0 z-50 md:fixed md:left-0 md:top-0 md:bottom-0">
        <div className="flex flex-col gap-6">
          {/* Brand Logo & Notification Bell */}
          <div className="flex flex-col gap-3 pb-4 border-b border-[var(--border-muted)]">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-display font-bold text-lg text-[#2dd4bf] tracking-widest uppercase flex items-center gap-2">
                <SealShield className="h-6 w-6 text-[#2dd4bf]" />
                <span>MENTOR PANEL</span>
              </Link>
              <NotificationBell />
            </div>
            <Link
              href="/"
              className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[#2dd4bf] flex items-center gap-1.5 transition-colors"
            >
              <span>←</span> Quay lại trang chủ
            </Link>
          </div>

          {/* Mentor Profile Card */}
          <div className="p-3 bg-[var(--bg-input)] border border-[#2dd4bf]/40 hud-clipped flex flex-col gap-1">
            <span className="font-mono text-[9px] text-[#2dd4bf] font-bold uppercase tracking-widest">
              MENTOR CỐ VẤN
            </span>
            <span className="font-display text-xs font-bold text-[var(--text-primary)] truncate">
              {user?.FullName || "Cố Vấn Chuyên Môn"}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              Phân công: AI & Machine Learning
            </span>
          </div>

          {/* Vertical Mentor Menu Section */}
          <nav className="flex flex-col gap-1.5 font-mono text-xs">
            <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mb-1">
              MENU CỐ VẤN
            </span>

            <Link
              href="/mentor/tracks"
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/mentor")
                  ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>🎯</span> Bàn Làm Việc Cố Vấn
            </Link>

            <Link
              href={`/events/${currentEventId}/leaderboard`}
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/leaderboard")
                  ? "bg-[var(--accent-judge)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-judge)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>🏆</span> Bảng Xếp Hạng Track
            </Link>
          </nav>
        </div>

        {/* Bottom User Info & Role Switcher */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-[var(--border-muted)]">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--text-muted)]">Vai trò:</span>
            <span className="text-[#2dd4bf] font-bold">Mentor</span>
          </div>

          {/* Role Switcher Bar */}
          <div className="flex items-center justify-between gap-1 p-1.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-[10px]">
            <button onClick={() => login("TeamLeader")} className="text-[var(--accent-team)] font-bold hover:underline" title="Đội Trưởng">Leader</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("TeamMember")} className="text-[var(--accent-team)] hover:underline" title="Thành Viên">Member</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Mentor")} className="text-[#2dd4bf] font-bold hover:underline" title="Cố Vấn">Mentor</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Judge")} className="text-[var(--accent-judge)] hover:underline" title="Giám Khảo">Judge</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Coordinator")} className="text-[var(--accent-coordinator)] hover:underline" title="Ban Tổ Chức">Coord</button>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full py-2 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/50 text-[var(--color-danger)] font-mono text-xs font-bold uppercase hover:bg-[var(--color-danger)] hover:text-white transition-all hud-clipped cursor-pointer relative z-50 mb-4"
          >
            🚪 ĐĂNG XUẤT
          </button>
        </div>
      </aside>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CHẾ ĐỘ 1C: NAVBAR DỌC KHI THÍ SINH VÀO DÀNH RIÊNG CHO WORKSPACE ĐỘI THI
  // ─────────────────────────────────────────────────────────────
  const isParticipantWorkspaceRoute =
    pathname.includes("/my-team") ||
    pathname.includes("/my-submissions") ||
    pathname.includes("/appeals");

  if (isParticipantWorkspaceRoute && roleName !== "Guest") {
    return (
      <aside className="w-full md:w-64 bg-[var(--bg-panel)] border-b md:border-b-0 md:border-r border-[var(--border-muted)] flex flex-col justify-between p-5 shrink-0 z-50 md:fixed md:left-0 md:top-0 md:bottom-0">
        <div className="flex flex-col gap-6">
          {/* Brand Logo & Notification Bell */}
          <div className="flex flex-col gap-3 pb-4 border-b border-[var(--border-muted)]">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-display font-bold text-lg text-[var(--accent-primary)] tracking-widest uppercase flex items-center gap-2">
                <SealShield className="h-6 w-6 text-[var(--accent-primary)]" />
                <span>SEAL WORKSPACE</span>
              </Link>
              <NotificationBell align="left" />
            </div>
            <Link
              href="/"
              className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1.5 transition-colors"
            >
              <span>←</span> Quay lại trang chủ
            </Link>
          </div>

          {/* Event Status Banner */}
          <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped flex flex-col gap-1">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">
              ĐẢNG THI ĐẤU
            </span>
            <span className="font-display text-xs font-bold text-[var(--text-primary)] truncate">
              {team?.eventName || "SEAL Hackathon 2026"}
            </span>
            <span className="font-mono text-[10px] font-bold text-[var(--accent-team)]">
              Đội: {team?.name || "Cyber_Knights"}
            </span>
          </div>

          {/* Vertical Menu Section */}
          <nav className="flex flex-col gap-1.5 font-mono text-xs">
            <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mb-1">
              ĐIỀU HƯỚNG SỰ KIỆN
            </span>

            <Link
              href="/my-team"
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/my-team")
                  ? "bg-[var(--accent-team)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-team)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>👥</span> Quản Lý Đội Thi
            </Link>

            <Link
              href="/my-submissions"
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/my-submissions") || pathname.includes("/submissions/")
                  ? "bg-[var(--accent-team)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-team)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>📤</span> Bài Nộp Của Đội
            </Link>

            <Link
              href={`/events/${currentEventId}/leaderboard`}
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/leaderboard")
                  ? "bg-[var(--accent-judge)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-judge)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>🏆</span> Bảng Xếp Hạng
            </Link>

            <Link
              href="/appeals"
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes("/appeals")
                  ? "bg-[var(--accent-coordinator)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-coordinator)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>⚖</span> Phúc Khảo & Khiếu Nại
            </Link>
          </nav>
        </div>

        {/* Bottom User Info & Role Switcher */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-[var(--border-muted)]">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--text-muted)]">Vai trò:</span>
            <span className="text-[var(--accent-team)] font-bold">{roleName}</span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full py-2 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/50 text-[var(--color-danger)] font-mono text-xs font-bold uppercase hover:bg-[var(--color-danger)] hover:text-white transition-all hud-clipped cursor-pointer relative z-50 mb-4"
          >
            🚪 ĐĂNG XUẤT
          </button>
        </div>
      </aside>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CHẾ ĐỘ 2: NAVBAR NGANG (HORIZONTAL TOPBAR) - MỌI VAI TRÒ Ở TRANG NGOÀI
  // ─────────────────────────────────────────────────────────────
  return (
    <nav className="w-full h-16 border-b border-[var(--border-muted)] bg-[var(--bg-panel)] flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
      
      {/* Left: Brand & Main Navigation Links */}
      <div className="flex items-center gap-6 md:gap-8">
        <Link href="/" className="font-display font-bold text-lg text-[var(--accent-primary)] tracking-widest uppercase hover:opacity-80 flex items-center gap-2">
          <SealShield className="h-6 w-6 text-[var(--accent-primary)]" />
          <span>SEAL</span>
        </Link>

        <div className="hidden md:flex gap-5 items-center font-mono text-xs">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/" || pathname.endsWith("/vi") || pathname.endsWith("/en")
                ? "text-[var(--accent-primary)] font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Trang chủ
          </Link>

          <Link
            href="/events"
            className={`transition-colors ${
              pathname.includes("/events") && !pathname.includes("/leaderboard")
                ? "text-[var(--accent-primary)] font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Khám phá Sự kiện
          </Link>

          <Link
            href="/leaderboard"
            className={`transition-colors ${
              pathname.includes("/leaderboard")
                ? "text-[var(--accent-judge)] font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Bảng Xếp Hạng
          </Link>

          {/* Quick Access Link based on Active Role */}
          {roleName === "Coordinator" && (
            <Link
              href="/coordinator/dashboard"
              className="text-[#a855f7] font-bold hover:underline flex items-center gap-1 bg-[#a855f7]/10 border border-[#a855f7]/30 px-3 py-1 hud-clipped"
            >
              <span>🎯 Control Center BTC</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {roleName === "Mentor" && (
            <Link
              href="/mentor/tracks"
              className="text-[#2dd4bf] font-bold hover:underline flex items-center gap-1 bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-3 py-1 hud-clipped"
            >
              <span>💼 Bàn Làm Việc Mentor</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {roleName === "Judge" && (
            <Link
              href="/judge/scoring"
              className="text-[var(--accent-judge)] font-bold hover:underline flex items-center gap-1 bg-[var(--accent-judge)]/10 border border-[var(--accent-judge)]/30 px-3 py-1 hud-clipped"
            >
              <span>⚖ Bàn Chấm Giám Khảo</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {roleName === "Admin" && (
            <Link
              href="/admin/dashboard"
              className="text-[var(--color-danger)] font-bold hover:underline flex items-center gap-1 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 px-3 py-1 hud-clipped"
            >
              <span>👑 Bảng Điều Hành Admin</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {(roleName === "TeamLeader" || roleName === "TeamMember") && (
            <Link
              href="/my-team"
              className="text-[var(--accent-team)] font-bold hover:underline flex items-center gap-1 bg-[var(--accent-team)]/10 border border-[var(--accent-team)]/30 px-3 py-1 hud-clipped"
            >
              <span>👥 Đội Thi Của Tôi</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Right: Notification & Role Switcher */}
      <div className="flex items-center gap-4">
        <NotificationBell align="right" />

        {/* Role Switcher Demo Control Bar */}
        <div className="hidden lg:flex items-center gap-1.5 border border-[var(--border-muted)] px-2 py-1 bg-[var(--bg-input)] font-mono text-[10px] hud-clipped">
          <span className="text-[var(--text-muted)] font-bold">Role:</span>
          <button onClick={() => login("TeamLeader")} className={`hover:underline ${roleName === "TeamLeader" ? "text-[var(--accent-team)] font-bold" : "text-[var(--text-muted)]"}`}>Leader</button>
          <span className="text-[var(--border-muted)]">|</span>
          <button onClick={() => login("TeamMember")} className={`hover:underline ${roleName === "TeamMember" ? "text-[var(--accent-team)] font-bold" : "text-[var(--text-muted)]"}`}>Member</button>
          <span className="text-[var(--border-muted)]">|</span>
          <button onClick={() => login("Mentor")} className={`hover:underline ${roleName === "Mentor" ? "text-[#2dd4bf] font-bold" : "text-[var(--text-muted)]"}`}>Mentor</button>
          <span className="text-[var(--border-muted)]">|</span>
          <button onClick={() => login("Judge")} className={`hover:underline ${roleName === "Judge" ? "text-[var(--accent-judge)] font-bold" : "text-[var(--text-muted)]"}`}>Judge</button>
          <span className="text-[var(--border-muted)]">|</span>
          <button onClick={() => login("Coordinator")} className={`hover:underline ${roleName === "Coordinator" ? "text-[#a855f7] font-bold" : "text-[var(--text-muted)]"}`}>Coord</button>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="font-mono text-xs text-[var(--color-danger)] hover:underline border border-[var(--color-danger)]/30 px-2.5 py-1 hud-clipped cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 font-mono text-xs">
            <Link href="/login">
              <button className="hud-clipped px-3.5 py-1.5 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] font-bold uppercase tracking-wider hover:bg-[var(--accent-primary)]/10 transition-all cursor-pointer">
                ĐĂNG NHẬP
              </button>
            </Link>
            <Link href="/register">
              <button className="hud-clipped px-3.5 py-1.5 bg-[var(--accent-primary)] text-[var(--bg-base)] font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm cursor-pointer">
                ĐĂNG KÝ
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
