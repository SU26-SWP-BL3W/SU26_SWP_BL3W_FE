"use client";

import React, { useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import { RoundFormState, TrackFormState } from "@/viewModels/useCreateEventWizardViewModel";
import { useGetTemplates } from "@/repositories/templatesRepository";
import { Target, Plus, Trash2, ArrowLeft, LayoutTemplate, Calendar, ChevronDown, ChevronUp, CheckSquare, FileText, Code2, Video, Globe, FileSpreadsheet, Palette } from "lucide-react";

interface Step3TrackConfigProps {
  rounds?: RoundFormState[];
  tracks: TrackFormState[];
  templates?: any[];
  onAddTrack: () => void;
  onRemoveTrack: (id: string) => void;
  onUpdateTrack: (id: string, field: keyof TrackFormState, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly?: boolean;
}

const DEFAULT_DELIVERABLES = [
  { key: "github", label: "Mã Nguồn (GitHub / GitLab Repo)", icon: Code2, required: true },
  { key: "slides", label: "Slide Thuyết Trình (Pitch Deck / PPT)", icon: FileSpreadsheet, required: true },
  { key: "deployed_url", label: "Sản Phẩm Trực Tuyến (Live Demo URL)", icon: Globe, required: true },
  { key: "demo_video", label: "Video Demo & Thuyết Trình (YouTube / Loom)", icon: Video, required: false },
  { key: "report", label: "Báo Cáo Kỹ Thuật (PDF Report)", icon: FileText, required: false },
  { key: "figma", label: "Bản Thiết Kế UI/UX (Figma Prototype)", icon: Palette, required: false },
];

export const Step3TrackConfig: React.FC<Step3TrackConfigProps> = ({
  tracks,
  templates: propTemplates,
  onAddTrack,
  onRemoveTrack,
  onUpdateTrack,
  onNext,
  onPrev,
  isReadOnly = false,
}) => {
  const { data: serverTemplates = [] } = useGetTemplates();
  const templates = propTemplates || serverTemplates;
  const [expandedScheduleTrackId, setExpandedScheduleTrackId] = useState<string | null>(null);

  const toggleCustomSchedule = (id: string) => {
    setExpandedScheduleTrackId(expandedScheduleTrackId === id ? null : id);
  };

  return (
    <Card className="p-6 space-y-6 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] tracking-wider flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--accent-team)]" />
            Bước 3: Tạo Hạng Mục Thi &amp; Yêu Cầu Nộp Bài
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Cấu hình các Hạng mục chuyên môn và thiết lập các định dạng bài nộp bắt buộc đối với thí sinh.
          </p>
        </div>
        {!isReadOnly && (
          <Button variant="ghost" onClick={onAddTrack} className="flex items-center gap-1 text-xs border border-[var(--accent-team)]/40 text-[var(--accent-team)]">
            <Plus className="w-4 h-4" />
            + Thêm Hạng Mục
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="p-5 bg-[var(--bg-input)] border border-[var(--border-muted)] hover:border-[var(--accent-team)]/50 transition-all hud-clipped space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-team)]/15 text-[var(--accent-team)] border border-[var(--accent-team)]/30 font-mono text-xs font-bold flex items-center justify-center">
                  T{index + 1}
                </span>
                <h4 className="font-mono font-bold text-sm text-[var(--text-primary)]">
                  {track.trackName || `Hạng mục ${index + 1}`}
                </h4>
              </div>
              {!isReadOnly && tracks.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveTrack(track.id)}
                  className="text-xs font-mono text-[var(--color-danger)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Gỡ Hạng Mục
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tên Hạng Mục */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-muted)] uppercase">Tên Hạng Mục *</label>
                <Input
                  type="text"
                  value={track.trackName}
                  onChange={(e) => onUpdateTrack(track.id, "trackName", e.target.value)}
                  placeholder="Ví dụ: AI & Machine Learning"
                  disabled={isReadOnly}
                  className="w-full text-xs font-mono"
                />
              </div>

              {/* Mẫu tiêu chí TemplateId */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <LayoutTemplate className="w-3.5 h-3.5 text-[var(--accent-team)]" />
                  Mẫu Tiêu Chí Đánh Giá RBL
                </label>
                <select
                  value={track.templateId}
                  onChange={(e) => onUpdateTrack(track.id, "templateId", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped disabled:opacity-50"
                >
                  <option value="">— Chọn mẫu tiêu chí từ hệ thống —</option>
                  {templates.map((t: any) => (
                    <option key={t.id || t.Id || t.templateId} value={t.id || t.Id || t.templateId}>
                      {t.templateName || t.TemplateName}
                    </option>
                  ))}
                  <option value="__custom__">Tự tạo mẫu tiêu chí mới ở Bước 4</option>
                </select>
              </div>

              {/* Mô tả & Hướng dẫn nộp bài */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-mono text-[var(--text-muted)] uppercase">Mô Tả Đề Bài &amp; Hướng Dẫn Nộp Bài</label>
                <textarea
                  rows={3}
                  value={track.description}
                  onChange={(e) => onUpdateTrack(track.id, "description", e.target.value)}
                  placeholder="Phạm vi đề bài, giới hạn công nghệ, quy định nộp bài..."
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent-team)] resize-none"
                />
              </div>
            </div>

            {/* Cấu Hình Yêu Cầu Nộp Bài (Deliverables) */}
            <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--accent-team)] uppercase font-bold flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" /> Các Hình Thức Nộp Bài Thí Sinh Cần Cung Cấp
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Hiển thị trực tiếp trên trang Nộp bài của Thí sinh
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DEFAULT_DELIVERABLES.map((deliv) => {
                  const Icon = deliv.icon;
                  return (
                    <label
                      key={deliv.key}
                      className="p-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] rounded flex items-center gap-2.5 cursor-pointer hover:border-[var(--accent-team)]/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={deliv.required}
                        disabled={isReadOnly}
                        className="rounded border-[var(--border-muted)] text-[var(--accent-team)] focus:ring-0"
                      />
                      <Icon className="w-3.5 h-3.5 text-[var(--accent-team)] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-[var(--text-primary)] leading-none">
                          {deliv.label.split("(")[0].trim()}
                        </span>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] mt-0.5">
                          {deliv.required ? "Bắt buộc" : "Tùy chọn"}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Cấu hình Lịch trình Riêng cho Track (Tùy Chọn) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleCustomSchedule(track.id)}
                className="text-xs font-mono text-[var(--accent-team)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                {expandedScheduleTrackId === track.id ? "Ẩn lịch trình riêng" : "+ Lịch trình nộp/chấm bài riêng cho Hạng mục này (Tùy chọn)"}
                {expandedScheduleTrackId === track.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {expandedScheduleTrackId === track.id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 p-3 bg-[var(--bg-panel)] border border-[var(--border-muted)] rounded font-mono text-xs animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--text-muted)] uppercase">Bắt đầu nộp bài riêng</label>
                    <Input
                      type="datetime-local"
                      value={track.startDate || ""}
                      onChange={(e) => onUpdateTrack(track.id, "startDate", e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[var(--text-muted)] uppercase">Hạn chót nộp bài riêng</label>
                    <Input
                      type="datetime-local"
                      value={track.endDate || ""}
                      onChange={(e) => onUpdateTrack(track.id, "endDate", e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)] font-mono text-xs">
        <Button variant="ghost" onClick={onPrev} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> &lt; Bước 2: Vòng Thi
        </Button>
        <Button variant="primary" onClick={onNext} className="flex items-center gap-1 bg-[var(--color-danger)] text-white font-bold px-6">
          Tiếp Tục: Thiết Lập Tiêu Chí Chấm &gt;
        </Button>
      </div>
    </Card>
  );
};
