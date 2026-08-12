"use client";

import { Badge, Button } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { useEventDetailViewModel } from "@/viewModels/useEventDetailViewModel";
import type { RoundStatus } from "@/viewModels/useEventDetailViewModel";
import { useCountdown } from "@/lib/useCountdown";
import { TRACK_META, DEFAULT_TRACK_META, type TrackIconKey } from "@/viewModels/mockEventsData";

// View — chi tiết 1 sự kiện (khách xem được, không cần đăng nhập), vào từ
// EventsDiscoveryView. Dữ liệu MOCK theo eventId (useEventDetailViewModel).
export function EventDetailView({ eventId }: { eventId: string }) {
  const {
    notFound,
    eventName,
    season,
    year,
    tagline,
    description,
    tracks,
    rounds,
    teamCount,
    maxTeams,
    totalPrizeVnd,
    deadline,
    deadlineRoundName,
  } = useEventDetailViewModel(eventId);
  const countdown = useCountdown(deadline);

  if (notFound) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-[var(--space-md)] p-[var(--space-xl)]">
        <p className="font-mono text-[color:var(--text-muted)]">Không tìm thấy sự kiện này.</p>
        <Link href="/" className="font-mono text-sm text-[color:var(--accent-primary)] hover:text-white">
          ← Quay lại danh sách sự kiện
        </Link>
      </main>
    );
  }

  return (
    <main className="hud-lattice flex flex-1 flex-col">
      <Link
        href="/"
        className="mx-auto mt-[var(--space-lg)] w-full max-w-[var(--container-max)] px-[var(--space-xl)] font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)] hover:text-[color:var(--accent-primary)]"
      >
        ← Tất cả sự kiện
      </Link>

      <section className="relative mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 items-start gap-[var(--space-xl)] overflow-hidden px-[var(--space-xl)] py-[var(--space-xl)] md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col items-start gap-[var(--space-md)]">
          <span className="flex items-center gap-[var(--space-sm)] font-mono text-[length:var(--fs-caption-sm)] font-medium tracking-[0.2em] text-[color:var(--accent-primary)]">
            <span className="inline-block h-px w-6 bg-[var(--accent-primary)]" aria-hidden="true" />[ {season}{" "}
            {year} ]
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-wide text-[color:var(--text-primary)] md:text-6xl">
            {eventName}
          </h1>
          <p className="max-w-[46ch] text-[length:var(--fs-body-md)] text-[color:var(--text-muted)]">{tagline}</p>
          <p className="max-w-[60ch] text-sm text-[color:var(--text-muted)]">{description}</p>

          <div className="flex flex-wrap items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xs)] pt-[var(--space-xs)] font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)]">
            <span>
              {teamCount}/{maxTeams} đội đã đăng ký
            </span>
            {totalPrizeVnd > 0 && (
              <span>
                Tổng giải thưởng{" "}
                <span className="font-bold text-[color:var(--text-primary)]">{formatVnd(totalPrizeVnd)}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col items-start gap-[var(--space-sm)] pt-[var(--space-md)]">
            <Link href="/login">
              <Button>Đăng nhập / Đăng ký →</Button>
            </Link>
            <span className="font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)]">
              Cổng đăng ký đang mở
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-[var(--space-lg)] md:items-end">
          <SealShield className="h-28 w-28 md:h-36 md:w-36" />
          {deadlineRoundName && !countdown.isPast && (
            <div className="hud-clipped w-full border border-[var(--border-muted)] bg-[var(--bg-panel)] p-[var(--space-lg)] md:max-w-xs">
              <p className="mb-[var(--space-sm)] font-mono text-[length:var(--fs-caption-sm)] uppercase tracking-wider text-[color:var(--text-muted)]">
                Hạn nộp bài — {deadlineRoundName}
              </p>
              <CountdownClock {...countdown} />
            </div>
          )}
        </div>
      </section>

      <ScheduleSection rounds={rounds} />
      <TracksSection tracks={tracks} />
    </main>
  );
}

function CountdownClock({
  days,
  hours,
  minutes,
  seconds,
  isUrgent,
}: ReturnType<typeof useCountdown>) {
  const units = [
    { value: days, label: "ngày" },
    { value: hours, label: "giờ" },
    { value: minutes, label: "phút" },
    { value: seconds, label: "giây" },
  ];

  return (
    <div
      className={`flex items-end gap-[var(--space-md)] font-mono ${
        isUrgent ? "animate-pulse text-[color:var(--color-danger)]" : "text-[color:var(--text-primary)]"
      }`}
      suppressHydrationWarning
    >
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center" suppressHydrationWarning>
          <span className="text-3xl font-bold tabular-nums md:text-4xl" suppressHydrationWarning>
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[length:var(--fs-caption-sm)] uppercase tracking-wider text-[color:var(--text-muted)]">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Khiên hexagon SEAL — vector SVG tự vẽ, 2 lớp hexagon lồng nhau.
function SealShield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points="50,2 95,26 95,74 50,98 5,74 5,26" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" opacity="0.6" />
      <polygon points="50,16 82,33 82,67 50,84 18,67 18,33" fill="rgba(0,217,255,0.06)" stroke="var(--accent-primary)" strokeWidth="1" />
      <polygon points="50,32 68,42 68,62 50,72 32,62 32,42" fill="rgba(0,217,255,0.12)" />
    </svg>
  );
}

function formatVnd(value: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
}

function formatDateRange(startIso: string, endIso: string): string {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${fmt(startIso)} – ${fmt(endIso)}`;
}

const STATUS_LABEL: Record<RoundStatus, string> = {
  past: "Đã qua",
  current: "Đang diễn ra",
  upcoming: "Sắp tới",
};

const STATUS_COLOR_VAR: Record<RoundStatus, string> = {
  past: "var(--text-muted)",
  current: "var(--accent-primary)",
  upcoming: "var(--border-muted)",
};

// ────────────────────────────────────────────────────────────────
// Lịch trình sự kiện — mốc theo Round thật (không bịa agenda giờ-theo-giờ
// kiểu hackathon on-site 48h, vì SEAL là thi theo vòng kéo dài nhiều tuần).
// Bố cục đường thẳng đứng + chấm tròn + thẻ lệch trái/phải, dịu mắt hơn dải
// ngang trước đây — mượn cảm hứng timeline "Mission Schedule" nhưng giữ đúng
// nội dung nghiệp vụ thật của SEAL.
// ────────────────────────────────────────────────────────────────

function ScheduleSection({ rounds }: { rounds: Array<RoundStatusRound> }) {
  return (
    <section className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-xl)] py-[var(--space-xl)]">
      <span className="mb-[var(--space-xs)] flex items-center gap-[var(--space-sm)] font-mono text-[length:var(--fs-caption-sm)] tracking-[0.2em] text-[color:var(--accent-primary)]">
        <span className="inline-block h-px w-6 bg-[var(--accent-primary)]" aria-hidden="true" />[ LỊCH TRÌNH ]
      </span>
      <h2 className="mb-[var(--space-xl)] font-display text-[length:var(--fs-heading-md)] font-semibold text-[color:var(--text-primary)]">
        Lịch trình sự kiện
      </h2>

      <div className="relative flex flex-col gap-[var(--space-xl)] pl-[var(--space-xl)]">
        <div className="absolute top-1 bottom-1 left-[7px] w-px bg-[var(--border-muted)]" aria-hidden="true" />
        {rounds.map((round) => (
          <div key={round.id} className="relative">
            <span
              className="absolute top-1 -left-[calc(var(--space-xl)-3px)] h-[13px] w-[13px] shrink-0 rounded-full border-2"
              style={{ borderColor: STATUS_COLOR_VAR[round.status], backgroundColor: "var(--bg-base)" }}
              aria-hidden="true"
            />
            <div
              className="border-l-2 bg-[var(--bg-panel)] p-[var(--space-lg)]"
              style={{ borderLeftColor: STATUS_COLOR_VAR[round.status] }}
            >
              <div className="mb-[var(--space-xs)] flex flex-wrap items-center gap-[var(--space-sm)]">
                <span className="font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)]">
                  {formatDateRange(round.startDate, round.endDate)}
                </span>
                <Badge tone={round.status === "current" ? "success" : "neutral"}>{STATUS_LABEL[round.status]}</Badge>
              </div>
              <h3 className="font-display text-[length:var(--fs-body-md)] font-bold text-[color:var(--text-primary)]">
                {round.roundName}
              </h3>
              <p className="mt-[2px] max-w-[60ch] text-sm text-[color:var(--text-muted)]">{round.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type RoundStatusRound = {
  id: string;
  roundName: string;
  startDate: string;
  endDate: string;
  description: string;
  status: RoundStatus;
};

// ────────────────────────────────────────────────────────────────
// Các hạng mục thi đấu — thẻ có icon/màu riêng theo track (TRACK_META), thay
// cho dải badge phẳng trước đây.
// ────────────────────────────────────────────────────────────────

function TracksSection({ tracks }: { tracks: string[] }) {
  if (tracks.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-xl)] pb-[calc(var(--space-xl)*2)]">
      <span className="mb-[var(--space-xs)] flex items-center gap-[var(--space-sm)] font-mono text-[length:var(--fs-caption-sm)] tracking-[0.2em] text-[color:var(--accent-primary)]">
        <span className="inline-block h-px w-6 bg-[var(--accent-primary)]" aria-hidden="true" />[ HẠNG MỤC ]
      </span>
      <h2 className="mb-[var(--space-lg)] font-display text-[length:var(--fs-heading-md)] font-semibold text-[color:var(--text-primary)]">
        Các hạng mục thi đấu
      </h2>
      <div className="grid grid-cols-1 gap-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track, i) => {
          const meta = TRACK_META[track] ?? DEFAULT_TRACK_META;
          return (
            <div
              key={track}
              className="border p-[var(--space-lg)]"
              style={{ borderColor: "var(--border-muted)", borderTop: `2px solid ${meta.accent}` }}
            >
              <div className="mb-[var(--space-md)] flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${meta.accent} 18%, var(--bg-input))` }}
                >
                  <TrackIcon icon={meta.icon} color={meta.accent} />
                </div>
                <span className="font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)]">
                  TRACK_{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-[length:var(--fs-body-md)] font-bold text-[color:var(--text-primary)]">
                {track}
              </h3>
              <p className="mt-[var(--space-xs)] text-sm text-[color:var(--text-muted)]">{meta.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TrackIcon({ icon, color }: { icon: TrackIconKey; color: string }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: color, strokeWidth: 1.6 } as const;
  switch (icon) {
    case "ai":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M21 12h-3M6 12H3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" strokeLinecap="round" />
        </svg>
      );
    case "web":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M8 9 4 12l4 3M16 9l4 3-4 3M13.5 6l-3 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "security":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "iot":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="1" />
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.5 2.5M18.5 5.5 16 8M18.5 18.5 16 16M5.5 18.5 8 16" strokeLinecap="round" />
        </svg>
      );
    case "idea":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M9 18h6M10 21h4M8 14a4 4 0 1 1 8 0c0 1.5-.8 2.3-1.5 3-.4.4-.5.7-.5 1H9.9c0-.3-.1-.6-.5-1C8.7 16.3 8 15.5 8 14Z" strokeLinejoin="round" />
        </svg>
      );
    case "blockchain":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="9" width="7" height="7" rx="1.5" />
          <rect x="14" y="9" width="7" height="7" rx="1.5" />
          <path d="M10 12.5h4" strokeLinecap="round" />
        </svg>
      );
  }
}
