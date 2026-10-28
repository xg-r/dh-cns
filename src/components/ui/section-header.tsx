import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  tone?: "default" | "inverse";
  action?: ReactNode;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  tone = "default",
  action,
}: SectionHeaderProps) {
  const inverse = tone === "inverse";
  const center = align === "center";
  return (
    <div
      data-reveal
      className={cn(
        "flex flex-col gap-6",
        center && "items-center text-center",
        !center && action != null && "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-3xl", center && "mx-auto")}>
        {eyebrow && (
          <p className={cn("mb-3 text-sm font-semibold tracking-wide", inverse ? "text-accent-100" : "text-accent-600")}>
            {eyebrow}
          </p>
        )}
        <Heading
          id={id}
          className={cn("text-[1.75rem] leading-tight font-bold sm:text-[2.5rem]", inverse && "text-white")}
        >
          {title}
        </Heading>
        {description && (
          <p className={cn("mt-4 text-[15px] sm:mt-5 sm:text-base", inverse ? "text-gray-300" : "text-gray-600")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
