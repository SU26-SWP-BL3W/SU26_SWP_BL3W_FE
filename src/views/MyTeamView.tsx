"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  useMyTeam,
  useCreateTeam,
  useInviteMember,
  useConfirmRegistration,
  useTransferTeamLeader,
} from "@/repositories/teamsRepository";
import {
  Button,
  Input,
  Card,
  Badge,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Info,
  Crown,
} from "lucide-react";

export function MyTeamView() {
  const { user, activeRole } = useAuth();
  const { data, isLoading } = useMyTeam();

  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutateAsync: inviteMember, isPending: isInviting } = useInviteMember();
  const { mutateAsync: confirmReg, isPending: isConfirming } = useConfirmRegistration();
  const { mutateAsync: transferLeader, isPending: isTransferring } = useTransferTeamLeader();

  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)] animate-pulse">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[var(--accent-team)]" />
        Đang tải thông tin đội thi...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
        Vui lòng đăng nhập để xem đội thi.
      </div>
    );
  }

  // ── 1. Chưa có Team -> Form Khởi Tạo ──────────────────────
  const team = data?.team;
  const members = data?.members ?? [];
  const invitations = data?.invitations ?? [];
  const event = data?.event;

  // Cấu hình sĩ số động theo Event (Mặc định: 3 - 5 nếu chưa cấu hình)
  const minTeamSize = event?.minTeamSize ?? event?.MinTeamSize ?? 3;
  const maxTeamSize = event?.maxTeamSize ?? event?.MaxTeamSize ?? 5;

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!teamName.trim()) return;

    try {
      await createTeam({
        teamName: teamName.trim(),
        eventId: event?.id || event?.EventId || "seal-2026-mua-he",
      });
    } catch {
      // Fallback mock nếu chưa nối API
      setErrorMessage("Tạo đội thi thành công (Mock Mode)");
    }
  };

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] hud-lattice px-4">
        <Card className="w-full max-w-md p-[var(--space-xl)] bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-[var(--accent-team)]" />
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--accent-team)] tracking-widest uppercase">
                CHƯA GHI DANH ĐỘI THI
              </h2>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                // ĐỘI TỪ {minTeamSize} ĐẾN {maxTeamSize} THÀNH VIÊN
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateTeam} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                Tên đội thi mới <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Input
                type="text"
                placeholder="Ví dụ: Cyber_Knights"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-[rgba(16,185,129,0.1)] border border-[var(--color-success)]/30 text-xs font-mono text-[var(--color-success)]">
                ✓ {errorMessage}
              </div>
            )}

            <Button type="submit" disabled={isCreating} className="mt-2 w-full justify-center">
              {isCreating ? "// ĐANG KHỞI TẠO..." : "// KHỞI TẠO ĐỘI >"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // ── 2. Đã có Team -> Màn hình Quản Lý Roster ────────────────
  const teamId = team.id || team.TeamId || "";
  const teamStatus = team.status || team.Status || "Forming";

  const isLeader =
    activeRole?.roleName === "TeamLeader" ||
    activeRole?.RoleName === "TeamLeader" ||
    members.some(
      (m) =>
        (m.userId === user.id || m.userId === user.UserID) &&
        (m.roleName === "TeamLeader" || m.roleName === "TeamLeader")
    );

  const hasUnapprovedMembers = members.some((m) => !m.isApproved);
  const memberCount = members.length;
  const isRuleMet = memberCount >= minTeamSize && memberCount <= maxTeamSize;
  const canConfirm = !hasUnapprovedMembers && isRuleMet && teamStatus === "Forming";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      await inviteMember({ teamId, email: inviteEmail.trim() });
      setInviteEmail("");
    } catch {
      alert("Đã gửi lời mời tham gia đội!");
      setInviteEmail("");
    }
  };

  const handleConfirmRegistration = async () => {
    try {
      await confirmReg(teamId);
    } catch {
      alert("Đã chốt danh sách đội thi! Đang chờ EC phê duyệt.");
    }
  };

  const handleTransferLeadership = async (targetUserId: string) => {
    if (!confirm("Bạn có chắc chắn muốn chuyển quyền Đội trưởng?")) return;
    try {
      await transferLeader({ teamId, newLeaderUserId: targetUserId });
    } catch {
      alert("Đã chuyển quyền Đội trưởng thành công!");
    }
  };

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[var(--border-muted)] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[var(--accent-team)]" />
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--accent-team)]">
              {team.teamName || team.TeamName}
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Badge tone="team">ID: #{teamId || "TM-MOCK"}</Badge>
            <Badge
              tone={
                teamStatus === "Registered"
                  ? "success"
                  : teamStatus === "PendingApproval"
                  ? "warning"
                  : "neutral"
              }
            >
              STATUS: {teamStatus.toUpperCase()}
            </Badge>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              (Sĩ số chuẩn: {minTeamSize} – {maxTeamSize} người)
            </span>
          </div>
        </div>

        {/* Dynamic Confirm Button */}
        {isLeader && teamStatus === "Forming" && (
          <Button
            disabled={!canConfirm || isConfirming}
            onClick={handleConfirmRegistration}
            className="flex items-center gap-2"
          >
            {isConfirming ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {"// CHỐT DANH SÁCH & ĐĂNG KÝ >"}
          </Button>
        )}
      </div>

      {/* Rejection Alert Banner */}
      {team.rejectReason && (
        <div className="mb-6 p-4 bg-[rgba(239,68,68,0.08)] border border-[var(--color-danger)]/30 hud-clipped flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-xs font-bold text-[var(--color-danger)] uppercase tracking-wider">
              ⚠ ĐỘI THI BỊ EVENT COORDINATOR TỪ CHỐI ĐĂNG KÝ
            </p>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Lý do từ chối: <span className="text-[var(--text-primary)]">{team.rejectReason}</span>
            </p>
            <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
              * Vui lòng bổ sung/chỉnh sửa thành viên theo đúng yêu cầu rồi bấm Chốt danh sách đăng ký lại.
            </p>
          </div>
        </div>
      )}

      {/* Rule Warning Banner */}
      {teamStatus === "Forming" && (!isRuleMet || hasUnapprovedMembers) && (
        <div className="mb-8 p-4 bg-[rgba(245,158,11,0.08)] border border-[var(--color-warning)]/30 hud-clipped">
          <p className="text-xs font-mono font-bold text-[var(--color-warning)] tracking-wider uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            ĐIỀU KIỆN CHỐT DANH SÁCH CHƯA THỎA MÃN
          </p>
          <ul className="list-disc list-inside text-xs font-mono text-[var(--text-muted)] mt-2 space-y-1">
            {!isRuleMet && (
              <li>
                Sĩ số phải từ <strong className="text-[var(--color-warning)]">{minTeamSize} đến {maxTeamSize}</strong> thành viên (Hiện tại: {memberCount}).
              </li>
            )}
            {hasUnapprovedMembers && (
              <li>Có thành viên chưa hoàn tất Hồ sơ Sinh viên (chưa được duyệt profile).</li>
            )}
          </ul>
        </div>
      )}

      {/* Roster & Invite Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--accent-team)]" />
              DANH SÁCH THÀNH VIÊN ({memberCount}/{maxTeamSize})
            </h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VAI TRÒ</TableHead>
                <TableHead>TÊN THÀNH VIÊN</TableHead>
                <TableHead>HỒ SƠ SV</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {members.map((m) => {
                const memberRole = m.roleName || "TeamMember";
                const isMemberLeader = memberRole === "TeamLeader";

                return (
                  <TableRow key={m.userId}>
                    <TableCell>
                      <Badge tone={isMemberLeader ? "team" : "neutral"}>
                        {isMemberLeader ? (
                          <span className="flex items-center gap-1">
                            <Crown className="w-3 h-3 text-[var(--accent-team)]" /> Leader
                          </span>
                        ) : (
                          "Member"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                          {m.fullName}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">{m.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between gap-4">
                        <Badge tone={m.isApproved ? "success" : "danger"}>
                          {m.isApproved ? "✓ HOÀN TẤT" : "⚠ CHƯA DUYỆT"}
                        </Badge>

                        {isLeader && !isMemberLeader && teamStatus === "Forming" && (
                          <button
                            onClick={() => handleTransferLeadership(m.userId || "")}
                            disabled={isTransferring}
                            className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-team)] transition-colors underline uppercase tracking-wider"
                          >
                            [Giao Leader]
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>

          {/* Pending Invitations list */}
          {invitations.length > 0 && (
            <div className="mt-6 p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped">
              <h3 className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                // LỜI MỜI ĐANG CHỜ PHẢN HỒI ({invitations.length})
              </h3>
              <div className="space-y-2">
                {invitations.map((inv) => (
                  <div
                    key={inv.id || inv.email}
                    className="p-3 bg-[var(--bg-base)] border border-[var(--border-muted)] text-xs font-mono flex items-center justify-between"
                  >
                    <span className="text-[var(--text-primary)]">{inv.email}</span>
                    <Badge tone="warning">PENDING</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Invite Form Section */}
        {isLeader && teamStatus === "Forming" && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold text-[var(--accent-team)] uppercase tracking-widest border-b border-[var(--border-muted)] pb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              MỜI THÀNH VIÊN
            </h2>

            <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped">
              <p className="text-xs font-mono text-[var(--text-muted)] mb-4 leading-relaxed">
                Nhập email của sinh viên để gửi lời mời tham gia đội. Lời mời sẽ có hiệu lực trong 24 giờ.
              </p>
              <form onSubmit={handleInvite} className="flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="sinhvien@fpt.edu.vn"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  disabled={isInviting || memberCount >= maxTeamSize}
                  className="w-full justify-center text-xs"
                >
                  {isInviting ? "// ĐANG GỬI..." : "[ GỬI LỜI MỜI ]"}
                </Button>
              </form>
            </Card>

            <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-xs font-mono text-[var(--text-muted)] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[var(--accent-primary)] font-bold">
                <Info className="w-3.5 h-3.5" /> LƯU Ý
              </div>
              <p>• Thành viên nhận được lời mời phải bấm Chấp nhận mới được tính vào đội.</p>
              <p>• Tất cả thành viên phải hoàn tất Onboarding (xác minh SV) trước khi Leader chốt danh sách.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
