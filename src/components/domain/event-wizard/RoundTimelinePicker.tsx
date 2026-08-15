"use client";

import React, { useState } from "react";
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
  const [hasAppeal, setHasAppeal] = useState(Boolean(values.appealStartDate && values.appealEndDate));

  // Quick Time Chips
  const TIME_CHIPS = [
    { label: "08:00", icon: Sunrise, title: "Sáng (08:00)" },
    { label: "12:00", icon: Sun, title: "Trưa (12:00)" },
    { label: "17:30", icon: Sunset, title: "Chiều (17:30)" },
    { label: "23:59", icon: Moon, title: "Đêm (23:59)" },
  ];

  // Smart Cascade Handlers
  const handleStartDateChange = (val: string) => {
    onChange("startDate", val);
    // If endDate is empty or before start, set endDate = start + 14 days
    if (!values.endDate || values.endDate <= val) {
      onChange("endDate", addDaysPreserveTime(val, 14, "23:59"));
    }
  };

  const handleEndDateChange = (val: string) => {
    onChange("endDate", val);
    // Smart Cascade: align scoringStartDate to endDate
    if (!values.scoringStartDate || values.scoringStartDate <= val) {
      onChange("scoringStartDate", val);
    }
    // If scoringEndDate is before new scoringStartDate, push scoringEndDate
    if (!values.scoringEndDate || values.scoringEndDate <= val) {
      onChange("scoringEndDate", addDaysPreserveTime(val, 7, "23:59"));
    }
  };

  const handleScoringStartDateChange = (val: string) => {
    onChange("scoringStartDate", val);
    if (!values.scoringEndDate || values.scoringEndDate <= val) {
      onChange("scoringEndDate", addDaysPreserveTime(val, 7, "23:59"));
    }
  };

  const handleScoringEndDateChange = (val: string) => {
    onChange("scoringEndDate", val);
    if (hasAppeal) {
      if (!values.appealStartDate || values.appealStartDate <= val) {
        onChange("appealStartDate", val);
      }
      if (!values.appealEndDate || values.appealEndDate <= val) {
        onChange("appealEndDate", addDaysPreserveTime(val, 3, "23:59"));
      }
    }
  };

  const handleAppealStartDateChange = (val: string) => {
    onChange("appealStartDate", val);
    if (!values.appealEndDate || values.appealEndDate <= val) {
      onChange("appealEndDate", addDaysPreserveTime(val, 3, "23:59"));
    }
  };

  const handleAppealEndDateChange = (val: string) => {
    onChange("appealEndDate", val);
  };

  // Quick Presets
  const applyPreset = (presetType: "hackathon" | "sprint" | "capstone" | "finals") => {
    const anchor = values.startDate || defaultAnchorDate || toDateTimeLocal(new Date().toISOString(), "08:00");
    const sDate = toDateTimeLocal(anchor, "08:00");

    if (presetType === "sprint") {
      // 48h Sprint: Nộp 48h (2 ngày) đến 17:30, Chấm 1 ngày đến 21:00
      const eDate = setTimeToDateStr(addDaysPreserveTime(sDate, 2), "17:30");
      const scStart = eDate;
      const scEnd = setTimeToDateStr(addDaysPreserveTime(scStart, 1), "21:00");

      onChange("startDate", sDate);
      onChange("endDate", eDate);
      onChange("scoringStartDate", scStart);
      onChange("scoringEndDate", scEnd);
      onChange("appealStartDate", "");
      onChange("appealEndDate", "");
      setHasAppeal(false);
    } else if (presetType === "capstone") {
      // Capstone 8 Tuần: Nộp 30 ngày, Chấm 14 ngày, Phúc khảo 7 ngày
      const eDate = setTimeToDateStr(addDaysPreserveTime(sDate, 30), "23:59");
      const scStart = setTimeToDateStr(eDate, "08:00");
      const scEnd = setTimeToDateStr(addDaysPreserveTime(scStart, 14), "23:59");
      const apStart = setTimeToDateStr(scEnd, "08:00");
      const apEnd = setTimeToDateStr(addDaysPreserveTime(apStart, 7), "23:59");

      onChange("startDate", sDate);
      onChange("endDate", eDate);
      onChange("scoringStartDate", scStart);
      onChange("scoringEndDate", scEnd);
      onChange("appealStartDate", apStart);
      onChange("appealEndDate", apEnd);
      setHasAppeal(true);
    } else if (presetType === "finals") {
      // Chung kết 1 Tuần: Nộp 5 ngày đến 17:00, Chấm 2 ngày đến 20:00
      const eDate = setTimeToDateStr(addDaysPreserveTime(sDate, 5), "17:00");
      const scStart = setTimeToDateStr(eDate, "08:00");
      const scEnd = setTimeToDateStr(addDaysPreserveTime(scStart, 2), "20:00");

      onChange("startDate", sDate);
      onChange("endDate", eDate);
      onChange("scoringStartDate", scStart);
      onChange("scoringEndDate", scEnd);
      onChange("appealStartDate", "");
      onChange("appealEndDate", "");
      setHasAppeal(false);
    } else {
      // Hackathon 4 Tuần: Nộp 14 ngày, Chấm 7 ngày, Phúc khảo 3 ngày
      const eDate = setTimeToDateStr(addDaysPreserveTime(sDate, 14), "23:59");
      const scStart = setTimeToDateStr(eDate, "08:00");
      const scEnd = setTimeToDateStr(addDaysPreserveTime(scStart, 7), "23:59");
      const apStart = setTimeToDateStr(scEnd, "08:00");
      const apEnd = setTimeToDateStr(addDaysPreserveTime(apStart, 3), "23:59");

      onChange("startDate", sDate);
      onChange("endDate", eDate);
      onChange("scoringStartDate", scStart);
      onChange("scoringEndDate", scEnd);
      onChange("appealStartDate", apStart);
      onChange("appealEndDate", apEnd);
      setHasAppeal(true);
    }
  };

  // Validation Warnings
  let warningMessage: string | null = null;
  if (values.startDate && values.endDate && values.startDate > values.endDate) {
    warningMessage = "Ngày mở nộp bài phải diễn ra trước hạn chót nộp bài!";
  } else if (values.endDate && values.scoringStartDate && values.scoringStartDate < values.endDate) {
    warningMessage = "Thời gian bắt đầu chấm điểm không nên diễn ra trước hạn nộp bài!";
  } else if (values.scoringStartDate && values.scoringEndDate && values.scoringStartDate > values.scoringEndDate) {
    warningMessage = "Thời gian kết thúc chấm điểm phải diễn ra sau thời gian bắt đầu chấm!";
  } else if (values.appealStartDate && values.appealEndDate && values.appealStartDate > values.appealEndDate) {
    warningMessage = "Thời gian đóng phúc khảo phải diễn ra sau thời gian mở phúc khảo!";
  }

  // Durations & Gantt Stats
  const subDur = formatDetailedDuration(values.startDate, values.endDate);
  const scoreDur = formatDetailedDuration(values.scoringStartDate || values.endDate, values.scoringEndDate);
  const appealDur = hasAppeal ? formatDetailedDuration(values.appealStartDate, values.appealEndDate) : null;

  const subDaysCount = getDaysBetween(values.startDate, values.endDate) || 1;
  const scoreDaysCount = getDaysBetween(values.scoringStartDate || values.endDate, values.scoringEndDate) || 1;
  const appealDaysCount = hasAppeal ? getDaysBetween(values.appealStartDate, values.appealEndDate) : 0;
  const totalDays = subDaysCount + scoreDaysCount + appealDaysCount;

  const subPercent = totalDays > 0 ? Math.round((subDaysCount / totalDays) * 100) : 50;
  const scorePercent = totalDays > 0 ? Math.round((scoreDaysCount / totalDays) * 100) : 30;
  const appealPercent = totalDays > 0 && hasAppeal ? 100 - subPercent - scorePercent : 0;

  return (
    <div className="p-5 bg-[var(--bg-base)] border border-[var(--border-muted)] hud-clipped space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border-muted)] pb-4">
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
            Chỉnh sửa trực tiếp Ngày, Giờ &amp; Phút tại từng mốc. Dùng phím tắt giờ nhanh hoặc nút cộng ngày để thao tác nhanh.
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
            <strong className="text-[var(--text-primary)]">~{Math.round(totalDays)} ngày</strong>
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            {values.startDate ? new Date(values.startDate).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "---"} ──▶ {values.scoringEndDate ? new Date(values.scoringEndDate).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "---"}
          </span>
        </div>

        <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex border border-[var(--border-muted)]">
          <div
            style={{ width: `${subPercent}%` }}
            className="bg-amber-500 hover:bg-amber-400 transition-all flex items-center justify-center text-[9px] font-black text-black font-mono truncate px-1"
            title={`Nộp bài: ${subDur || `${subDaysCount}d`} (${subPercent}%)`}
          >
            Nộp: {subDur || `${subDaysCount}d`}
          </div>
          <div
            style={{ width: `${scorePercent}%` }}
            className="bg-cyan-500 hover:bg-cyan-400 transition-all flex items-center justify-center text-[9px] font-black text-black font-mono truncate px-1"
            title={`Chấm điểm: ${scoreDur || `${scoreDaysCount}d`} (${scorePercent}%)`}
          >
            Chấm: {scoreDur || `${scoreDaysCount}d`}
          </div>
          {hasAppeal && appealPercent > 0 && (
            <div
              style={{ width: `${appealPercent}%` }}
              className="bg-purple-500 hover:bg-purple-400 transition-all flex items-center justify-center text-[9px] font-black text-black font-mono truncate px-1"
              title={`Phúc khảo: ${appealDur || `${appealDaysCount}d`} (${appealPercent}%)`}
            >
              PK: {appealDur || `${appealDaysCount}d`}
            </div>
          )}
        </div>
      </div>

      {/* 3 Interactive Phase Cards (with Exact Date/Time & Quick Time Chips) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Phase 1: Submission */}
        <div className="p-4 rounded-lg bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>GIAI ĐOẠN 1: NỘP BÀI</span>
            </div>
            {subDur && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {subDur}
              </span>
            )}
          </div>

          {/* Mở nộp bài */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-muted)] flex items-center justify-between">
              <span className="text-amber-300 font-bold">1. Mở nộp bài (Giờ &amp; Ngày) *</span>
            </label>
            <Input
              type="datetime-local"
              value={toDateTimeLocal(values.startDate, "08:00")}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="font-mono text-xs border-amber-500/40 bg-[var(--bg-input)] text-[var(--text-primary)]"
            />
            {/* Quick Time Chips for Start */}
            <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
              <span className="text-[var(--text-muted)]">Giờ:</span>
              {TIME_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleStartDateChange(setTimeToDateStr(values.startDate, chip.label))}
                  className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 rounded text-amber-300 cursor-pointer"
                  title={chip.title}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Extend Duration Quick Buttons */}
          <div className="py-1 px-2.5 bg-black/40 border border-amber-500/20 rounded flex items-center justify-between text-[10px] font-mono">
            <span className="text-[var(--text-muted)]">Tăng hạn nộp:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleEndDateChange(addDaysPreserveTime(values.endDate || values.startDate, 1))}
                className="px-1.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 rounded font-bold cursor-pointer"
              >
                +1 Ngày
              </button>
              <button
                type="button"
                onClick={() => handleEndDateChange(addDaysPreserveTime(values.endDate || values.startDate, 3))}
                className="px-1.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 rounded font-bold cursor-pointer"
              >
                +3 Ngày
              </button>
              <button
                type="button"
                onClick={() => handleEndDateChange(addDaysPreserveTime(values.endDate || values.startDate, 7))}
                className="px-1.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 rounded font-bold cursor-pointer"
              >
                +7 Ngày
              </button>
            </div>
          </div>

          {/* Hạn chót nộp bài */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-muted)] flex items-center justify-between">
              <span className="text-amber-300 font-bold">2. Hạn chót nộp bài (Khóa Form) *</span>
            </label>
            <Input
              type="datetime-local"
              value={toDateTimeLocal(values.endDate, "23:59")}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="font-mono text-xs border-amber-500/40 bg-[var(--bg-input)] text-[var(--text-primary)]"
            />
            {/* Quick Time Chips for End */}
            <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
              <span className="text-[var(--text-muted)]">Giờ:</span>
              {TIME_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleEndDateChange(setTimeToDateStr(values.endDate, chip.label))}
                  className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/20 rounded text-amber-300 cursor-pointer"
                  title={chip.title}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phase 2: Scoring */}
        <div className="p-4 rounded-lg bg-gradient-to-b from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/30 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>GIAI ĐOẠN 2: CHẤM ĐIỂM</span>
            </div>
            {scoreDur && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {scoreDur}
              </span>
            )}
          </div>

          {/* Bắt đầu chấm */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-muted)] flex items-center justify-between">
              <span className="text-cyan-300 font-bold">3. Mở chấm điểm (Mở Form Giám Khảo) *</span>
            </label>
            <Input
              type="datetime-local"
              value={toDateTimeLocal(values.scoringStartDate || values.endDate, "08:00")}
              onChange={(e) => handleScoringStartDateChange(e.target.value)}
              className="font-mono text-xs border-cyan-500/40 bg-[var(--bg-input)] text-[var(--text-primary)]"
            />
            <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
              <span className="text-[var(--text-muted)]">Giờ:</span>
              {TIME_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleScoringStartDateChange(setTimeToDateStr(values.scoringStartDate || values.endDate, chip.label))}
                  className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/20 rounded text-cyan-300 cursor-pointer"
                  title={chip.title}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Extend Duration Quick Buttons */}
          <div className="py-1 px-2.5 bg-black/40 border border-cyan-500/20 rounded flex items-center justify-between text-[10px] font-mono">
            <span className="text-[var(--text-muted)]">Tăng thời gian chấm:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScoringEndDateChange(addDaysPreserveTime(values.scoringEndDate || values.scoringStartDate, 1))}
                className="px-1.5 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 rounded font-bold cursor-pointer"
              >
                +1 Ngày
              </button>
              <button
                type="button"
                onClick={() => handleScoringEndDateChange(addDaysPreserveTime(values.scoringEndDate || values.scoringStartDate, 3))}
                className="px-1.5 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 rounded font-bold cursor-pointer"
              >
                +3 Ngày
              </button>
              <button
                type="button"
                onClick={() => handleScoringEndDateChange(addDaysPreserveTime(values.scoringEndDate || values.scoringStartDate, 7))}
                className="px-1.5 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 rounded font-bold cursor-pointer"
              >
                +7 Ngày
              </button>
            </div>
          </div>

          {/* Kết thúc chấm */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-muted)] flex items-center justify-between">
              <span className="text-cyan-300 font-bold">4. Khóa chấm điểm (Khóa Form Giám Khảo) *</span>
            </label>
            <Input
              type="datetime-local"
              value={toDateTimeLocal(values.scoringEndDate, "23:59")}
              onChange={(e) => handleScoringEndDateChange(e.target.value)}
              className="font-mono text-xs border-cyan-500/40 bg-[var(--bg-input)] text-[var(--text-primary)]"
            />
            <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
              <span className="text-[var(--text-muted)]">Giờ:</span>
              {TIME_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleScoringEndDateChange(setTimeToDateStr(values.scoringEndDate, chip.label))}
                  className="px-1.5 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/20 rounded text-cyan-300 cursor-pointer"
                  title={chip.title}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phase 3: Appeal */}
        <div className="p-4 rounded-lg bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
              <input
                type="checkbox"
                id={`appeal-chk-${title}`}
                checked={hasAppeal}
                onChange={(e) => {
                  const chk = e.target.checked;
                  setHasAppeal(chk);
                  if (chk) {
                    const apStart = values.scoringEndDate || toDateTimeLocal(new Date().toISOString(), "08:00");
                    const apEnd = addDaysPreserveTime(apStart, 3, "23:59");
                    onChange("appealStartDate", apStart);
                    onChange("appealEndDate", apEnd);
                  } else {
                    onChange("appealStartDate", "");
                    onChange("appealEndDate", "");
                  }
                }}
                className="rounded cursor-pointer"
              />
              <label htmlFor={`appeal-chk-${title}`} className="flex items-center gap-1 cursor-pointer">
                <Scale className="w-4 h-4 text-purple-400" />
                <span>GIAI ĐOẠN 3: PHÚC KHẢO</span>
              </label>
            </div>
            {hasAppeal && appealDur ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {appealDur}
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                Tùy chọn
              </span>
            )}
          </div>

          {hasAppeal ? (
            <>
              {/* Mở phúc khảo */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--text-muted)] flex items-center justify-between">
                  <span className="text-purple-300 font-bold">5. Mở nhận khiếu nại (Giờ &amp; Ngày)</span>
                </label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.appealStartDate, "08:00")}
                  onChange={(e) => handleAppealStartDateChange(e.target.value)}
                  className="font-mono text-xs border-purple-500/40 bg-[var(--bg-input)] text-[var(--text-primary)]"
                />
                <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleAppealStartDateChange(setTimeToDateStr(values.appealStartDate, chip.label))}
                      className="px-1.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/20 rounded text-purple-300 cursor-pointer"
                      title={chip.title}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Extend Duration Quick Buttons */}
              <div className="py-1 px-2.5 bg-black/40 border border-purple-500/20 rounded flex items-center justify-between text-[10px] font-mono">
                <span className="text-[var(--text-muted)]">Tăng hạn phúc khảo:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleAppealEndDateChange(addDaysPreserveTime(values.appealEndDate || values.appealStartDate, 1))}
                    className="px-1.5 py-0.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 rounded font-bold cursor-pointer"
                  >
                    +1 Ngày
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppealEndDateChange(addDaysPreserveTime(values.appealEndDate || values.appealStartDate, 3))}
                    className="px-1.5 py-0.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 rounded font-bold cursor-pointer"
                  >
                    +3 Ngày
                  </button>
                </div>
              </div>

              {/* Đóng phúc khảo */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--text-muted)] flex items-center justify-between">
                  <span className="text-purple-300 font-bold">6. Đóng khiếu nại (Khóa Form)</span>
                </label>
                <Input
                  type="datetime-local"
                  value={toDateTimeLocal(values.appealEndDate, "23:59")}
                  onChange={(e) => handleAppealEndDateChange(e.target.value)}
                  className="font-mono text-xs border-purple-500/40 bg-[var(--bg-input)] text-[var(--text-primary)]"
                />
                <div className="flex items-center gap-1 font-mono text-[9px] pt-0.5">
                  <span className="text-[var(--text-muted)]">Giờ:</span>
                  {TIME_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleAppealEndDateChange(setTimeToDateStr(values.appealEndDate, chip.label))}
                      className="px-1.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/20 rounded text-purple-300 cursor-pointer"
                      title={chip.title}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-purple-500/20 rounded-lg space-y-2">
              <p>Giai đoạn Phúc Khảo đang được tắt.</p>
              <button
                type="button"
                onClick={() => {
                  setHasAppeal(true);
                  const apStart = values.scoringEndDate || toDateTimeLocal(new Date().toISOString(), "08:00");
                  const apEnd = addDaysPreserveTime(apStart, 3, "23:59");
                  onChange("appealStartDate", apStart);
                  onChange("appealEndDate", apEnd);
                }}
                className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Bật Phúc Khảo (+3 Ngày)
              </button>
            </div>
          )}
        </div>
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
