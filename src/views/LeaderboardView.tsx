"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useGetFinalResultsByRound } from "@/repositories/finalResultsRepository";
import { MOCK_EVENTS } from "@/viewModels/mockEventsData";
import { LandingLeaderboardPodium } from "@/components/domain/LandingLeaderboardPodium";
import { Trophy, Medal, Award, RefreshCw, Send, Lock, Filter } from "lucide-react";

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
  { rank: 1, teamCode: "#TM-001", teamName: "CyberShield", projectName: "Hệ thống bảo mật tự động LLM", school: "Đại học FPT", track: "AI & Machine Learning", roundName: "Vòng 3: Chung Kết", score: 9.85, status: "QUÁN QUÂN" },
  { rank: 2, teamCode: "#TM-002", teamName: "DevDragons", projectName: "Smart Contract Truy Xuất Nguồn Gốc", school: "HCMUS", track: "Bảo mật & An ninh mạng", roundName: "Vòng 3: Chung Kết", score: 9.42, status: "Á QUÂN 1" },
  { rank: 3, teamCode: "#TM-003", teamName: "NeuralKnights", projectName: "AI Chẩn Đoán Hình Ảnh Y Tế", school: "UIT", track: "IoT & Phần cứng thông minh", roundName: "Vòng 3: Chung Kết", score: 9.15, status: "Á QUÂN 2" },
  { rank: 4, teamCode: "#TM-004", teamName: "ByteBusters", projectName: "Automated Threat Sentinel", school: "HUST", track: "Phát triển Web", roundName: "Vòng 3: Chung Kết", score: 8.90, status: "TOP 5" },
  { rank: 5, teamCode: "#TM-005", teamName: "CryptoGuardians", projectName: "Zero Trust Mesh Network", school: "VLU", track: "Phát triển Web", roundName: "Vòng 3: Chung Kết", score: 8.75, status: "TOP 5" },
];

export function LeaderboardView({ eventId }: { eventId?: string }) {
  const isEventScoped = Boolean(eventId && eventId !== "all");
  const [selectedEventId, setSelectedEventId] = useState<string>(eventId || "seal-2026-mua-he");
  const [selectedRoundId, setSelectedRoundId] = useState<string>("r3");
  const [selectedTrackId, setSelectedTrackId] = useState<string>("all");

  const currentViewEventId = isEventScoped ? eventId! : selectedEventId;
  const event = MOCK_EVENTS.find((e) => e.id === currentViewEventId) || MOCK_EVENTS[0];

  const {
    data: results = [],
    isLoading,
    refetch,
  } = useGetFinalResultsByRound(selectedRoundId, currentViewEventId);

  const filteredResults = results.filter((r) => {
    const isPub = r.isPublished ?? true;
    const matchTrack = selectedTrackId === "all" || r.trackId === selectedTrackId;
    return isPub && matchTrack;
  });

  return (
    <main className="hud-lattice flex flex-1 flex-col pb-16 min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* ── Header Bảng Xếp Hạng ── */}
      <section className="border-b border-[var(--border-muted)] bg-[var(--bg-panel)]/70">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[rgba(251,191,36,0.1)] border border-[var(--accent-judge)]/40 flex items-center justify-center hud-clipped">
                <Trophy className="w-7 h-7 text-[var(--accent-judge)] animate-pulse" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--accent-judge)]">
                  BẢNG XẾP HẠNG (LEADERBOARD)
                </h1>
                <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
                  Sự kiện: <strong className="text-[var(--text-primary)]">{event.eventName}</strong> · Quỹ giải thưởng: <strong className="text-[var(--accent-judge)]">{event.totalPrizeVnd ? `${(event.totalPrizeVnd / 1_000_000).toLocaleString("vi-VN")} TRIỆU ₫` : "200.000.000 ₫"}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/appeals">
                <button className="px-4 py-2 border border-[var(--color-warning)]/40 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/10 font-mono text-xs flex items-center gap-1.5 cursor-pointer">
                  <Send className="w-3.5 h-3.5" /> Gửi Đơn Phúc Khảo
                </button>
              </Link>
              <button onClick={() => refetch()} className="px-4 py-2 border border-[var(--border-muted)] font-mono text-xs text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] cursor-pointer flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Làm mới
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top 3 Podium Section ── */}
      <LandingLeaderboardPodium
        eventName={selectedEventId === "all" ? "HỆ THỐNG XẾP HẠNG TOÀN QUỐC" : event.eventName}
        season="MÙA HÈ 2026"
        totalPrizeVnd={selectedEventId === "all" ? 500_000_000 : (event.totalPrizeVnd || 200_000_000)}
      />

      {/* ── Filter Bar & Data Table ── */}
      <section className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8 space-y-6">
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-judge)] uppercase border-b border-[var(--border-muted)] pb-2">
            <Filter className="w-4 h-4 text-[var(--accent-judge)]" />
            <span>BỘ LỌC KẾT QUẢ SỰ KIỆN & VÒNG THI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">1. Chọn Sự Kiện (Event):</label>
              <select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  setSelectedRoundId("r3");
                }}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent-judge)] cursor-pointer"
              >
                {MOCK_EVENTS.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventName} ({ev.season} {ev.year})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">2. Chọn Vòng Thi (Round):</label>
              <select
                value={selectedRoundId}
                onChange={(e) => setSelectedRoundId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent-judge)] cursor-pointer"
              >
                {event.rounds.map((rnd) => (
                  <option key={rnd.id} value={rnd.id}>
                    Vòng {rnd.roundNumber}: {rnd.roundName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">3. Chọn Hạng Mục (Track):</label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent-judge)] cursor-pointer"
              >
                <option value="all">Tất cả Hạng mục (All Tracks)</option>
                <option value="track-1">Track 1: AI & Data Science</option>
                <option value="track-2">Track 2: Cyber Security</option>
                <option value="track-3">Track 3: Web3 & Blockchain</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="w-full overflow-x-auto border border-[var(--border-muted)] bg-[var(--bg-panel)] hud-clipped">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-judge)]" />
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="w-full p-16 text-center space-y-3">
              <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
              <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest uppercase">
                Chưa có kết quả chính thức được công bố cho Vòng thi này
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-base)]">
                  <th className="p-4 text-center w-16">HẠNG</th>
                  <th className="p-4">TÊN ĐỘI THI</th>
                  <th className="p-4">HẠNG MỤC (TRACK)</th>
                  <th className="p-4 text-center">ĐIỂM TỔNG</th>
                  <th className="p-4">GIẢI THƯỞNG CHI TIẾT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-muted)]">
                {filteredResults.map((item, idx) => {
                  const rank = item.rank || idx + 1;
                  const isGold = rank === 1;
                  const isSilver = rank === 2;
                  const isBronze = rank === 3;

                  return (
                    <tr key={item.id || idx} className="hover:bg-[rgba(251,191,36,0.03)] transition-colors">
                      <td className="p-4 text-center font-bold">
                        <div className="flex items-center justify-center gap-1.5">
                          {isGold && <Trophy className="w-4 h-4 text-yellow-400" />}
                          {isSilver && <Medal className="w-4 h-4 text-gray-300" />}
                          {isBronze && <Award className="w-4 h-4 text-amber-600" />}
                          <span className={isGold ? "text-yellow-400 font-extrabold text-sm" : ""}>
                            #{rank}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[var(--text-primary)]">
                        {item.teamName || `Đội #${item.teamId}`}
                      </td>
                      <td className="p-4 text-[var(--text-muted)]">
                        {item.trackId?.toUpperCase() || "AI & DATA"}
                      </td>
                      <td className="p-4 text-center font-bold text-[var(--accent-judge)] text-sm">
                        {item.finalScore} / 10
                      </td>
                      <td className="p-4">
                        {item.prizeName ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-yellow-400 flex items-center gap-1">
                              🏆 {item.prizeName}
                            </span>
                            {item.rewardAmount && (
                              <span className="text-[10px] text-[var(--color-success)] font-bold">
                                Trị giá: {item.rewardAmount.toLocaleString("vi-VN")} VNĐ
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
