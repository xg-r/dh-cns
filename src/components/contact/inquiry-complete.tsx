"use client";

import { CircleCheck, Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { getCategory } from "@/content/categories";
import { site, telHref } from "@/content/site";
import { formatDateLong } from "@/lib/format";
import type { InquiryData } from "@/lib/inquiry/schema";
import type { InquiryReceipt } from "@/lib/inquiry/submit";

interface InquiryCompleteProps {
  receipt: InquiryReceipt;
  data: InquiryData;
  attachmentCount: number;
}

export function InquiryComplete({ receipt, data, attachmentCount }: InquiryCompleteProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, []);

  const product = [data.productCategory && getCategory(data.productCategory).label, data.productName]
    .filter(Boolean)
    .join(" / ");

  const summary: Array<[string, string | undefined]> = [
    ["회사명", data.companyName],
    ["담당자", data.contactName],
    ["연락처", data.phone],
    ["이메일", data.email],
    ["제품", product || undefined],
    ["희망 규격", data.needsConsultation ? "상담 후 결정" : data.specification],
    ["예상 수량", data.needsConsultation ? "상담 후 결정" : data.quantity],
    ["희망 납기", data.desiredDeliveryDate],
    ["납품 지역", data.deliveryLocation],
    ["첨부파일", attachmentCount > 0 ? `${attachmentCount}개` : undefined],
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {receipt.preview && (
        <Notice tone="warning" title="미리보기 화면입니다" className="mb-6">
          온라인 접수가 아직 연결되지 않아 이 문의는 실제로 접수·저장되지 않았습니다.
        </Notice>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
        <CircleCheck aria-hidden className="size-12 text-brand-700" strokeWidth={1.5} />
        <h2 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl font-bold focus:outline-none sm:text-3xl">
          {receipt.preview ? "접수 완료 화면 미리보기 (실제 접수 안 됨)" : "문의가 접수되었습니다"}
        </h2>
        <p className="mt-3 text-base text-gray-600 sm:text-lg">
          담당자가 생산 가능 여부와 규격, 견적을 확인한 뒤 남겨주신 연락처로 연락드립니다.
        </p>

        <div className="mt-8 grid gap-4 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">문의 번호</p>
            <p className="mt-0.5 text-xl font-bold tracking-wide text-brand-900 tabular-nums">{receipt.inquiryNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">접수 일시</p>
            <p className="mt-0.5 text-base font-semibold text-gray-900">{formatDateLong(receipt.receivedAt)}</p>
          </div>
        </div>

        <h3 className="mt-8 text-base font-bold">접수 내용</h3>
        <dl className="mt-3 divide-y divide-gray-100 border-y border-gray-200 text-[15px]">
          {summary
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="flex gap-4 py-2.5">
                <dt className="w-24 shrink-0 text-gray-500">{label}</dt>
                <dd className="text-gray-900">{value}</dd>
              </div>
            ))}
        </dl>

        <p className="mt-6 text-sm leading-relaxed text-gray-500">
          문의 접수는 주문이나 구매 확정을 의미하지 않습니다. 생산 가능 여부, 단가와 납기는 담당자 확인 후 안내해
          드립니다.
        </p>

        {site.phone && (
          <p className="mt-4 flex items-center gap-2 text-[15px] text-gray-700">
            <Phone aria-hidden className="size-4 text-gray-500" />
            빠른 확인이 필요하시면
            <a href={telHref(site.phone)} className="font-semibold text-brand-800 underline underline-offset-4">
              {site.phone}
            </a>
            로 연락해 주세요.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            메인으로 돌아가기
          </ButtonLink>
          <ButtonLink href="/products" variant="secondary" size="lg">
            다른 제품 둘러보기
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
