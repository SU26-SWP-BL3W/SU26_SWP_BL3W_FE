"use client";

import React from "react";
import { NavigationBar } from "@/components/domain/NavigationBar";
import { Footer } from "@/components/domain/Footer";
import { Button, Card, Badge, Table } from "@/components/ui";
import { MOCK_EVENTS } from "@/viewModels/mockEventsData";
import {
  Shield,
  Plus,
  Calendar,
  Layers,
  Users,
  Award,
  Settings,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

export const CoordinatorDashboardView: React.FC = () => {
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
              Trung Tâm Quản Lý Sự Kiện & Vòng Thi
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Quản lý danh sách các mùa giải Hackathon, vòng thi (Rounds), hạng mục (Tracks) và nhân sự Giám khảo/Cố vấn.
            </p>
          </div>

          <Link href="/coordinator/events/new">
            <Button variant="primary" accent="coordinator" className="hud-glow-coordinator flex items-center gap-2">
              <Settings className="w-4 h-4" /> // CẤU HÌNH VÒNG THI & NHÂN SỰ &gt;
            </Button>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hud-glow-coordinator p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Sự Kiện Đang Phụ Trách
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-coordinator)]">
                {MOCK_EVENTS.length}
              </span>
              <Shield className="w-5 h-5 text-[var(--accent-coordinator)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--color-success)] block">
              ● 2 Sự kiện đang diễn ra trực tiếp
            </span>
          </Card>

          <Card className="hud-glow-cyan p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Tổng Số Vòng Thi (Rounds)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-primary)]">
                {MOCK_EVENTS.reduce((acc, ev) => acc + ev.rounds.length, 0)}
              </span>
              <Layers className="w-5 h-5 text-[var(--accent-primary)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              Bao gồm Vòng loại, Bán kết, Chung kết
            </span>
          </Card>

          <Card className="hud-glow-amber p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Hội Đồng Giám Khảo & Cố Vấn
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-judge)]">18</span>
              <Users className="w-5 h-5 text-[var(--accent-judge)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--color-warning)] block">
              ⚡ 4 Lời mời đang chờ xác nhận (Pending)
            </span>
          </Card>

          <Card className="hud-glow-mentor p-5 space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              Tổng Đội Thi Đã Đăng Ký
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-2xl text-[var(--accent-mentor)]">203</span>
              <Award className="w-5 h-5 text-[var(--accent-mentor)] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              Trên 6 Hạng mục công nghệ
            </span>
          </Card>
        </div>

        {/* Managed Events Data Table */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
            <h3 className="font-mono font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
              Danh Sách Sự Kiện Do Bạn Quản Lý ({MOCK_EVENTS.length})
            </h3>
            <Link href="/coordinator/events/new">
              <Button variant="ghost" className="font-mono text-xs">
                + Thêm Sự Kiện
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>MÃ DỰ ÁN / TÊN SỰ KIỆN</th>
                  <th>MÙA GIẢI</th>
                  <th>SỐ VÒNG THI</th>
                  <th>HẠNG MỤC (TRACKS)</th>
                  <th>THỜI GIAN DIỄN RA</th>
                  <th className="text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EVENTS.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div className="font-mono font-bold text-sm text-[var(--text-primary)]">{ev.eventName}</div>
                      <div className="font-mono text-[10px] text-[var(--accent-primary)]">ID: #{ev.id}</div>
                    </td>
                    <td>
                      <Badge tone="team">{ev.season} {ev.year}</Badge>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-[var(--text-primary)]">
                        {ev.rounds.length} Vòng ({ev.rounds.map((r) => r.roundName).join(" → ")})
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {ev.tracks.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-muted)]"
                          >
                            {t}
                          </span>
                        ))}
                        {ev.tracks.length > 2 && (
                          <span className="text-[10px] font-mono text-[var(--accent-primary)]">
                            +{ev.tracks.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        15/07 — 20/09/2026
                      </span>
                    </td>
                    <td className="text-center">
                      <Link href={`/coordinator/events/new`}>
                        <Button variant="ghost" className="text-xs font-mono border-[var(--accent-coordinator)] text-[var(--accent-coordinator)]">
                          <Settings className="w-3.5 h-3.5" /> Quản lý
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
};
