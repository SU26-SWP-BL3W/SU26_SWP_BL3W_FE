"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";

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

export type TimeUnit = "hours" | "days" | "weeks" | "months";

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  hours: "Giờ",
  days: "Ngày",
  weeks: "Tuần",
  months: "Tháng",
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

// Format date to readable Vietnamese with day of week: "Thứ Bảy, 15/08/2026 08:00"
const formatHumanDateTime = (val?: string) => {
  if (!val) return "Chưa thiết lập";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dow = daysOfWeek[d.getDay()];
    const pad = (n: number) => String(n).padStart(2, "0");
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const dateStr = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    return `${dow}, ${dateStr} lúc ${timeStr}`;
  } catch {
    return val;
  }
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

// Add hours directly to date string
const addHoursToDateStr = (baseStr?: string, hoursToAdd = 4) => {
  const base = baseStr || toDateTimeLocal(new Date().toISOString(), "08:00");
  const d = new Date(base);
  if (isNaN(d.getTime())) return "";
  d.setHours(d.getHours() + hoursToAdd);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Human-readable duration format (e.g. "24 giờ" or "32 giờ (1.3 ngày)")
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
    if (remMinutes > 0) return `${remHours}h ${remMinutes}p`;
    return `${remHours} giờ`;
  }
  if (remHours === 0 && remMinutes === 0) return `${days} ngày (${totalHours}h)`;
  if (remMinutes === 0) return `${days} ngày ${remHours}h (${totalHours}h)`;
  return `${days} ngày ${remHours}h ${remMinutes}p (${totalHours}h)`;
};

// Calculate hours between two dates for Gantt bar
const getHoursBetween = (startStr?: string, endStr?: string) => {
  if (!startStr || !endStr) return 0;
  const s = new Date(startStr);
  const e = new Date(endStr);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
  const diff = e.getTime() - s.getTime();
  return Math.max(0, Math.round((diff / (1000 * 60 * 60)) * 10) / 10);
};

export const RoundTimelinePicker: React.FC<RoundTimelinePickerProps> = ({
  values,
  onChange,
  title = "Mốc thời gian vòng thi",
  defaultAnchorDate,
}) => {
  const [activeMode, setActiveMode] = useState<"duration" | "precision">("duration");
  const [hasAppeal, setHasAppeal] = useState(Boolean(values.appealStartDate && values.appealEndDate));

  // Duration State (mặc định theo giờ/ngày cho hackathon 1-2 ngày)
  const [subDuration, setSubDuration] = useState({ amount: 24, unit: "hours" as TimeUnit });
  const [scoreDuration, setScoreDuration] = useState({ amount: 4, unit: "hours" as TimeUnit });
  const [appealDuration, setAppealDuration] = useState({ amount: 1, unit: "hours" as TimeUnit });

  // Quick Time Chips (Không dùng emoji)
  const TIME_CHIPS = ["08:00", "12:00", "13:30", "17:00", "20:00", "23:59"];

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
    const computedEndDate = addDurationToDate(anchorStart, sub.amount, sub.unit, "17:00");
    onChange("startDate", anchorStart);
    onChange("endDate", computedEndDate);

    // 2. Scoring Phase
    const computedScoreStart = computedEndDate;
    const computedScoreEnd = addDurationToDate(computedScoreStart, score.amount, score.unit, "20:00");
    onChange("scoringStartDate", computedScoreStart);
    onChange("scoringEndDate", computedScoreEnd);

    // 3. Appeal Phase
    if (enableAppeal) {
      const computedAppealStart = computedScoreEnd;
      const computedAppealEnd = addDurationToDate(computedAppealStart, appeal.amount, appeal.unit, "21:00");
      onChange("appealStartDate", computedAppealStart);
      onChange("appealEndDate", computedAppealEnd);
    } else {
      onChange("appealStartDate", "");
      onChange("appealEndDate", "");
    }
  };

  // 1-Click Presets Tối Ưu Cho Cuộc Thi Trường (1 - 2 Ngày)
  const applyPreset = (type: "24h" | "36h" | "48h" | "4h") => {
    const anchor = values.startDate || defaultAnchorDate || toDateTimeLocal(new Date().toISOString(), "08:00");
    if (type === "24h") {
      const sub = { amount: 24, unit: "hours" as TimeUnit };
      const score = { amount: 4, unit: "hours" as TimeUnit };
      const appeal = { amount: 1, unit: "hours" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(true);
      applyDurationCascade(anchor, sub, score, appeal, true);
    } else if (type === "36h") {
      const sub = { amount: 32, unit: "hours" as TimeUnit };
      const score = { amount: 3, unit: "hours" as TimeUnit };
      const appeal = { amount: 1, unit: "hours" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(true);
      applyDurationCascade(anchor, sub, score, appeal, true);
    } else if (type === "48h") {
      const sub = { amount: 48, unit: "hours" as TimeUnit };
      const score = { amount: 6, unit: "hours" as TimeUnit };
      const appeal = { amount: 2, unit: "hours" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(true);
      applyDurationCascade(anchor, sub, score, appeal, true);
    } else if (type === "4h") {
      const sub = { amount: 4, unit: "hours" as TimeUnit };
      const score = { amount: 1, unit: "hours" as TimeUnit };
      const appeal = { amount: 30, unit: "hours" as TimeUnit };
      setSubDuration(sub);
      setScoreDuration(score);
      setAppealDuration(appeal);
      setHasAppeal(false);
      applyDurationCascade(anchor, sub, score, appeal, false);
    }
  };

  // Duration metrics for Gantt bar
  const subHours = getHoursBetween(values.startDate, values.endDate);
  const scoreHours = getHoursBetween(values.scoringStartDate, values.scoringEndDate);
  const appealHours = hasAppeal ? getHoursBetween(values.appealStartDate, values.appealEndDate) : 0;
  const totalHours = Math.max(1, subHours + scoreHours + appealHours);

  const subPct = Math.round((subHours / totalHours) * 100);
  const scorePct = Math.round((scoreHours / totalHours) * 100);
  const appealPct = 100 - subPct - scorePct;

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[var(--bg-panel)] p-3 border border-[var(--border-muted)] rounded">
        <div>
          <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
            Bắt đầu: <strong className="text-cyan-300">{formatHumanDateTime(values.startDate)}</strong>
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-[var(--bg-base)] p-0.5 rounded border border-[var(--border-muted)] text-[11px]">
          <button
            type="button"
            onClick={() => setActiveMode("duration")}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              activeMode === "duration"
                ? "bg-[var(--accent-coordinator)] text-black"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Nhập thời lượng
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("precision")}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              activeMode === "precision"
                ? "bg-[var(--accent-coordinator)] text-black"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Tinh chỉnh chi tiết
          </button>
        </div>
      </div>

      {/* 1-Click Presets Tối Giản (Không Icon Rườm Rà) */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Mẫu nhanh:</span>
        <button
          type="button"
          onClick={() => applyPreset("24h")}
          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded font-bold cursor-pointer transition-colors"
        >
          24h (1 Ngày)
        </button>
        <button
          type="button"
          onClick={() => applyPreset("36h")}
          className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded font-bold cursor-pointer transition-colors"
        >
          36h Cuối tuần (Thứ 7 - CN)
        </button>
        <button
          type="button"
          onClick={() => applyPreset("48h")}
          className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded font-bold cursor-pointer transition-colors"
        >
          48h (2 Ngày)
        </button>
        <button
          type="button"
          onClick={() => applyPreset("4h")}
          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded font-bold cursor-pointer transition-colors"
        >
          4h Thuật toán (Trong buổi)
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODE 1: DURATION BUILDER (Gọn Gàng, Trực Quan Cho 1-2 Ngày)
      ───────────────────────────────────────────────────────────── */}
      {activeMode === "duration" && (
        <div className="p-3.5 bg-[var(--bg-panel)] border border-[var(--border-muted)] rounded space-y-3">
          {/* Anchor Date Input */}
          <div className="p-2.5 bg-[var(--bg-base)] border border-cyan-500/30 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-cyan-300 uppercase block">
                Mốc bắt đầu làm bài (Ngày neo) *
              </label>
              <span className="text-[10px] text-[var(--text-muted)]">
                Các giai đoạn tiếp theo sẽ tự động tính nối tiếp theo số giờ/ngày.
              </span>
            </div>
            <div className="w-full sm:w-60">
              <Input
                type="datetime-local"
                value={toDateTimeLocal(values.startDate)}
                onChange={(e) => applyDurationCascade(e.target.value)}
                className="bg-black/60 border-cyan-500/40 text-cyan-300 text-xs font-bold"
              />
            </div>
          </div>

          {/* 3 Duration Control Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* 1. Submission Duration */}
            <div className="p-3 bg-[var(--bg-base)] border border-amber-500/30 rounded space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase">
                  1. Nộp bài
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {formatDetailedDuration(values.startDate, values.endDate) || "---"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={subDuration.amount}
                  onChange={(e) => {
                    const newSub = { ...subDuration, amount: Math.max(1, Number(e.target.value)) };
                    setSubDuration(newSub);
                    applyDurationCascade(values.startDate, newSub);
                  }}
                  className="w-16 px-2 py-1 bg-black/60 border border-amber-500/40 text-amber-300 rounded font-bold text-xs text-center"
                />
                <select
                  value={subDuration.unit}
                  onChange={(e) => {
                    const newSub = { ...subDuration, unit: e.target.value as TimeUnit };
                    setSubDuration(newSub);
                    applyDurationCascade(values.startDate, newSub);
                  }}
                  className="flex-1 px-2 py-1 bg-black/60 border border-amber-500/40 text-amber-300 rounded text-xs cursor-pointer"
                >
                  <option value="hours">Giờ</option>
                  <option value="days">Ngày</option>
                  <option value="weeks">Tuần</option>
                </select>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block truncate">
                Hạn chót: {formatHumanDateTime(values.endDate)}
              </span>
            </div>

            {/* 2. Scoring Duration */}
            <div className="p-3 bg-[var(--bg-base)] border border-cyan-500/30 rounded space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-300 uppercase">
                  2. Chấm điểm &amp; Pitching
                </span>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  {formatDetailedDuration(values.scoringStartDate, values.scoringEndDate) || "---"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={scoreDuration.amount}
                  onChange={(e) => {
                    const newScore = { ...scoreDuration, amount: Math.max(1, Number(e.target.value)) };
                    setScoreDuration(newScore);
                    applyDurationCascade(values.startDate, subDuration, newScore);
                  }}
                  className="w-16 px-2 py-1 bg-black/60 border border-cyan-500/40 text-cyan-300 rounded font-bold text-xs text-center"
                />
                <select
                  value={scoreDuration.unit}
                  onChange={(e) => {
                    const newScore = { ...scoreDuration, unit: e.target.value as TimeUnit };
                    setScoreDuration(newScore);
                    applyDurationCascade(values.startDate, subDuration, newScore);
                  }}
                  className="flex-1 px-2 py-1 bg-black/60 border border-cyan-500/40 text-cyan-300 rounded text-xs cursor-pointer"
                >
                  <option value="hours">Giờ</option>
                  <option value="days">Ngày</option>
                  <option value="weeks">Tuần</option>
                </select>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block truncate">
                Khóa chấm: {formatHumanDateTime(values.scoringEndDate)}
              </span>
            </div>

            {/* 3. Appeal Duration */}
            <div className={`p-3 bg-[var(--bg-base)] border rounded space-y-1.5 transition-colors ${
              hasAppeal ? "border-purple-500/30" : "border-slate-800 opacity-60"
            }`}>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-purple-300 uppercase flex items-center gap-1 cursor-pointer">
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
                  <span>3. Phúc khảo / Trao giải</span>
                </label>
                {hasAppeal && (
                  <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                    {formatDetailedDuration(values.appealStartDate, values.appealEndDate) || "---"}
                  </span>
                )}
              </div>

              {hasAppeal ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="720"
                      value={appealDuration.amount}
                      onChange={(e) => {
                        const newAppeal = { ...appealDuration, amount: Math.max(1, Number(e.target.value)) };
                        setAppealDuration(newAppeal);
                        applyDurationCascade(values.startDate, subDuration, scoreDuration, newAppeal, true);
                      }}
                      className="w-16 px-2 py-1 bg-black/60 border border-purple-500/40 text-purple-300 rounded font-bold text-xs text-center"
                    />
                    <select
                      value={appealDuration.unit}
                      onChange={(e) => {
                        const newAppeal = { ...appealDuration, unit: e.target.value as TimeUnit };
                        setAppealDuration(newAppeal);
                        applyDurationCascade(values.startDate, subDuration, scoreDuration, newAppeal, true);
                      }}
                      className="flex-1 px-2 py-1 bg-black/60 border border-purple-500/40 text-purple-300 rounded text-xs cursor-pointer"
                    >
                      <option value="hours">Giờ</option>
                      <option value="days">Ngày</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] block truncate">
                    Hoàn tất: {formatHumanDateTime(values.appealEndDate)}
                  </span>
                </>
              ) : (
                <p className="text-[10px] text-[var(--text-muted)] py-1.5 text-center">
                  Bỏ qua phúc khảo
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE 2: PRECISION MODE (Tinh Chỉnh Chi Tiết Kèm Nút Giờ Nhanh)
      ───────────────────────────────────────────────────────────── */}
      {activeMode === "precision" && (
        <div className="space-y-3">
          {/* Phase 1: Submission */}
          <div className="p-3.5 bg-[var(--bg-panel)] border border-amber-500/30 rounded space-y-2.5">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-1.5">
              <span className="font-bold text-amber-300 uppercase text-[11px]">
                1. Giai đoạn nộp bài
              </span>
              {values.startDate && values.endDate && (
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[10px] rounded font-bold">
                  {formatDetailedDuration(values.startDate, values.endDate)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
                  Mở nộp bài *
                </label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.startDate)}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("startDate", val);
                    if (!values.endDate && val) {
                      onChange("endDate", addHoursToDateStr(val, 24));
                    }
                  }}
                  required
                />
                <div className="flex items-center gap-1 text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onChange("startDate", setTimeToDateStr(values.startDate, t))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 rounded cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
                    Hạn chót nộp bài *
                  </label>
                  <div className="flex items-center gap-1 text-[9px]">
                    <button
                      type="button"
                      onClick={() => onChange("endDate", addHoursToDateStr(values.endDate || values.startDate, 4))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 rounded cursor-pointer"
                    >
                      +4h
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange("endDate", addHoursToDateStr(values.endDate || values.startDate, 24))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 rounded cursor-pointer"
                    >
                      +24h
                    </button>
                  </div>
                </div>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.endDate, "17:00")}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("endDate", val);
                    if (!values.scoringStartDate && val) {
                      onChange("scoringStartDate", val);
                    }
                  }}
                  required
                />
                <div className="flex items-center gap-1 text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onChange("endDate", setTimeToDateStr(values.endDate, t))}
                      className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 rounded cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Scoring */}
          <div className="p-3.5 bg-[var(--bg-panel)] border border-cyan-500/30 rounded space-y-2.5">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-1.5">
              <span className="font-bold text-cyan-300 uppercase text-[11px]">
                2. Giai đoạn chấm điểm &amp; Pitching
              </span>
              {values.scoringStartDate && values.scoringEndDate && (
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] rounded font-bold">
                  {formatDetailedDuration(values.scoringStartDate, values.scoringEndDate)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
                  Mở chấm điểm
                </label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.scoringStartDate, "17:00")}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("scoringStartDate", val);
                    if (!values.scoringEndDate && val) {
                      onChange("scoringEndDate", addHoursToDateStr(val, 4));
                    }
                  }}
                />
                <div className="flex items-center gap-1 text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onChange("scoringStartDate", setTimeToDateStr(values.scoringStartDate, t))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 rounded cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
                    Khóa chấm điểm *
                  </label>
                  <div className="flex items-center gap-1 text-[9px]">
                    <button
                      type="button"
                      onClick={() => onChange("scoringEndDate", addHoursToDateStr(values.scoringEndDate || values.scoringStartDate, 2))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 rounded cursor-pointer"
                    >
                      +2h
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange("scoringEndDate", addHoursToDateStr(values.scoringEndDate || values.scoringStartDate, 4))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 rounded cursor-pointer"
                    >
                      +4h
                    </button>
                  </div>
                </div>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.scoringEndDate, "20:00")}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange("scoringEndDate", val);
                    if (hasAppeal && !values.appealStartDate && val) {
                      onChange("appealStartDate", val);
                    }
                  }}
                  required
                />
                <div className="flex items-center gap-1 text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onChange("scoringEndDate", setTimeToDateStr(values.scoringEndDate, t))}
                      className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 rounded cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3: Appeal */}
          <div className="p-3.5 bg-[var(--bg-panel)] border border-purple-500/30 rounded space-y-2.5">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-1.5">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-purple-300 uppercase text-[11px]">
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
                      onChange("appealEndDate", addHoursToDateStr(values.scoringEndDate, 1));
                    }
                  }}
                  className="accent-purple-400 w-3.5 h-3.5 cursor-pointer"
                />
                <span>3. Phúc khảo / Trao giải (Tùy chọn)</span>
              </label>
              {hasAppeal && values.appealStartDate && values.appealEndDate && (
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-[10px] rounded font-bold">
                  {formatDetailedDuration(values.appealStartDate, values.appealEndDate)}
                </span>
              )}
            </div>

            {hasAppeal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
                    Mở phúc khảo
                  </label>
                  <Input
                    type="datetime-local"
                    value={toDateTimeLocal(values.appealStartDate, "20:00")}
                    onChange={(e) => onChange("appealStartDate", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
                    Đóng phúc khảo &amp; Trao giải
                  </label>
                  <Input
                    type="datetime-local"
                    value={toDateTimeLocal(values.appealEndDate, "21:00")}
                    onChange={(e) => onChange("appealEndDate", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Minimalist Hourly Gantt Bar */}
      <div className="p-2.5 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded space-y-1.5 text-[10px]">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span>Tiến trình vòng: <strong className="text-cyan-300">{totalHours} giờ tổng cộng</strong></span>
          <span>{values.startDate ? new Date(values.startDate).toLocaleDateString("vi-VN") : "---"} ──▶ {values.scoringEndDate ? new Date(values.scoringEndDate).toLocaleDateString("vi-VN") : "---"}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden flex border border-slate-700/80">
          <div
            style={{ width: `${subPct}%` }}
            className="h-full bg-amber-500"
            title={`Nộp bài: ${subHours}h (${subPct}%)`}
          />
          <div
            style={{ width: `${scorePct}%` }}
            className="h-full bg-cyan-500"
            title={`Chấm điểm: ${scoreHours}h (${scorePct}%)`}
          />
          {hasAppeal && appealPct > 0 && (
            <div
              style={{ width: `${appealPct}%` }}
              className="h-full bg-purple-500"
              title={`Phúc khảo: ${appealHours}h (${appealPct}%)`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-amber-400">Nộp bài: {subHours}h</span>
          <span className="text-cyan-400">Chấm điểm: {scoreHours}h</span>
          {hasAppeal && <span className="text-purple-400">Phúc khảo: {appealHours}h</span>}
        </div>
      </div>
    </div>
  );
};
