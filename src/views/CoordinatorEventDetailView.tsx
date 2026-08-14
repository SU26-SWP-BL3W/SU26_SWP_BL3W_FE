"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Input, Badge } from "@/components/ui";
import { useEventDetail, useEventRounds, eventsRepository } from "@/repositories/eventsRepository";
import { useGetTracksByEvent, tracksRepository } from "@/repositories/tracksRepository";
import { useGetTemplates } from "@/repositories/templatesRepository";
import { roundsRepository } from "@/repositories/roundsRepository";
import { Shield, Settings, Layers, Target, Users, Save, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle, Edit3, LayoutTemplate } from "lucide-react";
import Link from "next/link";

export const CoordinatorEventDetailView: React.FC = () => {
  const params = useParams();
  const eventId = (params?.id as string) || "";

  const { data: event, isLoading: isLoadingEvent, refetch: refetchEvent } = useEventDetail(eventId);
  const { data: rounds = [], refetch: refetchRounds } = useEventRounds(eventId);
  const { data: tracks = [], refetch: refetchTracks } = useGetTracksByEvent(eventId);
  const { data: templates = [] } = useGetTemplates();

  const [activeTab, setActiveTab] = useState<"general" | "rounds" | "tracks" | "staff">("general");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form State General
  const [eventName, setEventName] = useState("");
  const [season, setSeason] = useState("");
  const [year, setYear] = useState<number>(2026);
  const [maxTeams, setMaxTeams] = useState<number>(50);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sync Form when event data arrives
  React.useEffect(() => {
    if (event) {
      setEventName(event.eventName || (event as any).EventName || event.name || "");
      setSeason(event.season || (event as any).Season || "");
      setYear(event.year || (event as any).Year || 2026);
      setMaxTeams(event.maxTeams || (event as any).MaxTeams || 50);
      setDescription(event.description || (event as any).Description || "");
      setStartDate(event.startDate ? event.startDate.split("T")[0] : "");
      setEndDate(event.endDate ? event.endDate.split("T")[0] : "");
    }
  }, [event]);

  // Round Creation State
  const [newRoundName, setNewRoundName] = useState("");
  const [newRoundNumber, setNewRoundNumber] = useState<number>(1);
  const [newAdvancementRule, setNewAdvancementRule] = useState("top 10");

  // Track Creation State
  const [newTrackName, setNewTrackName] = useState("");
  const [newTrackDesc, setNewTrackDesc] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Đang lưu...");
    try {
      await eventsRepository.updateEvent(eventId, {
        eventName,
        season,
        year,
        maxTeams,
        description,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      await refetchEvent();
      setSaveStatus("Cập nhật thông tin sự kiện thành công!");
    } catch {
      setSaveStatus("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleCreateRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoundName.trim()) return;
    try {
      const nowIso = new Date().toISOString();
      const nextWeekIso = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await roundsRepository.createRound({
        eventId,
        roundName: newRoundName,
        roundNumber: newRoundNumber,
        startDate: nowIso,
        endDate: nextWeekIso,
        advancementRule: newAdvancementRule,
      });
      setNewRoundName("");
      await refetchRounds();
    } catch {
      alert("Khởi tạo Vòng thi thất bại.");
    }
  };

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackName.trim()) return;
    try {
      await tracksRepository.createTrack({
        eventId,
        trackName: newTrackName,
        description: newTrackDesc,
        templateId: selectedTemplateId || undefined,
      });
      setNewTrackName("");
      setNewTrackDesc("");
      await refetchTracks();
    } catch {
      alert("Khởi tạo Hạng mục thất bại.");
    }
  };

  const handleAssignTemplate = async (trackId: string, templateId: string) => {
    try {
      await tracksRepository.assignTemplateToTrack(trackId, templateId);
      await refetchTracks();
      alert("Gán Mẫu tiêu chí thành công!");
    } catch {
      alert("Gán Mẫu tiêu chí thất bại.");
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <svg className="w-12 h-12 animate-spin mx-auto text-[var(--accent-coordinator)]" viewBox="0 0 100 100">
            <polygon points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="240" strokeDashoffset="60" />
          </svg>
          <p className="font-mono text-xs text-[var(--text-muted)]">Đang tải thông tin chi tiết sự kiện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex flex-col">
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Header Back & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-6">
          <div>
            <Link href="/coordinator/dashboard" className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent-coordinator)] hover:underline mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>&lt; QUAY LẠI DASHBOARD</span>
            </Link>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-3">
              <Shield className="w-7 h-7 text-[var(--accent-coordinator)]" />
              {eventName || "Chi Tiết Sự Kiện"}
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              ID: {eventId} | {season} {year} | Quy mô: {maxTeams} Đội thi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/events/${eventId}`}>
              <Button variant="secondary" className="hud-clipped font-mono text-xs">
                XEM TRANG PUBLIC &gt;
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Tabs Selector */}
        <div className="flex items-center gap-2 border-b border-[var(--border-muted)] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "general"
                ? "border-[var(--accent-coordinator)] text-[var(--accent-coordinator)] bg-[var(--accent-coordinator)]/10"
                : "border-transparent text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Tab 1: Thông Tin Chung
          </button>

          <button
            onClick={() => setActiveTab("rounds")}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "rounds"
                ? "border-[var(--accent-coordinator)] text-[var(--accent-coordinator)] bg-[var(--accent-coordinator)]/10"
                : "border-transparent text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            Tab 2: Vòng Thi ({rounds.length})
          </button>

          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "tracks"
                ? "border-[var(--accent-coordinator)] text-[var(--accent-coordinator)] bg-[var(--accent-coordinator)]/10"
                : "border-transparent text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Target className="w-4 h-4" />
            Tab 3: Hạng Mục ({(tracks ?? []).length})
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "staff"
                ? "border-[var(--accent-coordinator)] text-[var(--accent-coordinator)] bg-[var(--accent-coordinator)]/10"
                : "border-transparent text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Tab 4: Phân Công Nhân Sự
          </button>
        </div>

        {/* Tab 1: General Info */}
        {activeTab === "general" && (
          <Card className="hud-glow-coordinator p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase">Chỉnh Sửa Thông Tin Sự Kiện</h3>
                <p className="text-xs text-[var(--text-muted)] font-sans">Cập nhật tiêu đề, quy mô và mốc thời gian sự kiện qua API PUT /Events/{eventId}</p>
              </div>
              {saveStatus && (
                <span className="font-mono text-xs text-[var(--accent-coordinator)] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {saveStatus}
                </span>
              )}
            </div>

            <form onSubmit={handleUpdateGeneral} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-muted)]">Tên Sự Kiện</label>
                  <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-muted)]">Mùa Giải</label>
                    <Input type="text" value={season} onChange={(e) => setSeason(e.target.value)} placeholder="VD: Mùa Hè" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-muted)]">Năm</label>
                    <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-muted)]">Thời Gian Bắt Đầu</label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-muted)]">Thời Gian Kết Thúc</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-muted)]">Quy Mô Đội Thi Tối Đa</label>
                  <Input type="number" value={maxTeams} onChange={(e) => setMaxTeams(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-muted)]">Mô Tả Chi Tiết Sự Kiện</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--accent-coordinator)]"
                />
              </div>

              <Button type="submit" variant="primary" accent="coordinator" className="hud-clipped font-mono text-xs flex items-center gap-2">
                <Save className="w-4 h-4" /> LƯU THAY ĐỔI SỰ KIỆN
              </Button>
            </form>
          </Card>
        )}

        {/* Tab 2: Rounds Management */}
        {activeTab === "rounds" && (
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-[var(--accent-coordinator)]" />
                Thêm Vòng Thi Mới Vào Sự Kiện
              </h3>

              <form onSubmit={handleCreateRound} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input type="text" value={newRoundName} onChange={(e) => setNewRoundName(e.target.value)} placeholder="Tên vòng (e.g. Vòng sơ loại)" required />
                <Input type="number" value={newRoundNumber} onChange={(e) => setNewRoundNumber(Number(e.target.value))} placeholder="Số thứ tự vòng" />
                <Input type="text" value={newAdvancementRule} onChange={(e) => setNewAdvancementRule(e.target.value)} placeholder="Quy tắc qua vòng (top 10)" />
                <Button type="submit" variant="primary" accent="coordinator" className="text-xs font-mono">
                  + KÍCH HOẠT VÒNG
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              {rounds.map((rnd: any, index: number) => (
                <Card key={rnd.id || rnd.Id || index} className="p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone="info">Vòng {rnd.roundNumber || rnd.RoundNumber || index + 1}</Badge>
                      <h4 className="font-mono font-bold text-sm text-[var(--text-primary)]">{rnd.roundName || rnd.RoundName}</h4>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                      Rule qua vòng: {rnd.advancementRule || rnd.AdvancementRule || "Chưa thiết lập"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-xs font-mono text-[var(--color-danger)]">
                      <Trash2 className="w-3.5 h-3.5" /> Xóa vòng
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Tracks Management */}
        {activeTab === "tracks" && (
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-[var(--accent-coordinator)]" />
                Thêm Hạng Mục Chuyên Môn Mới
              </h3>

              <form onSubmit={handleCreateTrack} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="text" value={newTrackName} onChange={(e) => setNewTrackName(e.target.value)} placeholder="Tên Hạng mục (VD: AI & Machine Learning)" required />
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs"
                  >
                    <option value="">-- Chọn Mẫu Tiêu Chí (Template) --</option>
                    {templates.map((tpl: any) => (
                      <option key={tpl.id || tpl.Id || tpl.templateId} value={tpl.id || tpl.Id || tpl.templateId}>
                        {tpl.templateName || tpl.TemplateName} (Weight 100%)
                      </option>
                    ))}
                  </select>
                </div>

                <Input type="text" value={newTrackDesc} onChange={(e) => setNewTrackDesc(e.target.value)} placeholder="Mô tả phạm vi đề bài hạng mục..." />

                <Button type="submit" variant="primary" accent="coordinator" className="text-xs font-mono">
                  + KHỞI TẠO HẠNG MỤC
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              {(tracks ?? []).map((trk: any, index: number) => {
                const trkId = trk.id || trk.Id || trk.trackId || "";
                return (
                  <Card key={trkId || index} className="p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                        <Target className="w-4 h-4 text-[var(--accent-team)]" />
                        {trk.trackName || trk.TrackName}
                      </h4>
                      <Badge tone="neutral">ID: {trkId}</Badge>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] font-sans">{trk.description || trk.Description || "Chưa có mô tả"}</p>

                    <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-muted)]">
                      <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                        <LayoutTemplate className="w-3.5 h-3.5 text-[var(--accent-coordinator)]" />
                        Template: {trk.templateId ? "Đã gán" : "Chưa gán"}
                      </span>

                      <select
                        onChange={(e) => handleAssignTemplate(trkId, e.target.value)}
                        defaultValue={trk.templateId || ""}
                        className="px-2 py-1 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs"
                      >
                        <option value="">-- Gán lại Mẫu chấm --</option>
                        {templates.map((tpl: any) => (
                          <option key={tpl.id || tpl.Id} value={tpl.id || tpl.Id}>
                            {tpl.templateName || tpl.TemplateName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Event Staff */}
        {activeTab === "staff" && (
          <Card className="p-6 space-y-4 text-center">
            <Users className="w-10 h-10 text-[var(--accent-coordinator)] opacity-60 mx-auto" />
            <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase">Phân Công Nhân Sự Giám Khảo &amp; Cố Vấn</h3>
            <p className="text-xs text-[var(--text-muted)] font-sans max-w-md mx-auto">
              Chuyển sang trang Quản lý Nhân sự Tổng thể để thực hiện mời mới và gỡ phân công cho sự kiện này.
            </p>
            <Link href="/coordinator/staff">
              <Button variant="primary" accent="coordinator" className="text-xs font-mono">
                QUẢN LÝ NHÂN SỰ TOÀN DIỆN &gt;
              </Button>
            </Link>
          </Card>
        )}

      </main>
    </div>
  );
};
