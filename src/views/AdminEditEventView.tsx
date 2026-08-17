"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { useEventDetail, eventsRepository } from "@/repositories/eventsRepository";
import { staffRepository } from "@/repositories/staffRepository";
import { usersRepository } from "@/repositories/usersRepository";
import { Shield, Calendar, ArrowLeft, CheckCircle2, RefreshCw, Save } from "lucide-react";
import Link from "next/link";

function HudLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-danger)] uppercase">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-muted)]">
      <span className="w-1.5 h-4 bg-[var(--color-danger)] inline-block" aria-hidden="true" />
      <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] tracking-widest uppercase">
        {children}
      </h3>
    </div>
  );
}

function toDateInputValue(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

export const AdminEditEventView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = (params?.id as string) || "";

  const { data: rawEvent, isLoading, refetch } = useEventDetail(eventId);
  const ev = (rawEvent as any) ?? {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    eventName: "",
    season: "",
    year: 2026,
    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    description: "",
    coordinatorEmail: "",
    maxTeams: 50,
  });

  // Populate form when event data is loaded
  useEffect(() => {
    if (rawEvent) {
      setForm({
        eventName: ev.eventName || ev.EventName || ev.name || "",
        season: ev.season || ev.Season || "Mùa Hè",
        year: Number(ev.year || ev.Year || 2026),
        startDate: toDateInputValue(ev.startDate || ev.StartDate),
        endDate: toDateInputValue(ev.endDate || ev.EndDate),
        registrationStartDate: toDateInputValue(ev.registrationStartDate || ev.RegistrationStartDate || ev.startDate || ev.StartDate),
        registrationEndDate: toDateInputValue(ev.registrationEndDate || ev.RegistrationEndDate || ev.endDate || ev.EndDate),
        description: ev.description || ev.Description || "",
        coordinatorEmail: ev.coordinatorEmail || ev.CoordinatorEmail || "",
        maxTeams: Number(ev.maxTeams || ev.MaxTeams || 50),
      });
    }
  }, [rawEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!form.eventName.trim()) {
      setErrorMessage("Vui lòng nhập tên sự kiện!");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      setErrorMessage("Ngày bắt đầu sự kiện phải diễn ra trước ngày kết thúc!");
      return;
    }

    setIsSubmitting(true);

    try {
      const startIso = form.startDate ? new Date(form.startDate).toISOString() : new Date().toISOString();
      const endIso = form.endDate ? new Date(form.endDate).toISOString() : new Date().toISOString();
      const regStartIso = form.registrationStartDate ? new Date(form.registrationStartDate).toISOString() : startIso;
      const regEndIso = form.registrationEndDate ? new Date(form.registrationEndDate).toISOString() : endIso;

      const payload = {
        eventName: form.eventName,
        season: form.season,
        year: Number(form.year),
        startDate: startIso,
        endDate: endIso,
        registrationStartDate: regStartIso,
        registrationEndDate: regEndIso,
        description: form.description,
        maxTeams: Number(form.maxTeams),
      };

      await eventsRepository.updateEvent(eventId, payload as any);

      // Nếu có nhập email Event Coordinator, tiến hành gán quyền EC
      if (form.coordinatorEmail.trim()) {
        try {
          const foundUser = await usersRepository.findUserByEmail(form.coordinatorEmail.trim());
          if (foundUser) {
            const realUserId = foundUser.id || (foundUser as any).Id || (foundUser as any).userId || (foundUser as any).UserId;
            await staffRepository.assignRoleDirectly({
              userId: realUserId,
              eventId: eventId,
              roleName: "EventCoordinator",
            });
          }
        } catch (ecErr: any) {
          console.error("Lỗi phân công EC:", ecErr);
        }
      }

      setSuccessMessage("Đã cập nhật thông tin sự kiện thành công!");
      refetch();
    } catch (err: any) {
      console.error("Lỗi cập nhật sự kiện:", err);
      const apiMsg = err?.response?.data?.message || err?.message || "Cập nhật sự kiện thất bại. Vui lòng thử lại.";
      setErrorMessage(apiMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-[var(--color-danger)]">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span>Đang tải thông tin sự kiện...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex flex-col">
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
          <Link href="/admin/dashboard" className="text-[var(--color-danger)] font-bold hover:underline">
            ADMIN // EXECUTIVE CONTROL
          </Link>
          <span>&gt;</span>
          <span className="text-[var(--text-primary)] font-bold">CHỈNH SỬA SỰ KIỆN: {form.eventName || "SỰ KIỆN"}</span>
        </div>

        <Card className="p-6 space-y-6 bg-[var(--bg-panel)] border border-[var(--color-danger)]/40 shadow-xl shadow-[var(--color-danger)]/5 hud-clipped">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-4">
            <div>
              <HudLabel>// SYSTEM ADMIN EVENT EDITOR</HudLabel>
              <h2 className="font-display font-bold text-2xl text-[var(--color-danger)] uppercase tracking-wider flex items-center gap-2 mt-1">
                <Shield className="w-6 h-6 text-[var(--color-danger)]" />
                Chỉnh Sửa Thông Tin Sự Kiện (Admin)
              </h2>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
                Cập nhật thông tin khung sự kiện, thời gian mở/đóng cổng đăng ký và điều phối viên phụ trách.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 font-mono text-xs bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)] border border-[var(--color-danger)]/30 hud-clipped font-bold">
                ID: #{eventId}
              </span>
              <Link href="/admin/dashboard">
                <Button variant="ghost" className="font-mono text-xs border border-[var(--border-muted)] hover:bg-[var(--bg-input)]">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Bảng Điều Hành
                </Button>
              </Link>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)] text-[var(--color-danger)] font-mono text-xs hud-clipped">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-[rgba(16,185,129,0.1)] border border-[var(--color-success)] text-[var(--color-success)] font-mono text-xs hud-clipped flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                <span>{successMessage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/events/${eventId}`}>
                  <button className="px-3 py-1 bg-[var(--bg-panel)] border border-[var(--color-success)] text-[var(--color-success)] font-bold text-xs hover:bg-[var(--color-success)] hover:text-white transition-all cursor-pointer">
                    Xem Trang Thể Lệ
                  </button>
                </Link>
                <Link href="/admin/dashboard">
                  <button className="px-3 py-1 bg-[var(--color-success)] text-white font-bold text-xs hover:bg-white hover:text-black transition-all cursor-pointer">
                    Về Bảng Điều Hành
                  </button>
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. THÔNG TIN CƠ BẢN */}
            <div className="space-y-4">
              <SectionTitle>1. Thông Tin Nhận Diện Sự Kiện</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    Tên Sự Kiện Hackathon *
                  </label>
                  <Input
                    type="text"
                    value={form.eventName}
                    onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                    className="w-full text-xs font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                      Mùa Giải
                    </label>
                    <Input
                      type="text"
                      value={form.season}
                      onChange={(e) => setForm({ ...form, season: e.target.value })}
                      className="w-full text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                      Năm
                    </label>
                    <Input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                      className="w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  Mô Tả & Thể Lệ Sự Kiện
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--color-danger)] resize-none"
                />
              </div>
            </div>

            {/* 2. THỜI GIAN MỞ / ĐÓNG CỔNG ĐĂNG KÝ */}
            <div className="space-y-4 pt-2">
              <SectionTitle>2. Mốc Thời Gian Mở & Đóng Cổng Đăng Ký Đội Thi</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                  <label className="text-xs font-mono text-[var(--color-danger)] uppercase font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Ngày Mở Cổng Đăng Ký
                  </label>
                  <Input
                    type="date"
                    value={form.registrationStartDate}
                    onChange={(e) => setForm({ ...form, registrationStartDate: e.target.value })}
                    className="w-full text-xs font-mono mt-1"
                    required
                  />
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                    Bắt đầu cho phép thí sinh tạo đội và gửi lời mời thành viên.
                  </span>
                </div>

                <div className="space-y-1.5 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                  <label className="text-xs font-mono text-[var(--color-danger)] uppercase font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Hạn Chót Đóng Cổng Đăng Ký
                  </label>
                  <Input
                    type="date"
                    value={form.registrationEndDate}
                    onChange={(e) => setForm({ ...form, registrationEndDate: e.target.value })}
                    className="w-full text-xs font-mono mt-1"
                    required
                  />
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                    Khóa tiếp nhận hồ sơ mới để Ban Tổ Chức tiến hành rà soát.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. THỜI GIAN DIỄN RA SỰ KIỆN */}
            <div className="space-y-4 pt-2">
              <SectionTitle>3. Thời Gian Khung Sự Kiện Chính Thức</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                  <label className="text-xs font-mono text-[var(--accent-primary)] uppercase font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Ngày Bắt Đầu Cuộc Thi (Vòng 1)
                  </label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full text-xs font-mono mt-1"
                    required
                  />
                </div>

                <div className="space-y-1.5 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                  <label className="text-xs font-mono text-[var(--accent-primary)] uppercase font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Ngày Bế Mạc / Trao Giải
                  </label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full text-xs font-mono mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 4. QUY MÔ & PHÂN CÔNG EVENT COORDINATOR */}
            <div className="space-y-4 pt-2">
              <SectionTitle>4. Quy Mô & Phân Công Event Coordinator Phụ Trách</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    Số Lượng Đội Thi Tối Đa
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={500}
                    value={form.maxTeams}
                    onChange={(e) => setForm({ ...form, maxTeams: Number(e.target.value) })}
                    className="w-full text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[var(--accent-coordinator)] uppercase font-bold">
                    Email Event Coordinator Phụ Trách
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. ec.coordinator@seal.edu.vn"
                    value={form.coordinatorEmail}
                    onChange={(e) => setForm({ ...form, coordinatorEmail: e.target.value })}
                    className="w-full text-xs font-mono border-[var(--accent-coordinator)]/40 focus:border-[var(--accent-coordinator)]"
                  />
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                    Tài khoản EC này sẽ có quyền cấu hình Vòng thi, Hạng mục và Tiêu chí của sự kiện này.
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-muted)]">
              <Link href="/admin/dashboard">
                <Button variant="ghost" type="button" className="font-mono text-xs border border-[var(--border-muted)]">
                  ← Quay Lại Bảng Điều Hành
                </Button>
              </Link>

              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="bg-[var(--color-danger)] text-white hover:bg-white hover:text-black font-mono text-xs font-bold px-8 shadow-lg shadow-[var(--color-danger)]/20 cursor-pointer"
              >
                <Save className="w-4 h-4 mr-1.5" />
                {isSubmitting ? "Đang lưu thay đổi..." : "// LƯU THÔNG TIN SỰ KIỆN >"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};
