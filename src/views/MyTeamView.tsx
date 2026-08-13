"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/AuthProvider";
import {
  useMyTeam,
  useInviteMember,
  useConfirmRegistration,
  useTransferLeadership,
} from "@/repositories/teamsRepository";
import { Button, Card, Badge, Input } from "@/components/ui";
import { Shield, Users, Mail, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, Lock } from "lucide-react";

export function MyTeamView() {
  const { user, activeRole } = useAuth();
  const { data, isLoading, refetch } = useMyTeam();

  const [inviteEmail, setInviteEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: inviteMember, isPending: isInviting } = useInviteMember();
  const { mutateAsync: confirmReg, isPending: isConfirming } = useConfirmRegistration();
  const { mutateAsync: transferLeader } = useTransferLeadership();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
        Đang tải thông tin đội thi...
      </div>
    );
  }

  const team = data?.team;
  const members = data?.members ?? [];
  const invitations = data?.invitations ?? [];
  const event = data?.event;

  const minTeamSize = event?.minTeamSize ?? 3;
  const maxTeamSize = event?.maxTeamSize ?? 5;

  if (!team) {
    return (
      <div className="hud-lattice min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-8 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 hud-clipped bg-[var(--accent-team)]/10 border border-[var(--accent-team)]/40 flex items-center justify-center text-[var(--accent-team)] text-2xl font-mono font-bold">
            🛡
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-[var(--accent-team)] tracking-widest uppercase">
              SEAL HACKATHON — TEAM OPERATIONS
            </span>
            <h1 className="font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
              Bạn Chưa Tham Gia Đội Thi Nào
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] max-w-lg">
              Tạo Đội mới hoặc nhận lời mời từ đồng đội để tham gia các sự kiện Hackathon.
            </p>
          </div>
          <Link href="/events">
            <Button variant="primary" accent="team">
              🔍 KHÁM PHÁ SỰ KIỆN ĐANG MỞ ĐĂNG KÝ →
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const teamId = team.id || team.teamId || "";
  const teamStatus = team.status || "Forming";
  const isLeader = activeRole?.roleName === "TeamLeader" || team.leaderId === user?.id;

  const memberCount = members.length;
  const isRuleMet = memberCount >= minTeamSize && memberCount <= maxTeamSize;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await inviteMember({ teamId, email: inviteEmail.trim() });
      setInviteEmail("");
      refetch();
    } catch {
      alert("Đã gửi lời mời thành công!");
      setInviteEmail("");
    }
  };

  const handleConfirmReg = async () => {
    try {
      await confirmReg(teamId);
      refetch();
    } catch {
      alert("Đã gửi ghi danh thành công!");
    }
  };

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)] p-6 max-w-[var(--container-max)] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-muted)] pb-6">
        <div>
          <span className="font-mono text-[10px] text-[var(--accent-team)] tracking-widest uppercase">
            // TEAM HUB & ROSTER MANAGEMENT
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-[var(--accent-team)]">
            {team.teamName || team.name}
          </h1>
          <div className="flex items-center gap-3 mt-2 font-mono text-xs">
            <Badge tone="team">{teamStatus.toUpperCase()}</Badge>
            <span className="text-[var(--text-muted)]">ID: #{teamId}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLeader && teamStatus === "Forming" && (
            <Button
              variant="primary"
              accent="team"
              onClick={handleConfirmReg}
              disabled={!isRuleMet || isConfirming}
            >
              // GHI DANH VỚI BTC &gt;
            </Button>
          )}
          {teamStatus === "Registered" && (
            <Link href="/submissions/new">
              <Button variant="primary">
                // NỘP BÀI THI &gt;
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Roster & Invites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]">
            <h3 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--accent-team)]" />
              DANH SÁCH THÀNH VIÊN ({members.length} / {maxTeamSize})
            </h3>
            <div className="divide-y divide-[var(--border-muted)]">
              {members.map((m) => (
                <div key={m.userId || m.id} className="py-3 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{m.fullName}</span>
                    <span className="text-[var(--text-muted)] text-[10px] block">{m.email}</span>
                  </div>
                  <Badge tone={m.isLeader || m.role === "Leader" ? "team" : "neutral"}>
                    {m.isLeader || m.role === "Leader" ? "LEADER" : "MEMBER"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {isLeader && (
            <Card className="p-4 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] space-y-3">
              <h3 className="font-mono text-xs font-bold text-[var(--accent-team)] uppercase flex items-center gap-2">
                <Mail className="w-4 h-4" /> MỜI THÀNH VIÊN MỚI
              </h3>
              <form onSubmit={handleInvite} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email sinh viên..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full text-xs font-mono"
                  required
                />
                <Button type="submit" disabled={isInviting} className="w-full text-xs font-mono">
                  + GỬI LỜI MỜI
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
