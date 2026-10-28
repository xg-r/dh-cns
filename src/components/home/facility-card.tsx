"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import type { Facility } from "@/content/company";
import { cn } from "@/lib/cn";

/** 설비 이력을 한 건씩 넘겨 보는 카드 (자동 재생 없음) */
export function FacilityCard({ facilities }: { facilities: readonly Facility[] }) {
  const [index, setIndex] = useState(facilities.length - 1);
  const count = facilities.length;
  const item = facilities[index];
  if (!item) return null;

  const move = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="relative flex h-full flex-col bg-sand px-7 pt-10 pb-8 sm:px-8">
      <p aria-live="polite" className="sr-only">
        {item.year}년 {item.title}: {item.description}
      </p>
      <p
        key={`t-${index}`}
        aria-hidden
        className="animate-fade-in text-center text-2xl font-bold text-gray-900 motion-reduce:animate-none"
      >
        {item.title}
      </p>

      <div className="relative mt-8 flex items-center justify-center">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="이전 설비"
          className="absolute left-0 grid size-11 place-items-center bg-gray-500/70 text-white hover:bg-gray-700 sm:-left-8"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <span
          key={`y-${index}`}
          aria-hidden
          className="animate-fade-up text-6xl font-bold text-brand-900 tabular-nums motion-reduce:animate-none sm:text-7xl"
        >
          {item.year}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="다음 설비"
          className="absolute right-0 grid size-11 place-items-center bg-gray-500/70 text-white hover:bg-gray-700 sm:-right-8"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      <dl className="mt-10 space-y-3 text-[15px]">
        <div className="flex justify-between gap-4">
          <dt className="font-semibold text-gray-900">연도</dt>
          <dd className="text-gray-700 tabular-nums">{item.year}년</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-semibold text-gray-900">구분</dt>
          <dd className="text-gray-700">설비 확충</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 font-semibold text-gray-900">내용</dt>
          <dd className="text-right text-gray-700">{item.description}</dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-gray-300 pt-8 text-center">
        <ButtonLink href="/contact" className="w-full max-w-48">
          견적 문의하기
        </ButtonLink>
      </div>

      <ol className="mt-auto flex justify-center gap-1 pt-8">
        {facilities.map((f, i) => (
          <li key={f.title}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${f.year}년 ${f.title}`}
              aria-current={i === index ? "true" : undefined}
              className="grid size-6 place-items-center"
            >
              <span className={cn("size-2.5 rounded-full", i === index ? "bg-accent-600" : "bg-gray-300")} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
