"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  Target,
  Sliders,
  Users,
  Rocket,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import {
  useCreateEventWizardViewModel,
  type StepState,
} from "@/viewModels/useCreateEventWizardViewModel";
import { Step1EventBasicInfo } from "@/components/domain/event-wizard/Step1EventBasicInfo";
import { Step2RoundConfig } from "@/components/domain/event-wizard/Step2RoundConfig";
import { Step3TrackConfig } from "@/components/domain/event-wizard/Step3TrackConfig";
import { Step4TemplateCriteriaEditor } from "@/components/domain/event-wizard/Step4TemplateCriteriaEditor";
import { Step5StaffAssignment } from "@/components/domain/event-wizard/Step5StaffAssignment";
import { Step6EventConfirmation } from "@/components/domain/event-wizard/Step6EventConfirmation";
import { useGetTemplates } from "@/repositories/templatesRepository";

export const CreateEventWizardView: React.FC = () => {
  const wizard = useCreateEventWizardViewModel();
  const { data: templates = [] } = useGetTemplates();

  const steps = [
    { number: 1, label: "Tạo Event", icon: Shield },
    { number: 2, label: "Vòng Thi", icon: Layers },
    { number: 3, label: "Hạng Mục", icon: Target },
    { number: 4, label: "Tiêu Chí", icon: Sliders },
    { number: 5, label: "Nhân Sự", icon: Users },
    { number: 6, label: "Công Bố", icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex flex-col">
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 py-8 space-y-8">
        {/* Top Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] mb-2">
              <Link href="/coordinator/dashboard" className="hover:text-[var(--accent-coordinator)] flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Coordinator Dashboard
              </Link>
              <span>/</span>
              <span className="text-[var(--accent-coordinator)] font-bold">Khởi Tạo Sự Kiện Mới</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-3">
              <Shield className="w-8 h-8 text-[var(--accent-coordinator)]" />
              TẠO SỰ KIỆN & CẤU HÌNH VÒNG THI (RBL MATRIX)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              // THIẾT LẬP THEO QUY TRÌNH 6 BƯỚC CHUẨN — DỮ LIỆU ĐƯỢC LƯU TỪNG BƯỚC
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[var(--text-muted)]">TIẾN ĐỘ:</span>
            <span className="px-2 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-bold">
              BƯỚC {wizard.currentStep} / 6
            </span>
            <span className="text-[var(--border-muted)]">|</span>
            <span className="text-[var(--accent-primary)] font-bold">CẤU HÌNH BAN TỔ CHỨC</span>
          </div>
        </div>

        {/* HUD Step Indicator Bar (3-State True Reflection) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {steps.map((step) => {
            const isActive = wizard.currentStep === step.number;
            const state: StepState = wizard.stepStateMap?.[step.number] ?? "pending";
            const isClickable = step.number === 1 || Boolean(wizard.createdEvent) || step.number <= wizard.currentStep;

            return (
              <button
                key={step.number}
                type="button"
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) wizard.setCurrentStep(step.number);
                }}
                className={`p-3 border text-left transition-all duration-200 hud-clipped flex items-center gap-2.5 relative group ${
                  !isClickable
                    ? "opacity-40 cursor-not-allowed bg-[var(--bg-panel)]/20 border-[var(--border-muted)]/50 text-[var(--text-muted)]"
                    : isActive
                    ? "bg-[rgba(6,182,212,0.15)] border-2 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] text-cyan-300 scale-[1.02] z-10 cursor-pointer"
                    : state === "completed"
                    ? "bg-[rgba(16,185,129,0.1)] border-[var(--color-success)] text-[var(--color-success)] hover:bg-[rgba(16,185,129,0.2)] cursor-pointer"
                    : state === "incomplete"
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                    : "bg-[var(--bg-panel)]/40 border-[var(--border-muted)] text-[var(--text-muted)] hover:border-slate-500 hover:text-[var(--text-primary)] cursor-pointer"
                }`}
              >
                {/* Status Icon / Number Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? "bg-cyan-400 text-black shadow-[0_0_8px_#22d3ee] font-black"
                      : state === "completed"
                      ? "bg-[var(--color-success)] text-black"
                      : state === "incomplete"
                      ? "bg-amber-400 text-black font-bold"
                      : "bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-muted)]"
                  }`}
                >
                  {isActive ? (
                    <span>{step.number}</span>
                  ) : state === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                  ) : state === "incomplete" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest block text-[var(--text-muted)]">
                      Bước {step.number}
                    </span>

                    {/* Step Status Badge */}
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isActive
                          ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 animate-pulse"
                          : state === "completed"
                          ? "bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/30"
                          : state === "incomplete"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isActive ? "⚡ Đang làm" : state === "completed" ? "✓ Xong" : state === "incomplete" ? "⚠ Thiếu" : "Chờ"}
                    </span>
                  </div>

                  <span
                    className={`font-mono font-bold text-xs truncate block mt-0.5 ${
                      isActive
                        ? "text-cyan-200"
                        : state === "completed"
                        ? "text-[var(--color-success)]"
                        : state === "incomplete"
                        ? "text-amber-300"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Error Banner */}
        {wizard.errorMessage && (
          <div className="p-4 bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)] text-[var(--color-danger)] font-mono text-xs hud-clipped flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-[var(--color-danger)]" />
            <span>{wizard.errorMessage}</span>
          </div>
        )}

        {/* Step Component View */}
        <div className="transition-all duration-300">
          {wizard.currentStep === 1 && (
            <Step1EventBasicInfo
              eventData={wizard.eventData}
              onUpdateField={wizard.handleUpdateEventField}
              onNext={wizard.handleNextStep}
              isSubmitting={wizard.isSubmitting}
            />
          )}

          {wizard.currentStep === 2 && (
            <Step2RoundConfig
              rounds={wizard.rounds}
              onAddRound={wizard.handleAddRound}
              onRemoveRound={wizard.handleRemoveRound}
              onUpdateRound={wizard.handleUpdateRound}
              onNext={wizard.handleNextStep}
              onPrev={wizard.handlePrevStep}
            />
          )}

          {wizard.currentStep === 3 && (
            <Step3TrackConfig
              rounds={wizard.rounds}
              tracks={wizard.tracks}
              onAddTrack={wizard.handleAddTrack}
              onRemoveTrack={wizard.handleRemoveTrack}
              onUpdateTrack={wizard.handleUpdateTrack}
              onNext={wizard.handleNextStep}
              onPrev={wizard.handlePrevStep}
            />
          )}

          {wizard.currentStep === 4 && (
            <Step4TemplateCriteriaEditor
              tracks={wizard.tracks}
              templates={templates}
              criteriasByTrack={wizard.criteriasByTrack}
              onUpdateTrackCriterias={wizard.setCriteriasForTrack}
              onApplyToAllTracks={wizard.applyCriteriasToAllTracks}
              templateName={wizard.templateName}
              onUpdateTemplateName={wizard.setTemplateName}
              criterias={wizard.criterias}
              totalWeight={wizard.totalWeight}
              isValidWeight100={wizard.isValidWeight100}
              onAddCriteria={wizard.handleAddCriteria}
              onRemoveCriteria={wizard.handleRemoveCriteria}
              onUpdateCriteria={wizard.handleUpdateCriteria}
              onNext={wizard.handleNextStep}
              onPrev={wizard.handlePrevStep}
            />
          )}

          {wizard.currentStep === 5 && (
            <Step5StaffAssignment
              tracks={wizard.tracks}
              staffInvites={wizard.staffInvites}
              onAddStaffInvite={wizard.handleAddStaffInvite}
              onRemoveStaffInvite={wizard.handleRemoveStaffInvite}
              onFinish={wizard.handleNextStep}
              onPrev={wizard.handlePrevStep}
              isSubmitting={wizard.isSubmitting}
              successMessage={wizard.successMessage}
            />
          )}

          {wizard.currentStep === 6 && (
            <Step6EventConfirmation
              eventId={(wizard.createdEvent as any)?.id || (wizard.createdEvent as any)?.Id}
              eventData={wizard.eventData}
              rounds={wizard.rounds}
              tracks={wizard.tracks}
              criterias={wizard.criterias}
              staffInvites={wizard.staffInvites}
              canPublishEvent={wizard.canPublishEvent}
              validationMissingItems={wizard.validationMissingItems}
              onPrev={wizard.handlePrevStep}
            />
          )}
        </div>
      </main>
    </div>
  );
};
