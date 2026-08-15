"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useMyAssignedTracks } from "@/viewModels/useMyAssignedTracks";
import { useGetSubmitResultsByTrack } from "@/repositories/submitResultsRepository";
import { useGetTeamsByEvent } from "@/repositories/teamsRepository";
import { useGetTeamScoreBreakdown } from "@/repositories/scoresRepository";
import { Button, Card, Badge } from "@/components/ui";
import { Shield, RefreshCw, BarChart2, CheckCircle2, Clock } from "lucide-react";

export function MentorProgressView() {
  const { user } = useAuth();
  const { myTracks, isLoading: isLoadingTracks } = useMyAssignedTracks();
  const [explicitTrackId, setExplicitTrackId] = useState("");
  const selectedTrackId = explicitTrackId || myTracks[0]?.id || myTracks[0]?.Id || "";
  const selectedTrack = myTracks.find((t) => (t.id || t.Id) === selectedTrackId);
  const selectedEventId = selectedTrack?.eventId || selectedTrack?.EventId || "";

  const { data: submissions = [] } = useGetSubmitResultsByTrack(selectedTrackId);
  const { data: teams = [] } = useGetTeamsByEvent(selectedEventId);

  const teamNameById = useMemo(() => {
    const map = new Map<string, string>();
    teams.forEach((t) => map.set((t.id || t.Id) as string, t.name || t.Name || "Đội thi"));
    return map;
  }, [teams]);

  const teamIdsInTrack = useMemo(() => {
    const seen = new Set<string>();
    submissions.forEach((s) => {
      const teamId = (s.teamId || s.TeamId || "") as string;
      if (teamId) seen.add(teamId);
    });
    return Array.from(seen);
  }, [submissions]);

  // Đội đang chọn phải nằm trong Track hiện tại — đổi Track thì tự về đội đầu tiên.
  const [explicitTeamId, setExplicitTeamId] = useState("");
  const activeTeamId = teamIdsInTrack.includes(explicitTeamId) ? explicitTeamId : teamIdsInTrack[0] || "";

  const { data: scoreBreakdown, isLoading, refetch } = useGetTeamScoreBreakdown(activeTeamId);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
        Vui lòng đăng nhập với tài khoản Mentor...
      </div>
    );
  }

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[var(--border-muted)] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(167,139,250,0.1)] border border-[var(--accent-mentor)]/30 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-[var(--accent-mentor)]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--accent-mentor)] tracking-widest uppercase">
              THEO DÕI TIẾN ĐỘ ĐỘI THI (MENTOR PROGRESS)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {"// MENTOR MONITORING & SCORE BREAKDOWN"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-[var(--text-muted)] uppercase">Hạng mục:</span>
          <select
            value={selectedTrackId}
            onChange={(e) => setExplicitTrackId(e.target.value)}
            className="bg-[var(--bg-input)] border border-[var(--border-muted)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-mentor)]"
          >
            {myTracks.map((t) => (
              <option key={t.id || t.Id} value={t.id || t.Id}>
                {t.trackName || t.TrackName}
              </option>
            ))}
          </select>

          <span className="text-[var(--text-muted)] uppercase ml-2">Đội thi:</span>
          <select
            value={activeTeamId}
            onChange={(e) => setExplicitTeamId(e.target.value)}
            disabled={teamIdsInTrack.length === 0}
            className="bg-[var(--bg-input)] border border-[var(--border-muted)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-mentor)] disabled:opacity-50"
          >
            {teamIdsInTrack.length === 0 && <option value="">Chưa có đội nộp bài</option>}
            {teamIdsInTrack.map((teamId) => (
              <option key={teamId} value={teamId}>
                {teamNameById.get(teamId) || `Đội #${teamId}`}
              </option>
            ))}
          </select>

          <Button variant="ghost" onClick={() => refetch()} className="text-xs flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {isLoadingTracks || isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-mentor)]" />
          </div>
        ) : !activeTeamId || !scoreBreakdown ? (
          <Card className="p-12 text-center text-xs font-mono text-[var(--text-muted)] hud-clipped border-[var(--border-muted)]">
            <Shield className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            {myTracks.length === 0
              ? "Bạn chưa được phân công Cố vấn cho Hạng mục nào."
              : "Chọn một Đội thi để xem bảng phân rã điểm số theo từng tiêu chí."}
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                  ĐỘI THI THAM GIA
                </span>
                <h2 className="font-display font-bold text-xl text-[var(--text-primary)] uppercase">
                  {scoreBreakdown.teamName || `Đội #${scoreBreakdown.teamId}`}
                </h2>
              </div>
            </div>

            {scoreBreakdown.submissions.length === 0 ? (
              <Card className="p-12 text-center text-xs font-mono text-[var(--text-muted)] hud-clipped border-[var(--border-muted)]">
                Đội thi này chưa có bài nộp nào được chấm điểm.
              </Card>
            ) : (
              scoreBreakdown.submissions.map((submission) => (
                <Card
                  key={submission.submitResultId}
                  className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-muted)] pb-3">
                    <div>
                      <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase">
                        {submission.trackName} — {submission.roundName}
                      </h3>
                    </div>
                    <Badge tone={submission.roundPublished ? "success" : "mentor"}>
                      {submission.roundPublished ? "Kết quả đã công bố" : "Đang chấm điểm"}
                    </Badge>
                  </div>

                  {submission.judgeScores.length === 0 ? (
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      Chưa có giám khảo nào chấm bài nộp này.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {submission.judgeScores.map((judge, idx) => (
                        <div
                          key={`${submission.submitResultId}-${judge.judgeName}-${idx}`}
                          className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                              {judge.isSubmitted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-mentor)]" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              )}
                              {judge.judgeName}
                              {!judge.isSubmitted && (
                                <span className="text-[10px] text-[var(--text-muted)] normal-case">
                                  (chưa chốt điểm)
                                </span>
                              )}
                            </span>
                            <span className="text-[var(--accent-mentor)] font-bold">
                              {judge.totalScore} / 10
                            </span>
                          </div>

                          {judge.comment && (
                            <p className="font-mono text-[11px] text-[var(--text-muted)] italic">
                              &ldquo;{judge.comment}&rdquo;
                            </p>
                          )}

                          <div className="space-y-2">
                            {judge.criteria.map((item) => (
                              <div key={item.criteriaName} className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                  <span className="text-[var(--text-primary)]">{item.criteriaName}</span>
                                  <span className="text-[var(--text-muted)]">
                                    {item.value} / {item.maxScore} (Trọng số: {item.weight}%)
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-[var(--bg-base)] border border-[var(--border-muted)] overflow-hidden">
                                  <div
                                    className="h-full bg-[var(--accent-mentor)] transition-all duration-300"
                                    style={{ width: `${(item.value / item.maxScore) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
