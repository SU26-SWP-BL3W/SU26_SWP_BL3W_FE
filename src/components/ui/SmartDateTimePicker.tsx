"use client";

import React from "react";

export interface SmartDateTimePickerProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  variant?: "amber" | "cyan" | "purple" | "emerald";
  helperText?: string;
  defaultTime?: string;
  quickOffsets?: { label: string; hours?: number; days?: number }[];
  minDate?: string;
  maxDate?: string;
  className?: string;
}

// Extract date (YYYY-MM-DD) and time (HH:mm) safely
const parseDateTime = (val?: string, defaultTime = "08:00") => {
  if (!val) return { date: "", time: defaultTime };
  if (val.includes("T")) {
    const parts = val.split("T");
    const date = parts[0] || "";
    const time = parts[1]?.substring(0, 5) || defaultTime;
    return { date, time };
  }
  return { date: val, time: defaultTime };
};

// Format human Vietnamese date with day of week: "Thứ Bảy, 15/08/2026 lúc 08:00"
const formatHumanDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return "Chưa chọn ngày";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return "Chưa chọn ngày";
    const dateObj = new Date(y, m - 1, d);
    if (isNaN(dateObj.getTime())) return "Chưa chọn ngày";
    const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dow = daysOfWeek[dateObj.getDay()];
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${dow}, ${pad(d)}/${pad(m)}/${y} lúc ${timeStr || "00:00"}`;
  } catch {
    return "Chưa chọn ngày";
  }
};

export const SmartDateTimePicker: React.FC<SmartDateTimePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  variant = "cyan",
  helperText,
  defaultTime = "08:00",
  quickOffsets,
  minDate,
  maxDate,
  className = "",
}) => {
  const { date, time } = parseDateTime(value, defaultTime);

  // Variant color mappings
  const VARIANT_STYLES = {
    amber: {
      border: "border-amber-500/30 focus-within:border-amber-400",
      label: "text-amber-300",
      activeChip: "bg-amber-500/20 text-amber-300 border-amber-500/50",
      chip: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300/80 border-amber-500/20",
      badge: "text-amber-400 bg-amber-500/10",
      inputFocus: "focus:border-amber-400",
    },
    cyan: {
      border: "border-cyan-500/30 focus-within:border-cyan-400",
      label: "text-cyan-300",
      activeChip: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
      chip: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300/80 border-cyan-500/20",
      badge: "text-cyan-400 bg-cyan-500/10",
      inputFocus: "focus:border-cyan-400",
    },
    purple: {
      border: "border-purple-500/30 focus-within:border-purple-400",
      label: "text-purple-300",
      activeChip: "bg-purple-500/20 text-purple-300 border-purple-500/50",
      chip: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-300/80 border-purple-500/20",
      badge: "text-purple-400 bg-purple-500/10",
      inputFocus: "focus:border-purple-400",
    },
    emerald: {
      border: "border-emerald-500/30 focus-within:border-emerald-400",
      label: "text-emerald-300",
      activeChip: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      chip: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300/80 border-emerald-500/20",
      badge: "text-emerald-400 bg-emerald-500/10",
      inputFocus: "focus:border-emerald-400",
    },
  };

  const style = VARIANT_STYLES[variant];
  const COMMON_TIMES = ["08:00", "12:00", "13:30", "17:00", "20:00", "23:59"];

  const handleDateChange = (newDate: string) => {
    if (!newDate) {
      onChange("");
      return;
    }
    onChange(`${newDate}T${time || defaultTime}`);
  };

  const handleTimeChange = (newTime: string) => {
    const activeDate = date || new Date().toISOString().split("T")[0];
    onChange(`${activeDate}T${newTime}`);
  };

  const handleApplyOffset = (hours = 0, days = 0) => {
    const base = value ? new Date(value) : new Date();
    if (isNaN(base.getTime())) return;
    if (days > 0) base.setDate(base.getDate() + days);
    if (hours > 0) base.setHours(base.getHours() + hours);
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T${pad(base.getHours())}:${pad(base.getMinutes())}`;
    onChange(formatted);
  };

  return (
    <div className={`p-3 bg-[var(--bg-base)] border ${style.border} rounded space-y-2 font-mono text-xs ${className}`}>
      {/* Header Label & Formatted Vietnamese Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className={`text-[10px] uppercase font-bold ${style.label}`}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {date && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${style.badge}`}>
            {formatHumanDateTime(date, time)}
          </span>
        )}
      </div>

      {/* Inputs Bar: Dedicated Date Input + Time Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Date Input (Only clean calendar popup, NO 3-column scroll) */}
        <div className="flex-1">
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            disabled={disabled}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`w-full px-2.5 py-1.5 bg-black/60 border border-[var(--border-muted)] ${style.inputFocus} text-[var(--text-primary)] rounded font-mono text-xs focus:outline-none`}
            required={required}
          />
        </div>

        {/* Time Input */}
        <div className="w-full sm:w-28">
          <input
            type="time"
            value={time}
            disabled={disabled}
            onChange={(e) => handleTimeChange(e.target.value)}
            className={`w-full px-2.5 py-1.5 bg-black/60 border border-[var(--border-muted)] ${style.inputFocus} text-[var(--text-primary)] rounded font-mono text-xs text-center focus:outline-none`}
            required={required}
          />
        </div>
      </div>

      {/* Quick Time Presets (1-Click Chips) & Offset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5 text-[9px]">
        {/* Quick Time Chips */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[var(--text-muted)]">Giờ:</span>
          {COMMON_TIMES.map((t) => {
            const isSelected = time === t;
            return (
              <button
                key={t}
                type="button"
                disabled={disabled}
                onClick={() => handleTimeChange(t)}
                className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors font-mono ${
                  isSelected ? style.activeChip : style.chip
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Quick Offset Buttons (e.g. +4h, +24h, +1d, +7d) */}
        {quickOffsets && quickOffsets.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {quickOffsets.map((opt) => (
              <button
                key={opt.label}
                type="button"
                disabled={disabled}
                onClick={() => handleApplyOffset(opt.hours, opt.days)}
                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-slate-300 rounded cursor-pointer transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Note */}
      {helperText && (
        <span className="text-[10px] text-[var(--text-muted)] block">
          {helperText}
        </span>
      )}
    </div>
  );
};
