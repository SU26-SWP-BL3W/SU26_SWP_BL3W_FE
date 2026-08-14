"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Input, Badge } from "@/components/ui";
import { useEventDetail, useEventRounds, eventsRepository } from "@/repositories/eventsRepository";
import { useGetTracksByEvent, tracksRepository } from "@/repositories/tracksRepository";
import { useGetTemplates } from "@/repositories/templatesRepository";
import { roundsRepository } from "@/repositories/roundsRepository";
import { uploadRepository } from "@/repositories/uploadRepository";
import { staffRepository, useGetEventRoles } from "@/repositories/staffRepository";
import { Shield, Settings, Layers, Target, Users, Save, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle, Edit3, LayoutTemplate, Upload, Image, UserCheck, UserPlus, Send } from "lucide-react";
import Link from "next/link";

export const CoordinatorEventDetailView: React.FC = () => {
  const params = useParams();
  const eventId = (params?.id as string) || "";

  const { data: event, isLoading: isLoadingEvent, refetch: refetchEvent } = useEventDetail(eventId);
  const { data: rounds = [], refetch: refetchRounds } = useEventRounds(eventId);
  const { data: tracks = [], refetch: refetchTracks } = useGetTracksByEvent(eventId);
  const { data: templates = [] } = useGetTemplates();
  const { data: eventRoles = [], refetch: refetchRoles } = useGetEventRoles(eventId);

  const [activeTab, setActiveTab] = useState<"general" | "rounds" | "tracks" | "staff">("general");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Staff State
  const [judgeEmail, setJudgeEmail] = useState("");
  const [judgeTrackId, setJudgeTrackId] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [mentorTrackId, setMentorTrackId] = useState("");
  const [judgeMessage, setJudgeMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [mentorMessage, setMentorMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmittingJudge, setIsSubmittingJudge] = useState(false);
  const [isSubmittingMentor, setIsSubmittingMentor] = useState(false);

  // Form State General
  const [eventName, setEventName] = useState("");
  const [season, setSeason] = useState("");
  const [year, setYear] = useState<number>(2026);
  const [maxTeams, setMaxTeams] = useState<number>(50);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationStartDate, setRegistrationStartDate] = useState("");
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [photoEventUrl, setPhotoEventUrl] = useState("");
  const [status, setStatus] = useState<boolean>(true);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const res = await uploadRepository.uploadFile(file);
      const url = res.data?.fileUrl || (res.data as any)?.url;
      if (url) {
        setPhotoEventUrl(url);
      }
    } catch {
      alert("Tải ảnh lên thất bại, vui lòng thử lại.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Sync Form when event data arrives
  React.useEffect(() => {
    if (event) {
      const ev = event as any;
      setEventName(ev.eventName || ev.EventName || ev.name || "");
      setSeason(ev.season || ev.Season || "");
      setYear(ev.year || ev.Year || 2026);
      setMaxTeams(ev.maxTeams || ev.MaxTeams || 50);
      setDescription(ev.description || ev.Description || "");
      setStartDate(ev.startDate ? ev.startDate.split("T")[0] : ev.StartDate ? ev.StartDate.split("T")[0] : "");
      setEndDate(ev.endDate ? ev.endDate.split("T")[0] : ev.EndDate ? ev.EndDate.split("T")[0] : "");
      setRegistrationStartDate(ev.registrationStartDate ? ev.registrationStartDate.split("T")[0] : ev.RegistrationStartDate ? ev.RegistrationStartDate.split("T")[0] : "");
      setRegistrationEndDate(ev.registrationEndDate ? ev.registrationEndDate.split("T")[0] : ev.RegistrationEndDate ? ev.RegistrationEndDate.split("T")[0] : "");
      setPhotoEventUrl(ev.photoEventUrl || ev.PhotoEventUrl || "");
      setStatus(ev.status !== undefined ? Boolean(ev.status) : ev.Status !== undefined ? Boolean(ev.Status) : true);
    }
  }, [event]);

  // Round Creation State
  const [newRoundName, setNewRoundName] = useState("");
  const [newRuleType, setNewRuleType] = useState<"top" | "percent" | "minscore">("top");
  const [newRuleValue, setNewRuleValue] = useState<number>(10);
  const [roundStartDate, setRoundStartDate] = useState("");
  const [roundEndDate, setRoundEndDate] = useState("");
  const [roundScoringStartDate, setRoundScoringStartDate] = useState("");
  const [roundScoringEndDate, setRoundScoringEndDate] = useState("");
  const [roundAppealStartDate, setRoundAppealStartDate] = useState("");
  const [roundAppealEndDate, setRoundAppealEndDate] = useState("");

  const newRoundNumber = (rounds?.length || 0) + 1;

  const handleRuleTypeChange = (type: "top" | "percent" | "minscore", isEdit = false) => {
    if (isEdit) {
      setEditRuleType(type);
      if (type === "top") setEditRuleValue(10);
      else if (type === "percent") setEditRuleValue(50);
      else if (type === "minscore") setEditRuleValue(7.0);
    } else {
      setNewRuleType(type);
      if (type === "top") setNewRuleValue(10);
      else if (type === "percent") setNewRuleValue(50);
      else if (type === "minscore") setNewRuleValue(7.0);
    }
  };

  const validateRoundTimeline = (
    rStart: string,
    rEnd: string,
    sStart: string,
    sEnd: string,
    aStart?: string,
    aEnd?: string,
    currentRoundNum?: number
  ): string | null => {
    if (!rStart || !rEnd || !sStart || !sEnd) {
      return "Vui lòng nhập đầy đủ các mốc thời gian bắt buộc (Mở nộp bài, Hạn chót nộp, Bắt đầu chấm, Hạn chót chấm).";
    }

    const dRStart = new Date(rStart).getTime();
    const dREnd = new Date(rEnd).getTime();
    const dSStart = new Date(sStart).getTime();
    const dSEnd = new Date(sEnd).getTime();
    const dAStart = aStart ? new Date(aStart).getTime() : null;
    const dAEnd = aEnd ? new Date(aEnd).getTime() : null;

    if (dRStart >= dREnd) return "Hạn chót nộp bài phải sau ngày Mở nộp bài.";
    if (dSStart < dREnd) return "Thời gian Bắt đầu chấm bài không được trước Hạn chót nộp bài.";
    if (dSEnd <= dSStart) return "Hạn chót chấm điểm phải sau thời gian Bắt đầu chấm.";
    if (dAStart && dAStart < dSEnd) return "Thời gian Mở phúc khảo không được trước Hạn chót chấm điểm.";
    if (dAEnd && dAStart && dAEnd <= dAStart) return "Hạn chót phúc khảo phải sau ngày Mở phúc khảo.";

    const num = currentRoundNum || newRoundNumber;
    if (num > 1 && Array.isArray(rounds)) {
      const prevRound = rounds.find((r: any) => (r.roundNumber || r.RoundNumber) === num - 1);
      if (prevRound) {
        const prevEndStr = prevRound.scoringEndDate || prevRound.ScoringEndDate || prevRound.endDate || prevRound.EndDate;
        if (prevEndStr) {
          const prevEndTime = new Date(prevEndStr).getTime();
          if (dRStart < prevEndTime) {
            return `Vòng ${num} mở nộp bài (${rStart}) không được trước khi Vòng ${num - 1} hoàn tất chấm/phúc khảo.`;
          }
        }
      }
    }

    return null;
  };

  // Edit Round State
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editRoundName, setEditRoundName] = useState("");
  const [editRuleType, setEditRuleType] = useState<"top" | "percent" | "minscore">("top");
  const [editRuleValue, setEditRuleValue] = useState<number>(10);
  const [editRoundStartDate, setEditRoundStartDate] = useState("");
  const [editRoundEndDate, setEditRoundEndDate] = useState("");
  const [editRoundScoringStartDate, setEditRoundScoringStartDate] = useState("");
  const [editRoundScoringEndDate, setEditRoundScoringEndDate] = useState("");
  const [editRoundAppealStartDate, setEditRoundAppealStartDate] = useState("");
  const [editRoundAppealEndDate, setEditRoundAppealEndDate] = useState("");

  const startEditRound = (rnd: any) => {
    const rId = rnd.id || rnd.Id || rnd.roundId || rnd.RoundId;
    setEditingRoundId(rId);
    setEditRoundName(rnd.roundName || rnd.RoundName || "");

    const ruleStr = rnd.advancementRule || rnd.AdvancementRule || "top:10";
    const parts = ruleStr.split(":");
    const type = (parts[0] || "top").toLowerCase() as any;
    const val = Number(parts[1]) || 10;
    setEditRuleType(type === "percent" || type === "minscore" ? type : "top");
    setEditRuleValue(val);

    setEditRoundStartDate(rnd.startDate ? rnd.startDate.split("T")[0] : rnd.StartDate ? rnd.StartDate.split("T")[0] : "");
    setEditRoundEndDate(rnd.endDate ? rnd.endDate.split("T")[0] : rnd.EndDate ? rnd.EndDate.split("T")[0] : "");
    setEditRoundScoringStartDate(rnd.scoringStartDate ? rnd.scoringStartDate.split("T")[0] : rnd.ScoringStartDate ? rnd.ScoringStartDate.split("T")[0] : "");
    setEditRoundScoringEndDate(rnd.scoringEndDate ? rnd.scoringEndDate.split("T")[0] : rnd.ScoringEndDate ? rnd.ScoringEndDate.split("T")[0] : "");
    setEditRoundAppealStartDate(rnd.appealStartDate ? rnd.appealStartDate.split("T")[0] : rnd.AppealStartDate ? rnd.AppealStartDate.split("T")[0] : "");
    setEditRoundAppealEndDate(rnd.appealEndDate ? rnd.appealEndDate.split("T")[0] : rnd.AppealEndDate ? rnd.AppealEndDate.split("T")[0] : "");
  };

  const handleSaveEditRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoundId) return;

    const timelineErr = validateRoundTimeline(
      editRoundStartDate,
      editRoundEndDate,
      editRoundScoringStartDate,
      editRoundScoringEndDate,
      editRoundAppealStartDate,
      editRoundAppealEndDate
    );
    if (timelineErr) {
      alert(`Lỗi cấu hình mốc thời gian: ${timelineErr}`);
      return;
    }

    try {
      await roundsRepository.updateRound(editingRoundId, {
        roundName: editRoundName,
        advancementRule: `${editRuleType}:${editRuleValue}`,
        startDate: new Date(editRoundStartDate).toISOString(),
        endDate: new Date(editRoundEndDate).toISOString(),
        scoringStartDate: new Date(editRoundScoringStartDate).toISOString(),
        scoringEndDate: new Date(editRoundScoringEndDate).toISOString(),
        appealStartDate: editRoundAppealStartDate ? new Date(editRoundAppealStartDate).toISOString() : undefined,
        appealEndDate: editRoundAppealEndDate ? new Date(editRoundAppealEndDate).toISOString() : undefined,
      });
      setEditingRoundId(null);
      await refetchRounds();
      alert("Cập nhật Vòng thi thành công!");
    } catch (err: any) {
      alert(`Cập nhật Vòng thi thất bại: ${err?.response?.data?.message || err?.message}`);
    }
  };

  // Track Creation & Edit State
  const [newTrackName, setNewTrackName] = useState("");
  const [newTrackDesc, setNewTrackDesc] = useState("");
  const [newSubmissionRuleDesc, setNewSubmissionRuleDesc] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editTrackName, setEditTrackName] = useState("");
  const [editTrackDesc, setEditTrackDesc] = useState("");
  const [editSubmissionRuleDesc, setEditSubmissionRuleDesc] = useState("");
  const [editTemplateId, setEditTemplateId] = useState("");

  const startEditTrack = (trk: any) => {
    const tId = trk.id || trk.Id || trk.trackId;
    setEditingTrackId(tId);
    setEditTrackName(trk.trackName || trk.TrackName || "");
    setEditTrackDesc(trk.description || trk.Description || "");
    setEditSubmissionRuleDesc(trk.submissionRuleDescription || trk.SubmissionRuleDescription || "");
    setEditTemplateId(trk.templateId || trk.TemplateId || "");
  };

  const handleSaveEditTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrackId) return;

    try {
      await tracksRepository.updateTrack(editingTrackId, {
        trackName: editTrackName,
        description: editTrackDesc,
        submissionRuleDescription: editSubmissionRuleDesc,
        templateId: editTemplateId || undefined,
      });
      setEditingTrackId(null);
      await refetchTracks();
      alert("Cập nhật Hạng mục thành công!");
    } catch (err: any) {
      alert(`Cập nhật Hạng mục thất bại: ${err?.response?.data?.message || err?.message}`);
    }
  };

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("Đang lưu...");

    const updatePayload: Record<string, any> = {
      eventName,
      season,
      year,
      maxTeams,
      description,
      photoEventUrl,
      status,
    };

    if (startDate) updatePayload.startDate = new Date(startDate).toISOString();
    if (endDate) updatePayload.endDate = new Date(endDate).toISOString();
    if (registrationStartDate) updatePayload.registrationStartDate = new Date(registrationStartDate).toISOString();
    if (registrationEndDate) updatePayload.registrationEndDate = new Date(registrationEndDate).toISOString();

    try {
      await eventsRepository.updateEvent(eventId, updatePayload);
      await refetchEvent();
      setSaveStatus("Cập nhật thông tin sự kiện thành công!");
    } catch {
      setSaveStatus("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoundName.trim()) return;

    const timelineErr = validateRoundTimeline(
      roundStartDate,
      roundEndDate,
      roundScoringStartDate,
      roundScoringEndDate,
      roundAppealStartDate,
      roundAppealEndDate
    );

    if (timelineErr) {
      alert(`Lỗi cấu hình mốc thời gian: ${timelineErr}`);
      return;
    }

    const formattedAdvancementRule = `${newRuleType}:${newRuleValue}`;

    try {
      await roundsRepository.createRound({
        eventId,
        roundName: newRoundName,
        roundNumber: newRoundNumber,
        startDate: new Date(roundStartDate).toISOString(),
        endDate: new Date(roundEndDate).toISOString(),
        scoringStartDate: new Date(roundScoringStartDate).toISOString(),
        scoringEndDate: new Date(roundScoringEndDate).toISOString(),
        appealStartDate: roundAppealStartDate ? new Date(roundAppealStartDate).toISOString() : undefined,
        appealEndDate: roundAppealEndDate ? new Date(roundAppealEndDate).toISOString() : undefined,
        advancementRule: formattedAdvancementRule,
      });
      setNewRoundName("");
      setRoundStartDate("");
      setRoundEndDate("");
      setRoundScoringStartDate("");
      setRoundScoringEndDate("");
      setRoundAppealStartDate("");
      setRoundAppealEndDate("");
      await refetchRounds();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Khởi tạo Vòng thi thất bại.";
      alert(`Khởi tạo Vòng thi thất bại: ${msg}`);
    }
  };

  const handleDeleteRound = async (roundId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa vòng thi này khỏi sự kiện?")) return;
    try {
      await roundsRepository.deleteRound(roundId);
      await refetchRounds();
    } catch {
      alert("Xóa vòng thi thất bại.");
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
        submissionRuleDescription: newSubmissionRuleDesc,
        templateId: selectedTemplateId || undefined,
      });
      setNewTrackName("");
      setNewTrackDesc("");
      setNewSubmissionRuleDesc("");
      await refetchTracks();
    } catch {
      alert("Khởi tạo Hạng mục thất bại.");
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hạng mục này khỏi sự kiện?")) return;
    try {
      await tracksRepository.deleteTrack(trackId);
      await refetchTracks();
    } catch {
      alert("Xóa hạng mục thất bại.");
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

  const handleInviteJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeEmail.trim()) return;

    const existingConflict = eventRoles.find((r: any) => {
      const emailMatch = (r.user?.email || r.User?.Email || r.email || "").toLowerCase() === judgeEmail.trim().toLowerCase();
      const trackMatch = (r.trackId || r.TrackId || "") === judgeTrackId;
      const isMentor = (r.roleName || r.RoleName) === "Mentor";
      return emailMatch && trackMatch && isMentor;
    });

    if (existingConflict) {
      setJudgeMessage({
        text: "Giảng viên này đã là Cố vấn cho Hạng mục này. Một nhân sự không thể vừa làm Cố vấn vừa làm Giám khảo cùng một Hạng mục.",
        isError: true,
      });
      return;
    }

    setIsSubmittingJudge(true);
    setJudgeMessage(null);

    const res = await staffRepository.inviteJudge({
      eventId,
      email: judgeEmail.trim(),
      trackId: judgeTrackId || undefined,
    });

    setIsSubmittingJudge(false);

    if (res.success) {
      setJudgeMessage({
        text: res.message || `Đã gửi email mời Giám khảo (${judgeEmail}) thành công!`,
        isError: false,
      });
      setJudgeEmail("");
      await refetchRoles();
    } else {
      setJudgeMessage({
        text: res.message || "Gửi lời mời thất bại, vui lòng thử lại.",
        isError: true,
      });
    }
  };

  const handleInviteMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorEmail.trim()) return;

    const existingConflict = eventRoles.find((r: any) => {
      const emailMatch = (r.user?.email || r.User?.Email || r.email || "").toLowerCase() === mentorEmail.trim().toLowerCase();
      const trackMatch = (r.trackId || r.TrackId || "") === mentorTrackId;
      const isJudge = (r.roleName || r.RoleName) === "Judge";
      return emailMatch && trackMatch && isJudge;
    });

    if (existingConflict) {
      setMentorMessage({
        text: "Giảng viên này đã là Giám khảo cho Hạng mục này. Một nhân sự không thể vừa làm Cố vấn vừa làm Giám khảo cùng một Hạng mục.",
        isError: true,
      });
      return;
    }

    setIsSubmittingMentor(true);
    setMentorMessage(null);

    const res = await staffRepository.inviteMentor({
      eventId,
      email: mentorEmail.trim(),
      trackId: mentorTrackId || undefined,
    });

    setIsSubmittingMentor(false);

    if (res.success) {
      setMentorMessage({
        text: res.message || `Đã gửi email mời Cố vấn (${mentorEmail}) thành công!`,
        isError: false,
      });
      setMentorEmail("");
      await refetchRoles();
    } else {
      setMentorMessage({
        text: res.message || "Gửi lời mời thất bại, vui lòng thử lại.",
        isError: true,
      });
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm(`Bạn có chắc chắn muốn gỡ vai trò nhân sự này khỏi sự kiện?`)) return;
    try {
      await staffRepository.removeEventRole(roleId);
      await refetchRoles();
    } catch {
      alert("Gỡ vai trò thất bại.");
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
            <Link href={`/coordinator/staff?eventId=${eventId}`}>
              <Button variant="secondary" className="hud-clipped font-mono text-xs text-[var(--accent-coordinator)] border-[var(--accent-coordinator)]/40 hover:bg-[var(--accent-coordinator)]/10">
                <Users className="w-3.5 h-3.5 mr-1" />
                QUẢN LÝ NHÂN SỰ &gt;
              </Button>
            </Link>

            <Link href={`/events/${eventId}`}>
              <Button variant="secondary" className="hud-clipped font-mono text-xs">
                XEM TRANG PUBLIC &gt;
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Tabs Selector */}
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
            Tab 4: Phân Công Nhân Sự ({eventRoles.length})
          </button>
        </div>

        {/* Tab 1: General Info */}
        {activeTab === "general" && (
          <Card className="hud-glow-coordinator p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Chỉnh Sửa Thông Tin Sự Kiện</h3>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">Cập nhật tiêu đề, quy mô, ảnh bìa và mốc thời gian diễn ra sự kiện.</p>
              </div>
              {saveStatus && (
                <span className="font-mono text-xs text-[var(--accent-coordinator)] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {saveStatus}
                </span>
              )}
            </div>

            <form onSubmit={handleUpdateGeneral} className="space-y-6">
              {/* Nhóm 1: Thông tin cơ bản */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-[var(--accent-coordinator)] uppercase tracking-wider">Thông Tin Cơ Bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-muted)]">Tên sự kiện *</label>
                    <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Mùa giải</label>
                      <Input type="text" value={season} onChange={(e) => setSeason(e.target.value)} placeholder="Ví dụ: Mùa Hè" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Năm</label>
                      <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-muted)]">Quy mô đội thi tối đa</label>
                    <Input type="number" value={maxTeams} onChange={(e) => setMaxTeams(Number(e.target.value))} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-muted)]">Trạng thái hoạt động</label>
                    <select
                      value={status ? "active" : "inactive"}
                      onChange={(e) => setStatus(e.target.value === "active")}
                      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped"
                    >
                      <option value="active">🟢 Đang Hoạt Động (Mở Cổng)</option>
                      <option value="inactive">🔴 Tạm Khóa / Tạm Dừng</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium text-[var(--text-muted)]">Ảnh đại diện sự kiện</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                      {photoEventUrl ? (
                        <div className="relative w-24 h-24 bg-black/40 border border-[var(--border-muted)] overflow-hidden shrink-0">
                          <img src={photoEventUrl} alt="Preview Event" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-[var(--bg-base)] border border-dashed border-[var(--border-muted)] flex flex-col items-center justify-center shrink-0 text-[var(--text-muted)]">
                          <Image className="w-6 h-6 opacity-40 mb-1" />
                          <span className="text-[10px] font-mono">Chưa có ảnh</span>
                        </div>
                      )}

                      <div className="space-y-2 flex-1 w-full">
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer px-4 py-2 bg-[var(--accent-coordinator)] text-black font-mono text-xs font-bold uppercase hud-clipped inline-flex items-center gap-2 hover:opacity-90 transition-all">
                            <Upload className="w-4 h-4" />
                            <span>{isUploadingPhoto ? "Đang tải ảnh..." : "Tải ảnh từ máy tính"}</span>
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={isUploadingPhoto} className="hidden" />
                          </label>
                          {photoEventUrl && (
                            <button
                              type="button"
                              onClick={() => setPhotoEventUrl("")}
                              className="text-xs font-mono text-[var(--color-danger)] hover:underline"
                            >
                              Xóa ảnh
                            </button>
                          )}
                        </div>
                        <Input
                          type="text"
                          value={photoEventUrl}
                          onChange={(e) => setPhotoEventUrl(e.target.value)}
                          placeholder="Hoặc dán URL ảnh tại đây (https://...)"
                          className="text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nhóm 2: Mốc thời gian */}
              <div className="space-y-4 pt-4 border-t border-[var(--border-muted)]">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[var(--accent-coordinator)] uppercase tracking-wider">Cổng Đăng Ký</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1 p-3 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Mở cổng đăng ký</label>
                      <Input type="date" value={registrationStartDate} onChange={(e) => setRegistrationStartDate(e.target.value)} />
                    </div>

                    <div className="space-y-1 p-3 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Đóng cổng đăng ký</label>
                      <Input type="date" value={registrationEndDate} onChange={(e) => setRegistrationEndDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-[var(--accent-coordinator)] uppercase tracking-wider">Thời Gian Sự Kiện</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1 p-3 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Bắt đầu sự kiện chính thức</label>
                      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>

                    <div className="space-y-1 p-3 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Kết thúc sự kiện chính thức</label>
                      <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div className="space-y-1 pt-4 border-t border-[var(--border-muted)]">
                <label className="text-xs font-medium text-[var(--text-muted)]">Mô tả chi tiết sự kiện</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--accent-coordinator)]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoadingEvent || isSaving}
                variant="primary"
                accent="coordinator"
                className="hud-clipped font-mono text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? "ĐANG LƯU THAY ĐỔI..." : "LƯU THAY ĐỔI SỰ KIỆN"}
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

              <form onSubmit={handleCreateRound} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Cột 1: Tên vòng thi */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-muted)]">Tên Vòng Thi *</label>
                    <Input
                      type="text"
                      value={newRoundName}
                      onChange={(e) => setNewRoundName(e.target.value)}
                      placeholder="Ví dụ: Vòng Sơ Loại, Vòng Bán Kết"
                      required
                    />
                  </div>

                  {/* Cột 2: Thứ tự vòng (Tự Động) */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-muted)]">Thứ Tự (Tự Động)</label>
                    <div className="px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-muted)] font-mono text-xs text-[var(--accent-coordinator)] font-bold hud-clipped flex items-center justify-between">
                      <span>VÒNG THI SỐ {newRoundNumber}</span>
                    </div>
                  </div>

                  {/* Cột 3 & 4: Điều kiện qua vòng */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-[var(--text-muted)]">Điều Kiện Qua Vòng *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newRuleType}
                        onChange={(e) => handleRuleTypeChange(e.target.value as any)}
                        className="px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped"
                      >
                        <option value="top">Top N đội cao điểm nhất</option>
                        <option value="percent">Top N% số đội</option>
                        <option value="minscore">Điểm tối thiểu N</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          step={newRuleType === "minscore" ? "0.1" : "1"}
                          min={newRuleType === "minscore" ? "0" : "1"}
                          max={newRuleType === "minscore" ? "10" : "100"}
                          value={newRuleValue}
                          onChange={(e) => setNewRuleValue(Number(e.target.value))}
                          className="flex-1 font-mono text-xs"
                          required
                        />
                        <span className="px-2 py-1.5 bg-[var(--bg-base)] border border-[var(--border-muted)] text-xs font-mono font-bold text-[var(--accent-coordinator)]">
                          {newRuleType === "top" ? "đội" : newRuleType === "percent" ? "%" : "điểm"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6 Ô Chọn Ngày Đầy Đủ */}
                <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded space-y-3">
                  <div className="text-xs font-mono font-bold text-[var(--accent-coordinator)] border-b border-[var(--border-muted)] pb-2">
                    Khung Thời Gian Vòng Thi (Timeline Lifecycle)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                      <label className="text-[11px] font-bold text-amber-400">1. Mở Nộp Bài *</label>
                      <Input type="date" value={roundStartDate} onChange={(e) => setRoundStartDate(e.target.value)} required />
                    </div>

                    <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                      <label className="text-[11px] font-bold text-amber-400">2. Hạn Chót Nộp Bài *</label>
                      <Input type="date" value={roundEndDate} onChange={(e) => setRoundEndDate(e.target.value)} required />
                    </div>

                    <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                      <label className="text-[11px] font-bold text-cyan-400">3. Bắt Đầu Chấm *</label>
                      <Input type="date" value={roundScoringStartDate} onChange={(e) => setRoundScoringStartDate(e.target.value)} required />
                    </div>

                    <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                      <label className="text-[11px] font-bold text-cyan-400">4. Kết Thúc Chấm *</label>
                      <Input type="date" value={roundScoringEndDate} onChange={(e) => setRoundScoringEndDate(e.target.value)} required />
                    </div>

                    <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                      <label className="text-[11px] font-bold text-purple-400">5. Mở Phúc Khảo (Tùy chọn)</label>
                      <Input type="date" value={roundAppealStartDate} onChange={(e) => setRoundAppealStartDate(e.target.value)} />
                    </div>

                    <div className="space-y-1 p-2 bg-[var(--bg-panel)] rounded">
                      <label className="text-[11px] font-bold text-purple-400">6. Đóng Phúc Khảo (Tùy chọn)</label>
                      <Input type="date" value={roundAppealEndDate} onChange={(e) => setRoundAppealEndDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[var(--border-muted)]">
                  <Button type="submit" variant="primary" accent="coordinator" className="text-xs font-mono">
                    + KÍCH HOẠT VÒNG THI SỐ {newRoundNumber}
                  </Button>
                </div>
              </form>
            </Card>

            {/* List Rounds & Edit Mode */}
            <div className="space-y-4">
              {rounds.map((rnd: any, index: number) => {
                const roundId = rnd.id || rnd.Id || rnd.roundId || rnd.RoundId || `rnd-${index}`;
                const isLastRound = index === rounds.length - 1;
                const isEditing = editingRoundId === roundId;

                return (
                  <Card key={roundId} className="p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-4">
                    {!isEditing ? (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge tone="info">Vòng {rnd.roundNumber || rnd.RoundNumber || index + 1}</Badge>
                              <h4 className="font-mono font-bold text-sm text-[var(--text-primary)]">{rnd.roundName || rnd.RoundName}</h4>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                              {!isLastRound ? (
                                `Quy tắc qua vòng: ${rnd.advancementRule || rnd.AdvancementRule || "top:10"}`
                              ) : (
                                "Vòng cuối — kết quả dùng để xếp hạng và trao giải, không thăng vòng."
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={() => startEditRound(rnd)} className="text-xs font-mono text-[var(--accent-coordinator)] hover:bg-[var(--accent-coordinator)]/10">
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Sửa vòng
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteRound(roundId)} className="text-xs font-mono text-[var(--color-danger)] hover:bg-red-500/10">
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Xóa vòng
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 font-mono text-[11px]">
                          <div className="p-2 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                            <div className="text-[var(--text-muted)]">Mở nộp bài</div>
                            <div className="font-bold text-[var(--text-primary)] mt-0.5">{rnd.startDate?.split("T")[0] || rnd.StartDate?.split("T")[0] || "Chưa đặt"}</div>
                          </div>
                          <div className="p-2 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                            <div className="text-[var(--text-muted)]">Hạn nộp bài</div>
                            <div className="font-bold text-[var(--text-primary)] mt-0.5">{rnd.endDate?.split("T")[0] || rnd.EndDate?.split("T")[0] || "Chưa đặt"}</div>
                          </div>
                          <div className="p-2 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                            <div className="text-[var(--text-muted)]">Bắt đầu chấm</div>
                            <div className="font-bold text-[var(--text-primary)] mt-0.5">{rnd.scoringStartDate?.split("T")[0] || rnd.ScoringStartDate?.split("T")[0] || "Chưa đặt"}</div>
                          </div>
                          <div className="p-2 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                            <div className="text-[var(--text-muted)]">Kết thúc chấm</div>
                            <div className="font-bold text-[var(--text-primary)] mt-0.5">{rnd.scoringEndDate?.split("T")[0] || rnd.ScoringEndDate?.split("T")[0] || "Chưa đặt"}</div>
                          </div>
                          <div className="p-2 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                            <div className="text-[var(--text-muted)]">Mở phúc khảo</div>
                            <div className="font-bold text-[var(--text-primary)] mt-0.5">{rnd.appealStartDate?.split("T")[0] || rnd.AppealStartDate?.split("T")[0] || "Chưa đặt"}</div>
                          </div>
                          <div className="p-2 bg-[var(--bg-base)] border border-[var(--border-muted)] rounded">
                            <div className="text-[var(--text-muted)]">Đóng phúc khảo</div>
                            <div className="font-bold text-[var(--text-primary)] mt-0.5">{rnd.appealEndDate?.split("T")[0] || rnd.AppealEndDate?.split("T")[0] || "Chưa đặt"}</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Form Chỉnh Sửa Vòng Thi Inline */
                      <form onSubmit={handleSaveEditRound} className="space-y-4 p-4 bg-[var(--bg-base)] border border-[var(--accent-coordinator)] rounded">
                        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
                          <h4 className="font-mono font-bold text-sm text-[var(--accent-coordinator)] flex items-center gap-2">
                            <Edit3 className="w-4 h-4" /> Đang Chỉnh Sửa Vòng Thi: {rnd.roundName || rnd.RoundName}
                          </h4>
                          <Button variant="ghost" onClick={() => setEditingRoundId(null)} className="text-xs font-mono">Hủy</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Tên Vòng Thi *</label>
                            <Input type="text" value={editRoundName} onChange={(e) => setEditRoundName(e.target.value)} required />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Điều Kiện Qua Vòng *</label>
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={editRuleType}
                                onChange={(e) => handleRuleTypeChange(e.target.value as any, true)}
                                className="px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped"
                              >
                                <option value="top">Top N đội cao điểm nhất</option>
                                <option value="percent">Top N% số đội</option>
                                <option value="minscore">Điểm tối thiểu N</option>
                              </select>
                              <Input
                                type="number"
                                step={editRuleType === "minscore" ? "0.1" : "1"}
                                min={editRuleType === "minscore" ? "0" : "1"}
                                max={editRuleType === "minscore" ? "10" : "100"}
                                value={editRuleValue}
                                onChange={(e) => setEditRuleValue(Number(e.target.value))}
                                className="font-mono text-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* 6 Date Pickers for Edit */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-amber-400">Mở Nộp Bài</label>
                            <Input type="date" value={editRoundStartDate} onChange={(e) => setEditRoundStartDate(e.target.value)} required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-amber-400">Hạn Chót Nộp Bài</label>
                            <Input type="date" value={editRoundEndDate} onChange={(e) => setEditRoundEndDate(e.target.value)} required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-cyan-400">Bắt Đầu Chấm</label>
                            <Input type="date" value={editRoundScoringStartDate} onChange={(e) => setEditRoundScoringStartDate(e.target.value)} required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-cyan-400">Kết Thúc Chấm</label>
                            <Input type="date" value={editRoundScoringEndDate} onChange={(e) => setEditRoundScoringEndDate(e.target.value)} required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-purple-400">Mở Phúc Khảo</label>
                            <Input type="date" value={editRoundAppealStartDate} onChange={(e) => setEditRoundAppealStartDate(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-purple-400">Đóng Phúc Khảo</label>
                            <Input type="date" value={editRoundAppealEndDate} onChange={(e) => setEditRoundAppealEndDate(e.target.value)} />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-muted)]">
                          <Button variant="ghost" onClick={() => setEditingRoundId(null)} className="text-xs font-mono">Hủy Bỏ</Button>
                          <Button type="submit" variant="primary" accent="coordinator" className="text-xs font-mono">Lưu Thay Đổi Vòng Thi</Button>
                        </div>
                      </form>
                    )}
                  </Card>
                );
              })}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="text" value={newTrackDesc} onChange={(e) => setNewTrackDesc(e.target.value)} placeholder="Mô tả phạm vi đề bài hạng mục..." />
                  <Input type="text" value={newSubmissionRuleDesc} onChange={(e) => setNewSubmissionRuleDesc(e.target.value)} placeholder="Quy định nộp bài riêng của hạng mục này..." />
                </div>

                <Button type="submit" variant="primary" accent="coordinator" className="text-xs font-mono">
                  + KHỞI TẠO HẠNG MỤC
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              {(tracks ?? []).map((trk: any, index: number) => {
                const trkId = trk.id || trk.Id || trk.trackId || "";
                const isEditingTrack = editingTrackId === trkId;

                return (
                  <Card key={trkId || index} className="p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped space-y-4">
                    {!isEditingTrack ? (
                      <>
                        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3">
                          <h4 className="font-mono font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                            <Target className="w-4 h-4 text-[var(--accent-team)]" />
                            {trk.trackName || trk.TrackName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge tone="neutral">ID: {trkId}</Badge>
                            <Button variant="ghost" onClick={() => startEditTrack(trk)} className="text-xs font-mono text-[var(--accent-coordinator)] hover:bg-[var(--accent-coordinator)]/10">
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Sửa
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteTrack(trkId)} className="text-xs font-mono text-[var(--color-danger)] hover:bg-red-500/10">
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Xóa
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans text-[var(--text-muted)]">
                          <div><strong className="text-[var(--text-primary)]">Mô tả:</strong> {trk.description || trk.Description || "Chưa có mô tả"}</div>
                          <div><strong className="text-[var(--text-primary)]">Quy định nộp bài:</strong> {trk.submissionRuleDescription || trk.SubmissionRuleDescription || "Tuân theo quy định chung"}</div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-muted)]">
                          <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                            <LayoutTemplate className="w-3.5 h-3.5 text-[var(--accent-coordinator)]" />
                            Template tiêu chí:
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
                      </>
                    ) : (
                      /* Form Chỉnh Sửa Hạng Mục Inline */
                      <form onSubmit={handleSaveEditTrack} className="space-y-4 p-4 bg-[var(--bg-base)] border border-[var(--accent-coordinator)] rounded">
                        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
                          <h4 className="font-mono font-bold text-sm text-[var(--accent-coordinator)] flex items-center gap-2">
                            <Edit3 className="w-4 h-4" /> Đang Chỉnh Sửa Hạng Mục: {trk.trackName || trk.TrackName}
                          </h4>
                          <Button variant="ghost" onClick={() => setEditingTrackId(null)} className="text-xs font-mono">Hủy</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Tên Hạng Mục *</label>
                            <Input type="text" value={editTrackName} onChange={(e) => setEditTrackName(e.target.value)} required />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Mẫu Tiêu Chí (Template)</label>
                            <select
                              value={editTemplateId}
                              onChange={(e) => setEditTemplateId(e.target.value)}
                              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs"
                            >
                              <option value="">-- Giữ Nguyên / Chọn Mẫu Mới --</option>
                              {templates.map((tpl: any) => (
                                <option key={tpl.id || tpl.Id} value={tpl.id || tpl.Id}>
                                  {tpl.templateName || tpl.TemplateName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Mô tả Hạng mục</label>
                            <Input type="text" value={editTrackDesc} onChange={(e) => setEditTrackDesc(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Quy định nộp bài riêng</label>
                            <Input type="text" value={editSubmissionRuleDesc} onChange={(e) => setEditSubmissionRuleDesc(e.target.value)} />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-muted)]">
                          <Button variant="ghost" onClick={() => setEditingTrackId(null)} className="text-xs font-mono">Hủy Bỏ</Button>
                          <Button type="submit" variant="primary" accent="coordinator" className="text-xs font-mono">Lưu Thay Đổi Hạng Mục</Button>
                        </div>
                      </form>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Event Staff Invitations */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Form 1: Invite Judge */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-[var(--border-muted)] pb-3">
                  <div className="w-9 h-9 bg-[var(--accent-judge)]/10 border border-[var(--accent-judge)]/30 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-[var(--accent-judge)]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase">Mời Giám Khảo (Judge)</h3>
                    <p className="text-xs text-[var(--text-muted)]">Gửi email mời Giám khảo chấm thi sự kiện này.</p>
                  </div>
                </div>

                <form onSubmit={handleInviteJudge} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Email Giám Khảo *</label>
                    <Input
                      type="email"
                      required
                      value={judgeEmail}
                      onChange={(e) => setJudgeEmail(e.target.value)}
                      placeholder="judge.ai@fpt.edu.vn"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Hạng Mục Phụ Trách (Track)</label>
                    <select
                      value={judgeTrackId}
                      onChange={(e) => setJudgeTrackId(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs"
                    >
                      <option value="">Toàn sự kiện (Chấm tất cả Hạng mục)</option>
                      {(tracks ?? []).map((t: any) => (
                        <option key={t.id || t.Id} value={t.id || t.Id}>
                          {t.trackName || t.TrackName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {judgeMessage && (
                    <div className={`p-3 font-mono text-xs border flex items-center gap-2 ${judgeMessage.isError ? "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30 text-[var(--color-danger)]" : "bg-[var(--accent-judge)]/10 border-[var(--accent-judge)]/30 text-[var(--accent-judge)]"}`}>
                      {judgeMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{judgeMessage.text}</span>
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmittingJudge} variant="primary" accent="judge" className="w-full font-mono text-xs flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> {isSubmittingJudge ? "ĐANG GỬI..." : "GỬI LỜI MỜI GIÁM KHẢO"}
                  </Button>
                </form>
              </Card>

              {/* Card Form 2: Invite Mentor */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-[var(--border-muted)] pb-3">
                  <div className="w-9 h-9 bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-[#2dd4bf]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase">Mời Cố Vấn (Mentor)</h3>
                    <p className="text-xs text-[var(--text-muted)]">Gửi email mời Cố vấn hỗ trợ các Đội thi.</p>
                  </div>
                </div>

                <form onSubmit={handleInviteMentor} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Email Cố Vấn *</label>
                    <Input
                      type="email"
                      required
                      value={mentorEmail}
                      onChange={(e) => setMentorEmail(e.target.value)}
                      placeholder="mentor.tech@fpt.edu.vn"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Hạng Mục Phụ Trách (Track)</label>
                    <select
                      value={mentorTrackId}
                      onChange={(e) => setMentorTrackId(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs"
                    >
                      <option value="">Toàn sự kiện (Cố vấn tất cả Hạng mục)</option>
                      {(tracks ?? []).map((t: any) => (
                        <option key={t.id || t.Id} value={t.id || t.Id}>
                          {t.trackName || t.TrackName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {mentorMessage && (
                    <div className={`p-3 font-mono text-xs border flex items-center gap-2 ${mentorMessage.isError ? "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30 text-[var(--color-danger)]" : "bg-[#2dd4bf]/10 border-[#2dd4bf]/30 text-[#2dd4bf]"}`}>
                      {mentorMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{mentorMessage.text}</span>
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmittingMentor} variant="secondary" className="w-full font-mono text-xs flex items-center justify-center gap-2 border-[#2dd4bf]/50 text-[#2dd4bf] hover:bg-[#2dd4bf]/10">
                    <Send className="w-4 h-4" /> {isSubmittingMentor ? "ĐANG GỬI..." : "GỬI LỜI MỜI CỐ VẤN"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* List of Assigned Staff for this Event */}
            <Card className="p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--accent-coordinator)]" />
                Danh Sách Nhân Sự Đã Phân Công Sự Kiện Này ({eventRoles.length})
              </h3>

              {eventRoles.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[var(--text-muted)]">
                  Chưa có nhân sự Giám khảo / Cố vấn nào được gán cho sự kiện này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-input)] text-[var(--text-muted)] uppercase text-[10px]">
                        <th className="p-3">Họ &amp; Tên / Email</th>
                        <th className="p-3">Vai Trò</th>
                        <th className="p-3">Hạng Mục (Track)</th>
                        <th className="p-3 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-muted)]">
                      {eventRoles.map((er: any, idx: number) => {
                        const roleId = er.id || er.Id || er.eventRoleId || er.EventRoleId || `er-${idx}`;
                        const email = er.user?.email || er.User?.Email || er.email || "staff@fpt.edu.vn";
                        const fullName = er.user?.fullName || er.User?.FullName || er.fullName || email.split("@")[0];
                        const roleName = er.roleName || er.RoleName || "Staff";
                        const trackName = er.track?.trackName || er.Track?.TrackName || "Toàn bộ sự kiện";

                        return (
                          <tr key={roleId} className="hover:bg-[var(--bg-panel)] transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-[var(--text-primary)]">{fullName}</div>
                              <div className="text-[10px] text-[var(--text-muted)]">{email}</div>
                            </td>
                            <td className="p-3">
                              <Badge tone={roleName === "Judge" ? "warning" : "info"}>
                                {roleName === "Judge" ? "Giám khảo (Judge)" : "Cố vấn (Mentor)"}
                              </Badge>
                            </td>
                            <td className="p-3 text-[var(--text-muted)]">{trackName}</td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                onClick={() => handleRemoveRole(roleId)}
                                className="text-[11px] font-mono text-[var(--color-danger)] hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Gỡ vai trò
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

      </main>
    </div>
  );
};
