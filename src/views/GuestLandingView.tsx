"use client";

import { Badge, Button } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { useGuestLandingViewModel } from "@/viewModels/useGuestLandingViewModel";
import { useCountdown } from "@/lib/useCountdown";
import type { RoundStatus } from "@/viewModels/useGuestLandingViewModel";

// View — trang chủ cho khách (chưa đăng nhập). Dữ liệu đang lấy từ
// useGuestLandingViewModel (MOCK, xem ghi chú trong file đó) — chưa gọi API
// thật vì Luồng 2 (Sự kiện & Vòng thi) chưa có Controller trên BE mới.
export function GuestLandingView() {
  const { eventName, season, tagline, tracks, rounds, deadline, deadlineRoundName } =
    useGuestLandingViewModel();
  const countdown = useCountdown(deadline);

  return (
    <main className="hud-lattice flex flex-1 flex-col">
      <HeroSection
        eventName={eventName}
        season={season}
        tagline={tagline}
        deadlineRoundName={deadlineRoundName}
        countdown={countdown}
      />
      <RoundTimelineSection rounds={rounds} />
      <TracksSection tracks={tracks} />
    </main>
  );
}

// ────────────────────────────────────────────────────────────────
// Hero
// ────────────────────────────────────────────────────────────────

function HeroSection({
  eventName,
  season,
  tagline,
  deadlineRoundName,
  countdown,
}: {
  eventName: string;
  season: string;
  tagline: string;
  deadlineRoundName: string | null;
  countdown: ReturnType<typeof useCountdown>;
}) {
  return (
    <section className="relative mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 items-center gap-[var(--space-xl)] overflow-hidden px-[var(--space-xl)] py-[calc(var(--space-xl)*3)] md:grid-cols-[3fr_2fr]">
      <div className="flex flex-col items-start gap-[var(--space-lg)]">
        <span className="font-mono text-[length:var(--fs-caption-sm)] font-bold uppercase tracking-[0.3em] text-[color:var(--accent-primary)]">
          {season}
        </span>
        <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-wide text-[color:var(--text-primary)] md:text-6xl">
          {eventName}
        </h1>
        <p className="max-w-[46ch] text-[length:var(--fs-body-md)] text-[color:var(--text-muted)]">
          {tagline}
        </p>

        <div className="flex flex-col items-start gap-[var(--space-sm)] pt-[var(--space-md)]">
          <Link href="/login">
            <Button>Đăng nhập / Đăng ký →</Button>
          </Link>
          <span className="font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)]">
            Cổng đăng ký đang mở
          </span>
        </div>

        {deadlineRoundName && (
          <div className="pt-[var(--space-lg)]">
            <p className="mb-[var(--space-xs)] font-mono text-[length:var(--fs-caption-sm)] uppercase tracking-wider text-[color:var(--text-muted)]">
              Hạn nộp bài — {deadlineRoundName}
            </p>
            <CountdownClock {...countdown} />
          </div>
        )}
      </div>

      <div className="relative flex justify-center md:justify-end md:pr-[var(--space-xl)]">
        <SealShield className="h-40 w-40 md:h-56 md:w-56" />
      </div>
    </section>
  );
}

function CountdownClock({
  days,
  hours,
  minutes,
  seconds,
  isUrgent,
  isPast,
}: ReturnType<typeof useCountdown>) {
  if (isPast) {
    return (
      <Badge tone="neutral" className="font-mono">
        Đã hết hạn
      </Badge>
    );
  }

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

// Khiên hexagon SEAL — vector SVG tự vẽ (không dùng ảnh 3D nặng), 2 lớp
// hexagon lồng nhau giống mô-típ Modular Hexagon Loader trong proposal.
function SealShield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon
        points="50,2 95,26 95,74 50,98 5,74 5,26"
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <polygon
        points="50,16 82,33 82,67 50,84 18,67 18,33"
        fill="rgba(0,217,255,0.06)"
        stroke="var(--accent-primary)"
        strokeWidth="1"
      />
      <polygon points="50,32 68,42 68,62 50,72 32,62 32,42" fill="rgba(0,217,255,0.12)" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────
// Round timeline — "thanh ray" ngang, node hexagon theo trạng thái
// ────────────────────────────────────────────────────────────────

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

function RoundTimelineSection({
  rounds,
}: {
  rounds: Array<{ id: string; roundName: string; status: RoundStatus }>;
}) {
  return (
    <section className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-xl)] py-[var(--space-xl)]">
      <h2 className="mb-[var(--space-xl)] font-display text-[length:var(--fs-heading-md)] font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Lịch trình các vòng thi
      </h2>
      <div className="flex items-start">
        {rounds.map((round, i) => (
          <div key={round.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-[var(--space-sm)]">
              <div
                style={{ "--node-color": STATUS_COLOR_VAR[round.status] } as React.CSSProperties}
                className="flex h-12 w-12 items-center justify-center"
              >
                <svg viewBox="0 0 40 40" className="h-full w-full">
                  <polygon
                    points="20,1 38,10.5 38,29.5 20,39 2,29.5 2,10.5"
                    fill={round.status === "current" ? "rgba(0,217,255,0.15)" : "transparent"}
                    stroke="var(--node-color)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="font-mono text-[length:var(--fs-body-md)] font-bold text-[color:var(--text-primary)]">
                {round.roundName}
              </span>
              <Badge
                tone={round.status === "current" ? "success" : "neutral"}
                className="font-mono"
              >
                {STATUS_LABEL[round.status]}
              </Badge>
            </div>
            {i < rounds.length - 1 && (
              <div className="mx-[var(--space-sm)] mt-[-2rem] h-px flex-1 bg-[var(--border-muted)]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// Tracks
// ────────────────────────────────────────────────────────────────

function TracksSection({ tracks }: { tracks: string[] }) {
  return (
    <section className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-xl)] pb-[calc(var(--space-xl)*2)]">
      <h2 className="mb-[var(--space-lg)] font-display text-[length:var(--fs-heading-md)] font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Các hạng mục thi đấu
      </h2>
      <div className="flex flex-wrap gap-[var(--space-sm)]">
        {tracks.map((track) => (
          <Badge key={track} tone="team" className="px-[var(--space-md)] py-[var(--space-xs)] text-sm">
            {track}
          </Badge>
        ))}
      </div>
    </section>
  );
}
