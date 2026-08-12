"use client";

import { useState } from "react";
import { useGetFinalResultsByRound } from "@/repositories/finalResultsRepository";
import { Button, Card, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui";
import { Trophy, Medal, Award, RefreshCw, Send, Lock, Shield } from "lucide-react";
import Link from "next/link";

export function LeaderboardView() {
  const [selectedRoundId, setSelectedRoundId] = useState("round-1");
  const [selectedTrackId, setSelectedTrackId] = useState("all");

  const { data: results = [], isLoading, refetch } = useGetFinalResultsByRound(selectedRoundId);

  // Lọc kết quả công khai (isPublished) & theo Track chọn
  const publishedResults = results.filter((r) => {
    const isPub = r.isPublished ?? true;
    const matchTrack = selectedTrackId === "all" || r.trackId === selectedTrackId;
    return isPub && matchTrack;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] hud-lattice px-6 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 border-b border-[var(--border-muted)] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(251,191,36,0.1)] border border-[var(--accent-judge)]/30 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[var(--accent-judge)]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--accent-judge)] tracking-widest uppercase">
              BẢNG XẾP HẠNG (LEADERBOARD)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              // HACKATHON OFFICIAL FINAL RESULTS & PRIZES
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/appeals">
            <Button variant="ghost" className="flex items-center gap-1.5 text-xs text-[var(--color-warning)] border-[var(--color-warning)]/30">
              <Send className="w-3.5 h-3.5" /> Gửi Đơn Phúc Khảo
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => refetch()} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Track Filter Bar */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase font-bold">
              Phân loại Hạng mục (Track):
            </span>
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped cursor-pointer"
            >
              <option value="all">Tất cả Hạng mục</option>
              <option value="track-1">Track 1: AI & Data Science</option>
              <option value="track-2">Track 2: Cyber Security</option>
              <option value="track-3">Track 3: Web3 & Blockchain</option>
            </select>
          </div>

          <Badge tone="judge">VÒNG CHUNG KẾT 2026</Badge>
        </div>

        {/* Results Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-judge)]" />
          </div>
        ) : publishedResults.length === 0 ? (
          <Card className="w-full p-16 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)] text-center space-y-3">
            <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
            <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest uppercase">
              Chưa có kết quả chính thức được công bố cho Vòng thi này
            </p>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              * Ban Tổ Chức và Event Coordinator đang hoàn thiện bảng điểm hiệu chuẩn. Vui lòng quay lại sau!
            </p>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>HẠNG</TableHead>
                <TableHead>TÊN ĐỘI THI</TableHead>
                <TableHead>HẠNG MỤC (TRACK)</TableHead>
                <TableHead>ĐIỂM TỔNG</TableHead>
                <TableHead>GIẢI THƯỞNG CHI TIẾT</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {publishedResults.map((item, idx) => {
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
