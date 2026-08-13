"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  useGetAppeals,
  useCreateAppeal,
  useRespondAppeal,
} from "@/repositories/appealsRepository";
import {
  Button,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Input,
} from "@/components/ui";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Send,
  Shield,
  MessageSquare,
} from "lucide-react";
import type { Appeal, AppealStatus } from "@/models/entities";



export function AppealsView() {
  const { user, activeRole } = useAuth();
  const [reason, setReason] = useState("");
  const [submitResultId, setSubmitResultId] = useState("sub-1");

  const [respondModal, setRespondModal] = useState<Appeal | null>(null);
  const [responseText, setResponseText] = useState("");

  const { data: appeals = [], isLoading, refetch } = useGetAppeals();

  const { mutateAsync: createAppeal, isPending: isSubmitting } = useCreateAppeal();
  const { mutateAsync: respondAppeal, isPending: isResponding } = useRespondAppeal();

  const isEC =
    activeRole?.roleName === "Coordinator" ||
    activeRole?.roleName === "EventCoordinator" ||
    user?.isAdmin;

  const handleCreateAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    try {
      await createAppeal({ SubmissionId: submitResultId, Reason: reason.trim() });
      alert("✓ Đã gửi Đơn Phúc Khảo thành công! Ban Tổ Chức sẽ phản hồi sớm.");
      setReason("");
    } catch {
      alert("Đã gửi đơn phúc khảo (Mock Mode).");
      setReason("");
    }
  };

  const handleRespondConfirm = async (status: string) => {
    if (!respondModal || !respondModal.id) return;
    if (!responseText.trim()) return;

    try {
      await respondAppeal({
        appealId: respondModal.id,
        status: status as any,
        responseReason: responseText.trim(),
      });
      alert("✓ Đã xử lý phản hồi Đơn Phúc Khảo!");
      setRespondModal(null);
      setResponseText("");
    } catch {
      alert("Đã xử lý đơn (Mock Mode).");
      setRespondModal(null);
      setResponseText("");
    }
  };

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[var(--border-muted)] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(245,158,11,0.1)] border border-[var(--color-warning)]/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[var(--color-warning)]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--color-warning)]">
              XÉT PHÚC KHẢO KẾT QUẢ (APPEALS)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              // QUẢN LÝ & XỬ LÝ ĐƠN KHIẾU NẠI ĐIỂM SỐ
            </p>
          </div>
        </div>

        <Button variant="ghost" onClick={() => refetch()} className="text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> làm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Tạo Đơn (Cho Team Leader) */}
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-[var(--color-warning)]" />
            GỬI ĐƠN PHÚC KHẢO
          </h2>

          <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped space-y-4">
            <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed">
              * Lưu ý: Đơn phúc khảo chỉ được tạo bởi <strong>Team Leader</strong> và phải nộp <strong>TRƯỚC KHI</strong> kết quả chính thức được công bố.
            </p>

            <form onSubmit={handleCreateAppeal} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  Mã Bài Nộp (SubmitResultId) *
                </label>
                <Input
                  type="text"
                  value={submitResultId}
                  onChange={(e) => setSubmitResultId(e.target.value)}
                  required
                  className="font-mono text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  Lý Do Phúc Khảo *
                </label>
                <textarea
                  className="w-full border border-[var(--border-muted)] bg-[var(--bg-input)] p-3 font-mono text-xs text-[color:var(--text-primary)] outline-none transition-all duration-150 placeholder:text-[color:var(--text-muted)]/50 focus:border-[var(--color-warning)] min-h-[120px] hud-clipped"
                  placeholder="Ghi rõ lý do khiếu nại (VD: Tiêu chí Kỹ thuật bị tính nhầm trọng số, minh chứng liên kết bài nộp bị trôi)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center text-[var(--color-warning)] border-[var(--color-warning)]/40 bg-[rgba(245,158,11,0.1)] hover:bg-[var(--color-warning)] hover:text-black font-mono text-xs font-bold"
              >
                {isSubmitting ? "// ĐANG GỬI..." : "[ GỬI ĐƠN PHÚC KHẢO ]"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Danh Sách Đơn Phúc Khảo */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2 flex items-center justify-between">
            <span>DANH SÁCH ĐƠN PHÚC KHẢO ({appeals.length})</span>
            {isEC && <Badge tone="coordinator">EC PROCESSING MODE</Badge>}
          </h2>

          {isLoading ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
              Đang tải danh sách đơn phúc khảo...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ĐỘI THI</TableHead>
                  <TableHead>LÝ DO KHIẾU NẠI</TableHead>
                  <TableHead>TRẠNG THÁI</TableHead>
                  {isEC && <TableHead>THAO TÁC EC</TableHead>}
                </TableRow>
              </TableHeader>
              <tbody>
                {((appeals.length > 0
                  ? appeals
                  : [
                      {
                        id: "app-1",
                        teamId: "tm-1",
                        teamName: "Cyber_Knights",
                        reason: "Yêu cầu kiểm tra lại điểm Tiêu chí Kiến trúc hệ thống.",
                        status: 0 as AppealStatus,
                        response: undefined,
                        createdTime: "12/08/2026",
                      },
                    ]) as Appeal[]
                ).map((item) => {
                  const statusNum = item.status ?? 0;
                  const isPending = statusNum === 0;
                  const isApproved = statusNum === 1;

                  const appealItem = item as any;
                  const teamNameText = appealItem.teamName || appealItem.TeamName || `Đội #${appealItem.teamId || appealItem.TeamId || "TM"}`;

                  return (
                    <TableRow key={item.id || appealItem.AppealId}>
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          {teamNameText}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-[var(--text-primary)] max-w-xs truncate">
                            {item.reason}
                          </span>
                          {item.response && (
                            <span className="text-[10px] font-mono text-[var(--accent-primary)] mt-1 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> Phản hồi EC: {item.response}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          tone={
                            isPending
                              ? "warning"
                              : isApproved
                              ? "success"
                              : "danger"
                          }
                        >
                          {isPending ? "ĐANG CHỜ" : isApproved ? "CHẤP NHẬN" : "TỪ CHỐI"}
                        </Badge>
                      </TableCell>
                      {isEC && (
                        <TableCell>
                          {isPending ? (
                            <Button
                              variant="ghost"
                              onClick={() => setRespondModal(item)}
                              className="text-[10px] font-mono text-[var(--accent-coordinator)] border-[var(--accent-coordinator)]/30"
                            >
                              [ Phản Hồi ]
                            </Button>
                          ) : (
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              ✓ Đã xử lý
                            </span>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      {/* Modal EC Phản Hồi Đơn Phúc Khảo */}
      {respondModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-6 bg-[var(--bg-panel)] hud-clipped border-[var(--accent-coordinator)]/30">
            <h3 className="font-display text-base font-bold text-[var(--accent-coordinator)] tracking-widest uppercase mb-3">
              XỬ LÝ ĐƠN PHÚC KHẢO
            </h3>

            <p className="text-xs font-mono text-[var(--text-muted)] mb-3">
              Đội thi: <strong className="text-[var(--text-primary)]">{(respondModal as any).teamName || (respondModal as any).TeamName || (respondModal as any).teamId || "Đội thi"}</strong>
            </p>

            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-mono text-[var(--text-muted)] uppercase">
                Nội dung Phản hồi từ Event Coordinator *
              </label>
              <textarea
                rows={3}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Nhập nội dung giải trình hoặc lý do chấp nhận/từ chối phúc khảo..."
                className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-coordinator)]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                disabled={!responseText.trim() || isResponding}
                onClick={() => handleRespondConfirm("Approved")}
                className="flex-1 bg-[var(--color-success)] text-white font-mono text-xs font-bold justify-center"
              >
                ✓ CHẤP NHẬN
              </Button>
              <Button
                disabled={!responseText.trim() || isResponding}
                onClick={() => handleRespondConfirm("Rejected")}
                className="flex-1 bg-[var(--color-danger)] text-white font-mono text-xs font-bold justify-center"
              >
                ✕ TỪ CHỐI
              </Button>
              <Button
                variant="ghost"
                onClick={() => setRespondModal(null)}
                className="text-xs font-mono"
              >
                Hủy
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
