"use client";

import React from "react";
import { Button, Input, Card } from "@/components/ui";
import { TemplateCriteriaFormState } from "@/viewModels/useCreateEventWizardViewModel";
import { MOCK_DEFAULT_CRITERIAS } from "@/repositories/templatesRepository";
import { Sliders, Plus, Trash2, ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, Award } from "lucide-react";

interface Step4TemplateCriteriaEditorProps {
  templateName: string;
  onUpdateTemplateName: (name: string) => void;
  criterias: TemplateCriteriaFormState[];
  totalWeight: number;
  isValidWeight100: boolean;
  onAddCriteria: (obj?: Partial<TemplateCriteriaFormState>) => void;
  onRemoveCriteria: (index: number) => void;
  onUpdateCriteria: (index: number, field: keyof TemplateCriteriaFormState, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4TemplateCriteriaEditor: React.FC<Step4TemplateCriteriaEditorProps> = ({
  templateName,
  onUpdateTemplateName,
  criterias,
  totalWeight,
  isValidWeight100,
  onAddCriteria,
  onRemoveCriteria,
  onUpdateCriteria,
  onNext,
  onPrev,
}) => {
  return (
    <Card className="hud-glow-amber p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--accent-judge)]" />
            Bước 4: Thiết Lập Tiêu Chí & Trọng Số Chấm Điểm
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Actor: Event Coordinator (POST /api/Templates, PATCH /api/Tracks/assign-template). Bắt buộc tổng trọng số đạt ĐÚNG 100% trước khi kích hoạt.
          </p>
        </div>

        {/* Dynamic Weight Status Badge */}
        <div
          className={`px-4 py-2 border hud-clipped flex items-center gap-2 font-mono text-xs font-bold ${
            isValidWeight100
              ? "bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] border-[var(--color-success)]"
              : "bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)] border-[var(--color-warning)]"
          }`}
        >
          {isValidWeight100 ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
              <span>TỔNG TRỌNG SỐ: 100% (ĐẠT CHUẨN)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
              <span>TỔNG TRỌNG SỐ: {totalWeight}% (YÊU CẦU = 100%)</span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar visual */}
      <div className="space-y-1">
        <div className="flex justify-between font-mono text-[10px] text-[var(--text-muted)] uppercase">
          <span>Tiến trình cân bằng trọng số:</span>
          <span>{totalWeight}% / 100%</span>
        </div>
        <div className="w-full h-2 bg-[var(--bg-input)] border border-[var(--border-muted)] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              totalWeight > 100
                ? "bg-[var(--color-danger)]"
                : isValidWeight100
                ? "bg-[var(--color-success)] shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                : "bg-[var(--accent-judge)]"
            }`}
            style={{ width: `${Math.min(totalWeight, 100)}%` }}
          />
        </div>
      </div>

      {/* Template Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
          Tên Mẫu Tiêu Chí (Template Name)
        </label>
        <Input
          type="text"
          value={templateName}
          onChange={(e) => onUpdateTemplateName(e.target.value)}
          placeholder="e.g. Mẫu Đánh Giá Hackathon SEAL 2026"
          className="w-full"
        />
      </div>

      {/* Preset Pickers */}
      <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-2">
        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
          Chọn mẫu tiêu chí gợi ý từ ngân hàng tiêu chí SEAL:
        </span>
        <div className="flex flex-wrap gap-2">
          {MOCK_DEFAULT_CRITERIAS.map((item) => (
            <button
              key={item.CriteriaId}
              type="button"
              onClick={() =>
                onAddCriteria({
                  criteriaId: item.CriteriaId,
                  criterionName: item.CriterionName,
                  description: item.Description ?? undefined,
                  weight: item.Weight,
                  maxScore: item.MaxScore,
                })
              }
              className="px-3 py-1 bg-[var(--bg-input)] hover:bg-[var(--accent-judge)]/10 text-[var(--text-primary)] hover:text-[var(--accent-judge)] border border-[var(--border-muted)] hover:border-[var(--accent-judge)] font-mono text-xs transition-colors hud-clipped flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-[var(--accent-judge)]" />
              + {item.CriterionName} ({item.Weight}%)
            </button>
          ))}
        </div>
      </div>

      {/* Criteria Table List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Danh Sách Tiêu Chí Chấm Điểm ({criterias.length})
          </h4>
          <Button
            variant="ghost"
            onClick={() =>
              onAddCriteria({
                criterionName: "Tiêu chí chấm điểm mới",
                weight: 10,
                maxScore: 10,
              })
            }
            className="flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> + Thêm Tiêu Chí Tùy Chỉnh
          </Button>
        </div>

        <div className="space-y-3">
          {criterias.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-[var(--bg-panel)] border-l-2 border-[var(--accent-judge)] border border-[var(--border-muted)] space-y-3 hud-clipped"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <Input
                    type="text"
                    value={item.criterionName}
                    onChange={(e) => onUpdateCriteria(index, "criterionName", e.target.value)}
                    placeholder="Tên tiêu chí..."
                    className="font-mono font-bold text-sm text-[var(--accent-judge)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveCriteria(index)}
                  className="text-xs font-mono text-[var(--color-danger)] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Mô Tả Tiêu Chí</label>
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => onUpdateCriteria(index, "description", e.target.value)}
                    placeholder="Mô tả chi tiết cách thức giám khảo chấm..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Trọng Số (Weight %)</label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={item.weight}
                      onChange={(e) => onUpdateCriteria(index, "weight", e.target.value)}
                      className="font-mono font-bold text-center text-[var(--accent-judge)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Điểm Tối Đa (MaxScore)</label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={item.maxScore}
                      onChange={(e) => onUpdateCriteria(index, "maxScore", e.target.value)}
                      className="font-mono font-bold text-center text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)]">
        <Button variant="ghost" onClick={onPrev} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> &lt; Quay Lại Bước 3
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!isValidWeight100}
          className="flex items-center gap-2"
        >
          {!isValidWeight100 ? "Yêu Cầu Đủ 100% Để Tiếp Tục" : "Tiếp Tục Phân Công Nhân Sự >"}
        </Button>
      </div>
    </Card>
  );
};
