"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui";
import { Target, Users, Folder, MessageSquare, Search, Building2, ExternalLink, X } from "lucide-react";

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

  // State Quản Lý Giao Diện Tab 2 Đội Thi
  const [teamViewMode, setTeamViewMode] = useState<"table" | "cards">("table");
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [teamStatusFilter, setTeamStatusFilter] = useState("ALL");
  const [selectedRosterTeam, setSelectedRosterTeam] = useState<typeof mockAiTrackTeams[0] | null>(null);

  const filteredTeams = mockAiTrackTeams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      t.school.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      t.leader.email.toLowerCase().includes(teamSearchQuery.toLowerCase());
    const matchesStatus = teamStatusFilter === "ALL" || t.status === teamStatusFilter;
    return matchesSearch && matchesStatus;
  });

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

        {/* ── TAB CONTAINER ── */}
        <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-5 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "tracks"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <Target className="w-4 h-4" /> 1. Hạng Mục Phân Công ({mockAssignedTracks.length})
          </button>

          <button
            onClick={() => setActiveTab("teams")}
            className={`px-5 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "teams"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <Users className="w-4 h-4" /> 2. Đội Thi Cần Hỗ Trợ ({mockAiTrackTeams.length} Đội)
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "submissions"
                ? "bg-[#2dd4bf] text-[var(--bg-base)] shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <Folder className="w-4 h-4" /> 3. Tiến Độ Bài Nộp & Mã Nguồn (8 Bài)
          </button>
        </div>

        {/* TAB 1: TRACKS */}
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

                    <div className="pt-3 border-t border-[var(--border-muted)]/60 font-mono text-xs flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Cố Vấn Cùng Phụ Trách:</span>
                      <span className="text-[var(--text-primary)] font-bold">{track.coMentors.join(", ")}</span>
                    </div>
                  </div>

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

                  <button
                    onClick={() => setActiveTab("teams")}
                    className="w-full py-2.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-mono text-xs font-bold uppercase hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all hud-clipped cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" /> Quản lý cố vấn {track.teamsCount} Đội thi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TEAMS */}
        {activeTab === "teams" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[var(--text-muted)] font-bold uppercase">HẠNG MỤC ĐANG CỐ VẤN:</span>
                <span className="text-[#2dd4bf] font-bold bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-3 py-1">
                  AI & Machine Learning ({mockAiTrackTeams.length} Đội thi)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[var(--text-muted)] hidden sm:inline">
                  Hiển thị <strong className="text-white">{filteredTeams.length}</strong> / {mockAiTrackTeams.length} Đội
                </span>

                <div className="flex items-center border border-[var(--border-muted)] p-0.5 bg-[var(--bg-input)]">
                  <button
                    onClick={() => setTeamViewMode("table")}
                    className={`px-3 py-1 font-bold transition-all cursor-pointer ${
                      teamViewMode === "table"
                        ? "bg-[#2dd4bf] text-[var(--bg-base)]"
                        : "text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    Bảng dữ liệu
                  </button>
                  <button
                    onClick={() => setTeamViewMode("cards")}
                    className={`px-3 py-1 font-bold transition-all cursor-pointer ${
                      teamViewMode === "cards"
                        ? "bg-[#2dd4bf] text-[var(--bg-base)]"
                        : "text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    Thẻ Card
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped font-mono text-xs">
              <div className="relative w-full sm:w-96">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  placeholder="Tìm tên đội, mã đội, trường học..."
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-muted)] pl-8 pr-8 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#2dd4bf]"
                />
                {teamSearchQuery && (
                  <button
                    onClick={() => setTeamSearchQuery("")}
                    className="absolute right-2.5 top-2 text-[var(--text-muted)] hover:text-white font-bold"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[var(--text-muted)] shrink-0">Lọc Trạng Thái:</span>
                <select
                  value={teamStatusFilter}
                  onChange={(e) => setTeamStatusFilter(e.target.value)}
                  className="bg-[var(--bg-input)] border border-[var(--border-muted)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2dd4bf] w-full sm:w-auto"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="Registered">Đã ghi danh</option>
                  <option value="Forming">Đang hình thành</option>
                </select>
              </div>
            </div>

            {teamViewMode === "table" && (
              <div className="w-full overflow-x-auto border border-[var(--border-muted)] bg-[var(--bg-panel)] hud-clipped">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-base)] text-[var(--text-muted)]">
                      <th className="p-3 uppercase">Mã Đội</th>
                      <th className="p-3 uppercase">Tên Đội Thi & Trường</th>
                      <th className="p-3 uppercase">Thành Viên</th>
                      <th className="p-3 uppercase">Email Đội Trưởng</th>
                      <th className="p-3 uppercase">Trạng Thái</th>
                      <th className="p-3 uppercase text-right">Tư Vấn Chuyên Môn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-muted)]/60">
                    {filteredTeams.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[var(--text-muted)] italic">
                          Không tìm thấy đội thi nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredTeams.map((team) => (
                        <tr key={team.id} className="hover:bg-[var(--bg-input)]/40 transition-colors">
                          <td className="p-3 font-bold text-[#2dd4bf] whitespace-nowrap">
                            {team.code}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-[var(--text-primary)] text-sm">{team.name}</div>
                            <div className="text-[10px] text-[var(--text-muted)]">{team.school}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRosterTeam(team)}
                              className="px-2.5 py-1 bg-[var(--accent-team)]/10 text-[var(--accent-team)] border border-[var(--accent-team)]/30 font-bold text-[10px] hover:bg-[var(--accent-team)] hover:text-black transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Users className="w-3 h-3" /> Thành viên ({team.membersCount})
                            </button>
                          </td>
                          <td className="p-3 text-[var(--text-primary)] font-mono text-[11px] whitespace-nowrap">
                            {team.leader.email}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <Badge tone={team.status === "Registered" ? "success" : "warning"}>
                              {team.status === "Registered" ? "ĐÃ GHI DANH" : "ĐANG HÌNH THÀNH"}
                            </Badge>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => setFeedbackTeam(team.name)}
                              className="px-3 py-1.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-bold text-[11px] uppercase hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all hud-clipped cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <MessageSquare className="w-3 h-3" /> Gợi Ý & Tư Vấn
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {teamViewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="hud-clipped border border-[var(--border-muted)] bg-[var(--bg-panel)] p-6 flex flex-col justify-between gap-5 hover:border-[#2dd4bf]/50 transition-all shadow-sm"
                  >
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

                    <div className="p-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-xs flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Email Đội Trưởng:</span>
                      <span className="text-[#2dd4bf] font-bold">{team.leader.email}</span>
                    </div>

                    <button
                      onClick={() => setFeedbackTeam(team.name)}
                      className="w-full py-2.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] font-mono text-xs font-bold uppercase hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all hud-clipped cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Gợi Ý & Tư Vấn Chuyên Môn
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBMISSIONS */}
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
                            GitHub Repo <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4">
                        {team.deliverables.slides ? (
                          <a href={team.deliverables.slides} target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline font-bold flex items-center gap-1">
                            Slide <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4">
                        {team.deliverables.demo ? (
                          <a href={team.deliverables.demo} target="_blank" rel="noreferrer" className="text-[var(--accent-judge)] hover:underline font-bold flex items-center gap-1">
                            Video Demo <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]/50 italic">Chưa nộp</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setFeedbackTeam(team.name)}
                          className="px-3 py-1.5 border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf] hover:bg-[#2dd4bf] hover:text-[var(--bg-base)] transition-all uppercase font-bold text-[10px] hud-clipped cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <MessageSquare className="w-3 h-3" /> Phản Hồi & Góp Ý
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
                <h3 className="font-display font-bold text-lg text-[#2dd4bf] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Gửi Góp Ý Cố Vấn Cho Đội: {feedbackTeam}
                </h3>
                <button onClick={() => setFeedbackTeam(null)} className="text-[var(--text-muted)] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                <label className="text-[var(--text-muted)] uppercase">NỘI DUNG NHẬN XÉT CỐ VẤN MÃ NGUỒN & KIẾN TRÚC:</label>
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
                  className="px-4 py-2 border border-[var(--border-muted)] text-[var(--text-muted)] hover:bg-white/5 cursor-pointer"
                >
                  HỦY
                </button>
                <button
                  onClick={() => {
                    setFeedbackTeam(null);
                    setFeedbackNote("");
                  }}
                  className="px-4 py-2 bg-[#2dd4bf] text-[var(--bg-base)] font-bold hover:bg-white cursor-pointer"
                >
                  GỬI GÓP Ý
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XEM DANH SÁCH THÀNH VIÊN */}
        {selectedRosterTeam && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-panel)] border border-[#2dd4bf] p-6 max-w-xl w-full hud-clipped flex flex-col gap-5 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-muted)]">
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-bold">
                    <span>{selectedRosterTeam.code}</span>
                    <span>·</span>
                    <span>{selectedRosterTeam.school}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mt-0.5">
                    THÀNH VIÊN ĐỘI: {selectedRosterTeam.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRosterTeam(null)}
                  className="text-lg text-[var(--text-muted)] hover:text-white cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                  DANH SÁCH THÀNH VIÊN ({selectedRosterTeam.membersCount} NGƯỜI):
                </span>
                <div className="border border-[var(--border-muted)] bg-[var(--bg-input)] divide-y divide-[var(--border-muted)]">
                  {selectedRosterTeam.members.map((member, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-sm">{member.name}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 font-bold uppercase border ${
                            member.role === "Đội Trưởng"
                              ? "bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/40"
                              : "bg-[var(--accent-team)]/10 text-[var(--accent-team)] border-[var(--accent-team)]/30"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">{member.school}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-muted)] flex justify-between items-center text-xs">
                <span className="text-[var(--text-muted)]">Email Đội Trưởng Liên Hệ:</span>
                <span className="text-[#2dd4bf] font-bold">{selectedRosterTeam.leader.email}</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRosterTeam(null)}
                  className="px-5 py-2 bg-[#2dd4bf] text-[var(--bg-base)] font-bold uppercase hover:bg-white transition-all cursor-pointer hud-clipped"
                >
                  ĐÓNG CỬA SỔ
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
