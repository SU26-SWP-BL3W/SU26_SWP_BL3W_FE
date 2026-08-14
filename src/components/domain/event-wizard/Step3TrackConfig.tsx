"use client";

import React from "react";
import { Button, Input, Card } from "@/components/ui";
import { RoundFormState, TrackFormState } from "@/viewModels/useCreateEventWizardViewModel";
import { Target, Plus, Trash2, ArrowLeft, LayoutTemplate } from "lucide-react";

interface Step3TrackConfigProps {
  rounds: RoundFormState[];
  tracks: TrackFormState[];
  onAddTrack: () => void;
  onRemoveTrack: (id: string) => void;
  onUpdateTrack: (id: string, field: keyof TrackFormState, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3TrackConfig: React.FC<Step3TrackConfigProps> = ({
  tracks,
  onAddTrack,
  onRemoveTrack,
  onUpdateTrack,
  onNext,
  onPrev,
}) => {
  return (
    <Card className="hud-glow-team p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--accent-team)]" />
            Bước 3: Tạo Hạng Mục Thi (Tracks)
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Cấu hình các Hạng mục chuyên môn thuộc Sự kiện (ví dụ: AI & ML, Web & Product, Game Dev...).
          </p>
        </div>
        <Button variant="ghost" onClick={onAddTrack} className="flex items-center gap-1 text-xs">
          <Plus className="w-4 h-4 text-[var(--accent-team)]" />
          + Thêm Hạng Mục
        </Button>
      </div>

      <div className="space-y-4">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] hover:border-[var(--accent-team)]/50 transition-all hud-clipped space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-team)]/10 text-[var(--accent-team)] border border-[var(--accent-team)]/30 font-mono text-xs font-bold flex items-center justify-center">
                  T{index + 1}
                </span>
                <h4 className="font-mono font-bold text-sm text-[var(--text-primary)]">
                  {track.trackName || `Hạng mục ${index + 1}`}
                </h4>
              </div>
              {tracks.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveTrack(track.id)}
                  className="text-xs font-mono text-[var(--color-danger)] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Gỡ Hạng Mục
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tên Hạng Mục */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Tên Hạng Mục (TrackName)</label>
                <Input
                  type="text"
                  value={track.trackName}
                  onChange={(e) => onUpdateTrack(track.id, "trackName", e.target.value)}
                  placeholder="e.g. AI & Machine Learning"
                />
              </div>

              {/* Mẫu tiêu chí TemplateId */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <LayoutTemplate className="w-3 h-3 text-[var(--accent-team)]" />
                  Mẫu Tiêu Chí (Template)
                </label>
                <select
                  value={track.templateId}
                  onChange={(e) => onUpdateTrack(track.id, "templateId", e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped"
                >
                  <option value="tpl-default-ai">Mẫu Chuẩn SEAL AI & Tech (100%)</option>
                  <option value="tpl-default-web">Mẫu Khảo Sát Web & Product (100%)</option>
                  <option value="tpl-custom">Mẫu Tự Chỉnh ở Bước 4</option>
                </select>
              </div>

              {/* Mô tả hạng mục */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Mô Tả & Quy Định Nộp Bài</label>
                <Input
                  type="text"
                  value={track.description}
                  onChange={(e) => onUpdateTrack(track.id, "description", e.target.value)}
                  placeholder="Mô tả phạm vi đề bài hoặc yêu cầu nộp bài cho hạng mục này..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)]">
        <Button variant="ghost" onClick={onPrev} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> &lt; Quay Lại Bước 2
        </Button>
        <Button variant="primary" onClick={onNext} className="flex items-center gap-2">
          Chỉnh Sửa Tiêu Chí (Criteria) &gt;
        </Button>
      </div>
    </Card>
  );
};
