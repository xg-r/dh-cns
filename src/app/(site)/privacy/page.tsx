import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";
import { PendingBadge, PrivacySummary } from "@/components/contact/privacy-summary";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/ui/page-header";
import { privacyPolicy } from "@/content/privacy";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "개인정보 처리방침",
  description: `${site.name} 홈페이지 견적 문의 접수를 위한 개인정보 수집·이용 안내와 개인정보 처리방침`,
});

function Article({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-gray-200 py-8">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const p = privacyPolicy;

  return (
    <>
      <PageHeader title="개인정보 처리방침" breadcrumbs={[{ label: "개인정보 처리방침" }]} />
      <Container className="py-10 sm:py-14">
        <div className="max-w-3xl">
          {!p.reviewed && (
            <Notice tone="warning" title="법적 검토 전 초안입니다" className="mb-8">
              운영 주체, 보유 기간, 처리 위탁 여부, 개인정보 보호책임자 등은 확인 후 확정하여 게시합니다.
              <PendingBadge /> 으로 표시된 항목은 아직 확정되지 않았습니다.
            </Notice>
          )}

          <p className="pb-8 text-base text-gray-700">
            {p.operator ?? (
              <>
                운영 주체 <PendingBadge />
              </>
            )}
            (이하 ‘회사’)는 홈페이지 견적 문의 처리를 위해 필요한 최소한의 개인정보만 수집하며, 관련 법령에 따라
            이용자의 개인정보를 보호합니다.
          </p>

          <Article title="1. 수집하는 개인정보 항목과 목적">
            <div className="rounded-lg border border-gray-200 px-4 py-2">
              <PrivacySummary />
            </div>
            <p>회사는 위 목적 외의 용도로 개인정보를 이용하지 않으며, 목적이 변경될 경우 사전에 동의를 받습니다.</p>
          </Article>

          <Article title="2. 개인정보의 보유 및 이용 기간">
            <p>
              보유 기간: {p.retentionPeriod ?? <PendingBadge />}
            </p>
            <p>보유 기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.</p>
          </Article>

          <Article title="3. 개인정보 처리 위탁">
            {p.processors === null ? (
              <p>
                처리 위탁 여부: <PendingBadge />
              </p>
            ) : p.processors.length === 0 ? (
              <p>회사는 개인정보 처리 업무를 외부에 위탁하지 않습니다.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5">
                {p.processors.map((item) => (
                  <li key={item.name}>
                    {item.name} — {item.task}
                  </li>
                ))}
              </ul>
            )}
          </Article>

          <Article title="4. 이용자의 권리">
            <p>
              이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리 정지를 요청할 수 있으며, 회사는 지체 없이
              필요한 조치를 합니다.
            </p>
          </Article>

          <Article title="5. 개인정보 보호책임자">
            {p.officer ? (
              <p>
                {p.officer.name} · {p.officer.contact}
              </p>
            ) : (
              <p>
                개인정보 보호책임자: <PendingBadge />
              </p>
            )}
          </Article>

          <Article title="6. 시행일">
            <p>시행일: {p.effectiveDate ?? <PendingBadge />}</p>
          </Article>
        </div>
      </Container>
    </>
  );
}
