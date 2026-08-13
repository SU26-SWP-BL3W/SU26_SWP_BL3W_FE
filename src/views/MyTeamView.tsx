"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/AuthProvider";
import {
  getMockTeam,
  getMockMembers,
  getMockInvitations,
  MOCK_CURRENT_USER,
  type MockMember,
  type TeamStatus,
} from "@/viewModels/mockTeamData";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  TeamStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  Forming: {
    label: "ĐANG HÌNH THÀNH",
    color: "text-[var(--color-warning)]",
    bg: "bg-[var(--color-warning)]/10",
    border: "border-[var(--color-warning)]/40",
    dot: "bg-[var(--color-warning)]",
  },
  PendingApproval: {
    label: "CHỜ BTC DUYỆT",
    color: "text-[var(--accent-secondary)]",
    bg: "bg-[var(--accent-secondary)]/10",
    border: "border-[var(--accent-secondary)]/40",
    dot: "bg-[var(--accent-secondary)]",
  },
  Registered: {
    label: "ĐÃ ĐĂNG KÝ",
    color: "text-[var(--color-success)]",
    bg: "bg-[var(--color-success)]/10",
    border: "border-[var(--color-success)]/40",
    dot: "bg-[var(--color-success)]",
  },
  Disqualified: {
    label: "ĐÃ BỊ LOẠI",
    color: "text-[var(--color-danger)]",
    bg: "bg-[var(--color-danger)]/10",
    border: "border-[var(--color-danger)]/40",
    dot: "bg-[var(--color-danger)]",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function HudLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-muted)]">
      <span className="w-1.5 h-4 bg-[var(--accent-team)] inline-block" aria-hidden="true" />
      <h2 className="font-mono text-sm font-bold text-[var(--text-primary)] tracking-widest uppercase">
        {children}
      </h2>
    </div>
  );
}

function MemberRow({
  member,
  isCurrentUser,
  isLeader,
  onTransfer,
}: {
  member: MockMember;
  isCurrentUser: boolean;
  isLeader: boolean;
  onTransfer: (userId: string, name: string) => void;
}) {
  const initials = member.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex items-center gap-4 p-4 border-b border-[var(--border-muted)] last:border-0 transition-colors duration-150 hover:bg-[rgba(56,189,248,0.03)] group ${
        isCurrentUser ? "bg-[rgba(56,189,248,0.04)]" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center font-mono font-bold text-sm hud-clipped ${
          member.roleName === "TeamLeader"
            ? "bg-[var(--accent-team)]/20 text-[var(--accent-team)] border border-[var(--accent-team)]/40"
            : "bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-muted)]"
        }`}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-semibold text-[var(--text-primary)] truncate">
            {member.fullName}
          </span>
          {isCurrentUser && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[var(--accent-team)]/20 text-[var(--accent-team)] border border-[var(--accent-team)]/30 tracking-widest uppercase">
              BẠN
            </span>
          )}
          {member.roleName === "TeamLeader" && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[var(--accent-team)]/10 text-[var(--accent-team)] border border-[var(--accent-team)]/20 tracking-widest uppercase">
              [LEAD]
            </span>
          )}
        </div>
        <div className="font-mono text-[11px] text-[var(--text-muted)] truncate mt-0.5">
          {member.email}
        </div>
        <div className="font-mono text-[10px] text-[var(--text-muted)]/60 truncate">
          {member.school}
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <span
          className={`font-mono text-[9px] px-2 py-0.5 border tracking-widest uppercase ${
            member.isApproved
              ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30"
              : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30"
          }`}
        >
          {member.isApproved ? "✓ HỒ SƠ OK" : "✗ CHƯA HỒ SƠ"}
        </span>

        {isLeader && !isCurrentUser && member.roleName !== "TeamLeader" && (
          <button
            onClick={() => onTransfer(member.userId, member.fullName)}
            className="font-mono text-[9px] text-[var(--text-muted)] hover:text-[var(--accent-team)] transition-colors tracking-widest uppercase underline underline-offset-2"
          >
            [Giao quyền Leader]
          </button>
        )}
      </div>
    </div>
  );
}

// ─── No Team State ────────────────────────────────────────────────────────────
function NoTeamState() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `[MOCK] Tạo đội: "${teamName}"\nDescription: "${description}"\n\n→ Sẽ gọi POST /api/Teams khi có API`
    );
  };

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-[var(--accent-team)] tracking-[0.3em] uppercase mb-3 opacity-70">
            {"// TEAM OPERATIONS HUB"}
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--text-primary)] mb-2">
            CHƯA CÓ ĐỘI THI
          </h1>
          <p className="font-mono text-sm text-[var(--text-muted)]">
            Tạo đội mới để bắt đầu tham gia SEAL Hackathon 2026
          </p>
        </div>

        {/* Create Form */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-8">
          <div className="border-l-2 border-[var(--accent-team)] pl-4 mb-6">
            <div className="font-mono text-[10px] text-[var(--accent-team)] tracking-widest uppercase mb-1">
              KHỞI TẠO ĐỘI MỚI
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Bạn sẽ là Team Leader. Đội cần 3–5 thành viên.
            </p>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                Tên đội thi <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                id="team-name-input"
                type="text"
                placeholder="VD: Cyber_Knights_2026"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm transition-all duration-150 focus:outline-none focus:border-[var(--accent-team)] focus:shadow-[0_0_8px_rgba(56,189,248,0.15)] placeholder:text-[var(--text-muted)]/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                Mô tả đội
              </label>
              <textarea
                id="team-desc-input"
                placeholder="Giới thiệu ngắn về đội thi và hướng phát triển..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm transition-all duration-150 focus:outline-none focus:border-[var(--accent-team)] focus:shadow-[0_0_8px_rgba(56,189,248,0.15)] placeholder:text-[var(--text-muted)]/40 resize-none"
              />
            </div>

            <button
              id="create-team-btn"
              type="submit"
              disabled={!teamName.trim()}
              className="hud-clipped mt-2 px-6 py-3.5 bg-[var(--accent-team)] text-[var(--bg-base)] font-mono font-bold tracking-wider uppercase text-sm transition-all duration-200 hover:bg-white hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            >
              {"// KHỞI TẠO ĐỘI >"}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { val: "3–5", label: "Thành viên" },
            { val: "24H", label: "Invite expire" },
            { val: "FPT", label: "Ưu tiên FPT" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[var(--bg-panel)]/50 border border-[var(--border-muted)] p-3 text-center"
            >
              <div className="font-mono text-lg font-bold text-[var(--accent-team)]">
                {item.val}
              </div>
              <div className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export function MyTeamView() {
  const { user, activeRole } = useAuth();
  const roleName = activeRole?.RoleName || (user?.IsAdmin ? "Admin" : "Guest");
  const isLeader = roleName === "TeamLeader";

  const team = getMockTeam();
  const members = getMockMembers();
  const invitations = getMockInvitations();

  const [inviteEmail, setInviteEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState(() => invitations);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState<{ id: string; name: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [teamStatus, setTeamStatus] = useState(team?.status || "Forming");
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);

  // State 1: Chưa có đội
  if (!team) return <NoTeamState />;

  const unapprovedMembers = members.filter((m) => !m.isApproved);
  const memberCount = members.length;
  const hasEnoughMembers = memberCount >= 3 && memberCount <= 5;
  const canConfirm =
    unapprovedMembers.length === 0 && hasEnoughMembers && teamStatus === "Forming";

  const statusCfg = STATUS_CONFIG[teamStatus as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG["Forming"];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newInv = {
      id: `inv-${Date.now()}`,
      teamId: team.id,
      email: inviteEmail.trim(),
      status: "Pending" as const,
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    setPendingInvites((prev) => [newInv, ...prev]);
    setInviteEmail("");
  };

  const handleConfirmRegistration = () => {
    setShowConfirmModal(true);
  };

  const handleSubmitRegistration = async () => {
    setIsSubmittingRegistration(true);
    await new Promise(r => setTimeout(r, 800)); // simulate network response
    setTeamStatus("PendingApproval");
    setIsSubmittingRegistration(false);
    setShowConfirmModal(false);
  };

  const handleTransfer = (userId: string, name: string) => {
    setTransferTarget({ id: userId, name });
    setShowTransferModal(true);
  };

  const confirmTransfer = () => {
    setShowTransferModal(false);
  };

  // ─── Confirm Registration Modal ──────────────────────────────────────────
  const ConfirmRegistrationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--bg-base)]/80 backdrop-blur-sm" onClick={() => !isSubmittingRegistration && setShowConfirmModal(false)} />

      <div className="relative z-10 w-full max-w-md bg-[var(--bg-panel)] border border-[var(--accent-team)]/50 hud-clipped shadow-[0_0_50px_rgba(56,189,248,0.12)]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border-muted)]">
          <div className="font-mono text-[10px] text-[var(--accent-team)] tracking-widest uppercase opacity-70 mb-1">
            {"// XÁC NHẬN ĐĂNG KÝ"}
          </div>
          <h2 className="font-display text-xl font-bold uppercase text-[var(--text-primary)]">
            Ghi Danh Với BTC
          </h2>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
            Đội <span className="text-[var(--accent-team)] font-bold">{team.name}</span> — {team.eventName}
          </p>
        </div>

        {/* Checklist điều kiện */}
        <div className="px-6 py-5 border-b border-[var(--border-muted)]">
          <div className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest uppercase mb-3">KIỂM TRA ĐIỀU KIỆN</div>
          <div className="flex flex-col gap-2">
            {/* Số thành viên */}
            <div className={`flex items-center gap-3 p-3 border hud-clipped ${hasEnoughMembers ? "border-[var(--color-success)]/30 bg-[var(--color-success)]/5" : "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5"}`}>
              <span className={`font-mono text-sm font-bold w-5 text-center ${hasEnoughMembers ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                {hasEnoughMembers ? "✓" : "✗"}
              </span>
              <div className="flex-1">
                <div className="font-mono text-xs text-[var(--text-primary)]">Số thành viên hợp lệ (3–5 người)</div>
                <div className={`font-mono text-[10px] mt-0.5 ${hasEnoughMembers ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                  Hiện tại: {memberCount} người
                </div>
              </div>
            </div>

            {/* Hồ sơ thành viên */}
            <div className={`flex items-center gap-3 p-3 border hud-clipped ${unapprovedMembers.length === 0 ? "border-[var(--color-success)]/30 bg-[var(--color-success)]/5" : "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5"}`}>
              <span className={`font-mono text-sm font-bold w-5 text-center ${unapprovedMembers.length === 0 ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}>
                {unapprovedMembers.length === 0 ? "✓" : "⚠"}
              </span>
              <div className="flex-1">
                <div className="font-mono text-xs text-[var(--text-primary)]">Tất cả thành viên đã xác thực hồ sơ</div>
                {unapprovedMembers.length > 0 && (
                  <div className="font-mono text-[10px] text-[var(--color-warning)] mt-0.5">
                    Chưa xác thực: {unapprovedMembers.map(m => m.fullName).join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Trạng thái đội */}
            <div className="flex items-center gap-3 p-3 border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 hud-clipped">
              <span className="font-mono text-sm font-bold w-5 text-center text-[var(--color-success)]">✓</span>
              <div className="flex-1">
                <div className="font-mono text-xs text-[var(--text-primary)]">Trạng thái đội đang ở Forming</div>
                <div className="font-mono text-[10px] text-[var(--color-success)] mt-0.5">Sẵn sàng gửi hồ sơ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="px-6 py-4 border-b border-[var(--border-muted)]">
          <p className="font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">
            Sau khi ghi danh, trạng thái đội sẽ chuyển sang{" "}
            <span className="text-[var(--accent-secondary)] font-bold">ĐANG CHỜ DUYỆT</span>.
            BTC sẽ xem xét hồ sơ trong vòng <span className="text-[var(--text-primary)]">24–48 giờ</span> làm việc.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4">
          <button
            id="submit-registration-confirm-btn"
            onClick={handleSubmitRegistration}
            disabled={!canConfirm || isSubmittingRegistration}
            className="flex-1 hud-clipped px-4 py-3 bg-[var(--accent-team)] text-[var(--bg-base)] font-mono font-bold text-xs tracking-wider uppercase transition-all hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
          >
            {isSubmittingRegistration ? "ĐANG GỬI..." : "XÁC NHẬN GHI DANH"}
          </button>
          <button
            onClick={() => setShowConfirmModal(false)}
            disabled={isSubmittingRegistration}
            className="hud-clipped px-4 py-3 border border-[var(--border-muted)] text-[var(--text-muted)] font-mono text-xs tracking-wider uppercase hover:border-[var(--accent-primary)] hover:text-white transition-colors focus:outline-none disabled:opacity-40"
          >
            HỦY
          </button>
        </div>
      </div>
    </div>
  );

  if (!team) {
    return (
      <div className="hud-lattice min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-8 sm:p-12 flex flex-col items-center text-center gap-6 shadow-[0_0_30px_rgba(56,189,248,0.06)]">
          
          {/* Hologram Icon */}
          <div className="w-20 h-20 hud-clipped bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 flex items-center justify-center text-[var(--accent-primary)] text-3xl font-mono font-bold">
            🛡
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-[var(--accent-primary)] tracking-widest uppercase">
              SEAL HACKATHON — TEAM HUB
            </span>
            <h1 className="font-display text-3xl font-extrabold uppercase text-[var(--text-primary)]">
              Bạn Chưa Tham Gia Đội Thi Nào
            </h1>
            <p className="font-sans text-sm text-[var(--text-muted)] max-w-lg leading-relaxed mt-1">
              Bạn hiện chưa có Đội thi chính thức nào trong mùa giải năm nay. Hãy chọn một Sự kiện đang mở đăng ký để tạo Đội mới hoặc chấp nhận lời mời từ đồng đội!
            </p>
          </div>

          {/* 3 Step Guidance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full my-2 text-left font-mono text-xs">
            <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)]">
              <span className="text-[var(--accent-primary)] font-bold">01.</span> Duyệt sự kiện đang diễn ra
            </div>
            <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)]">
              <span className="text-[var(--accent-team)] font-bold">02.</span> Tìm đồng đội & Tạo Đội thi
            </div>
            <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)]">
              <span className="text-[var(--accent-judge)] font-bold">03.</span> Ghi danh & Nộp sản phẩm
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/events">
              <button className="hud-clipped px-6 py-3.5 bg-[var(--accent-primary)] text-[var(--bg-base)] font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md">
                🔍 KHÁM PHÁ SỰ KIỆN ĐANG MỞ ĐĂNG KÝ →
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)]">
      {/* Confirm Registration Modal */}
      {showConfirmModal && <ConfirmRegistrationModal />}
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <HudLabel>TEAM OPERATIONS HUB</HudLabel>
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-[var(--accent-team)] mt-1">
              {team.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="font-mono text-xs text-[var(--text-muted)] border border-[var(--border-muted)] px-2 py-0.5">
                #{team.id.toUpperCase()}
              </span>
              <span
                className={`flex items-center gap-1.5 font-mono text-[10px] font-bold px-2.5 py-1 border tracking-widest uppercase ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${teamStatus === "PendingApproval" ? "animate-pulse" : ""}`} />
                {statusCfg.label}
              </span>
              <Link
                href={`/events/${team.eventId}`}
                className="font-mono text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1 border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-2.5 py-0.5 rounded-none transition-colors"
              >
                <span>{team.eventName}</span>
                <span className="text-[10px]">↗ XEM CHI TIẾT</span>
              </Link>
            </div>
            {team.description && (
              <p className="font-mono text-xs text-[var(--text-muted)] mt-2 max-w-xl leading-relaxed">
                {team.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            {isLeader && teamStatus === "Forming" && (
              <button
                id="confirm-registration-btn"
                onClick={handleConfirmRegistration}
                disabled={!canConfirm}
                title={!canConfirm ? "Kiểm tra điều kiện bên dưới" : "Xác nhận đăng ký với BTC"}
                className="hud-clipped px-6 py-3 bg-[var(--accent-team)] text-[var(--bg-base)] font-mono font-bold tracking-wider uppercase text-xs transition-all duration-200 hover:bg-white hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
              >
                GHI DANH VỚI BTC →
              </button>
            )}

            {!isLeader && teamStatus === "Forming" && (
              <button
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn rời khỏi đội thi này không?")) {
                    alert("Bạn đã rời khỏi đội thành công.");
                    window.location.reload();
                  }
                }}
                className="hud-clipped px-5 py-2.5 border border-[var(--color-danger)]/50 text-[var(--color-danger)] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-danger)]/10 transition-all focus:outline-none"
              >
                🚪 RỜI ĐỘI THI
              </button>
            )}

            {teamStatus === "Registered" && (
              <Link href="/submissions/new">
                <button
                  id="submit-project-btn"
                  className="hud-clipped px-6 py-3 bg-[var(--accent-team)] text-[var(--bg-base)] font-mono font-bold tracking-wider uppercase text-xs transition-all duration-200 hover:bg-white hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] focus:outline-none"
                >
                  {"// NỘP BÀI THI >"}
                </button>
              </Link>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/my-submissions">
                <button
                  id="view-submissions-btn"
                  className="hud-clipped px-4 py-2.5 bg-transparent border border-[var(--border-muted)] text-[var(--text-muted)] font-mono text-xs tracking-wider uppercase transition-all duration-200 hover:border-[var(--accent-team)] hover:text-[var(--accent-team)] focus:outline-none"
                >
                  [ XEM QUẢN LÝ BÀI NỘP ]
                </button>
              </Link>
              <Link href={`/events/${team.eventId}/leaderboard`}>
                <button
                  className="hud-clipped px-4 py-2.5 bg-transparent border border-[var(--accent-judge)]/40 text-[var(--accent-judge)] font-mono text-xs tracking-wider uppercase transition-all duration-200 hover:bg-[var(--accent-judge)]/10 focus:outline-none"
                >
                  🏆 BẢNG XẾP HẠNG
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Warning Banners ── */}
        {team.status === "Disqualified" && (
          <div className="mb-6 p-4 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/40 hud-clipped">
            <div className="font-mono text-sm font-bold text-[var(--color-danger)] mb-1">
              ✗ ĐỘI THI ĐÃ BỊ LOẠI
            </div>
            <p className="font-mono text-xs text-[var(--color-danger)]/70">
              Đội thi của bạn đã bị BTC loại khỏi cuộc thi. Vui lòng liên hệ ban tổ chức để biết thêm chi tiết.
            </p>
          </div>
        )}

        {team.status === "PendingApproval" && (
          <div className="mb-6 p-4 bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 hud-clipped">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-pulse" />
              <span className="font-mono text-sm font-bold text-[var(--accent-secondary)]">
                ĐANG CHỜ BTC PHÊ DUYỆT
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Hồ sơ đăng ký đã được gửi. BTC sẽ xem xét và phản hồi trong vòng 24–48 giờ làm việc.
            </p>
          </div>
        )}

        {team.status === "Forming" && (unapprovedMembers.length > 0 || !hasEnoughMembers) && (
          <div className="mb-6 p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 hud-clipped">
            <div className="font-mono text-sm font-bold text-[var(--color-warning)] mb-2">
              ⚠ CHƯA ĐỦ ĐIỀU KIỆN GHI DANH
            </div>
            <ul className="space-y-1">
              {!hasEnoughMembers && (
                <li className="font-mono text-xs text-[var(--color-warning)]/80 flex items-center gap-2">
                  <span>›</span>
                  Đội cần 3–5 thành viên (hiện tại: {memberCount} người)
                </li>
              )}
              {unapprovedMembers.map((m) => (
                <li key={m.userId} className="font-mono text-xs text-[var(--color-warning)]/80 flex items-center gap-2">
                  <span>›</span>
                  <span className="text-[var(--color-warning)]">{m.fullName}</span> chưa hoàn tất hồ sơ cá nhân
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Roster */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Member count bar */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-4">
              <SectionTitle>DANH SÁCH THÀNH VIÊN</SectionTitle>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 bg-[var(--bg-input)] h-2 rounded-none overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 bg-[var(--accent-team)]"
                    style={{ width: `${Math.min((memberCount / 5) * 100, 100)}%` }}
                  />
                </div>
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    hasEnoughMembers ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"
                  }`}
                >
                  {memberCount} / 5
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                  {memberCount < 3 ? "Cần thêm " + (3 - memberCount) : hasEnoughMembers ? "Đủ điều kiện" : "Đã đủ"}
                </span>
              </div>
            </div>

            {/* Member List */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped overflow-hidden">
              {members.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="font-mono text-[var(--text-muted)] text-sm">Chưa có thành viên nào</div>
                  <div className="font-mono text-[var(--text-muted)] text-xs mt-1 opacity-60">Mời thành viên bằng email bên phải</div>
                </div>
              ) : (
                members.map((m) => (
                  <MemberRow
                    key={m.userId}
                    member={m}
                    isCurrentUser={
                      isLeader
                        ? m.roleName === "TeamLeader"
                        : m.roleName === "TeamMember" && m.userId === "usr-002"
                    }
                    isLeader={isLeader}
                    onTransfer={handleTransfer}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Leader Actions */}
          <div className="flex flex-col gap-4">

            {/* Invite */}
            {isLeader && (
              <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-5">
                <SectionTitle>MỜI THÀNH VIÊN</SectionTitle>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!inviteEmail.trim()) return;
                    const newInv = {
                      id: `inv-${Date.now()}`,
                      teamId: team.id,
                      email: inviteEmail.trim(),
                      status: "Pending" as const,
                      sentAt: new Date().toISOString(),
                      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    };
                    setPendingInvites((prev) => [newInv, ...prev]);
                    setInviteEmail("");
                  }}
                  className="flex flex-col gap-3 mt-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
                      Email sinh viên
                    </label>
                    <input
                      id="invite-email-input"
                      type="email"
                      placeholder="ten@truong.edu.vn"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-team)] transition-all placeholder:text-[var(--text-muted)]/40"
                    />
                    <p className="font-mono text-[9px] text-[var(--text-muted)]/70 leading-relaxed">
                      Lời mời tự động hết hạn sau <strong>24 giờ</strong>.
                    </p>
                  </div>
                  <button
                    id="send-invite-btn"
                    type="submit"
                    disabled={!inviteEmail.trim() || memberCount >= 5}
                    className="hud-clipped px-4 py-2.5 bg-transparent border border-[var(--accent-team)] text-[var(--accent-team)] font-mono text-xs tracking-wider uppercase transition-all hover:bg-[var(--accent-team)] hover:text-[var(--bg-base)] disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
                  >
                    [ GỬI LỜI MỜI ]
                  </button>
                  {memberCount >= 5 && (
                    <p className="font-mono text-[9px] text-[var(--color-warning)] text-center">Đội đã đủ 5 thành viên tối đa</p>
                  )}
                </form>
              </div>
            )}

            {/* Outgoing Invitations Tracker */}
            {isLeader && (
              <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-muted)] mb-4">
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    LỜI MỜI ĐÃ GỬI ({pendingInvites.length})
                  </span>
                  <span className="font-mono text-[9px] text-[var(--text-muted)]">24h Expiry</span>
                </div>

                {pendingInvites.length === 0 ? (
                  <p className="font-mono text-xs text-[var(--text-muted)] text-center py-4">
                    Chưa gửi lời mời nào. Nhập email ở trên để mời thành viên.
                  </p>
                ) : (

                <div className="flex flex-col gap-2.5">
                  {pendingInvites.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex flex-col gap-2 p-3 bg-[var(--bg-input)]/50 border border-[var(--border-muted)] hud-clipped"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)] truncate max-w-[150px]">
                          {inv.email}
                        </span>
                        <span className="font-mono text-[9px] text-[var(--color-warning)] bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 px-1.5 py-0.5 uppercase">
                          ⏳ Đang chờ (24h)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-muted)]/40">
                        <span>Gửi: {new Date(inv.sentAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Xác nhận hủy lời mời gửi đến ${inv.email}?`)) {
                              setPendingInvites((prev) => prev.filter((item) => item.id !== inv.id));
                            }
                          }}
                          className="text-[var(--color-danger)] hover:underline uppercase font-bold text-[9px]"
                        >
                          [ HỦY MỜI ]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Team Info Card */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-5">
              <SectionTitle>THÔNG TIN ĐỘI</SectionTitle>
              <div className="flex flex-col gap-3 mt-4">
                {[
                  { label: "Sự kiện", value: team.eventName },
                  { label: "Ngày tạo", value: new Date(team.createdTime).toLocaleDateString("vi-VN") },
                  { label: "Thành viên", value: `${memberCount} người` },
                  { label: "Vai trò bạn", value: isLeader ? "Team Leader [LEAD]" : "Team Member" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center border-b border-[var(--border-muted)]/50 pb-2 last:border-0">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{item.label}</span>
                    <span className={`font-mono text-xs ${isLeader && item.label === "Vai trò bạn" ? "text-[var(--accent-team)]" : "text-[var(--text-primary)]"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Transfer Leader Modal ── */}
      {showTransferModal && transferTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[var(--bg-panel)] border border-[var(--color-warning)]/50 hud-clipped p-8 max-w-sm w-full">
            <div className="font-mono text-[10px] text-[var(--color-warning)] tracking-widest uppercase mb-4">
              ⚠ XÁC NHẬN CHUYỂN GIAO QUYỀN
            </div>
            <p className="font-mono text-sm text-[var(--text-primary)] mb-2">
              Chuyển quyền Leader cho:
            </p>
            <div className="font-mono text-base font-bold text-[var(--accent-team)] mb-4">
              {transferTarget.name}
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
              Sau khi chuyển, bạn sẽ trở thành Team Member. Yêu cầu có hiệu lực trong 24 giờ.
            </p>
            <div className="flex gap-3">
              <button
                id="confirm-transfer-btn"
                onClick={confirmTransfer}
                className="flex-1 hud-clipped px-4 py-2.5 bg-[var(--color-warning)] text-[var(--bg-base)] font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:bg-white focus:outline-none"
              >
                [ XÁC NHẬN ]
              </button>
              <button
                id="cancel-transfer-btn"
                onClick={() => setShowTransferModal(false)}
                className="flex-1 hud-clipped px-4 py-2.5 bg-transparent border border-[var(--border-muted)] text-[var(--text-muted)] font-mono text-xs tracking-wider uppercase transition-all hover:border-[var(--accent-primary)] hover:text-white focus:outline-none"
              >
                [ HỦY ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
