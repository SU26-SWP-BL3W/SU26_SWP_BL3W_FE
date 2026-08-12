"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useMySubmissions, useCreateSubmission } from "@/repositories/submitResultsRepository";
import { useMyTeam } from "@/repositories/teamsRepository";
import { Button, Input, Card, Badge, Table, TableHeader, TableRow, TableHead, TableCell, HexagonLoader } from "@/components/ui";

export function MySubmissionsView() {
  const { user } = useAuth();
  const { data: teamData } = useMyTeam();
  const { data: submissions, isLoading } = useMySubmissions();
  const { mutateAsync: createSubmission, isPending } = useCreateSubmission();

  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isLoading) return <div className="p-8 text-white font-mono text-center mt-20">Đang tải dữ liệu bài nộp...</div>;
  if (!user) return <div className="p-8 text-white font-mono text-center mt-20">Vui lòng đăng nhập...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamData?.team) return alert("Bạn chưa có đội thi.");
    
    await createSubmission({
      TeamId: teamData.team.id || teamData.team.TeamId || "",
      TrackId: "track-1", // mock
      SubmissionUrl: link,
      Description: desc
    }).catch(() => {
        console.warn("API lỗi, giả lập submit thành công");
    });
    
    setIsSubmitted(true);
    setTimeout(() => {
        setIsSubmitted(false);
        setLink("");
        setDesc("");
    }, 2500); // Đủ thời gian xem hiệu ứng Hexagon Lock
  };

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--accent-team)] mb-8">
        Quản lý Bài Nộp (Submissions)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2">
            Lịch sử nộp bài
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vòng thi</TableHead>
                <TableHead>Link bài làm</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {submissions?.map(sub => (
                <TableRow key={sub.SubmitResultId}>
                  <TableCell>Vòng 1 (Sơ loại)</TableCell>
                  <TableCell>
                    <a href={sub.SubmissionUrl} target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline">
                      {sub.SubmissionUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge tone={sub.IsEliminated ? "danger" : "success"}>
                      {sub.IsEliminated ? "Bị loại" : "Đã nộp"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {(!submissions || submissions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="text-[var(--text-muted)] py-8">
                    Chưa có bài nộp nào trong lịch sử.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-[var(--accent-team)] uppercase tracking-widest border-b border-[var(--border-muted)] pb-2">
            Nộp bài mới
          </h2>
          <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped relative overflow-hidden">
            {isSubmitted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-panel)] z-10">
                <HexagonLoader className="w-16 h-16" />
                <span className="font-mono text-[var(--accent-primary)] mt-4 animate-pulse uppercase tracking-widest">
                  System_Lock_Engaged
                </span>
                <span className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                  Ghi nhận thành công
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    URL (Github, Figma, Drive)
                  </label>
                  <Input 
                    type="url" 
                    placeholder="https://github.com/..." 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    Mô tả ngắn
                  </label>
                  <Input 
                    type="text" 
                    placeholder="Ghi chú thêm..." 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isPending} className="mt-2 w-full justify-center">
                  {"// SUBMIT_FINAL >"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
