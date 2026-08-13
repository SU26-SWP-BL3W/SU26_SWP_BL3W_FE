"use client";

import React from "react";
import { Button, Card, Badge } from "@/components/ui";
import { useEvents } from "@/repositories/eventsRepository";
import { MOCK_EVENTS } from "@/viewModels/mockEventsData";
import { Shield, Settings, Activity, Calendar, Layers, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export const CoordinatorDashboardView: React.FC = () => {
  const { data: rawData, isLoading } = useEvents();
  const eventsData = (Array.isArray(rawData) ? rawData : (rawData as any)?.data) || MOCK_EVENTS;
  const eventsList = Array.isArray(eventsData) && eventsData.length > 0 ? eventsData : MOCK_EVENTS;

  const totalRounds = eventsList.reduce((acc, ev) => acc + (ev.rounds?.length || 3), 0);

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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <span className="font-mono text-[10px] text-[var(--color-success)] block">
              ● Sự kiện đang diễn ra trực tiếp
            </span>
          </Card>

          <Card className="hud-glow-cyan p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Tổng Số Vòng Thi (Rounds)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-primary)]">
                {isLoading ? "..." : totalRounds}
              </span>
              <Layers className="w-5 h-5 text-[var(--accent-primary)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              Phân bổ trên tất cả mùa giải
            </span>
          </Card>

          <Card className="hud-glow-gold p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Hội Đồng Giám Khảo &amp; Cố Vấn
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-judge)]">
                18
              </span>
              <Users className="w-5 h-5 text-[var(--accent-judge)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              12 Giám khảo | 6 Cố vấn
            </span>
          </Card>

          <Card className="hud-glow-team p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Tổng Số Đội Thi Đã Đăng Ký
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-team)]">
                42
              </span>
              <Calendar className="w-5 h-5 text-[var(--accent-team)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              Trên tất cả các Hạng mục Track
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsList.map((ev) => (
              <div
                key={ev.id}
                className="bg-[var(--bg-panel)] border border-[var(--border-muted)] p-6 hud-clipped flex flex-col justify-between space-y-4 hover:border-[var(--accent-coordinator)]/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--accent-coordinator)] font-bold">
                      {ev.season}
                    </span>
                    <Badge tone="success">
                      {ev.status || "ĐANG MỞ"}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                    {ev.eventName}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {ev.description}
                  </p>
                </div>

                <div className="border-t border-[var(--border-muted)] pt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)]">
                    {ev.rounds?.length || 3} Vòng thi | {ev.tracks?.length || 4} Tracks
                  </span>
                  <Link
                    href={`/events/${ev.id}`}
                    className="text-[var(--accent-coordinator)] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Quản lý</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
