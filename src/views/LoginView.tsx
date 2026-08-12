"use client";

import { useState } from "react";
import { useLogin } from "@/repositories/authRepository";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Input, Card } from "@/components/ui";
import { Link, useRouter } from "@/i18n/routing";

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: loginApi, isPending } = useLogin();
  const { login: mockLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginApi({ email, password }).catch(() => {
        console.warn("API login failed, using mock login fallback");
        mockLogin("TeamLeader");
      });
      router.push("/my-team");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center py-16 hud-lattice px-4">
      <Card className="w-full max-w-md p-[var(--space-xl)] bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]">
        <h2 className="font-display text-[length:var(--fs-heading-md)] font-bold text-[var(--accent-primary)] mb-6 text-center tracking-widest uppercase">
          SEAL // Đăng nhập
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
              Email <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Input 
              type="email" 
              placeholder="fpt@edu.vn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
              Mật khẩu <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Input 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" disabled={isPending} className="mt-4 w-full justify-center">
            {"// XÁC NHẬN >"}
          </Button>

          <div className="flex flex-col gap-2 mt-4 text-center">
            <span className="text-sm font-mono text-[var(--text-muted)]">
              Chưa có tài khoản? <Link href="/register" className="text-[var(--accent-primary)] hover:underline">Đăng ký ngay</Link>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
}
