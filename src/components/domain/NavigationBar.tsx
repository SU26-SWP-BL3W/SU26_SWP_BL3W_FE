"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/AuthProvider";
import { NotificationBell } from "@/components/domain/NotificationBell";
import { SealShield } from "@/components/domain/SealShield";
import { ChevronDown, Wrench, LogOut, UserCheck } from "lucide-react";
import { RoleType } from "@/models/entities";

export function NavigationBar() {
  const pathname = usePathname() || "";
  const { user, activeRole, loginWithRole, logout } = useAuth();
  const rawRole = activeRole ? ((activeRole as any).roleName || (activeRole as any).RoleName) : null;
  const roleName = rawRole || user?.roleName || "Guest";
  const [showDevMenu, setShowDevMenu] = useState(false);

  const handleRoleSwitch = (role: RoleType) => {
    loginWithRole(role);
    setShowDevMenu(false);
  };

  return (
    <nav className="w-full h-16 border-b border-[var(--border-muted)] bg-[var(--bg-panel)] flex items-center justify-between px-6 shrink-0 z-30 shadow-sm relative font-sans">
      
      {/* Left: Brand Logo & Navigation Links */}
      <div className="flex items-center gap-8">
        <Link href="/" className="font-display font-bold text-lg text-[var(--accent-primary)] tracking-widest uppercase hover:opacity-80 flex items-center gap-2">
          <SealShield className="h-6 w-6 text-[var(--accent-primary)]" />
          <span>SEAL</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center font-mono text-xs">
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
            Khám phá Sự kiện
          </Link>

          {/* Unified Single Workspace Link per Role */}
          {roleName === "Coordinator" && (
            <Link
              href="/coordinator/dashboard"
              className="text-[var(--accent-primary)] font-bold hover:underline flex items-center gap-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-3 py-1.5 hud-clipped text-xs"
            >
              <span>CONTROL CENTER BTC</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {roleName === "Mentor" && (
            <Link
              href="/mentor/tracks"
              className="text-[var(--accent-primary)] font-bold hover:underline flex items-center gap-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-3 py-1.5 hud-clipped text-xs"
            >
              <span>BÀN LÀM VIỆC MENTOR</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {roleName === "Judge" && (
            <Link
              href="/judge/tracks"
              className="text-[var(--accent-primary)] font-bold hover:underline flex items-center gap-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-3 py-1.5 hud-clipped text-xs"
            >
              <span>HẠNG MỤC CHẤM ĐIỂM</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {roleName === "Admin" && (
            <Link
              href="/admin/dashboard"
              className="text-[var(--accent-primary)] font-bold hover:underline flex items-center gap-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-3 py-1.5 hud-clipped text-xs"
            >
              <span>BẢNG ĐIỀU HÀNH ADMIN</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}

          {(roleName === "TeamLeader" || roleName === "TeamMember") && (
            <Link
              href="/my-team"
              className="text-[var(--accent-primary)] font-bold hover:underline flex items-center gap-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-3 py-1.5 hud-clipped text-xs"
            >
              <span>ĐỘI THI CỦA TÔI</span>
              <span className="text-[10px]">➔</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Right: Notifications, Compact Dev Role Menu & Auth */}
      <div className="flex items-center gap-4">
        <NotificationBell align="right" />

        {/* Compact Dev Role Switcher Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDevMenu(!showDevMenu)}
            className="flex items-center gap-1.5 border border-[var(--border-muted)] px-3 py-1 bg-[var(--bg-input)] font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 hud-clipped transition-all cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="font-bold">ROLE:</span>
            <span className="text-[var(--accent-primary)] font-extrabold uppercase">{roleName}</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {showDevMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-panel)] border border-[var(--accent-primary)]/40 shadow-xl hud-clipped p-2 z-50 animate-fadeIn space-y-1 font-mono text-xs">
              <div className="text-[10px] text-[var(--text-muted)] px-2 py-1 uppercase tracking-wider border-b border-[var(--border-muted)] mb-1">
                DEV TEST SWITCHER
              </div>
              <button
                onClick={() => handleRoleSwitch("Admin")}
                className={`w-full text-left px-2.5 py-1.5 hover:bg-[var(--accent-primary)]/10 flex items-center justify-between hud-clipped cursor-pointer ${roleName === "Admin" ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-primary)]"}`}
              >
                <span>Admin</span>
                {roleName === "Admin" && <UserCheck className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleRoleSwitch("TeamLeader")}
                className={`w-full text-left px-2.5 py-1.5 hover:bg-[var(--accent-primary)]/10 flex items-center justify-between hud-clipped cursor-pointer ${roleName === "TeamLeader" ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-primary)]"}`}
              >
                <span>Team Leader</span>
                {roleName === "TeamLeader" && <UserCheck className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleRoleSwitch("TeamMember")}
                className={`w-full text-left px-2.5 py-1.5 hover:bg-[var(--accent-primary)]/10 flex items-center justify-between hud-clipped cursor-pointer ${roleName === "TeamMember" ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-primary)]"}`}
              >
                <span>Team Member</span>
                {roleName === "TeamMember" && <UserCheck className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleRoleSwitch("Mentor")}
                className={`w-full text-left px-2.5 py-1.5 hover:bg-[var(--accent-primary)]/10 flex items-center justify-between hud-clipped cursor-pointer ${roleName === "Mentor" ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-primary)]"}`}
              >
                <span>Mentor</span>
                {roleName === "Mentor" && <UserCheck className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleRoleSwitch("Judge")}
                className={`w-full text-left px-2.5 py-1.5 hover:bg-[var(--accent-primary)]/10 flex items-center justify-between hud-clipped cursor-pointer ${roleName === "Judge" ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-primary)]"}`}
              >
                <span>Judge</span>
                {roleName === "Judge" && <UserCheck className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleRoleSwitch("Coordinator")}
                className={`w-full text-left px-2.5 py-1.5 hover:bg-[var(--accent-primary)]/10 flex items-center justify-between hud-clipped cursor-pointer ${roleName === "Coordinator" ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-primary)]"}`}
              >
                <span>Coordinator (BTC)</span>
                {roleName === "Coordinator" && <UserCheck className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:border-[var(--color-danger)]/50 border border-[var(--border-muted)] px-3 py-1 hud-clipped transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
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
