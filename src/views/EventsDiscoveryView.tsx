"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { useCountdown } from "@/lib/useCountdown";
import {
  useEventsDiscoveryViewModel,
  type EventCardData,
  type EventDisplayStatus,
  type EventStatusFilter,
  type EventSortOption,
  type TrackSummary,
} from "@/viewModels/useEventsDiscoveryViewModel";

// View — trang chủ cho khách (chưa đăng nhập): danh sách các sự kiện có thể
// xem/duyệt qua mà không cần đăng nhập. Bố cục mượn theo Devpost (sidebar lọc
// trái + danh sách hàng ngang bên phải) nhưng vẫn giữ bảng màu/font "Command
// Deck" tối theo proposal — chỉ giảm bớt chữ hoa/mono ở vùng đọc dài để dễ đọc
// hơn, mono chỉ còn dùng cho số liệu/badge ngắn như proposal quy định.
// Dữ liệu MOCK (useEventsDiscoveryViewModel/mockEventsData.ts) — chưa nối API
// thật vì Luồng 2 (Sự kiện & Vòng thi) chưa có Controller trên BE mới.
export function EventsDiscoveryView() {
  const {
    events,
    totalCount,
    featuredEvent,
    featuredEvents,
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

  // Cuộn tới khu vực danh sách khi bấm chọn hạng mục ở "Hạng mục nổi bật" —
  // kết hợp với đổi URL (trong setTrackFilter) để tạo cảm giác "nhảy tới 1
  // trang kết quả đã lọc sẵn" giống Devpost, thay vì chỉ lặng lẽ đổi 1 ô input.
  const resultsRef = useRef<HTMLDivElement>(null);
  const handleSelectTrack = (track: string) => {
    setTrackFilter(track);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="hud-lattice flex flex-1 flex-col">
      {/* Search band */}
      <section className="border-b border-[var(--border-muted)] bg-[var(--bg-panel)]/60">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-[var(--space-md)] px-[var(--space-xl)] py-[var(--space-xl)] sm:flex-row sm:items-center">
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold tracking-wide text-[color:var(--text-primary)] md:text-3xl">
              Khám phá sự kiện SEAL
            </h1>
            <p className="mt-[var(--space-xs)] text-sm text-[color:var(--text-muted)]">
              Duyệt toàn bộ hackathon do SEAL tổ chức — xem lịch trình, hạng mục thi đấu, đăng nhập để tham gia.
            </p>
          </div>
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-lg items-stretch overflow-hidden border border-[var(--border-muted)] bg-[var(--bg-input)]"
          >
            <input
              type="search"
              placeholder="Tìm sự kiện theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full flex-1 bg-transparent px-[var(--space-md)] py-[var(--space-sm)] text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-muted)]"
            />
            <button
              type="submit"
              className="shrink-0 bg-[var(--accent-primary)] px-[var(--space-lg)] font-medium text-[color:var(--bg-base)] transition-colors hover:bg-white"
            >
              Tìm
            </button>
          </form>
        </div>
      </section>

      {featuredEvent && (
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-xl)] pt-[var(--space-xl)]">
          <FeaturedEventCard event={featuredEvent} />
        </div>
      )}

      <div
        ref={resultsRef}
        className="mx-auto flex w-full max-w-[var(--container-max)] flex-1 scroll-mt-[var(--space-xl)] flex-col gap-[var(--space-xl)] px-[var(--space-xl)] py-[var(--space-xl)] lg:flex-row lg:items-start"
      >
        <FilterSidebar
          value={statusFilter}
          onChange={setStatusFilter}
          trackFilter={trackFilter}
          onClearTrack={() => setTrackFilter(null)}
        />

        <div className="flex-1">
          <div className="mb-[var(--space-md)] flex flex-wrap items-center justify-between gap-[var(--space-sm)] border-b border-[var(--border-muted)] pb-[var(--space-md)]">
            <p className="text-sm text-[color:var(--text-muted)]">
              Đang hiện <span className="font-medium text-[color:var(--text-primary)]">{events.length}</span> /{" "}
              {totalCount} sự kiện
              {trackFilter && (
                <>
                  {" "}
                  theo hạng mục{" "}
                  <span className="font-medium text-[color:var(--accent-primary)]">{trackFilter}</span>
                </>
              )}
            </p>
            <SortControl value={sort} onChange={setSort} />
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
      </div>

      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-[var(--space-xl)] px-[var(--space-xl)] pb-[var(--space-xl)]">
        <TopThemesSection tracks={topTracks} activeTrack={trackFilter} onSelectTrack={handleSelectTrack} />
        <FeaturedEventsSection
          events={featuredEvents}
          onViewAll={() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────────
// Status meta
// ────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<EventDisplayStatus, string> = {
  registration_open: "Đang mở đăng ký",
  ongoing: "Đang diễn ra",
  upcoming: "Sắp diễn ra",
  ended: "Đã kết thúc",
};

const STATUS_DOT_VAR: Record<EventDisplayStatus, string> = {
  registration_open: "var(--color-success)",
  ongoing: "var(--accent-judge)",
  upcoming: "var(--accent-team)",
  ended: "var(--text-muted)",
};

const STATUS_TONE: Record<EventDisplayStatus, "success" | "judge" | "neutral" | "team"> = {
  registration_open: "success",
  ongoing: "judge",
  upcoming: "team",
  ended: "neutral",
};

function StatusDot({ status }: { status: EventDisplayStatus }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: STATUS_DOT_VAR[status] }}
      aria-hidden="true"
    />
  );
}

// ────────────────────────────────────────────────────────────────
// Sidebar lọc — mượn cấu trúc Devpost: nhóm filter theo tiêu đề, checkbox có
// chấm màu cho Status.
// ────────────────────────────────────────────────────────────────

function FilterSidebar({
  value,
  onChange,
  trackFilter,
  onClearTrack,
}: {
  value: EventStatusFilter;
  onChange: (v: EventStatusFilter) => void;
  trackFilter: string | null;
  onClearTrack: () => void;
}) {
  const options: EventDisplayStatus[] = ["registration_open", "ongoing", "upcoming", "ended"];
  const hasActiveFilter = value !== "all" || trackFilter !== null;

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <button
        type="button"
        onClick={() => {
          onChange("all");
          onClearTrack();
        }}
        disabled={!hasActiveFilter}
        className="mb-[var(--space-lg)] text-sm text-[color:var(--accent-primary)] hover:underline disabled:cursor-default disabled:text-[color:var(--text-muted)] disabled:no-underline"
      >
        Xoá bộ lọc
      </button>

      {trackFilter && (
        <div className="mb-[var(--space-lg)]">
          <h3 className="mb-[var(--space-sm)] text-sm font-semibold text-[color:var(--text-primary)]">Hạng mục</h3>
          <span className="inline-flex items-center gap-[var(--space-xs)] border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 px-[var(--space-sm)] py-[3px] text-sm text-[color:var(--accent-primary)]">
            {trackFilter}
            <button
              type="button"
              onClick={onClearTrack}
              aria-label={`Bỏ lọc hạng mục ${trackFilter}`}
              className="hover:text-white"
            >
              ×
            </button>
          </span>
        </div>
      )}

      <div>
        <h3 className="mb-[var(--space-sm)] text-sm font-semibold text-[color:var(--text-primary)]">Trạng thái</h3>
        <div className="flex flex-col gap-[var(--space-xs)]">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-[var(--space-sm)] py-[3px] text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
            >
              <input
                type="checkbox"
                checked={value === opt}
                onChange={() => onChange(value === opt ? "all" : opt)}
                className="h-4 w-4 accent-[var(--accent-primary)]"
              />
              {STATUS_LABEL[opt]}
              <StatusDot status={opt} />
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────────
// Sort control
// ────────────────────────────────────────────────────────────────

const SORT_LABEL: Record<EventSortOption, string> = {
  relevant: "Liên quan nhất",
  soonest: "Sắp diễn ra nhất",
  newest: "Mới thêm",
  most_teams: "Nhiều đội nhất",
};

function SortControl({
  value,
  onChange,
}: {
  value: EventSortOption;
  onChange: (v: EventSortOption) => void;
}) {
  const options: EventSortOption[] = ["relevant", "soonest", "newest", "most_teams"];
  return (
    <div className="flex items-center gap-[var(--space-md)] border border-[var(--border-muted)] px-[var(--space-sm)] py-[6px]">
      <span className="text-sm text-[color:var(--text-muted)]">Sắp xếp:</span>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`border-b-2 pb-[2px] text-sm transition-colors ${
              active
                ? "border-[var(--accent-primary)] text-[color:var(--text-primary)]"
                : "border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
            }`}
          >
            {SORT_LABEL[opt]}
          </button>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Featured event
// ────────────────────────────────────────────────────────────────

function FeaturedEventCard({ event }: { event: EventCardData }) {
  const countdownTarget = event.status === "ongoing" ? event.endDate : event.registrationEndDate;
  const countdown = useCountdown(event.status === "ended" || event.status === "upcoming" ? null : countdownTarget);
  const countdownLabel = event.status === "ongoing" ? "Hạn nộp bài gần nhất" : "Hạn đăng ký";

  return (
    <div className="hud-clipped hud-glow-cyan flex flex-col gap-[var(--space-lg)] bg-[var(--bg-panel)] p-[var(--space-xl)] md:flex-row md:items-center md:justify-between">
      <div>
        <div className="mb-[var(--space-xs)] flex items-center gap-[var(--space-sm)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--accent-primary)]">
            Nổi bật
          </span>
          <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABEL[event.status]}</Badge>
        </div>
        <h2 className="font-display text-xl font-bold text-[color:var(--text-primary)] md:text-2xl">
          {event.eventName}
        </h2>
        <p className="mt-[2px] text-sm text-[color:var(--text-muted)]">
          {event.season} {event.year} · {event.tagline}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="mt-[var(--space-md)] inline-block text-sm font-medium text-[color:var(--accent-primary)] hover:text-white hover:underline"
        >
          Xem chi tiết →
        </Link>
      </div>

      {!countdown.isPast && (
        <div className="shrink-0">
          <p className="mb-[var(--space-xs)] text-xs uppercase tracking-wider text-[color:var(--text-muted)]">
            {countdownLabel}
          </p>
          <div
            className={`flex items-end gap-[var(--space-sm)] font-mono ${
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
                <span className="text-2xl font-bold tabular-nums" suppressHydrationWarning>
                  {String(u.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Event row — danh sách hàng ngang kiểu Devpost: icon trái, nội dung chính ở
// giữa (tiêu đề + giải thưởng — thứ người dùng quan tâm nhất nằm bên trái),
// thông tin phụ (ngày/hạng mục) dồn sang cột phải, viền trái đổi màu theo
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

// ────────────────────────────────────────────────────────────────
// Hạng mục nổi bật — mượn cấu trúc bảng "Top hackathon themes" của Devpost:
// gộp sự kiện theo track, click 1 hàng để lọc danh sách theo track đó (tái
// dùng ô search sẵn có thay vì thêm 1 loại filter mới).
// ────────────────────────────────────────────────────────────────

function TopThemesSection({
  tracks,
  activeTrack,
  onSelectTrack,
}: {
  tracks: TrackSummary[];
  activeTrack: string | null;
  onSelectTrack: (track: string) => void;
}) {
  if (tracks.length === 0) return null;

  return (
    <section className="border-t border-[var(--border-muted)] pt-[var(--space-xl)]">
      <h2 className="font-display text-xl font-bold text-[color:var(--text-primary)]">Hạng mục nổi bật</h2>
      <p className="mt-[var(--space-xs)] text-sm text-[color:var(--text-muted)]">
        Các hạng mục công nghệ được nhiều sự kiện SEAL tổ chức nhất — bấm vào 1 hạng mục để lọc.
      </p>

      <div className="mt-[var(--space-lg)] overflow-x-auto">
        {/* Grid thay vì <table> — table mặc định tự chia độ rộng cột theo nội
            dung nên bị dồn khoảng trắng lệch giữa các cột số. Grid với cột cố
            định canh đúng như thiết kế, đồng thời <button> thay <tr onClick>
            để bấm được bằng bàn phím (tr không nhận focus). */}
        <div className="min-w-[440px] text-sm">
          <div className="grid grid-cols-[1fr_72px_150px_20px] gap-x-[var(--space-md)] border-b border-[var(--border-muted)] pb-[var(--space-sm)] text-xs uppercase tracking-wider text-[color:var(--text-muted)]">
            <span>Hạng mục</span>
            <span className="text-right">Sự kiện</span>
            <span className="text-right">Tổng giải thưởng</span>
            <span aria-hidden="true" />
          </div>
          {tracks.map((t) => {
            const active = t.track === activeTrack;
            return (
              <button
                type="button"
                key={t.track}
                onClick={() => onSelectTrack(t.track)}
                aria-pressed={active}
                className={`group grid w-full grid-cols-[1fr_72px_150px_20px] items-center gap-x-[var(--space-md)] border-b border-[var(--border-muted)]/50 py-[var(--space-sm)] text-left transition-colors hover:bg-[var(--bg-panel)] ${
                  active ? "bg-[var(--accent-primary)]/10" : ""
                }`}
              >
                <span
                  className={`truncate ${active ? "font-medium text-[color:var(--accent-primary)]" : "text-[color:var(--text-primary)]"}`}
                >
                  {t.track}
                </span>
                <span className="text-right font-mono text-[color:var(--text-muted)]">{t.eventCount}</span>
                <span className="text-right font-mono tabular-nums text-[color:var(--text-muted)]">
                  {formatVnd(t.totalPrizeVnd)}
                </span>
                <span
                  className={`text-right text-[color:var(--text-muted)] transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// Sự kiện nổi bật — mượn cấu trúc lưới 2x2 "Featured hackathons" của Devpost:
// nền panel gradient, dải "NỔI BẬT" dọc bên trái mỗi thẻ, ảnh cover bên trái
// nội dung (khối màu theo hạng mục thay ảnh thật — chưa có asset ảnh).
// ────────────────────────────────────────────────────────────────

// Mỗi thẻ 1 màu tile khác nhau (xoay vòng theo accent role) để tạo cảm giác
// đa dạng như logo thật của từng hackathon trên Devpost.
const TILE_ACCENTS = ["var(--accent-primary)", "var(--accent-team)", "var(--accent-judge)", "var(--accent-coordinator)"];

function FeaturedEventsSection({
  events,
  onViewAll,
}: {
  events: EventCardData[];
  onViewAll: () => void;
}) {
  if (events.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border border-[var(--border-muted)] p-[var(--space-xl)]"
      style={{
        background:
          "linear-gradient(135deg, rgba(0,217,255,0.16) 0%, var(--bg-panel) 45%, rgba(59,130,246,0.2) 100%)",
      }}
    >
      <div className="mb-[var(--space-lg)] flex flex-wrap items-center justify-between gap-[var(--space-md)]">
        <h2 className="font-display text-xl font-bold text-[color:var(--text-primary)]">Sự kiện nổi bật</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="border border-[var(--text-primary)]/30 bg-[var(--bg-base)]/40 px-[var(--space-md)] py-[6px] text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[color:var(--accent-primary)]"
        >
          Xem tất cả sự kiện
        </button>
      </div>
      <div className="grid grid-cols-1 gap-[var(--space-lg)] sm:grid-cols-2">
        {events.map((ev, i) => (
          <FeaturedEventCardMini key={ev.id} event={ev} accent={TILE_ACCENTS[i % TILE_ACCENTS.length]} />
        ))}
      </div>
    </section>
  );
}

function FeaturedEventCardMini({ event, accent }: { event: EventCardData; accent: string }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="hud-clipped group flex items-stretch border border-[var(--border-muted)] bg-[var(--bg-panel)] transition-colors hover:border-[var(--accent-primary)]/60"
    >
      <div className="flex w-7 shrink-0 items-center justify-center bg-[var(--bg-base)]">
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent-primary)]">
          Nổi bật
        </span>
      </div>

      <div className="flex min-w-0 flex-1 gap-[var(--space-md)] p-[var(--space-lg)]">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center"
          style={{ background: `color-mix(in srgb, ${accent} 22%, var(--bg-input))` }}
        >
          <svg viewBox="0 0 100 100" className="h-10 w-10" aria-hidden="true">
            <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke={accent} strokeWidth="4" opacity="0.8" />
            <polygon points="50,30 68,40 68,60 50,70 32,60 32,40" fill={accent} opacity="0.35" />
          </svg>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--accent-primary)]">
              {event.eventName}
            </h3>
            <div className="mt-[var(--space-xs)]">
              <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABEL[event.status]}</Badge>
            </div>
          </div>
          <div className="mt-[var(--space-md)] flex items-center gap-[var(--space-lg)] font-mono text-xs">
            <span className="font-bold text-[color:var(--text-primary)]">{formatVnd(event.totalPrizeVnd)}</span>
            <span className="text-[color:var(--text-muted)]">
              {event.teamCount}/{event.maxTeams} đội
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
