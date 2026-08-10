import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-[var(--space-lg)] ${className}`}
      {...props}
    />
  );
}
