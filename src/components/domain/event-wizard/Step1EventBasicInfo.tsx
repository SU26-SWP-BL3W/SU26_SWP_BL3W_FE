"use client";

import React, { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { EventFormState } from "@/viewModels/useCreateEventWizardViewModel";
import { Calendar, Shield, Edit3, CheckCircle2, ArrowRight } from "lucide-react";

interface Step1EventBasicInfoProps {
  eventData: EventFormState;
  onUpdateField: (field: keyof EventFormState, value: any) => void;
  onNext: () => void;
  isSubmitting: boolean;
}

export const Step1EventBasicInfo: React.FC<Step1EventBasicInfoProps> = ({
  eventData,
  onUpdateField,
  onNext,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="hud-glow-cyan p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
            Bước 1: Thông Tin Sự Kiện Hackathon
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Kiểm tra và tùy chỉnh thông tin tổng quan sự kiện trước khi thiết lập Vòng thi (Rounds) & Bảng đấu (Tracks).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 font-mono text-xs border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 hud-clipped font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isEditing ? "✕ Hủy Chỉnh Sửa" : "✎ Chỉnh Sửa Thông Tin"}
        </button>
      </div>

      {isEditing ? (
        /* EDITABLE FORM FOR COORDINATOR */
        <div className="p-6 bg-[var(--bg-panel)] border border-[var(--accent-primary)]/30 hud-clipped space-y-4 animate-fadeIn font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Tên Sự Kiện *</label>
              <Input
                type="text"
                value={eventData.eventName}
                onChange={(e) => onUpdateField("eventName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Mùa Giải</label>
              <Input
                type="text"
                value={eventData.season}
                onChange={(e) => onUpdateField("season", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Năm Tổ Chức</label>
              <Input
                type="number"
                value={eventData.year}
                onChange={(e) => onUpdateField("year", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Ngày Bắt Đầu Sự Kiện</label>
              <Input
                type="date"
                value={eventData.startDate}
                onChange={(e) => onUpdateField("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Ngày Kết Thúc Sự Kiện</label>
              <Input
                type="date"
                value={eventData.endDate}
                onChange={(e) => onUpdateField("endDate", e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Mô Tả Sự Kiện</label>
              <textarea
                rows={3}
                value={eventData.description}
                onChange={(e) => onUpdateField("description", e.target.value)}
                className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-[var(--color-success)] text-white font-bold hud-clipped flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Lưu Cập Nhật
            </button>
          </div>
        </div>
      ) : (
        /* READABLE SUMMARY CARD */
        <div className="p-6 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-4">
            <div>
              <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-widest block font-bold">
                TÊN SỰ KIỆN HACKATHON
              </span>
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] uppercase">
                {eventData.eventName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-xs font-bold text-[var(--text-primary)] hud-clipped">
                {eventData.season} {eventData.year}
              </span>
              <span className="px-2 py-1 bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] border border-[var(--color-success)]/30 font-mono text-xs font-bold hud-clipped">
                ACTIVE EVENT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Thời Gian Diễn Ra Sự Kiện
              </span>
              <p className="font-bold text-[var(--text-primary)]">
                {eventData.startDate} ➔ {eventData.endDate}
              </p>
            </div>

            <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-team)]" />
                Thời Gian Mở / Đóng Đăng Ký
              </span>
              <p className="font-bold text-[var(--text-primary)]">
                {eventData.registrationStartDate} ➔ {eventData.registrationEndDate}
              </p>
            </div>

            <div className="md:col-span-2 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase">Mô Tả Sự Kiện</span>
              <p className="text-[var(--text-muted)] leading-relaxed">
                {eventData.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)] font-mono text-xs">
        <span className="text-[var(--text-muted)]">
          Bấm nút bên phải để chuyển sang Bước 2: Thiết lập Vòng thi (Rounds) & Bảng đấu.
        </span>
        <Button
          variant="primary"
          accent="coordinator"
          onClick={onNext}
          className="flex items-center gap-2 cursor-pointer"
        >
          Bắt Đầu Cấu Hình Vòng Thi (Rounds) <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
