import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** 로고 파일이 없으면 회사명 텍스트 워드마크를 쓴다. (임시 심볼로 실제 로고를 대신하지 않는다) */
export function Logo({ tone = "default", className }: { tone?: "default" | "inverse"; className?: string }) {
  const inverse = tone === "inverse";
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label={`${site.name} 홈`}>
      {site.logo ? (
        <Image
          src={inverse ? site.logo.inverseSrc : site.logo.src}
          width={site.logo.width}
          height={site.logo.height}
          alt={site.name}
          preload={!inverse}
          className="h-8 w-auto md:h-9"
        />
      ) : (
        <span className={cn("text-xl font-extrabold tracking-tight", inverse ? "text-white" : "text-brand-900")}>
          {site.name}
        </span>
      )}
    </Link>
  );
}
