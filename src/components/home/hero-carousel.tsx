"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SampleBadge } from "@/components/ui/sample-badge";
import type { HeroSlide } from "@/content/home";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** 활성 슬라이드의 글자를 순서대로 올린다. */
const animateIn = "animate-fade-up motion-reduce:animate-none";

/**
 * 메인 히어로 슬라이더. README 의 "과도한 애니메이션 금지"에 따라 자동 재생하지 않는다.
 * 페이지 h1 은 화면에 보이지 않는 고정 제목이고, 슬라이드 제목은 h2 이다.
 */
export function HeroCarousel({ slides }: { slides: readonly HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const prev = (index - 1 + count) % count;
  const next = (index + 1) % count;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="대흥CNS 소개"
      className="relative h-[37rem] overflow-hidden bg-gray-900 sm:h-[40rem] lg:h-[47.5rem]"
    >
      {/* 슬라이드가 바뀌어도 페이지 제목(h1)이 접근성 트리에서 사라지지 않도록 슬라이드 밖에 둔다. */}
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
      <div aria-live="polite">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}: ${slide.label}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none",
                active ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="100vw"
                preload={i === 0}
                className={cn("object-cover", active && "animate-kenburns motion-reduce:animate-none")}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"
              />
              {slide.image.sample && <SampleBadge className="top-20 right-4 sm:top-auto sm:right-6 sm:bottom-24" />}

              <Container
                size="wide"
                className="relative flex h-full flex-col justify-center pt-16 pb-16 md:pt-20 lg:px-24"
              >
                <p
                  className={cn(
                    "mb-5 flex items-center gap-3 text-sm font-medium tracking-wide text-white/80 sm:mb-6 sm:text-base",
                    active && animateIn,
                    "[animation-delay:100ms]",
                  )}
                >
                  <span aria-hidden className="h-px w-8 bg-white/60" />
                  {slide.eyebrow}
                </p>
                <h2
                  className={cn(
                    "text-[2.25rem] leading-[1.15] font-bold whitespace-pre-line text-white sm:text-6xl lg:text-[4.5rem]",
                    active && animateIn,
                    "[animation-delay:220ms]",
                  )}
                >
                  {slide.title}
                </h2>
                <p
                  className={cn(
                    "mt-5 max-w-xl text-base text-white/85 sm:mt-7 sm:text-xl sm:leading-relaxed",
                    active && animateIn,
                    "[animation-delay:380ms]",
                  )}
                >
                  {slide.subtitle}
                </p>
                <div
                  className={cn(
                    "mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row",
                    active && animateIn,
                    "[animation-delay:520ms]",
                  )}
                >
                  <ButtonLink href={slide.primary.href} variant="inverse" size="lg">
                    {slide.primary.label}
                  </ButtonLink>
                  {slide.secondary && (
                    <ButtonLink href={slide.secondary.href} variant="outline-inverse" size="lg">
                      {slide.secondary.label}
                    </ButtonLink>
                  )}
                </div>
              </Container>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex(prev)}
            className="group absolute top-1/2 left-2 hidden -translate-y-1/2 items-center gap-3 p-3 text-white lg:left-6 lg:flex"
            aria-label={`이전 슬라이드: ${slides[prev].label}`}
          >
            <ChevronLeft aria-hidden strokeWidth={1} className="size-12" />
            <span className="hidden text-base opacity-0 transition-opacity group-hover:opacity-100 xl:inline">
              {slides[prev].label}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIndex(next)}
            className="group absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-3 p-3 text-white lg:right-6 lg:flex"
            aria-label={`다음 슬라이드: ${slides[next].label}`}
          >
            <span className="hidden text-base opacity-0 transition-opacity group-hover:opacity-100 xl:inline">
              {slides[next].label}
            </span>
            <ChevronRight aria-hidden strokeWidth={1} className="size-12" />
          </button>

          <p
            aria-hidden
            className="absolute bottom-10 left-1/2 hidden w-full max-w-[90rem] -translate-x-1/2 px-8 text-sm font-medium text-white/80 tabular-nums lg:block lg:px-32"
          >
            <span className="text-white">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-2 text-white/50">/</span>
            {String(count).padStart(2, "0")}
          </p>
          <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-3 sm:bottom-10">
            <button
              type="button"
              onClick={() => setIndex(prev)}
              className="grid size-10 place-items-center text-white lg:hidden"
              aria-label={`이전 슬라이드: ${slides[prev].label}`}
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <ol className="flex items-center gap-2">
              {slides.map((slide, i) => (
                <li key={slide.id}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}번째 슬라이드: ${slide.label}`}
                    aria-current={i === index ? "true" : undefined}
                    className="grid h-10 place-items-center px-1"
                  >
                    <span
                      className={cn(
                        "block h-1 transition-all motion-reduce:transition-none",
                        i === index ? "w-10 bg-white" : "w-5 bg-white/40 hover:bg-white/70",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => setIndex(next)}
              className="grid size-10 place-items-center text-white lg:hidden"
              aria-label={`다음 슬라이드: ${slides[next].label}`}
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
