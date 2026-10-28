"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const words = ["PE 비닐", "방청비닐", "OPP 테이프", "스트레치필름", "산업용 포장자재", "맞춤 포장 상담"];

function Row() {
  return (
    <ul className="flex shrink-0 items-center">
      {words.map((word, i) => (
        <li key={word} className="flex items-center">
          <span
            className={cn(
              "text-5xl font-extrabold tracking-tight whitespace-nowrap sm:text-7xl",
              i % 2 === 1 ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-brand-900)]" : "text-brand-900",
            )}
          >
            {word}
          </span>
          <span className="mx-8 size-3 rounded-full bg-accent-600 sm:mx-12 sm:size-4" />
        </li>
      ))}
    </ul>
  );
}

/**
 * 제품 키워드가 천천히 흐르는 장식 띠. 내용은 다른 섹션과 중복되므로 보조기기에서는 숨긴다.
 * 계속 움직이는 요소이므로 정지 버튼을 둔다. (WCAG 2.2.2)
 */
export function KeywordMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative mb-20 border-y border-gray-200 sm:mb-28">
      <div aria-hidden className="overflow-hidden py-8 sm:py-12">
        <div
          className={cn(
            "flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none",
            paused && "[animation-play-state:paused]",
          )}
        >
          <Row />
          <Row />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? "키워드 띠 움직임 재생" : "키워드 띠 움직임 정지"}
        aria-pressed={paused}
        className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full border border-gray-300 bg-white/90 text-gray-700 hover:text-gray-900 motion-reduce:hidden"
      >
        {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
      </button>
    </div>
  );
}
