"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Badge } from "@/components/ui";
import {
  Calendar,
  UploadCloud,
  FileCheck,
  Scale,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";

export interface RoundTimelineValues {
  startDate: string;
  endDate: string;
  scoringStartDate?: string;
  scoringEndDate?: string;
  appealStartDate?: string;
  appealEndDate?: string;
}

interface RoundTimelinePickerProps {
  values: RoundTimelineValues;
  onChange: (field: keyof RoundTimelineValues, value: string) => void;
  title?: string;
  defaultAnchorDate?: string;
}

// Helper formatting date to YYYY-MM-DDTHH:mm
const toDateTimeLocal = (val?: string, defaultTime = "08:00") => {
  if (!val) return "";
  if (val.includes("T")) {
    const parts = val.split("T");
    const datePart = parts[0];
    const timePart = parts[1]?.substring(0, 5) || defaultTime;
    return `${datePart}T${timePart}`;
  }
  return `${val}T${defaultTime}`;
};

// Helper add days to a date string
const addDaysToDate = (baseDateStr: string, days: number, defaultTime = "23:59") => {
  if (!baseDateStr) return "";
  const d = new Date(baseDateStr);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  const datePart = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return `${datePart}T${defaultTime}`;
};

// Helper calculate days between two dates
const getDaysBetween = (startStr?: string, endStr?: string) => {
  if (!startStr || !endStr) return 0;
  const s = new Date(startStr);
  const e = new Date(endStr);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
  const diff = e.getTime() - s.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
};

export const RoundTimelinePicker: React.FC<RoundTimelinePickerProps> = ({
  values,
  onChange,
  title = "Mốc thời gian của vòng thi",
  defaultAnchorDate,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasAppeal, setHasAppeal] = useState(Boolean(values.appealStartDate && values.appealEndDate));

  // Local state for durations in days
  const [anchorDate, setAnchorDate] = useState<string>(() => {
    return values.startDate || defaultAnchorDate || toDateTimeLocal(new Date().toISOString(), "08:00");
  });

  const [subDays, setSubDays] = useState<number>(() => {
    const d = getDaysBetween(values.startDate, values.endDate);
    return d > 0 ? d : 14;
  });

  const [scoreDays, setScoreDays] = useState<number>(() => {
    const d = getDaysBetween(values.scoringStartDate || values.endDate, values.scoringEndDate);
    return d > 0 ? d : 7;
  });

  const [appealDays, setAppealDays] = useState<number>(() => {
    const d = getDaysBetween(values.appealStartDate, values.appealEndDate);
    return d > 0 ? d : 3;
  });

  // Recompute and apply all 6 timestamps automatically from Duration
  const applyDurationChanges = (
    newAnchor: string,
    newSub: number,
    newScore: number,
    newAppeal: number,
    enableAppeal: boolean
  ) => {
    if (!newAnchor) return;
    const start = toDateTimeLocal(newAnchor, "08:00");
    const end = addDaysToDate(start, Math.max(1, newSub), "23:59");
    const scoreStart = toDateTimeLocal(end, "08:00");
    const scoreEnd = addDaysToDate(scoreStart, Math.max(1, newScore), "23:59");

    onChange("startDate", start);
    onChange("endDate", end);
    onChange("scoringStartDate", scoreStart);
    onChange("scoringEndDate", scoreEnd);

    if (enableAppeal && newAppeal > 0) {
      const appealStart = toDateTimeLocal(scoreEnd, "08:00");
      const appealEnd = addDaysToDate(appealStart, Math.max(1, newAppeal), "23:59");
      onChange("appealStartDate", appealStart);
      onChange("appealEndDate", appealEnd);
    } else {
      onChange("appealStartDate", "");
      onChange("appealEndDate", "");
    }
  };

  // Presets
  const applyPreset = (presetType: "hackathon" | "sprint" | "capstone" | "finals") => {
    let sDays = 14;
    let scDays = 7;
    let apDays = 3;
    let withAppeal = true;

    if (presetType === "sprint") {
      sDays = 2;
      scDays = 1;
      apDays = 0;
      withAppeal = false;
    } else if (presetType === "capstone") {
      sDays = 30;
      scDays = 14;
      apDays = 7;
      withAppeal = true;
    } else if (presetType === "finals") {
      sDays = 5;
      scDays = 2;
      apDays = 0;
      withAppeal = false;
    }

    setSubDays(sDays);
    setScoreDays(scDays);
    setAppealDays(apDays);
    setHasAppeal(withAppeal);
    applyDurationChanges(anchorDate, sDays, scDays, apDays, withAppeal);
  };

  // Validation Warnings
  let warningMessage: string | null = null;
  if (values.startDate && values.endDate && values.startDate > values.endDate) {
    warningMessage = "Ngày mở nộp bài phải diễn ra trước hạn chót nộp bài!";
  } else if (values.endDate && values.scoringStartDate && values.scoringStartDate < values.endDate) {
    warningMessage = "Ngày bắt đầu chấm điểm nên diễn ra từ lúc hạn chót nộp bài!";
  } else if (values.scoringStartDate && values.scoringEndDate && values.scoringStartDate > values.scoringEndDate) {
    warningMessage = "Ngày kết thúc chấm điểm phải diễn ra sau ngày bắt đầu chấm!";
  } else if (values.appealStartDate && values.appealEndDate && values.appealStartDate > values.appealEndDate) {
    warningMessage = "Ngày đóng phúc khảo phải diễn ra sau ngày mở phúc khảo!";
  }

  const totalDays = subDays + scoreDays + (hasAppeal ? appealDays : 0);
  const subPercent = totalDays > 0 ? Math.round((subDays / totalDays) * 100) : 50;
  const scorePercent = totalDays > 0 ? Math.round((scoreDays / totalDays) * 100) : 30;
  const appealPercent = totalDays > 0 && hasAppeal ? 100 - subPercent - scorePercent : 0;

  return (
    <div className="p-5 bg-[var(--bg-base)] border border-[var(--border-muted)] hud-clipped space-y-6">
      {/* Top Header & Preset Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-coordinator)]/10 border border-[var(--accent-coordinator)]/30 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[var(--accent-coordinator)]" />
            </div>
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
              {title}
            </h4>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">
            Nhập nhanh theo thời lượng giai đoạn (ngày) từ mốc neo. Hệ thống tự tính toán mốc ngày chuẩn 100%.
          </p>
        </div>

        {/* 1-Click Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-amber-400" /> Mẫu:
          </span>
          <button
            type="button"
            onClick={() => applyPreset("hackathon")}
            className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded font-bold transition-all cursor-pointer"
          >
            🚀 Hackathon 4T
          </button>
          <button
            type="button"
            onClick={() => applyPreset("sprint")}
            className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 rounded font-bold transition-all cursor-pointer"
          >
            ⚡ Sprint 48h
          </button>
          <button
            type="button"
            onClick={() => applyPreset("capstone")}
            className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 rounded font-bold transition-all cursor-pointer"
          >
            🎓 Học kỳ 8T
          </button>
          <button
            type="button"
            onClick={() => applyPreset("finals")}
            className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 rounded font-bold transition-all cursor-pointer"
          >
            🏆 Chung kết 1T
          </button>
        </div>
      </div>

      {/* 📊 Visual Timeline Gantt Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Tổng thời gian vòng:{" "}
            <strong className="text-[var(--text-primary)]">{totalDays} ngày</strong>
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            Bắt đầu: {values.startDate ? new Date(values.startDate).toLocaleDateString("vi-VN") : "Chưa đặt"} ──▶ Kết thúc: {values.scoringEndDate ? new Date(values.scoringEndDate).toLocaleDateString("vi-VN") : "Chưa đặt"}
          </span>
        </div>

        <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex border border-[var(--border-muted)]">
          <div
            style={{ width: `${subPercent}%` }}
            className="bg-amber-500 hover:bg-amber-400 transition-all flex items-center justify-center text-[9px] font-black text-black font-mono truncate px-1"
            title={`Nộp bài: ${subDays} ngày (${subPercent}%)`}
          >
            Nộp: {subDays}d
          </div>
          <div
            style={{ width: `${scorePercent}%` }}
            className="bg-cyan-500 hover:bg-cyan-400 transition-all flex items-center justify-center text-[9px] font-black text-black font-mono truncate px-1"
            title={`Chấm điểm: ${scoreDays} ngày (${scorePercent}%)`}
          >
            Chấm: {scoreDays}d
          </div>
          {hasAppeal && appealPercent > 0 && (
            <div
              style={{ width: `${appealPercent}%` }}
              className="bg-purple-500 hover:bg-purple-400 transition-all flex items-center justify-center text-[9px] font-black text-black font-mono truncate px-1"
              title={`Phúc khảo: ${appealDays} ngày (${appealPercent}%)`}
            >
              PK: {appealDays}d
            </div>
          )}
        </div>
      </div>

      {/* 🥇 Duration-Based Input Form */}
      <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Mốc Neo */}
          <div className="space-y-1">
            <label className="text-[10px] text-cyan-400 font-bold uppercase block">
              📍 1. Mốc Neo (Mở Nộp Bài) *
            </label>
            <Input
              type="datetime-local"
              value={toDateTimeLocal(anchorDate, "08:00")}
              onChange={(e) => {
                const val = e.target.value;
                setAnchorDate(val);
                applyDurationChanges(val, subDays, scoreDays, appealDays, hasAppeal);
              }}
              className="font-mono text-xs border-cyan-500/40 bg-[var(--bg-input)]"
            />
          </div>

          {/* Thời lượng Nộp Bài */}
          <div className="space-y-1">
            <label className="text-[10px] text-amber-400 font-bold uppercase flex items-center justify-between">
              <span>⏱️ 2. Nộp Bài (Ngày) *</span>
              <span className="text-[9px] font-normal text-[var(--text-muted)]">
                → {values.endDate ? new Date(values.endDate).toLocaleDateString("vi-VN") : ""}
              </span>
            </label>
            <Input
              type="number"
              min={1}
              max={180}
              value={subDays}
              onChange={(e) => {
                const val = Number(e.target.value) || 1;
                setSubDays(val);
                applyDurationChanges(anchorDate, val, scoreDays, appealDays, hasAppeal);
              }}
              className="font-mono text-xs font-bold text-center border-amber-500/40 bg-[var(--bg-input)] text-amber-300"
            />
          </div>

          {/* Thời lượng Chấm Điểm */}
          <div className="space-y-1">
            <label className="text-[10px] text-cyan-400 font-bold uppercase flex items-center justify-between">
              <span>⚖️ 3. Chấm Điểm (Ngày) *</span>
              <span className="text-[9px] font-normal text-[var(--text-muted)]">
                → {values.scoringEndDate ? new Date(values.scoringEndDate).toLocaleDateString("vi-VN") : ""}
              </span>
            </label>
            <Input
              type="number"
              min={1}
              max={60}
              value={scoreDays}
              onChange={(e) => {
                const val = Number(e.target.value) || 1;
                setScoreDays(val);
                applyDurationChanges(anchorDate, subDays, val, appealDays, hasAppeal);
              }}
              className="font-mono text-xs font-bold text-center border-cyan-500/40 bg-[var(--bg-input)] text-cyan-300"
            />
          </div>

          {/* Thời lượng Phúc Khảo */}
          <div className="space-y-1">
            <label className="text-[10px] text-purple-400 font-bold uppercase flex items-center justify-between">
              <span className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id={`appeal-toggle-${title}`}
                  checked={hasAppeal}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasAppeal(checked);
                    applyDurationChanges(anchorDate, subDays, scoreDays, appealDays, checked);
                  }}
                  className="rounded cursor-pointer"
                />
                <label htmlFor={`appeal-toggle-${title}`} className="cursor-pointer">
                  4. Phúc Khảo (Ngày)
                </label>
              </span>
              {hasAppeal && (
                <span className="text-[9px] font-normal text-[var(--text-muted)]">
                  → {values.appealEndDate ? new Date(values.appealEndDate).toLocaleDateString("vi-VN") : ""}
                </span>
              )}
            </label>
            <Input
              type="number"
              min={0}
              max={30}
              disabled={!hasAppeal}
              value={hasAppeal ? appealDays : 0}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setAppealDays(val);
                applyDurationChanges(anchorDate, subDays, scoreDays, val, hasAppeal);
              }}
              className={`font-mono text-xs font-bold text-center border-purple-500/40 bg-[var(--bg-input)] text-purple-300 ${
                !hasAppeal ? "opacity-30 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* 🔧 Toggle Advanced Exact Datetime Mode */}
      <div className="border-t border-[var(--border-muted)] pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="font-mono text-xs text-[var(--text-muted)] hover:text-cyan-400 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? "▼ Thu gọn chế độ ngày giờ nâng cao" : "▶ ⚙️ Tùy chỉnh ngày & giờ chi tiết (Nâng cao)"}</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-black/30 border border-slate-700/60 rounded-lg animate-fadeIn font-mono text-xs">
            {/* Phase 1: Nộp Bài */}
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded space-y-2">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                <UploadCloud className="w-3.5 h-3.5" /> 1. Giai đoạn nộp bài
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)]">Mở nộp bài:</label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.startDate, "08:00")}
                  onChange={(e) => onChange("startDate", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)]">Hạn chót nộp bài:</label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.endDate, "23:59")}
                  onChange={(e) => onChange("endDate", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Phase 2: Chấm Điểm */}
            <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded space-y-2">
              <div className="flex items-center gap-1 text-cyan-400 font-bold text-[11px]">
                <FileCheck className="w-3.5 h-3.5" /> 2. Giai đoạn chấm điểm
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)]">Mở chấm:</label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.scoringStartDate || values.endDate, "08:00")}
                  onChange={(e) => onChange("scoringStartDate", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)]">Khóa chấm:</label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.scoringEndDate, "23:59")}
                  onChange={(e) => onChange("scoringEndDate", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Phase 3: Phúc Khảo */}
            <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded space-y-2">
              <div className="flex items-center gap-1 text-purple-400 font-bold text-[11px]">
                <Scale className="w-3.5 h-3.5" /> 3. Giai đoạn phúc khảo
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)]">Mở phúc khảo:</label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.appealStartDate, "08:00")}
                  onChange={(e) => onChange("appealStartDate", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)]">Đóng phúc khảo:</label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.appealEndDate, "23:59")}
                  onChange={(e) => onChange("appealEndDate", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Status Footer */}
      {warningMessage ? (
        <div className="px-3 py-2 bg-[rgba(245,158,11,0.1)] border border-[var(--color-warning)] text-[var(--color-warning)] font-mono text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      ) : (
        values.startDate && values.endDate && values.scoringEndDate && (
          <div className="px-3 py-1.5 bg-[rgba(16,185,129,0.08)] border border-[var(--color-success)]/40 text-[var(--color-success)] font-mono text-[11px] rounded flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[var(--color-success)]" />
            <span>Mốc thời gian hợp lệ — Đã sẵn sàng cho giai đoạn chấm và thăng vòng!</span>
          </div>
        )
      )}
    </div>
  );
};
