"use client";

import { useState } from "react";
import { useAuth, PRESET_ACCOUNTS } from "@/providers/AuthProvider";
import { Button, Input, Card, Badge } from "@/components/ui";
import { Link, useRouter } from "@/i18n/routing";
import { Shield, KeyRound, ShieldAlert, Users, Layers, Award, ArrowRight, UserCheck } from "lucide-react";

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { loginWithEmail, loginWithRole } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ email!");
      return;
    }
    const targetPath = loginWithEmail(email);
    router.push(targetPath);
  };

  const handlePresetSelect = (acc: (typeof PRESET_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword("password123");
    const targetPath = loginWithRole(acc.roleName);
    router.push(targetPath);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 hud-lattice px-4">
      <div className="w-full max-w-xl space-y-6">
        {/* Main Login Card */}
        <Card className="p-8 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] hud-glow-cyan space-y-6">
          <div className="text-center space-y-2 border-b border-[var(--border-muted)] pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 mb-2">
              <Shield className="w-6 h-6 text-[var(--accent-primary)]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-widest uppercase">
              SEAL HACKATHON SYSTEM // ĐĂNG NHẬP
            </h2>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Cổng xác thực tài khoản thi đấu & quản trị sự kiện
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)] text-[var(--color-danger)] font-mono text-xs hud-clipped">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                Email Tài Khoản <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Input
                type="email"
                placeholder="Ví dụ: admin.system@seal.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                Mật Khẩu <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <Button type="submit" className="w-full justify-center py-3 text-sm font-bold">
              // ĐĂNG NHẬP HỆ THỐNG &gt;
            </Button>
          </form>

          {/* Quick Preset Demo Accounts Picker */}
          <div className="pt-6 border-t border-[var(--border-muted)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[var(--accent-primary)]" />
                Tài Khoản Giả Lập Mẫu (Demo Presets):
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                Click để chọn & tự động chuyển đến Dashboard vai trò
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_ACCOUNTS.map((acc) => {
                const getRoleBadge = (role: string) => {
                  if (role === "Admin") return { tone: "danger" as const, label: "[ADM-SYSTEM]", color: "border-[var(--color-danger)] text-[var(--color-danger)]" };
                  if (role === "Coordinator") return { tone: "coordinator" as const, label: "[EVENT-COORD]", color: "border-[var(--accent-coordinator)] text-[var(--accent-coordinator)]" };
                  if (role === "Judge") return { tone: "judge" as const, label: "[JUDGE-STAFF]", color: "border-[var(--accent-judge)] text-[var(--accent-judge)]" };
                  return { tone: "team" as const, label: "[TEAM-LEAD]", color: "border-[var(--accent-team)] text-[var(--accent-team)]" };
                };
                const badge = getRoleBadge(acc.roleName);

                return (
                  <button
                    key={acc.roleName}
                    type="button"
                    onClick={() => handlePresetSelect(acc)}
                    className="p-3 bg-[var(--bg-input)] hover:bg-[var(--bg-base)] border border-[var(--border-muted)] hover:border-[var(--accent-primary)] text-left transition-all duration-200 hud-clipped group space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[10px] font-bold border px-1.5 py-0.5 ${badge.color}`}>
                        {badge.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="font-mono font-bold text-xs text-[var(--text-primary)] truncate">
                      {acc.fullName}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                      {acc.email}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-2 border-t border-[var(--border-muted)]">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-[var(--accent-primary)] hover:underline font-bold">
                Đăng ký ngay
              </Link>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
