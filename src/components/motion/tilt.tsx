"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/cn";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** 최대 기울기(도) */
  max?: number;
  /** 빛 반사 하이라이트 표시 */
  glare?: boolean;
}

/**
 * 마우스 위치를 따라 살짝 기울어지는 3D 카드.
 * 마우스(정밀 포인터)에서만 동작하고, 터치·동작 줄이기 환경에서는 평면 그대로 둔다.
 * 리렌더링 없이 CSS 변수만 바꾼다.
 */
let reducedMotionQuery: MediaQueryList | null = null;

function prefersReducedMotion(): boolean {
  reducedMotionQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return reducedMotionQuery.matches;
}

export function Tilt({ children, className, max = 8, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    // 크기는 진입 시 한 번만 잰다. (이동마다 측정하면 스타일 계산이 반복된다)
    const rect = rectRef.current;
    if (!el || !rect || event.pointerType !== "mouse") return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--tilt-x", `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty("--tilt-y", `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty("--glare-x", `${x * 100}%`);
    el.style.setProperty("--glare-y", `${y * 100}%`);
    el.dataset.tilting = "";
  };

  const onLeave = () => {
    rectRef.current = null;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    delete el.dataset.tilting;
  };

  return (
    <div className={cn("[perspective:1000px]", className)}>
      <div
        ref={ref}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group/tilt relative h-full w-full transition-transform duration-300 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] data-[tilting]:duration-100"
      >
        {children}
        {glare && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 [background:radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,50%),rgb(255_255_255/0.28),transparent_55%)] group-data-[tilting]/tilt:opacity-100"
          />
        )}
      </div>
    </div>
  );
}
