"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]";
const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const STAGGER_MS = 90;

const variants: Record<string, Keyframe[]> = {
  up: [{ opacity: 0, transform: "translate3d(0, 32px, 0)" }, { opacity: 1, transform: "none" }],
  left: [{ opacity: 0, transform: "translate3d(-48px, 0, 0)" }, { opacity: 1, transform: "none" }],
  right: [{ opacity: 0, transform: "translate3d(48px, 0, 0)" }, { opacity: 1, transform: "none" }],
  zoom: [{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }],
  flip: [
    { opacity: 0, transform: "perspective(900px) rotateX(-28deg) translate3d(0, 40px, 0)" },
    { opacity: 1, transform: "none" },
  ],
};

/** 요소에 맞는 등장 애니메이션을 만들어 재생하고, 만든 Animation 을 돌려준다. */
function play(el: Element): Animation {
  const kind = el.getAttribute("data-reveal") || "up";
  const index = Number(getComputedStyle(el).getPropertyValue("--reveal-i")) || 0;
  const delay = index * STAGGER_MS;

  if (kind === "line") {
    return el.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], {
      duration: 1400,
      easing: "ease-out",
      fill: "forwards",
      pseudoElement: "::after",
    });
  }
  if (kind === "dot") {
    const color = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-600").trim();
    return el.animate([{ backgroundColor: color, borderColor: color, transform: "scale(1.15)" }], {
      duration: 500,
      delay: delay + 250,
      easing: EASE,
      fill: "forwards",
    });
  }
  return el.animate(variants[kind] ?? variants.up, { duration: 900, delay, easing: EASE, fill: "forwards" });
}

/**
 * data-reveal 요소가 화면에 들어오면 나타나게 한다. (초기 숨김 상태는 globals.css)
 * - DOM 속성을 바꾸지 않고 Web Animations API(fill: forwards)만 쓰므로,
 *   늦게 하이드레이션되는 영역에서도 서버 HTML 과 어긋나지 않는다.
 * - 라우트 이동·필터 변경으로 새로 생긴 요소도 MutationObserver 로 찾아 관찰한다.
 * - 키보드 포커스가 들어오거나, 교차 없이 화면 위로 지나간 요소는 즉시 보이게 한다.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    // 동작 줄이기 설정이거나, 초기화가 늦어 안전장치가 이미 숨김을 해제한 경우에는 아무것도 하지 않는다.
    if (!root.classList.contains("reveal-ready")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();
    const pending = new Set<Element>();

    const reveal = (el: Element, animate: boolean) => {
      if (!pending.delete(el)) return;
      io.unobserve(el);
      const animation = play(el);
      if (!animate) animation.finish();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target, true);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    let frame = 0;
    const scan = () => {
      frame = 0;
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // 레이아웃이 다시 마운트되어도 이미 나타난 요소는 다시 재생하지 않는다.
        if (el.getAnimations().some((a) => a.playState === "finished")) return;
        pending.add(el);
        io.observe(el);
      });
    };
    const scheduleScan = () => {
      if (!frame) frame = requestAnimationFrame(scan);
    };

    let scrollFrame = 0;
    const sweep = () => {
      scrollFrame = 0;
      for (const el of pending) {
        if (!el.isConnected) {
          pending.delete(el);
          io.unobserve(el);
        } else if (el.getBoundingClientRect().bottom < 0) {
          reveal(el, false);
        }
      }
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(sweep);
    };

    // 숨은 영역 안으로 포커스가 들어오면 바로 보이게 한다. (WCAG 2.4.7)
    const onFocusIn = (event: FocusEvent) => {
      let node = event.target instanceof Element ? event.target.closest(SELECTOR) : null;
      while (node) {
        reveal(node, false);
        node = node.parentElement?.closest(SELECTOR) ?? null;
      }
    };

    scan();
    root.setAttribute("data-reveal-init", "");
    const mo = new MutationObserver(scheduleScan);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocusIn, true);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn, true);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
