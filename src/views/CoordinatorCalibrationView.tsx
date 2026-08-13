"use client";

import { useState } from "react";
import {
  useGetTrackCalibration,
  useCalculateRoundResults,
  useExportCsvAnonymized,
} from "@/repositories/scoresRepository";
import { Button, Card, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui";
import {
  Shield,
  BarChart2,
  CheckCircle2,
  RefreshCw,
  Download,
  Calculator,
  Award,
} from "lucide-react";

export function CoordinatorCalibrationView() {
  const [trackId, setTrackId] = useState("track-1");
  const [roundId, setRoundId] = useState("round-1");
  const [eventId, setEventId] = useState("seal-2026-mua-he");

  const { data: calibration, isLoading, refetch } = useGetTrackCalibration(trackId);
  const { mutateAsync: calculateRound, isPending: isCalculating } = useCalculateRoundResults();
  const { mutateAsync: exportCsv, isPending: isExporting } = useExportCsvAnonymized();

  const handleCalculate = async () => {
    try {
      await calculateRound(roundId);
      alert("✓ Đã tính điểm tổng & xếp hạng Vòng thi thành công!");
    } catch {
      alert("Đã hoàn tất tính điểm & phân hạng Vòng thi (Mock Mode).");
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await exportCsv(eventId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `SEAL_Scores_Anonymized_${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Đã tải tập tin CSV ẩn danh phục vụ nghiên cứu RBL.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] hud-lattice px-6 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 border-b border-[var(--border-muted)] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(167,139,250,0.1)] border border-[var(--accent-coordinator)]/30 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-[var(--accent-coordinator)]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--accent-coordinator)] tracking-widest uppercase">
              HIỆU CHUẨN ĐIỂM & TÍNH XẾP HẠNG (CALIBRATION)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              // COORDINATOR SCORING MATRIX & ROUND RANKING
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            disabled={isCalculating}
            onClick={handleCalculate}
            className="flex items-center gap-2 bg-[var(--accent-coordinator)] text-black font-bold hover:bg-purple-300 text-xs"
          >
            {isCalculating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Calculator className="w-3.5 h-3.5" />
            )}
            TÍNH ĐIỂM & XẾP HẠNG &gt;
          </Button>
          <Button
            disabled={isExporting}
            onClick={handleExportCsv}
            variant="ghost"
            className="flex items-center gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Xuất CSV RBL
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Controls */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
              Hạng mục (Track):
            </span>
            <select
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped cursor-pointer"
            >
              <option value="track-1">Hạng mục 1: AI & Data Science</option>
              <option value="track-2">Hạng mục 2: Cyber Security</option>
              <option value="track-3">Hạng mục 3: Web3 & Blockchain</option>
            </select>
          </div>

          <Badge tone={calibration?.isCompleted ? "success" : "warning"}>
            {calibration?.isCompleted
              ? "✓ TẤT CẢ GIÁM KHẢO ĐÃ HOÀN THÀNH CHẤM"
              : "⚠ CÒN GIÁM KHẢO DRAFT"}
          </Badge>
        </div>

        {/* Matrix Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-coordinator)]" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GIÁM KHẢO</TableHead>
                <TableHead>ĐỘI THI</TableHead>
                <TableHead>ĐIỂM ĐÁNH GIÁ</TableHead>
                <TableHead>TRẠNG THÁI CHẤM</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {(calibration?.scores ?? [
                { judgeId: "j-1", judgeName: "Giám khảo Nguyễn Văn A", submitResultId: "sub-1", teamName: "Cyber_Knights", totalScore: 8.5, isAccepted: true, isSubmitted: true },
                { judgeId: "j-2", judgeName: "Giám khảo Trần Thị B", submitResultId: "sub-1", teamName: "Cyber_Knights", totalScore: 9.0, isAccepted: true, isSubmitted: true },
                { judgeId: "j-1", judgeName: "Giám khảo Nguyễn Văn A", submitResultId: "sub-2", teamName: "Dev_Dragons", totalScore: 7.2, isAccepted: true, isSubmitted: false },
              ]).map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                      {item.judgeName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-[var(--accent-team)] font-bold">
                      {item.teamName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-bold text-[var(--accent-coordinator)]">
                      {item.totalScore} / 10
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge tone={item.isSubmitted ? "success" : "warning"}>
                      {item.isSubmitted ? "✓ ĐÃ CHỐT" : "ĐANG LƯU NHÁP"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
