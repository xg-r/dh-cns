import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HistoryCategoryBadge, HistoryTimeline } from "@/components/company/history-timeline";
import { CtaBand } from "@/components/home/cta-band";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { productCategories } from "@/content/categories";
import { facilities, history, supplyIndustries } from "@/content/company";
import { site } from "@/content/site";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "회사소개",
  description: `${site.name}는 산업용 비닐·필름, 테이프, 랩·스트레치필름 등 산업용 포장자재를 제조·가공하고 납품합니다. 설비 이력과 연혁, 인증 및 수상 이력을 소개합니다.`,
});

const sections = [
  { id: "intro", label: "회사 소개" },
  { id: "business", label: "사업 분야" },
  { id: "facility", label: "생산 기반" },
  { id: "history", label: "연혁" },
  { id: "awards", label: "인증·수상" },
  { id: "supply", label: "납품 분야" },
];

const businessAreas = [
  {
    title: "제조",
    description: "압출 설비를 이용해 산업용 비닐과 필름을 생산합니다.",
  },
  {
    title: "가공",
    description: "사용 목적과 요구 규격에 맞춰 포장자재를 가공합니다.",
  },
  {
    title: "납품",
    description: "산업 현장의 일정과 수량에 맞춰 포장자재를 공급합니다.",
  },
];

export default function AboutPage() {
  const awards = history.filter((h) => h.category === "award");

  return (
    <>
      <PageHeader
        title="회사소개"
        description="산업 현장을 이해하는 포장자재 파트너, 대흥CNS를 소개합니다."
        breadcrumbs={[{ label: "회사소개" }]}
      />

      <nav
        aria-label="회사소개 목차"
        className="sticky top-16 z-30 border-b border-gray-200 bg-white/95 backdrop-blur md:top-[81px]"
      >
        <Container className="overflow-x-auto">
          <ul className="flex w-max gap-1 py-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-10 items-center rounded-md px-3 text-[15px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <section id="intro" aria-labelledby="intro-title" className="scroll-mt-32 py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeader
            id="intro-title"
            align="left"
            eyebrow="ABOUT US"
            title="필요한 포장자재를 정확하게 공급하는 것에서 시작합니다"
          />
          <div data-reveal="right" className="space-y-5 text-base text-gray-700 sm:text-lg">
            <p>
              {site.name}는 산업용 비닐·필름, 테이프, 랩·스트레치필름 등 산업 현장에서 쓰이는 포장자재를 제조·가공하고
              납품하는 기업입니다.
            </p>
            <p>
              포장자재는 같은 이름이라도 사용 환경과 대상에 따라 필요한 규격이 달라집니다. 고객의 사용 목적과 요구
              규격을 먼저 확인하고, 생산 가능 여부와 공급 방안을 담당자가 직접 안내합니다.
            </p>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 text-[15px] sm:grid-cols-2">
              <div className="bg-white px-5 py-4">
                <dt className="text-sm text-gray-500">회사명</dt>
                <dd className="mt-1 font-semibold text-gray-900">{site.name}</dd>
              </div>
              <div className="bg-white px-5 py-4">
                <dt className="text-sm text-gray-500">주요 사업</dt>
                <dd className="mt-1 font-semibold text-gray-900">산업용 포장자재 제조·가공 및 납품</dd>
              </div>
              <div className="bg-white px-5 py-4 sm:col-span-2">
                <dt className="text-sm text-gray-500">핵심 제품군</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {productCategories.map((c) => c.label).join(" · ")}
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section id="business" aria-labelledby="business-title" className="scroll-mt-32 border-t border-gray-200 bg-gray-50 py-14 sm:py-20">
        <Container>
          <SectionHeader id="business-title" eyebrow="BUSINESS" title="사업 분야" />
          <ol className="mt-10 grid gap-4 [perspective:1400px] md:grid-cols-3">
            {businessAreas.map((area, i) => (
              <li key={area.title} data-reveal="flip" style={revealDelay(i)} className="rounded-xl border border-gray-200 bg-white p-6 sm:p-7">
                <span className="text-sm font-bold text-brand-500 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-xl font-bold">{area.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{area.description}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {productCategories.map((c, i) => (
              <li key={c.id} data-reveal style={revealDelay(i)} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="font-semibold text-gray-900">{c.label}</p>
                <p className="mt-0.5 text-sm text-gray-500">{c.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="facility" aria-labelledby="facility-title" className="scroll-mt-32 py-14 sm:py-20">
        <Container>
          <SectionHeader
            id="facility-title"
            eyebrow="MANUFACTURING"
            title="생산 기반 및 설비 이력"
            description="압출 설비 도입과 증설, 제2공장 확보를 통해 생산 기반을 넓혀 왔습니다."
          />
          <ol className="mt-10 grid gap-4 [perspective:1400px] md:grid-cols-3">
            {facilities.map((f, i) => (
              <li key={f.title} data-reveal="flip" style={revealDelay(i)} className="relative rounded-xl border border-gray-200 p-6 sm:p-7">
                <span className="text-3xl font-bold text-brand-800 tabular-nums">{f.year}</span>
                <h3 className="mt-3 text-lg font-bold">{f.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">{f.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="history" aria-labelledby="history-title" className="scroll-mt-32 border-t border-gray-200 py-14 sm:py-20">
        <Container>
          <SectionHeader id="history-title" eyebrow="HISTORY" title="기업 연혁" description="최신 연도부터 순서대로 정리했습니다." />
          <div className="mt-10">
            <HistoryTimeline items={history} />
          </div>
        </Container>
      </section>

      <section id="awards" aria-labelledby="awards-title" className="scroll-mt-32 border-t border-gray-200 bg-gray-50 py-14 sm:py-20">
        <Container>
          <SectionHeader id="awards-title" eyebrow="CERTIFICATION & AWARDS" title="인증 및 수상 이력" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((a, i) => (
              <li key={`${a.year}-${a.title}`} data-reveal="flip" style={revealDelay(i % 3)} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-brand-800 tabular-nums">{a.year}</span>
                  <HistoryCategoryBadge category={a.category} />
                </div>
                <p className="text-base font-semibold text-gray-900">{a.title}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="supply" aria-labelledby="supply-title" className="scroll-mt-32 py-14 sm:py-20">
        <Container>
          <SectionHeader
            id="supply-title"
            eyebrow="SUPPLY RECORD"
            title="주요 납품 분야"
            description="여러 산업 현장의 요구에 맞춰 포장자재를 공급해 왔습니다."
          />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {supplyIndustries.map((item, i) => (
              <li key={item.title} data-reveal style={revealDelay(i % 3)} className="rounded-xl border border-gray-200 p-5 sm:p-6">
                <h3 className="text-base font-bold sm:text-lg">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600 sm:text-[15px]">{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
