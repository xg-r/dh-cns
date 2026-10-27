import Image from "next/image";
import { Tilt } from "@/components/motion/tilt";
import { Container } from "@/components/ui/container";
import { SampleBadge } from "@/components/ui/sample-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { approvedClients, supplyIndustries } from "@/content/company";
import { revealDelay } from "@/lib/reveal";

const FEATURED = 3;

/** 상단 넓은 이미지 타일 3개 + 하단 안내 패널과 번호 타일 */
export function SupplySection() {
  const featured = supplyIndustries.slice(0, FEATURED);
  const rest = supplyIndustries.slice(FEATURED);

  return (
    <section aria-labelledby="supply-title" className="pb-20 sm:pb-28">
      <Container>
        <SectionHeader
          id="supply-title"
          title="납품 분야"
          description="자동차 부품부터 항공, 식품, 해외 법인까지 여러 산업 현장에 포장자재를 납품해 왔습니다."
        />

        <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-8">
          {featured.map((item, i) => (
            <li key={item.title} data-reveal="flip" style={revealDelay(i)}>
              <Tilt max={5}>
                <div className="group relative aspect-[16/9.4] overflow-hidden bg-gray-200">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 360px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <SampleBadge className="top-2 right-2" />
                  <p className="absolute inset-x-0 bottom-0 bg-black/50 px-5 py-3.5 text-base font-bold text-white sm:text-[17px]">
                    {item.title}
                    <span className="sr-only"> — {item.description}</span>
                  </p>
                </div>
              </Tilt>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-8">
          <div data-reveal="left" className="flex flex-col bg-sand px-7 py-8">
            <p className="text-2xl leading-tight font-bold text-gray-900">
              납품 분야
              <br />
              더 보기
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              고객사명은 공개 범위를 확인한 뒤 게시합니다.
            </p>
            {approvedClients.length > 0 && (
              <p className="mt-3 text-sm text-gray-800">{approvedClients.map((c) => c.name).join(" · ")}</p>
            )}
          </div>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8">
            {rest.map((item, i) => (
              <li key={item.title} data-reveal="flip" style={revealDelay(i + 1)}>
                <div className="group relative aspect-square overflow-hidden border border-gray-200 bg-gray-100">
                  <span className="absolute top-0 left-0 z-10 grid size-9 place-items-center bg-accent-600 text-sm font-bold text-white tabular-nums">
                    {FEATURED + i + 1}
                  </span>
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 260px, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <SampleBadge />
                </div>
                <h3 className="mt-4 text-base font-bold sm:text-lg">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
