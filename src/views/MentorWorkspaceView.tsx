"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui";

export function MentorWorkspaceView() {
  const [activeTab, setActiveTab] = useState<"tracks" | "teams" | "submissions">("tracks");
  const [feedbackTeam, setFeedbackTeam] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("AI & Machine Learning");

  const mockAssignedTracks = [
    {
      id: "tr-01",
      name: "AI & Machine Learning",
      tag: "AI_ML",
      description: "Xây dựng các ứng dụng trí tuệ nhân tạo, học máy, xử lý ngôn ngữ tự nhiên và thị giác máy tính.",
      teamsCount: 8,
      membersCount: 34,
      deliverablesCount: 8,
      coMentors: ["TS. Nguyễn Văn Cố Vấn", "ThS. Lê Hoàng Nam"],
    },
    {
      id: "tr-02",
      name: "Web & Cloud Architecture",
      tag: "WEB_CLOUD",
      description: "Phát triển hệ thống web quy mô lớn, kiến trúc Serverless, Microservices và tối ưu hóa hạ tầng Cloud.",
      teamsCount: 6,
      membersCount: 26,
      deliverablesCount: 6,
      coMentors: ["TS. Trịnh Quốc Bảo"],
    },
    {
      id: "tr-03",
      name: "CyberSecurity & Network",
      tag: "SECURITY",
      description: "Bảo mật ứng dụng, an ninh mạng, kiểm thử xâm nhập và phòng vệ hệ thống thông tin.",
      teamsCount: 5,
      membersCount: 20,
      deliverablesCount: 4,
      coMentors: ["Kỹ sư Nguyễn Thành Long"],
    },
  ];

  // Danh sách đủ 8 Đội thi của Hạng Mục AI & Machine Learning
  const mockAiTrackTeams = [
    {
      id: "team-01",
      code: "#TM-001",
      name: "CyberGuardians",
      school: "Trường Đại Học FPT HN",
      status: "Registered",
      leader: { name: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn" },
      membersCount: 4,
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
    },
    {
      id: "team-02",
      code: "#TM-002",
      name: "ByteKnights",
      school: "Đại Học Bách Khoa HN",
      status: "Registered",
      leader: { name: "Trần Văn Nam", email: "nam.tv@hust.edu.vn" },
      membersCount: 5,
      members: [
        { name: "Trần Văn Nam", role: "Đội Trưởng", school: "ĐH Bách Khoa" },
        { name: "Đặng Thị Hoa", role: "Thành Viên", school: "ĐH Bách Khoa" },
        { name: "Nguyễn Tiến Dũng", role: "Thành Viên", school: "ĐH Quốc Gia" },
        { name: "Lê Hữu Hoàng", role: "Thành Viên", school: "ĐH Bách Khoa" },
        { name: "Phạm Hồng Ngọc", role: "Thành Viên", school: "ĐH Bách Khoa" },
      ],
      deliverables: {
        github: "https://github.com/byte-knights/ai-vision",
        slides: "https://docs.google.com/presentation/d/byte-knights",
        demo: "https://youtube.com/watch?v=byte-demo",
      },
      lastUpdated: "11/08/2026 21:15",
    },
    {
      id: "team-03",
      code: "#TM-003",
      name: "NeuralCrafters",
      school: "Đại Học Quốc Gia Hà Nội",
      status: "Registered",
      leader: { name: "Đỗ Minh Đức", email: "duc.dm@vnu.edu.vn" },
      membersCount: 4,
      members: [
        { name: "Đỗ Minh Đức", role: "Đội Trưởng", school: "ĐH Quốc Gia" },
        { name: "Nguyễn Thu Hà", role: "Thành Viên", school: "ĐH Quốc Gia" },
        { name: "Trần Đức Thắng", role: "Thành Viên", school: "ĐH Quốc Gia" },
        { name: "Hoàng Mai Linh", role: "Thành Viên", school: "ĐH Quốc Gia" },
      ],
      deliverables: {
        github: "https://github.com/neural-crafters/nlp-seal",
        slides: "https://docs.google.com/presentation/d/neural-nlp",
        demo: "https://youtube.com/watch?v=neural-demo",
      },
      lastUpdated: "12/08/2026 09:45",
    },
    {
      id: "team-04",
      code: "#TM-004",
      name: "VisionCraft AI",
      school: "Trường Đại Học FPT HCM",
      status: "Registered",
      leader: { name: "Lê Hoàng Tuấn", email: "tuanlh@fpt.edu.vn" },
      membersCount: 4,
      members: [
        { name: "Lê Hoàng Tuấn", role: "Đội Trưởng", school: "FPT HCM" },
        { name: "Bùi Thị Mai", role: "Thành Viên", school: "FPT HCM" },
        { name: "Phan Quốc Huy", role: "Thành Viên", school: "FPT HCM" },
        { name: "Nguyễn Hải Yến", role: "Thành Viên", school: "FPT HCM" },
      ],
      deliverables: {
        github: "https://github.com/visioncraft/cv-seal-2026",
        slides: "https://docs.google.com/presentation/d/visioncraft",
        demo: "",
      },
      lastUpdated: "10/08/2026 15:20",
    },
    {
      id: "team-05",
      code: "#TM-005",
      name: "DeepMinders FPT",
      school: "Trường Đại Học FPT ĐN",
      status: "Registered",
      leader: { name: "Vũ Bảo Long", email: "longvb@fpt.edu.vn" },
      membersCount: 4,
      members: [
        { name: "Vũ Bảo Long", role: "Đội Trưởng", school: "FPT ĐN" },
        { name: "Đinh Quang Hải", role: "Thành Viên", school: "FPT ĐN" },
        { name: "Trịnh Thị Hương", role: "Thành Viên", school: "FPT ĐN" },
        { name: "Ngô Tấn Tài", role: "Thành Viên", school: "FPT ĐN" },
      ],
      deliverables: {
        github: "https://github.com/deepminders/rl-bot",
        slides: "https://docs.google.com/presentation/d/deepminders",
        demo: "https://youtube.com/watch?v=deep-demo",
      },
      lastUpdated: "11/08/2026 17:00",
    },
    {
      id: "team-06",
      code: "#TM-006",
      name: "DataSurgeons",
      school: "Học Viện Công Nghệ Bưu Chính Viễn Thông",
      status: "Registered",
      leader: { name: "Phạm Thành Đạt", email: "datpt@ptit.edu.vn" },
      membersCount: 4,
      members: [
        { name: "Phạm Thành Đạt", role: "Đội Trưởng", school: "PTIT" },
        { name: "Nguyễn Duy Khánh", role: "Thành Viên", school: "PTIT" },
        { name: "Lê Ngọc Ánh", role: "Thành Viên", school: "PTIT" },
        { name: "Trần Tuấn Anh", role: "Thành Viên", school: "PTIT" },
      ],
      deliverables: {
        github: "https://github.com/datasurgeons/med-ai",
        slides: "https://docs.google.com/presentation/d/med-ai",
        demo: "",
      },
      lastUpdated: "09/08/2026 22:10",
    },
    {
      id: "team-07",
      code: "#TM-007",
      name: "AiShield Systems",
      school: "Đại Học Bách Khoa HCM",
      status: "Registered",
      leader: { name: "Hoàng Văn Thái", email: "thai.hv@hcmut.edu.vn" },
      membersCount: 5,
      members: [
        { name: "Hoàng Văn Thái", role: "Đội Trưởng", school: "ĐH Bách Khoa HCM" },
        { name: "Nguyễn Thanh Sơn", role: "Thành Viên", school: "ĐH Bách Khoa HCM" },
        { name: "Lý Văn Hùng", role: "Thành Viên", school: "ĐH Bách Khoa HCM" },
        { name: "Đỗ Thị Quỳnh", role: "Thành Viên", school: "ĐH Bách Khoa HCM" },
        { name: "Vũ Minh Quân", role: "Thành Viên", school: "ĐH Bách Khoa HCM" },
      ],
      deliverables: {
        github: "https://github.com/aishield/security-ai",
        slides: "https://docs.google.com/presentation/d/aishield",
        demo: "https://youtube.com/watch?v=aishield-demo",
      },
      lastUpdated: "12/08/2026 14:00",
    },
    {
      id: "team-08",
      code: "#TM-008",
      name: "SmartMatrix",
      school: "Trường Đại Học FPT Cần Thơ",
      status: "Forming",
      leader: { name: "Huỳnh Quốc Bảo", email: "baohq@fpt.edu.vn" },
      membersCount: 4,
      members: [
        { name: "Huỳnh Quốc Bảo", role: "Đội Trưởng", school: "FPT Cần Thơ" },
        { name: "Lương Thị Trúc", role: "Thành Viên", school: "FPT Cần Thơ" },
        { name: "Nguyễn Hoàng Nam", role: "Thành Viên", school: "FPT Cần Thơ" },
        { name: "Trần Mỹ Duyên", role: "Thành Viên", school: "FPT Cần Thơ" },
      ],
      deliverables: {
        github: "https://github.com/smartmatrix/seal-project",
        slides: "",
        demo: "",
      },
      lastUpdated: "10/08/2026 11:30",
    },
  ];

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)]">
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* ── Header Cố Vấn Panel ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-muted)]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#2dd4bf] tracking-widest uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
              MENTOR WORKSPACE [CỐ VẤN CHUYÊN MÔN HẠNG MỤC]
            </div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-[var(--text-primary)] mt-1">
              BÀN LÀM VIỆC CỐ VẤN CHUYÊN MÔN
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Quản lý các Hạng mục thi đấu, theo dõi tiến độ sản phẩm và tư vấn định hướng kỹ thuật cho toàn bộ các Đội thi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-3 py-1.5 font-bold">
              ROLE: MENTOR [CỐ VẤN TRACK]
            </span>
          </div>
        </div>

        {/* ── TAB CONTAINER (CHUYỂN TAB ĐỒNG BỘ 0MS TẠI CHỖ) ── */}
        <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-5 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "tracks"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>🎯</span> 1. Hạng Mục Phân Công ({mockAssignedTracks.length})
          </button>

          <button
            onClick={() => setActiveTab("teams")}
            className={`px-5 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "teams"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>👥</span> 2. Đội Thi Cần Hỗ Trợ ({mockAiTrackTeams.length} Đội)
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "submissions"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>📁</span> 3. Tiến Độ Bài Nộp & Mã Nguồn (8 Bài)
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: 🎯 HẠNG MỤC PHÂN CÔNG (TRACKS)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "tracks" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
              <span>CÁC HẠNG MỤC CÔNG NGHỆ BẠN ĐANG ĐẢM NHẬN CỐ VẤN ({mockAssignedTracks.length} TRACKS)</span>
              <span className="text-[#2dd4bf] font-bold">Tổng cộng: 19 Đội thi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockAssignedTracks.map((track) => (
                <div
                  key={track.id}
                  className="hud-clipped border border-[#2dd4bf]/40 bg-[var(--bg-panel)] p-6 flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-[#2dd4bf] transition-all shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-2.5 py-0.5">
                        {track.tag}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        #{track.id.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] group-hover:text-[#2dd4bf] transition-colors">
                      {track.name}
                    </h3>

                    <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed min-h-[60px]">
                      {track.description}
                    </p>

                    {/* Co-mentors */}
                    <div className="pt-3 border-t border-[var(--border-muted)]/60 font-mono text-xs flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Cố Vấn Cùng Phụ Trách:</span>
                      <span className="text-[var(--text-primary)] font-bold">{track.coMentors.join(", ")}</span>
                    </div>
                  </div>

                  {/* Track Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-center pt-4 border-t border-[var(--border-muted)]">
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

                  {/* CTA Switch to Teams Tab */}
                  <button
                    onClick={() => setActiveTab("teams")}
                    className="w-full py-2.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-mono text-xs font-bold uppercase hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all hud-clipped cursor-pointer"
                  >
                    ➡️ QUẢN LÝ CỐ VẤN {track.teamsCount} ĐỘI THI
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: 👥 ĐỘI THI CẦN HỖ TRỢ (TEAMS - FULL 8 TEAMS)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "teams" && (
          <div className="flex flex-col gap-6">
            {/* Header Track Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-muted)] font-bold">HẠNG MỤC ĐANG CỐ VẤN:</span>
                <span className="text-[#2dd4bf] font-bold bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-3 py-1">
                  AI & Machine Learning (8 Đội)
                </span>
              </div>
              <span className="text-[var(--text-muted)]">Hiển thị đầy đủ {mockAiTrackTeams.length} / {mockAiTrackTeams.length} Đội thi</span>
            </div>

            {/* Teams Grid - Full 8 teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAiTrackTeams.map((team) => (
                <div
                  key={team.id}
                  className="hud-clipped border border-[var(--border-muted)] bg-[var(--bg-panel)] p-6 flex flex-col justify-between gap-5 hover:border-[#2dd4bf]/50 transition-all shadow-sm"
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
                    </div>
                    <Badge tone={team.status === "Registered" ? "success" : "warning"}>
                      {team.status === "Registered" ? "ĐÃ GHI DANH" : "ĐANG HÌNH THÀNH"}
                    </Badge>
                  </div>

                  {/* Members Roster */}
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      THÀNH VIÊN ĐỘI THI ({team.membersCount} NGƯỜI):
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
                  <div className="p-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-xs flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Email Đội Trưởng:</span>
                    <span className="text-[#2dd4bf] font-bold">{team.leader.email}</span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setFeedbackTeam(team.name)}
                    className="w-full py-2.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-mono text-xs font-bold uppercase hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all hud-clipped cursor-pointer"
                  >
                    💬 GỢI Ý & TƯ VẤN CHUYÊN MÔN CHO ĐỘI
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: 📁 TIẾN ĐỘ BÀI NỘP (SUBMISSIONS)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "submissions" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
              <span>BẢNG THEO DÕI TIẾN ĐỘ NỘP SẢN PHẨM — HẠNG MỤC: <strong className="text-[#2dd4bf]">AI & MACHINE LEARNING</strong></span>
              <span className="text-[#2dd4bf] font-bold">Hiển thị 8 / 8 Bài nộp</span>
            </div>

            <div className="w-full overflow-x-auto border border-[var(--border-muted)] bg-[var(--bg-panel)] hud-clipped">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-base)] text-[var(--text-muted)]">
                    <th className="p-4 uppercase">Mã Đội</th>
                    <th className="p-4 uppercase">Tên Đội Thi</th>
                    <th className="p-4 uppercase">Trường Học</th>
                    <th className="p-4 uppercase">Mã Nguồn (GitHub)</th>
                    <th className="p-4 uppercase">Slide Thuyết Trình</th>
                    <th className="p-4 uppercase">Demo Video</th>
                    <th className="p-4 uppercase text-center">Thao Tác Cố Vấn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-muted)]">
                  {mockAiTrackTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-[#2dd4bf]/5 transition-colors">
                      <td className="p-4 text-[#2dd4bf] font-bold">{team.code}</td>
                      <td className="p-4 text-[var(--text-primary)] font-bold">{team.name}</td>
                      <td className="p-4 text-[var(--text-muted)]">{team.school}</td>
                      <td className="p-4">
                        {team.deliverables.github ? (
                          <a href={team.deliverables.github} target="_blank" rel="noreferrer" className="text-[#2dd4bf] hover:underline font-bold flex items-center gap-1">
                            <span>📦 Repo</span> ↗
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4">
                        {team.deliverables.slides ? (
                          <a href={team.deliverables.slides} target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline font-bold flex items-center gap-1">
                            <span>📊 Slide</span> ↗
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4">
                        {team.deliverables.demo ? (
                          <a href={team.deliverables.demo} target="_blank" rel="noreferrer" className="text-[var(--accent-judge)] hover:underline font-bold flex items-center gap-1">
                            <span>🎬 Video</span> ↗
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setFeedbackTeam(team.name)}
                          className="px-3 py-1.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all uppercase font-bold text-[10px] hud-clipped cursor-pointer"
                        >
                          💬 PHẢN HỒI & GÓP Ý
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
            <div className="bg-[var(--bg-panel)] border border-[#2dd4bf] p-6 max-w-lg w-full hud-clipped flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-muted)]">
                <h3 className="font-display font-bold text-lg text-[#2dd4bf]">
                  💬 GỬI GÓP Ý CỐ VẤN CHO ĐỘI: {feedbackTeam}
                </h3>
                <button onClick={() => setFeedbackTeam(null)} className="text-[var(--text-muted)] hover:text-white">✕</button>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                <label className="text-[var(--text-muted)]">NỘI DUNG NHẬN XÉT CỐ VẤN MÃ NGUỒN & KIẾN TRÚC:</label>
                <textarea
                  rows={4}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Nhập ghi chú phản hồi chuyên môn cho Đội..."
                  className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] focus:border-[#2dd4bf] focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 font-mono text-xs pt-2">
                <button
                  onClick={() => setFeedbackTeam(null)}
                  className="px-4 py-2 border border-[var(--border-muted)] text-[var(--text-muted)] hover:bg-white/5"
                >
                  HỦY
                </button>
                <button
                  onClick={() => {
                    alert(`[MOCK] Đã gửi góp ý cố vấn thành công tới Đội: ${feedbackTeam}`);
                    setFeedbackTeam(null);
                    setFeedbackNote("");
                  }}
                  className="px-4 py-2 bg-[#2dd4bf] text-[var(--bg-base)] font-bold hover:bg-white"
                >
                  GỬI GÓP Ý
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
