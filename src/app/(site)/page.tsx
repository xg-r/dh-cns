import type { Metadata } from "next";
import { ConsultationFeature } from "@/components/home/consultation-feature";
import { CtaBand } from "@/components/home/cta-band";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HistorySection } from "@/components/home/history-section";
import { KeywordMarquee } from "@/components/home/keyword-marquee";
import { ManufacturingSection } from "@/components/home/manufacturing-section";
import { ProductShowcase } from "@/components/home/product-showcase";
import { PromoBanners } from "@/components/home/promo-banners";
import { QuickMenu } from "@/components/home/quick-menu";
import { StrengthsSection } from "@/components/home/strengths-section";
import { SupplySection } from "@/components/home/supply-section";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { heroSlides } from "@/content/home";
import { products } from "@/content/products";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** 섹션 구성은 hyundai.com/kr 메인의 흐름을 따른다..
 * 단, README 4-1 이 요구하는 '핵심 경쟁력'(StrengthsSection)은 주요 제품 다음에 둔다. */
export default function HomePage() {
  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <QuickMenu />
      <PromoBanners />

      <section aria-labelledby="products-title" className="pb-20 sm:pb-28">
        <Container>
          <SectionHeader
            id="products-title"
            title="주요 제품"
            description="사용 목적에 맞는 제품을 살펴보고, 제품별로 바로 견적 문의를 남겨 보세요."
          />
          <div className="mt-12 sm:mt-16">
            <ProductShowcase products={products} />
          </div>
        </Container>
      </section>

      <StrengthsSection />
      <ManufacturingSection />
      <ConsultationFeature />
      <KeywordMarquee />
      <SupplySection />
      <HistorySection />
      <CtaBand />
    </>
  );
}
