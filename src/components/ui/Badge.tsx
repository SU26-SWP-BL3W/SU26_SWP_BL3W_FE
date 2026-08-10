import { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warning" | "error";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--color-surface-soft)] text-[var(--color-mute)]",
  success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  error: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
};

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-[var(--space-sm)] py-[2px] text-[var(--fs-caption-sm)] font-medium ${TONE_CLASS[tone]} ${className}`}
      {...props}
    />
  );
}
