"use client";

import { useMemo, useState } from "react";

// ⚠️ MOCK DATA — chưa nối API thật vì Luồng 2 (Sự kiện & Vòng thi) chưa có
// Controller trên BE mới (xem docs/... audit Luồng 2). Khi có endpoint thật
// (dự kiến GET /api/Events/upcoming trả kèm Rounds lồng bên trong), CHỈ cần
// thay hàm này gọi qua 1 Repository thật (vd eventRepository.getUpcoming()) —
// View bên dưới đọc đúng shape này nên không cần sửa gì thêm.

export type RoundStatus = "past" | "current" | "upcoming";

export interface RoundSummary {
  id: string;
  roundNumber: number;
  roundName: string;
  startDate: string;
  endDate: string;
  status: RoundStatus;
}

const MOCK_EVENT = {
  eventName: "SEAL Hackathon 2026",
  season: "Mùa Hè 2026",
  tagline: "Đấu trường công nghệ dành cho sinh viên toàn quốc",
  tracks: [
    "AI & Machine Learning",
    "Phát triển Web",
    "Bảo mật & An ninh mạng",
    "IoT & Phần cứng thông minh",
  ],
  rounds: [
    {
      id: "r1",
      roundNumber: 1,
      roundName: "Vòng loại",
      startDate: "2026-07-15T00:00:00Z",
      endDate: "2026-08-10T23:59:59Z",
    },
    {
      id: "r2",
      roundNumber: 2,
      roundName: "Bán kết",
      startDate: "2026-08-11T00:00:00Z",
      endDate: "2026-09-05T23:59:59Z",
    },
    {
      id: "r3",
      roundNumber: 3,
      roundName: "Chung kết",
      startDate: "2026-09-15T00:00:00Z",
      endDate: "2026-09-20T23:59:59Z",
    },
  ],
};

function computeStatus(startIso: string, endIso: string, now: number): RoundStatus {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "current";
}

export function useGuestLandingViewModel() {
  // now chỉ lấy 1 lần lúc mount (lazy initializer) — Date.now() là hàm impure,
  // gọi trực tiếp trong thân component vi phạm React purity rules (có thể lệch
  // hydration server/client). Khác useCountdown ở lib/ vốn cần tick từng giây
  // nên phải dùng setInterval riêng.
  const [now] = useState(() => Date.now());

  const rounds: RoundSummary[] = useMemo(
    () =>
      MOCK_EVENT.rounds.map((r) => ({
        ...r,
        status: computeStatus(r.startDate, r.endDate, now),
      })),
    [now],
  );

  const currentRound = rounds.find((r) => r.status === "current") ?? null;

  return {
    eventName: MOCK_EVENT.eventName,
    season: MOCK_EVENT.season,
    tagline: MOCK_EVENT.tagline,
    tracks: MOCK_EVENT.tracks,
    rounds,
    /** Hạn nộp bài của vòng đang diễn ra — mốc đồng hồ đếm ngược trên Hero. */
    deadline: currentRound?.endDate ?? null,
    deadlineRoundName: currentRound?.roundName ?? null,
  };
}
