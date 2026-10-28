"use client";

import { FileText, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, telHref } from "@/content/site";
import { cn } from "@/lib/cn";
import { contactHref, getProductBySlug } from "@/lib/products";

/** 모바일 하단 고정 바: 전화 문의 / 견적 문의. 전화번호가 없으면 견적 문의만 표시한다. */
export function MobileActionBar() {
  return <MobileActionBarView pathname={usePathname()} />;
}

/** 제품 상세 페이지에서는 해당 제품을 문의 폼에 미리 채운다. */
function contactHrefFor(pathname: string | null): string {
  const slug = pathname?.match(/^\/products\/([^/]+)$/)?.[1];
  const product = slug ? getProductBySlug(decodeURIComponent(slug)) : undefined;
  return contactHref(product);
}

export function MobileActionBarView({ pathname }: { pathname: string | null }) {
  const onContactPage = pathname === "/contact";
  if (onContactPage && !site.phone) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="flex gap-2">
        {site.phone && (
          <a
            href={telHref(site.phone)}
            className={cn(
              "flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white font-semibold text-gray-800",
              onContactPage ? "flex-1" : "w-[42%]",
            )}
          >
            <Phone aria-hidden className="size-4" />
            전화 문의
          </a>
        )}
        {!onContactPage && (
          <Link
            href={contactHrefFor(pathname)}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-800 font-semibold text-white"
          >
            <FileText aria-hidden className="size-4" />
            견적 문의하기
          </Link>
        )}
      </div>
    </div>
  );
}
