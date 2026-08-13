"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/AuthProvider";
import {
  getMockSubmissions,
  getMockDeliverables,
  getMockTeam,
  type MockSubmission,
  type MockDeliverable,
} from "@/viewModels/mockTeamData";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ sub }: { sub: MockSubmission }) {
  if (sub.isEliminated)
    return (
      <span className="font-mono text-[9px] px-2 py-0.5 border bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30 tracking-widest uppercase">
        ✗ BỊ LOẠI
      </span>
    );
  if (!sub.isActive)
    return (
      <span className="font-mono text-[9px] px-2 py-0.5 border bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--border-muted)] tracking-widest uppercase">
        ĐÃ HỦY
      </span>
    );
  return (
    <span className="font-mono text-[9px] px-2 py-0.5 border bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30 tracking-widest uppercase">
      ✓ ĐÃ NỘP
    </span>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
  sub,
  onClose,
  onSave,
}: {
  sub: MockSubmission;
  onClose: () => void;
  onSave: (id: string, url: string, desc: string) => void;
}) {
  const [editUrl, setEditUrl] = useState(sub.submissionUrl);
  const [editDesc, setEditDesc] = useState(sub.description);
  const deliverables: MockDeliverable[] = getMockDeliverables(sub.trackId);

  // Nếu track có cấu hình deliverables → parse JSON links, ngược lại edit đơn giản
  const hasDeliverables = deliverables.length > 0;
  let parsedLinks: Record<string, string> = {};
  if (hasDeliverables) {
    try {
      const parsed = JSON.parse(sub.description);
      if (parsed?.links) {
        parsedLinks = Object.fromEntries(
          parsed.links.map((l: { type: string; url: string }) => [l.type, l.url])
        );
      }
    } catch {
      // description là plain text
    }
  }

  const [linkValues, setLinkValues] = useState<Record<string, string>>(parsedLinks);
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(sub.description)?.notes ?? ""; } catch { return ""; }
  });

  const handleSave = () => {
    if (hasDeliverables) {
      // Rebuild JSON description
      const links = deliverables.map(d => ({
        type: d.type,
        label: d.label,
        url: (linkValues[d.type] ?? "").trim(),
        required: d.required,
      }));
      const primaryDlv = deliverables.find(d => d.required);
      const primaryUrl = primaryDlv ? (linkValues[primaryDlv.type] ?? editUrl) : editUrl;
      onSave(sub.id, primaryUrl, JSON.stringify({ links, notes }));
    } else {
      onSave(sub.id, editUrl, editDesc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--bg-base)]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--accent-team)]/40 hud-clipped shadow-[0_0_40px_rgba(56,189,248,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-muted)]">
          <div>
            <div className="font-mono text-[10px] text-[var(--accent-team)] tracking-widest uppercase opacity-70">
              {"// CHỈNH SỬA BÀI NỘP"}
            </div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5">
              {sub.roundName} · {sub.trackName}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[var(--text-muted)] hover:text-white transition-colors text-lg leading-none focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {hasDeliverables ? (
            <>
              {/* Required */}
              {deliverables.filter(d => d.required).length > 0 && (
                <div>
                  <div className="font-mono text-[9px] text-[var(--color-danger)] tracking-widest uppercase mb-2">
                    BẮT BUỘC
                  </div>
                  <div className="flex flex-col gap-3">
                    {deliverables.filter(d => d.required).map(d => {
                      const val = linkValues[d.type] ?? "";
                      const valid = val.startsWith("http");
                      return (
                        <div key={d.id}>
                          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                            {d.label}{" "}
                            <span className="text-[var(--color-danger)]">*</span>
                          </label>
                          <input
                            type="url"
                            value={val}
                            placeholder={d.placeholder}
                            onChange={e => setLinkValues(prev => ({ ...prev, [d.type]: e.target.value }))}
                            className={`w-full px-3 py-2 bg-[var(--bg-input)] border font-mono text-sm focus:outline-none transition-all placeholder:text-[var(--text-muted)]/35 ${
                              valid
                                ? "border-[var(--color-success)]/50 focus:border-[var(--color-success)]"
                                : val
                                ? "border-[var(--color-danger)]/50"
                                : "border-[var(--border-muted)] focus:border-[var(--accent-team)]"
                            } text-[var(--text-primary)]`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Optional */}
              {deliverables.filter(d => !d.required).length > 0 && (
                <div>
                  <div className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest uppercase mb-2">
                    TUỲ CHỌN
                  </div>
                  <div className="flex flex-col gap-3">
                    {deliverables.filter(d => !d.required).map(d => {
                      const val = linkValues[d.type] ?? "";
                      return (
                        <div key={d.id}>
                          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                            {d.label}
                          </label>
                          <input
                            type="url"
                            value={val}
                            placeholder={d.placeholder}
                            onChange={e => setLinkValues(prev => ({ ...prev, [d.type]: e.target.value }))}
                            className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] focus:border-[var(--accent-team)] font-mono text-sm focus:outline-none transition-all placeholder:text-[var(--text-muted)]/35 text-[var(--text-primary)]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  Ghi Chú
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Mô tả thêm về bài nộp..."
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] focus:border-[var(--accent-team)] font-mono text-sm focus:outline-none transition-all placeholder:text-[var(--text-muted)]/35 text-[var(--text-primary)] resize-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Simple edit */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  URL Bài Nộp <span className="text-[var(--color-danger)]">*</span>
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={e => setEditUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] focus:border-[var(--accent-team)] font-mono text-sm focus:outline-none transition-all text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  Mô Tả
                </label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] focus:border-[var(--accent-team)] font-mono text-sm focus:outline-none transition-all text-[var(--text-primary)] resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-[var(--border-muted)]">
          <button
            id="save-edit-btn"
            onClick={handleSave}
            className="flex-1 hud-clipped px-4 py-2.5 bg-[var(--accent-team)] text-[var(--bg-base)] font-mono font-bold text-xs tracking-wider uppercase transition-all hover:bg-white focus:outline-none"
          >
            LƯU THAY ĐỔI
          </button>
          <button
            onClick={onClose}
            className="hud-clipped px-4 py-2.5 border border-[var(--border-muted)] text-[var(--text-muted)] font-mono text-xs tracking-wider uppercase hover:border-[var(--accent-primary)] hover:text-white transition-colors focus:outline-none"
          >
            HỦY
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export function MySubmissionsView() {
  const { user, activeRole } = useAuth();
  const roleName = activeRole?.RoleName || (user?.IsAdmin ? "Admin" : "Guest");
  const isLeader = roleName === "TeamLeader";

  const team = getMockTeam();
  const isRegistered = team?.status === "Registered";

  const [submissions, setSubmissions] = useState(() => getMockSubmissions(team?.id));
  const [editingSub, setEditingSub] = useState<MockSubmission | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const visibleSubs = submissions.filter(s => !deletedIds.has(s.id));

  const handleSave = (id: string, url: string, desc: string) => {
    setSubmissions(prev =>
      prev.map(s => s.id === id ? { ...s, submissionUrl: url, description: desc } : s)
    );
    setEditingSub(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Xác nhận xóa bài nộp này? Hành động không thể hoàn tác.")) {
      setDeletedIds(prev => new Set([...prev, id]));
    }
  };

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)]">
      {/* Edit Modal */}
      {editingSub && (
        <EditModal
          sub={editingSub}
          onClose={() => setEditingSub(null)}
          onSave={handleSave}
        />
      )}

      <div className="max-w-[var(--container-max)] mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-[10px] text-[var(--accent-team)] tracking-[0.25em] uppercase font-bold">
              SUBMISSION MANAGEMENT
            </span>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--text-primary)] mt-1">
              Bài Nộp Của Đội
            </h1>
            {team && (
              <p className="font-mono text-xs text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-2">
                <span>Đội: <span className="text-[var(--accent-team)] font-bold">{team.name}</span></span>
                <span>·</span>
                <span>Sự kiện:</span>
                <Link
                  href={`/events/${team.eventId}`}
                  className="text-[var(--accent-primary)] hover:underline flex items-center gap-1 border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-none font-bold"
                >
                  <span>{team.eventName}</span>
                  <span className="text-[10px]">↗ XEM CHI TIẾT</span>
                </Link>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/events/${team?.eventId || "event-seal-2026"}/leaderboard`}>
              <button className="hud-clipped px-4 py-3 border border-[var(--accent-judge)]/40 bg-[var(--accent-judge)]/10 text-[var(--accent-judge)] font-mono text-xs font-bold tracking-wider uppercase hover:bg-[var(--accent-judge)]/20 transition-all focus:outline-none whitespace-nowrap">
                🏆 BẢNG XẾP HẠNG
              </button>
            </Link>

            {isRegistered ? (
              <Link href="/submissions/new">
                <button
                  id="new-submission-btn"
                  className="hud-clipped px-6 py-3 bg-[var(--accent-team)] text-[var(--bg-base)] font-mono font-bold tracking-wider uppercase text-sm transition-all duration-200 hover:bg-white hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] focus:outline-none whitespace-nowrap"
                >
                  + NỘP BÀI MỚI
                </button>
              </Link>
            ) : (
              <div
                className="hud-clipped px-6 py-3 bg-[var(--bg-panel)] border border-[var(--border-muted)] font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase cursor-not-allowed"
                title={!team ? "Bạn chưa có đội thi" : "Đội cần được BTC xác nhận trước khi nộp bài"}
              >
                {!team ? "CHƯA CÓ ĐỘI" : `ĐĂNG KÝ: ${team.status.toUpperCase()}`}
              </div>
            )}
          </div>
        </div>

        {/* ── Warning banners ── */}
        {team && !isRegistered && (
          <div className="mb-6 p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 hud-clipped">
            <p className="font-mono text-xs text-[var(--color-warning)]">
              ⚠ Chỉ có thể nộp bài sau khi đội được BTC <strong>phê duyệt đăng ký</strong>.
              Trạng thái hiện tại: <span className="font-bold uppercase">{team.status}</span>
            </p>
          </div>
        )}
        {!team && (
          <div className="mb-6 p-4 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 hud-clipped">
            <p className="font-mono text-xs text-[var(--color-danger)]">
              ✗ Bạn chưa có đội thi.{" "}
              <Link href="/my-team" className="underline hover:text-white">Tạo hoặc tham gia đội</Link>.
            </p>
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[var(--border-muted)] bg-[var(--bg-base)]">
            {[
              { label: "VÒNG THI",   col: "col-span-2" },
              { label: "HẠNG MỤC",  col: "col-span-2" },
              { label: "LINK NỘP",  col: "col-span-4" },
              { label: "TRẠNG THÁI",col: "col-span-2" },
              { label: "THAO TÁC",  col: "col-span-2" },
            ].map(h => (
              <div key={h.label} className={`font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase ${h.col}`}>
                {h.label}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {visibleSubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="font-mono text-2xl text-[var(--border-muted)]">{"[ ]"}</div>
              <p className="font-mono text-sm text-[var(--text-muted)]">Chưa có bài nộp nào</p>
              {isRegistered && (
                <Link href="/submissions/new">
                  <button className="hud-clipped mt-2 px-5 py-2 border border-[var(--accent-team)]/50 text-[var(--accent-team)] font-mono text-xs tracking-wider uppercase hover:bg-[var(--accent-team)]/10 transition-colors">
                    [ NỘP BÀI ĐẦU TIÊN ]
                  </button>
                </Link>
              )}
            </div>
          ) : (
            visibleSubs.map(sub => (
              <div key={sub.id} className="border-b border-[var(--border-muted)] last:border-0">
                <div className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-[rgba(56,189,248,0.02)] transition-colors items-center">
                  {/* Vòng */}
                  <div className="col-span-2 font-mono text-xs text-[var(--text-primary)] font-semibold">
                    {sub.roundName}
                  </div>

                  {/* Track */}
                  <div className="col-span-2 font-mono text-xs text-[var(--text-muted)]">
                    {sub.trackName}
                  </div>

                  {/* URL */}
                  <div className="col-span-4 min-w-0">
                    <a
                      href={sub.submissionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-[var(--accent-primary)] hover:underline truncate block"
                      title={sub.submissionUrl}
                    >
                      {sub.submissionUrl}
                    </a>
                    {sub.description && (() => {
                      try {
                        const parsed = JSON.parse(sub.description);
                        const extras = parsed.links?.filter((l: { url: string }) => l.url).length ?? 0;
                        if (extras > 1) return (
                          <p className="font-mono text-[9px] text-[var(--text-muted)]/60 mt-0.5">
                            +{extras - 1} link khác
                          </p>
                        );
                      } catch { /* plain text */ }
                      return sub.description ? (
                        <p className="font-mono text-[10px] text-[var(--text-muted)]/70 mt-0.5 truncate">
                          {sub.description}
                        </p>
                      ) : null;
                    })()}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge sub={sub} />
                    {sub.isEliminated && sub.eliminatedReason && (
                      <p className="font-mono text-[9px] text-[var(--color-danger)]/70 mt-1">{sub.eliminatedReason}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex flex-wrap gap-1.5 items-center">
                    {sub.isActive && !sub.isEliminated && (
                      <button
                        id={`edit-sub-${sub.id}`}
                        onClick={() => setEditingSub(sub)}
                        disabled={!isRegistered || !isLeader}
                        title={
                          !isRegistered
                            ? "Đội thi cần được BTC duyệt đăng ký mới được phép sửa bài"
                            : !isLeader
                            ? "Chỉ Trưởng đội thi mới có quyền chỉnh sửa bài nộp"
                            : "Chỉnh sửa nội dung bài nộp"
                        }
                        className={`font-mono text-[10px] px-2 py-1 border transition-colors uppercase flex items-center gap-1 ${
                          isRegistered && isLeader
                            ? "border-[var(--accent-team)]/40 text-[var(--accent-team)] hover:bg-[var(--accent-team)]/10 cursor-pointer"
                            : "border-[var(--border-muted)] text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                        }`}
                      >
                        ✏ SỬA BÀI
                      </button>
                    )}
                    <Link href={`/appeals?subId=${sub.id}`}>
                      <button
                        className="font-mono text-[10px] px-2 py-1 border border-[var(--accent-coordinator)]/40 text-[var(--accent-coordinator)] hover:bg-[var(--accent-coordinator)]/10 transition-colors uppercase flex items-center gap-1"
                        title="Nộp đơn phúc khảo/khiếu nại kết quả cho bài nộp này"
                      >
                        ⚖ PHÚC KHẢO
                      </button>
                    </Link>
                  </div>
                </div>

                {/* ── Evaluation Transparency: Public Judge Scores & Comments ── */}
                <div className="px-5 py-4 bg-[var(--bg-base)] border-t border-[var(--border-muted)] flex flex-col gap-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--accent-judge)] uppercase flex items-center gap-2">
                      <span>⚖ BẢNG ĐIỂM & NHẬN XÉT CỦA GIÁM KHẢO</span>
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      // MINH BẠCH DÀNH CHO ĐỘI THI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-[var(--bg-panel)] border border-[var(--accent-judge)]/30 hud-clipped space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--text-primary)]">
                          👨‍⚖️ TS. Nguyễn Văn A
                        </span>
                        <span className="font-bold text-[var(--accent-judge)]">9.2 / 10</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] italic">
                        "Kiến trúc microservices xuất sắc, mã nguồn sạch sẽ và có tính ứng dụng thực tế cao."
                      </p>
                    </div>

                    <div className="p-3 bg-[var(--bg-panel)] border border-[var(--accent-judge)]/30 hud-clipped space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--text-primary)]">
                          👨‍⚖️ ThS. Trần Thị B
                        </span>
                        <span className="font-bold text-[var(--accent-judge)]">9.5 / 10</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] italic">
                        "Giải pháp an ninh mạng ấn tượng, tiêu chí kỹ thuật đáp ứng đầy đủ yêu cầu RBL."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
      </div>

        {/* Footer */}
        {visibleSubs.length > 0 && (
          <div className="mt-4 flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
            <span>
              Tổng: <span className="text-[var(--text-primary)] font-bold">{visibleSubs.length}</span> bài nộp
            </span>
            <Link href="/my-team" className="hover:text-[var(--accent-team)] transition-colors">
              ← Về trang đội thi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
