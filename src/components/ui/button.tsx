import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "inverse" | "outline-inverse" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand-900 text-white hover:bg-brand-700",
  secondary: "border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white",
  inverse: "bg-white text-gray-900 hover:bg-gray-100",
  "outline-inverse": "border border-white/70 text-white hover:bg-white hover:text-gray-900",
  ghost: "text-brand-900 hover:bg-gray-100",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-13 px-8 text-base",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

export function buttonStyles({ variant = "primary", size = "md" }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size]);
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
