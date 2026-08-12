"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { HexagonLoader, Button, Card } from "@/components/ui";
import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<"Admin" | "Coordinator" | "Judge" | "TeamLeader" | "TeamMember">;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, activeRole, isInitialized } = useAuth();

  // Đang tải phiên làm việc từ localStorage
  if (!isInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <HexagonLoader />
        <p className="font-mono text-xs text-[var(--text-muted)] animate-pulse">
          Đang xác thực phiên làm việc & phân quyền...
        </p>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 hud-lattice">
        <Card className="max-w-md p-8 bg-[var(--bg-panel)] hud-clipped border-[var(--color-danger)] text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)] border border-[var(--color-danger)]/30 mx-auto">
            <Lock className="w-6 h-6 text-[var(--color-danger)]" />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--color-danger)] uppercase tracking-wider">
            YÊU CẦU ĐĂNG NHẬP
          </h3>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Trang này yêu cầu bạn phải đăng nhập hệ thống với tài khoản có quyền truy cập phù hợp.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/login">
              <Button variant="primary" className="font-mono text-xs">
                // ĐẾN TRANG ĐĂNG NHẬP &gt;
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Kiểm tra quyền hạn
  const isUserAdmin = user.IsAdmin;
  const userRole = activeRole?.RoleName as "Coordinator" | "Judge" | "TeamLeader" | "TeamMember" | undefined;

  const hasAccess =
    (allowedRoles.includes("Admin") && isUserAdmin) ||
    (userRole && allowedRoles.includes(userRole));

  if (!hasAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 hud-lattice">
        <Card className="max-w-lg p-8 bg-[var(--bg-panel)] hud-clipped border-[var(--color-danger)] space-y-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)] border border-[var(--color-danger)]/30 mx-auto">
            <ShieldAlert className="w-6 h-6 text-[var(--color-danger)]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-2xl text-[var(--color-danger)] uppercase tracking-wider">
              403 // TỪ CHÍNH TRUY CẬP (ACCESS DENIED)
            </h3>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Tài khoản hiện tại của bạn là{" "}
              <span className="text-[var(--text-primary)] font-bold">
                [{isUserAdmin ? "System Admin" : userRole || "Guest"}]
              </span>{" "}
              không có quyền truy cập trang này. Trang này chỉ dành cho vai trò:{" "}
              <span className="text-[var(--accent-primary)] font-bold">
                [{allowedRoles.join(", ")}]
              </span>.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-mono text-xs">
                Đổi Tài Khoản / Đăng Nhập Lại
              </Button>
            </Link>
            <Link href="/">
              <Button variant="primary" className="font-mono text-xs">
                Về Trang Chủ &gt;
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Đủ quyền hạn -> Render trang con
  return <>{children}</>;
};
