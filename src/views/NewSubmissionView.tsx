"use client";

import { useState, useMemo } from "react";
import { useCreateSubmission } from "@/repositories/submitResultsRepository";
import { Link } from "@/i18n/routing";
import {
  getMockTeam,
  getMockRounds,
  getMockTracksByRound,
  getMockDeliverables,
  getMockSubmissions,
  type MockRound,
  type MockTrack,
  type MockDeliverable,
  type MockSubmission,
  type DeliverableType,
} from "@/viewModels/mockTeamData";

// ─── Deliverable Icon Metadata ────────────────────────────────────────────────
const DELIVERABLE_ICONS: Record<DeliverableType, { label: string; icon: string; badgeColor: string }> = {
  github:       { label: "GITHUB REPO",     icon: "⌥", badgeColor: "text-[var(--text-primary)] border-[var(--border-muted)] bg-[var(--bg-input)]" },
  slides:       { label: "SLIDES / PPT",    icon: "▦", badgeColor: "text-[#fb923c] border-[#fb923c]/30 bg-[#fb923c]/10" },
  demo_video:   { label: "DEMO VIDEO",      icon: "▶", badgeColor: "text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10" },
  deployed_url: { label: "LIVE DEMO URL",   icon: "⬡", badgeColor: "text-[var(--color-success)] border-[var(--color-success)]/30 bg-[var(--color-success)]/10" },
  report:       { label: "BÁO CÁO PDF",     icon: "▤", badgeColor: "text-[#facc15] border-[#facc15]/30 bg-[#facc15]/10" },
  figma:        { label: "FIGMA DESIGN",    icon: "◈", badgeColor: "text-[#c084fc] border-[#c084fc]/30 bg-[#c084fc]/10" },
  other:        { label: "LINK BỔ SUNG",    icon: "⊕", badgeColor: "text-[var(--text-muted)] border-[var(--border-muted)] bg-[var(--bg-input)]" },
};

// ─── Single Track Submission Card Component ──────────────────────────────────
function TrackSubmissionCard({
  track,
  existingSubmission,
  onSubmitSuccess,
}: {
  track: MockTrack;
  existingSubmission?: MockSubmission;
  onSubmitSuccess: (trackId: string, updatedSub: MockSubmission) => void;
}) {
  const deliverables = getMockDeliverables(track.id);
  const createSubmission = useCreateSubmission();

  // Parse existing submission links if available
  const parsedExisting = useMemo(() => {
    if (!existingSubmission) return { links: {}, notes: "" };
    try {
      const parsed = JSON.parse(existingSubmission.description);
      const linkMap: Record<string, string> = {};
      if (Array.isArray(parsed?.links)) {
        parsed.links.forEach((l: { type: string; url: string }) => {
          if (l.type && l.url) linkMap[l.type] = l.url;
        });
      }
      return { links: linkMap, notes: parsed?.notes || "" };
    } catch {
      return { links: {}, notes: existingSubmission.description || "" };
    }
  }, [existingSubmission]);

  const [linkValues, setLinkValues] = useState<Record<string, string>>(parsedExisting.links);
  const [notes, setNotes] = useState(parsedExisting.notes);
  const [isSaved, setIsSaved] = useState(!!existingSubmission);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check completion
  const { filledCount, requiredFilled, requiredTotal } = useMemo(() => {
    let filled = 0;
    let reqFilled = 0;
    let reqTotal = 0;
    for (const d of deliverables) {
      const val = (linkValues[d.type] || linkValues[d.id] || "").trim();
      const valid = val.startsWith("http://") || val.startsWith("https://");
      if (valid) filled++;
      if (d.required) {
        reqTotal++;
        if (valid) reqFilled++;
      }
    }
    return { filledCount: filled, requiredFilled: reqFilled, requiredTotal: reqTotal };
  }, [deliverables, linkValues]);

  const allRequiredDone = requiredTotal > 0 ? requiredFilled === requiredTotal : true;

  const handleLinkChange = (key: string, val: string) => {
    setLinkValues((prev) => ({ ...prev, [key]: val }));
    setIsSaved(false);
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequiredDone) return;

    setIsSubmitting(true);
    const primaryDeliverable = deliverables.find((d) => d.required);
    const primaryUrl = primaryDeliverable
      ? (linkValues[primaryDeliverable.type] || linkValues[primaryDeliverable.id] || "").trim()
      : Object.values(linkValues).find((v) => v.trim().length > 0) || "";

    const allLinks = deliverables.map((d) => ({
      type: d.type,
      label: d.label,
      url: (linkValues[d.type] || linkValues[d.id] || "").trim(),
      required: d.required,
    }));

    const payload = {
      TrackId: track.id,
      SubmissionUrl: primaryUrl,
      Description: JSON.stringify({ links: allLinks, notes }),
    };

    try {
      await createSubmission.mutateAsync(payload as any);
      const updatedMock: MockSubmission = {
        id: existingSubmission?.id || `sub-${Date.now()}`,
        teamId: "team-001",
        roundId: track.roundId,
        roundName: "Vòng hiện tại",
        trackId: track.id,
        trackName: track.trackName,
        submissionUrl: primaryUrl,
        description: JSON.stringify({ links: allLinks, notes }),
        teamName: "Cyber_Knights",
        createdTime: new Date().toISOString(),
        isActive: true,
        isEliminated: false,
      };
      setIsSaved(true);
      onSubmitSuccess(track.id, updatedMock);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi lưu bài nộp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id={`track-card-${track.id}`}
      className={`bg-[var(--bg-panel)] border hud-clipped transition-all duration-200 overflow-hidden ${
        isSaved
          ? "border-[var(--color-success)]/40 shadow-[0_0_20px_rgba(52,211,153,0.06)]"
          : allRequiredDone
          ? "border-[var(--accent-team)]/50 shadow-[0_0_20px_rgba(103,200,240,0.06)]"
          : "border-[var(--border-muted)]"
      }`}
    >
      {/* ── Card Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border-muted)] bg-[var(--bg-base)]/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[var(--accent-team)] uppercase tracking-widest font-bold">
              HẠNG MỤC THI THẤU
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">·</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">#{track.id}</span>
          </div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mt-0.5">
            {track.trackName}
          </h2>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1 max-w-xl">
            {track.description}
          </p>
        </div>

        {/* Status Indicator Badge */}
        <div className="shrink-0 flex items-center gap-2">
          {isSaved ? (
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 font-mono text-xs font-bold text-[var(--color-success)] uppercase tracking-wider hud-clipped">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              ✓ ĐÃ NỘP BÀI
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 font-mono text-xs font-bold text-[var(--color-warning)] uppercase tracking-wider hud-clipped">
              <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-ping" />
              ⚠ CHƯA NỘP
            </div>
          )}
        </div>
      </div>

      {/* ── Deliverables Form ── */}
      <form onSubmit={handleCardSubmit} className="p-6 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              DANH SÁCH TÀI LIỆU CẦN NỘP ({filledCount}/{deliverables.length})
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              Bắt buộc: <strong className={requiredFilled === requiredTotal ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}>{requiredFilled}/{requiredTotal}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {deliverables.map((dlv) => {
              const meta = DELIVERABLE_ICONS[dlv.type] || DELIVERABLE_ICONS.other;
              const val = linkValues[dlv.type] || linkValues[dlv.id] || "";
              const isFilled = val.trim().length > 0;
              const isValidUrl = isFilled && (val.startsWith("http://") || val.startsWith("https://"));

              return (
                <div
                  key={dlv.id}
                  className={`p-4 border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isValidUrl
                      ? "border-[var(--color-success)]/40 bg-[var(--color-success)]/[0.02]"
                      : isFilled
                      ? "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/[0.02]"
                      : "border-[var(--border-muted)] bg-[var(--bg-base)]/40 hover:border-[var(--border-muted)]/80"
                  }`}
                >
                  {/* Left: Icon & Label */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <span className={`px-2 py-1 font-mono text-[10px] font-bold border ${meta.badgeColor}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        {dlv.label}
                      </span>
                      {dlv.required ? (
                        <span className="font-mono text-[9px] text-[var(--color-danger)] uppercase font-semibold">
                          * Bắt buộc
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">
                          Tuỳ chọn
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Input field */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="url"
                      placeholder={dlv.placeholder || "https://..."}
                      value={val}
                      onChange={(e) => handleLinkChange(dlv.type, e.target.value)}
                      className={`w-full px-3 py-2 bg-[var(--bg-input)] border font-mono text-xs focus:outline-none transition-colors ${
                        isValidUrl
                          ? "border-[var(--color-success)]/40 focus:border-[var(--color-success)] text-[var(--text-primary)]"
                          : isFilled
                          ? "border-[var(--color-danger)]/50 text-[var(--color-danger)]"
                          : "border-[var(--border-muted)] focus:border-[var(--accent-team)] text-[var(--text-primary)]"
                      }`}
                    />
                  </div>

                  {/* Right Status */}
                  <div className="shrink-0 flex items-center gap-2">
                    {isValidUrl ? (
                      <span className="font-mono text-[10px] font-bold text-[var(--color-success)] flex items-center gap-1 border border-[var(--color-success)]/30 px-2 py-1 bg-[var(--color-success)]/10">
                        ✓ ĐÃ ĐIỀN
                      </span>
                    ) : dlv.required ? (
                      <span className="font-mono text-[10px] font-bold text-[var(--color-danger)] flex items-center gap-1 border border-[var(--color-danger)]/30 px-2 py-1 bg-[var(--color-danger)]/10">
                        ○ CHƯA ĐIỀN
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border-muted)] px-2 py-1">
                        TUỲ Ý
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note Area */}
        <div className="flex flex-col gap-1.5 mt-1">
          <label className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            GHI CHÚ THÊM BÀI NỘP HẠNG MỤC NÀY
          </label>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setIsSaved(false);
            }}
            rows={2}
            placeholder="Ghi chú chi tiết về giải pháp, tài khoản demo, v.v..."
            className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] focus:border-[var(--accent-team)] font-mono text-xs text-[var(--text-primary)] focus:outline-none transition-colors resize-none placeholder:text-[var(--text-muted)]/40"
          />
        </div>

        {/* Card Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--border-muted)]/60">
          <div className="font-mono text-xs text-[var(--text-muted)]">
            {isSaved ? (
              <span className="text-[var(--color-success)] font-semibold">
                ✓ Đã lưu bài nộp cho hạng mục {track.trackName}
              </span>
            ) : (
              <span>Vui lòng kiểm tra kỹ các đường link trước khi xác nhận.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!allRequiredDone || isSubmitting}
            className={`hud-clipped px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${
              isSaved
                ? "bg-transparent border border-[var(--accent-team)] text-[var(--accent-team)] hover:bg-[var(--accent-team)]/10"
                : allRequiredDone
                ? "bg-[var(--accent-team)] text-[var(--bg-base)] hover:bg-white hover:shadow-[0_0_15px_rgba(103,200,240,0.4)]"
                : "bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-muted)] opacity-50 cursor-not-allowed"
            }`}
          >
            {isSubmitting
              ? "ĐANG XỬ LÝ..."
              : isSaved
              ? "✏ CẬP NHẬT BÀI NỘP"
              : "🚀 XÁC NHẬN NỘP BÀI"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main NewSubmissionView Component ──────────────────────────────────────────
export function NewSubmissionView() {
  const team = getMockTeam();
  const rounds = getMockRounds(team?.eventId);
  const activeRound = rounds[0] || null;

  const [submissions, setSubmissions] = useState<Record<string, MockSubmission>>(() => {
    const existingList = getMockSubmissions(team?.id);
    const map: Record<string, MockSubmission> = {};
    existingList.forEach((s) => {
      map[s.trackId] = s;
    });
    return map;
  });

  const availableTracks = useMemo(() => {
    if (!activeRound) return [];
    return getMockTracksByRound(activeRound.id);
  }, [activeRound]);

  const handleTrackSubmitSuccess = (trackId: string, updatedSub: MockSubmission) => {
    setSubmissions((prev) => ({
      ...prev,
      [trackId]: updatedSub,
    }));
  };

  // Guard for Non-registered teams
  if (!team || team.status !== "Registered") {
    return (
      <div className="hud-lattice min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[var(--bg-panel)] border border-[var(--color-warning)]/40 hud-clipped p-8 text-center">
          <div className="font-mono text-[10px] text-[var(--color-warning)] tracking-widest uppercase mb-3">
            ⚠ CHƯA ĐỦ ĐIỀU KIỆN NỘP BÀI
          </div>
          <p className="font-mono text-sm text-[var(--text-primary)] mb-4 leading-relaxed">
            {!team ? "Bạn chưa có đội thi." : `Trạng thái đội thi hiện tại: `}
            {team && <span className="font-bold text-[var(--color-warning)]">{team.status}</span>}
            <br />
            <span className="text-xs text-[var(--text-muted)] mt-1 block">
              Đội cần được BTC phê duyệt ghi danh trước khi thực hiện nộp bài.
            </span>
          </p>
          <Link href="/my-team">
            <button className="hud-clipped px-5 py-2.5 border border-[var(--accent-team)] text-[var(--accent-team)] font-mono text-xs tracking-wider uppercase hover:bg-[var(--accent-team)]/10 transition-colors">
              ← VỀ TRANG ĐỘI THI
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)] pb-16">
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)] mb-6">
          <Link href="/my-team" className="hover:text-[var(--accent-team)] transition-colors">
            ĐỘI THI
          </Link>
          <span>›</span>
          <Link href="/my-submissions" className="hover:text-[var(--accent-team)] transition-colors">
            DANH SÁCH BÀI NỘP
          </Link>
          <span>›</span>
          <span className="text-[var(--accent-team)] font-bold">NỘP BÀI THEO HẠNG MỤC</span>
        </div>

        {/* ── Page Header Banner ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 mb-8 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped shadow-sm">
          <div>
            <span className="font-mono text-[10px] text-[var(--accent-team)] tracking-[0.25em] uppercase font-bold">
              CỔNG NỘP BÀI THI CHÍNH THỨC
            </span>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--text-primary)] mt-1">
              Nộp Bài Thi Hackathon
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 font-mono text-xs text-[var(--text-muted)]">
              <span>Đội: <strong className="text-[var(--accent-team)]">{team.name}</strong></span>
              <span>·</span>
              <span>Sự kiện:</span>
              <Link
                href={`/events/${team.eventId}`}
                className="text-[var(--accent-primary)] hover:underline flex items-center gap-1 border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-none font-bold"
              >
                <span>{team.eventName}</span>
                <span className="text-[10px]">↗ XEM CHI TIẾT SỰ KIỆN</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/my-submissions">
              <button className="hud-clipped px-5 py-2.5 border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs tracking-wider uppercase hover:border-[var(--accent-team)] hover:text-[var(--accent-team)] transition-colors">
                XEM QUẢN LÝ BÀI NỘP
              </button>
            </Link>
          </div>
        </div>

        {/* ── Current Round Banner ── */}
        {activeRound && (
          <div className="mb-8 p-5 bg-[var(--bg-panel)]/70 border border-[var(--accent-primary)]/30 hud-clipped flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 flex items-center justify-center font-mono font-bold text-sm text-[var(--accent-primary)]">
                R{activeRound.roundNumber}
              </div>
              <div>
                <div className="font-mono text-[10px] text-[var(--accent-primary)] uppercase font-bold tracking-widest">
                  VÒNG THI ĐANG DIỄN RA
                </div>
                <div className="font-display text-lg font-bold text-[var(--text-primary)]">
                  {activeRound.roundName}
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-[var(--text-muted)] flex flex-wrap items-center gap-3">
              <div className="border border-[var(--accent-team)]/40 bg-[var(--accent-team)]/10 px-3 py-1 text-[var(--accent-team)] font-bold text-xs">
                LẦN NỘP BÀI: <span className="text-[var(--text-primary)]">1 / 3</span> <span className="text-[9px] text-[var(--text-muted)] font-normal">(BR-11 Max 3)</span>
              </div>
              <div>
                Hạn nộp: <strong className="text-[var(--text-primary)]">{new Date(activeRound.endDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong>
              </div>
              <span className="px-2.5 py-1 border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 text-[var(--color-success)] font-bold text-[10px] uppercase">
                ĐANG MỞ CỔNG NỘP
              </span>
            </div>
          </div>
        )}

        {/* ── Scrollable Track Submissions Section List ── */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3">
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
              <span>HẠNG MỤC CẦN NỘP BÀI</span>
              <span className="text-xs text-[var(--text-muted)] font-normal">({availableTracks.length} hạng mục)</span>
            </h2>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              💡 Cuộn xuống để xem và nộp bài cho từng hạng mục
            </span>
          </div>

          {availableTracks.length === 0 ? (
            <div className="p-12 text-center bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped font-mono text-xs text-[var(--text-muted)]">
              Chưa có hạng mục nào cho vòng thi hiện tại.
            </div>
          ) : (
            availableTracks.map((track) => (
              <TrackSubmissionCard
                key={track.id}
                track={track}
                existingSubmission={submissions[track.id]}
                onSubmitSuccess={handleTrackSubmitSuccess}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
