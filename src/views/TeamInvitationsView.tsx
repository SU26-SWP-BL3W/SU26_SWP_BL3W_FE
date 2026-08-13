"use client";

import { useMyInvitations, type MyInvitationItem } from "@/repositories/usersRepository";
import { useAcceptOrDeclineInvitation } from "@/repositories/teamsRepository";
import { useRespondEventRoleInvitation } from "@/repositories/eventRolesRepository";
import { Button, Card, Badge } from "@/components/ui";
import { Mail, CheckCircle2, XCircle, RefreshCw, Shield } from "lucide-react";

// Chuông thông báo — gộp lời mời vào ĐỘI và lời mời VAI TRÒ SỰ KIỆN
// (Judge/Mentor/EventCoordinator) trong 1 màn, đọc từ GET /Users/my-invitations
// (usersRepository.useMyInvitations — xem file đó để biết vì sao KHÔNG dùng
// /Teams/{teamId}/my-invitation, route đó cần biết trước teamId nên không hợp
// với màn "lời mời của tôi" này).
export function TeamInvitationsView() {
  const { data, isLoading, refetch } = useMyInvitations();
  const invitations = data?.invitations ?? [];

  const { mutateAsync: respondTeam, isPending: isRespondingTeam } = useAcceptOrDeclineInvitation();
  const { mutateAsync: respondEventRole, isPending: isRespondingEventRole } = useRespondEventRoleInvitation();
  const isResponding = isRespondingTeam || isRespondingEventRole;

  const handleRespond = async (inv: MyInvitationItem, isAccepted: boolean) => {
    try {
      if (inv.type === "TEAM") {
        await respondTeam({ invitationId: inv.invitationId, isAccepted });
      } else {
        await respondEventRole({ invitationId: inv.invitationId, isAccepted });
      }
    } catch {
      alert("Không thể xử lý lời mời — vui lòng thử lại.");
    } finally {
      refetch();
    }
  };

  const pending = invitations.filter((i) => i.status === "PendingAccept");
  const history = invitations.filter((i) => i.status !== "PendingAccept");

  return (
    <div className="min-h-screen bg-[var(--bg-base)] hud-lattice px-6 py-8">
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgba(0,217,255,0.1)] border border-[var(--accent-primary)]/30 flex items-center justify-center">
              <Mail className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[var(--accent-primary)] tracking-widest uppercase">
                LỜI MỜI CỦA TÔI
              </h1>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                {"// INVITATION CENTER — đội thi & vai trò sự kiện"}
              </p>
            </div>
          </div>

          <Button variant="ghost" onClick={() => refetch()} className="flex items-center gap-2 text-xs">
            <RefreshCw className="w-3 h-3" /> Làm mới
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
          </div>
        ) : (
          <>
            {pending.length === 0 ? (
              <Card className="w-full p-16 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] text-center">
                <Shield className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest uppercase">
                  Bạn không có lời mời nào đang chờ
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pending.map((inv) => (
                  <Card
                    key={inv.invitationId}
                    className="w-full p-6 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[var(--accent-team)]" />
                        <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                          {inv.type === "TEAM"
                            ? `Lời mời gia nhập đội "${inv.targetName}"`
                            : `Lời mời làm ${inv.role} — ${inv.targetName}${inv.trackName ? ` · ${inv.trackName}` : ""}`}
                        </span>
                        <Badge tone="warning">PENDING</Badge>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                        Mời bởi {inv.inviterName || "—"} · Hết hạn: {new Date(inv.expiresAt).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        disabled={isResponding}
                        onClick={() => handleRespond(inv, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(16,185,129,0.1)] border border-[var(--color-success)]/30 text-[var(--color-success)] hover:bg-[rgba(16,185,129,0.2)] font-mono"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> CHẤP NHẬN
                      </Button>
                      <Button
                        disabled={isResponding}
                        onClick={() => handleRespond(inv, false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.2)] font-mono"
                      >
                        <XCircle className="w-3.5 h-3.5" /> TỪ CHỐI
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {history.length > 0 && (
              <div>
                <h2 className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase mb-3">
                  Đã phản hồi gần đây
                </h2>
                <div className="space-y-2">
                  {history.map((inv) => (
                    <Card
                      key={inv.invitationId}
                      className="w-full p-4 bg-[var(--bg-panel)]/60 hud-clipped border-[var(--border-muted)] flex items-center justify-between gap-4"
                    >
                      <span className="font-mono text-sm text-[var(--text-muted)]">
                        {inv.type === "TEAM" ? `Đội "${inv.targetName}"` : `${inv.role} — ${inv.targetName}`}
                      </span>
                      <Badge tone={inv.status === "Accepted" ? "success" : "neutral"}>
                        {inv.status === "Accepted" ? "ĐÃ CHẤP NHẬN" : "ĐÃ TỪ CHỐI"}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
