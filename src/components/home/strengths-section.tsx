import { Factory, MessagesSquare, Network, Warehouse, type LucideIcon } from "lucide-react";
import { Tilt } from "@/components/motion/tilt";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { strengths } from "@/content/company";
import { site } from "@/content/site";
import { revealDelay } from "@/lib/reveal";

const icons: Record<string, LucideIcon> = {
  extrusion: Factory,
  plant: Warehouse,
  industries: Network,
  consulting: MessagesSquare,
};

export function StrengthsSection() {
  return (
    <section aria-labelledby="strengths-title" className="mb-20 bg-sand py-20 sm:mb-28 sm:py-28">
      <Container>
        <SectionHeader
          id="strengths-title"
          title={`${site.name}와 함께하는 이유`}
          description="직접 생산하는 설비와 여러 산업 현장의 납품 경험을 바탕으로, 고객의 사용 환경에 맞는 포장자재를 상담합니다."
        />
        <ol className="mt-12 grid gap-4 [perspective:1400px] sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((s, i) => {
            const Icon = icons[s.id] ?? Factory;
            return (
              <li key={s.id} data-reveal="flip" style={revealDelay(i)}>
                <Tilt className="h-full">
                  <div className="h-full bg-white px-6 py-7 transition-shadow hover:shadow-xl hover:shadow-gray-300/40 sm:px-7 sm:pt-8 sm:pb-10">
                    <div className="flex items-start justify-between">
                      <Icon aria-hidden strokeWidth={1.25} className="size-9 text-brand-900 sm:size-11" />
                      <span className="text-sm font-bold text-gray-300 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold sm:mt-8 sm:text-xl">{s.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{s.description}</p>
                  </div>
                </Tilt>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
