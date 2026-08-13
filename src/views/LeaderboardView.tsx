"use client";

import { useState } from "react";
import { useGetFinalResultsByRound } from "@/repositories/finalResultsRepository";
import { MOCK_EVENTS } from "@/viewModels/mockEventsData";
import { Button, Card, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui";
import { Trophy, Medal, Award, RefreshCw, Send, Lock, Calendar, Filter } from "lucide-react";
import Link from "next/link";

export function LeaderboardView() {
  const [selectedEventId, setSelectedEventId] = useState("seal-2026-mua-he");
  const [selectedRoundId, setSelectedRoundId] = useState("r3");
  const [selectedTrackId, setSelectedTrackId] = useState("all");

  // Lấy sự kiện đang chọn từ mock / API
  const currentEvent = MOCK_EVENTS.find((e) => e.id === selectedEventId) || MOCK_EVENTS[0];

  const {
    data: results = [],
    isLoading,
    refetch,
  } = useGetFinalResultsByRound(selectedRoundId, selectedEventId);

  // Lọc kết quả công khai (isPublished) & theo Track chọn
  const filteredResults = results.filter((r) => {
    const isPub = r.isPublished ?? true;
    const matchTrack = selectedTrackId === "all" || r.trackId === selectedTrackId;
    return isPub && matchTrack;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] hud-lattice px-6 py-8">
      {/* Header Title */}
      <div className="max-w-6xl mx-auto mb-8 border-b border-[var(--border-muted)] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[rgba(251,191,36,0.1)] border border-[var(--accent-judge)]/40 flex items-center justify-center hud-clipped">
            <Trophy className="w-7 h-7 text-[var(--accent-judge)] animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--accent-judge)] tracking-widest uppercase">
              BẢNG XẾP HẠNG (LEADERBOARD)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              // HACKATHON OFFICIAL FINAL RESULTS & WINNING PRIZES
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/appeals">
            <Button
              variant="ghost"
              className="flex items-center gap-1.5 text-xs text-[var(--color-warning)] border-[var(--color-warning)]/30 font-mono"
            >
              <Send className="w-3.5 h-3.5" /> Gửi Đơn Phúc Khảo
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => refetch()} className="text-xs font-mono">
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Multilevel Filter Control Bar (Event -> Round -> Track) */}
        <Card className="p-4 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-judge)] uppercase border-b border-[var(--border-muted)] pb-2">
            <Filter className="w-4 h-4 text-[var(--accent-judge)]" />
            <span>BỘ LỌC KẾT QUẢ SỰ KIỆN & VÒNG THI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filter 1: Event Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                1. Chọn Sự Kiện (Event):
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  setSelectedRoundId("r3");
                }}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-judge)] cursor-pointer"
              >
                {MOCK_EVENTS.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventName} ({ev.season} {ev.year})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Round Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                2. Chọn Vòng Thi (Round):
              </label>
              <select
                value={selectedRoundId}
                onChange={(e) => setSelectedRoundId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-judge)] cursor-pointer"
              >
                {currentEvent.rounds.map((rnd) => (
                  <option key={rnd.id} value={rnd.id}>
                    Vòng {rnd.roundNumber}: {rnd.roundName}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Track Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                3. Chọn Hạng Mục (Track):
              </label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-judge)] cursor-pointer"
              >
                <option value="all">Tất cả Hạng mục (All Tracks)</option>
                <option value="track-1">Track 1: AI & Data Science</option>
                <option value="track-2">Track 2: Cyber Security</option>
                <option value="track-3">Track 3: Web3 & Blockchain</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-judge)]" />
          </div>
        ) : filteredResults.length === 0 ? (
          <Card className="w-full p-16 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] text-center space-y-3">
            <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
            <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest uppercase">
              Chưa có kết quả chính thức được công bố cho Vòng thi này
            </p>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              * Event Coordinator đang tiến hành hiệu chuẩn điểm số. Vui lòng quay lại sau!
            </p>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>HẠNG</TableHead>
                <TableHead>TÊN ĐỘI THI</TableHead>
                <TableHead>HẠNG MỤC (TRACK)</TableHead>
                <TableHead>ĐIỂM TỔNG TÍNH TOÁN</TableHead>
                <TableHead>GIẢI THƯỞNG CHI TIẾT</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredResults.map((item, idx) => {
                const rank = item.rank || idx + 1;
                const isGold = rank === 1;
                const isSilver = rank === 2;
                const isBronze = rank === 3;

                return (
                  <TableRow key={item.id || idx}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono font-bold text-sm">
                        {isGold && <Trophy className="w-5 h-5 text-yellow-400" />}
                        {isSilver && <Medal className="w-5 h-5 text-gray-300" />}
                        {isBronze && <Award className="w-5 h-5 text-amber-600" />}
                        <span className={isGold ? "text-yellow-400 font-extrabold text-base" : ""}>
                          #{rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                        {item.teamName || `Đội #${item.teamId}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge tone="team">{item.trackId?.toUpperCase() || "AI & DATA"}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-base font-bold text-[var(--accent-judge)]">
                        {item.finalScore} / 10
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.prizeName ? (
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-yellow-400 flex items-center gap-1">
                            🏆 {item.prizeName}
                          </span>
                          {item.rewardAmount && (
                            <span className="text-[10px] font-mono text-[var(--color-success)] font-bold">
                              Trị giá: {item.rewardAmount.toLocaleString("vi-VN")} VNĐ
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-[var(--text-muted)]">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
