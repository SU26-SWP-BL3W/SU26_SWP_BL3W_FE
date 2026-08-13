"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui";

export function CoordinatorWorkspaceView() {
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

  // State duyệt Thẻ Sinh Viên
  const [pendingProfiles, setPendingProfiles] = useState([
    {
      id: "usr-101",
      name: "Phạm Quỳnh Anh",
      email: "anh.pq@gmail.com",
      school: "Đại Học Bách Khoa HN",
      studentCardUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400",
      submittedAt: "11/08/2026 10:00",
    },
    {
      id: "usr-102",
      name: "Trần Văn Nam",
      email: "nam.tv@hust.edu.vn",
      school: "Đại Học Bách Khoa HN",
      studentCardUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400",
      submittedAt: "12/08/2026 08:30",
    },
  ]);

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

  const handleApproveTeam = (id: string, name: string) => {
    alert(`[BTC CHẤP THUẬN] Đã phê duyệt chính thức cho Đội: ${name}. Đội đã chuyển sang trạng thái Registered!`);
    setPendingTeams(prev => prev.filter(t => t.id !== id));
  };

  const handleRejectTeam = (id: string, name: string) => {
    alert(`[BTC TỪ CHỐI] Đã từ chối hồ sơ Đội: ${name}. Đội đã chuyển về trạng thái Forming để cập nhật lại.`);
    setPendingTeams(prev => prev.filter(t => t.id !== id));
  };

  const handleApproveProfile = (id: string, name: string) => {
    alert(`[BTC CHẤP THUẬN] Đã xác thực Thẻ Sinh Viên cho: ${name}`);
    setPendingProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleRejectProfile = (id: string, name: string) => {
    alert(`[BTC TỪ CHỐI] Đã từ chối Thẻ Sinh Viên của: ${name}`);
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
            TAB 2: 🆔 DUYỆT THẺ SINH VIÊN (NON-FPT PROFILES)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === "profiles" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
              <span>HỒ SƠ THÍ SINH NGOÀI FPT CHỜ XÁC THỰC THẺ SINH VIÊN</span>
              <span className="text-[#a855f7] font-bold">Số lượng: {pendingProfiles.length} Thí sinh</span>
            </div>

            {pendingProfiles.length === 0 ? (
              <div className="p-12 border border-[var(--border-muted)] bg-[var(--bg-panel)] text-center font-mono text-xs text-[var(--text-muted)] hud-clipped">
                Không có thẻ sinh viên nào đang chờ duyệt
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingProfiles.map((prof) => (
                  <div
                    key={prof.id}
                    className="hud-clipped border border-[var(--border-muted)] bg-[var(--bg-panel)] p-6 flex flex-col justify-between gap-5 hover:border-[#a855f7] transition-all shadow-md"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between pb-3 border-b border-[var(--border-muted)]">
                        <div>
                          <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                            {prof.name}
                          </h3>
                          <span className="font-mono text-xs text-[var(--text-muted)]">{prof.email}</span>
                        </div>
                        <Badge tone="warning">CHỜ DUYỆT THẺ</Badge>
                      </div>

                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        <span>Trường đăng ký:</span>
                        <div className="text-[var(--text-primary)] font-bold">{prof.school}</div>
                      </div>

                      {/* Card Preview */}
                      <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase">Ảnh Thẻ Sinh Viên Đã Tải Lên:</span>
                        <div className="w-full h-40 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped overflow-hidden relative group">
                          <img src={prof.studentCardUrl} alt="Student Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-muted)] font-mono text-xs">
                      <button
                        onClick={() => handleRejectProfile(prof.id, prof.name)}
                        className="flex-1 py-2.5 border border-[var(--color-danger)]/40 text-[var(--color-danger)] font-bold uppercase hover:bg-[var(--color-danger)]/10 transition-all hud-clipped cursor-pointer"
                      >
                        ✕ TỪ CHỐI THẺ
                      </button>
                      <button
                        onClick={() => handleApproveProfile(prof.id, prof.name)}
                        className="flex-1 py-2.5 bg-[#a855f7] text-white font-bold uppercase hover:bg-white hover:text-black transition-all hud-clipped cursor-pointer shadow-md"
                      >
                        ✓ XÁC THỰC THẺ SV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
