import { ArrowLeft, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { InquiryActions } from "@/components/admin/inquiry-actions";
import { EmailStatusText, InquiryStatusBadge } from "@/components/admin/status-badge";
import { getCategory } from "@/content/categories";
import { getSampleInquiry, sampleInquiries } from "@/lib/admin/sample-inquiries";
import { formatDateTime } from "@/lib/format";

export function generateStaticParams() {
  return sampleInquiries.map((i) => ({ id: i.id }));
}

export const metadata: Metadata = { title: "문의 상세" };

export default function AdminInquiryPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  return (
    <Suspense fallback={<div aria-busy className="h-96 animate-pulse rounded-xl bg-white" />}>
      <InquiryDetail params={params} />
    </Suspense>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-[15px] text-gray-900">{children ?? <span className="text-gray-400">—</span>}</dd>
    </div>
  );
}

async function InquiryDetail({ params }: Pick<PageProps<"/admin/inquiries/[id]">, "params">) {
  const { id } = await params;
  const inquiry = getSampleInquiry(id);
  if (!inquiry) notFound();

  return (
    <>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeft aria-hidden className="size-4" />
        문의 목록
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tabular-nums">{inquiry.inquiryNumber}</h1>
        <InquiryStatusBadge status={inquiry.status} />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        접수 {formatDateTime(inquiry.createdAt)} · 최종 수정 {formatDateTime(inquiry.updatedAt)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <section aria-labelledby="customer-title" className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 id="customer-title" className="text-base font-bold">
              고객 정보
            </h2>
            <dl className="mt-2 divide-y divide-gray-100">
              <Row label="회사명">{inquiry.companyName}</Row>
              <Row label="담당자명">{inquiry.contactName}</Row>
              <Row label="연락처">
                <a href={`tel:${inquiry.phone.replace(/[^0-9]/g, "")}`} className="inline-flex items-center gap-1.5 font-semibold text-brand-800">
                  <Phone aria-hidden className="size-4" />
                  {inquiry.phone}
                </a>
              </Row>
              <Row label="이메일">
                {inquiry.email && (
                  <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1.5 font-semibold text-brand-800">
                    <Mail aria-hidden className="size-4" />
                    {inquiry.email}
                  </a>
                )}
              </Row>
            </dl>
          </section>

          <section aria-labelledby="request-title" className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 id="request-title" className="text-base font-bold">
              문의 내용
            </h2>
            <dl className="mt-2 divide-y divide-gray-100">
              <Row label="제품 카테고리">{inquiry.productCategory && getCategory(inquiry.productCategory).label}</Row>
              <Row label="제품명">{inquiry.productName}</Row>
              <Row label="희망 규격">{inquiry.specification}</Row>
              <Row label="예상 수량">{inquiry.quantity}</Row>
              <Row label="희망 납기">{inquiry.desiredDeliveryDate}</Row>
              <Row label="납품 지역">{inquiry.deliveryLocation}</Row>
              <Row label="추가 요청">
                {inquiry.message && <span className="whitespace-pre-line">{inquiry.message}</span>}
              </Row>
              <Row label="첨부파일">
                {inquiry.attachmentCount > 0 ? `${inquiry.attachmentCount}개 (파일 저장소 연결 후 열람 가능)` : null}
              </Row>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section aria-labelledby="manage-title" className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 id="manage-title" className="mb-4 text-base font-bold">
              처리 관리
            </h2>
            <InquiryActions status={inquiry.status} internalNote={inquiry.internalNote} />
          </section>

          <section aria-labelledby="email-title" className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 id="email-title" className="text-base font-bold">
              이메일 알림
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">상태</dt>
                <dd>
                  <EmailStatusText status={inquiry.emailNotificationStatus} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">시도 횟수</dt>
                <dd className="tabular-nums">{inquiry.emailNotificationAttempts}회</dd>
              </div>
              {inquiry.emailNotificationLastError && (
                <div>
                  <dt className="text-gray-500">마지막 오류</dt>
                  <dd className="mt-1 rounded-md bg-red-50 px-3 py-2 text-red-800">{inquiry.emailNotificationLastError}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
