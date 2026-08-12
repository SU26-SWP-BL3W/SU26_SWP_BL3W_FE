"use client";

import { Badge } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { STATUS_LABEL, STATUS_DOT_VAR, STATUS_TONE, type EventCardData } from "@/viewModels/mockEventsData";
import {
  useEventsDiscoveryViewModel,
  type EventStatusFilter,
  type EventSortOption,
} from "@/viewModels/useEventsDiscoveryViewModel";

// View — danh sách sự kiện cho khách (route /events, per FE_Design_Spec §7.1
// — tách riêng khỏi Landing Portal ở "/"). Giữ đúng theme "Command Deck" tối
// theo spec (mục 1: không dùng layout sáng kiểu SaaS chung), nhưng bố cục cố
// tình đơn giản hoá — tab trạng thái thay sidebar checkbox, dải pill hạng mục
// thay bảng dữ liệu, 1 danh sách dọc duy nhất (không tách thêm khối "nổi bật"
// trùng lặp) — để "dễ nhìn, không bị đập quá nhiều thông tin" như yêu cầu.
//
// Dữ liệu MOCK (useEventsDiscoveryViewModel/mockEventsData.ts) — chưa nối API
// thật vì Luồng 2 (Sự kiện & Vòng thi) chưa có Controller trên BE mới.
export function EventsDiscoveryView() {
  const {
    events,
    totalCount,
    topTracks,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    trackFilter,
    setTrackFilter,
    sort,
    setSort,
  } = useEventsDiscoveryViewModel();

  return (
    <main className="hud-lattice flex flex-1 flex-col">
      <section className="border-b border-[var(--border-muted)] bg-[var(--bg-panel)]/60">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-xl)] py-[var(--space-xl)]">
          <h1 className="font-display text-2xl font-bold tracking-wide text-[color:var(--text-primary)] md:text-3xl">
            Sự kiện
          </h1>
          <p className="mt-[var(--space-xs)] text-sm text-[color:var(--text-muted)]">
            Duyệt toàn bộ hackathon do SEAL tổ chức — đăng nhập để tham gia.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-1 flex-col gap-[var(--space-lg)] px-[var(--space-xl)] py-[var(--space-xl)]">
        <input
          type="search"
          placeholder="Tìm sự kiện theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-[var(--border-muted)] bg-[var(--bg-input)] px-[var(--space-md)] py-[var(--space-sm)] text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-muted)] focus:border-[var(--accent-primary)]"
        />

        <StatusTabs value={statusFilter} onChange={setStatusFilter} />

        {topTracks.length > 0 && (
          <div className="flex flex-wrap items-center gap-[var(--space-xs)]">
            <span className="mr-[var(--space-xs)] font-mono text-xs text-[color:var(--text-muted)]">Hạng mục:</span>
            {topTracks.map((t) => {
              const active = t.track === trackFilter;
              return (
                <button
                  key={t.track}
                  type="button"
                  onClick={() => setTrackFilter(active ? null : t.track)}
                  className={`border px-[var(--space-sm)] py-[3px] text-xs transition-colors ${
                    active
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[color:var(--accent-primary)]"
                      : "border-[var(--border-muted)] text-[color:var(--text-muted)] hover:border-[var(--accent-primary)]/50 hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {t.track} ({t.eventCount})
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-[var(--space-sm)] border-b border-[var(--border-muted)] pb-[var(--space-sm)]">
          <p className="text-sm text-[color:var(--text-muted)]">
            <span className="font-medium text-[color:var(--text-primary)]">{events.length}</span> / {totalCount} sự
            kiện
          </p>
          <label className="flex items-center gap-[var(--space-xs)] text-sm text-[color:var(--text-muted)]">
            Sắp xếp:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as EventSortOption)}
              className="border border-[var(--border-muted)] bg-[var(--bg-input)] px-[var(--space-sm)] py-[4px] text-sm text-[color:var(--text-primary)] outline-none"
            >
              <option value="relevant">Liên quan nhất</option>
              <option value="soonest">Sắp diễn ra nhất</option>
              <option value="newest">Mới thêm</option>
              <option value="most_teams">Nhiều đội nhất</option>
            </select>
          </label>
        </div>

        {events.length === 0 ? (
          <p className="py-[var(--space-xl)] text-center text-sm text-[color:var(--text-muted)]">
            Không tìm thấy sự kiện nào khớp bộ lọc.
          </p>
        ) : (
          <div className="flex flex-col gap-[var(--space-md)]">
            {events.map((ev) => (
              <EventRow key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────────
// Tab trạng thái — 1 hàng ngang, gọn hơn sidebar checkbox trước đây.
// ────────────────────────────────────────────────────────────────

function StatusTabs({
  value,
  onChange,
}: {
  value: EventStatusFilter;
  onChange: (v: EventStatusFilter) => void;
}) {
  const options: EventStatusFilter[] = ["all", "registration_open", "ongoing", "upcoming", "ended"];
  return (
    <div className="flex flex-wrap gap-[var(--space-xs)]">
      {options.map((opt) => {
        const active = value === opt;
        const label = opt === "all" ? "Tất cả" : STATUS_LABEL[opt];
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`border px-[var(--space-md)] py-[6px] font-mono text-sm transition-colors ${
              active
                ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[color:var(--accent-primary)]"
                : "border-[var(--border-muted)] text-[color:var(--text-muted)] hover:border-[var(--accent-primary)]/50 hover:text-[color:var(--text-primary)]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Event row — hàng ngang: icon trái, tiêu đề + giải thưởng (thứ quan trọng
// nhất) ở giữa-trái, ngày/hạng mục phụ ở cột phải, viền trái đổi màu theo
// trạng thái.
// ────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: EventCardData }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex items-stretch gap-[var(--space-lg)] border border-[var(--border-muted)] bg-[var(--bg-panel)] p-[var(--space-lg)] transition-colors hover:border-[var(--accent-primary)]/50"
      style={{ borderLeft: `3px solid ${STATUS_DOT_VAR[event.status]}` }}
    >
      <div className="hidden h-16 w-16 shrink-0 items-center justify-center bg-[var(--bg-input)] sm:flex">
        <SealMark />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-[2px] flex flex-wrap items-center gap-[var(--space-sm)]">
          <h3 className="font-display text-lg font-bold text-[color:var(--text-primary)] group-hover:text-[color:var(--accent-primary)]">
            {event.eventName}
          </h3>
          <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABEL[event.status]}</Badge>
        </div>
        <p className="truncate text-sm text-[color:var(--text-muted)]">{event.tagline}</p>
        <div className="mt-[var(--space-sm)] flex items-center gap-[var(--space-lg)] font-mono text-sm">
          <span className="font-bold text-[color:var(--text-primary)]">{formatVnd(event.totalPrizeVnd)}</span>
          <span className="text-xs text-[color:var(--text-muted)]">
            {event.teamCount}/{event.maxTeams} đội
          </span>
        </div>
      </div>

      <div className="hidden w-44 shrink-0 flex-col justify-center gap-[var(--space-xs)] text-xs text-[color:var(--text-muted)] sm:flex">
        <span className="flex items-center gap-[var(--space-xs)] font-mono">
          <CalendarIcon />
          {formatShortDate(event.startDate)} – {formatShortDate(event.endDate)}
        </span>
        <span className="flex items-start gap-[var(--space-xs)]">
          <TagIcon />
          <span className="flex flex-wrap gap-x-[var(--space-xs)]">
            {event.tracks.slice(0, 2).join(", ")}
            {event.tracks.length > 2 && ` +${event.tracks.length - 2}`}
          </span>
        </span>
      </div>

      <div className="flex shrink-0 items-center pl-[var(--space-sm)] text-[color:var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100">
        →
      </div>
    </Link>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <path d="M2 6.5h12M5 1.5v3M11 1.5v3" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[1px] h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path
        d="M8.5 2H3a1 1 0 00-1 1v5.5a1 1 0 00.3.7l6 6a1 1 0 001.4 0l5.5-5.5a1 1 0 000-1.4l-6-6a1 1 0 00-.7-.3z"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Khiên hexagon SEAL thu nhỏ dùng làm icon đại diện mỗi sự kiện trong danh sách.
function SealMark() {
  return (
    <svg viewBox="0 0 100 100" className="h-9 w-9" aria-hidden="true">
      <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke="var(--accent-primary)" strokeWidth="3" opacity="0.7" />
      <polygon points="50,30 68,40 68,60 50,70 32,60 32,40" fill="rgba(0,217,255,0.15)" />
    </svg>
  );
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatVnd(value: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
}
