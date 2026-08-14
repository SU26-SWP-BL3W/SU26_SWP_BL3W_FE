"use client";

import React from "react";
import { Button, Input, Card } from "@/components/ui";
import { RoundFormState } from "@/viewModels/useCreateEventWizardViewModel";
import { Layers, Plus, Trash2, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

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
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent-coordinator)]" />
            Bước 2: Cấu Hình Vòng Thi &amp; Mốc Thời Gian
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Thiết lập danh sách các vòng thi, mốc nộp bài, thời gian chấm điểm, phúc khảo và quy tắc chuyển vòng.
          </p>
        </div>
        <Button variant="ghost" onClick={onAddRound} className="flex items-center gap-1 text-xs">
          <Plus className="w-4 h-4 text-[var(--accent-coordinator)]" />
          + Thêm Vòng Thi
        </Button>
      </div>

      <div className="space-y-6">
        {rounds.map((round, index) => {
          const isLastRound = index === rounds.length - 1;
          const ruleParts = round.advancementRule.split(/[:\s]/);
          const currentType = (ruleParts[0] || "top").toLowerCase();
          const currentValue = ruleParts[1] || "10";

          return (
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

              {/* Tên vòng & Quy tắc thăng vòng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-muted)]">Tên vòng thi *</label>
                  <Input
                    type="text"
                    value={round.roundName}
                    onChange={(e) => onUpdateRound(round.id, "roundName", e.target.value)}
                    placeholder="Ví dụ: Vòng Sơ Loại / Vòng Bán Kết"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-muted)]">Điều kiện qua vòng *</label>
                  {!isLastRound ? (
                    <div className="flex gap-2">
                      <select
                        value={currentType === "percent" || currentType === "minscore" ? currentType : "top"}
                        onChange={(e) => {
                          const prefix = e.target.value;
                          const defaultVal = prefix === "top" ? "10" : prefix === "percent" ? "50" : "7.0";
                          onUpdateRound(round.id, "advancementRule", `${prefix}:${defaultVal}`);
                        }}
                        className="px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped"
                      >
                        <option value="top">Top N đội cao điểm nhất</option>
                        <option value="percent">Top N% số đội</option>
                        <option value="minscore">Điểm tối thiểu N</option>
                      </select>
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          type="number"
                          step={currentType === "minscore" ? "0.1" : "1"}
                          min={currentType === "minscore" ? "0" : "1"}
                          max={currentType === "minscore" ? "10" : "100"}
                          value={currentValue}
                          onChange={(e) => onUpdateRound(round.id, "advancementRule", `${currentType}:${e.target.value}`)}
                          className="flex-1 font-mono text-xs"
                        />
                        <span className="px-2 py-1.5 bg-[var(--bg-base)] border border-[var(--border-muted)] text-xs font-mono font-bold text-[var(--accent-coordinator)]">
                          {currentType === "top" ? "đội" : currentType === "percent" ? "%" : "điểm"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[var(--bg-base)] border border-[var(--border-muted)] text-xs text-[var(--text-muted)] rounded font-sans italic">
                      Vòng cuối — kết quả dùng để xếp hạng và trao giải, không thăng vòng.
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline datetime grid */}
              <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-coordinator)] border-b border-[var(--border-muted)] pb-2">
                  <Calendar className="w-4 h-4 text-[var(--accent-coordinator)]" />
                  <span>Mốc thời gian của vòng</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {/* Nộp bài */}
                  <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                    <span className="text-[11px] font-bold text-amber-400">1. Mở nộp bài</span>
                    <Input
                      type="date"
                      value={round.startDate}
                      onChange={(e) => onUpdateRound(round.id, "startDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                    <span className="text-[11px] font-bold text-amber-400">2. Hạn chót nộp bài</span>
                    <Input
                      type="date"
                      value={round.endDate}
                      onChange={(e) => onUpdateRound(round.id, "endDate", e.target.value)}
                    />
                  </div>

                  {/* Chấm điểm */}
                  <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                    <span className="text-[11px] font-bold text-cyan-400">3. Bắt đầu chấm</span>
                    <Input
                      type="date"
                      value={round.scoringStartDate || round.endDate || ""}
                      onChange={(e) => onUpdateRound(round.id, "scoringStartDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                    <span className="text-[11px] font-bold text-cyan-400">4. Kết thúc chấm</span>
                    <Input
                      type="date"
                      value={round.scoringEndDate || ""}
                      onChange={(e) => onUpdateRound(round.id, "scoringEndDate", e.target.value)}
                    />
                  </div>

                  {/* Phúc khảo */}
                  <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                    <span className="text-[11px] font-bold text-purple-400">5. Mở phúc khảo</span>
                    <Input
                      type="date"
                      value={round.appealStartDate || ""}
                      onChange={(e) => onUpdateRound(round.id, "appealStartDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                    <span className="text-[11px] font-bold text-purple-400">6. Đóng phúc khảo</span>
                    <Input
                      type="date"
                      value={round.appealEndDate || ""}
                      onChange={(e) => onUpdateRound(round.id, "appealEndDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)]">
        <Button variant="ghost" onClick={onPrev} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Quay Lại
        </Button>
        <Button variant="primary" onClick={onNext} className="flex items-center gap-2">
          Tiếp Theo: Cấu Hình Hạng Mục &gt; <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
