"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui";

interface MentorWorkspaceViewProps {
  activeTab?: "tracks" | "teams" | "submissions";
}

export function MentorWorkspaceView({ activeTab = "tracks" }: MentorWorkspaceViewProps) {
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("All");
  const [feedbackTeam, setFeedbackTeam] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");

  const mockAssignedTracks = [
    {
      id: "tr-01",
      name: "AI & Machine Learning",
      tag: "AI_ML",
      description: "Xây dựng các ứng dụng trí tuệ nhân tạo, học máy, xử lý ngôn ngữ tự nhiên và thị giác máy tính.",
      teamsCount: 8,
      membersCount: 34,
      deliverablesCount: 14,
      coMentors: ["TS. Nguyễn Văn Cố Vấn", "ThS. Lê Hoàng Nam"],
    },
    {
      id: "tr-02",
      name: "Web & Cloud Architecture",
      tag: "WEB_CLOUD",
      description: "Phát triển hệ thống web quy mô lớn, kiến trúc Serverless, Microservices và tối ưu hóa hạ tầng Cloud.",
      teamsCount: 6,
      membersCount: 26,
      deliverablesCount: 10,
      coMentors: ["TS. Trịnh Quốc Bảo"],
    },
  ];

  const mockTeamsToMentor = [
    {
      id: "team-01",
      code: "#TM-001",
      name: "CyberGuardians",
      school: "Trường Đại Học FPT HN",
      track: "AI & Machine Learning",
      status: "Registered",
      leader: { name: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn" },
      members: [
        { name: "Nguyễn Văn Leader", role: "Đội Trưởng", school: "FPT HN" },
        { name: "Trần Thị Bích", role: "Thành Viên", school: "FPT HN" },
        { name: "Lê Minh Khoa", role: "Thành Viên", school: "FPT HCM" },
        { name: "Phạm Quỳnh Anh", role: "Thành Viên", school: "ĐH Bách Khoa" },
      ],
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
      code: "#TM-002",
      name: "ByteKnights",
      school: "Đại Học Bách Khoa HN",
      track: "AI & Machine Learning",
      status: "Registered",
      leader: { name: "Trần Văn Nam", email: "nam.tv@hust.edu.vn" },
      members: [
        { name: "Trần Văn Nam", role: "Đội Trưởng", school: "ĐH Bách Khoa" },
        { name: "Đặng Thị Hoa", role: "Thành Viên", school: "ĐH Bách Khoa" },
        { name: "Nguyễn Tiến Dũng", role: "Thành Viên", school: "ĐH Quốc Gia" },
      ],
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
      code: "#TM-003",
      name: "CloudNinjas FPT",
      school: "Trường Đại Học FPT HCM",
      track: "Web & Cloud Architecture",
      status: "Forming",
      leader: { name: "Lê Hoàng Nhật", email: "nhatlh@fpt.edu.vn" },
      members: [
        { name: "Lê Hoàng Nhật", role: "Đội Trưởng", school: "FPT HCM" },
        { name: "Vũ Phương Thảo", role: "Thành Viên", school: "FPT HCM" },
      ],
      deliverables: {
        github: "https://github.com/codeninja/seal-app",
        slides: "",
        demo: "",
      },
      lastUpdated: "10/08/2026 14:00",
      notesCount: 1,
    },
  ];

  const filteredTeams = selectedTrackFilter === "All"
    ? mockTeamsToMentor
    : mockTeamsToMentor.filter(t => t.track === selectedTrackFilter);

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)]">
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* ── Header Cố Vấn Panel ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-muted)]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#2dd4bf] tracking-widest uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
              MENTOR ADVISORY PANEL [CỐ VẤN CHUYÊN MÔN]
            </div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-[var(--text-primary)] mt-1">
              {activeTab === "tracks" && "1. Hạng Mục Thi Đấu Được Phân Công"}
              {activeTab === "teams" && "2. Danh Sách Đội Thi Cần Hỗ Trợ"}
              {activeTab === "submissions" && "3. Tiến Độ & Sản Phẩm Nộp Của Đội"}
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              {activeTab === "tracks" && "Quản lý các hạng mục công nghệ bạn được Ban Tổ Chức giao nhiệm vụ cố vấn."}
              {activeTab === "teams" && "Theo dõi danh sách thành viên, trường học và thông tin liên hệ của các Đội thi."}
              {activeTab === "submissions" && "Kiểm tra mã nguồn GitHub, Slide thuyết trình, Video Demo và góp ý phản hồi cho đội."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-3 py-1.5 font-bold">
              ROLE: MENTOR [CỐ VẤN]
            </span>
          </div>
        </div>

        {/* ── TAB NAVIGATION BAR ── */}
        <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-3 font-mono text-xs">
          <Link
            href="/mentor/tracks"
            className={`px-4 py-2 hud-clipped transition-all font-bold flex items-center gap-2 ${
              activeTab === "tracks"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>🎯</span> 1. Hạng Mục Phân Công ({mockAssignedTracks.length})
          </Link>

          <Link
            href="/mentor/teams"
            className={`px-4 py-2 hud-clipped transition-all font-bold flex items-center gap-2 ${
              activeTab === "teams"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>👥</span> 2. Đội Thi Cần Hỗ Trợ ({mockTeamsToMentor.length})
          </Link>

          <Link
            href="/mentor/submissions"
            className={`px-4 py-2 hud-clipped transition-all font-bold flex items-center gap-2 ${
              activeTab === "submissions"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>📁</span> 3. Tiến Độ Bài Nộp (3 Bài)
          </Link>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MÀN HÌNH TAB 1: 🎯 HẠNG MỤC PHÂN CÔNG (/mentor/tracks)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "tracks" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAssignedTracks.map((track) => (
                <div
                  key={track.id}
                  className="hud-clipped border border-[#2dd4bf]/40 bg-[var(--bg-panel)] p-6 flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-[#2dd4bf] transition-all"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-2.5 py-0.5">
                        {track.tag}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        MÃ HẠNG MỤC: #{track.id.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] group-hover:text-[#2dd4bf] transition-colors">
                      {track.name}
                    </h3>

                    <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
                      {track.description}
                    </p>

                    {/* Co-mentors */}
                    <div className="pt-3 border-t border-[var(--border-muted)]/60 font-mono text-xs flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Cùng Phụ Trách:</span>
                      <span className="text-[var(--text-primary)] font-bold">{track.coMentors.join(", ")}</span>
                    </div>
                  </div>

                  {/* Track Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 font-mono text-center pt-4 border-t border-[var(--border-muted)]">
                    <div className="p-2 bg-[var(--bg-input)] border border-[var(--border-muted)]">
                      <div className="text-xl font-bold text-[#2dd4bf]">{track.teamsCount}</div>
                      <div className="text-[9px] text-[var(--text-muted)] uppercase mt-0.5">Đội thi</div>
                    </div>
                    <div className="p-2 bg-[var(--bg-input)] border border-[var(--border-muted)]">
                      <div className="text-xl font-bold text-[var(--accent-primary)]">{track.membersCount}</div>
                      <div className="text-[9px] text-[var(--text-muted)] uppercase mt-0.5">Thí sinh</div>
                    </div>
                    <div className="p-2 bg-[var(--bg-input)] border border-[var(--border-muted)]">
                      <div className="text-xl font-bold text-[var(--accent-judge)]">{track.deliverablesCount}</div>
                      <div className="text-[9px] text-[var(--text-muted)] uppercase mt-0.5">Bài nộp</div>
                    </div>
                  </div>

                  {/* CTA link to Teams tab */}
                  <Link href="/mentor/teams" className="w-full">
                    <button className="w-full py-2.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-mono text-xs font-bold uppercase hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all hud-clipped">
                      XEM DANH SÁCH {track.teamsCount} ĐỘI THI TRONG TRACK →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MÀN HÌNH TAB 2: 👥 ĐỘI THI CẦN HỖ TRỢ (/mentor/teams)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "teams" && (
          <div className="flex flex-col gap-6">
            {/* Filter bar */}
            <div className="flex items-center justify-between p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-muted)]">LỌC THEO HẠNG MỤC:</span>
                <button
                  onClick={() => setSelectedTrackFilter("All")}
                  className={`px-3 py-1 border transition-all ${selectedTrackFilter === "All" ? "border-[#2dd4bf] bg-[#2dd4bf]/20 text-[#2dd4bf] font-bold" : "border-[var(--border-muted)] text-[var(--text-muted)]"}`}
                >
                  TẤT CẢ ({mockTeamsToMentor.length})
                </button>
                {mockAssignedTracks.map((tr) => (
                  <button
                    key={tr.id}
                    onClick={() => setSelectedTrackFilter(tr.name)}
                    className={`px-3 py-1 border transition-all ${selectedTrackFilter === tr.name ? "border-[#2dd4bf] bg-[#2dd4bf]/20 text-[#2dd4bf] font-bold" : "border-[var(--border-muted)] text-[var(--text-muted)]"}`}
                  >
                    {tr.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="hud-clipped border border-[var(--border-muted)] bg-[var(--bg-panel)] p-6 flex flex-col gap-5 hover:border-[#2dd4bf]/50 transition-all shadow-sm"
                >
                  {/* Team Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-[var(--border-muted)]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2dd4bf]">{team.code}</span>
                        <span className="font-mono text-xs text-[var(--text-muted)]">·</span>
                        <span className="font-mono text-xs text-[var(--text-muted)]">{team.school}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mt-1">
                        {team.name}
                      </h3>
                      <span className="font-mono text-[11px] text-[var(--accent-primary)] mt-0.5 block">
                        Hạng mục: {team.track}
                      </span>
                    </div>
                    <Badge tone={team.status === "Registered" ? "success" : "warning"}>
                      {team.status === "Registered" ? "ĐÃ GHI DANH" : "ĐANG HÌNH THÀNH"}
                    </Badge>
                  </div>

                  {/* Members Roster */}
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      DANH SÁCH THÀNH VIÊN ({team.members.length} NGƯỜI):
                    </span>
                    <div className="flex flex-col gap-1.5 bg-[var(--bg-input)]/50 p-3 border border-[var(--border-muted)]">
                      {team.members.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-[var(--border-muted)]/40 last:border-none">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--text-primary)]">{m.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-[var(--accent-team)]/10 text-[var(--accent-team)] border border-[var(--accent-team)]/30 font-bold">
                              {m.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)]">{m.school}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leader Contact */}
                  <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-xs flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Liên hệ Đội Trưởng:</span>
                    <span className="text-[#2dd4bf] font-bold">{team.leader.email}</span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setFeedbackTeam(team.name)}
                    className="w-full py-2 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-mono text-xs font-bold uppercase hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all hud-clipped"
                  >
                    💬 GỢI Ý & TƯ VẤN CHUYÊN MÔN CHO ĐỘI
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MÀN HÌNH TAB 3: 📁 TIẾN ĐỘ BÀI NỘP (/mentor/submissions)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "submissions" && (
          <div className="flex flex-col gap-6">
            <div className="w-full overflow-x-auto border border-[var(--border-muted)] bg-[var(--bg-panel)] hud-clipped">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-base)] text-[var(--text-muted)]">
                    <th className="p-4 uppercase">Mã Đội</th>
                    <th className="p-4 uppercase">Đội Thi</th>
                    <th className="p-4 uppercase">Hạng Mục</th>
                    <th className="p-4 uppercase">Mã Nguồn (GitHub)</th>
                    <th className="p-4 uppercase">Slides Thuyết Trình</th>
                    <th className="p-4 uppercase">Demo Video</th>
                    <th className="p-4 uppercase text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-muted)]">
                  {mockTeamsToMentor.map((team) => (
                    <tr key={team.id} className="hover:bg-[#2dd4bf]/5 transition-colors">
                      <td className="p-4 text-[#2dd4bf] font-bold">{team.code}</td>
                      <td className="p-4 text-[var(--text-primary)] font-bold">{team.name}</td>
                      <td className="p-4 text-[var(--text-muted)]">{team.track}</td>
                      <td className="p-4">
                        {team.deliverables.github ? (
                          <a href={team.deliverables.github} target="_blank" rel="noreferrer" className="text-[#2dd4bf] hover:underline truncate max-w-[150px] inline-block font-bold">
                            📦 GitHub Repo ↗
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4">
                        {team.deliverables.slides ? (
                          <a href={team.deliverables.slides} target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline truncate max-w-[150px] inline-block font-bold">
                            📊 Slide Deck ↗
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4">
                        {team.deliverables.demo ? (
                          <a href={team.deliverables.demo} target="_blank" rel="noreferrer" className="text-[var(--accent-judge)] hover:underline truncate max-w-[150px] inline-block font-bold">
                            🎬 Demo Video ↗
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setFeedbackTeam(team.name)}
                          className="px-3 py-1 border border-[#2dd4bf]/40 text-[#2dd4bf] hover:bg-[#2dd4bf]/10 transition-colors uppercase font-bold text-[10px]"
                        >
                          💬 GÓP Ý ({team.notesCount})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Gửi Góp Ý Cố Vấn */}
        {feedbackTeam && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-panel)] border border-[#2dd4bf] p-6 max-w-lg w-full hud-clipped flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-muted)]">
                <h3 className="font-display font-bold text-lg text-[#2dd4bf]">
                  💬 GỬI GÓP Ý CHUYÊN MÔN CHO ĐỘI: {feedbackTeam}
                </h3>
                <button onClick={() => setFeedbackTeam(null)} className="text-[var(--text-muted)] hover:text-white">✕</button>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                <label className="text-[var(--text-muted)]">NỘI DUNG NHẬN XÉT & PHẢN HỒI CỐ VẤN:</label>
                <textarea
                  rows={4}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Ghi nhận xét về kiến trúc mã nguồn, thiết kế slide hoặc hướng tối ưu sản phẩm cho đội..."
                  className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] focus:border-[#2dd4bf] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 font-mono text-xs pt-2">
                <button
                  onClick={() => setFeedbackTeam(null)}
                  className="px-4 py-2 border border-[var(--border-muted)] text-[var(--text-muted)]"
                >
                  HỦY
                </button>
                <button
                  onClick={() => {
                    alert(`[MOCK] Đã gửi góp ý cố vấn tới đội: ${feedbackTeam}`);
                    setFeedbackTeam(null);
                    setFeedbackNote("");
                  }}
                  className="px-4 py-2 bg-[#2dd4bf] text-[var(--bg-base)] font-bold"
                >
                  GỬI GÓP Ý CỐ VẤN
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
