"use client";

import React from "react";
import { Button, Card, Badge } from "@/components/ui";
import { EventFormState } from "@/viewModels/useCreateEventWizardViewModel";
import { Calendar, Shield, Info, Lock, ArrowRight } from "lucide-react";

interface Step1EventBasicInfoProps {
  eventData: EventFormState;
  onUpdateField: (field: keyof EventFormState, value: any) => void;
  onNext: () => void;
  isSubmitting: boolean;
}

export const Step1EventBasicInfo: React.FC<Step1EventBasicInfoProps> = ({
  eventData,
  onNext,
}) => {
  return (
    <Card className="hud-glow-cyan p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--color-warning)]" />
            Bước 1: Thông Tin Sự Kiện (Do Admin Khởi Tạo - Read Only)
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Theo phân quyền (§11 / STT #1): Khung sự kiện do System Admin khởi tạo (`POST /api/Events`). Event Coordinator (EC) phụ trách điều phối các **Bước 2 ➔ 5** bên dưới.
          </p>
        </div>
        <span className="px-3 py-1 font-mono text-xs bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)] border border-[var(--color-warning)]/30 hud-clipped font-bold">
          🔒 [READ-ONLY SUMMARY]
        </span>
      </div>

      {/* Read-Only Summary Card */}
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
            <Badge tone="team">{eventData.season} {eventData.year}</Badge>
            <span className="px-2 py-1 bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] border border-[var(--color-success)]/30 font-mono text-xs font-bold hud-clipped">
              ACTIVE EVENT
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              Thời Gian Diễn Ra Sự Kiện
            </span>
            <p className="font-mono text-xs font-bold text-[var(--text-primary)]">
              {new Date(eventData.startDate).toLocaleDateString("vi-VN")} ➔ {new Date(eventData.endDate).toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent-team)]" />
              Thời Gian Mở / Đóng Đăng Ký
            </span>
            <p className="font-mono text-xs font-bold text-[var(--text-primary)]">
              {new Date(eventData.registrationStartDate).toLocaleDateString("vi-VN")} ➔ {new Date(eventData.registrationEndDate).toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="md:col-span-2 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Mô Tả Sự Kiện Do Admin Phê Duyệt</span>
            <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
              {eventData.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)]">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Info className="w-4 h-4 text-[var(--accent-coordinator)]" />
          <span>Bấm nút bên phải để bắt đầu thiết lập Vòng thi (Rounds) & Hạng mục (Tracks) cho sự kiện này.</span>
        </div>
        <Button
          variant="primary"
          accent="coordinator"
          onClick={onNext}
          className="flex items-center gap-2"
        >
          Bắt Đầu Cấu Hình Vòng Thi (Rounds) &gt;
        </Button>
      </div>
    </Card>
  );
};
