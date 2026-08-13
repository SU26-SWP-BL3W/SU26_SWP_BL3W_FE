"use client";

import { useState } from "react";
import { useLogin } from "@/repositories/authRepository";
import { useAuth } from "@/providers/AuthProvider";
import { Link, useRouter } from "@/i18n/routing";

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const { mutateAsync: loginApi, isPending } = useLogin();
  const { login: mockLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginApi({ email, password }).catch(() => {
        console.warn("API login fallback to mock");
        mockLogin("TeamLeader");
      });
      router.push("/my-team");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFptLogin = () => {
    mockLogin("TeamLeader");
    router.push("/my-team");
  };

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-8 shadow-[0_0_30px_rgba(56,189,248,0.06)]">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 hud-clipped flex items-center justify-center text-[var(--accent-primary)]">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[var(--text-primary)]">
            CHÀO MỪNG TRỞ LẠI
          </h1>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
            Đăng nhập vào <strong className="text-[var(--accent-primary)]">SEAL Platform</strong> để tiếp tục
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Email Sinh Viên / Tài Khoản <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="email"
              placeholder="you@fpt.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Mật Khẩu <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Link href="/forgot-password" className="font-mono text-[11px] text-[var(--accent-primary)] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
            />
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)] pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[var(--accent-primary)] w-4 h-4"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="hud-clipped w-full py-3.5 bg-[var(--accent-primary)] text-[var(--bg-base)] font-mono font-bold text-sm uppercase tracking-wider transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] focus:outline-none mt-2"
          >
            {isPending ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[var(--border-muted)]" />
          <span className="absolute bg-[var(--bg-panel)] px-3 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
            HOẶC CÁCH KHÁC
          </span>
        </div>

        {/* Social / FPT Edu Login Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleFptLogin}
            className="hud-clipped w-full py-3 border border-[var(--accent-team)]/50 bg-[var(--accent-team)]/10 text-[var(--accent-team)] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[var(--accent-team)] hover:text-[var(--bg-base)] transition-all flex items-center justify-center gap-2"
          >
            <span>🎓</span> ĐĂNG NHẬP BẰNG FPT EDU (@FPT.EDU.VN)
          </button>
          
          <button
            type="button"
            onClick={handleFptLogin}
            className="hud-clipped w-full py-3 border border-[var(--border-muted)] bg-[var(--bg-input)] text-[var(--text-primary)] font-mono text-xs uppercase tracking-wider hover:border-[var(--text-primary)] transition-all flex items-center justify-center gap-2"
          >
            <span>G</span> Đăng nhập với Google
          </button>
        </div>

        {/* Register Footer */}
        <div className="mt-8 text-center border-t border-[var(--border-muted)]/50 pt-4">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-[var(--accent-primary)] font-bold hover:underline ml-1">
              Đăng ký tài khoản ngay →
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}
