"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useMyAssignedTracks, MENTOR_EVENT_ID } from "@/viewModels/useMyAssignedTracks";
import { useGetSubmitResultsByTrack } from "@/repositories/submitResultsRepository";
import { useGetTeamsByEvent } from "@/repositories/teamsRepository";
import { useGetTeamScoreBreakdown } from "@/repositories/scoresRepository";
import { Button, Card } from "@/components/ui";
import { Shield, RefreshCw, BarChart2 } from "lucide-react";

export function MentorProgressView() {
  const { user } = useAuth();
  const { myTracks, isLoading: isLoadingTracks } = useMyAssignedTracks();
  const [explicitTrackId, setExplicitTrackId] = useState("");
  const selectedTrackId = explicitTrackId || myTracks[0]?.id || myTracks[0]?.Id || "";

  const { data: submissions = [] } = useGetSubmitResultsByTrack(selectedTrackId);
  const { data: teams = [] } = useGetTeamsByEvent(MENTOR_EVENT_ID);

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

  const [activeTeamId, setActiveTeamId] = useState("");

  // Đội đang chọn phải nằm trong Track hiện tại — đổi Track thì tự chọn lại đội đầu tiên.
  useEffect(() => {
    if (teamIdsInTrack.length > 0 && !teamIdsInTrack.includes(activeTeamId)) {
      setActiveTeamId(teamIdsInTrack[0]);
    } else if (teamIdsInTrack.length === 0) {
      setActiveTeamId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdsInTrack]);

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
              // MENTOR MONITORING & SCORE BREAKDOWN
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
            onChange={(e) => setActiveTeamId(e.target.value)}
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
          <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                  ĐỘI THI THAM GIA
                </span>
                <h2 className="font-display font-bold text-xl text-[var(--text-primary)] uppercase">
                  {scoreBreakdown.teamName || `Đội #${scoreBreakdown.teamId}`}
                </h2>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Hạng mục: {scoreBreakdown.trackName || "AI & Data Science"}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                  TỔNG ĐIỂM TRUNG BÌNH
                </span>
                <span className="font-mono text-3xl font-bold text-[var(--accent-mentor)]">
                  {scoreBreakdown.totalScore} / 10
                </span>
              </div>
            </div>

            {/* Criteria Breakdown List */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                PHÂN RÃ ĐIỂM SỐ THEO TIÊU CHÍ (CRITERIA BREAKDOWN)
              </h3>

              {scoreBreakdown.details?.map((item: any) => (
                <div
                  key={item.criteriaId}
                  className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[var(--text-primary)]">{item.criteriaName}</span>
                    <span className="text-[var(--accent-mentor)] font-bold">
                      {item.scoreValue} / {item.maxScore} (Trọng số: {item.weight}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[var(--bg-base)] border border-[var(--border-muted)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-mentor)] transition-all duration-300"
                      style={{ width: `${(item.scoreValue / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
