import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleBadge } from "@/components/ui/sample-badge";
import { facilityImage, heroSlides } from "@/content/home";
import { cn } from "@/lib/cn";

const banners = [
  {
    href: "/contact",
    title: "규격 상담 받아보기",
    description: "규격·수량이 정해지지 않아도 상담할 수 있어요.",
    image: heroSlides[0].image,
    tone: "light" as const,
  },
  {
    href: "/about#facility",
    title: "생산 기반 알아보기",
    description: "압출 설비와 제2공장을 소개합니다.",
    image: facilityImage,
    tone: "dark" as const,
  },
];

/** 퀵메뉴 아래 가로 배너 한 쌍 */
export function PromoBanners() {
  return (
    <section aria-label="바로가기 배너" className="pt-14 pb-16 sm:pt-16 sm:pb-20">
      <Container>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
          {banners.map((b, i) => (
            <li key={b.href} data-reveal={i === 0 ? "left" : "right"}>
              <Link
                href={b.href}
                className={cn(
                  "group relative flex h-32 items-center overflow-hidden sm:h-36",
                  b.tone === "dark" ? "bg-brand-900 text-white" : "bg-gray-200 text-gray-900",
                )}
              >
                <div className="absolute inset-y-0 right-0 w-[55%]">
                  <Image
                    src={b.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 300px, 55vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r",
                      b.tone === "dark" ? "from-brand-900 via-brand-900/50" : "from-gray-200 via-gray-200/40",
                    )}
                  />
                  {b.image.sample && <SampleBadge className="right-1.5 bottom-1.5" />}
                </div>
                <div className="relative px-6 sm:px-10">
                  <p className="text-xl font-bold sm:text-[1.625rem]">{b.title}</p>
                  <p className={cn("mt-2 text-sm sm:text-[15px]", b.tone === "dark" ? "text-white/80" : "text-gray-700")}>
                    {b.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-16 border-t border-gray-200 sm:mt-20" />
      </Container>
    </section>
  );
}
