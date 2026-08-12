"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useMyTeam, useCreateTeam, useInviteMember } from "@/repositories/teamsRepository";
import { Button, Input, Card, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui";

export function MyTeamView() {
  const { user, activeRole } = useAuth();
  const { data, isLoading } = useMyTeam();
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutateAsync: inviteMember, isPending: isInviting } = useInviteMember();

  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  if (isLoading) return <div className="p-8 text-white font-mono text-center mt-20">Đang tải dữ liệu đội thi...</div>;
  if (!user) return <div className="p-8 text-white font-mono text-center mt-20">Vui lòng đăng nhập...</div>;

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTeam({ TeamName: teamName, EventId: "event-1" }).catch(() => {
        alert("Mock: Tạo team thành công (chờ API nối)");
    });
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.team) return;
    await inviteMember({ teamId: data.team.TeamId, email: inviteEmail }).catch(() => {
        alert("Mock: Đã gửi lời mời (chờ API nối)");
    });
    setInviteEmail("");
  };

  // State 1: Chưa có team
  if (!data?.team) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] hud-lattice px-4">
        <Card className="w-full max-w-md p-[var(--space-xl)] bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]">
          <h2 className="font-display text-[length:var(--fs-heading-md)] font-bold text-[var(--accent-team)] mb-6 text-center tracking-widest uppercase">
            CHƯA GHI DANH ĐỘI THI
          </h2>
          <form onSubmit={handleCreateTeam} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                Tên đội thi mới
              </label>
              <Input 
                type="text" 
                placeholder="Ví dụ: Cyber_Knights" 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isCreating} className="mt-4 w-full justify-center">
              {"// KHỞI TẠO ĐỘI >"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // State 2: Đã có team
  const isLeader = activeRole?.RoleName === "TeamLeader" || data.members?.some(m => m.UserId === user.UserID && m.RoleName === "TeamLeader");
  const hasUnapprovedMembers = data.members?.some(m => !m.IsApproved);
  const memberCount = data.members?.length || 0;
  const isRuleMet = memberCount >= 3 && memberCount <= 5;
  const canConfirm = !hasUnapprovedMembers && isRuleMet;

  const handleTransferLeadership = (targetUserId: string) => {
    alert(`Mock: Chuyển quyền đội trưởng cho user ${targetUserId} thành công (chờ API)`);
  };

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-[var(--accent-team)]">
            {data.team.TeamName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge tone="team">ID: {data.team.TeamId || "#TM-MOCK"}</Badge>
            <Badge tone={data.team.Status === "Registered" ? "success" : "warning"}>
              {data.team.Status || "FORMING"}
            </Badge>
          </div>
        </div>
        
        {isLeader && data.team.Status === "Forming" && (
          <Button disabled={!canConfirm} title={!canConfirm ? "Điều kiện ghi danh chưa thỏa mãn" : ""}>
            {"// XÁC NHẬN GHI DANH >"}
          </Button>
        )}
      </div>

      {(hasUnapprovedMembers || !isRuleMet) && (
        <div className="mb-8 p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-none hud-clipped">
          <p className="text-sm font-mono text-[var(--color-warning)]">
            ⚠ Không thể chốt danh sách đội thi! Các điều kiện chưa thỏa mãn:
          </p>
          <ul className="list-disc list-inside text-xs font-mono text-[var(--color-warning)] mt-2 opacity-80">
            {hasUnapprovedMembers && <li>Có thành viên chưa hoàn tất hồ sơ cá nhân.</li>}
            {!isRuleMet && <li>Đội thi phải có từ 3 đến 5 thành viên (hiện tại: {memberCount}).</li>}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2">
            Roster (Thành viên)
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vai trò</TableHead>
                <TableHead>Tên thành viên</TableHead>
                <TableHead>Trạng thái Hồ sơ</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {data.members?.map(m => (
                <TableRow key={m.UserId}>
                  <TableCell>
                    <Badge tone={m.RoleName === "TeamLeader" ? "team" : "neutral"}>
                      {m.RoleName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{m.FullName}</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">{m.Email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between gap-4">
                      <Badge tone={m.IsApproved ? "success" : "danger"}>
                        {m.IsApproved ? "Đã duyệt" : "Chưa hoàn tất"}
                      </Badge>
                      {isLeader && m.RoleName !== "TeamLeader" && (
                        <button 
                          onClick={() => handleTransferLeadership(m.UserId)}
                          className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-team)] transition-colors underline uppercase tracking-wider"
                        >
                          [Giao quyền]
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!data.members || data.members.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="text-[var(--text-muted)]">
                    Dữ liệu giả lập: Đội thi chưa có thành viên nào.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>

        {isLeader && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-[var(--accent-team)] uppercase tracking-widest border-b border-[var(--border-muted)] pb-2">
              Quản lý
            </h2>
            <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped">
              <h3 className="font-mono text-sm text-[var(--text-primary)] mb-4">Mời thành viên mới</h3>
              <form onSubmit={handleInvite} className="flex flex-col gap-3">
                <Input 
                  type="email" 
                  placeholder="Email sinh viên..." 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isInviting} className="w-full justify-center text-xs">
                  [ GỬI LỜI MỜI ]
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
