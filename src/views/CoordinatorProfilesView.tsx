"use client";

import { useState } from "react";
import { useGetUsers, useApproveUser, useRejectUser } from "@/repositories/usersRepository";
import { Button, Card, Badge } from "@/components/ui";
import {
  Users,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Eye,
  RefreshCw,
  Shield,
  AlertTriangle,
} from "lucide-react";
import type { User } from "@/models/entities";

export function CoordinatorProfilesView() {
  const [rejectModal, setRejectModal] = useState<{ userId: string; fullName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailModal, setDetailModal] = useState<User | null>(null);

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsers({ isApproved: false, pageNumber: 1, pageSize: 50 });

  // Chỉ lấy Thí sinh (isStudent) có trạng thái chưa duyệt (isApproved === false)
  const pendingUsers = (usersData?.data ?? []).filter(
    (u) => !u.isAdmin && u.isStudent !== false && !u.isApproved && !u.isRejected
  );

  const { mutateAsync: approveUser, isPending: isApproving } = useApproveUser();
  const { mutateAsync: rejectUser, isPending: isRejecting } = useRejectUser();

  const handleApprove = async (userId: string) => {
    await approveUser(userId).catch((err) =>
      console.warn("[SEAL] Approve user mocked:", err?.message)
    );
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) return;
    await rejectUser({ userId: rejectModal.userId, reason: rejectReason.trim() }).catch((err) =>
      console.warn("[SEAL] Reject user mocked:", err?.message)
    );
    setRejectModal(null);
    setRejectReason("");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] hud-lattice px-6 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgba(167,139,250,0.1)] border border-[var(--accent-coordinator)]/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[var(--accent-coordinator)]" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[var(--accent-coordinator)] tracking-widest uppercase">
                DUYỆT HỒ SƠ SINH VIÊN
              </h1>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                // COORDINATOR PROFILE APPROVAL CENTER
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-[rgba(245,158,11,0.1)] border border-[var(--color-warning)]/30 font-mono text-xs text-[var(--color-warning)]">
              PENDING: {pendingUsers.length}
            </div>
            <Button
              variant="ghost"
              onClick={() => refetch()}
              className="flex items-center gap-2 text-xs"
            >
              <RefreshCw className="w-3 h-3" />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <svg className="w-12 h-12 animate-spin" viewBox="0 0 100 100">
              <polygon
                points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5"
                fill="none"
                stroke="var(--accent-coordinator)"
                strokeWidth="2"
                strokeDasharray="240"
                strokeDashoffset="60"
              />
            </svg>
          </div>
        ) : pendingUsers.length === 0 ? (
          <Card className="w-full p-16 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] text-center">
            <CheckCircle2 className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4 opacity-50" />
            <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest uppercase">
              Không có hồ sơ nào đang chờ duyệt
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <ProfileCard
                key={user.id || user.UserID || Math.random().toString()}
                user={user}
                onApprove={() => handleApprove(user.id || user.UserID || "")}
                onReject={() => setRejectModal({ userId: user.id || user.UserID || "", fullName: user.fullName || user.FullName || "" })}
                onView={() => setDetailModal(user)}
                isApproving={isApproving}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-6 bg-[var(--bg-panel)] hud-clipped border-[var(--color-danger)]/30">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" />
              <h3 className="font-display text-base font-bold text-[var(--color-danger)] tracking-widest uppercase">
                TỪ CHỐI HỒ SƠ
              </h3>
            </div>

            <p className="text-sm text-[var(--text-muted)] mb-4">
              Bạn đang từ chối hồ sơ của:{" "}
              <span className="text-[var(--text-primary)] font-medium">{rejectModal.fullName}</span>
            </p>

            <div className="flex flex-col gap-2 mb-4">
              <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                Lý do từ chối <span className="text-[var(--color-danger)]">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Ảnh thẻ sinh viên không rõ ràng, thông tin không khớp..."
                rows={3}
                className="w-full px-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm resize-none focus:outline-none focus:border-[var(--color-danger)] transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                className="flex-1 justify-center"
              >
                Hủy
              </Button>
              <Button
                disabled={!rejectReason.trim() || isRejecting}
                onClick={handleReject}
                className="flex-1 justify-center bg-[var(--color-danger)] text-white font-mono text-xs tracking-wider"
              >
                {isRejecting ? "Đang gửi..." : "// XÁC NHẬN TỪ CHỐI"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={() => setDetailModal(null)}
        >
          <Card
            className="w-full max-w-md p-6 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-[var(--accent-primary)] tracking-widest uppercase">
                CHI TIẾT HỒ SƠ
              </h3>
              <button
                onClick={() => setDetailModal(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {[
                ["Email", detailModal.email],
                ["Họ tên", detailModal.fullName],
                ["Mã SV", detailModal.studentCode || "—"],
                ["Trường ID", detailModal.schoolId || "—"],
                ["FPT", detailModal.isFpt ? "Có" : "Không"],
                ["Tạm thời", detailModal.isTemporary ? "Có" : "Không"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 border-b border-[var(--border-muted)] pb-2">
                  <span className="text-[var(--text-muted)] w-24 flex-shrink-0">{label}:</span>
                  <span className="text-[var(--text-primary)]">{value}</span>
                </div>
              ))}

              {detailModal.photoStudentCardUrl && (
                <div>
                  <p className="text-[var(--text-muted)] mb-2">Ảnh thẻ SV:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={detailModal.photoStudentCardUrl}
                    alt="Thẻ SV"
                    className="w-full border border-[var(--border-muted)] max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Profile Card ─────────────────────────────────────────────

function ProfileCard({
  user,
  onApprove,
  onReject,
  onView,
  isApproving,
}: {
  user: User;
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
  isApproving: boolean;
}) {
  return (
    <Card className="w-full p-5 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] hover:border-[var(--accent-coordinator)]/30 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* User info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 bg-[rgba(167,139,250,0.1)] border border-[var(--accent-coordinator)]/20 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[var(--accent-coordinator)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono text-sm font-bold text-[var(--text-primary)] truncate">
                {user.fullName}
              </p>
              {user.isFpt ? (
                <Badge tone="info" className="text-[10px] flex-shrink-0">FPT</Badge>
              ) : (
                <Badge tone="warning" className="text-[10px] flex-shrink-0">NON-FPT</Badge>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5 truncate">{user.email}</p>
            <div className="flex items-center gap-4 mt-1.5 text-xs font-mono text-[var(--text-muted)]">
              {user.studentCode && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {user.studentCode}
                </span>
              )}
              {user.photoStudentCardUrl && (
                <span className="text-[var(--color-success)] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Có ảnh thẻ SV
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onView}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          <Button
            disabled={isApproving}
            onClick={onApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(16,185,129,0.1)] border border-[var(--color-success)]/30 text-[var(--color-success)] hover:bg-[rgba(16,185,129,0.2)] font-mono"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> DUYỆT
          </Button>
          <Button
            onClick={onReject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.2)] font-mono"
          >
            <XCircle className="w-3.5 h-3.5" /> TỪ CHỐI
          </Button>
        </div>
      </div>
    </Card>
  );
}
