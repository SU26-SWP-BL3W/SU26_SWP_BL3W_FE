"use client";

import React from "react";
import { Button, Input, Card, Table } from "@/components/ui";
import { RoundFormState } from "@/viewModels/useCreateEventWizardViewModel";
import { Layers, Plus, Trash2, Calendar, ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";

interface Step2RoundConfigProps {
  rounds: RoundFormState[];
  onAddRound: () => void;
  onRemoveRound: (id: string) => void;
  onUpdateRound: (id: string, field: keyof RoundFormState, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2RoundConfig: React.FC<Step2RoundConfigProps> = ({
  rounds,
  onAddRound,
  onRemoveRound,
  onUpdateRound,
  onNext,
  onPrev,
}) => {
  return (
    <Card className="hud-glow-coordinator p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent-coordinator)]" />
            Bước 2: Cấu Hình Vòng Thi (Rounds)
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Actor: Event Coordinator (POST /api/Rounds). Thiết lập danh sách các vòng thi, mốc thời gian nộp bài & quy tắc thăng hạng (AdvancementRule).
          </p>
        </div>
        <Button variant="ghost" onClick={onAddRound} className="flex items-center gap-1 text-xs">
          <Plus className="w-4 h-4 text-[var(--accent-coordinator)]" />
          + Thêm Vòng Thi
        </Button>
      </div>

      <div className="space-y-4">
        {rounds.map((round, index) => (
          <div
            key={round.id}
            className="p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] hover:border-[var(--accent-coordinator)]/50 transition-all hud-clipped space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-coordinator)]/10 text-[var(--accent-coordinator)] border border-[var(--accent-coordinator)]/30 font-mono text-xs font-bold flex items-center justify-center">
                  #{round.roundNumber}
                </span>
                <h4 className="font-mono font-bold text-sm text-[var(--text-primary)]">
                  Vòng {round.roundNumber}: {round.roundName}
                </h4>
              </div>
              {rounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRound(round.id)}
                  className="text-xs font-mono text-[var(--color-danger)] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Gỡ Vòng
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tên vòng */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Tên Vòng Thi</label>
                <Input
                  type="text"
                  value={round.roundName}
                  onChange={(e) => onUpdateRound(round.id, "roundName", e.target.value)}
                  placeholder="Ví dụ: Vòng Loại / Chung Kết"
                />
              </div>

              {/* Ngày Bắt Đầu & Ngày Kết Thúc */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[var(--accent-coordinator)]" />
                  Từ Ngày (StartDate)
                </label>
                <Input
                  type="date"
                  value={round.startDate}
                  onChange={(e) => onUpdateRound(round.id, "startDate", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[var(--accent-coordinator)]" />
                  Đến Ngày (EndDate)
                </label>
                <Input
                  type="date"
                  value={round.endDate}
                  onChange={(e) => onUpdateRound(round.id, "endDate", e.target.value)}
                />
              </div>

              {/* Quy tắc thăng hạng AdvancementRule */}
              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  Quy Tắc Thăng Hạng (AdvancementRule - Ví dụ: "top 10", "percent 50%", "minScore 7.0")
                </label>
                <div className="flex gap-2">
                  <select
                    value={
                      round.advancementRule.startsWith("top")
                        ? "top"
                        : round.advancementRule.startsWith("percent")
                        ? "percent"
                        : "minScore"
                    }
                    onChange={(e) => {
                      const prefix = e.target.value;
                      onUpdateRound(round.id, "advancementRule", `${prefix} 10`);
                    }}
                    className="px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped"
                  >
                    <option value="top">Lấy Top N Đội Thi (e.g. top 10)</option>
                    <option value="percent">Lấy % Số Đội (e.g. percent 50)</option>
                    <option value="minScore">Điểm Tối Thiểu (e.g. minScore 7.5)</option>
                  </select>
                  <Input
                    type="text"
                    value={round.advancementRule}
                    onChange={(e) => onUpdateRound(round.id, "advancementRule", e.target.value)}
                    placeholder="e.g. top 10"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)]">
        <Button variant="ghost" onClick={onPrev} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> &lt; Quay Lại Bước 1
        </Button>
        <Button variant="primary" onClick={onNext} className="flex items-center gap-2">
          Tiếp Tục Cấu Hình Hạng Mục (Tracks) &gt;
        </Button>
      </div>
    </Card>
  );
};
