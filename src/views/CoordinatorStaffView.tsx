"use client";

import { useState } from "react";
import { staffRepository } from "@/repositories/staffRepository";
import { Button, Card, Badge } from "@/components/ui";
import { UserPlus, Gavel, Compass, Shield, Mail, Send } from "lucide-react";

const EVENT_ID = "event-seal-2026";

type StaffRole = "Judge" | "Mentor";

function InviteForm({ roleName }: { roleName: StaffRole }) {
  const [email, setEmail] = useState("");
  const [trackId, setTrackId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const isJudge = roleName === "Judge";
  const accent = isJudge ? "judge" : "mentor";
  const accentVar = isJudge ? "var(--accent-judge)" : "var(--accent-mentor)";
  const Icon = isJudge ? Gavel : Compass;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = isJudge
        ? await staffRepository.inviteJudge({ eventId: EVENT_ID, trackId: trackId.trim() || undefined, email: email.trim() })
        : await staffRepository.inviteMentor({ eventId: EVENT_ID, trackId: trackId.trim() || undefined, email: email.trim() });
      setFeedback({ ok: true, text: res.message });
      setEmail("");
      setTrackId("");
    } catch {
      setFeedback({ ok: false, text: "Gửi lời mời thất bại. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-[var(--bg-panel)] border-[var(--border-muted)] hud-clipped space-y-4">
      <h2
        className="font-display text-base font-bold uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-[var(--border-muted)]"
        style={{ color: accentVar }}
      >
        <Icon className="w-4 h-4" />
        Mời {isJudge ? "Giám Khảo" : "Cố Vấn"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
            Email *
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={isJudge ? "giamkhao@vidu.com" : "covan@vidu.com"}
              className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-current transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
            Hạng Mục (Track ID) — tùy chọn
          </label>
          <input
            type="text"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="VD: track-ai-data (để trống nếu áp dụng toàn sự kiện)"
            className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-muted)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-current transition-colors"
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          accent={accent}
          disabled={isSubmitting || !email.trim()}
          className="w-full justify-center font-mono text-xs font-bold"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? "// ĐANG GỬI..." : `[ GỬI LỜI MỜI ${isJudge ? "GIÁM KHẢO" : "CỐ VẤN"} ]`}
        </Button>

        {feedback && (
          <p
            className={`text-xs font-mono ${
              feedback.ok ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
            }`}
          >
            {feedback.ok ? "✓" : "✕"} {feedback.text}
          </p>
        )}
      </form>
    </Card>
  );
}

export function CoordinatorStaffView() {
  return (
    <div className="p-[var(--space-xl)] max-w-[var(--container-max)] mx-auto hud-lattice min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-8 border-b border-[var(--border-muted)] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(167,139,250,0.1)] border border-[var(--accent-coordinator)]/30 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-[var(--accent-coordinator)]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[var(--accent-coordinator)]">
              PHÂN CÔNG NHÂN SỰ
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {"// MỜI GIÁM KHẢO & CỐ VẤN QUA EMAIL"}
            </p>
          </div>
        </div>
        <Badge tone="coordinator">
          <Shield className="w-3 h-3" /> EC STAFFING
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InviteForm roleName="Judge" />
        <InviteForm roleName="Mentor" />
      </div>
    </div>
  );
}
