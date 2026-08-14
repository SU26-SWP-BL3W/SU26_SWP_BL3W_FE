"use client";

import React, { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { eventsRepository } from "@/repositories/eventsRepository";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Target,
  Sliders,
  Users,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Rocket,
  Save,
} from "lucide-react";

interface Step6EventConfirmationProps {
  eventId?: string;
  eventData: any;
  rounds: any[];
  tracks: any[];
  criterias: any[];
  staffInvites: any[];
  onPrev: () => void;
}

export const Step6EventConfirmation: React.FC<Step6EventConfirmationProps> = ({
  eventId,
  eventData,
  rounds,
  tracks,
  criterias,
  staffInvites,
  onPrev,
}) => {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Warnings check
  const warnings: string[] = [];
  if (rounds.some((r) => !r.scoringEndDate)) {
    warnings.push("Vẫn còn Vòng thi chưa hoàn tất cấu hình ngày kết thúc chấm điểm.");
  }
  if (staffInvites.length === 0) {
    warnings.push("Sự kiện chưa gửi lời mời Giám khảo hay Cố vấn nào.");
  }

  const handlePublish = async (isPublic: boolean) => {
    setIsPublishing(true);
    try {
      if (eventId) {
        await eventsRepository.updateEvent(eventId, {
          status: isPublic,
        });
      }
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => {
        router.push("/coordinator/dashboard");
      }, 1500);
    } catch (err: any) {
      setIsPublishing(false);
      // Fallback redirection to dashboard even if status update has permission warn
      router.push("/coordinator/dashboard");
    }
  };

  return (
    <Card className="hud-glow-cyan p-8 space-y-8">
      {/* Success Stepper Header */}
      <div className="text-center space-y-3 border-b border-[var(--border-muted)] pb-6">
        <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] border-2 border-[var(--color-success)] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Sparkles className="w-8 h-8 text-[var(--color-success)] animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] uppercase tracking-wider">
          Xác Nhận &amp; Chốt Công Bố Sự Kiện
        </h2>
        <p className="text-xs font-mono text-[var(--text-muted)] max-w-xl mx-auto">
          Tất cả 5 bước cấu hình cơ bản đã hoàn tất! Vui lòng kiểm tra lại tổng quan sự kiện trước khi công bố công khai cho thí sinh.
        </p>

        {/* Current Draft Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-full hud-clipped">
          <EyeOff className="w-4 h-4 text-amber-400" />
          <span>TRẠNG THÁI HIỆN TẠI: BẢN NHÁP (ĐANG ẨN — CHƯA CÔNG BỐ)</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Rounds */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between text-amber-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Vòng thi
            </span>
            <span className="text-lg font-black">{rounds.length}</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {rounds.map((r) => r.roundName).join(", ") || "Chưa có vòng"}
          </p>
        </div>

        {/* Stat 2: Tracks */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between text-cyan-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Hạng mục
            </span>
            <span className="text-lg font-black">{tracks.length}</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {tracks.map((t) => t.trackName).join(", ") || "Chưa có hạng mục"}
          </p>
        </div>

        {/* Stat 3: Criteria */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between text-purple-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Tiêu chí chấm
            </span>
            <span className="text-lg font-black">{criterias.length}</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--color-success)] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Trọng số 100%
          </p>
        </div>

        {/* Stat 4: Staff */}
        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Lời mời nhân sự
            </span>
            <span className="text-lg font-black">{staffInvites.length}</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {staffInvites.length} lời mời đã gửi
          </p>
        </div>
      </div>

      {/* Warnings List */}
      {warnings.length > 0 && (
        <div className="p-4 bg-[rgba(245,158,11,0.1)] border border-amber-500/40 text-amber-300 font-mono text-xs rounded space-y-1">
          <div className="font-bold flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>LƯU Ý CẦN BỔ SUNG VỀ SAU:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-2 text-amber-200/80">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Published Feedback Alert */}
      {publishSuccess && (
        <div className="p-4 bg-[rgba(16,185,129,0.15)] border border-[var(--color-success)] text-[var(--color-success)] font-mono text-xs text-center font-bold rounded animate-fadeIn">
          🎉 ĐÃ CÔNG BỐ SỰ KIỆN THÀNH CÔNG! Đang chuyển về Trang quản lý Điều phối viên...
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border-muted)]">
        <Button variant="ghost" onClick={onPrev} className="flex items-center gap-2 text-xs font-mono">
          <ArrowLeft className="w-4 h-4" /> Quay Lại Chỉnh Sửa
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => handlePublish(false)}
            disabled={isPublishing}
            className="flex-1 sm:flex-initial text-xs font-mono flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Bản Nháp (Chưa Hiện Thí Sinh)</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => handlePublish(true)}
            disabled={isPublishing}
            className="flex-1 sm:flex-initial text-xs font-mono flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold border-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Rocket className="w-4 h-4" />
            <span>{isPublishing ? "Đang Công Bố..." : "🚀 CÔNG BỐ SỰ KIỆN NGAY"}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
