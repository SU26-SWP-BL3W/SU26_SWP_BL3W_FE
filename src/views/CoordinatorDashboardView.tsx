"use client";

import React, { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { useEvents } from "@/repositories/eventsRepository";
import { computeEventStatus, STATUS_LABEL, STATUS_TONE, STATUS_DOT_VAR, type MockEvent } from "@/viewModels/mockEventsData";
import type { Event as EventDTO } from "@/models/entities";
import { Shield, Settings, Activity, Layers, Users, ArrowRight, CalendarPlus } from "lucide-react";
import Link from "next/link";

// Danh sách Round/Track chưa có trong DTO Event chính thức (chỉ lấy được qua
// endpoint riêng /Events/{id}/rounds) — khai báo optional để không phải dùng any.
type EventWithCounts = EventDTO & { rounds?: unknown[]; tracks?: unknown[] };

function toEventDates(ev: EventDTO): Pick<MockEvent, "startDate" | "endDate" | "registrationEndDate"> {
  return {
    startDate: ev.startDate || "",
    endDate: ev.endDate || "",
    registrationEndDate: ev.registrationEndDate || ev.endDate || "",
  };
}

export const CoordinatorDashboardView: React.FC = () => {
  const { data: rawData, isLoading } = useEvents();
  const [now] = useState(() => Date.now());
  const eventsData = Array.isArray(rawData) ? rawData : (rawData as { data?: EventWithCounts[] } | undefined)?.data;
  const eventsList: EventWithCounts[] = Array.isArray(eventsData) ? eventsData : [];

  const totalRounds = eventsList.reduce((acc, ev) => acc + (ev.rounds?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex flex-col">
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Header Title & Main Action Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-coordinator)] mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>BẢNG ĐIỀU HÀNH EVENT COORDINATOR (EC)</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--text-primary)] uppercase tracking-wider">
              Trung Tâm Quản Lý Sự Kiện &amp; Vòng Thi
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Quản lý danh sách các mùa giải Hackathon, vòng thi (Rounds), hạng mục (Tracks) và nhân sự Giám khảo/Cố vấn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/coordinator/staff">
              <Button variant="secondary" className="hud-clipped font-mono text-xs flex items-center gap-2">
                <Users className="w-4 h-4" /> MỜI NHÂN SỰ
              </Button>
            </Link>

            <Link href="/coordinator/events/new">
              <Button variant="primary" accent="coordinator" className="hud-glow-coordinator flex items-center gap-2">
                <Settings className="w-4 h-4" /> CẤU HÌNH VÒNG THI (WIZARD) &gt;
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid — chỉ giữ chỉ số có dữ liệu thật, bỏ số hardcode giả */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hud-glow-coordinator p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Sự Kiện Đang Phụ Trách
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-coordinator)]">
                {isLoading ? "..." : eventsList.length}
              </span>
              <Shield className="w-5 h-5 text-[var(--accent-coordinator)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              Theo dữ liệu Backend API hiện tại
            </span>
          </Card>

          <Card className="hud-glow-coordinator p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Tổng Số Vòng Thi (Rounds)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-coordinator)]">
                {isLoading ? "..." : totalRounds}
              </span>
              <Layers className="w-5 h-5 text-[var(--accent-coordinator)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              Phân bổ trên tất cả mùa giải
            </span>
          </Card>
        </div>

        {/* Managed Events Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider">
              Danh Sách Sự Kiện Đang Phụ Trách
            </h2>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              Cập nhật mới nhất từ Backend API
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <svg className="w-12 h-12 animate-spin" viewBox="0 0 100 100">
                <polygon
                  points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5"
                  fill="none"
                  stroke="var(--accent-coordinator)"
                  strokeWidth="2"
                  strokeDasharray="240"
                  strokeDashoffset="60"
                />
              </svg>
            </div>
          ) : eventsList.length === 0 ? (
            <Card className="p-16 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] text-center flex flex-col items-center gap-4">
              <CalendarPlus className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
              <p className="font-mono text-sm text-[var(--text-muted)] tracking-wide">
                Bạn chưa quản lý sự kiện nào
              </p>
              <Link href="/coordinator/events/new">
                <Button variant="primary" accent="coordinator" className="text-xs">
                  <Settings className="w-4 h-4" /> TẠO SỰ KIỆN ĐẦU TIÊN
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsList.map((ev) => {
                const status = computeEventStatus(toEventDates(ev) as MockEvent, now);
                const id = ev.id || ev.eventId || ev.EventId;
                return (
                  <div
                    key={id}
                    className="bg-[var(--bg-panel)] border border-[var(--border-muted)] p-6 hud-clipped flex flex-col justify-between space-y-4 hover:border-[var(--accent-coordinator)]/50 transition-all"
                    style={{ borderTop: `3px solid ${STATUS_DOT_VAR[status]}` }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[var(--accent-coordinator)] font-bold">
                          {ev.season || ev.Season}
                        </span>
                        <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
                      </div>
                      <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                        {ev.eventName || ev.EventName || ev.name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                        {ev.description || ""}
                      </p>
                    </div>

                    <div className="border-t border-[var(--border-muted)] pt-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--text-muted)]">
                        {ev.rounds?.length ?? 0} Vòng thi | {ev.tracks?.length ?? 0} Tracks
                      </span>
                      <Link
                        href={`/events/${id}`}
                        className="text-[var(--accent-coordinator)] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Quản lý</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
