"use client";

import { useState } from "react";
import { useAuth, PRESET_ACCOUNTS } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Shield, User, Award, Users, ChevronRight, RefreshCw, X, Sparkles } from "lucide-react";

export function QuickRoleSwitcherBar() {
  const { user, activeRole, loginWithRole, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (roleName: any, defaultRedirect: string) => {
    const redirectUrl = loginWithRole(roleName);
    router.push(redirectUrl || defaultRedirect);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-panel)] border border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:bg-[var(--accent-primary)] hover:text-black transition-all hud-clipped text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>[ TESTER ROLE SWITCHER ]</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 p-4 bg-[var(--bg-panel)] border border-[var(--accent-primary)] shadow-[0_0_25px_rgba(0,242,254,0.3)] hud-clipped space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>TEST ALL ROLES & SCENARIOS</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-muted)] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-[var(--text-muted)] space-y-1">
            <p className="font-bold text-[var(--text-primary)]">
              Đang đăng nhập: <span className="text-[var(--accent-primary)]">{user ? user.fullName : "Chưa đăng nhập"}</span>
            </p>
            {activeRole && (
              <p>
                Vai trò: <span className="text-[var(--accent-team)]">{activeRole.roleNameDetail || activeRole.roleName}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {PRESET_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleSwitch(acc.roleName, acc.defaultRedirect)}
                className="w-full p-2.5 bg-[var(--bg-base)] border border-[var(--border-muted)] hover:border-[var(--accent-primary)] text-left flex items-start justify-between hud-clipped transition-all hover:bg-[rgba(0,242,254,0.05)] group"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] block">
                    {acc.fullName}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block line-clamp-1">
                    {acc.description}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-muted)] text-[10px]">
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-[var(--color-danger)] font-bold hover:underline"
            >
              Đăng xuất phiên test
            </button>
            <span className="text-[var(--text-muted)]">SEAL 2026 Mock Store</span>
          </div>
        </div>
      )}
    </div>
  );
}
