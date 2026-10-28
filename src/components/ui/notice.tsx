import { Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface NoticeProps {
  tone?: "info" | "warning";
  title?: string;
  children: ReactNode;
  className?: string;
}

/** 안내/미리보기 표시용 박스. 미연결 기능을 완성된 것처럼 보이지 않게 할 때 사용한다. */
export function Notice({ tone = "info", title, children, className }: NoticeProps) {
  const Icon = tone === "warning" ? TriangleAlert : Info;
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed",
        tone === "warning"
          ? "border-amber-300 bg-amber-50 text-amber-900"
          : "border-brand-200 bg-brand-50 text-brand-900",
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={cn(title && "mt-0.5")}>{children}</div>
      </div>
    </div>
  );
}
