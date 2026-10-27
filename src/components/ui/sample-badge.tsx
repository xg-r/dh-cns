import { cn } from "@/lib/cn";

/** 임시 사진을 실제 회사·제품 사진으로 오인하지 않도록 이미지 위에 표시한다. */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute z-10 bg-black/55 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white",
        className ?? "right-2 bottom-2",
      )}
    >
      샘플 이미지
    </span>
  );
}
