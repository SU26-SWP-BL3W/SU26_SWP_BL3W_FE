"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { LandingLeaderboardPodium } from "@/components/domain/LandingLeaderboardPodium";
import { MOCK_PODIUM_TEAMS, MOCK_EVENTS } from "@/viewModels/mockEventsData";

interface TableTeam {
  rank: number;
  teamCode: string;
  teamName: string;
  projectName: string;
  school: string;
  track: string;
  roundName: string;
  score: number;
  status: string;
}

const MOCK_TABLE_RESULTS: TableTeam[] = [
  { rank: 1, teamCode: "#TM-001", teamName: "CyberShield_FPT", projectName: "RBL Inter-Rater Reliability Platform", school: "Đại học FPT", track: "AI & Machine Learning", roundName: "Vòng 3: Chung Kết", score: 9.85, status: "QUÁN QUÂN" },
  { rank: 2, teamCode: "#TM-002", teamName: "ByteKnights", projectName: "Autonomous Threat Scanner", school: "Đại học Bách Khoa", track: "Bảo mật & An ninh mạng", roundName: "Vòng 3: Chung Kết", score: 9.42, status: "Á QUÂN 1" },
  { rank: 3, teamCode: "#TM-003", teamName: "NexusCore", projectName: "Smart Campus IoT Grid", school: "Đại học Công nghệ - ĐHQGHN", track: "IoT & Phần cứng thông minh", roundName: "Vòng 3: Chung Kết", score: 9.15, status: "Á QUÂN 2" },
  { rank: 4, teamCode: "#TM-004", teamName: "DevPulse_HQ", projectName: "Automated Code Review Bot", school: "Đại học FPT", track: "Phát triển Web", roundName: "Vòng 3: Chung Kết", score: 8.90, status: "TOP 5" },
  { rank: 5, teamCode: "#TM-005", teamName: "GreenPulse", projectName: "Eco Tracker App", school: "Đại học KHTN HCM", track: "Phát triển Web", roundName: "Vòng 3: Chung Kết", score: 8.75, status: "TOP 5" },
  { rank: 6, teamCode: "#TM-006", teamName: "DeepVision", projectName: "Medical Imaging Diagnostic", school: "Đại học Y Dược HCM", track: "AI & Machine Learning", roundName: "Vòng 2: Bán Kết", score: 8.50, status: "BÁN KẾT" },
  { rank: 7, teamCode: "#TM-007", teamName: "SecureCloud", projectName: "Zero Trust Mesh Sentinel", school: "Học viện Bưu chính Viễn thông", track: "Bảo mật & An ninh mạng", roundName: "Vòng 2: Bán Kết", score: 8.35, status: "BÁN KẾT" },
  { rank: 8, teamCode: "#TM-008", teamName: "SmartAgri", projectName: "IoT Crop Sensor Array", school: "Đại học Nông Lâm", track: "IoT & Phần cứng thông minh", roundName: "Vòng 2: Bán Kết", score: 8.10, status: "BÁN KẾT" },
];

export function LeaderboardView({ eventId }: { eventId: string }) {
  const [selectedEventId, setSelectedEventId] = useState<string>(eventId || "all");
  const event = MOCK_EVENTS.find((e) => e.id === selectedEventId) || MOCK_EVENTS[0];

  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [selectedRound, setSelectedRound] = useState<string>("all");

  const filteredResults = MOCK_TABLE_RESULTS.filter((r) => {
    if (selectedTrack !== "all" && r.track !== selectedTrack) return false;
    if (selectedRound !== "all" && !r.roundName.includes(selectedRound)) return false;
    return true;
  });

  return (
    <main className="hud-lattice flex flex-1 flex-col pb-16">
      
      {/* ── Header Bảng Vinh Danh ── */}
      <section className="border-b border-[var(--border-muted)] bg-[var(--bg-panel)]/70">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--accent-judge)] tracking-[0.25em] uppercase mb-2">
            <Link href="/" className="hover:underline">TRANG CHỦ</Link>
            <span>›</span>
            <span className="text-[var(--accent-judge)]">BẢNG VINH DANH HỆ THỐNG (HALL OF FAME)</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--text-primary)] flex items-center gap-3">
                <span>🏆</span> BẢNG VINH DANH CÁC MÙA GIẢI (HALL OF FAME)
              </h1>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
                Vinh danh Top Đội Thi Xuất Sắc Nhất đạt giải cao tại các Cuộc thi Hackathon toàn quốc.
              </p>
            </div>

            {/* Dropdown Chọn Sự Kiện Để Xem Vinh Danh */}
            <div className="flex items-center gap-2 bg-[var(--bg-input)] p-2 border border-[var(--accent-judge)]/50 hud-clipped">
              <span className="font-mono text-xs text-[var(--accent-judge)] font-bold">🎯 CHỌN SỰ KIỆN:</span>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="bg-[var(--bg-panel)] text-[var(--text-primary)] font-mono text-xs font-bold px-3 py-1.5 border border-[var(--border-muted)] focus:outline-none focus:border-[var(--accent-judge)]"
              >
                <option value="all">🏆 Tất Cả Mùa Giải (Hall of Fame)</option>
                {MOCK_EVENTS.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top 3 E-Sports Podium Section ── */}
      <LandingLeaderboardPodium
        eventName={selectedEventId === "all" ? "HỆ THỐNG XẾP HẠNG TOÀN QUỐC" : event.eventName}
        season="MÙA HÈ 2026"
        totalPrizeVnd={selectedEventId === "all" ? 500_000_000 : (event.totalPrizeVnd || 200_000_000)}
      />

      {/* ── Full Score Table Section ── */}
      <section className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-[var(--accent-judge)] uppercase">
              BỘ LỌC ĐIỂM SỐ:
            </span>
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
              className="px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-judge)]"
            >
              <option value="all">Tất cả vòng thi</option>
              <option value="Chung Kết">Vòng 3: Chung Kết</option>
              <option value="Bán Kết">Vòng 2: Bán Kết</option>
              <option value="Vòng Loại">Vòng 1: Vòng Loại</option>
            </select>

            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-judge)]"
            >
              <option value="all">Tất cả hạng mục</option>
              {event.tracks.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="font-mono text-xs text-[var(--text-muted)]">
            Hiển thị <strong className="text-[var(--text-primary)]">{filteredResults.length}</strong> đội thi
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="w-full overflow-x-auto border border-[var(--border-muted)] bg-[var(--bg-panel)] hud-clipped">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-base)]">
                <th className="p-4 font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase text-center w-16">HẠNG</th>
                <th className="p-4 font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">MÃ ĐỘI</th>
                <th className="p-4 font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">TÊN ĐỘI THI & DỰ ÁN</th>
                <th className="p-4 font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">TRƯỜNG</th>
                <th className="p-4 font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">HẠNG MỤC</th>
                <th className="p-4 font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">VÒNG THI</th>
                <th className="p-4 font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase text-right">ĐIỂM SỐ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-muted)]">
              {filteredResults.map((row) => (
                <tr key={row.teamCode} className="hover:bg-[rgba(251,191,36,0.03)] transition-colors duration-150 group">
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 font-mono font-bold text-xs hud-clipped border ${
                      row.rank === 1 ? "bg-[var(--accent-judge)]/20 border-[var(--accent-judge)] text-[var(--accent-judge)] font-extrabold" :
                      row.rank === 2 ? "bg-[var(--accent-team)]/20 border-[var(--accent-team)] text-[var(--accent-team)] font-bold" :
                      row.rank === 3 ? "bg-[var(--color-warning)]/20 border-[var(--color-warning)] text-[var(--color-warning)] font-bold" :
                      "bg-[var(--bg-input)] border-[var(--border-muted)] text-[var(--text-muted)]"
                    }`}>
                      {row.rank < 10 ? `0${row.rank}` : row.rank}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-[var(--accent-team)] font-semibold">{row.teamCode}</td>
                  <td className="p-4 font-mono">
                    <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-judge)] transition-colors">
                      {row.teamName}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{row.projectName}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-[var(--text-muted)]">{row.school}</td>
                  <td className="p-4 font-mono text-xs">
                    <span className="border border-[var(--border-muted)] bg-[var(--bg-input)] px-2 py-0.5 text-[var(--text-muted)]">
                      {row.track}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-[var(--text-muted)]">{row.roundName}</td>
                  <td className="p-4 font-mono text-base font-bold text-right text-[var(--accent-judge)]">
                    {row.score.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}
