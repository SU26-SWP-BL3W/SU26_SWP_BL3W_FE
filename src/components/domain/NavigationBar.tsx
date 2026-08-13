"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Link } from "@/i18n/routing";
import { getMockTeam } from "@/viewModels/mockTeamData";
import { SealShield } from "./SealShield";

export function NavigationBar() {
  const pathname = usePathname() || "";
  const { user, activeRole, login, logout } = useAuth();
  const roleName = activeRole?.RoleName || (user?.IsAdmin ? "Admin" : "Guest");
  const team = getMockTeam();
  const currentEventId = team?.eventId || "event-seal-2026";

  // Kiểm tra xem người dùng có đang trong Event Workspace không
  const isEventWorkspace =
    pathname.includes("/events/event-") ||
    pathname.includes("/events/seal-") ||
    pathname.includes("/my-team") ||
    pathname.includes("/my-submissions") ||
    pathname.includes("/submissions/") ||
    pathname.includes("/appeals");

  // ─────────────────────────────────────────────────────────────
  // CHẾ ĐỘ 1: NAVBAR DỌC (FIXED LEFT SIDEBAR DOCK) - KHI VÀO SỰ KIỆN
  // ─────────────────────────────────────────────────────────────
  if (isEventWorkspace) {
    return (
      <aside className="w-full md:w-64 bg-[var(--bg-panel)] border-b md:border-b-0 md:border-r border-[var(--border-muted)] flex flex-col justify-between p-5 shrink-0 z-50 md:fixed md:left-0 md:top-0 md:bottom-0">
        <div className="flex flex-col gap-6">
          {/* Brand Logo & Back to Home */}
          <div className="flex flex-col gap-3 pb-4 border-b border-[var(--border-muted)]">
            <Link href="/" className="font-display font-bold text-lg text-[var(--accent-primary)] tracking-widest uppercase flex items-center gap-2">
              <SealShield className="h-6 w-6 text-[var(--accent-primary)]" />
              <span>SEAL WORKSPACE</span>
            </Link>
            <Link
              href="/"
              className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1.5 transition-colors"
            >
              <span>←</span> Quay lại trang chủ portal
            </Link>
          </div>

          {/* Event Status Banner */}
          <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped flex flex-col gap-1">
            <span className="font-mono text-[9px] text-[var(--accent-primary)] font-bold uppercase tracking-widest">
              ĐANG THI ĐẤU
            </span>
            <span className="font-display text-xs font-bold text-[var(--text-primary)] truncate">
              {team?.eventName || "SEAL Hackathon 2026"}
            </span>
            <span className="font-mono text-[10px] text-[var(--accent-team)] font-bold">
              Đội: {team?.name || "CyberGuardians"}
            </span>
          </div>

          {/* Vertical Menu Section */}
          <nav className="flex flex-col gap-1.5 font-mono text-xs">
            <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mb-1">
              ĐIỀU HƯỚNG SỰ KIỆN
            </span>

            <Link
              href={`/events/${currentEventId}`}
              className={`flex items-center gap-2.5 px-3 py-2.5 hud-clipped transition-all font-bold ${
                pathname.includes(`/events/`)
                  ? "bg-[var(--accent-primary)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <span>📍</span> Thể Lệ & Lịch Trình
            </Link>

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
            <span className="text-[var(--accent-team)] font-bold">[{roleName}]</span>
          </div>

          {/* Quick Mock Role Switcher for Testing */}
          <div className="flex items-center justify-between gap-1 p-1.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-[10px]">
            <button onClick={() => login("TeamLeader")} className="text-[var(--accent-team)] font-bold hover:underline">Leader</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("TeamMember")} className="text-[var(--accent-team)] hover:underline">Member</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Judge")} className="text-[var(--accent-judge)] hover:underline">Judge</button>
            <span className="text-[var(--border-muted)]">|</span>
            <button onClick={() => login("Coordinator")} className="text-[var(--accent-coordinator)] hover:underline">Coord</button>
          </div>

          <button
            onClick={logout}
            className="w-full py-1.5 border border-[var(--color-danger)]/40 text-[var(--color-danger)] font-mono text-xs font-bold uppercase hover:bg-[var(--color-danger)]/10 transition-all hud-clipped"
          >
            Đăng xuất
          </button>
        </div>
      </aside>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CHẾ ĐỘ 2: NAVBAR NGANG (HORIZONTAL TOPBAR) - CHO TRANG NGOÀI
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
              pathname.includes("/events")
                ? "text-[var(--accent-primary)] font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Tất cả sự kiện
          </Link>

          {user && (
            <Link
              href={`/events/${currentEventId}`}
              className="text-[var(--accent-primary)] font-bold hover:underline flex items-center gap-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-3 py-1"
            >
              <span>Vào sự kiện đang thi</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Right: Actions / Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--accent-team)] font-bold">
              [{roleName}]
            </span>
            <button
              onClick={logout}
              className="font-mono text-xs text-[var(--color-danger)] hover:underline border border-[var(--color-danger)]/30 px-2.5 py-1"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Role switcher for guest testing */}
            <div className="hidden lg:flex items-center gap-1.5 border border-[var(--border-muted)] px-2 py-1 bg-[var(--bg-input)]">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Role:</span>
              <button onClick={() => login("TeamLeader")} className="text-[10px] font-mono text-[var(--accent-team)] font-bold hover:underline">Leader</button>
              <span className="text-[10px] text-[var(--border-muted)]">|</span>
              <button onClick={() => login("TeamMember")} className="text-[10px] font-mono text-[var(--accent-team)] hover:underline">Member</button>
              <span className="text-[10px] text-[var(--border-muted)]">|</span>
              <button onClick={() => login("Judge")} className="text-[10px] font-mono text-[var(--accent-judge)] hover:underline">Judge</button>
              <span className="text-[10px] text-[var(--border-muted)]">|</span>
              <button onClick={() => login("Coordinator")} className="text-[10px] font-mono text-[var(--accent-coordinator)] hover:underline">Coord</button>
            </div>

            <Link href="/login">
              <button className="hud-clipped px-4 py-2 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent-primary)]/10 transition-all">
                ĐĂNG NHẬP
              </button>
            </Link>
            <Link href="/register">
              <button className="hud-clipped px-4 py-2 bg-[var(--accent-primary)] text-[var(--bg-base)] font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-sm">
                ĐĂNG KÝ
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
