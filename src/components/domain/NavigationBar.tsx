"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Link, useRouter } from "@/i18n/routing";
import { Shield, User, LogOut, Lock } from "lucide-react";

interface NavigationBarProps {
  activePath?: string;
}

export function NavigationBar({ activePath }: NavigationBarProps) {
  const { user, activeRole, logout } = useAuth();
  const router = useRouter();

  const roleName = activeRole?.RoleName || (user?.IsAdmin ? "Admin" : "Guest");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full h-16 border-b border-[var(--border-muted)] bg-[var(--bg-panel)] flex items-center justify-between px-[var(--space-xl)] shrink-0 z-50">
      <div className="flex items-center gap-[var(--space-lg)]">
        <Link href="/" className="font-display font-bold text-lg text-[var(--accent-primary)] tracking-widest uppercase hover:opacity-80 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
          SEAL
        </Link>
        
        <div className="hidden md:flex items-center gap-[var(--space-md)] border-l border-[var(--border-muted)] pl-4">
          <Link href="/" className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
            Trang chủ
          </Link>

          {/* Menu dành riêng cho Role System Admin */}
          {user?.IsAdmin && (
            <>
              <Link href="/admin/dashboard" className="text-xs font-mono text-[var(--color-danger)] font-bold hover:underline">
                [ADM] Quản trị Hệ thống
              </Link>
              <Link href="/admin/events/new" className="text-xs font-mono text-[var(--accent-primary)] hover:underline">
                + Tạo Sự Kiện Mới
              </Link>
            </>
          )}

          {/* Menu dành riêng cho Event Coordinator */}
          {activeRole?.RoleName === "Coordinator" && (
            <>
              <Link href="/coordinator/dashboard" className="text-xs font-mono text-[var(--accent-coordinator)] font-bold hover:underline">
                [COORD] Điều Hành Sự Kiện
              </Link>
            </>
          )}

          {/* Menu dành riêng cho Giám khảo */}
          {activeRole?.RoleName === "Judge" && (
            <>
              <Link href="/judge/events" className="text-xs font-mono text-[var(--accent-judge)] font-bold hover:underline">
                [JUDGE] Chấm Điểm
              </Link>
            </>
          )}

          {/* Menu dành riêng cho Sinh viên / Đội thi */}
          {(activeRole?.RoleName === "TeamLeader" || activeRole?.RoleName === "TeamMember") && (
            <>
              <Link href="/my-team" className="text-xs font-mono text-[var(--accent-team)] hover:underline">
                My Team
              </Link>
              <Link href="/my-submissions" className="text-xs font-mono text-[var(--accent-team)] hover:underline">
                Submissions
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--bg-input)] px-3 py-1 border border-[var(--border-muted)] hud-clipped">
              <User className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="text-xs font-mono text-[var(--text-primary)] font-bold truncate max-w-[160px]">
                {user.FullName}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border uppercase ${
                  user.IsAdmin
                    ? "bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)] border-[var(--color-danger)]"
                    : activeRole?.RoleName === "Coordinator"
                    ? "bg-[rgba(167,139,250,0.1)] text-[var(--accent-coordinator)] border-[var(--accent-coordinator)]"
                    : activeRole?.RoleName === "Judge"
                    ? "bg-[rgba(251,191,36,0.1)] text-[var(--accent-judge)] border-[var(--accent-judge)]"
                    : "bg-[rgba(56,189,248,0.1)] text-[var(--accent-team)] border-[var(--accent-team)]"
                }`}
              >
                [{roleName}]
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-xs font-mono text-[var(--color-danger)] hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Đăng xuất
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="px-3 py-1.5 bg-[var(--accent-primary)] text-[var(--bg-base)] font-mono text-xs font-bold uppercase hud-clipped hover:bg-white transition-colors flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Đăng nhập
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
