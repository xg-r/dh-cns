import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <p className="text-sm font-bold tracking-widest text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">요청하신 페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 max-w-md text-base text-gray-600">
          주소가 바뀌었거나 더 이상 제공되지 않는 페이지입니다. 찾으시는 제품이 있다면 제품안내에서 확인하거나 견적
          문의를 남겨 주세요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/products">제품안내 보기</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            견적 문의하기
          </ButtonLink>
          <ButtonLink href="/" variant="ghost">
            메인으로
          </ButtonLink>
        </div>
      </Container>
    </SiteShell>
  );
}
