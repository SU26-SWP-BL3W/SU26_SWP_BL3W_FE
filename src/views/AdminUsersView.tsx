"use client";

import React, { useState } from "react";
import { useGetUsers, useApproveUser, useRejectUser } from "@/repositories/usersRepository";
import { Button, Card, Badge, Table, Input } from "@/components/ui";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Lock,
  Plus,
  RefreshCw,
  CheckCircle2,
  X,
  Building2,
  Calendar,
  Eye,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { User } from "@/models/entities";

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
      <h2 className="font-mono text-sm font-bold text-[var(--text-primary)] tracking-widest uppercase">
        {children}
      </h2>
    </div>
  );
}

function isCoordinatorEmail(email?: string): boolean {
  const l = (email || "").toLowerCase();
  return l.includes("ec_") || l.includes("ec.") || l.includes("coordinator") || l.includes("coodinator") || l.includes("ec@");
}

export const AdminUsersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [detailUserModal, setDetailUserModal] = useState<User | null>(null);
  const [rejectUserModal, setRejectUserModal] = useState<{ userId: string; fullName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: rawUsersData, isLoading, refetch } = useGetUsers();
  const usersList: User[] = rawUsersData?.data ?? [];

  const { mutateAsync: approveUser } = useApproveUser();
  const { mutateAsync: rejectUser } = useRejectUser();

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (u.fullName || "").toLowerCase().includes(searchLower) ||
      (u.email || "").toLowerCase().includes(searchLower) ||
      (u.studentCode || "").toLowerCase().includes(searchLower) ||
      (u.schoolName || "").toLowerCase().includes(searchLower);

    // Role detection
    const emailLower = (u.email || "").toLowerCase();
    const roleLower = (u.roleName || u.RoleName || "").toLowerCase();
    const isEc = isCoordinatorEmail(u.email) || roleLower.includes("coordinator") || roleLower.includes("coodinator");
    const isJg = roleLower.includes("judge") || emailLower.includes("judge");
    const isMt = roleLower.includes("mentor") || emailLower.includes("mentor");
    const isAdm = !!u.isAdmin || !!u.IsAdmin || emailLower.includes("admin") || roleLower.includes("admin");
    const isStaffOrAdmin = isAdm || isEc || isJg || isMt;

    // FPT User: Chỉ những ai có email chính thức @fpt.edu.vn / @fe.edu.vn
    const isFptUser = !isStaffOrAdmin && (emailLower.includes("@fpt.edu.vn") || emailLower.includes("@fe.edu.vn"));
    const isNonFptCandidate = !isStaffOrAdmin && !isFptUser;

    // Role filter
    let matchesRole = true;
    if (roleFilter === "admin") matchesRole = isAdm;
    else if (roleFilter === "coordinator") matchesRole = isEc;
    else if (roleFilter === "judge") matchesRole = isJg;
    else if (roleFilter === "mentor") matchesRole = isMt;
    else if (roleFilter === "student") matchesRole = !isStaffOrAdmin;

    // Status filter
    let matchesStatus = true;
    const isLocked = (u.rejectionCount ?? 0) >= 2;
    if (statusFilter === "approved") {
      // Đã duyệt: Cán bộ/Chuyên gia (luôn active), SV FPT (tự động xác thực), và SV Non-FPT đã được duyệt
      matchesStatus = isStaffOrAdmin || isFptUser || (isNonFptCandidate && !!u.isApproved && !isLocked);
    } else if (statusFilter === "pending") {
      // Đang chờ duyệt: CHỈ DUY NHẤT Sinh viên trường ngoài chưa duyệt và chưa bị khóa
      matchesStatus = isNonFptCandidate && !u.isApproved && !isLocked;
    } else if (statusFilter === "locked") {
      // Bị khóa: Sinh viên trường ngoài bị từ chối >= 2 lần
      matchesStatus = isNonFptCandidate && isLocked;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      setDetailUserModal(null);
      refetch();
      alert("Đã phê duyệt hồ sơ người dùng thành công!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể phê duyệt. Vui lòng kiểm tra quyền Admin.";
      alert(`Lỗi phê duyệt hồ sơ: ${msg}`);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectUserModal || !rejectReason.trim()) return;

    try {
      await rejectUser({ userId: rejectUserModal.userId, reason: rejectReason.trim() });
      setRejectUserModal(null);
      setDetailUserModal(null);
      setRejectReason("");
      refetch();
      alert("Đã ghi nhận từ chối hồ sơ kèm lý do thành công.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể từ chối hồ sơ. Vui lòng kiểm tra quyền Admin.";
      alert(`Lỗi từ chối hồ sơ: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans hud-lattice flex flex-col">
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-6 py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
          <Link href="/admin/dashboard" className="text-[var(--color-danger)] font-bold hover:underline">
            ADMIN // EXECUTIVE CONTROL
          </Link>
          <span>&gt;</span>
          <span className="text-[var(--text-primary)] font-bold">QUẢN LÝ TÀI KHOẢN & HỒ SƠ</span>
        </div>

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-6">
          <div>
            <HudLabel>// SYSTEM ADMIN USER MANAGEMENT</HudLabel>
            <h1 className="font-display font-bold text-3xl text-[var(--color-danger)] uppercase tracking-wider mt-1 flex items-center gap-2.5">
              <Users className="w-7 h-7 text-[var(--color-danger)]" />
              Quản Lý Danh Sách Tài Khoản
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Trung tâm kiểm duyệt & phân quyền: Xét duyệt hồ sơ thẻ sinh viên Non-FPT, gán Event Coordinator & giám sát thành viên.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/events/new">
              <Button variant="primary" className="hud-clipped flex items-center gap-2 bg-[var(--color-danger)] text-white hover:bg-white hover:text-[var(--bg-base)] font-mono text-xs font-bold shadow-lg shadow-[var(--color-danger)]/20 transition-all duration-200">
                <Plus className="w-4 h-4" /> // TẠO EVENT MỚI &gt;
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => refetch()} className="font-mono text-xs hover:bg-[var(--bg-input)]">
              <RefreshCw className="w-3.5 h-3.5" /> Làm mới
            </Button>
          </div>
        </div>

        {/* Filter Control Bar */}
        <Card className="p-4 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                Tìm kiếm theo Tên / Email / Mã SV:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                <Input
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full text-xs font-mono"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                Phân loại Vai trò (Role):
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--color-danger)] cursor-pointer"
              >
                <option value="all">Tất cả Vai trò (All Roles)</option>
                <option value="admin">System Admin</option>
                <option value="coordinator">Event Coordinator</option>
                <option value="judge">Giám Khảo</option>
                <option value="mentor">Mentor</option>
                <option value="student">Thí Sinh (Student)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                Trạng thái Duyệt Hồ sơ:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--color-danger)] cursor-pointer"
              >
                <option value="all">Tất cả Trạng thái</option>
                <option value="approved">Đã Phê Duyệt (Approved)</option>
                <option value="pending">Đang Chờ Duyệt (Pending)</option>
                <option value="locked">Bị Khóa Hồ Sơ (Locked)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Users Data Table */}
        <Card className="p-6 space-y-4 bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]">
          <SectionTitle>DANH SÁCH TÀI KHOẢN HỆ THỐNG ({filteredUsers.length} / {usersList.length})</SectionTitle>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-[var(--color-danger)]" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center font-mono text-xs text-[var(--text-muted)]">
              Không tìm thấy tài khoản phù hợp với điều kiện tìm kiếm.
            </div>
          ) : (
            <div className="w-full overflow-x-auto border border-[var(--border-muted)] bg-[var(--bg-input)] hud-clipped">
              <table className="w-full table-fixed min-w-[950px] text-left border-collapse font-mono text-xs">
                <thead className="bg-[var(--bg-base)] border-b border-[var(--border-muted)]">
                  <tr>
                    <th className="w-[28%] px-4 py-3.5 text-left text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      HỌ VÀ TÊN / EMAIL
                    </th>
                    <th className="w-[22%] px-4 py-3.5 text-left text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      MÃ SV &amp; TRƯỜNG HỌC
                    </th>
                    <th className="w-[18%] px-4 py-3.5 text-left text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      VAI TRÒ (SYSTEM ROLE)
                    </th>
                    <th className="w-[16%] px-4 py-3.5 text-left text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      TRẠNG THÁI HỒ SƠ
                    </th>
                    <th className="w-[16%] px-4 py-3.5 text-right text-[var(--text-muted)] uppercase tracking-wider font-bold">
                      THAO TÁC XEM &amp; DUYỆT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isLocked = (u.rejectionCount ?? 0) >= 2;
                    const userId = u.id || u.userId || "";
                    const userEmailLower = (u.email || "").toLowerCase();
                    const role = (u.roleName || u.RoleName || "").toLowerCase();
                    const isEcUser = isCoordinatorEmail(u.email) || role.includes("coordinator") || role.includes("coodinator");
                    const isJudgeUser = role.includes("judge") || userEmailLower.includes("judge");
                    const isMentorUser = role.includes("mentor") || userEmailLower.includes("mentor");
                    const isAdminUser = Boolean(u.isAdmin || u.IsAdmin || userEmailLower.includes("admin") || role.includes("admin"));
                    const isStaffOrAdmin = isAdminUser || isEcUser || isJudgeUser || isMentorUser;
                    const isFptUser = !isStaffOrAdmin && (userEmailLower.includes("@fpt.edu.vn") || userEmailLower.includes("@fe.edu.vn"));
                    const isNonFptCandidate = !isStaffOrAdmin && !isFptUser;

                    return (
                      <tr key={userId} className="hover:bg-[var(--color-danger)]/5 transition-colors border-t border-[var(--border-muted)]/50">
                        <td className="px-4 py-3.5 align-middle truncate">
                          <div className="font-mono font-bold text-sm text-[var(--text-primary)] truncate">
                            {u.fullName || "User SEAL"}
                          </div>
                          <div className="font-mono text-xs text-[var(--color-danger)] font-bold truncate">{u.email}</div>
                        </td>
                        <td className="px-4 py-3.5 align-middle truncate">
                          <div className="font-mono text-xs text-[var(--text-primary)] font-bold truncate">
                            {isStaffOrAdmin ? (
                              <span className="text-[var(--accent-primary)]">Cán bộ / Chuyên gia</span>
                            ) : u.studentCode ? (
                              `MSSV: ${u.studentCode}`
                            ) : (
                              "Chưa cập nhật"
                            )}
                          </div>
                          <div className="font-mono text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5 truncate">
                            <Building2 className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                            <span className="truncate">
                              {isStaffOrAdmin
                                ? (u.schoolName || "Hội Đồng Ban Tổ Chức")
                                : isFptUser
                                ? "Đại học FPT"
                                : (u.schoolName || "Trường Ngoài FPT")}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 align-middle">
                          {isAdminUser ? (
                            <Badge tone="danger">SYSTEM ADMIN</Badge>
                          ) : isEcUser ? (
                            <Badge tone="coordinator">EVENT COORDINATOR</Badge>
                          ) : isJudgeUser ? (
                            <Badge tone="judge">GIÁM KHẢO</Badge>
                          ) : isMentorUser ? (
                            <Badge tone="warning">MENTOR</Badge>
                          ) : (
                            <Badge tone="team">THÍ SINH</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3.5 align-middle">
                          {isStaffOrAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[rgba(59,130,246,0.1)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 rounded">
                              ✓ CÁN BỘ / CHUYÊN GIA
                            </span>
                          ) : isFptUser ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] border border-[var(--color-success)]/30 rounded">
                              ✓ TỰ ĐỘNG XÁC THỰC FPT
                            </span>
                          ) : isLocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)] border border-[var(--color-danger)]/30 rounded">
                              <Lock className="w-3 h-3" /> KHÓA 2 GẬY
                            </span>
                          ) : u.isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] border border-[var(--color-success)]/30 rounded">
                              ✓ ĐÃ DUYỆT THẺ SV
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)] border border-[var(--color-warning)]/30 animate-pulse rounded">
                              ⏳ CHỜ DUYỆT THẺ SV
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 align-middle text-right">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            {isNonFptCandidate && !u.isApproved && !isLocked ? (
                              <Button
                                variant="ghost"
                                onClick={() => setDetailUserModal(u)}
                                className="text-xs font-mono border-[var(--color-warning)] text-[var(--color-warning)] hover:bg-[var(--color-warning)]/10 font-bold px-2.5 py-1 h-auto cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" /> DUYỆT THẺ SV
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                onClick={() => setDetailUserModal(u)}
                                className="text-xs font-mono border-[var(--border-muted)] hover:border-white px-2.5 py-1 h-auto cursor-pointer flex items-center gap-1 text-[var(--text-muted)] hover:text-white"
                              >
                                <Eye className="w-3.5 h-3.5" /> Xem Hồ Sơ
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal 1: Xem Chi Tiết Đầy Đủ Hồ Sơ User */}
        {detailUserModal && (() => {
          const userEmailLower = (detailUserModal.email || "").toLowerCase();
          const role = (detailUserModal.roleName || detailUserModal.RoleName || "").toLowerCase();
          const isDetailEc = isCoordinatorEmail(detailUserModal.email) || role.includes("coordinator") || role.includes("coodinator");
          const isDetailJudge = role.includes("judge") || userEmailLower.includes("judge");
          const isDetailMentor = role.includes("mentor") || userEmailLower.includes("mentor");
          const isDetailAdmin = Boolean(detailUserModal.isAdmin || detailUserModal.IsAdmin || userEmailLower.includes("admin") || role.includes("admin"));
          const isStaff = isDetailAdmin || isDetailEc || isDetailJudge || isDetailMentor;
          const isFpt = !isStaff && (userEmailLower.includes("@fpt.edu.vn") || userEmailLower.includes("@fe.edu.vn"));
          const isNonFpt = !isStaff && !isFpt;

          return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <Card className="w-full max-w-2xl bg-[var(--bg-panel)] border border-[var(--color-danger)] hud-clipped p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setDetailUserModal(null)}
                  className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="border-b border-[var(--border-muted)] pb-4">
                  <HudLabel>
                    {isStaff
                      ? "// SYSTEM ADMIN - STAFF & EXPERT PROFILE INSPECTION"
                      : isFpt
                      ? "// SYSTEM ADMIN - FPT STUDENT PROFILE INSPECTION"
                      : "// SYSTEM ADMIN - NON-FPT STUDENT CARD INSPECTION"}
                  </HudLabel>
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)] uppercase tracking-wider mt-1">
                    {detailUserModal.fullName || "User SEAL"}
                  </h3>
                  <p className="font-mono text-xs text-[var(--accent-primary)]">Email: {detailUserModal.email}</p>
                </div>

                {isStaff ? (
                  /* ── 1. STAFF / EXPERT / ADMIN PROFILE ── */
                  <div className="space-y-6 font-mono text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2.5 p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">1. Thông tin cá nhân & Chuyên môn:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--text-muted)]">Vai trò hệ thống:</span>
                          {isDetailAdmin ? (
                            <Badge tone="danger">SYSTEM ADMIN</Badge>
                          ) : isDetailEc ? (
                            <Badge tone="coordinator">EVENT COORDINATOR</Badge>
                          ) : isDetailJudge ? (
                            <Badge tone="judge">GIÁM KHẢO</Badge>
                          ) : (
                            <Badge tone="warning">MENTOR</Badge>
                          )}
                        </div>
                        <div>Đơn vị công tác: <strong className="text-[var(--text-primary)]">{detailUserModal.schoolName || "Hội Đồng Ban Tổ Chức"}</strong></div>
                        <div>Mã định danh cán bộ: <strong className="text-[var(--accent-primary)]">{detailUserModal.id || detailUserModal.userId || "STAFF-01"}</strong></div>
                      </div>

                      <div className="space-y-2.5 p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">2. Trạng thái phân quyền hệ thống:</span>
                        <div>Trạng thái hoạt động: <span className="text-[var(--color-success)] font-bold">✓ TÀI KHOẢN KÍCH HOẠT HỢP LỆ</span></div>
                        <div>Loại tài khoản: <span className="text-[var(--accent-primary)] font-bold">Cán bộ & Hội Đồng Chuyên Môn</span></div>
                        <div className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-1">
                          Tài khoản chuyên môn được cấp quyền trực tiếp bởi Ban Quản Trị Hệ Thống.
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[var(--border-muted)]">
                      <Button variant="ghost" onClick={() => setDetailUserModal(null)} className="font-mono text-xs border border-[var(--border-muted)] px-6">
                        ĐÓNG
                      </Button>
                    </div>
                  </div>
                ) : isFpt ? (
                  /* ── 2. FPT STUDENT PROFILE ── */
                  <div className="space-y-6 font-mono text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2.5 p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">1. Thông tin Sinh viên FPT:</span>
                        <div>MSSV: <strong className="text-[var(--accent-team)] font-bold">{detailUserModal.studentCode || "Chưa cập nhật"}</strong></div>
                        <div>Trường đào tạo: <strong className="text-[var(--text-primary)]">Đại học FPT</strong></div>
                        <div>Vai trò thi đấu: <strong className="text-[var(--text-primary)]">Thí Sinh</strong></div>
                        <div>Ngày đăng ký: <strong className="text-[var(--text-muted)]">{detailUserModal.createdTime ? new Date(detailUserModal.createdTime).toLocaleDateString("vi-VN") : "Hôm nay"}</strong></div>
                      </div>

                      <div className="space-y-2.5 p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">2. Trạng thái xác thực danh tính:</span>
                        <div>Trạng thái: <span className="text-[var(--color-success)] font-bold">✓ TỰ ĐỘNG XÁC THỰC FPT EDU</span></div>
                        <div className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-1">
                          Tài khoản sinh viên FPT được hệ thống tự động xác thực danh tính qua cổng giáo dục FPT Education. Sinh viên đủ điều kiện tham gia thi đấu hợp lệ mà không cần đối soát thẻ thủ công.
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[var(--border-muted)]">
                      <Button variant="ghost" onClick={() => setDetailUserModal(null)} className="font-mono text-xs border border-[var(--border-muted)] px-6">
                        ĐÓNG
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* ── 3. NON-FPT STUDENT CARD INSPECTION ── */
                  <div className="space-y-6 font-mono text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">1. Thông tin sinh viên & Trường:</span>
                        <div>Mã SV: <strong className="text-[var(--text-primary)]">{detailUserModal.studentCode || "Chưa cập nhật"}</strong></div>
                        <div>Trường học: <strong className="text-[var(--text-primary)]">{detailUserModal.schoolName || "Chưa chọn trường"}</strong></div>
                        <div>Loại thí sinh: <strong className="text-[var(--accent-primary)] font-bold">Sinh viên Trường Ngoài (Cần duyệt thẻ)</strong></div>
                        <div>Ngày đăng ký: <strong className="text-[var(--text-muted)]">{detailUserModal.createdTime ? new Date(detailUserModal.createdTime).toLocaleDateString("vi-VN") : "Hôm nay"}</strong></div>
                      </div>

                      <div className="space-y-2 p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">2. Trạng thái & Lịch sử duyệt thẻ:</span>
                        <div>Số lần bị từ chối: <strong className={detailUserModal.rejectionCount && detailUserModal.rejectionCount >= 2 ? "text-[var(--color-danger)] font-bold" : "text-[var(--color-success)]"}>{detailUserModal.rejectionCount ?? 0} / 2 lần</strong></div>
                        {detailUserModal.rejectionReason && (
                          <div className="p-2 bg-[rgba(239,68,68,0.1)] border border-[var(--color-danger)]/30 text-[10px] text-[var(--color-danger)]">
                            Lý do từ chối trước: {detailUserModal.rejectionReason}
                          </div>
                        )}
                        <div>Trạng thái hiện tại: {detailUserModal.isApproved ? (
                          <span className="text-[var(--color-success)] font-bold">✓ ĐÃ PHÊ DUYỆT HỒ SƠ</span>
                        ) : (
                          <span className="text-[var(--color-warning)] font-bold animate-pulse">⏳ ĐANG CHỜ PHÊ DUYỆT</span>
                        )}</div>
                      </div>
                    </div>

                    {/* Physical Student Card Photo Inspection with HUD Scanner Frame */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[var(--accent-primary)] font-bold uppercase block">
                          3. Ảnh Chụp Thẻ Sinh Viên Thực Tế (Physical Card Inspection):
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          [ OPTICAL OCR & BIOMETRIC VERIFIER ]
                        </span>
                      </div>
                      <div className="w-full h-64 bg-[#050811] border border-[var(--accent-primary)]/40 hud-clipped flex items-center justify-center relative overflow-hidden group shadow-inner">
                        {/* HUD 4-Corner Reticles */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--accent-primary)] pointer-events-none z-10 opacity-80" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--accent-primary)] pointer-events-none z-10 opacity-80" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--accent-primary)] pointer-events-none z-10 opacity-80" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--accent-primary)] pointer-events-none z-10 opacity-80" />

                        {detailUserModal.photoStudentCardUrl ? (
                          <>
                            <img
                              src={detailUserModal.photoStudentCardUrl}
                              alt="Thẻ Sinh Viên"
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            {detailUserModal.isApproved && (
                              <div className="absolute top-4 right-4 rotate-12 bg-[rgba(16,185,129,0.2)] border-2 border-[var(--color-success)] px-3 py-1 text-[var(--color-success)] font-mono font-bold text-xs tracking-widest pointer-events-none shadow-lg backdrop-blur-xs">
                                ✓ SEAL VERIFIED
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center font-mono text-xs text-[var(--text-muted)] space-y-2 p-6">
                            <FileText className="w-12 h-12 text-[var(--accent-primary)] mx-auto opacity-40 animate-pulse" />
                            <p className="font-bold text-[var(--text-primary)]">[ Chưa Upload Ảnh Thẻ Sinh Viên ]</p>
                            <p className="text-[10px] text-[var(--text-muted)] max-w-xs mx-auto">
                              Sinh viên cần hoàn tất bước Upload ảnh thẻ sinh viên trên trang Onboarding để Ban Tổ Chức tiến hành phê duyệt.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons for Non-FPT Student */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-muted)]">
                      <Button variant="ghost" onClick={() => setDetailUserModal(null)} className="font-mono text-xs">
                        Đóng
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setRejectUserModal({
                              userId: detailUserModal.id || detailUserModal.userId || "",
                              fullName: detailUserModal.fullName || "User",
                            });
                          }}
                          className="font-mono text-xs text-[var(--color-danger)] border-[var(--color-danger)]/40 hover:bg-[var(--color-danger)]/10"
                        >
                          <UserX className="w-3.5 h-3.5 mr-1" /> Từ Chối Hồ Sơ
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(detailUserModal.id || detailUserModal.userId || "")}
                          className="font-mono text-xs bg-[var(--color-success)] text-white hover:bg-white hover:text-black font-bold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> // PHÊ DUYỆT HỒ SƠ &gt;
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          );
        })()}

        {/* Modal 2: Form Nhập Lý Do Từ Chối Hồ Sơ */}
        {rejectUserModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <Card className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--color-danger)] hud-clipped p-6 space-y-4 relative">
              <button
                type="button"
                onClick={() => setRejectUserModal(null)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-[var(--color-danger)] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Từ Chối Hồ Sơ Thẻ Sinh Viên
                </h3>
                <p className="font-mono text-xs text-[var(--text-muted)]">
                  Nhập lý do chi tiết từ chối hồ sơ của <strong className="text-white">{rejectUserModal.fullName}</strong>. Thông báo kèm lý do sẽ được gửi trực tiếp tới email tài khoản.
                </p>
              </div>

              <form onSubmit={handleRejectSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    Lý do từ chối (Ghi rõ nguyên nhân để sinh viên sửa lại) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="VD: Ảnh chụp thẻ sinh viên bị mờ nét, không nhìn rõ mã số sinh viên hoặc không phải thẻ chính chủ..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--color-danger)] resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" type="button" onClick={() => setRejectUserModal(null)}>
                    Hủy Bỏ
                  </Button>
                  <Button variant="primary" type="submit" className="bg-[var(--color-danger)] text-white font-mono text-xs font-bold">
                    // XÁC NHẬN TỪ CHỐI &gt;
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
