import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { history } from "@/content/company";
import { HistoryHighlights } from "./history-highlights";

export function HistorySection() {
  return (
    <section aria-labelledby="history-title" className="border-t border-gray-200 py-20 sm:py-28">
      <Container>
        <SectionHeader id="history-title" title="주요 연혁" description="설비 확충과 인증·수상 이력을 연도별로 정리했습니다." />
        <div className="mt-10 sm:mt-12">
          <HistoryHighlights items={history} />
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/about#history" variant="secondary">
            회사 연혁 자세히 보기
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
