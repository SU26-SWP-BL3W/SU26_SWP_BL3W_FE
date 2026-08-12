"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Link } from "@/i18n/routing";

export function NavigationBar() {
  const { user, activeRole, login, logout } = useAuth();
  const roleName = activeRole?.RoleName || (user?.IsAdmin ? "Admin" : "Guest");

  return (
    <nav className="w-full h-16 border-b border-[var(--border-muted)] bg-[var(--bg-panel)] flex items-center justify-between px-[var(--space-xl)] shrink-0">
      <div className="flex items-center gap-[var(--space-lg)]">
        <Link href="/" className="font-display font-bold text-lg text-[var(--accent-primary)] tracking-widest uppercase hover:opacity-80">
          SEAL
        </Link>
        <div className="hidden md:flex gap-[var(--space-md)]">
          <Link href="/" className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)]">Trang chủ</Link>
          
          {roleName === "TeamLeader" || roleName === "TeamMember" ? (
            <>
              <Link href="/my-team" className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-team)]">My Team</Link>
              <Link href="/my-submissions" className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-team)]">Submissions</Link>
            </>
          ) : null}
          
          {roleName === "Judge" ? (
            <>
              <Link href="/judge/events" className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-judge)]">Chấm điểm</Link>
            </>
          ) : null}
          
          {roleName === "Coordinator" ? (
            <>
              <Link href="/coordinator/dashboard" className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-coordinator)]">Quản lý</Link>
            </>
          ) : null}
        </div>
      </div>
      
      <div className="flex items-center gap-[var(--space-sm)]">
        {user ? (
          <>
            <span className="text-xs font-mono text-[var(--text-muted)] mr-2">
              [{roleName}]
            </span>
            <button onClick={logout} className="text-xs font-mono text-[var(--color-danger)] hover:underline">
              Đăng xuất
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-muted)]">Mock Login:</span>
            <button onClick={() => login("TeamLeader")} className="text-xs font-mono text-[var(--accent-team)] hover:underline">Team</button>
            <button onClick={() => login("Judge")} className="text-xs font-mono text-[var(--accent-judge)] hover:underline">Judge</button>
            <button onClick={() => login("Coordinator")} className="text-xs font-mono text-[var(--accent-coordinator)] hover:underline">Coord</button>
          </div>
        )}
      </div>
    </nav>
  );
}
