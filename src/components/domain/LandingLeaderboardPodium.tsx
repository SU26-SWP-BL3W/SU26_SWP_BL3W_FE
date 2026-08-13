"use client";

import { MOCK_PODIUM_TEAMS, MOCK_PODIUM_EVENT_NAME, MOCK_PODIUM_TOTAL_PRIZE } from "@/viewModels/mockEventsData";

function formatVnd(val: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(val)} ₫`;
}

// ─── Single Podium Card ────────────────────────────────────────────────────────
type PodiumTeam = (typeof MOCK_PODIUM_TEAMS)[number];

function PodiumCard({
  team,
  rank,
  isCenter,
}: {
  team: PodiumTeam;
  rank: 1 | 2 | 3;
  isCenter?: boolean;
}) {
  const cfg = {
    1: {
      label: "QUÁN QUÂN",
      rankLabel: "RANK #1 — GOLD",
      numberColor: "text-[var(--accent-judge)]",
      borderColor: "border-[var(--accent-judge)]/60",
      bgColor: "bg-[var(--bg-panel)]",
      shadow: "shadow-[0_0_24px_rgba(251,191,36,0.15)]",
      prizeColor: "text-[var(--accent-judge)]",
      prizeZoneBg: "bg-[var(--accent-judge)]/8 border-[var(--accent-judge)]/25",
      tagBorder: "border-[var(--accent-judge)]/30 text-[var(--accent-judge)]/80",
      scoreColor: "text-[var(--accent-judge)]",
      rankTagBg: "bg-[var(--accent-judge)]/90 text-[var(--bg-base)]",
      numStr: "01",
    },
    2: {
      label: "Á QUÂN 1",
      rankLabel: "RANK #2 — SILVER",
      numberColor: "text-[var(--accent-team)]",
      borderColor: "border-[var(--accent-team)]/30",
      bgColor: "bg-[var(--bg-panel)]",
      shadow: "shadow-[0_0_12px_rgba(56,189,248,0.07)]",
      prizeColor: "text-[var(--accent-team)]",
      prizeZoneBg: "bg-[var(--accent-team)]/5 border-[var(--border-muted)]",
      tagBorder: "border-[var(--border-muted)] text-[var(--text-muted)]",
      scoreColor: "text-[var(--accent-judge)]",
      rankTagBg: "bg-[var(--accent-team)]/20 text-[var(--accent-team)]",
      numStr: "02",
    },
    3: {
      label: "Á QUÂN 2",
      rankLabel: "RANK #3 — BRONZE",
      numberColor: "text-[var(--color-warning)]",
      borderColor: "border-[var(--color-warning)]/30",
      bgColor: "bg-[var(--bg-panel)]",
      shadow: "shadow-[0_0_12px_rgba(245,158,11,0.07)]",
      prizeColor: "text-[var(--color-warning)]",
      prizeZoneBg: "bg-[var(--color-warning)]/5 border-[var(--border-muted)]",
      tagBorder: "border-[var(--border-muted)] text-[var(--text-muted)]",
      scoreColor: "text-[var(--accent-judge)]",
      rankTagBg: "bg-[var(--color-warning)]/20 text-[var(--color-warning)]",
      numStr: "03",
    },
  }[rank];

  return (
    <div
      className={`
        relative flex flex-col ${cfg.bgColor} border ${cfg.borderColor} ${cfg.shadow}
        transition-transform duration-200 hover:-translate-y-1
        ${isCenter ? "pt-7 ring-1 ring-[var(--accent-judge)]/20" : "pt-5"}
        px-5 pb-5 rounded-none
      `}
    >
      {/* Champion ribbon — Gold only */}
      {isCenter && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-0.5 bg-[var(--accent-judge)] font-mono font-bold text-[9px] uppercase tracking-widest text-[var(--bg-base)] whitespace-nowrap">
          ★ CHAMPION
        </div>
      )}

      {/* Event meta */}
      <div className="text-center mb-3">
        <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider uppercase block">
          {team.eventName} · {team.season}
        </span>
        <span className={`font-mono text-[10px] font-bold uppercase tracking-widest block mt-0.5 ${cfg.numberColor}`}>
          {cfg.rankLabel}
        </span>
      </div>

      {/* Rank number */}
      <div className="flex justify-center mb-3">
        <div
          className={`
            flex items-center justify-center font-mono font-extrabold ${cfg.numberColor} border ${cfg.borderColor}
            ${isCenter ? "w-16 h-16 text-3xl" : "w-12 h-12 text-2xl"}
            bg-[var(--bg-input)]
          `}
        >
          {cfg.numStr}
        </div>
      </div>

      {/* Team name + project */}
      <div className="text-center mb-2">
        <h3 className={`font-display font-bold text-[var(--text-primary)] ${isCenter ? "text-xl" : "text-base"}`}>
          {team.teamName}
        </h3>
        <p className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5">{team.projectName}</p>
        <span className={`inline-block mt-1.5 border px-2 py-0.5 font-mono text-[9px] ${cfg.tagBorder}`}>
          {team.track}
        </span>
      </div>

      {/* Prize */}
      <div className={`mt-3 w-full border py-2.5 px-3 text-center ${cfg.prizeZoneBg}`}>
        <span className="block font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
          TIỀN THƯỞNG {team.prizeTitle}
        </span>
        <span className={`font-mono font-extrabold ${isCenter ? "text-lg" : "text-sm"} ${cfg.prizeColor}`}>
          {formatVnd(team.prizeVnd)}
        </span>
      </div>

      {/* School + Score */}
      <div className="mt-3 flex items-center justify-between font-mono text-xs">
        <span className="text-[var(--text-muted)] text-[10px]">{team.school}</span>
        <span className={`font-bold ${cfg.scoreColor}`}>
          {team.score} / 10
        </span>
      </div>
    </div>
  );
}

// ─── Main Podium Section ───────────────────────────────────────────────────────
export function LandingLeaderboardPodium() {
  const gold   = MOCK_PODIUM_TEAMS.find((t) => t.rank === 1);
  const silver = MOCK_PODIUM_TEAMS.find((t) => t.rank === 2);
  const bronze = MOCK_PODIUM_TEAMS.find((t) => t.rank === 3);

  return (
    <section className="border-t border-[var(--border-muted)] bg-[var(--bg-panel)]/30 px-[var(--space-xl)] py-[calc(var(--space-xl)*1.5)]">
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-[var(--space-xl)]">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <span className="font-mono text-[10px] text-[var(--accent-judge)] tracking-[0.25em] uppercase opacity-80">
            {"// HALL OF FAME · E-SPORTS PODIUM"}
          </span>
          <h2 className="font-display text-2xl font-bold uppercase text-[var(--text-primary)] md:text-3xl">
            Vinh Danh{" "}
            <span className="text-[var(--accent-judge)]">Bảng Vàng</span>{" "}
            Mùa Giải 2025
          </h2>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3 border border-[var(--accent-judge)]/25 bg-[var(--accent-judge)]/6 px-4 py-2 font-mono text-xs text-[var(--accent-judge)]">
            <span>
              Tổng quỹ:{" "}
              <strong className="text-sm">{formatVnd(MOCK_PODIUM_TOTAL_PRIZE)}</strong>
            </span>
            <span className="hidden sm:inline text-[var(--border-muted)]">|</span>
            <span className="text-[var(--text-muted)] text-[10px]">
              Giải Nhất 80M · Giải Nhì 45M · Giải Ba 25M
            </span>
          </div>
          <p className="max-w-2xl font-mono text-[11px] text-[var(--text-muted)] mt-1">
            Kết quả chính thức từ{" "}
            <strong className="text-[var(--text-primary)]">{MOCK_PODIUM_EVENT_NAME}</strong>
            {" "}— 3 đội xuất sắc nhất trong hơn 80 đội toàn quốc.
          </p>
        </div>

        {/* ── Podium Grid: Silver | Gold | Bronze ──────────────────────────── */}
        {/*
          Dùng items-end để 3 card "đứng trên cùng một đường nền",
          Gold cao hơn tự nhiên do padding-top lớn hơn — không cần negative top.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-end">
          {/* #2 Silver — trái */}
          {silver && (
            <div className="md:mb-0">
              <PodiumCard team={silver} rank={2} />
            </div>
          )}

          {/* #1 Gold — giữa, nhô lên bằng margin-bottom âm trên outer div */}
          {gold && (
            <div className="md:-mb-2">
              <PodiumCard team={gold} rank={1} isCenter />
            </div>
          )}

          {/* #3 Bronze — phải */}
          {bronze && (
            <div className="md:mb-0">
              <PodiumCard team={bronze} rank={3} />
            </div>
          )}
        </div>

        {/* ── RBL Transparency Banner ─────────────────────────────────────── */}
        <div className="border border-[var(--accent-coordinator)]/30 bg-[var(--bg-panel)] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] font-bold uppercase text-[var(--accent-coordinator)] tracking-widest">
              {"[ RBL AUDIT LOG · MINH BẠCH KHOA HỌC ]"}
            </span>
            <h4 className="font-display text-base font-bold text-[var(--text-primary)]">
              Chấm Điểm Đa Giám Khảo Độc Lập (Inter-Rater Reliability)
            </h4>
            <p className="font-mono text-[11px] text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Hệ thống tự động tính hệ số biến thiên giữa 4 giám khảo. Mọi điểm số bất thường
              (Δ &gt; 2.0) được kiểm toán minh bạch tại {MOCK_PODIUM_EVENT_NAME}.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <div className="border border-[var(--border-muted)] bg-[var(--bg-input)] px-4 py-2 text-center min-w-[80px]">
              <span className="block text-[9px] text-[var(--text-muted)] mb-0.5">MEAN DELTA</span>
              <span className="font-bold text-[var(--color-success)]">0.42</span>
            </div>
            <div className="border border-[var(--border-muted)] bg-[var(--bg-input)] px-4 py-2 text-center min-w-[80px]">
              <span className="block text-[9px] text-[var(--text-muted)] mb-0.5">STATUS</span>
              <span className="font-bold text-[var(--accent-coordinator)]">AUDITED</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
