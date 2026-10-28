import { Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { site, telHref } from "@/content/site";
import { inquiryProcess } from "@/content/process";
import { getProductBySlug } from "@/lib/products";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "견적 문의",
  description: "산업용 비닐·필름, 테이프, 스트레치필름 등 산업용 포장자재 견적 문의. 규격이나 수량이 정해지지 않았어도 상담을 요청할 수 있습니다.",
});

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <>
      <PageHeader
        title="견적 문의"
        description="규격이나 수량이 정해지지 않았어도 괜찮습니다. 아는 만큼만 남겨 주시면 담당자가 확인 후 연락드립니다."
        breadcrumbs={[{ label: "견적 문의" }]}
      />
      <Container className="grid gap-12 py-10 sm:py-14 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0">
          <Suspense fallback={<InquiryForm defaultCategory="" defaultProductName="" />}>
            <PrefilledInquiryForm searchParams={searchParams} />
          </Suspense>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section aria-labelledby="process-title" className="rounded-xl border border-gray-200 p-6">
            <h2 id="process-title" className="text-base font-bold">
              문의 처리 절차
            </h2>
            <ol className="mt-5 space-y-5">
              {inquiryProcess.map((step, i) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-800 text-sm font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-gray-200 pt-4 text-sm leading-relaxed text-gray-500">
              생산 가능 여부, 최소 주문 수량, 단가와 납기는 품목과 원료 수급 상황에 따라 달라지므로 모든 거래는 담당자 확인 후
              확정합니다. 온라인 결제·자동 주문 확정은 제공하지 않습니다.
            </p>
          </section>

          {(site.phone || site.email) && (
            <section aria-labelledby="direct-title" className="rounded-xl bg-gray-50 p-6">
              <h2 id="direct-title" className="text-base font-bold">
                바로 상담하기
              </h2>
              <ul className="mt-4 space-y-3 text-[15px]">
                {site.phone && (
                  <li>
                    <a href={telHref(site.phone)} className="flex items-center gap-2 font-semibold text-brand-800">
                      <Phone aria-hidden className="size-4" />
                      {site.phone}
                    </a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`} className="flex items-center gap-2 font-semibold text-brand-800">
                      <Mail aria-hidden className="size-4" />
                      {site.email}
                    </a>
                  </li>
                )}
              </ul>
              {site.businessHours && <p className="mt-3 text-sm text-gray-500">{site.businessHours}</p>}
            </section>
          )}
        </aside>
      </Container>
    </>
  );
}

/** ?product=slug 로 진입하면 제품 정보를 미리 채운다. */
async function PrefilledInquiryForm({ searchParams }: Pick<PageProps<"/contact">, "searchParams">) {
  const { product: slug } = await searchParams;
  const product = typeof slug === "string" ? getProductBySlug(slug) : undefined;
  return <InquiryForm defaultCategory={product?.category ?? ""} defaultProductName={product?.name ?? ""} />;
}
