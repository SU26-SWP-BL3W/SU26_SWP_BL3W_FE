"use client";

import { useMemo, useState } from "react";
import { MOCK_EVENTS, computeEventStatus, STATUS_PRIORITY, type EventCardData } from "./mockEventsData";

/**
 * Preview cho Landing Portal ("/") — CHỈ lấy 1 phần nhỏ dữ liệu để hiển thị
 * (không phải danh sách đầy đủ, đó là việc của trang "/events"). 2 khối:
 * - "mới nhất trong kỳ": sự kiện đang/sắp diễn ra, gần nhất theo ngày bắt đầu.
 * - "nổi bật": tách biệt khỏi khối trên (không trùng), xếp theo tổng giải
 *   thưởng — vì hệ thống chưa có cờ "featured" thủ công ở entity Event thật.
 */
export function useLandingPreviewViewModel() {
  const [now] = useState(() => Date.now());

  const allEvents: EventCardData[] = useMemo(
    () => MOCK_EVENTS.map((ev) => ({ ...ev, status: computeEventStatus(ev, now) })),
    [now],
  );

  // Chỉ 1 sự kiện "mới nhất trong kỳ" — nổi bật hơn hẳn nếu tách riêng thành
  // 1 khối spotlight thay vì trộn chung lưới 3 thẻ đều nhau.
  const latestEvent = useMemo(() => {
    const candidates = [...allEvents]
      .filter((e) => e.status !== "ended")
      .sort(
        (a, b) =>
          STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
    return candidates[0] ?? null;
  }, [allEvents]);

  const featuredEvents = useMemo(() => {
    return [...allEvents]
      .filter((e) => e.id !== latestEvent?.id)
      .sort((a, b) => b.totalPrizeVnd - a.totalPrizeVnd)
      .slice(0, 3);
  }, [allEvents, latestEvent]);

  return { latestEvent, featuredEvents };
}
