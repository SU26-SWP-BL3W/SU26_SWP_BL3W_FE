"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import {
  Calendar,
  UploadCloud,
  FileCheck,
  Scale,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Plus,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Sliders,
  Sparkles,
  HelpCircle,
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

export type TimeUnit = "hours" | "days" | "weeks" | "months" | "years";

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  hours: "Giờ",
  days: "Ngày",
  weeks: "Tuần",
  months: "Tháng",
  years: "Năm",
};

// Format date to YYYY-MM-DDTHH:mm
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

// Add duration to date based on unit while preserving time
export const addDurationToDate = (baseStr: string, amount: number, unit: TimeUnit, defaultTime = "23:59"): string => {
  if (!baseStr) return "";
  const d = new Date(baseStr);
  if (isNaN(d.getTime())) return "";

  if (unit === "hours") {
    d.setHours(d.getHours() + amount);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  if (unit === "days") {
    d.setDate(d.getDate() + amount);
  } else if (unit === "weeks") {
    d.setDate(d.getDate() + amount * 7);
  } else if (unit === "months") {
    d.setMonth(d.getMonth() + amount);
  } else if (unit === "years") {
    d.setFullYear(d.getFullYear() + amount);
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const timePart = baseStr.includes("T") ? baseStr.split("T")[1]?.substring(0, 5) || defaultTime : defaultTime;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${timePart}`;
};

// Set specific time (HH:mm) on an existing date string
const setTimeToDateStr = (dateStr?: string, timeStr = "08:00") => {
  const base = dateStr || toDateTimeLocal(new Date().toISOString(), "08:00");
  const datePart = base.split("T")[0];
  return `${datePart}T${timeStr}`;
};

// Add days to date while preserving exact time (HH:mm)
const addDaysPreserveTime = (baseStr?: string, daysToAdd = 1, defaultTime = "23:59") => {
  if (!baseStr) {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${defaultTime}`;
  }
  const parts = baseStr.split("T");
  const d = new Date(parts[0]);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + daysToAdd);
  const pad = (n: number) => String(n).padStart(2, "0");
  const timePart = parts[1]?.substring(0, 5) || defaultTime;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${timePart}`;
};

// Human-readable duration format (e.g. "14 ngày 9 giờ" or "48 giờ")
const formatDetailedDuration = (startStr?: string, endStr?: string) => {
  if (!startStr || !endStr) return null;
  const s = new Date(startStr);
  const e = new Date(endStr);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
  const diffMs = e.getTime() - s.getTime();
  if (diffMs <= 0) return "0 giờ";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const remHours = totalHours % 24;
  const remMinutes = totalMinutes % 60;

  if (days === 0) {
    if (remMinutes > 0) return `${remHours} giờ ${remMinutes}p`;
    return `${remHours} giờ`;
  }
  if (remHours === 0 && remMinutes === 0) return `${days} ngày`;
  if (remMinutes === 0) return `${days} ngày ${remHours}h`;
  return `${days} ngày ${remHours}h ${remMinutes}p`;
};

// Calculate days between two dates for Gantt bar
const getDaysBetween = (startStr?: string, endStr?: string) => {
  if (!startStr || !endStr) return 0;
  const s = new Date(startStr);
  const e = new Date(endStr);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
  const diff = e.getTime() - s.getTime();
  return Math.max(0, Math.round((diff / (1000 * 60 * 60 * 24)) * 10) / 10);
};

export const RoundTimelinePicker: React.FC<RoundTimelinePickerProps> = ({
  values,
  onChange,
  title = "Mốc thời gian của vòng thi",
  defaultAnchorDate,
}) => {
  // Mode: "duration" (default) or "precision"
  const [activeMode, setActiveMode] = useState<"duration" | "precision">("duration");
  const [hasAppeal, setHasAppeal] = useState(Boolean(values.appealStartDate && values.appealEndDate));

  // Duration State
  const [subDuration, setSubDuration] = useState({ amount: 2, unit: "weeks" as TimeUnit });
  const [scoreDuration, setScoreDuration] = useState({ amount: 1, unit: "weeks" as TimeUnit });
  const [appealDuration, setAppealDuration] = useState({ amount: 3, unit: "days" as TimeUnit });

  // Quick Time Chips
  const TIME_CHIPS = [
    { label: "08:00", icon: Sunrise, title: "Sáng (08:00)" },
    { label: "12:00", icon: Sun, title: "Trưa (12:00)" },
    { label: "17:30", icon: Sunset, title: "Chiều (17:30)" },
    { label: "23:59", icon: Moon, title: "Đêm chót (23:59)" },
  ];

  // Auto-initialize anchor date if empty
  useEffect(() => {
    if (!values.startDate) {
      const anchor = defaultAnchorDate || toDateTimeLocal(new Date().toISOString(), "08:00");
      onChange("startDate", anchor);
    }
  }, [defaultAnchorDate, values.startDate]);

  // Recalculate all dates in Duration Mode
  const applyDurationCascade = (
    anchorStart: string,
    sub = subDuration,
    score = scoreDuration,
    appeal = appealDuration,
    enableAppeal = hasAppeal
  ) => {
    if (!anchorStart) return;

    // 1. Submission Phase
    const computedEndDate = addDurationToDate(anchorStart, sub.amount, sub.unit, "23:59");
    onChange("startDate", anchorStart);
    onChange("endDate", computedEndDate);

    // 2. Scoring Phase
    const computedScoreStart = computedEndDate;
    const computedScoreEnd = addDurationToDate(computedScoreStart, score.amount, score.unit, "23:59");
    onChange("scoringStartDate", computedScoreStart);
    onChange("scoringEndDate", computedScoreEnd);

    // 3. Appeal Phase
    if (enableAppeal) {
      const computedAppealStart = computedScoreEnd;
      const computedAppealEnd = addDurationToDate(computedAppealStart, appeal.amount, appeal.unit, "23:59");
      onChange("appealStartDate", computedAppealStart);
      onChange("appealEndDate", computedAppealEnd);
    } else {
      onChange("appealStartDate", "");
      onChange("appealEndDate", "");
    }
  };

  // 1-Click Presets
  const applyPreset = (type: "hackathon" | "sprint" | "semester" | "finals") => {
    const anchor = values.startDate || defaultAnchorDate || toDateTimeLocal(new Date().toISOString(), "08:00");
    if (type === "hackathon") {
      const sub = { amount: 2, unit: "weeks" as TimeUnit };
      const score = { amount: 1, unit: "weeks" as TimeUnit };
      const appeal = { amount: 3, unit: "days" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(true);
      applyDurationCascade(anchor, sub, score, appeal, true);
    } else if (type === "sprint") {
      const sub = { amount: 48, unit: "hours" as TimeUnit };
      const score = { amount: 24, unit: "hours" as TimeUnit };
      const appeal = { amount: 0, unit: "days" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(false);
      applyDurationCascade(anchor, sub, score, appeal, false);
    } else if (type === "semester") {
      const sub = { amount: 4, unit: "weeks" as TimeUnit };
      const score = { amount: 2, unit: "weeks" as TimeUnit };
      const appeal = { amount: 1, unit: "weeks" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(true);
      applyDurationCascade(anchor, sub, score, appeal, true);
    } else if (type === "finals") {
      const sub = { amount: 1, unit: "weeks" as TimeUnit };
      const score = { amount: 3, unit: "days" as TimeUnit };
      const appeal = { amount: 2, unit: "days" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(true);
      applyDurationCascade(anchor, sub, score, appeal, true);
    }
  };

  // Duration metrics for Gantt bar
  const subDays = getDaysBetween(values.startDate, values.endDate);
  const scoreDays = getDaysBetween(values.scoringStartDate, values.scoringEndDate);
  const appealDays = hasAppeal ? getDaysBetween(values.appealStartDate, values.appealEndDate) : 0;
  const totalDays = Math.max(1, subDays + scoreDays + appealDays);

  const subPct = Math.round((subDays / totalDays) * 100);
  const scorePct = Math.round((scoreDays / totalDays) * 100);
  const appealPct = 100 - subPct - scorePct;

  return (
    <div className="space-y-4">
      {/* Header & Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-panel)] p-3 border border-[var(--border-muted)] rounded-lg">
        <div>
          <h4 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--accent-coordinator)]" />
            {title}
          </h4>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            {activeMode === "duration"
              ? "⚡ Nhập lịch bằng số ngày/tuần/tháng — Hệ thống tự tính toàn bộ mốc liên hoàn."
              : "📅 Tinh chỉnh trực tiếp ngày giờ từng mốc chi tiết đến từng phút."}
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-[var(--bg-base)] p-1 rounded-lg border border-[var(--border-muted)] font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveMode("duration")}
            className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === "duration"
                ? "bg-[var(--accent-coordinator)] text-black shadow-md"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Nhập Thời Lượng
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("precision")}
            className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === "precision"
                ? "bg-[var(--accent-coordinator)] text-black shadow-md"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Tinh Chỉnh Chi Tiết
          </button>
        </div>
      </div>

      {/* 1-Click Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[var(--text-muted)] text-[10px] uppercase font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Mẫu Nhanh:
        </span>
        <button
          type="button"
          onClick={() => applyPreset("hackathon")}
          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded text-[11px] font-bold cursor-pointer transition-all hover:scale-[1.02]"
        >
          🚀 Hackathon 4T
        </button>
        <button
          type="button"
          onClick={() => applyPreset("sprint")}
          className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 rounded text-[11px] font-bold cursor-pointer transition-all hover:scale-[1.02]"
        >
          ⚡ Sprint 48h
        </button>
        <button
          type="button"
          onClick={() => applyPreset("semester")}
          className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 rounded text-[11px] font-bold cursor-pointer transition-all hover:scale-[1.02]"
        >
          🎓 Học kỳ 8T
        </button>
        <button
          type="button"
          onClick={() => applyPreset("finals")}
          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded text-[11px] font-bold cursor-pointer transition-all hover:scale-[1.02]"
        >
          🏆 Chung kết 1T
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODE 1: DURATION BUILDER (Số + Đơn Vị Giờ/Ngày/Tuần/Tháng/Năm)
      ───────────────────────────────────────────────────────────── */}
      {activeMode === "duration" && (
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] rounded-lg space-y-4 font-mono text-xs">
          {/* Anchor Date Input */}
          <div className="p-3 bg-[var(--bg-base)] border border-cyan-500/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-[11px] font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Mốc Neo — Thời Gian Mở Cổng Nộp Bài (Ngày Tuyệt Đối Duy Nhất) *
              </label>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                Mọi giai đoạn tiếp theo sẽ tự động tính toán nối tiếp từ mốc neo này.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <Input
                type="datetime-local"
                value={toDateTimeLocal(values.startDate)}
                onChange={(e) => {
                  const newAnchor = e.target.value;
                  applyDurationCascade(newAnchor);
                }}
                className="bg-black/60 border-cyan-500/50 text-cyan-300 text-xs font-bold"
              />
            </div>
          </div>

          {/* 3 Duration Control Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Submission Duration */}
            <div className="p-3.5 bg-[var(--bg-base)] border border-amber-500/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase flex items-center gap-1">
                  <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                  1. Nộp Bài
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {formatDetailedDuration(values.startDate, values.endDate) || "Chưa tính"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={subDuration.amount}
                  onChange={(e) => {
                    const newSub = { ...subDuration, amount: Math.max(1, Number(e.target.value)) };
                    setSubDuration(newSub);
                    applyDurationCascade(values.startDate, newSub);
                  }}
                  className="w-20 px-2.5 py-1.5 bg-black/60 border border-amber-500/40 text-amber-300 rounded font-bold text-xs text-center"
                />
                <select
                  value={subDuration.unit}
                  onChange={(e) => {
                    const newSub = { ...subDuration, unit: e.target.value as TimeUnit };
                    setSubDuration(newSub);
                    applyDurationCascade(values.startDate, newSub);
                  }}
                  className="flex-1 px-2.5 py-1.5 bg-black/60 border border-amber-500/40 text-amber-300 rounded text-xs cursor-pointer"
                >
                  <option value="hours">Giờ</option>
                  <option value="days">Ngày</option>
                  <option value="weeks">Tuần</option>
                  <option value="months">Tháng</option>
                  <option value="years">Năm</option>
                </select>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block truncate">
                Hạn chót: {values.endDate ? new Date(values.endDate).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "---"}
              </span>
            </div>

            {/* 2. Scoring Duration */}
            <div className="p-3.5 bg-[var(--bg-base)] border border-cyan-500/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-300 uppercase flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  2. Chấm Điểm
                </span>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  {formatDetailedDuration(values.scoringStartDate, values.scoringEndDate) || "Chưa tính"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={scoreDuration.amount}
                  onChange={(e) => {
                    const newScore = { ...scoreDuration, amount: Math.max(1, Number(e.target.value)) };
                    setScoreDuration(newScore);
                    applyDurationCascade(values.startDate, subDuration, newScore);
                  }}
                  className="w-20 px-2.5 py-1.5 bg-black/60 border border-cyan-500/40 text-cyan-300 rounded font-bold text-xs text-center"
                />
                <select
                  value={scoreDuration.unit}
                  onChange={(e) => {
                    const newScore = { ...scoreDuration, unit: e.target.value as TimeUnit };
                    setScoreDuration(newScore);
                    applyDurationCascade(values.startDate, subDuration, newScore);
                  }}
                  className="flex-1 px-2.5 py-1.5 bg-black/60 border border-cyan-500/40 text-cyan-300 rounded text-xs cursor-pointer"
                >
                  <option value="hours">Giờ</option>
                  <option value="days">Ngày</option>
                  <option value="weeks">Tuần</option>
                  <option value="months">Tháng</option>
                  <option value="years">Năm</option>
                </select>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block truncate">
                Khóa chấm: {values.scoringEndDate ? new Date(values.scoringEndDate).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "---"}
              </span>
            </div>

            {/* 3. Appeal Duration */}
            <div className={`p-3.5 bg-[var(--bg-base)] border rounded-lg space-y-2 transition-all ${
              hasAppeal ? "border-purple-500/30" : "border-slate-800 opacity-60"
            }`}>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-purple-300 uppercase flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAppeal}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setHasAppeal(enabled);
                      applyDurationCascade(values.startDate, subDuration, scoreDuration, appealDuration, enabled);
                    }}
                    className="accent-purple-400 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>3. Phúc Khảo</span>
                </label>
                {hasAppeal && (
                  <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                    {formatDetailedDuration(values.appealStartDate, values.appealEndDate) || "Chưa tính"}
                  </span>
                )}
              </div>

              {hasAppeal ? (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={appealDuration.amount}
                      onChange={(e) => {
                        const newAppeal = { ...appealDuration, amount: Math.max(1, Number(e.target.value)) };
                        setAppealDuration(newAppeal);
                        applyDurationCascade(values.startDate, subDuration, scoreDuration, newAppeal, true);
                      }}
                      className="w-20 px-2.5 py-1.5 bg-black/60 border border-purple-500/40 text-purple-300 rounded font-bold text-xs text-center"
                    />
                    <select
                      value={appealDuration.unit}
                      onChange={(e) => {
                        const newAppeal = { ...appealDuration, unit: e.target.value as TimeUnit };
                        setAppealDuration(newAppeal);
                        applyDurationCascade(values.startDate, subDuration, scoreDuration, newAppeal, true);
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-black/60 border border-purple-500/40 text-purple-300 rounded text-xs cursor-pointer"
                    >
                      <option value="hours">Giờ</option>
                      <option value="days">Ngày</option>
                      <option value="weeks">Tuần</option>
                      <option value="months">Tháng</option>
                      <option value="years">Năm</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] block truncate">
                    Hết phúc khảo: {values.appealEndDate ? new Date(values.appealEndDate).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "---"}
                  </span>
                </>
              ) : (
                <p className="text-[10px] text-[var(--text-muted)] py-2 text-center">
                  ☐ Đã bỏ qua giai đoạn phúc khảo
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE 2: PRECISION MANUAL MODE (Chỉnh Từng Mốc DateTime Chi Tiết)
      ───────────────────────────────────────────────────────────── */}
      {activeMode === "precision" && (
        <div className="space-y-4">
          {/* Phase 1: Submission */}
          <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-amber-300 uppercase">
                  1. Giai Đoạn Nộp Bài (Submission Phase)
                </span>
              </div>
              {values.startDate && values.endDate && (
                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] rounded font-bold">
                  ⏳ Thời lượng: {formatDetailedDuration(values.startDate, values.endDate)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Mở Cổng Nộp Bài (Bắt Đầu Vòng) *
                </label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.startDate)}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("startDate", val);
                    if (!values.endDate && val) {
                      onChange("endDate", addDaysPreserveTime(val, 14, "23:59"));
                    }
                  }}
                  required
                />
                <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => onChange("startDate", setTimeToDateStr(values.startDate, t.label))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 rounded text-amber-300 cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Hạn Chót Nộp Bài *
                  </label>
                  <div className="flex items-center gap-1 text-[9px]">
                    <button
                      type="button"
                      onClick={() => onChange("endDate", addDaysPreserveTime(values.endDate || values.startDate, 1))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 rounded text-amber-300 cursor-pointer"
                    >
                      +1d
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange("endDate", addDaysPreserveTime(values.endDate || values.startDate, 7))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 rounded text-amber-300 cursor-pointer"
                    >
                      +7d
                    </button>
                  </div>
                </div>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.endDate, "23:59")}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("endDate", val);
                    if (!values.scoringStartDate && val) {
                      onChange("scoringStartDate", val);
                    }
                  }}
                  required
                />
                <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => onChange("endDate", setTimeToDateStr(values.endDate, t.label))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 rounded text-amber-300 cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Scoring */}
          <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-cyan-300 uppercase">
                  2. Giai Đoạn Chấm Điểm (Scoring Phase)
                </span>
              </div>
              {values.scoringStartDate && values.scoringEndDate && (
                <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] rounded font-bold">
                  ⏳ Thời lượng: {formatDetailedDuration(values.scoringStartDate, values.scoringEndDate)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Bắt Đầu Mở Cổng Chấm
                </label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.scoringStartDate, "08:00")}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("scoringStartDate", val);
                    if (!values.scoringEndDate && val) {
                      onChange("scoringEndDate", addDaysPreserveTime(val, 7, "23:59"));
                    }
                  }}
                />
                <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => onChange("scoringStartDate", setTimeToDateStr(values.scoringStartDate, t.label))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/20 rounded text-cyan-300 cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1 font-bold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Hạn Chót Khóa Chấm *
                  </label>
                  <div className="flex items-center gap-1 text-[9px]">
                    <button
                      type="button"
                      onClick={() => onChange("scoringEndDate", addDaysPreserveTime(values.scoringEndDate || values.scoringStartDate, 1))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/20 rounded text-cyan-300 cursor-pointer"
                    >
                      +1d
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange("scoringEndDate", addDaysPreserveTime(values.scoringEndDate || values.scoringStartDate, 7))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/20 rounded text-cyan-300 cursor-pointer"
                    >
                      +7d
                    </button>
                  </div>
                </div>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.scoringEndDate, "23:59")}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("scoringEndDate", val);
                    if (hasAppeal && !values.appealStartDate && val) {
                      onChange("appealStartDate", val);
                    }
                  }}
                  required
                />
                <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => onChange("scoringEndDate", setTimeToDateStr(values.scoringEndDate, t.label))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/20 rounded text-cyan-300 cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3: Appeal (Optional) */}
          <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs font-bold text-purple-300 uppercase">
                <input
                  type="checkbox"
                  checked={hasAppeal}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    setHasAppeal(enabled);
                    if (!enabled) {
                      onChange("appealStartDate", "");
                      onChange("appealEndDate", "");
                    } else if (values.scoringEndDate) {
                      onChange("appealStartDate", values.scoringEndDate);
                      onChange("appealEndDate", addDaysPreserveTime(values.scoringEndDate, 3, "23:59"));
                    }
                  }}
                  className="accent-purple-400 w-3.5 h-3.5 cursor-pointer"
                />
                <Scale className="w-4 h-4 text-purple-400" />
                <span>3. Giai Đoạn Phúc Khảo (Tùy Chọn)</span>
              </label>
              {hasAppeal && values.appealStartDate && values.appealEndDate && (
                <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] rounded font-bold">
                  ⏳ Thời lượng: {formatDetailedDuration(values.appealStartDate, values.appealEndDate)}
                </span>
              )}
            </div>

            {hasAppeal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs pt-1 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Bắt Đầu Mở Cổng Phúc Khảo
                  </label>
                  <Input
                    type="datetime-local"
                    value={toDateTimeLocal(values.appealStartDate, "08:00")}
                    onChange={(e) => onChange("appealStartDate", e.target.value)}
                  />
                  <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                    <span className="text-[var(--text-muted)]">Giờ:</span>
                    {TIME_CHIPS.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => onChange("appealStartDate", setTimeToDateStr(values.appealStartDate, t.label))}
                        className="px-1.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/20 rounded text-purple-300 cursor-pointer"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      Hạn Chót Đóng Phúc Khảo
                    </label>
                    <div className="flex items-center gap-1 text-[9px]">
                      <button
                        type="button"
                        onClick={() => onChange("appealEndDate", addDaysPreserveTime(values.appealEndDate || values.appealStartDate, 1))}
                        className="px-1.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/20 rounded text-purple-300 cursor-pointer"
                      >
                        +1d
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange("appealEndDate", addDaysPreserveTime(values.appealEndDate || values.appealStartDate, 3))}
                        className="px-1.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/20 rounded text-purple-300 cursor-pointer"
                      >
                        +3d
                      </button>
                    </div>
                  </div>
                  <Input
                    type="datetime-local"
                    value={toDateTimeLocal(values.appealEndDate, "23:59")}
                    onChange={(e) => onChange("appealEndDate", e.target.value)}
                  />
                  <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                    <span className="text-[var(--text-muted)]">Giờ:</span>
                    {TIME_CHIPS.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => onChange("appealEndDate", setTimeToDateStr(values.appealEndDate, t.label))}
                        className="px-1.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/20 rounded text-purple-300 cursor-pointer"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Horizontal Timeline Bar (Gantt Overview) */}
      <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded-lg space-y-2 font-mono text-[11px]">
        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span>Sơ Đồ Tiến Trình Vòng Thi:</span>
            <strong className="text-cyan-300">{totalDays} ngày tổng cộng</strong>
          </span>
          <span className="text-[10px] text-slate-400">
            {values.startDate ? new Date(values.startDate).toLocaleDateString("vi-VN") : "---"} ──▶ {values.scoringEndDate ? new Date(values.scoringEndDate).toLocaleDateString("vi-VN") : "---"}
          </span>
        </div>

        {/* Progress Gantt Track */}
        <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden flex border border-slate-700/80">
          <div
            style={{ width: `${subPct}%` }}
            className="h-full bg-amber-500 hover:brightness-110 transition-all cursor-help relative group"
            title={`Nộp bài: ${subDays} ngày (${subPct}%)`}
          />
          <div
            style={{ width: `${scorePct}%` }}
            className="h-full bg-cyan-500 hover:brightness-110 transition-all cursor-help relative group"
            title={`Chấm điểm: ${scoreDays} ngày (${scorePct}%)`}
          />
          {hasAppeal && appealPct > 0 && (
            <div
              style={{ width: `${appealPct}%` }}
              className="h-full bg-purple-500 hover:brightness-110 transition-all cursor-help relative group"
              title={`Phúc khảo: ${appealDays} ngày (${appealPct}%)`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] pt-0.5">
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Nộp bài ({subDays}d)
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> Chấm điểm ({scoreDays}d)
          </span>
          {hasAppeal && (
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Phúc khảo ({appealDays}d)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
