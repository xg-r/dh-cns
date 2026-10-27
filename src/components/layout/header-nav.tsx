"use client";

import { Menu, Phone, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site, telHref } from "@/content/site";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { isActivePath, mainNav } from "./navigation";

/** 히어로 위에 투명하게 겹치는 경로 */
const OVERLAY_PATHS = new Set(["/"]);

/** 현재 경로를 읽는다. Suspense 안에서 렌더링해야 한다. */
export function HeaderWithPath() {
  return <HeaderBar pathname={usePathname()} />;
}

export function HeaderBar({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    // 로고·하단 바·뒤로 가기 등 메뉴 밖의 이동에서도 메뉴를 닫는다.
    setPrevPathname(pathname);
    setOpen(false);
  }
  const panelId = useId();
  const overlayRoute = pathname !== null && OVERLAY_PATHS.has(pathname);
  const transparent = overlayRoute && !scrolled && !open;

  useEffect(() => {
    if (!overlayRoute) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    // 페이지 중간에서 새로고침했거나 스크롤된 상태로 돌아온 경우를 위해 첫 프레임에 한 번 확인한다.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [overlayRoute]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={cn(
        "top-0 z-40 border-b transition-colors duration-300",
        overlayRoute ? "fixed inset-x-0" : "sticky",
        transparent
          ? "border-white/15 bg-transparent text-white [&_:focus-visible]:outline-white"
          : "border-gray-200 bg-white text-gray-900",
      )}
    >
      <Container size="wide" className="relative flex h-16 items-center justify-between gap-6 md:h-20">
        <Logo tone={transparent ? "inverse" : "default"} />

        <nav aria-label="주 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-10 lg:gap-16">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-20 items-center text-[17px] font-medium after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:transition-transform hover:after:scale-x-100",
                      transparent ? "after:bg-white" : "after:bg-brand-900",
                      active ? "after:scale-x-100" : "after:scale-x-0",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {site.phone && (
            <a href={telHref(site.phone)} className="inline-flex items-center gap-1.5 text-[15px] font-medium hover:underline">
              <Phone aria-hidden className="size-4" />
              {site.phone}
            </a>
          )}
          <Link href="/products" aria-label="제품 검색" className="grid size-10 place-items-center">
            <Search aria-hidden strokeWidth={1.5} className="size-6" />
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonStyles({ variant: transparent ? "outline-inverse" : "primary" }),
              "min-h-10 px-4 text-sm",
            )}
          >
            견적 문의
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </button>

        <div
          id={panelId}
          hidden={!open}
          className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gray-200 bg-white text-gray-900 md:hidden"
        >
          <nav aria-label="모바일 메뉴" className="px-5 pt-4 pb-8">
            <ul className="divide-y divide-gray-200 border-b border-gray-200">
              {mainNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-16 items-center text-xl font-bold",
                        active ? "text-accent-600" : "text-gray-900",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {site.phone && (
              <a
                href={telHref(site.phone)}
                className="mt-6 flex min-h-13 items-center justify-center gap-2 border border-gray-900 font-medium text-gray-900"
              >
                <Phone aria-hidden className="size-4" />
                {site.phone}
              </a>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
