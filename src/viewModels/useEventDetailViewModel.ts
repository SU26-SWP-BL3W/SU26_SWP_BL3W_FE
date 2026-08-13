"use client";

import { useMemo, useState } from "react";
import { MOCK_EVENTS } from "./mockEventsData";

export type RoundStatus = "past" | "current" | "upcoming";

export interface RoundSummary {
  id: string;
  roundNumber: number;
  roundName: string;
  registrationDate?: string;
  startDate: string;
  endDate: string;
  submissionDeadline?: string;
  resultAnnouncementDate?: string;
  appealDeadline?: string;
  description: string;
  status: RoundStatus;
}

function computeRoundStatus(startIso: string, endIso: string, now: number): RoundStatus {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "current";
}

/** Chi tiết 1 sự kiện theo id — dùng ở trang /events/[id]. MOCK, xem mockEventsData.ts. */
export function useEventDetailViewModel(eventId: string) {
  const [now] = useState(() => Date.now());

  const event = useMemo(() => {
    if (!eventId) return MOCK_EVENTS[0];
    return (
      MOCK_EVENTS.find((e) => e.id === eventId || e.id.includes(eventId) || eventId.includes(e.id)) ??
      MOCK_EVENTS[0]
    );
  }, [eventId]);

  const rounds: RoundSummary[] = useMemo(() => {
    if (!event) return [];

    const regRound: RoundSummary = {
      id: "reg-phase",
      roundNumber: 0,
      roundName: "Mở Form Đăng Ký Đội Thi",
      startDate: event.registrationStartDate,
      endDate: event.registrationEndDate,
      description: "Mở cổng nhận hồ sơ thành lập Đội thi, mời thành viên và ghi danh chính thức với Ban Tổ Chức.",
      status: computeRoundStatus(event.registrationStartDate, event.registrationEndDate, now),
    };

    const competitionRounds: RoundSummary[] = (event.rounds ?? []).map((r) => ({
      ...r,
      status: computeRoundStatus(r.startDate, r.endDate, now),
    }));

    return [regRound, ...competitionRounds];
  }, [event, now]);

  const currentRound = rounds.find((r) => r.status === "current") ?? null;

  return {
    notFound: false,
    eventName: event?.eventName ?? "",
    season: event?.season ?? "",
    year: event?.year ?? 0,
    tagline: event?.tagline ?? "",
    description: event?.description ?? "",
    tracks: event?.tracks ?? [],
    rounds,
    teamCount: event?.teamCount ?? 0,
    maxTeams: event?.maxTeams ?? 0,
    totalPrizeVnd: event?.totalPrizeVnd ?? 0,
    deadline: currentRound?.endDate ?? null,
    deadlineRoundName: currentRound?.roundName ?? null,
  };
}
