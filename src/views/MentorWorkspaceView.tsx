"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui";

export function MentorWorkspaceView() {
  const [activeTrack, setActiveTrack] = useState("AI & Machine Learning");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const mockAssignedTracks = [
    { id: "tr-01", name: "AI & Machine Learning", teamsCount: 8, deliverablesCount: 14 },
    { id: "tr-02", name: "Web & Cloud Architecture", teamsCount: 6, deliverablesCount: 10 },
  ];

  const mockTeamsToMentor = [
    {
      id: "team-01",
      name: "CyberGuardians",
      school: "Trường Đại Học FPT HN",
      track: "AI & Machine Learning",
      status: "Registered",
      membersCount: 4,
      deliverables: {
        github: "https://github.com/cyber-guardians/seal-ai-2026",
        slides: "https://docs.google.com/presentation/d/seal-ai-deck",
        demo: "https://youtube.com/watch?v=demo-ai-shield",
      },
      lastUpdated: "12/08/2026 18:30",
      notesCount: 2,
    },
    {
      id: "team-02",
      name: "ByteKnights",
      school: "Đại Học Bách Khoa HN",
      track: "AI & Machine Learning",
      status: "Registered",
      membersCount: 5,
      deliverables: {
        github: "https://github.com/byte-knights/ai-vision",
        slides: "https://docs.google.com/presentation/d/byte-knights",
        demo: "",
      },
      lastUpdated: "11/08/2026 21:15",
      notesCount: 0,
    },
    {
      id: "team-03",
      name: "CodeNinjas FPT",
      school: "Trường Đại Học FPT HCM",
      track: "AI & Machine Learning",
      status: "Forming",
      membersCount: 3,
      deliverables: {
        github: "https://github.com/codeninja/seal-app",
        slides: "",
        demo: "",
      },
      lastUpdated: "10/08/2026 14:00",
      notesCount: 1,
    },
  ];

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)]">
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-muted)]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#2dd4bf] tracking-widest uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
              MENTOR ADVISORY PANEL [CỐ VẤN CHUYÊN MÔN]
            </div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-[var(--text-primary)] mt-1">
              Hạng Mục & Đội Thi Phụ Trách
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Theo dõi tiến độ, góp ý định hướng kỹ thuật và tư vấn bài thi cho các Đội thi được phân công.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-3 py-1.5 font-bold">
              ROLE: MENTOR [CỐ VẤN]
            </span>
          </div>
        </div>

        {/* ── Track Switcher Tabs ── */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            HẠNG MỤC PHÂN CÔNG THỜI GIAN NÀY ({mockAssignedTracks.length})
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {mockAssignedTracks.map((tr) => (
              <button
                key={tr.id}
                onClick={() => setActiveTrack(tr.name)}
                className={`font-mono text-xs px-5 py-3 hud-clipped transition-all font-bold flex items-center gap-3 ${
                  activeTrack === tr.name
                    ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                    : "bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-white border border-[var(--border-muted)]"
                }`}
              >
                <span>{tr.name}</span>
                <span className={`text-[10px] px-2 py-0.5 border ${activeTrack === tr.name ? "bg-black/20 border-black/30" : "bg-[var(--bg-input)] border-[var(--border-muted)]"}`}>
                  {tr.teamsCount} Đội
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Teams List Grid ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
            <span>DANH SÁCH ĐỘI THI TRONG HẠNG MỤC: <strong className="text-[var(--text-primary)]">{activeTrack}</strong></span>
            <span>Hiển thị {mockTeamsToMentor.length} Đội</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mockTeamsToMentor.map((team) => (
              <div
                key={team.id}
                className="hud-clipped border border-[var(--border-muted)] bg-[var(--bg-panel)] p-6 flex flex-col gap-5 hover:border-[#2dd4bf]/50 transition-all shadow-sm"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-muted)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2dd4bf]">#{team.id.toUpperCase()}</span>
                      <span className="font-mono text-xs text-[var(--text-muted)]">·</span>
                      <span className="font-mono text-xs text-[var(--text-muted)]">{team.school}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mt-1">
                      {team.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge tone={team.status === "Registered" ? "success" : "warning"}>
                      {team.status === "Registered" ? "ĐÃ GHI DANH" : "ĐANG LẬP ĐỘI"}
                    </Badge>
                    <span className="font-mono text-xs text-[var(--text-muted)] border border-[var(--border-muted)] px-2.5 py-1">
                      {team.membersCount} Thành viên
                    </span>
                  </div>
                </div>

                {/* Deliverables Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  {/* Github */}
                  <div className="p-3 bg-[var(--bg-input)]/50 border border-[var(--border-muted)] flex flex-col gap-1">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">GitHub Code:</span>
                    {team.deliverables.github ? (
                      <a href={team.deliverables.github} target="_blank" rel="noreferrer" className="text-[#2dd4bf] hover:underline font-bold truncate">
                        {team.deliverables.github}
                      </a>
                    ) : (
                      <span className="text-[var(--text-muted)]/50 italic">Chưa nộp link repository</span>
                    )}
                  </div>

                  {/* Slides */}
                  <div className="p-3 bg-[var(--bg-input)]/50 border border-[var(--border-muted)] flex flex-col gap-1">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Slides Thuyết Trình:</span>
                    {team.deliverables.slides ? (
                      <a href={team.deliverables.slides} target="_blank" rel="noreferrer" className="text-[#2dd4bf] hover:underline font-bold truncate">
                        {team.deliverables.slides}
                      </a>
                    ) : (
                      <span className="text-[var(--text-muted)]/50 italic">Chưa nộp slides</span>
                    )}
                  </div>

                  {/* Demo Video */}
                  <div className="p-3 bg-[var(--bg-input)]/50 border border-[var(--border-muted)] flex flex-col gap-1">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Demo Video:</span>
                    {team.deliverables.demo ? (
                      <a href={team.deliverables.demo} target="_blank" rel="noreferrer" className="text-[#2dd4bf] hover:underline font-bold truncate">
                        {team.deliverables.demo}
                      </a>
                    ) : (
                      <span className="text-[var(--text-muted)]/50 italic">Chưa nộp demo video</span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-muted)]/60 font-mono text-xs">
                  <span className="text-[var(--text-muted)] text-[11px]">
                    Cập nhật lần cuối: {team.lastUpdated}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alert(`[MOCK] Mở khung góp ý cố vấn cho Đội: ${team.name}`)}
                      className="hud-clipped px-4 py-2 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-bold uppercase hover:bg-[#2dd4bf]/20 transition-all"
                    >
                      💬 TƯ VẤN & GÓP Ý CHUYÊN MÔN ({team.notesCount})
                    </button>
                    <Link href={`/events/event-seal-2026/leaderboard`}>
                      <button className="hud-clipped px-4 py-2 border border-[var(--border-muted)] text-[var(--text-muted)] font-bold uppercase hover:text-white transition-all">
                        🏆 XEM THỨ HẠNG
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
