"use client";

import { MOCK_PODIUM_TEAMS, MOCK_PODIUM_EVENT_NAME, MOCK_PODIUM_TOTAL_PRIZE } from "@/viewModels/mockEventsData";

function formatVnd(val: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(val)} ₫`;
}

export function LandingLeaderboardPodium() {
  const gold = MOCK_PODIUM_TEAMS.find((t) => t.rank === 1);
  const silver = MOCK_PODIUM_TEAMS.find((t) => t.rank === 2);
  const bronze = MOCK_PODIUM_TEAMS.find((t) => t.rank === 3);

  return (
    <section className="border-t border-[var(--border-muted)] bg-[var(--bg-panel)]/40 px-[var(--space-xl)] py-[calc(var(--space-xl)*1.5)]">
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-[var(--space-xl)]">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em]">
            <span className="text-[var(--accent-judge)]">[ HALL OF FAME // E-SPORTS PODIUM ]</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--accent-primary)]">SỰ KIỆN GẦN NHẤT: {MOCK_PODIUM_EVENT_NAME.toUpperCase()}</span>
          </div>

          <h2 className="font-display text-2xl font-bold uppercase text-[var(--text-primary)] md:text-4xl">
            VINH DANH <span className="text-[var(--accent-judge)]">BẢNG VÀNG MÙA GIẢI</span> 2025
          </h2>

          {/* Event Prize Badge */}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3 border border-[var(--accent-judge)]/40 bg-[var(--accent-judge)]/10 px-4 py-2 hud-clipped font-mono text-xs text-[var(--accent-judge)]">
            <span>TỔNG QUỸ GIẢI THƯỞNG MÙA GIẢI: <strong className="text-base text-[var(--accent-judge)]">{formatVnd(MOCK_PODIUM_TOTAL_PRIZE)}</strong></span>
            <span className="hidden sm:inline text-[var(--text-muted)]">|</span>
            <span className="text-xs text-[var(--text-primary)]">(Giải Nhất 80M + Giải Nhì 45M + Giải Ba 25M)</span>
          </div>

          <p className="max-w-2xl text-xs text-[var(--text-muted)] mt-1">
            Kết quả chính thức từ mùa giải <strong>{MOCK_PODIUM_EVENT_NAME}</strong> — 3 đội thi xuất sắc nhất vượt qua hơn 80 đội thi toàn quốc.
          </p>
        </div>

        {/* Podium Top 3 Layout */}
        <div className="grid grid-cols-1 items-end justify-center gap-6 md:grid-cols-3 pt-4">
          {/* Rank #2 Silver */}
          {silver && (
            <div className="order-2 md:order-1 hud-clipped border border-[rgba(56,189,248,0.4)] bg-[var(--bg-panel)] p-6 shadow-[0_0_15px_rgba(56,189,248,0.1)] flex flex-col items-center text-center transition-transform hover:-translate-y-1 relative">
              <span className="mb-1 font-mono text-[10px] font-bold uppercase text-[var(--accent-team)] tracking-widest">
                {silver.eventName.toUpperCase()} — {silver.season.toUpperCase()}
              </span>
              <span className="mb-2 font-mono text-xs font-bold uppercase text-[var(--accent-team)]">
                RANK #2 — SILVER
              </span>

              <div className="my-2 flex h-14 w-14 items-center justify-center border-2 border-[var(--accent-team)] bg-[var(--bg-input)] font-mono text-2xl font-extrabold text-[var(--accent-team)] hud-clipped">
                02
              </div>

              <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mt-1">
                {silver.teamName}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">{silver.projectName}</p>
              <span className="mt-1 border border-[var(--border-muted)] bg-[var(--bg-input)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                {silver.track}
              </span>

              {/* Prize Tag */}
              <div className="mt-4 w-full border-y border-[var(--border-muted)] py-2 text-center bg-[var(--bg-input)]/50">
                <span className="block font-mono text-[10px] text-[var(--text-muted)]">TIỀN THƯỞNG {silver.prizeTitle}</span>
                <span className="font-mono text-base font-extrabold text-[var(--accent-team)]">
                  {formatVnd(silver.prizeVnd)}
                </span>
              </div>

              <div className="mt-3 w-full flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--text-muted)]">{silver.school}</span>
                <span className="font-bold text-[var(--accent-judge)]">{silver.score} / 10</span>
              </div>
            </div>
          )}

          {/* Rank #1 Gold (Taller & Central Spotlight) */}
          {gold && (
            <div className="order-1 md:order-2 hud-clipped border-2 border-[var(--accent-judge)] bg-[var(--bg-panel)] p-7 shadow-[0_0_25px_rgba(251,191,36,0.25)] flex flex-col items-center text-center transition-transform hover:-translate-y-2 relative -top-2">
              <div className="absolute -top-3 bg-[var(--accent-judge)] text-[var(--bg-base)] font-mono font-extrabold text-[10px] uppercase px-4 py-0.5 tracking-widest hud-clipped shadow-md">
                CHAMPION - QUÁN QUÂN
              </div>
              <span className="mb-1 font-mono text-[10px] font-bold uppercase text-[var(--accent-judge)] tracking-widest mt-2">
                {gold.eventName.toUpperCase()} — {gold.season.toUpperCase()}
              </span>
              <span className="mb-2 font-mono text-xs font-bold uppercase text-[var(--accent-judge)]">
                RANK #1 — GOLD
              </span>

              <div className="my-2 flex h-16 w-16 items-center justify-center border-2 border-[var(--accent-judge)] bg-[var(--bg-input)] font-mono text-3xl font-extrabold text-[var(--accent-judge)] hud-clipped shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                01
              </div>

              <h3 className="font-display text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                {gold.teamName}
              </h3>
              <p className="text-xs text-[var(--accent-primary)] font-mono">{gold.projectName}</p>
              <span className="mt-1 border border-[var(--border-muted)] bg-[var(--bg-input)] px-2 py-0.5 font-mono text-[10px] text-[var(--accent-primary)]">
                {gold.track}
              </span>

              {/* Prize Tag */}
              <div className="mt-4 w-full border-y border-[var(--accent-judge)]/40 py-2.5 text-center bg-[var(--accent-judge)]/10">
                <span className="block font-mono text-[10px] font-bold uppercase text-[var(--accent-judge)]">TIỀN THƯỞNG {gold.prizeTitle}</span>
                <span className="font-mono text-lg font-extrabold text-[var(--accent-judge)]">
                  {formatVnd(gold.prizeVnd)}
                </span>
              </div>

              <div className="mt-4 w-full flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--text-muted)]">{gold.school}</span>
                <span className="font-extrabold text-base text-[var(--accent-judge)]">{gold.score} / 10</span>
              </div>
            </div>
          )}

          {/* Rank #3 Bronze */}
          {bronze && (
            <div className="order-3 hud-clipped border border-[rgba(245,158,11,0.4)] bg-[var(--bg-panel)] p-6 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex flex-col items-center text-center transition-transform hover:-translate-y-1 relative">
              <span className="mb-1 font-mono text-[10px] font-bold uppercase text-[var(--color-warning)] tracking-widest">
                {bronze.eventName.toUpperCase()} — {bronze.season.toUpperCase()}
              </span>
              <span className="mb-2 font-mono text-xs font-bold uppercase text-[var(--color-warning)]">
                RANK #3 — BRONZE
              </span>

              <div className="my-2 flex h-14 w-14 items-center justify-center border-2 border-[var(--color-warning)] bg-[var(--bg-input)] font-mono text-2xl font-extrabold text-[var(--color-warning)] hud-clipped">
                03
              </div>

              <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mt-1">
                {bronze.teamName}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">{bronze.projectName}</p>
              <span className="mt-1 border border-[var(--border-muted)] bg-[var(--bg-input)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                {bronze.track}
              </span>

              {/* Prize Tag */}
              <div className="mt-4 w-full border-y border-[var(--border-muted)] py-2 text-center bg-[var(--bg-input)]/50">
                <span className="block font-mono text-[10px] text-[var(--text-muted)]">TIỀN THƯỞNG {bronze.prizeTitle}</span>
                <span className="font-mono text-base font-extrabold text-[var(--color-warning)]">
                  {formatVnd(bronze.prizeVnd)}
                </span>
              </div>

              <div className="mt-3 w-full flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--text-muted)]">{bronze.school}</span>
                <span className="font-bold text-[var(--accent-judge)]">{bronze.score} / 10</span>
              </div>
            </div>
          )}
        </div>

        {/* RBL Inter-Rater Reliability Proof Banner */}
        <div className="hud-clipped border border-[var(--accent-coordinator)]/40 bg-[var(--bg-panel)] p-6 flex flex-col md:flex-row items-center justify-between gap-6 mt-2">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase text-[var(--accent-coordinator)] tracking-widest">
              [ RBL AUDIT LOG // MINH BẠCH KHOA HỌC ]
            </span>
            <h4 className="font-display text-lg font-bold text-[var(--text-primary)]">
              Mô hình Chấm Điểm Đa Giám Khảo Độc Lập (Inter-Rater Reliability)
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-2xl">
              Hệ thống tự động tính toán hệ số biến thiên (Inter-rater Delta) giữa 4 giám khảo chuyên môn cho sự kiện {MOCK_PODIUM_EVENT_NAME}. Mọi điểm số bất thường (&Delta; &gt; 2.0) đều được kiểm toán minh bạch.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <div className="border border-[var(--border-muted)] bg-[var(--bg-input)] px-4 py-2 text-center">
              <span className="block text-[10px] text-[var(--text-muted)]">MEAN DELTA</span>
              <span className="font-bold text-[var(--color-success)]">0.42 (&le; 0.5)</span>
            </div>
            <div className="border border-[var(--border-muted)] bg-[var(--bg-input)] px-4 py-2 text-center">
              <span className="block text-[10px] text-[var(--text-muted)]">STATUS</span>
              <span className="font-bold text-[var(--accent-coordinator)]">AUDITED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
