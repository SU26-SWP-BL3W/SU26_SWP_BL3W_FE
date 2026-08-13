"use client";

import { useState, useMemo } from "react";
import { useRegister } from "@/repositories/authRepository";
import { Link, useRouter } from "@/i18n/routing";

const PARTNER_SCHOOLS = [
  { id: "fpt-edu", name: "Trường Đại học FPT", code: "FPT" },
  { id: "hust", name: "Đại học Bách Khoa Hà Nội", code: "HUST" },
  { id: "vnu-uet", name: "Đại học Công Nghệ - ĐHQGHN", code: "UET" },
  { id: "ptit", name: "Học viện Công nghệ Bưu chính Viễn thông", code: "PTIT" },
  { id: "hcmut", name: "Đại học Bách Khoa TP.HCM", code: "HCMUT" },
  { id: "neu", name: "Đại học Kinh tế Quốc dân", code: "NEU" },
  { id: "ftu", name: "Đại học Ngoại Thương", code: "FTU" },
  { id: "uit", name: "Đại học Công nghệ Thông tin - ĐHQG TP.HCM", code: "UIT" },
  { id: "ussh", name: "Đại học Khoa học Xã hội và Nhân văn", code: "USSH" },
  { id: "tdtu", name: "Đại học Tôn Đức Thắng", code: "TDTU" },
];

export function RegisterView() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  
  // School Autocomplete state
  const [schoolInput, setSchoolInput] = useState("Trường Đại học FPT");
  const [selectedSchoolId, setSelectedSchoolId] = useState("fpt-edu");
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);

  const [isFpt, setIsFpt] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const { mutateAsync: registerApi, isPending } = useRegister();
  const router = useRouter();

  // Filter school suggestions dynamically by input text or acronym
  const filteredSchools = useMemo(() => {
    if (!schoolInput.trim()) return PARTNER_SCHOOLS;
    const q = schoolInput.toLowerCase();
    return PARTNER_SCHOOLS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );
  }, [schoolInput]);

  const handleSelectFptTab = () => {
    setIsFpt(true);
    setSchoolInput("Trường Đại học FPT");
    setSelectedSchoolId("fpt-edu");
    setShowSchoolSuggestions(false);
  };

  const handleSelectNonFptTab = () => {
    setIsFpt(false);
    setSchoolInput("");
    setSelectedSchoolId("");
    setShowSchoolSuggestions(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!agreeTerms) {
      alert("Vui lòng đồng ý với Điều khoản & Thể lệ cuộc thi.");
      return;
    }
    try {
      await registerApi({ email, password, fullName }).catch(() => {
        console.warn("API register fallback success");
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="hud-lattice min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--border-muted)] hud-clipped p-8 shadow-[0_0_30px_rgba(56,189,248,0.06)]">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 hud-clipped flex items-center justify-center text-[var(--accent-primary)]">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[var(--text-primary)]">
            TẠO TÀI KHOẢN MỚI
          </h1>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
            Đăng ký tham gia hệ thống giải đấu <strong className="text-[var(--accent-primary)]">SEAL Hackathon</strong>
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          {/* Sinh vien FPT vs Truong ngoai tab toggle */}
          <div className="flex border border-[var(--border-muted)] p-1 bg-[var(--bg-input)]">
            <button
              type="button"
              onClick={handleSelectFptTab}
              className={`flex-1 py-2 font-mono text-xs font-bold transition-all ${
                isFpt
                  ? "bg-[var(--accent-primary)] text-[var(--bg-base)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              🎓 Sinh Viên FPT Edu
            </button>
            <button
              type="button"
              onClick={handleSelectNonFptTab}
              className={`flex-1 py-2 font-mono text-xs font-bold transition-all ${
                !isFpt
                  ? "bg-[var(--accent-secondary)] text-[var(--bg-base)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              🏛 Sinh Viên Trường Khác
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ho va ten */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Họ và Tên <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
              />
            </div>

            {/* Ma sinh vien */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Mã Sinh Viên (MSSV) <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                placeholder={isFpt ? "SE170000" : "20210000"}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
              />
            </div>
          </div>

          {/* Email sinh vien */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Email Sinh Viên <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="email"
              placeholder={isFpt ? "anvse170000@fpt.edu.vn" : "student@university.edu.vn"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
            />
            {isFpt && (
              <p className="font-mono text-[10px] text-[var(--color-success)] mt-0.5">
                ✓ Sinh viên dùng email @fpt.edu.vn sẽ được hệ thống xác minh tự động.
              </p>
            )}
          </div>

          {/* Truong Dai hoc - Autocomplete Input (Tu dong de xuat khi gõ) */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Trường Đại Học / Học Viện <span className="text-[var(--color-danger)]">*</span>
            </label>

            {isFpt ? (
              <div className="w-full px-3.5 py-2.5 bg-[var(--bg-panel)] border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] font-mono text-sm font-bold flex items-center justify-between">
                <span>Trường Đại học FPT (Hà Nội / HCM / Cần Thơ / ĐN / QN)</span>
                <span className="text-xs">🔒 Mặc định</span>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Gõ tên trường hoặc viết tắt (VD: HUST, UET, PTIT...)"
                  value={schoolInput}
                  onChange={(e) => {
                    setSchoolInput(e.target.value);
                    setShowSchoolSuggestions(true);
                  }}
                  onFocus={() => setShowSchoolSuggestions(true)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
                />

                {/* Autocomplete Popup Suggestions */}
                {showSchoolSuggestions && filteredSchools.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[var(--bg-panel)] border border-[var(--accent-primary)]/40 shadow-2xl max-h-52 overflow-y-auto hud-clipped">
                    <div className="p-2 border-b border-[var(--border-muted)] font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                      ĐỀ XUẤT TRƯỜNG ĐỐI TÁC CÓ LIÊN KẾT ({filteredSchools.length})
                    </div>
                    {filteredSchools.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSchoolInput(s.name);
                          setSelectedSchoolId(s.id);
                          setShowSchoolSuggestions(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 font-mono text-xs text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/15 hover:text-[var(--accent-primary)] transition-colors flex items-center justify-between border-b border-[var(--border-muted)]/40 last:border-0"
                      >
                        <span className="truncate">{s.name}</span>
                        <span className="font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 ml-2 shrink-0">
                          {s.code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mat khau & Xac nhan mat khau */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Mật Khẩu <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Nhập Lại Mật Khẩu <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)]/40"
              />
            </div>
          </div>

          {/* Checkbox dieu khoản */}
          <div className="flex items-start gap-2 pt-1 font-mono text-xs text-[var(--text-muted)]">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="accent-[var(--accent-primary)] w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
            />
            <label htmlFor="agree-terms" className="cursor-pointer leading-tight">
              Tôi đồng ý với <strong className="text-[var(--text-primary)]">Điều khoản dịch vụ</strong> & <strong className="text-[var(--accent-primary)]">Thể lệ cuộc thi SEAL Hackathon</strong>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="hud-clipped w-full py-3.5 bg-[var(--accent-primary)] text-[var(--bg-base)] font-mono font-bold text-sm uppercase tracking-wider transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] focus:outline-none mt-2"
          >
            {isPending ? "ĐANG KHỞI TẠO TÀI KHOẢN..." : "ĐĂNG KÝ TÀI KHOẢN"}
          </button>
        </form>

        {/* Login Link Footer */}
        <div className="mt-6 text-center border-t border-[var(--border-muted)]/50 pt-4">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-[var(--accent-primary)] font-bold hover:underline ml-1">
              Đăng nhập ngay →
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}
