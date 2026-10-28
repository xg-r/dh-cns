import { Award, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleBadge } from "@/components/ui/sample-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { facilities, history } from "@/content/company";
import { facilityImage } from "@/content/home";
import { FacilityCard } from "./facility-card";

/** 큰 사진 카드 + 하단 안내 패널 + 오른쪽 설비 카드 */
export function ManufacturingSection() {
  const awardCount = history.filter((h) => h.category === "award").length;

  return (
    <section aria-labelledby="manufacturing-title" className="pb-20 sm:pb-28">
      <Container>
        <SectionHeader
          id="manufacturing-title"
          title="생산 기반"
          description="압출 설비를 단계적으로 늘리고 제2공장을 확보하며 필름 생산과 가공 기반을 넓혀 왔습니다."
        />

        <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-[1.9fr_1fr] lg:gap-8">
          <div data-reveal="left" className="flex flex-col">
            <div className="group relative h-72 overflow-hidden sm:h-[22.5rem]">
              <Image
                src={facilityImage.src}
                alt={facilityImage.alt}
                fill
                sizes="(min-width: 1024px) 740px, 100vw"
                className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
              {facilityImage.sample && <SampleBadge />}
              <div className="relative p-7 text-white sm:p-10">
                <p className="text-[1.75rem] font-bold">자체 압출 설비</p>
                <p className="mt-3 text-[15px] text-white/90">필름 압출 설비를 갖추고 산업용 비닐·필름을 생산합니다.</p>
                <Link href="/about#facility" className="mt-4 inline-flex items-center gap-1 text-[15px] font-medium hover:underline">
                  자세히 보기
                  <ChevronRight aria-hidden className="size-4" />
                </Link>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between gap-6 bg-sand px-7 py-8 sm:px-10">
              <div>
                <p className="text-xl font-bold text-gray-900 sm:text-[1.375rem]">인증 및 수상 이력</p>
                <p className="mt-2 text-[15px] text-gray-600">
                  모범납세자 표창, 기술평가 우수기업 인증 등 {awardCount}건의 이력이 있습니다.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-semibold text-brand-900">
                  <Link href="/about#awards" className="inline-flex items-center gap-1 hover:underline">
                    인증·수상 보기
                    <ChevronRight aria-hidden className="size-4" />
                  </Link>
                  <span aria-hidden className="h-3 w-px bg-gray-300" />
                  <Link href="/about#history" className="inline-flex items-center gap-1 hover:underline">
                    전체 연혁 보기
                    <ChevronRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>
              <Award aria-hidden strokeWidth={1} className="hidden size-24 shrink-0 text-gray-900 sm:block" />
            </div>
          </div>

          <div data-reveal="right">
            <FacilityCard facilities={facilities} />
          </div>
        </div>
      </Container>
    </section>
  );
}
