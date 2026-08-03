import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, variant = "primary", className = "", ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-[var(--color-ember-500)] text-[var(--color-pine-950)] hover:bg-[var(--color-ember-400)] hover:shadow-[0_0_24px_rgba(232,163,61,0.35)] active:scale-[0.98]",
    secondary: "border border-[var(--color-fern-500)]/50 text-[var(--color-fern-400)] hover:bg-[var(--color-fern-500)]/10 active:scale-[0.98]",
    ghost: "text-[var(--color-parchment-300)] hover:text-[var(--color-ember-400)]",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
