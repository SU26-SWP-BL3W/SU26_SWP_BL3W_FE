"use client";

import React, { useState } from "react";
import { staffRepository } from "@/repositories/staffRepository";
import { UserCheck, UserPlus, Send, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { MOCK_EVENTS } from "@/viewModels/mockEventsData";

export const CoordinatorStaffView: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>(MOCK_EVENTS[0].id);
  const [judgeEmail, setJudgeEmail] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [trackId, setTrackId] = useState("");
  
  const [judgeMessage, setJudgeMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [mentorMessage, setMentorMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmittingJudge, setIsSubmittingJudge] = useState(false);
  const [isSubmittingMentor, setIsSubmittingMentor] = useState(false);

  const selectedEvent = MOCK_EVENTS.find((e) => e.id === selectedEventId) || MOCK_EVENTS[0];

  const handleInviteJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeEmail.trim()) return;

    setIsSubmittingJudge(true);
    setJudgeMessage(null);

    const res = await staffRepository.inviteJudge({
      eventId: selectedEventId,
      email: judgeEmail.trim(),
      trackId: trackId || undefined,
    });

    setIsSubmittingJudge(false);

    if (res.success) {
      setJudgeMessage({
        text: res.message || `Đã gửi email mời Giám khảo (${judgeEmail}) thành công!`,
        isError: false,
      });
      setJudgeEmail("");
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

    setIsSubmittingMentor(true);
    setMentorMessage(null);

    const res = await staffRepository.inviteMentor({
      eventId: selectedEventId,
      email: mentorEmail.trim(),
      trackId: trackId || undefined,
    });

    setIsSubmittingMentor(false);

    if (res.success) {
      setMentorMessage({
        text: res.message || `Đã gửi email mời Cố vấn (${mentorEmail}) thành công!`,
        isError: false,
      });
      setMentorEmail("");
    } else {
      setMentorMessage({
        text: res.message || "Gửi lời mời thất bại, vui lòng thử lại.",
        isError: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex flex-col">
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#a855f7] mb-1">
              <Shield className="w-4 h-4" />
              <span>PHÂN CÔNG HỘI ĐỒNG (STAFF ASSIGNMENT CENTER)</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--text-primary)] uppercase tracking-wider">
              Mời Giám Khảo &amp; Cố Vấn
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Mời chuyên gia tham gia Hội đồng Giám khảo chấm điểm hoặc Cố vấn hướng dẫn cho Cuộc thi.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--bg-input)] p-2 border border-[var(--border-muted)] hud-clipped">
            <span className="font-mono text-xs text-[var(--text-muted)] uppercase">SỰ KIỆN:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-[var(--bg-panel)] text-[var(--text-primary)] font-mono text-xs font-bold px-3 py-1.5 border border-[var(--border-muted)] focus:outline-none focus:border-[#a855f7]"
            >
              {MOCK_EVENTS.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.eventName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card Form 1: Invite Judge */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] p-6 hud-clipped flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 border-b border-[var(--border-muted)] pb-4 mb-6">
                <div className="w-10 h-10 bg-[var(--accent-judge)]/10 border border-[var(--accent-judge)]/30 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[var(--accent-judge)]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wide">
                    Hội Đồng Giám Khảo (Judges)
                  </h2>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Gửi email mời Giám khảo chấm điểm RBL độc lập.
                  </p>
                </div>
              </div>

              <form onSubmit={handleInviteJudge} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] uppercase mb-1">
                    Email Giám Khảo *
                  </label>
                  <input
                    type="email"
                    required
                    value={judgeEmail}
                    onChange={(e) => setJudgeEmail(e.target.value)}
                    placeholder="nguyen.van.a@fpt.edu.vn"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-muted)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-judge)]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] uppercase mb-1">
                    Phân công Hạng mục Track (Tùy chọn)
                  </label>
                  <select
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-muted)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-judge)]"
                  >
                    <option value="">-- Toàn bộ Cuộc Thi (Tất cả Tracks) --</option>
                    {selectedEvent.tracks.map((t, idx) => (
                      <option key={t} value={`track-${idx + 1}`}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {judgeMessage && (
                  <div
                    className={`p-3 font-mono text-xs border hud-clipped flex items-center gap-2 ${
                      judgeMessage.isError
                        ? "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30 text-[var(--color-danger)]"
                        : "bg-[var(--accent-judge)]/10 border-[var(--accent-judge)]/30 text-[var(--accent-judge)]"
                    }`}
                  >
                    {judgeMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{judgeMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingJudge}
                  className="w-full py-2.5 bg-[var(--accent-judge)] text-black font-mono text-xs font-bold uppercase tracking-wider hud-clipped flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingJudge ? "Đang Gửi Lời Mời..." : "Gửi Lời Mời Giám Khảo"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Card Form 2: Invite Mentor */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-muted)] p-6 hud-clipped flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 border-b border-[var(--border-muted)] pb-4 mb-6">
                <div className="w-10 h-10 bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[#2dd4bf]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wide">
                    Đội Ngũ Cố Vấn (Mentors)
                  </h2>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Gửi email mời Cố vấn tư vấn chuyên môn cho các Đội thi.
                  </p>
                </div>
              </div>

              <form onSubmit={handleInviteMentor} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] uppercase mb-1">
                    Email Cố Vấn *
                  </label>
                  <input
                    type="email"
                    required
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    placeholder="mentor.tech@fpt.edu.vn"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-muted)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2dd4bf]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] uppercase mb-1">
                    Phân công Hạng mục Track (Tùy chọn)
                  </label>
                  <select
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-muted)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2dd4bf]"
                  >
                    <option value="">-- Toàn bộ Cuộc Thi (Tất cả Tracks) --</option>
                    {selectedEvent.tracks.map((t, idx) => (
                      <option key={t} value={`track-${idx + 1}`}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {mentorMessage && (
                  <div
                    className={`p-3 font-mono text-xs border hud-clipped flex items-center gap-2 ${
                      mentorMessage.isError
                        ? "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30 text-[var(--color-danger)]"
                        : "bg-[#2dd4bf]/10 border-[#2dd4bf]/30 text-[#2dd4bf]"
                    }`}
                  >
                    {mentorMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{mentorMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingMentor}
                  className="w-full py-2.5 bg-[#2dd4bf] text-black font-mono text-xs font-bold uppercase tracking-wider hud-clipped flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingMentor ? "Đang Gửi Lời Mời..." : "Gửi Lời Mời Cố Vấn"}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
