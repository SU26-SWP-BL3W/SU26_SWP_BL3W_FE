"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useMySubmissions, useCreateSubmission } from "@/repositories/submitResultsRepository";
import { useMyTeam } from "@/repositories/teamsRepository";
import {
  Button,
  Input,
  Card,
  Badge,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  HexagonLoader,
} from "@/components/ui";
import { Send, AlertTriangle, CheckCircle2, Lock } from "lucide-react";

export function MySubmissionsView() {
  const { user } = useAuth();
  const { data: teamData } = useMyTeam();
  const { data: submissions = [], isLoading } = useMySubmissions();
  const { mutateAsync: createSubmission, isPending } = useCreateSubmission();

  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)] animate-pulse">
        <HexagonLoader />
        <span className="ml-3">Đang tải dữ liệu bài nộp...</span>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
        Vui lòng đăng nhập...
      </div>
    );

  const team = teamData?.team;
  const teamId = team?.id || team?.TeamId || "";
  const teamStatus = team?.status || team?.Status || "Forming";
  const isTeamRegistered = teamStatus === "Registered";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return alert("Bạn chưa có đội thi.");
    if (!isTeamRegistered)
      return alert("Chỉ các đội thi ở trạng thái REGISTERED mới có thể nộp bài.");

    try {
      await createSubmission({
        teamId,
        trackId: "track-1", // TrackId của hạng mục thi đấu
        submissionUrl: link,
        description: desc,
      });
    } catch {
      console.warn("[SEAL] Submit result (mocked)");
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setLink("");
      setDesc("");
    }, 2500);
  };

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-8 border-b border-[var(--border-muted)] pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--accent-team)]">
            QUẢN LÝ BÀI NỘP (SUBMISSIONS)
          </h1>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            // NỘP SẢN PHẨM & LIÊN KẾT BÀI LÀM HACKATHON
          </p>
        </div>

        {team && (
          <div className="flex items-center gap-3">
            <Badge tone="team">Đội: {team.teamName || team.TeamName}</Badge>
            <Badge tone={isTeamRegistered ? "success" : "warning"}>
              {teamStatus.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      {/* Warning Banner if team is not Registered */}
      {team && !isTeamRegistered && (
        <div className="mb-8 p-4 bg-[rgba(245,158,11,0.08)] border border-[var(--color-warning)]/30 hud-clipped flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0" />
          <div className="text-xs font-mono text-[var(--text-muted)]">
            <p className="font-bold text-[var(--color-warning)] uppercase tracking-wider">
              ⚠ ĐỘI THI CHƯA ĐỦ ĐIỀU KIỆN NỘP BÀI
            </p>
            <p className="mt-0.5">
              Đội thi của bạn đang ở trạng thái <strong>{teamStatus}</strong>. Đội trưởng cần chốt danh sách và chờ Event Coordinator duyệt chuyển sang trạng thái <strong>REGISTERED</strong> mới có thể nộp bài.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions History Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
            LỊCH SỬ NỘP BÀI THI
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MÃ BÀI NỘP</TableHead>
                <TableHead>LINK BÀI LÀM</TableHead>
                <TableHead>TRẠNG THÁI</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {submissions.map((sub) => {
                const subId = sub.id || "#SUB-MOCK";
                const url = sub.submissionUrl || "#";
                const isEliminated = sub.isEliminated;

                return (
                  <TableRow key={subId}>
                    <TableCell>
                      <Badge tone="neutral">{subId}</Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent-primary)] hover:underline font-mono text-xs truncate max-w-xs block"
                      >
                        {url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge tone={isEliminated ? "danger" : "success"}>
                        {isEliminated ? "BỊ LOẠI" : "✓ ĐÃ GHI NHẬN"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {submissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="text-[var(--text-muted)] py-8 font-mono text-xs">
                    Chưa có bài nộp nào được ghi nhận.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>

        {/* Submit Form */}
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-[var(--accent-team)] uppercase tracking-widest border-b border-[var(--border-muted)] pb-2 flex items-center gap-2">
            <Send className="w-4 h-4" />
            NỘP BÀI MỚI
          </h2>
          <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped relative overflow-hidden">
            {isSubmitted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-panel)] z-10 p-6 text-center">
                <HexagonLoader className="w-16 h-16" />
                <span className="font-mono text-[var(--accent-primary)] mt-4 animate-pulse uppercase tracking-widest text-sm font-bold">
                  System_Lock_Engaged
                </span>
                <span className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                  Bài thi đã được lưu thành công trên hệ thống.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    URL Sản Phẩm (Github, Figma, Drive) <span className="text-[var(--color-danger)]">*</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://github.com/my-team/hackathon-repo"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    disabled={!isTeamRegistered}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    Mô Tả Ngắn Về Sản Phẩm
                  </label>
                  <Input
                    type="text"
                    placeholder="Ghi chú kiến trúc, công nghệ sử dụng..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    disabled={!isTeamRegistered}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending || !isTeamRegistered}
                  className="mt-2 w-full justify-center flex items-center gap-2"
                >
                  {!isTeamRegistered ? (
                    <>
                      <Lock className="w-4 h-4" /> CHƯA ĐỦ ĐIỀU KIỆN NỘP
                    </>
                  ) : (
                    "// SUBMIT_FINAL >"
                  )}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
