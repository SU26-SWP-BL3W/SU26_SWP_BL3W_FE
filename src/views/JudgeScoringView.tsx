"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useGetJudgeSubmissions } from "@/repositories/submitResultsRepository";
import { useGetCriterias } from "@/repositories/templatesRepository";
import { useSaveScore } from "@/repositories/scoresRepository";
import { Button, Card, Badge, Input } from "@/components/ui";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Save,
  Send,
} from "lucide-react";
import type { SubmitResult, TemplateCriteriaEntity, CriteriaEntity } from "@/models/entities";

import { hasEventPermission } from "@/lib/permissions";
import { Link } from "@/i18n/routing";

export function JudgeScoringView() {
  const { user, activeRole } = useAuth();
  const [selectedTrackId, setSelectedTrackId] = useState("track-1");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmitResult | null>(null);

  const activeEventId = activeRole?.eventId || "event-seal-2026";
  const isAuthorizedJudge = hasEventPermission(user, activeRole, activeEventId);

  // Lấy danh sách bài nộp thuộc Track
  const { data: submissions = [], isLoading: loadingSubmissions, refetch } =
    useGetJudgeSubmissions(selectedTrackId);

  // Lấy danh sách Tiêu chí (Template Criteria)
  const { data: criterias = [] } = useGetCriterias();
  const defaultCriteria: TemplateCriteriaEntity[] = useMemo(() => {
    if (criterias && criterias.length > 0) {
      return criterias.map((c: CriteriaEntity) => ({
        criteriaId: c.id || c.CriteriaId || "crit-1",
        criteriaName: c.criterionName || c.criteriaName || c.CriterionName || "Tiêu chí",
        description: c.description || c.Description || "",
        maxScore: c.maxScore || c.MaxScore || 10,
        weight: c.weight || c.Weight || 25,
      }));
    }
    return [
      { criteriaId: "cr-1", criteriaName: "Ý tưởng & Đổi mới sáng tạo", maxScore: 10, weight: 30 },
      { criteriaId: "cr-2", criteriaName: "Kỹ thuật & Kiến trúc mã nguồn", maxScore: 10, weight: 40 },
      { criteriaId: "cr-3", criteriaName: "Tính khả thi & Tiềm năng thương mại", maxScore: 10, weight: 20 },
      { criteriaId: "cr-4", criteriaName: "Trình bày & Thuyết trình", maxScore: 10, weight: 10 },
    ];
  }, [criterias]);

  // Scores state: Record<criteriaId, scoreValue>
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const { mutateAsync: saveScoreApi, isPending: isSaving } = useSaveScore();

  // Tính TotalScore tự động theo công thức: SUM( (Value / MaxScore) * Weight ) * 10
  const calculatedTotalScore = useMemo(() => {
    let totalWeightedRatio = 0;
    let totalWeight = 0;

    defaultCriteria.forEach((cr) => {
      const crId = cr.criteriaId || "";
      const val = scores[crId] ?? 0;
      const max = cr.maxScore || 10;
      const w = cr.weight || 10;

      totalWeightedRatio += (val / max) * w;
      totalWeight += w;
    });

    if (totalWeight === 0) return 0;
    const finalScore = (totalWeightedRatio / totalWeight) * 10;
    return Math.min(10, Math.max(0, Number(finalScore.toFixed(2))));
  }, [scores, defaultCriteria]);

  const handleScoreChange = (criteriaId: string, val: number, maxScore: number) => {
    const clamped = Math.min(maxScore, Math.max(0, val));
    setScores((prev) => ({ ...prev, [criteriaId]: clamped }));
  };

  const handleSaveScore = async (isFinalSubmit: boolean) => {
    if (!selectedSubmission) return;

    // Conflict of interest check (Nếu Giám khảo thuộc đúng Đội thi)
    if (selectedSubmission.teamId && activeRole?.teamId === selectedSubmission.teamId) {
      alert("⚠️ Conflict of Interest: Bạn thuộc đội thi này nên không được phép chấm điểm!");
      return;
    }

    const payloadDetails = defaultCriteria.map((cr) => ({
      criteriaId: cr.criteriaId || "",
      value: scores[cr.criteriaId || ""] ?? 0,
    }));

    try {
      await saveScoreApi({
        eventId: activeRole?.eventId || "seal-2026-mua-he",
        eventRoleId: activeRole?.id || "er-judge-100",
        submitResultId: selectedSubmission.id || selectedSubmission.teamId || "sub-1",
        comment,
        isSubmitted: isFinalSubmit,
        details: payloadDetails,
      });

      alert(
        isFinalSubmit
          ? "✓ Đã CHỐT BẢNG ĐIỂM thành công!"
          : "✓ Đã LƯU NHÁP bảng điểm."
      );
    } catch {
      alert("Đã ghi nhận điểm số (Mock Mode).");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
        Vui lòng đăng nhập với tài khoản Giám khảo (Judge)...
      </div>
    );
  }

  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[var(--border-muted)] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(251,191,36,0.1)] border border-[var(--accent-judge)]/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-[var(--accent-judge)]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--accent-judge)] tracking-widest uppercase">
              BÀN CHẤM ĐIỂM GIÁM KHẢO (JUDGE SCORING)
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              // HẠNG MỤC THI ĐẤU: {selectedTrackId.toUpperCase()} · CHẤM ĐIỂM THEO CHUẨN RBL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/events/${activeEventId}/leaderboard`}>
            <Button variant="ghost" accent="judge" className="border border-[var(--accent-judge)]/40 text-[var(--accent-judge)] hover:bg-[var(--accent-judge)] hover:text-black text-xs font-mono font-bold">
              🏆 XEM BẢNG XẾP HẠNG
            </Button>
          </Link>

          <select
            value={selectedTrackId}
            onChange={(e) => setSelectedTrackId(e.target.value)}
            className="px-4 py-2 bg-[var(--bg-input)] border border-[var(--accent-judge)]/30 text-[var(--text-primary)] font-mono text-xs focus:outline-none hud-clipped cursor-pointer"
          >
            <option value="track-1">Hạng mục 1: AI & Data Science</option>
            <option value="track-2">Hạng mục 2: Cyber Security</option>
            <option value="track-3">Hạng mục 3: Web3 & Blockchain</option>
          </select>
          <Button variant="ghost" onClick={() => refetch()} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Submissions List */}
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-white uppercase tracking-widest border-b border-[var(--border-muted)] pb-2 flex items-center justify-between">
            <span>BÀI NỘP ({submissions.length})</span>
          </h2>

          {loadingSubmissions ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
              Đang tải danh sách bài nộp...
            </div>
          ) : submissions.length === 0 ? (
            <Card className="p-8 text-center text-xs font-mono text-[var(--text-muted)] hud-clipped border-[var(--border-muted)]">
              Chưa có bài nộp nào trong Hạng mục này.
            </Card>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => {
                const isSelected = selectedSubmission?.id === sub.id;
                return (
                  <button
                    key={sub.id || sub.teamId}
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setScores({});
                    }}
                    className={`w-full p-4 text-left transition-all duration-200 hud-clipped border ${
                      isSelected
                        ? "bg-[rgba(251,191,36,0.1)] border-[var(--accent-judge)]"
                        : "bg-[var(--bg-panel)] border-[var(--border-muted)] hover:border-[var(--accent-judge)]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                        Đội: #{sub.teamId || "TEAM-MOCK"}
                      </span>
                      <Badge tone={sub.isActive ? "success" : "neutral"}>
                        {sub.isActive ? "ĐÃ NỘP" : "DRAFT"}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-[var(--text-muted)] truncate">
                      {sub.description || "Không có mô tả thêm"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Scoring Form Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-[var(--accent-judge)] uppercase tracking-widest border-b border-[var(--border-muted)] pb-2">
            BẢNG ĐIỂM ĐÁNH GIÁ (TEMPLATE CRITERIA)
          </h2>

          {!selectedSubmission ? (
            <Card className="p-12 text-center text-xs font-mono text-[var(--text-muted)] hud-clipped border-[var(--border-muted)] flex flex-col items-center justify-center min-h-[300px]">
              <Shield className="w-12 h-12 text-[var(--accent-judge)]/40 mb-3" />
              Chọn một bài nộp ở danh sách bên trái để tiến hành chấm điểm.
            </Card>
          ) : (
            <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped space-y-6">
              {/* Submission preview bar */}
              <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-muted)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                    SẢN PHẨM ĐANG CHẤM
                  </span>
                  <a
                    href={selectedSubmission.submissionUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-bold"
                  >
                    {selectedSubmission.submissionUrl || "https://github.com/my-team/repo"}{" "}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                    ĐIỂM TỔNG TÍNH TOÁN
                  </span>
                  <span className="font-mono text-2xl font-bold text-[var(--accent-judge)]">
                    {calculatedTotalScore} / 10
                  </span>
                </div>
              </div>

              {/* Criteria Sliders / Inputs */}
              <div className="space-y-5">
                {defaultCriteria.map((cr) => {
                  const crId = cr.criteriaId || "";
                  const crName = cr.criteriaName || "Tiêu chí";
                  const max = cr.maxScore || 10;
                  const weight = cr.weight || 10;
                  const currentVal = scores[crId] ?? 0;

                  return (
                    <div
                      key={crId}
                      className="p-4 bg-[var(--bg-input)] border border-[var(--border-muted)] hud-clipped space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          {crName}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-[var(--text-muted)]">Trọng số: {weight}%</span>
                          <span className="text-[var(--accent-judge)] font-bold">
                            [{currentVal} / {max}]
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={0}
                          max={max}
                          step={0.5}
                          value={currentVal}
                          onChange={(e) =>
                            handleScoreChange(crId, Number(e.target.value), max)
                          }
                          className="flex-1 accent-[var(--accent-judge)] cursor-pointer"
                        />
                        <Input
                          type="number"
                          min={0}
                          max={max}
                          step={0.5}
                          value={currentVal}
                          onChange={(e) =>
                            handleScoreChange(crId, Number(e.target.value), max)
                          }
                          className="w-20 text-center font-bold"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comment Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  Nhận xét của Giám khảo
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ghi chú điểm mạnh, điểm yếu hoặc gợi ý cải thiện cho đội thi..."
                  className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs hud-clipped focus:outline-none focus:border-[var(--accent-judge)]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-muted)]">
                <Button
                  variant="ghost"
                  disabled={isSaving}
                  onClick={() => handleSaveScore(false)}
                  className="flex items-center gap-1.5 text-xs font-mono"
                >
                  <Save className="w-4 h-4" /> LƯU NHÁP
                </Button>
                <Button
                  disabled={isSaving}
                  onClick={() => handleSaveScore(true)}
                  className="flex items-center gap-1.5 text-xs font-mono bg-[var(--accent-judge)] text-black font-bold hover:bg-yellow-400"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  // CHỐT BẢNG ĐIỂM &gt;
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
