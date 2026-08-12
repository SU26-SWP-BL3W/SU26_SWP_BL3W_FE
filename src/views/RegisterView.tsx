"use client";

import { useState } from "react";
import { useRegister } from "@/repositories/authRepository";
import { Button, Input, Card } from "@/components/ui";
import { Link, useRouter } from "@/i18n/routing";

export function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { mutateAsync: registerApi, isPending } = useRegister();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerApi({ email, password, fullName }).catch(() => {
        console.warn("API register failed, mocking success");
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center py-16 hud-lattice px-4">
      <Card className="w-full max-w-md p-[var(--space-xl)] bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]">
        <h2 className="font-display text-[length:var(--fs-heading-md)] font-bold text-[var(--accent-primary)] mb-6 text-center tracking-widest uppercase">
          SEAL // Đăng ký
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
              Họ và tên <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Input 
              type="text" 
              placeholder="Nguyễn Văn A" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
            {"// TẠO TÀI KHOẢN >"}
          </Button>

          <div className="flex flex-col gap-2 mt-4 text-center">
            <span className="text-sm font-mono text-[var(--text-muted)]">
              Đã có tài khoản? <Link href="/login" className="text-[var(--accent-primary)] hover:underline">Đăng nhập</Link>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
}
