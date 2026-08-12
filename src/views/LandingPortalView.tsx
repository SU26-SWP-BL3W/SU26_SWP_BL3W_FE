"use client";

import { Badge, Button } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { SealShield } from "@/components/domain/SealShield";
import { useCountdown } from "@/lib/useCountdown";
import { STATUS_LABEL, STATUS_DOT_VAR, STATUS_TONE, type EventCardData } from "@/viewModels/mockEventsData";
import { useLandingPreviewViewModel } from "@/viewModels/useLandingPreviewViewModel";

// View — Landing Portal tại "/" (FE_Design_Spec §4.1, §7.1): hero tối giản +
// 2 khối PREVIEW cuộn xuống (không phải danh sách đầy đủ — đó là việc của
// "/events"): "Sự kiện mới nhất trong kỳ" rồi "Sự kiện nổi bật" kèm nút "Xem
// tất cả" nhảy sang "/events" (bố cục mượn Devpost — hero rồi tới các dải
// preview + Show All — nhưng màu vẫn giữ nguyên "Command Deck" tối theo spec,
// không chuyển nền trắng).
export function LandingPortalView() {
  const { latestEvent, featuredEvents } = useLandingPreviewViewModel();

  return (
    <main className="hud-lattice flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-[var(--space-lg)] px-[var(--space-xl)] py-[calc(var(--space-xl)*2)] text-center">
        <SealShield className="h-24 w-24 md:h-32 md:w-32" />
        <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[1.1] tracking-wide text-[color:var(--text-primary)] md:text-6xl">
          Nơi ý tưởng công nghệ
          <br />
          <span className="text-[color:var(--accent-primary)]">bứt phá giới hạn</span>
        </h1>
        <p className="max-w-xl text-[length:var(--fs-body-md)] text-[color:var(--text-muted)]">
          Sân chơi hackathon dành cho sinh viên — tranh tài, xây dựng sản phẩm thực tế và nhận đánh giá minh bạch từ
          hội đồng giám khảo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[var(--space-md)] pt-[var(--space-sm)]">
          <Link href="/events">
            <Button type="button">Khám phá sự kiện →</Button>
          </Link>
          <Link href="/register">
            <Button type="button" variant="secondary">
              Đăng ký tham gia
            </Button>
          </Link>
        </div>
      </section>

      {latestEvent && <LatestEventSpotlight event={latestEvent} />}

      {featuredEvents.length > 0 && (
        <PreviewSection title="Sự kiện nổi bật" events={featuredEvents} showAllHref="/events" />
      )}
    </main>
  );
}

// ────────────────────────────────────────────────────────────────
// Spotlight sự kiện mới nhất — 1 khối duy nhất, bố cục bất đối xứng (nội
// dung trái, đếm ngược phải) thay vì lưới 3 thẻ đều nhau (pattern "3 card
// columns" — dễ nhận ra là thiết kế mặc định, đã tránh ở đây). hud-clipped +
// hud-glow-cyan + hover lift theo đúng FE_Design_Spec §3.1/§5.4.
// ────────────────────────────────────────────────────────────────

function LatestEventSpotlight({ event }: { event: EventCardData }) {
  const countdownTarget = event.status === "ongoing" ? event.endDate : event.registrationEndDate;
  const countdown = useCountdown(event.status === "ended" ? null : countdownTarget);
  const countdownLabel = event.status === "ongoing" ? "Hạn nộp bài" : "Hạn đăng ký";

  return (
    <section className="border-t border-[var(--border-muted)] px-[var(--space-xl)] py-[var(--space-xl)]">
      <div className="mx-auto w-full max-w-[var(--container-max)]">
        <span className="mb-[var(--space-md)] flex items-center gap-[var(--space-sm)] font-mono text-[length:var(--fs-caption-sm)] tracking-[0.2em] text-[color:var(--accent-primary)]">
          <span className="inline-block h-px w-6 bg-[var(--accent-primary)]" aria-hidden="true" />[ MỚI NHẤT TRONG KỲ ]
        </span>

        <Link
          href={`/events/${event.id}`}
          className="hud-clipped hud-glow-cyan hud-scanline-once group relative grid grid-cols-1 gap-[var(--space-xl)] overflow-hidden bg-[var(--bg-panel)] p-[var(--space-xl)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,217,255,0.12)] md:grid-cols-[3fr_2fr] md:items-center"
          style={{ borderLeft: `3px solid ${STATUS_DOT_VAR[event.status]}` }}
        >
          {/* Khiên SEAL lớn làm hoạ tiết nền, "thở" nhẹ — chỉ trang trí, đặt
              pointer-events-none để không cản click/hover phần nội dung. */}
          <SealShield className="hud-pulse pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-30 md:h-72 md:w-72" />

          <div className="relative flex flex-col items-start gap-[var(--space-sm)]">
            <div className="flex items-center gap-[var(--space-sm)]">
              <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABEL[event.status]}</Badge>
              {event.status === "ongoing" && (
                <span className="flex items-center gap-[6px] font-mono text-[length:var(--fs-caption-sm)] font-bold uppercase tracking-wider text-[color:var(--accent-judge)]">
                  <span className="hud-live-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-judge)]" aria-hidden="true" />
                  Trực tiếp
                </span>
              )}
            </div>
            <h3 className="font-display text-3xl font-bold leading-[1.1] text-[color:var(--text-primary)] group-hover:text-[color:var(--accent-primary)] md:text-4xl">
              {event.eventName}
            </h3>
            <p className="max-w-[55ch] text-[length:var(--fs-body-md)] text-[color:var(--text-muted)]">
              {event.tagline}
            </p>

            {event.tracks.length > 0 && (
              <div className="flex flex-wrap gap-[var(--space-xs)]">
                {event.tracks.slice(0, 3).map((track) => (
                  <span
                    key={track}
                    className="border border-[var(--border-muted)] bg-[var(--bg-input)]/60 px-[var(--space-sm)] py-[2px] font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)]"
                  >
                    {track}
                  </span>
                ))}
                {event.tracks.length > 3 && (
                  <span className="border border-[var(--border-muted)] bg-[var(--bg-input)]/60 px-[var(--space-sm)] py-[2px] font-mono text-[length:var(--fs-caption-sm)] text-[color:var(--text-muted)]">
                    +{event.tracks.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="mt-[var(--space-xs)] flex flex-wrap items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xs)] font-mono text-sm text-[color:var(--text-muted)]">
              <span>
                {event.season} {event.year}
              </span>
              <span>
                {event.teamCount}/{event.maxTeams} đội
              </span>
              <span className="font-bold text-[color:var(--text-primary)]">{formatVnd(event.totalPrizeVnd)}</span>
            </div>
            <span className="mt-[var(--space-sm)] inline-flex items-center gap-[var(--space-xs)] font-mono text-sm font-medium text-[color:var(--accent-primary)]">
              Xem chi tiết
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </div>

          {!countdown.isPast && (
            <div className="relative flex flex-col items-center gap-[var(--space-sm)] border-t border-[var(--border-muted)] pt-[var(--space-lg)] md:border-t-0 md:border-l md:items-start md:pt-0 md:pl-[var(--space-xl)]">
              <p className="font-mono text-[length:var(--fs-caption-sm)] uppercase tracking-wider text-[color:var(--text-muted)]">
                {countdownLabel}
              </p>
              <div
                className={`flex items-end gap-[var(--space-md)] font-mono ${
                  countdown.isUrgent ? "animate-pulse text-[color:var(--color-danger)]" : "text-[color:var(--text-primary)]"
                }`}
                suppressHydrationWarning
              >
                {[
                  { value: countdown.days, label: "ngày" },
                  { value: countdown.hours, label: "giờ" },
                  { value: countdown.minutes, label: "phút" },
                ].map((u) => (
                  <div key={u.label} className="flex flex-col items-center" suppressHydrationWarning>
                    <span className="text-3xl font-bold tabular-nums md:text-4xl" suppressHydrationWarning>
                      {String(u.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}

function formatVnd(value: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
}

function PreviewSection({
  title,
  events,
  showAllHref,
}: {
  title: string;
  events: EventCardData[];
  showAllHref?: string;
}) {
  return (
    <section className="border-t border-[var(--border-muted)] px-[var(--space-xl)] py-[var(--space-xl)]">
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-[var(--space-lg)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[color:var(--text-primary)] md:text-2xl">{title}</h2>
          {showAllHref && (
            <Link
              href={showAllHref}
              className="font-mono text-sm text-[color:var(--accent-primary)] hover:text-white hover:underline"
            >
              Xem tất cả →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-lg)] sm:grid-cols-3">
          {events.map((ev) => (
            <PreviewCard key={ev.id} event={ev} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ event }: { event: EventCardData }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col border border-[var(--border-muted)] bg-[var(--bg-panel)] p-[var(--space-lg)] transition-colors hover:border-[var(--accent-primary)]/50"
      style={{ borderTop: `2px solid ${STATUS_DOT_VAR[event.status]}` }}
    >
      <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABEL[event.status]}</Badge>
      <h3 className="mt-[var(--space-sm)] font-display text-base font-bold text-[color:var(--text-primary)] group-hover:text-[color:var(--accent-primary)]">
        {event.eventName}
      </h3>
      <p className="mt-[2px] line-clamp-2 text-sm text-[color:var(--text-muted)]">{event.tagline}</p>
      <span className="mt-[var(--space-md)] font-mono text-xs text-[color:var(--text-muted)]">
        {formatShortDate(event.startDate)} – {formatShortDate(event.endDate)}
      </span>
    </Link>
  );
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
