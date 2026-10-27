import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand } from "@/components/home/cta-band";
import { ProductCatalog, ProductCatalogView } from "@/components/product/product-catalog";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/products",
  title: "제품안내",
  description:
    "산업용 비닐·필름, 테이프, 랩·스트레치필름, 기타 산업용 포장자재 제품 안내. 제품별로 규격과 수량에 맞춘 견적 문의를 남길 수 있습니다.",
});

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <>
      <PageHeader
        title="제품안내"
        description="가격은 규격과 수량에 따라 달라집니다. 필요한 제품을 찾아 바로 견적 문의를 남겨 주세요."
        breadcrumbs={[{ label: "제품안내" }]}
      />
      <Container className="py-10 sm:py-14">
        <h2 className="sr-only">제품 목록</h2>
        <Suspense fallback={<ProductCatalogView category={null} urlQuery="" />}>
          <FilteredCatalog searchParams={searchParams} />
        </Suspense>
      </Container>
      <CtaBand />
    </>
  );
}

/** 요청 시점에 렌더링해, 서버 HTML 에도 URL 의 필터가 반영되게 한다. */
async function FilteredCatalog({ searchParams }: Pick<PageProps<"/products">, "searchParams">) {
  await searchParams;
  return <ProductCatalog />;
}
