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

  return (
    <nav className="w-full h-16 border-b border-[var(--border-muted)] bg-[var(--bg-panel)] flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
      
      {/* Left: Brand & Navigation */}
      <div className="flex items-center gap-6 md:gap-8">
        <Link href="/" className="font-display font-bold text-lg text-[var(--accent-primary)] tracking-widest uppercase hover:opacity-80 flex items-center gap-2">
          <SealShield className="h-6 w-6 text-[var(--accent-primary)]" />
          <span>SEAL</span>
        </Link>

        <div className="hidden md:flex gap-4 items-center font-mono text-xs">
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
              pathname.includes("/events") && !pathname.includes("event-")
                ? "text-[var(--accent-primary)] font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Tất cả sự kiện
          </Link>
          
          {roleName === "TeamLeader" || roleName === "TeamMember" ? (
            <>
              <Link
                href={`/events/${currentEventId}`}
                className="text-[var(--accent-primary)] hover:underline font-bold flex items-center gap-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-2.5 py-1"
              >
                <span>Sự kiện đang thi</span>
                <span className="text-[10px]">↗</span>
              </Link>
              <Link
                href="/my-team"
                className={`transition-colors ${
                  pathname.includes("/my-team") ? "text-[var(--accent-team)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--accent-team)]"
                }`}
              >
                My Team
              </Link>
              <Link
                href="/my-submissions"
                className={`transition-colors ${
                  pathname.includes("/my-submissions") ? "text-[var(--accent-team)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--accent-team)]"
                }`}
              >
                Submissions
              </Link>
            </>
          ) : null}
          
          {roleName === "Judge" ? (
            <Link href="/judge/events" className="text-[var(--accent-judge)] hover:underline font-bold">
              Chấm điểm
            </Link>
          ) : null}
          
          {roleName === "Coordinator" ? (
            <Link href="/coordinator/dashboard" className="text-[var(--accent-coordinator)] hover:underline font-bold">
              Quản lý BTC
            </Link>
          ) : null}
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
            {/* Quick Mock Login role switcher for testing */}
            <div className="hidden lg:flex items-center gap-1.5 border border-[var(--border-muted)] px-2 py-1 bg-[var(--bg-input)]">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Role:</span>
              <button onClick={() => login("TeamLeader")} className="text-[10px] font-mono text-[var(--accent-team)] hover:underline">Team</button>
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
              <button className="hud-clipped px-4 py-2 bg-[var(--accent-primary)] text-[var(--bg-base)] font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm">
                ĐĂNG KÝ
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
