"use client";

import React, { useState } from "react";
import { Button, Card } from "@/components/ui";
import { eventsRepository } from "@/repositories/eventsRepository";
import { useRouter } from "next/navigation";
import {
  Layers,
  Target,
  Sliders,
  Users,
  ArrowLeft,
  Rocket,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Step6EventConfirmationProps {
  eventId?: string;
  eventData: any;
  rounds: any[];
  tracks: any[];
  criterias: any[];
  staffInvites: any[];
  canPublishEvent?: boolean;
  validationMissingItems?: string[];
  onPrev: () => void;
  onPublish?: () => Promise<void> | void;
  onSaveDraft?: () => Promise<void> | void;
  isSubmitting?: boolean;
  currentStatus?: boolean;
  redirectUrl?: string;
}

export const Step6EventConfirmation: React.FC<Step6EventConfirmationProps> = ({
  eventId,
  eventData,
  rounds,
  tracks,
  criterias,
  staffInvites,
  canPublishEvent = false,
  validationMissingItems = [],
  onPrev,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
  currentStatus = false,
  redirectUrl,
}) => {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const judgeCount = staffInvites.filter((s) => s.roleName === "Judge").length;
  const mentorCount = staffInvites.filter((s) => s.roleName === "Mentor").length;
  const ecCount = staffInvites.filter((s) => s.roleName === "EventCoordinator").length;

  const isStep2Done = Boolean(
    rounds.length > 0 &&
    rounds.every((r) => {
      const scoringEnd = r.scoringEndDate || (r as any).ScoringEndDate;
      return (
        r.roundName?.trim() &&
        r.startDate &&
        r.endDate &&
        scoringEnd &&
        new Date(r.startDate) <= new Date(r.endDate)
      );
    })
  );
  const isStep3Done = Boolean(tracks.length > 0 && tracks.every((t) => t.trackName?.trim()));

  const handlePublish = async (isPublic: boolean) => {
    if (isPublic && !canPublishEvent) return;
    setIsPublishing(true);
    setPublishSuccess(null);

    try {
      if (isPublic) {
        if (onPublish) await onPublish();
        else if (eventId) await eventsRepository.updateEvent(eventId, { status: true } as any);
        setPublishSuccess("Đã CÔNG BỐ sự kiện thành công! Thí sinh đã có thể đăng ký tham gia.");
      } else {
        if (onSaveDraft) await onSaveDraft();
        else if (eventId) await eventsRepository.updateEvent(eventId, { status: false } as any);
        setPublishSuccess("Đã LƯU BẢN NHÁP an toàn.");
      }

      setIsPublishing(false);

      if (redirectUrl) {
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1200);
      }
    } catch (err: any) {
      setIsPublishing(false);
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider">
            Bước 6: Xác Nhận &amp; Công Bố Sự Kiện
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Kiểm tra tổng kết các bước cấu hình trước khi phát hành sự kiện lên trang chủ.
          </p>
        </div>
        <span
          className={`font-mono text-xs font-bold px-3 py-1 rounded self-start md:self-auto ${
            currentStatus
              ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)] border border-[var(--color-success)]/30"
              : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
          }`}
        >
          {currentStatus ? "TRẠNG THÁI: CÔNG KHAI" : "TRẠNG THÁI: BẢN NHÁP"}
        </span>
      </div>

      {/* Success Banner */}
      {publishSuccess && (
        <div className="p-4 bg-[rgba(16,185,129,0.15)] border border-[var(--color-success)] text-[var(--color-success)] font-mono text-xs flex items-center gap-2 hud-clipped">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      {/* 4 Summary Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Vòng thi */}
        <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--accent-primary)] flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> VÒNG THI
            </span>
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isStep2Done
                  ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {isStep2Done ? "ĐÃ XONG" : "CHƯA XONG"}
            </span>
          </div>
          <div className="font-mono text-base font-bold text-[var(--text-primary)]">
            {rounds.length} Vòng Thi
          </div>
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {rounds.map((r) => r.roundName).join(" ➔ ") || "Chưa thiết lập"}
          </p>
        </div>

        {/* 2. Hạng mục */}
        <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--accent-team)] flex items-center gap-1.5">
              <Target className="w-4 h-4" /> HẠNG MỤC THI
            </span>
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isStep3Done
                  ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {isStep3Done ? "ĐÃ XONG" : "CHƯA XONG"}
            </span>
          </div>
          <div className="font-mono text-base font-bold text-[var(--text-primary)]">
            {tracks.length} Hạng Mục
          </div>
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {tracks.map((t) => t.trackName).join(", ") || "Chưa thiết lập"}
          </p>
        </div>

        {/* 3. Tiêu chí */}
        <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> TIÊU CHÍ CHẤM
            </span>
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                canPublishEvent
                  ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {canPublishEvent ? "100% ĐẠT CHUẨN" : "CẦN 100%"}
            </span>
          </div>
          <div className="font-mono text-base font-bold text-[var(--text-primary)]">
            {tracks.length > 0 ? `${tracks.length} Bảng Tiêu Chí` : "Chưa có"}
          </div>
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            Trọng số đánh giá RBL
          </p>
        </div>

        {/* 4. Nhân sự */}
        <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--accent-mentor)] flex items-center gap-1.5">
              <Users className="w-4 h-4" /> NHÂN SỰ
            </span>
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                judgeCount > 0
                  ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {judgeCount > 0 ? "ĐÃ CÓ GIÁM KHẢO" : "THIẾU GIÁM KHẢO"}
            </span>
          </div>
          <div className="font-mono text-base font-bold text-[var(--text-primary)]">
            {staffInvites.length} Nhân Sự
          </div>
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {judgeCount} Giám Khảo | {mentorCount} Cố Vấn | {ecCount} EC
          </p>
        </div>
      </div>

      {/* Validation Checklist if not publishable */}
      {!canPublishEvent && validationMissingItems.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs hud-clipped space-y-2">
          <div className="font-bold flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>ĐIỀU KIỆN CẦN HOÀN TẤT ĐỂ CÔNG BỐ SỰ KIỆN:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] pl-2 text-red-200">
            {validationMissingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-muted)]">
        <Button variant="ghost" onClick={onPrev} className="flex items-center gap-1.5 text-xs font-mono">
          <ArrowLeft className="w-4 h-4" /> Quay Lại Chỉnh Sửa
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => handlePublish(false)}
            disabled={isPublishing}
            className="flex-1 sm:flex-initial text-xs font-mono flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isPublishing ? "Đang lưu..." : "Lưu Bản Nháp"}</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => handlePublish(true)}
            disabled={!canPublishEvent || isPublishing}
            className={`flex-1 sm:flex-initial text-xs font-mono flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
              canPublishEvent
                ? "bg-[var(--color-success)] text-white hover:opacity-90"
                : "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>{isPublishing ? "Đang công bố..." : "CÔNG BỐ SỰ KIỆN"}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
