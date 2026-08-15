"use client";

import React, { useState, useEffect } from "react";
import {
  useGetTrackCalibration,
  useCalculateRoundResults,
  useExportCsvAnonymized,
} from "@/repositories/scoresRepository";
import { useMyEvents } from "@/repositories/eventsRepository";
import { useGetRoundsByEvent } from "@/repositories/roundsRepository";
import { useGetTracksByEvent } from "@/repositories/tracksRepository";
import { useGetCriterias, templatesRepository } from "@/repositories/templatesRepository";
import { Button, Card, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui";
import {
  Shield,
  BarChart2,
  CheckCircle2,
  RefreshCw,
  Download,
  Calculator,
  Award,
  Filter,
  Layers,
  Target,
} from "lucide-react";

export function CoordinatorCalibrationView() {
  const [activeTab, setActiveTab] = useState<"calibration" | "criteria">("criteria");

  const { data: myEvents = [] } = useMyEvents();
  const [eventId, setEventId] = useState<string>("");

  useEffect(() => {
    if (myEvents.length > 0 && !eventId) {
      const firstId = myEvents[0].id || myEvents[0].Id || myEvents[0].eventId || myEvents[0].EventId || "";
      setEventId(firstId);
    }
  }, [myEvents, eventId]);

  const { data: rounds = [] } = useGetRoundsByEvent(eventId || undefined);
  const [roundId, setRoundId] = useState<string>("");

  useEffect(() => {
    if (rounds.length > 0) {
      const firstRoundId = (rounds[0] as any).id || (rounds[0] as any).Id || (rounds[0] as any).roundId || "";
      setRoundId(firstRoundId);
    } else {
      setRoundId("");
    }
  }, [rounds]);

  const { data: tracks = [] } = useGetTracksByEvent(eventId || undefined);
  const [trackId, setTrackId] = useState<string>("");

  useEffect(() => {
    if (tracks.length > 0) {
      const firstTrackId = (tracks[0] as any).id || (tracks[0] as any).Id || (tracks[0] as any).trackId || "";
      setTrackId(firstTrackId);
    } else {
      setTrackId("");
    }
  }, [tracks]);

  const { data: serverCriterias = [], refetch: refetchCriterias } = useGetCriterias();
  const { data: calibration, isLoading, refetch: refetchCalibration } = useGetTrackCalibration(trackId || undefined);
  const { mutateAsync: calculateRound, isPending: isCalculating } = useCalculateRoundResults();
  const { mutateAsync: exportCsv, isPending: isExporting } = useExportCsvAnonymized();

  const [newCriteriaName, setNewCriteriaName] = useState("");
  const [newMaxScore, setNewMaxScore] = useState(10);
  const [newWeight, setNewWeight] = useState(20);
  const [newDesc, setNewDesc] = useState("");

  const handleAddCriteria = async () => {
    if (!newCriteriaName.trim()) {
      alert("Vui lòng nhập tên tiêu chí chấm điểm!");
      return;
    }
    try {
      await templatesRepository.createCriteria({
        criterionName: newCriteriaName.trim(),
        description: newDesc.trim(),
        maxScore: Number(newMaxScore),
      });
      setNewCriteriaName("");
      setNewDesc("");
      await refetchCriterias();
      alert("✓ Đã thêm tiêu chí mới vào Kho Tiêu Chí Chấm Điểm!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Tạo tiêu chí thất bại.");
    }
  };

  const handleCalculate = async () => {
    if (!roundId) {
      alert("Vui lòng chọn Vòng thi để tính điểm!");
      return;
    }
    try {
      await calculateRound(roundId);
      alert("✓ Đã tính điểm tổng & xếp hạng Vòng thi thành công!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Tính điểm & xếp hạng thất bại. Vui lòng kiểm tra lại dữ liệu bài nộp.");
    }
  };

  const handleExportCsv = async () => {
    if (!eventId) {
      alert("Vui lòng chọn Sự kiện để xuất báo cáo!");
      return;
    }
    try {
      const blob = await exportCsv(eventId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `SEAL_Scores_Anonymized_${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Xuất file CSV thất bại.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] hud-lattice px-6 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6 border-b border-[var(--border-muted)] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(167,139,250,0.1)] border border-[var(--accent-coordinator)]/30 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-[var(--accent-coordinator)]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--accent-coordinator)] tracking-widest uppercase">
              QUẢN LÝ TIÊU CHÍ & HIỆU CHUẨN ĐIỂM (RUBRIC CENTER)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              // BAN TỔ CHỨC: KHO TIÊU CHÍ RBL & MA TRẬN ĐIỂM GIÁM KHẢO
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

      {/* Selector Bar: Event, Round, Track */}
      <div className="max-w-5xl mx-auto mb-6 p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
            1. Chọn Sự Kiện:
          </label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full px-2.5 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent-coordinator)]"
          >
            {myEvents.map((ev: any) => {
              const id = ev.id || ev.Id || ev.eventId || ev.EventId;
              const name = ev.eventName || ev.EventName || "Sự kiện";
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
            2. Chọn Vòng Thi:
          </label>
          <select
            value={roundId}
            onChange={(e) => setRoundId(e.target.value)}
            className="w-full px-2.5 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent-coordinator)]"
          >
            {rounds.length === 0 ? (
              <option value="">(Chưa có vòng thi)</option>
            ) : (
              rounds.map((r: any) => {
                const id = r.id || r.Id || r.roundId;
                const name = r.roundName || r.RoundName || `Vòng ${r.roundNumber || 1}`;
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })
            )}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
            3. Chọn Hạng Mục (Track):
          </label>
          <select
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="w-full px-2.5 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent-coordinator)]"
          >
            {tracks.length === 0 ? (
              <option value="">(Chưa có hạng mục)</option>
            ) : (
              tracks.map((t: any) => {
                const id = t.id || t.Id || t.trackId;
                const name = t.trackName || t.TrackName || "Hạng mục";
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })
            )}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-5xl mx-auto mb-6 flex border-b border-[var(--border-muted)] font-mono text-xs">
        <button
          onClick={() => setActiveTab("criteria")}
          className={`px-5 py-3 font-bold border-b-2 transition-all uppercase flex items-center gap-2 ${
            activeTab === "criteria"
              ? "border-[var(--accent-judge)] text-[var(--accent-judge)] bg-[var(--accent-judge)]/10"
              : "border-transparent text-[var(--text-muted)] hover:text-white"
          }`}
        >
          <span>📐 Kho Tiêu Chí Chấm Điểm ({serverCriterias.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("calibration")}
          className={`px-5 py-3 font-bold border-b-2 transition-all uppercase flex items-center gap-2 ${
            activeTab === "calibration"
              ? "border-[var(--accent-coordinator)] text-[var(--accent-coordinator)] bg-[var(--accent-coordinator)]/10"
              : "border-transparent text-[var(--text-muted)] hover:text-white"
          }`}
        >
          <span>📊 Ma Trận Chấm Điểm Giám Khảo</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {activeTab === "criteria" && (
          <div className="space-y-6">
            {/* Form Thêm Tiêu Chí */}
            <Card className="p-6 bg-[var(--bg-panel)] border border-[var(--accent-judge)]/30 hud-clipped space-y-4">
              <h2 className="font-display text-sm font-bold text-[var(--accent-judge)] uppercase tracking-widest flex items-center gap-2">
                <span>➕ THÊM TIÊU CHÍ CHẤM ĐIỂM RBL MỚI</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Tên tiêu chí</label>
                  <input
                    type="text"
                    value={newCriteriaName}
                    onChange={(e) => setNewCriteriaName(e.target.value)}
                    placeholder="VD: Tính Bảo Mật & Mã Hóa Dữ Liệu..."
                    className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-judge)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Điểm tối đa</label>
                    <input
                      type="number"
                      value={newMaxScore}
                      onChange={(e) => setNewMaxScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped text-center font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Trọng số mặc định (%)</label>
                    <input
                      type="number"
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Mô tả tiêu chí RBL</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ghi chú chi tiết cách Giám khảo đánh giá tiêu chí này..."
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-judge)] resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleAddCriteria}
                  className="bg-[var(--accent-judge)] text-black font-bold text-xs hover:bg-yellow-400"
                >
                  ➕ THÊM VÀO KHO TIÊU CHÍ
                </Button>
              </div>
            </Card>

            {/* Danh sách Tiêu Chí Từ Database */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serverCriterias.map((cr: any, idx: number) => {
                const id = cr.id || cr.Id || cr.criteriaId || cr.CriteriaId || `cr-${idx}`;
                const name = cr.criterionName || cr.CriterionName || cr.criteriaName || cr.name || "Tiêu chí";
                const desc = cr.description || cr.Description || "Mô tả tiêu chí";
                const maxScore = cr.maxScore || cr.MaxScore || 10;
                const weight = cr.weight || cr.Weight || 25;

                return (
                  <Card key={id} className="p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-2 hover:border-[var(--accent-judge)]/50 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        {name}
                      </span>
                      <Badge tone="warning">
                        Trọng số: {weight}% | Max: {maxScore}đ
                      </Badge>
                    </div>
                    <p className="font-mono text-[11px] text-[var(--text-muted)] leading-relaxed">
                      {desc}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "calibration" && (
          <div className="space-y-6">
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
                  {tracks.length === 0 ? (
                    <option value="">(Chưa có hạng mục)</option>
                  ) : (
                    tracks.map((t: any) => {
                      const id = t.id || t.Id || t.trackId;
                      const name = t.trackName || t.TrackName || "Hạng mục";
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })
                  )}
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
                    { judgeId: "j-1", judgeName: "Giám khảo TS. Nguyễn Văn A", submitResultId: "sub-1", teamName: "CyberShield_FPT", totalScore: 9.2, isAccepted: true, isSubmitted: true },
                    { judgeId: "j-2", judgeName: "Giám khảo ThS. Trần Thị B", submitResultId: "sub-1", teamName: "CyberShield_FPT", totalScore: 9.5, isAccepted: true, isSubmitted: true },
                    { judgeId: "j-1", judgeName: "Giám khảo TS. Nguyễn Văn A", submitResultId: "sub-2", teamName: "ByteKnights", totalScore: 8.4, isAccepted: true, isSubmitted: true },
                  ]).map((item: any, idx: number) => (
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
                        <span className="font-mono text-xs font-bold text-[var(--accent-judge)]">
                          {item.totalScore} / 10
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge tone={item.isSubmitted ? "success" : "warning"}>
                          {item.isSubmitted ? "ĐÃ CHỐT BẢNG ĐIỂM" : "DRAFT"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
