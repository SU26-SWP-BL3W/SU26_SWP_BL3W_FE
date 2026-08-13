"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/AuthProvider";
import { hasEventPermission } from "@/lib/permissions";
import { Badge } from "@/components/ui";

export function CoordinatorWorkspaceView({ eventId = "event-seal-2026" }: { eventId?: string }) {
  const { user, activeRole } = useAuth();
  const hasPermission = hasEventPermission(user, activeRole, eventId);

  const [activeTab, setActiveTab] = useState<"teams" | "profiles" | "staff" | "results" | "appeals">("teams");
  
  // State duyệt Đội thi
  const [pendingTeams, setPendingTeams] = useState([
    {
      id: "team-01",
      code: "#TM-001",
      name: "Cyber_Knights",
      track: "AI & Machine Learning",
      leader: "Nguyễn Văn Leader (leader@fpt.edu.vn)",
      membersCount: 4,
      school: "Trường Đại Học FPT HN",
      submittedAt: "12/08/2026 14:30",
    },
    {
      id: "team-03",
      code: "#TM-003",
      name: "CloudNinjas FPT",
      track: "Web & Cloud Architecture",
      leader: "Lê Hoàng Nhật (nhatlh@fpt.edu.vn)",
      membersCount: 3,
      school: "Trường Đại Học FPT HCM",
      submittedAt: "12/08/2026 16:15",
    },
  ]);

  // State duyệt Thẻ Sinh Viên (Tối ưu cho 100+ thí sinh)
  const [pendingProfiles, setPendingProfiles] = useState([
    {
      id: "usr-101",
      name: "Phạm Quỳnh Anh",
      email: "anh.pq@gmail.com",
      studentCode: "20210045",
      school: "Đại Học Bách Khoa HN",
      studentCardUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
      submittedAt: "11/08/2026 10:00",
    },
    {
      id: "usr-102",
      name: "Trần Văn Nam",
      email: "nam.tv@hust.edu.vn",
      studentCode: "20213890",
      school: "Đại Học Bách Khoa HN",
      studentCardUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      submittedAt: "12/08/2026 08:30",
    },
    {
      id: "usr-103",
      name: "Lê Minh Trí",
      email: "tri.lm@vnu.edu.vn",
      studentCode: "22021543",
      school: "Đại Học Quốc Gia Hà Nội",
      studentCardUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      submittedAt: "12/08/2026 09:15",
    },
    {
      id: "usr-104",
      name: "Nguyễn Thu Hà",
      email: "ha.nt@hcmut.edu.vn",
      studentCode: "2110482",
      school: "Đại Học Bách Khoa TP.HCM",
      studentCardUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      submittedAt: "12/08/2026 11:20",
    },
    {
      id: "usr-105",
      name: "Vũ Hoàng Long",
      email: "long.vh@ptit.edu.vn",
      studentCode: "B21DCCN450",
      school: "Học Viện Công Nghệ Bưu Chính Viễn Thông",
      studentCardUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800",
      submittedAt: "12/08/2026 14:05",
    },
    {
      id: "usr-106",
      name: "Đặng Hoàng Yến",
      email: "yen.dh@neu.edu.vn",
      studentCode: "11218902",
      school: "Đại Học Kinh Tế Quốc Dân",
      studentCardUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
      submittedAt: "12/08/2026 15:40",
    },
  ]);

  // States quản lý bảng duyệt thẻ
  const [profileSearchTerm, setProfileSearchTerm] = useState("");
  const [profileSchoolFilter, setProfileSchoolFilter] = useState("ALL");
  const [profileViewMode, setProfileViewMode] = useState<"table" | "grid">("table");
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [previewCardModal, setPreviewCardModal] = useState<{
    id: string;
    name: string;
    email: string;
    school: string;
    studentCode: string;
    studentCardUrl: string;
  } | null>(null);

  // Filtered profiles
  const filteredProfiles = pendingProfiles.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(profileSearchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(profileSearchTerm.toLowerCase()) ||
      p.school.toLowerCase().includes(profileSearchTerm.toLowerCase()) ||
      (p.studentCode && p.studentCode.toLowerCase().includes(profileSearchTerm.toLowerCase()));

    const matchSchool = profileSchoolFilter === "ALL" || p.school === profileSchoolFilter;
    return matchSearch && matchSchool;
  });

  const handleSelectAllProfiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProfileIds(filteredProfiles.map((p) => p.id));
    } else {
      setSelectedProfileIds([]);
    }
  };

  const handleToggleSelectProfile = (id: string) => {
    setSelectedProfileIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkApproveProfiles = () => {
    if (selectedProfileIds.length === 0) return;
    alert(`[BTC DUYỆT HÀNG LOẠT] Đã xác thực thành công Thẻ Sinh Viên cho ${selectedProfileIds.length} thí sinh!`);
    setPendingProfiles((prev) => prev.filter((p) => !selectedProfileIds.includes(p.id)));
    setSelectedProfileIds([]);
  };

  const handleBulkRejectProfiles = () => {
    if (selectedProfileIds.length === 0) return;
    alert(`[BTC TỪ CHỐI HÀNG LOẠT] Đã từ chối Thẻ Sinh Viên của ${selectedProfileIds.length} thí sinh!`);
    setPendingProfiles((prev) => prev.filter((p) => !selectedProfileIds.includes(p.id)));
    setSelectedProfileIds([]);
  };

  // State Tính điểm & Công bố
  const [isCalculated, setIsCalculated] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // State Phúc Khảo
  const [pendingAppeals, setPendingAppeals] = useState([
    {
      id: "app-01",
      teamName: "Cyber_Knights",
      submission: "Hệ thống nhận diện gian lận thi cử AI",
      reason: "Đội chúng tôi khiếu nại về điểm tiêu chí Kiến Trúc Hệ Thống từ Giám Khảo 2 chưa đánh giá hết phần tối ưu Serverless.",
      submittedAt: "12/08/2026 19:00",
      status: "Filed",
    },
  ]);

  const [responseModal, setResponseModal] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  const showToast = (text: string, type: "success" | "danger" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveTeam = (id: string, name: string) => {
    showToast(`✓ Đã phê duyệt chính thức cho Đội: ${name}. Đội chuyển sang trạng thái Registered!`, "success");
    setPendingTeams(prev => prev.filter(t => t.id !== id));
  };

  const handleRejectTeam = (id: string, name: string) => {
    showToast(`✕ Đã từ chối hồ sơ Đội: ${name}. Đội đã chuyển về trạng thái Forming!`, "danger");
    setPendingTeams(prev => prev.filter(t => t.id !== id));
  };

  const handleApproveProfile = (id: string, name: string) => {
    showToast(`✓ Đã xác thực thành công Thẻ Sinh Viên cho: ${name}`, "success");
    setPendingProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleRejectProfile = (id: string, name: string) => {
    showToast(`✕ Đã từ chối Thẻ Sinh Viên của: ${name}`, "danger");
    setPendingProfiles(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)]">
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* ── Header Control Center ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-muted)]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#a855f7] tracking-widest uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
              EVENT COORDINATOR CONTROL CENTER [BAN TỔ CHỨC ĐIỀU HÀNH]
            </div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-[var(--text-primary)] mt-1">
              Bàn Điều Hành Sự Kiện & Phê Duyệt
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Duyệt đăng ký Đội thi, xác thực hồ sơ sinh viên, phân công Giám khảo/Mentor, tính điểm và công bố kết quả.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#a855f7] bg-[#a855f7]/10 border border-[#a855f7]/30 px-3 py-1.5 font-bold">
              ROLE: EVENT COORDINATOR [BTC]
            </span>
          </div>
        </div>

        {/* ── Event Permission Authorization Status Banner ── */}
        {!hasPermission && (
          <div className="p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)] text-[var(--color-warning)] hud-clipped font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <strong className="font-bold uppercase tracking-wider block">CHẾ ĐỘ XEM THÔNG TIN (READ-ONLY) — BẠN KHÔNG PHẢI BAN TỔ CHỨC ĐƯỢC PHÂN CÔNG</strong>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Tài khoản của bạn chưa được Admin phân công làm Ban Tổ Chức cho Sự kiện này. Các thao tác Phê duyệt & Chỉnh sửa bị khóa.
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[var(--color-warning)]/20 px-2.5 py-1 border border-[var(--color-warning)]/40 font-bold uppercase shrink-0">
              CHỈ CHO XEM (READ ONLY)
            </span>
          </div>
        )}

        {/* ── TAB CONTAINER (CHUYỂN TAB TỨC THÌ 0MS) ── */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-muted)] pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab("teams")}
            className={`px-4 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "teams"
                ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>👥</span> 1. Duyệt Đội Thi ({pendingTeams.length})
          </button>

          <button
            onClick={() => setActiveTab("profiles")}
            className={`px-4 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "profiles"
                ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>🆔</span> 2. Duyệt Thẻ Sinh Viên ({pendingProfiles.length})
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "staff"
                ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>🎓</span> 3. Phân Công Nhân Sự
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "results"
                ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>📊</span> 4. Tính Điểm & Công Bố
          </button>

          <button
            onClick={() => setActiveTab("appeals")}
            className={`px-4 py-2.5 hud-clipped transition-all font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "appeals"
                ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                : "text-[var(--text-muted)] hover:text-white bg-[var(--bg-panel)] border border-[var(--border-muted)]"
            }`}
          >
            <span>⚖</span> 5. Xử Lý Phúc Khảo ({pendingAppeals.length})
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: 👥 DUYỆT ĐỘI THI PENDING APPROVAL
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "teams" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
              <span>DANH SÁCH ĐỘI THI ĐÃ NỘP HỒ SƠ ĐĂNG KÝ (CHỜ BTC PHÊ DUYỆT)</span>
              <span className="text-[#a855f7] font-bold">Số lượng: {pendingTeams.length} Đội</span>
            </div>

            {pendingTeams.length === 0 ? (
              <div className="p-12 border border-[var(--border-muted)] bg-[var(--bg-panel)] text-center font-mono text-xs text-[var(--text-muted)] hud-clipped">
                Không có đội thi nào đang chờ phê duyệt
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingTeams.map((team) => (
                  <div
                    key={team.id}
                    className="hud-clipped border border-[#a855f7]/40 bg-[var(--bg-panel)] p-6 flex flex-col justify-between gap-5 hover:border-[#a855f7] transition-all shadow-md"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-muted)]">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#a855f7]">{team.code}</span>
                          <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mt-0.5">
                            {team.name}
                          </h3>
                        </div>
                        <Badge tone="warning">CHỜ BTC DUYỆT</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 font-mono text-xs text-[var(--text-muted)]">
                        <div>
                          <span>Hạng mục:</span>
                          <div className="text-[var(--text-primary)] font-bold">{team.track}</div>
                        </div>
                        <div>
                          <span>Trường học:</span>
                          <div className="text-[var(--text-primary)] font-bold">{team.school}</div>
                        </div>
                        <div>
                          <span>Thành viên:</span>
                          <div className="text-[var(--text-primary)] font-bold">{team.membersCount} người (Đủ điều kiện)</div>
                        </div>
                        <div>
                          <span>Thời gian gửi:</span>
                          <div className="text-[var(--text-primary)] font-bold">{team.submittedAt}</div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] font-mono text-xs">
                        <span className="text-[var(--text-muted)]">Đội Trưởng:</span>
                        <div className="text-[#a855f7] font-bold mt-0.5">{team.leader}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-muted)] font-mono text-xs">
                      <button
                        onClick={() => handleRejectTeam(team.id, team.name)}
                        className="flex-1 py-2.5 border border-[var(--color-danger)]/40 text-[var(--color-danger)] font-bold uppercase hover:bg-[var(--color-danger)]/10 transition-all hud-clipped cursor-pointer"
                      >
                        ✕ TỪ CHỐI HỒ SƠ
                      </button>
                      <button
                        onClick={() => handleApproveTeam(team.id, team.name)}
                        className="flex-1 py-2.5 bg-[#a855f7] text-white font-bold uppercase hover:bg-white hover:text-black transition-all hud-clipped cursor-pointer shadow-md"
                      >
                        ✓ PHÊ DUYỆT ĐỊNH DANH
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: 🆔 DUYỆT THẺ SINH VIÊN (NON-FPT PROFILES MANAGEMENT)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "profiles" && (
          <div className="flex flex-col gap-6">
            
            {/* 1. KPI Stats Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped flex flex-col gap-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">TỔNG THÍ SINH NGOÀI FPT</span>
                <span className="font-display text-xl font-bold text-[var(--text-primary)]">48</span>
              </div>
              <div className="p-4 bg-[var(--bg-panel)] border border-[var(--color-warning)]/40 hud-clipped flex flex-col gap-1">
                <span className="text-[10px] text-[var(--color-warning)] uppercase tracking-wider font-bold">CHỜ XÁC THỰC THẺ</span>
                <span className="font-display text-xl font-bold text-[var(--color-warning)]">{pendingProfiles.length}</span>
              </div>
              <div className="p-4 bg-[var(--bg-panel)] border border-[var(--color-success)]/40 hud-clipped flex flex-col gap-1">
                <span className="text-[10px] text-[var(--color-success)] uppercase tracking-wider font-bold">ĐÃ XÁC THỰC DỮ LIỆU</span>
                <span className="font-display text-xl font-bold text-[var(--color-success)]">40</span>
              </div>
              <div className="p-4 bg-[var(--bg-panel)] border border-[#a855f7]/40 hud-clipped flex flex-col gap-1">
                <span className="text-[10px] text-[#a855f7] uppercase tracking-wider font-bold">CHẾ ĐỘ XEM HÀNG LOẠT</span>
                <span className="font-display text-xs font-bold text-[var(--text-primary)] mt-1">QUY MÔ 100-500 THÍ SINH</span>
              </div>
            </div>

            {/* 2. Smart Search & Filter Toolbar */}
            <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={profileSearchTerm}
                    onChange={(e) => setProfileSearchTerm(e.target.value)}
                    placeholder="🔍 Tìm theo Tên, Email, Mã SV, Trường..."
                    className="w-full pl-9 pr-4 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] hud-clipped focus:outline-none focus:border-[#a855f7]"
                  />
                  <span className="absolute left-3 top-2.5 text-[var(--text-muted)]">🔍</span>
                </div>

                <select
                  value={profileSchoolFilter}
                  onChange={(e) => setProfileSchoolFilter(e.target.value)}
                  className="px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] hud-clipped focus:outline-none focus:border-[#a855f7]"
                >
                  <option value="ALL">🏫 Tất cả Trường ĐH</option>
                  <option value="Đại Học Bách Khoa HN">ĐH Bách Khoa HN</option>
                  <option value="Đại Học Quốc Gia Hà Nội">ĐH Quốc Gia Hà Nội</option>
                  <option value="Đại Học Bách Khoa TP.HCM">ĐH Bách Khoa TP.HCM</option>
                  <option value="Học Viện Công Nghệ Bưu Chính Viễn Thông">Học Viện PTIT</option>
                  <option value="Đại Học Kinh Tế Quốc Dân">ĐH Kinh Tế Quốc Dân</option>
                </select>
              </div>

              {/* View Mode Toggle & Bulk Actions */}
              <div className="flex items-center gap-3">
                {selectedProfileIds.length > 0 && (
                  <div className="flex items-center gap-2 animate-fadeIn">
                    <button
                      onClick={handleBulkApproveProfiles}
                      className="px-3 py-2 bg-[#a855f7] text-white font-bold uppercase hover:bg-white hover:text-black transition-all hud-clipped"
                    >
                      ✓ DUYỆT TẤT CẢ ({selectedProfileIds.length})
                    </button>
                    <button
                      onClick={handleBulkRejectProfiles}
                      className="px-3 py-2 border border-[var(--color-danger)] text-[var(--color-danger)] font-bold uppercase hover:bg-[var(--color-danger)]/10 transition-all hud-clipped"
                    >
                      ✕ TỪ CHỐI ({selectedProfileIds.length})
                    </button>
                  </div>
                )}

                <div className="flex items-center border border-[var(--border-muted)] hud-clipped overflow-hidden">
                  <button
                    onClick={() => setProfileViewMode("table")}
                    className={`px-3 py-2 font-bold uppercase transition-colors ${
                      profileViewMode === "table"
                        ? "bg-[#a855f7] text-white"
                        : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    ☰ BẢNG DỮ LIỆU NÉN
                  </button>
                  <button
                    onClick={() => setProfileViewMode("grid")}
                    className={`px-3 py-2 font-bold uppercase transition-colors ${
                      profileViewMode === "grid"
                        ? "bg-[#a855f7] text-white"
                        : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    ⊞ DẠNG THẺ (CARD)
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Main Data Content (Table or Grid) */}
            {filteredProfiles.length === 0 ? (
              <div className="p-12 border border-[var(--border-muted)] bg-[var(--bg-panel)] text-center font-mono text-xs text-[var(--text-muted)] hud-clipped">
                Không tìm thấy thẻ sinh viên nào phù hợp với bộ lọc.
              </div>
            ) : profileViewMode === "table" ? (
              /* COMPACT DATA TABLE FOR 100+ PARTICIPANTS */
              <div className="hud-clipped border border-[var(--border-muted)] bg-[var(--bg-panel)] overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-input)] border-b border-[var(--border-muted)] text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredProfiles.length > 0 &&
                            selectedProfileIds.length === filteredProfiles.length
                          }
                          onChange={handleSelectAllProfiles}
                          className="accent-[#a855f7] cursor-pointer"
                        />
                      </th>
                      <th className="p-3">Họ & Tên Thí Sinh</th>
                      <th className="p-3">Trường Đăng Ký</th>
                      <th className="p-3">Mã Sinh Viên</th>
                      <th className="p-3 text-center">Ảnh Thẻ SV</th>
                      <th className="p-3 text-center">Trạng Thái</th>
                      <th className="p-3 text-right">Thao Tác Duyệt Nhanh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-muted)]">
                    {filteredProfiles.map((prof) => {
                      const isSelected = selectedProfileIds.includes(prof.id);
                      return (
                        <tr
                          key={prof.id}
                          className={`hover:bg-[#a855f7]/5 transition-colors ${
                            isSelected ? "bg-[#a855f7]/10" : ""
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectProfile(prof.id)}
                              className="accent-[#a855f7] cursor-pointer"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-[var(--text-primary)] text-sm">
                              {prof.name}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)]">{prof.email}</div>
                          </td>
                          <td className="p-3 text-[var(--text-primary)] font-medium">
                            {prof.school}
                          </td>
                          <td className="p-3 text-[var(--text-muted)] font-mono">
                            {prof.studentCode || "Chưa cập nhật"}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setPreviewCardModal(prof)}
                              className="group relative inline-block w-16 h-10 border border-[var(--border-muted)] hud-clipped overflow-hidden hover:border-[#a855f7] transition-all cursor-pointer"
                              title="Nhấp để soi phóng to Ảnh Thẻ SV"
                            >
                              <img
                                src={prof.studentCardUrl}
                                alt="Card Preview"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-opacity">
                                👁 SOI
                              </div>
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <Badge tone="warning">CHỜ DUYỆT THẺ</Badge>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setPreviewCardModal(prof)}
                                className="px-2.5 py-1.5 border border-[var(--border-muted)] text-[var(--text-muted)] hover:text-white hover:border-white transition-all text-[11px] hud-clipped cursor-pointer"
                              >
                                👁 SOI THẺ
                              </button>
                              <button
                                onClick={() => handleRejectProfile(prof.id, prof.name)}
                                className="px-2.5 py-1.5 border border-[var(--color-danger)]/40 text-[var(--color-danger)] font-bold hover:bg-[var(--color-danger)]/10 transition-all text-[11px] hud-clipped cursor-pointer"
                              >
                                ✕ TỪ CHỐI
                              </button>
                              <button
                                onClick={() => handleApproveProfile(prof.id, prof.name)}
                                className="px-3 py-1.5 bg-[#a855f7] text-white font-bold hover:bg-white hover:text-black transition-all text-[11px] hud-clipped cursor-pointer shadow-sm"
                              >
                                ✓ XÁC THỰC
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* GRID CARD VIEW MODE */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((prof) => (
                  <div
                    key={prof.id}
                    className="hud-clipped border border-[var(--border-muted)] bg-[var(--bg-panel)] p-5 flex flex-col justify-between gap-4 hover:border-[#a855f7] transition-all shadow-md"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between pb-3 border-b border-[var(--border-muted)]">
                        <div>
                          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                            {prof.name}
                          </h3>
                          <span className="font-mono text-xs text-[var(--text-muted)]">{prof.email}</span>
                        </div>
                        <Badge tone="warning">CHỜ DUYỆT</Badge>
                      </div>

                      <div className="font-mono text-xs text-[var(--text-muted)] space-y-1">
                        <div>Trường: <strong className="text-[var(--text-primary)]">{prof.school}</strong></div>
                        <div>Mã SV: <strong className="text-[var(--text-primary)]">{prof.studentCode}</strong></div>
                      </div>

                      {/* Card Preview */}
                      <div
                        onClick={() => setPreviewCardModal(prof)}
                        className="w-full h-32 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped overflow-hidden relative group cursor-pointer"
                      >
                        <img src={prof.studentCardUrl} alt="Student Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center font-mono text-xs text-white font-bold transition-opacity">
                          🔍 NHẤP ĐỂ PHÓNG TO SOI THẺ
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-muted)] font-mono text-xs">
                      <button
                        onClick={() => handleRejectProfile(prof.id, prof.name)}
                        className="flex-1 py-2 border border-[var(--color-danger)]/40 text-[var(--color-danger)] font-bold uppercase hover:bg-[var(--color-danger)]/10 transition-all hud-clipped cursor-pointer"
                      >
                        ✕ TỪ CHỐI
                      </button>
                      <button
                        onClick={() => handleApproveProfile(prof.id, prof.name)}
                        className="flex-1 py-2 bg-[#a855f7] text-white font-bold uppercase hover:bg-white hover:text-black transition-all hud-clipped cursor-pointer shadow-md"
                      >
                        ✓ XÁC THỰC
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MODAL LIGHTBOX: SOI THẺ SINH VIÊN SẮC NÉT KHÔNG GIỚI HẠN
           ───────────────────────────────────────────────────────────── */}
        {previewCardModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[var(--bg-panel)] border border-[#a855f7]/60 hud-clipped p-6 flex flex-col gap-5 shadow-2xl animate-scaleUp">
              <div className="flex items-start justify-between border-b border-[var(--border-muted)] pb-4">
                <div>
                  <span className="font-mono text-[10px] text-[#a855f7] uppercase tracking-widest font-bold">
                    🆔 BẢNG KHIỂM TRA THẺ SINH VIÊN CHI TIẾT
                  </span>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    {previewCardModal.name}
                  </h3>
                  <p className="font-mono text-xs text-[var(--text-muted)]">
                    {previewCardModal.email} • {previewCardModal.school} (MSSV: {previewCardModal.studentCode})
                  </p>
                </div>
                <button
                  onClick={() => setPreviewCardModal(null)}
                  className="font-mono text-xs text-[var(--text-muted)] hover:text-white border border-[var(--border-muted)] px-3 py-1 hud-clipped cursor-pointer"
                >
                  ✕ ĐÓNG [ESC]
                </button>
              </div>

              {/* High Resolution Image Container */}
              <div className="w-full h-80 bg-black/60 border border-[var(--border-muted)] hud-clipped overflow-hidden flex items-center justify-center relative">
                <img
                  src={previewCardModal.studentCardUrl}
                  alt="Student Card HD"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Modal Control Actions */}
              <div className="flex items-center justify-between gap-4 pt-2 font-mono text-xs">
                <span className="text-[var(--text-muted)] text-[11px]">
                  💡 Kiểm tra dấu mộc trường, mã sinh viên và khuôn mặt trước khi bấm Duyệt.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      handleRejectProfile(previewCardModal.id, previewCardModal.name);
                      setPreviewCardModal(null);
                    }}
                    className="px-4 py-2 border border-[var(--color-danger)] text-[var(--color-danger)] font-bold uppercase hover:bg-[var(--color-danger)]/10 transition-all hud-clipped cursor-pointer"
                  >
                    ✕ TỪ CHỐI THẺ
                  </button>
                  <button
                    onClick={() => {
                      handleApproveProfile(previewCardModal.id, previewCardModal.name);
                      setPreviewCardModal(null);
                    }}
                    className="px-5 py-2 bg-[#a855f7] text-white font-bold uppercase hover:bg-white hover:text-black transition-all hud-clipped cursor-pointer shadow-md"
                  >
                    ✓ XÁC THỰC CHÍNH THỨC
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: 🎓 PHÂN CÔNG GIÁM KHẢO & MENTOR
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "staff" && (
          <div className="flex flex-col gap-6 font-mono text-xs">
            <div className="p-6 border border-[#a855f7]/40 bg-[var(--bg-panel)] hud-clipped flex flex-col gap-5">
              <h3 className="font-display font-bold text-lg text-[#a855f7]">
                🎓 PHÂN CÔNG GIÁM KHẢO (JUDGE) VÀ CỐ VẤN (MENTOR) THEO TRACK
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assign Judge */}
                <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] flex flex-col gap-3">
                  <span className="font-bold text-[var(--text-primary)]">MỜI GIÁM KHẢO MỚI (JUDGE):</span>
                  <input
                    type="email"
                    placeholder="Nhập email Giám khảo (Vd: judge@seal.edu.vn)..."
                    className="p-2.5 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-[var(--text-primary)] focus:border-[#a855f7] focus:outline-none"
                  />
                  <select className="p-2.5 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-[var(--text-primary)] focus:border-[#a855f7]">
                    <option>Hạng mục: AI & Machine Learning</option>
                    <option>Hạng mục: Web & Cloud Architecture</option>
                    <option>Hạng mục: CyberSecurity & Network</option>
                  </select>
                  <button
                    onClick={() => alert("[BTC] Đã gửi lời mời Giám khảo phụ trách Track thành công!")}
                    className="py-2 bg-[#a855f7] text-white font-bold uppercase hover:bg-white hover:text-black transition-all hud-clipped"
                  >
                    GỬI LỜI MỜI GIÁM KHẢO
                  </button>
                </div>

                {/* Assign Mentor */}
                <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] flex flex-col gap-3">
                  <span className="font-bold text-[var(--text-primary)]">MỜI CỐ VẤN MỚI (MENTOR):</span>
                  <input
                    type="email"
                    placeholder="Nhập email Cố vấn (Vd: mentor@fpt.edu.vn)..."
                    className="p-2.5 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-[var(--text-primary)] focus:border-[#a855f7] focus:outline-none"
                  />
                  <select className="p-2.5 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-[var(--text-primary)] focus:border-[#a855f7]">
                    <option>Hạng mục: AI & Machine Learning</option>
                    <option>Hạng mục: Web & Cloud Architecture</option>
                    <option>Hạng mục: CyberSecurity & Network</option>
                  </select>
                  <button
                    onClick={() => alert("[BTC] Đã gửi lời mời Cố vấn phụ trách Track thành công!")}
                    className="py-2 bg-[#2dd4bf] text-[var(--bg-base)] font-bold uppercase hover:bg-white transition-all hud-clipped"
                  >
                    GỬI LỜI MỜI CỐ VẤN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: 📊 TÍNH ĐIỂM & CÔNG BỐ KẾT QUẢ
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "results" && (
          <div className="flex flex-col gap-6 font-mono text-xs">
            <div className="p-6 border border-[#a855f7]/40 bg-[var(--bg-panel)] hud-clipped flex flex-col gap-6">
              <div>
                <h3 className="font-display font-bold text-xl text-[#a855f7]">
                  📊 TÍNH ĐIỂM TỔNG HỢP VÀ CÔNG BỐ BẢNG XẾP HẠNG
                </h3>
                <p className="text-[var(--text-muted)] mt-1">
                  Khi tất cả Giám khảo hoàn thành chấm điểm, Ban Tổ Chức sẽ kích hoạt tổng hợp TotalScore và công bố kết quả chính thức cho Thí sinh.
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <button
                  onClick={() => {
                    setIsCalculated(true);
                    alert("[BTC] Đã hoàn tất tính toán tổng hợp điểm cho tất cả các Đội thi!");
                  }}
                  className={`flex-1 py-3 border font-bold uppercase transition-all hud-clipped cursor-pointer ${
                    isCalculated
                      ? "border-[var(--color-success)] bg-[var(--color-success)]/20 text-[var(--color-success)]"
                      : "border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7] hover:bg-[#a855f7] hover:text-white"
                  }`}
                >
                  {isCalculated ? "✓ ĐÃ TÍNH TỔNG ĐIỂM TOÀN GIẢI" : "⚙ BẮT ĐẦU TÍNH ĐIỂM TỔNG HỢP"}
                </button>

                <button
                  onClick={() => {
                    if (!isCalculated) {
                      alert("Bạn cần tính điểm tổng hợp trước khi công bố Bảng xếp hạng!");
                      return;
                    }
                    setIsPublished(true);
                    alert("[BTC CHÍNH THỨC CÔNG BỐ] Bảng Xếp Hạng Vòng thi đã phát hành công khai cho toàn thể Thí sinh!");
                  }}
                  className={`flex-1 py-3 border font-bold uppercase transition-all hud-clipped cursor-pointer ${
                    isPublished
                      ? "border-[var(--color-success)] bg-[var(--color-success)] text-[var(--bg-base)]"
                      : "border-[var(--accent-judge)] bg-[var(--accent-judge)]/20 text-[var(--accent-judge)] hover:bg-[var(--accent-judge)] hover:text-white"
                  }`}
                >
                  {isPublished ? "🚀 ĐÃ CÔNG BỐ BẢNG XẾP HẠNG" : "📢 PHÁT HÀNH BẢNG XẾP HẠNG CHÍNH THỨC"}
                </button>
              </div>

              {isPublished && (
                <div className="p-4 bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)] flex items-center justify-between">
                  <span>Bảng xếp hạng Vòng thi hiện đã phát hành công khai trên Portal!</span>
                  <Link href="/events/event-seal-2026/leaderboard">
                    <button className="px-3 py-1 bg-[var(--color-success)] text-black font-bold uppercase">
                      XEM BẢNG XẾP HẠNG ↗
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 5: ⚖ XỬ LÝ PHÚC KHẢO & KHIẾU NẠI
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "appeals" && (
          <div className="flex flex-col gap-6 font-mono text-xs">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>HÀNG CHỜ XỬ LÝ ĐƠN PHÚC KHẢO TỪ CÁC ĐỘI THI</span>
              <span className="text-[#a855f7] font-bold">Số lượng: {pendingAppeals.length} Đơn</span>
            </div>

            {pendingAppeals.length === 0 ? (
              <div className="p-12 border border-[var(--border-muted)] bg-[var(--bg-panel)] text-center text-[var(--text-muted)] hud-clipped">
                Không có đơn phúc khảo nào cần xử lý
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingAppeals.map((app) => (
                  <div key={app.id} className="p-6 border border-[#a855f7]/40 bg-[var(--bg-panel)] hud-clipped flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-muted)]">
                      <div>
                        <span className="text-[#a855f7] font-bold text-sm">{app.teamName}</span>
                        <span className="text-[var(--text-muted)] text-xs block mt-0.5">Sản phẩm: {app.submission}</span>
                      </div>
                      <Badge tone="warning">ĐANG XỬ LÝ</Badge>
                    </div>

                    <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] leading-relaxed">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Lý do khiếu nại:</span>
                      {app.reason}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[var(--text-muted)] text-[10px]">Thời gian nộp: {app.submittedAt}</span>
                      <button
                        onClick={() => setResponseModal(app.teamName)}
                        className="px-4 py-2 bg-[#a855f7] text-white font-bold uppercase hover:bg-white hover:text-black transition-all hud-clipped cursor-pointer"
                      >
                        ⚖ XỬ LÝ & PHẢN HỒI PHÚC KHẢO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Phản Hồi Phúc Khảo */}
        {responseModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-panel)] border border-[#a855f7] p-6 max-w-lg w-full hud-clipped flex flex-col gap-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-muted)]">
                <h3 className="font-display font-bold text-lg text-[#a855f7]">
                  ⚖ PHẢN HỒI PHÚC KHẢO CHO ĐỘI: {responseModal}
                </h3>
                <button onClick={() => setResponseModal(null)} className="text-[var(--text-muted)] hover:text-white">✕</button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-muted)]">NỘI DUNG PHẢN HỒI BAN TỔ CHỨC:</label>
                <textarea
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Nhập phản hồi kết quả xem xét phúc khảo cho Đội thi..."
                  className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] focus:border-[#a855f7] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setResponseModal(null)}
                  className="px-4 py-2 border border-[var(--border-muted)] text-[var(--text-muted)]"
                >
                  HỦY
                </button>
                <button
                  onClick={() => {
                    alert(`[BTC] Đã chấp thuận phúc khảo cho Đội: ${responseModal}! Chuyển lại cho Giám khảo xem xét điểm.`);
                    setResponseModal(null);
                    setPendingAppeals([]);
                  }}
                  className="px-4 py-2 bg-[var(--color-success)] text-black font-bold uppercase"
                >
                  ✓ CHẤP THUẬN PHÚC KHẢO
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
