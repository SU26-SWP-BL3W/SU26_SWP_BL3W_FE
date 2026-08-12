"use client";

import { useState } from "react";
import { Button, Card, Table, TableHeader, TableRow, TableHead, TableCell, Badge } from "@/components/ui";



export function AppealsView() {
  const [reason, setReason] = useState("");

  const handleAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mock: Đã gửi khiếu nại thành công.");
    setReason("");
  };

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--color-warning)] mb-8">
        Khiếu nại kết quả (Appeals)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2">
            Gửi yêu cầu khiếu nại
          </h2>
          <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped">
            <form onSubmit={handleAppeal} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  Lý do khiếu nại
                </label>
                <textarea 
                  className="w-full border border-[var(--border-muted)] bg-[var(--bg-input)] px-[var(--space-md)] py-[var(--space-sm)] font-mono text-sm text-[color:var(--text-primary)] outline-none transition-all duration-150 placeholder:text-[color:var(--text-muted)]/50 focus:border-[var(--color-warning)] focus:shadow-[0_0_8px_rgba(255,170,0,0.15)] min-h-[100px]"
                  placeholder="Ghi rõ lý do tại sao bạn khiếu nại kết quả của vòng thi này..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full justify-center text-[var(--color-warning)] border-[var(--color-warning)] bg-transparent hover:bg-[var(--color-warning)] hover:text-black">
                {"[ GỬI KHIẾU NẠI ]"}
              </Button>
            </form>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2">
            Lịch sử khiếu nại
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày gửi</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell>12/08/2026</TableCell>
                <TableCell className="max-w-[150px] truncate">Lỗi chấm điểm bài thi Technical...</TableCell>
                <TableCell>
                  <Badge tone="warning">Đang xử lý</Badge>
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
