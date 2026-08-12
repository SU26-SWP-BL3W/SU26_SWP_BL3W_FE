"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MOCK_EVENTS, type MockEvent } from "./mockEventsData";

export type EventDisplayStatus = "registration_open" | "ongoing" | "upcoming" | "ended";

export interface EventCardData extends MockEvent {
  status: EventDisplayStatus;
}

export type EventStatusFilter = "all" | EventDisplayStatus;
export type EventSortOption = "relevant" | "soonest" | "newest" | "most_teams";

export interface TrackSummary {
  track: string;
  eventCount: number;
  totalPrizeVnd: number;
}

// Thứ tự ưu tiên dùng chung cho sort "relevant" lẫn chọn sự kiện nổi bật.
const STATUS_PRIORITY: Record<EventDisplayStatus, number> = {
  ongoing: 0,
  registration_open: 1,
  upcoming: 2,
  ended: 3,
};

function computeEventStatus(ev: MockEvent, now: number): EventDisplayStatus {
  const start = new Date(ev.startDate).getTime();
  const end = new Date(ev.endDate).getTime();
  const regEnd = new Date(ev.registrationEndDate).getTime();

  if (now > end) return "ended";
  if (now >= start) return "ongoing";
  if (now <= regEnd) return "registration_open";
  return "upcoming";
}

export function useEventsDiscoveryViewModel() {
  // Lazy initializer — tránh gọi Date.now() trực tiếp trong thân component
  // (vi phạm React purity rules, xem ghi chú tương tự ở useGuestLandingViewModel cũ).
  const [now] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all");
  const [sort, setSort] = useState<EventSortOption>("relevant");

  // Bộ lọc hạng mục (track) đồng bộ 2 chiều với query string (?track=...) —
  // bấm vào 1 hàng ở "Hạng mục nổi bật" phải cảm giác như ĐIỀU HƯỚNG tới 1 kết
  // quả đã lọc sẵn (đổi URL, back/forward được, share link được) giống Devpost
  // thật, không phải chỉ âm thầm đổi 1 state ẩn trong trang.
  //
  // Dùng thẳng window.history thay vì useSearchParams()/useRouter() của Next —
  // useSearchParams() bắt buộc bọc Suspense và trong thực tế bị treo vô thời
  // hạn ở trang này (không có lỗi console nào, chỉ đứng yên ở fallback), nên
  // tránh hẳn cơ chế đó cho 1 tính năng phụ không đáng đánh đổi độ phức tạp.
  const [trackFilter, setTrackFilterState] = useState<string | null>(null);

  useEffect(() => {
    const readFromUrl = () => setTrackFilterState(new URLSearchParams(window.location.search).get("track"));
    readFromUrl();
    window.addEventListener("popstate", readFromUrl);
    return () => window.removeEventListener("popstate", readFromUrl);
  }, []);

  const setTrackFilter = useCallback((track: string | null) => {
    setTrackFilterState(track);
    const params = new URLSearchParams(window.location.search);
    if (track) params.set("track", track);
    else params.delete("track");
    const qs = params.toString();
    window.history.pushState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, []);

  const allEvents: EventCardData[] = useMemo(
    () => MOCK_EVENTS.map((ev) => ({ ...ev, status: computeEventStatus(ev, now) })),
    [now],
  );

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = allEvents.filter((ev) => {
      const matchesSearch =
        !q ||
        ev.eventName.toLowerCase().includes(q) ||
        ev.tagline.toLowerCase().includes(q) ||
        ev.tracks.some((t) => t.toLowerCase().includes(q));
      const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
      const matchesTrack = !trackFilter || ev.tracks.includes(trackFilter);
      return matchesSearch && matchesStatus && matchesTrack;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "soonest":
        sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case "most_teams":
        sorted.sort((a, b) => b.teamCount - a.teamCount);
        break;
      case "relevant":
      default:
        // Ưu tiên: đang diễn ra > đang mở đăng ký > sắp diễn ra > đã kết thúc.
        sorted.sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);
    }
    return sorted;
  }, [allEvents, search, statusFilter, sort, trackFilter]);

  // Sự kiện nổi bật: ưu tiên đang diễn ra, kế đến đang mở đăng ký, sớm nhất trước.
  const featuredEvent = useMemo(() => {
    const ongoing = allEvents.filter((e) => e.status === "ongoing");
    if (ongoing.length > 0) return ongoing[0];
    const open = allEvents
      .filter((e) => e.status === "registration_open")
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return open[0] ?? null;
  }, [allEvents]);

  // Lưới "Sự kiện nổi bật" (kiểu Devpost "Featured hackathons"): top 4 sự kiện
  // chưa kết thúc theo cùng thứ tự ưu tiên với sort "relevant", bỏ sự kiện đã
  // lên khối hero (featuredEvent) ở trên để tránh lặp lại.
  const featuredEvents: EventCardData[] = useMemo(() => {
    return [...allEvents]
      .filter((e) => e.status !== "ended" && e.id !== featuredEvent?.id)
      .sort(
        (a, b) =>
          STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .slice(0, 4);
  }, [allEvents, featuredEvent]);

  // Bảng "Hạng mục nổi bật" (kiểu Devpost "Top hackathon themes"): gộp theo
  // track trên TOÀN BỘ sự kiện (không theo bộ lọc hiện tại) — 1 sự kiện thuộc
  // nhiều track thì cộng dồn vào từng track đó (giống cách Devpost đếm theme).
  const topTracks: TrackSummary[] = useMemo(() => {
    const byTrack = new Map<string, TrackSummary>();
    for (const ev of allEvents) {
      for (const track of ev.tracks) {
        const existing = byTrack.get(track);
        if (existing) {
          existing.eventCount += 1;
          existing.totalPrizeVnd += ev.totalPrizeVnd;
        } else {
          byTrack.set(track, { track, eventCount: 1, totalPrizeVnd: ev.totalPrizeVnd });
        }
      }
    }
    return Array.from(byTrack.values()).sort(
      (a, b) => b.eventCount - a.eventCount || b.totalPrizeVnd - a.totalPrizeVnd,
    );
  }, [allEvents]);

  return {
    events: filteredEvents,
    totalCount: allEvents.length,
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
  };
}
