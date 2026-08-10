import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90",
  secondary: "bg-[var(--color-surface-soft)] text-[var(--color-ink)] hover:bg-[var(--color-hairline)]",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]",
};

// Component UI dùng chung DUY NHẤT cho toàn app — feature KHÔNG được tự định nghĩa
// Button riêng (đây chính là vấn đề FE cũ mắc phải).
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-[var(--radius-md)] px-[var(--space-lg)] py-[var(--space-sm)] text-[var(--fs-body-md)] font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
