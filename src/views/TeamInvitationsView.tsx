"use client";

import { useGetMyInvitations, useAcceptOrDeclineInvitation } from "@/repositories/teamsRepository";
import { Button, Card, Badge } from "@/components/ui";
import { Mail, CheckCircle2, XCircle, RefreshCw, Shield } from "lucide-react";
import type { TeamInvitation } from "@/models/entities";

export function TeamInvitationsView() {
  const { data: invitations = [], isLoading, refetch } = useGetMyInvitations();

  const { mutateAsync: respond, isPending } = useAcceptOrDeclineInvitation();

  const handleRespond = async (invitationId: string, isAccepted: boolean) => {
    try {
      await respond({ invitationId, isAccepted });
    } catch {
      alert(isAccepted ? "Đã chấp nhận lời mời!" : "Đã từ chối lời mời.");
    } finally {
      refetch();
    }
  };

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
                LỜI MỜI THAM GIA ĐỘI THI
              </h1>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                // TEAM INVITATION CENTER
              </p>
            </div>
          </div>

          <Button variant="ghost" onClick={() => refetch()} className="flex items-center gap-2 text-xs">
            <RefreshCw className="w-3 h-3" /> Làm mới
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
          </div>
        ) : invitations.length === 0 ? (
          <Card className="w-full p-16 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] text-center">
            <Shield className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
            <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest uppercase">
              Bạn không có lời mời tham gia đội thi nào đang chờ
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => {
              const invId = inv.id || "";
              return (
                <Card
                  key={invId}
                  className="w-full p-6 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--accent-team)]" />
                      <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                        Lời mời gia nhập đội #{inv.teamId || "TEAM"}
                      </span>
                      <Badge tone="warning">PENDING</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Lời mời hết hạn sau: {inv.expiresAt ? new Date(inv.expiresAt).toLocaleString("vi-VN") : "24h"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      disabled={isPending}
                      onClick={() => handleRespond(invId, true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(16,185,129,0.1)] border border-[var(--color-success)]/30 text-[var(--color-success)] hover:bg-[rgba(16,185,129,0.2)] font-mono"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> CHẤP NHẬN
                    </Button>
                    <Button
                      disabled={isPending}
                      onClick={() => handleRespond(invId, false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.2)] font-mono"
                    >
                      <XCircle className="w-3.5 h-3.5" /> TỪ CHỐI
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
