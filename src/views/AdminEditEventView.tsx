"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Card, Badge } from "@/components/ui";
import { useEventDetail, useEventRounds, eventsRepository } from "@/repositories/eventsRepository";
import { useGetTracksByEvent, tracksRepository } from "@/repositories/tracksRepository";
import { useGetTemplates, templatesRepository } from "@/repositories/templatesRepository";
import { roundsRepository } from "@/repositories/roundsRepository";
import { staffRepository, useGetEventRoles } from "@/repositories/staffRepository";
import { usersRepository } from "@/repositories/usersRepository";
import { Step2RoundConfig } from "@/components/domain/event-wizard/Step2RoundConfig";
import { Step3TrackConfig } from "@/components/domain/event-wizard/Step3TrackConfig";
import { Step4TemplateCriteriaEditor } from "@/components/domain/event-wizard/Step4TemplateCriteriaEditor";
import { Step5StaffAssignment } from "@/components/domain/event-wizard/Step5StaffAssignment";
import { Step6EventConfirmation } from "@/components/domain/event-wizard/Step6EventConfirmation";
import {
  RoundFormState,
  TrackFormState,
  TemplateCriteriaFormState,
  StaffInviteFormState,
} from "@/viewModels/useCreateEventWizardViewModel";
import { RefreshCw, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function toDateInputValue(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

export const AdminEditEventView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = (params?.id as string) || "";

  // Main Tab Switcher
  const [activeMainTab, setActiveMainTab] = useState<"info" | "config">("info");

  // Config Sub-step Switcher
  const [configStep, setConfigStep] = useState<number>(2);

  // Queries
  const { data: rawEvent, isLoading: isLoadingEvent, refetch: refetchEvent } = useEventDetail(eventId);
  const { data: serverRounds = [], refetch: refetchRounds } = useEventRounds(eventId);
  const { data: serverTracks = [], refetch: refetchTracks } = useGetTracksByEvent(eventId);
  const { data: templates = [] } = useGetTemplates();
  const { data: serverStaff = [], refetch: refetchRoles } = useGetEventRoles(eventId);

  const ev = (rawEvent as any) ?? {};

  // Form State Tab 1
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    eventName: "",
    season: "",
    year: 2026,
    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    description: "",
    coordinatorEmail: "",
    maxTeams: 50,
  });

  // State Tab 2 (Config)
  const [rounds, setRounds] = useState<RoundFormState[]>([]);
  const [tracks, setTracks] = useState<TrackFormState[]>([]);
  const [criterias, setCriterias] = useState<TemplateCriteriaFormState[]>([]);
  const [criteriasByTrack, setCriteriasByTrack] = useState<Record<string, TemplateCriteriaFormState[]>>({});
  const [templateName, setTemplateName] = useState<string>("Mẫu Tiêu Chí Chuẩn SEAL");
  const [staffInvites, setStaffInvites] = useState<StaffInviteFormState[]>([]);
  const [status, setStatus] = useState<boolean>(true);

  // Sync Data
  useEffect(() => {
    if (rawEvent) {
      setForm({
        eventName: ev.eventName || ev.EventName || ev.name || "",
        season: ev.season || ev.Season || "Mùa Hè",
        year: Number(ev.year || ev.Year || 2026),
        startDate: toDateInputValue(ev.startDate || ev.StartDate),
        endDate: toDateInputValue(ev.endDate || ev.EndDate),
        registrationStartDate: toDateInputValue(ev.registrationStartDate || ev.RegistrationStartDate || ev.startDate || ev.StartDate),
        registrationEndDate: toDateInputValue(ev.registrationEndDate || ev.RegistrationEndDate || ev.endDate || ev.EndDate),
        description: ev.description || ev.Description || "",
        coordinatorEmail: ev.coordinatorEmail || ev.CoordinatorEmail || "",
        maxTeams: Number(ev.maxTeams || ev.MaxTeams || 50),
      });
      setStatus(ev.status ?? true);
    }
  }, [rawEvent]);

  useEffect(() => {
    if (serverRounds.length > 0) {
      setRounds(
        serverRounds.map((r: any, idx: number) => ({
          id: r.id || r.Id || r.roundId || `round-${idx}`,
          roundName: r.roundName || r.RoundName || `Vòng ${idx + 1}`,
          roundNumber: r.roundNumber || r.RoundNumber || idx + 1,
          startDate: r.startDate || r.StartDate || "",
          endDate: r.endDate || r.EndDate || "",
          scoringStartDate: r.scoringStartDate || r.ScoringStartDate || "",
          scoringEndDate: r.scoringEndDate || r.ScoringEndDate || "",
          appealStartDate: r.appealStartDate || r.AppealStartDate || "",
          appealEndDate: r.appealEndDate || r.AppealEndDate || "",
          advancementRule: r.advancementRule || r.AdvancementRule || "top 10",
        }))
      );
    }
  }, [serverRounds]);

  useEffect(() => {
    if (serverTracks.length > 0) {
      setTracks(
        serverTracks.map((t: any, idx: number) => ({
          id: t.id || t.Id || t.trackId || `track-${idx}`,
          trackName: t.trackName || t.TrackName || `Hạng Mục ${idx + 1}`,
          templateId: t.templateId || t.TemplateId || "",
          description: t.description || t.Description || "",
        }))
      );
    }
  }, [serverTracks]);

  useEffect(() => {
    if (serverStaff.length > 0) {
      setStaffInvites(
        serverStaff.map((s: any, idx: number) => ({
          id: s.id || s.Id || `staff-${idx}`,
          email: s.userEmail || s.UserEmail || s.email || "",
          roleName: (s.roleName || s.RoleName || "Judge") as any,
          trackId: s.trackId || s.TrackId || undefined,
        }))
      );
    }
  }, [serverStaff]);

  // Tab 1 Save Handler
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!form.eventName.trim()) {
      setErrorMessage("Vui lòng nhập tên sự kiện.");
      return;
    }

    setIsSubmitting(true);
    try {
      const startIso = form.startDate ? new Date(form.startDate).toISOString() : new Date().toISOString();
      const endIso = form.endDate ? new Date(form.endDate).toISOString() : new Date().toISOString();
      const regStartIso = form.registrationStartDate ? new Date(form.registrationStartDate).toISOString() : startIso;
      const regEndIso = form.registrationEndDate ? new Date(form.registrationEndDate).toISOString() : endIso;

      await eventsRepository.updateEvent(eventId, {
        eventName: form.eventName,
        season: form.season,
        year: Number(form.year),
        startDate: startIso,
        endDate: endIso,
        registrationStartDate: regStartIso,
        registrationEndDate: regEndIso,
        description: form.description,
        maxTeams: Number(form.maxTeams),
      } as any);

      if (form.coordinatorEmail.trim()) {
        const foundUser = await usersRepository.findUserByEmail(form.coordinatorEmail.trim());
        if (foundUser) {
          const realUserId = foundUser.id || (foundUser as any).Id || (foundUser as any).userId || (foundUser as any).UserId;
          await staffRepository.assignRoleDirectly({
            userId: realUserId,
            eventId: eventId,
            roleName: "EventCoordinator",
          });
        }
      }

      setSuccessMessage("Đã lưu thông tin sự kiện thành công.");
      refetchEvent();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || "Lỗi lưu thông tin sự kiện.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab 2 Config Handlers
  const handleAddRound = () => {
    const nextNum = rounds.length + 1;
    setRounds([
      ...rounds,
      {
        id: `new-rnd-${Date.now()}`,
        roundName: `Vòng ${nextNum}`,
        roundNumber: nextNum,
        startDate: "",
        endDate: "",
        scoringStartDate: "",
        scoringEndDate: "",
        appealStartDate: "",
        appealEndDate: "",
        advancementRule: "top 10",
      },
    ]);
  };

  const handleRemoveRound = (id: string) => {
    setRounds(rounds.filter((r) => r.id !== id));
  };

  const handleUpdateRound = (id: string, field: keyof RoundFormState, value: any) => {
    setRounds(rounds.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleAddTrack = () => {
    setTracks([
      ...tracks,
      {
        id: `new-trk-${Date.now()}`,
        trackName: `Hạng Mục ${tracks.length + 1}`,
        templateId: "",
        description: "",
      },
    ]);
  };

  const handleRemoveTrack = (id: string) => {
    setTracks(tracks.filter((t) => t.id !== id));
  };

  const handleUpdateTrack = (id: string, field: keyof TrackFormState, value: any) => {
    setTracks(tracks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleAddStaff = (invite: StaffInviteFormState) => {
    setStaffInvites([...staffInvites, { ...invite, id: `staff-${Date.now()}` }]);
  };

  const handleRemoveStaff = (id: string) => {
    setStaffInvites(staffInvites.filter((s) => s.id !== id));
  };

  const handleSaveConfig = async (nextStatus?: boolean) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Update rounds
      for (const r of rounds) {
        const isNew = r.id.startsWith("new-rnd-");
        const payload: any = {
          eventId,
          roundName: r.roundName,
          roundNumber: r.roundNumber,
          advancementRule: r.advancementRule || "top 10",
          startDate: r.startDate ? new Date(r.startDate).toISOString() : new Date().toISOString(),
          endDate: r.endDate ? new Date(r.endDate).toISOString() : new Date().toISOString(),
          scoringStartDate: r.scoringStartDate ? new Date(r.scoringStartDate).toISOString() : undefined,
          scoringEndDate: r.scoringEndDate ? new Date(r.scoringEndDate).toISOString() : undefined,
        };
        if (isNew) await roundsRepository.createRound(payload);
        else await roundsRepository.updateRound(r.id, payload);
      }

      // 2. Update tracks
      for (const t of tracks) {
        const isNew = t.id.startsWith("new-trk-");
        const payload: any = {
          eventId,
          trackName: t.trackName,
          description: t.description || undefined,
        };
        if (isNew) await tracksRepository.createTrack(payload);
      }

      if (typeof nextStatus === "boolean") {
        await eventsRepository.updateEvent(eventId, { status: nextStatus } as any);
        setStatus(nextStatus);
      }

      setSuccessMessage("Đã lưu cấu hình sự kiện thành công.");
      refetchEvent();
      refetchRounds();
      refetchTracks();
      refetchRoles();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || "Lỗi lưu cấu hình sự kiện.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-[var(--color-danger)]">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span>Đang tải thông tin sự kiện...</span>
        </div>
      </div>
    );
  }

  const totalCriteriaWeight = criterias.reduce((s, c) => s + (Number(c.weight) || 0), 0);
  const isValidWeight100 = criterias.length === 0 || totalCriteriaWeight === 100;
  const judgeCount = staffInvites.filter((s) => s.roleName === "Judge").length;
  const canPublish = rounds.length > 0 && tracks.length > 0 && isValidWeight100 && judgeCount > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex flex-col">
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] mb-1">
              <Link href="/admin/dashboard" className="text-[var(--color-danger)] font-bold hover:underline">
                Bảng Điều Hành Admin
              </Link>
              <span>/</span>
              <span>Sự Kiện: {form.eventName || "..."}</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] uppercase tracking-wider">
              {form.eventName || "Quản Lý Sự Kiện"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/events/${eventId}`}>
              <Button variant="ghost" className="font-mono text-xs border border-[var(--border-muted)]">
                Xem Trang Public &gt;
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="font-mono text-xs border border-[var(--border-muted)]">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Về Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* 2 MAIN TABS SWITCHER */}
        <div className="flex border-b border-[var(--border-muted)] bg-[var(--bg-panel)] hud-clipped p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveMainTab("info")}
            className={`flex-1 py-3 px-6 font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeMainTab === "info"
                ? "bg-[var(--color-danger)] text-white shadow-md"
                : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-input)]"
            }`}
          >
            THÔNG TIN SỰ KIỆN
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab("config")}
            className={`flex-1 py-3 px-6 font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeMainTab === "config"
                ? "bg-[var(--color-danger)] text-white shadow-md"
                : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-input)]"
            }`}
          >
            CẤU HÌNH CHI TIẾT (VÒNG THI &amp; TIÊU CHÍ)
          </button>
        </div>

        {/* Global Notifications */}
        {errorMessage && (
          <div className="p-4 bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)] text-[var(--color-danger)] font-mono text-xs hud-clipped">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-4 bg-[rgba(16,185,129,0.1)] border border-[var(--color-success)] text-[var(--color-success)] font-mono text-xs hud-clipped flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: THÔNG TIN SỰ KIỆN */}
        {activeMainTab === "info" && (
          <Card className="p-6 space-y-6 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped">
            <form onSubmit={handleSaveInfo} className="space-y-6">
              
              {/* Tên & Mùa giải */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    Tên Sự Kiện *
                  </label>
                  <Input
                    type="text"
                    value={form.eventName}
                    onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                    className="w-full text-xs font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                      Mùa Giải
                    </label>
                    <Input
                      type="text"
                      value={form.season}
                      onChange={(e) => setForm({ ...form, season: e.target.value })}
                      className="w-full text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                      Năm
                    </label>
                    <Input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                      className="w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  Mô Tả &amp; Thể Lệ Sự Kiện
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--color-danger)] resize-none"
                />
              </div>

              {/* Mốc thời gian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                  <span className="text-xs font-mono text-[var(--color-danger)] uppercase font-bold block">
                    Cổng Đăng Ký Đội Thi
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">Ngày Mở:</span>
                      <Input
                        type="date"
                        value={form.registrationStartDate}
                        onChange={(e) => setForm({ ...form, registrationStartDate: e.target.value })}
                        className="w-full text-xs font-mono mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">Ngày Đóng:</span>
                      <Input
                        type="date"
                        value={form.registrationEndDate}
                        onChange={(e) => setForm({ ...form, registrationEndDate: e.target.value })}
                        className="w-full text-xs font-mono mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                  <span className="text-xs font-mono text-[var(--accent-primary)] uppercase font-bold block">
                    Khung Thời Gian Thi Đấu
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">Ngày Bắt Đầu:</span>
                      <Input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        className="w-full text-xs font-mono mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">Ngày Bế Mạc:</span>
                      <Input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        className="w-full text-xs font-mono mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quy mô & Phân công EC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    Số Lượng Đội Tối Đa
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={500}
                    value={form.maxTeams}
                    onChange={(e) => setForm({ ...form, maxTeams: Number(e.target.value) })}
                    className="w-full text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[var(--accent-coordinator)] uppercase font-bold">
                    Email Event Coordinator Phụ Trách
                  </label>
                  <Input
                    type="email"
                    placeholder="ec.coordinator@seal.edu.vn"
                    value={form.coordinatorEmail}
                    onChange={(e) => setForm({ ...form, coordinatorEmail: e.target.value })}
                    className="w-full text-xs font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-[var(--border-muted)]">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--color-danger)] text-white font-mono text-xs font-bold px-8 cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {isSubmitting ? "Đang lưu..." : "LƯU THÔNG TIN SỰ KIỆN"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 2: CẤU HÌNH CHI TIẾT (VÒNG THI & TIÊU CHÍ) */}
        {activeMainTab === "config" && (
          <div className="space-y-6">
            
            {/* Sub-steps Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { step: 2, label: "Vòng Thi", count: rounds.length },
                { step: 3, label: "Hạng Mục", count: tracks.length },
                { step: 4, label: "Tiêu Chí", count: criterias.length },
                { step: 5, label: "Giám Khảo", count: staffInvites.length },
                { step: 6, label: "Công Bố", count: status ? "Public" : "Draft" },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setConfigStep(s.step)}
                  className={`p-3 text-left border hud-clipped transition-all cursor-pointer ${
                    configStep === s.step
                      ? "bg-[rgba(239,68,68,0.15)] border-[var(--color-danger)] text-[var(--color-danger)] font-bold shadow-sm"
                      : "bg-[var(--bg-panel)] border-[var(--border-muted)] text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <div className="font-mono text-[10px] uppercase opacity-75">Bước {s.step}</div>
                  <div className="font-mono text-xs font-bold">{s.label} ({s.count})</div>
                </button>
              ))}
            </div>

            {/* Step 2: Vòng Thi */}
            {configStep === 2 && (
              <Step2RoundConfig
                rounds={rounds}
                onAddRound={handleAddRound}
                onRemoveRound={handleRemoveRound}
                onUpdateRound={handleUpdateRound}
                onNext={() => {
                  handleSaveConfig();
                  setConfigStep(3);
                }}
                onPrev={() => setActiveMainTab("info")}
                isReadOnly={false}
              />
            )}

            {/* Step 3: Hạng Mục */}
            {configStep === 3 && (
              <Step3TrackConfig
                tracks={tracks}
                templates={templates}
                onAddTrack={handleAddTrack}
                onRemoveTrack={handleRemoveTrack}
                onUpdateTrack={handleUpdateTrack}
                onNext={() => {
                  handleSaveConfig();
                  setConfigStep(4);
                }}
                onPrev={() => setConfigStep(2)}
                isReadOnly={false}
              />
            )}

            {/* Step 4: Tiêu Chí */}
            {configStep === 4 && (
              <Step4TemplateCriteriaEditor
                criterias={criterias}
                onUpdateCriteria={(id, f, val) => {
                  setCriterias(criterias.map((c) => (c.id === id ? { ...c, [f]: val } : c)));
                }}
                onAddCriteria={() => {
                  setCriterias([
                    ...criterias,
                    {
                      id: `crit-${Date.now()}`,
                      criteriaName: "Tiêu chí mới",
                      weight: 10,
                      maxScore: 10,
                      description: "",
                    },
                  ]);
                }}
                onRemoveCriteria={(id) => setCriterias(criterias.filter((c) => c.id !== id))}
                templateName={templateName}
                onChangeTemplateName={setTemplateName}
                onNext={() => {
                  handleSaveConfig();
                  setConfigStep(5);
                }}
                onPrev={() => setConfigStep(3)}
                tracks={tracks}
                criteriasByTrack={criteriasByTrack}
                onUpdateCriteriaForTrack={(trackId, id, f, val) => {
                  const curr = criteriasByTrack[trackId] || criterias;
                  setCriteriasByTrack({
                    ...criteriasByTrack,
                    [trackId]: curr.map((c) => (c.id === id ? { ...c, [f]: val } : c)),
                  });
                }}
                onAddCriteriaForTrack={(trackId) => {
                  const curr = criteriasByTrack[trackId] || criterias;
                  setCriteriasByTrack({
                    ...criteriasByTrack,
                    [trackId]: [
                      ...curr,
                      { id: `crit-${Date.now()}`, criteriaName: "Tiêu chí mới", weight: 10, maxScore: 10, description: "" },
                    ],
                  });
                }}
                onRemoveCriteriaForTrack={(trackId, id) => {
                  const curr = criteriasByTrack[trackId] || criterias;
                  setCriteriasByTrack({
                    ...criteriasByTrack,
                    [trackId]: curr.filter((c) => c.id !== id),
                  });
                }}
                isReadOnly={false}
              />
            )}

            {/* Step 5: Nhân Sự & Giám Khảo */}
            {configStep === 5 && (
              <Step5StaffAssignment
                staffInvites={staffInvites}
                tracks={tracks}
                onAddStaff={handleAddStaff}
                onRemoveStaff={handleRemoveStaff}
                onNext={() => {
                  handleSaveConfig();
                  setConfigStep(6);
                }}
                onPrev={() => setConfigStep(4)}
                isReadOnly={false}
              />
            )}

            {/* Step 6: Xác Nhận & Công Bố */}
            {configStep === 6 && (
              <Step6EventConfirmation
                eventData={{
                  eventName: form.eventName,
                  season: form.season,
                  year: form.year,
                  startDate: form.startDate,
                  endDate: form.endDate,
                  registrationStartDate: form.registrationStartDate,
                  registrationEndDate: form.registrationEndDate,
                  maxTeams: form.maxTeams,
                  tagline: "",
                  description: form.description,
                }}
                rounds={rounds}
                tracks={tracks}
                criterias={criterias}
                staffInvites={staffInvites}
                onPublish={() => handleSaveConfig(true)}
                onSaveDraft={() => handleSaveConfig(false)}
                isSubmitting={isSubmitting}
                onPrev={() => setConfigStep(5)}
                eventId={eventId}
                currentStatus={status}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};
