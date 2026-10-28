import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SampleBadge } from "@/components/ui/sample-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { heroSlides } from "@/content/home";

/** 샌드 안내 패널 + 큰 이미지 분할 섹션 */
export function ConsultationFeature() {
  const image = heroSlides[1].image;
  return (
    <section aria-labelledby="consult-title" className="pb-20 sm:pb-28">
      <Container>
        <SectionHeader
          id="consult-title"
          title="견적 상담"
          description="찾는 제품의 규격이나 수량을 정확히 몰라도 상담을 요청할 수 있습니다."
        />
        <div className="mt-12 grid sm:mt-16 lg:grid-cols-[1fr_1.95fr]">
          <div data-reveal="left" className="flex flex-col justify-center bg-sand px-8 py-12 sm:px-14 sm:py-16">
            <p className="text-[1.75rem] leading-snug font-bold text-gray-900">
              <span className="font-extrabold">규격</span> 상담
            </p>
            <p className="mt-5 text-base leading-[1.9] font-medium text-gray-900">
              사용 목적과 현재 쓰는 제품 사진만 있어도
              <br className="hidden sm:inline" />
              담당자가 적합한 규격을 함께 찾아드려요.
            </p>
            <ButtonLink href="/contact" className="mt-9 self-start px-7">
              견적 문의하기
            </ButtonLink>
          </div>
          <div data-reveal="right" className="relative min-h-72 overflow-hidden sm:min-h-[26rem]">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 740px, 100vw" className="object-cover" />
            {image.sample && <SampleBadge />}
          </div>
        </div>
      </Container>
    </section>
  );
}
