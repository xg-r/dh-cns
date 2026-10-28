import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { licenseUrl, sampleCredits } from "@/content/sample-credits";

export const metadata: Metadata = {
  title: "샘플 이미지 출처",
  robots: { index: false },
  alternates: { canonical: "/credits" },
};

const linkClass = "text-accent-600 underline underline-offset-2";

export default function CreditsPage() {
  return (
    <>
      <PageHeader
        title="샘플 이미지 출처"
        description="홈페이지 디자인 확인을 위해 임시로 사용한 사진입니다. 대흥CNS의 실제 제품·설비 사진이 아니며, 실제 사진으로 교체될 예정입니다."
        breadcrumbs={[{ label: "샘플 이미지 출처" }]}
      />
      <Container size="narrow" className="py-12 sm:py-16">
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          모든 사진은 Wikimedia Commons 원본을 크기 조정·WebP 변환했으며, 일부는 워터마크 영역을 잘라냈습니다. 변경한
          이미지는 각 원본의 라이선스(CC BY-SA 의 경우 동일한 라이선스)를 따릅니다.
        </p>
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {sampleCredits.map((c) => {
            const url = licenseUrl(c.license);
            return (
              <li key={c.file} className="flex gap-4 py-4">
                <div className="relative size-20 shrink-0 overflow-hidden bg-gray-100">
                  <Image src={c.file} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 text-sm">
                  <p className="truncate font-semibold text-gray-900">{c.title}</p>
                  <p className="mt-1 text-gray-600">
                    {c.author} ·{" "}
                    {url ? (
                      <a href={url} className={linkClass} rel="noopener noreferrer license" target="_blank">
                        {c.license}
                      </a>
                    ) : (
                      c.license
                    )}
                  </p>
                  <a href={c.source} className={`mt-1 inline-block ${linkClass}`} rel="noopener noreferrer" target="_blank">
                    Wikimedia Commons 원본
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
