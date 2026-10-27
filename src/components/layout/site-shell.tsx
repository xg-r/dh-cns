import { Suspense, type ReactNode } from "react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MobileActionBar, MobileActionBarView } from "./mobile-action-bar";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** 공개 페이지 공통 레이아웃. not-found 처럼 라우트 그룹 밖에서도 재사용한다. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
      >
        본문 바로가기
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <ScrollReveal />
      <Suspense fallback={<MobileActionBarView pathname={null} />}>
        <MobileActionBar />
      </Suspense>
    </div>
  );
}
