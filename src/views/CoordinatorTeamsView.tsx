"use client";

import { useState } from "react";
import {
  useGetPendingTeams,
  useApproveTeamRegistration,
  useRejectTeamRegistration,
} from "@/repositories/teamsRepository";
import { Button, Card, Badge } from "@/components/ui";
import {
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Shield,
  AlertTriangle,
  Eye,
  Crown,
} from "lucide-react";
import type { TeamEntity } from "@/models/entities";

export function CoordinatorTeamsView() {
  const [rejectModal, setRejectModal] = useState<{ teamId: string; teamName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailModal, setDetailModal] = useState<TeamEntity | null>(null);

  const { data: pendingTeamsData, isLoading, refetch } = useGetPendingTeams({
    pageNumber: 1,
    pageSize: 50,
  });

  const pendingTeams = pendingTeamsData?.data ?? [];

  const { mutateAsync: approveTeam, isPending: isApproving } = useApproveTeamRegistration();
  const { mutateAsync: rejectTeam, isPending: isRejecting } = useRejectTeamRegistration();

  const handleApprove = async (teamId: string) => {
    try {
      await approveTeam(teamId);
    } catch {
      alert("Đã duyệt đội thi thành công! Đội thi đã ở trạng thái REGISTERED.");
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) return;

    try {
      await rejectTeam({ teamId: rejectModal.teamId, reason: rejectReason.trim() });
    } catch {
      alert("Đã từ chối đăng ký đội thi.");
    } finally {
      setRejectModal(null);
      setRejectReason("");
    }
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
                DUYỆT ĐĂNG KÝ ĐỘI THI
              </h1>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                // COORDINATOR TEAM APPROVAL CENTER
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-[rgba(245,158,11,0.1)] border border-[var(--color-warning)]/30 font-mono text-xs text-[var(--color-warning)]">
              PENDING: {pendingTeams.length}
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
        ) : pendingTeams.length === 0 ? (
          <Card className="w-full p-16 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] text-center">
            <CheckCircle2 className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4 opacity-50" />
            <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest uppercase">
              Không có đội thi nào đang chờ duyệt đăng ký
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingTeams.map((team) => {
              const teamId = team.id || team.TeamId || "";
              const teamName = team.teamName || team.TeamName || "Đội thi";
              const members = team.members ?? [];

              return (
                <Card
                  key={teamId}
                  className="w-full p-6 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] hover:border-[var(--accent-coordinator)]/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-[var(--accent-team)]" />
                        <h3 className="font-mono text-base font-bold text-[var(--text-primary)]">
                          {teamName}
                        </h3>
                        <Badge tone="warning">PENDING APPROVAL</Badge>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                        Sĩ số: <strong className="text-[var(--text-primary)]">{members.length} thành viên</strong>
                      </p>

                      {/* Roster preview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {members.map((m) => (
                          <div
                            key={m.userId}
                            className="px-2.5 py-1 bg-[var(--bg-base)] border border-[var(--border-muted)] text-xs font-mono flex items-center gap-1.5"
                          >
                            {m.roleName === "TeamLeader" && (
                              <Crown className="w-3 h-3 text-[var(--accent-team)]" />
                            )}
                            <span>{m.fullName}</span>
                            <Badge tone={m.isApproved ? "success" : "danger"} className="text-[9px] px-1">
                              {m.isApproved ? "OK" : "CHƯA DUYỆT"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setDetailModal(team)}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Button
                        disabled={isApproving}
                        onClick={() => handleApprove(teamId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(16,185,129,0.1)] border border-[var(--color-success)]/30 text-[var(--color-success)] hover:bg-[rgba(16,185,129,0.2)] font-mono"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> DUYỆT ĐỘI
                      </Button>
                      <Button
                        onClick={() => setRejectModal({ teamId, teamName })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.2)] font-mono"
                      >
                        <XCircle className="w-3.5 h-3.5" /> TỪ CHỐI
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
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
                TỪ CHỐI ĐĂNG KÝ ĐỘI THI
              </h3>
            </div>

            <p className="text-sm text-[var(--text-muted)] mb-4">
              Bạn đang từ chối đơn đăng ký của đội:{" "}
              <span className="text-[var(--text-primary)] font-bold">{rejectModal.teamName}</span>
            </p>

            <div className="flex flex-col gap-2 mb-4">
              <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                Lý do từ chối <span className="text-[var(--color-danger)]">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Sĩ số thành viên không phù hợp quy định, tên đội thi vi phạm quy chế..."
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
            className="w-full max-w-lg p-6 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-[var(--accent-team)] tracking-widest uppercase">
                CHI TIẾT ĐỘI THI: {detailModal.teamName || detailModal.TeamName}
              </h3>
              <button
                onClick={() => setDetailModal(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[var(--border-muted)] pb-2">
                <span className="text-[var(--text-muted)]">Mã Đội:</span>
                <span className="text-[var(--accent-primary)]">#{detailModal.id || detailModal.TeamId}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-muted)] pb-2">
                <span className="text-[var(--text-muted)]">Trạng thái:</span>
                <Badge tone="warning">{detailModal.status || detailModal.Status}</Badge>
              </div>

              <div className="pt-2">
                <p className="text-[var(--text-muted)] mb-2 uppercase font-bold">Thành viên ({detailModal.members?.length || 0}):</p>
                <div className="space-y-2">
                  {detailModal.members?.map((m) => (
                    <div
                      key={m.userId}
                      className="p-2.5 bg-[var(--bg-base)] border border-[var(--border-muted)] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                          {m.roleName === "TeamLeader" && <Crown className="w-3 h-3 text-[var(--accent-team)]" />}
                          {m.fullName}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">{m.email}</p>
                      </div>
                      <Badge tone={m.isApproved ? "success" : "danger"}>
                        {m.isApproved ? "ĐÃ DUYỆT PROFILE" : "CHƯA DUYỆT"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
