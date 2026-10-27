import Image from "next/image";
import type { ProductCategoryId } from "@/content/categories";
import type { ProductImage } from "@/content/products";
import { SampleBadge } from "@/components/ui/sample-badge";
import { cn } from "@/lib/cn";

interface ProductVisualProps {
  image: ProductImage | null;
  category: ProductCategoryId;
  name: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  /** "이미지 준비 중"·"샘플 이미지" 라벨 표시 여부. false 면 대체 일러스트를 장식용으로 취급한다. */
  showLabel?: boolean;
}

/**
 * 제품 이미지. 실제 이미지가 없으면 카테고리별 일러스트 대체 이미지를 보여준다.
 * 대체 이미지는 실제 제품 사진으로 오인되지 않도록 "이미지 준비 중"을 명시한다.
 */
export function ProductVisual({
  image,
  category,
  name,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  preload,
  showLabel = true,
}: ProductVisualProps) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden bg-sand", className)}>
      {image ? (
        <>
          <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} className="object-cover" />
          {image.sample && showLabel && <SampleBadge />}
        </>
      ) : (
        <div
          {...(showLabel ? { role: "img", "aria-label": `${name} 이미지 준비 중` } : { "aria-hidden": true })}
          className="absolute inset-0"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgb(209_202_196/0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgb(209_202_196/0.45)_1px,transparent_1px)] [background-size:24px_24px]"
          />
          <div aria-hidden className="absolute inset-0 grid place-items-center">
            <CategoryIllustration category={category} />
          </div>
          {showLabel && (
            <span
              aria-hidden
              className="absolute right-2 bottom-2 bg-white/90 px-2 py-0.5 text-[11px] font-medium text-gray-500"
            >
              이미지 준비 중
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CategoryIllustration({ category }: { category: ProductCategoryId }) {
  return (
    <svg viewBox="0 0 120 90" className="w-2/5 max-w-40 text-gray-400">
      {category === "film" && (
        <g {...stroke}>
          <ellipse cx="34" cy="45" rx="12" ry="26" />
          <ellipse cx="34" cy="45" rx="4" ry="9" />
          <path d="M34 19h52M34 71h52" />
          <path d="M86 19c6 0 10 12 10 26s-4 26-10 26" />
          <path d="M96 45h16" strokeDasharray="4 5" />
        </g>
      )}
      {category === "tape" && (
        <g {...stroke}>
          <circle cx="50" cy="45" r="28" />
          <circle cx="50" cy="45" r="14" />
          <path d="M70 65l32 14" />
        </g>
      )}
      {category === "wrap" && (
        <g {...stroke}>
          <rect x="22" y="20" width="56" height="48" rx="3" />
          <path d="M22 32l56 10M22 46l56 10M22 60l56 6" />
          <path d="M16 74h68" />
          <path d="M86 26v42" strokeDasharray="4 5" />
        </g>
      )}
      {category === "etc" && (
        <g {...stroke}>
          <path d="M60 14l38 18v28L60 78 22 60V32z" />
          <path d="M22 32l38 18 38-18M60 50v28" />
        </g>
      )}
    </svg>
  );
}
