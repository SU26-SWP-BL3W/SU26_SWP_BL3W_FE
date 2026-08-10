import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--fs-body-md)] text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] ${className}`}
      {...props}
    />
  ),
);
Input.displayName = "Input";
