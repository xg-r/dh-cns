"use client";

import { ArrowDownUp, Download, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/content/categories";
import { filterInquiries, toCsv, type SortOrder } from "@/lib/admin/inquiry-list";
import type { AdminInquiry } from "@/lib/admin/sample-inquiries";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { inquiryStatuses, isUnprocessed, type InquiryStatus } from "@/lib/inquiry/status";
import { EmailStatusText, InquiryStatusBadge } from "./status-badge";

const statusIds = Object.keys(inquiryStatuses) as InquiryStatus[];

function downloadCsv(list: readonly AdminInquiry[]) {
  const blob = new Blob([toCsv(list)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "inquiries.csv";
  link.click();
  // 즉시 해제하면 일부 브라우저에서 다운로드가 취소된다.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function productLabel(item: AdminInquiry) {
  return item.productName ?? (item.productCategory ? getCategory(item.productCategory).label : "제품 미지정");
}

export function InquiryList({ inquiries }: { inquiries: readonly AdminInquiry[] }) {
  const [status, setStatus] = useState<InquiryStatus | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const rows = filterInquiries(inquiries, { status, query, sort });

  const count = (s: InquiryStatus) => inquiries.filter((i) => i.status === s).length;
  const unprocessed = inquiries.filter((i) => isUnprocessed(i.status)).length;
  const emailFailed = inquiries.filter((i) => i.emailNotificationStatus === "FAILED").length;

  const stats = [
    { label: "신규 문의", value: count("NEW"), tone: "text-red-700" },
    { label: "미처리 (신규+검토 중)", value: unprocessed, tone: "text-gray-900" },
    { label: "메일 알림 실패", value: emailFailed, tone: emailFailed > 0 ? "text-red-700" : "text-gray-900" },
    { label: "전체 문의", value: inquiries.length, tone: "text-gray-900" },
  ];

  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <dt className="text-sm text-gray-500">{s.label}</dt>
            <dd className={cn("mt-1 text-2xl font-bold tabular-nums", s.tone)}>{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3">
        <div role="group" aria-label="상태 필터" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-1.5">
            {[null, ...statusIds].map((s) => {
              const active = s === status;
              return (
                <button
                  key={s ?? "ALL"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold whitespace-nowrap",
                    active ? "bg-brand-800 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-gray-900",
                  )}
                >
                  {s ? inquiryStatuses[s] : "전체"}
                  <span className={cn("tabular-nums", active ? "text-brand-200" : "text-gray-400")}>
                    {s ? count(s) : inquiries.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 sm:max-w-xl">
          <div className="relative flex-1">
            <label htmlFor="admin-search" className="sr-only">
              문의 번호, 제품명, 회사명 검색
            </label>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="admin-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="문의번호 · 제품명 · 회사명"
              className="min-h-10 w-full rounded-lg border border-gray-300 bg-white pr-3 pl-9 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
          <Button
            variant="secondary"
            className="min-h-10 px-3 text-sm"
            onClick={() => setSort((v) => (v === "newest" ? "oldest" : "newest"))}
            aria-label={`접수일 정렬 변경 (현재 ${sort === "newest" ? "최신순" : "오래된순"})`}
          >
            <ArrowDownUp aria-hidden className="size-4" />
            {sort === "newest" ? "최신순" : "오래된순"}
          </Button>
          <Button
            variant="secondary"
            className="min-h-10 px-3 text-sm"
            onClick={() => downloadCsv(rows)}
            disabled={rows.length === 0}
          >
            <Download aria-hidden className="size-4" />
            필터 결과 CSV
          </Button>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-gray-500">
        {rows.length}건
      </p>

      {rows.length === 0 ? (
        <p className="mt-2 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-gray-500">
          조건에 맞는 문의가 없습니다.
        </p>
      ) : (
        <ul className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {rows.map((item) => {
            const pending = isUnprocessed(item.status);
            return (
              <li key={item.id} className="border-b border-gray-100 last:border-0">
                <Link
                  href={`/admin/inquiries/${item.id}`}
                  className={cn(
                    "grid gap-2 border-l-4 px-4 py-4 transition-colors hover:bg-gray-50 sm:px-5 md:grid-cols-[10rem_1fr_9rem_8rem] md:items-center md:gap-6",
                    item.status === "NEW" ? "border-l-red-500 bg-red-50/40" : pending ? "border-l-amber-400" : "border-l-transparent",
                    item.status === "CANCELLED" && "opacity-60",
                  )}
                >
                  <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-1.5">
                    <InquiryStatusBadge status={item.status} />
                    <span className="text-xs text-gray-500 tabular-nums">{item.inquiryNumber}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{productLabel(item)}</p>
                    <p className="mt-0.5 truncate text-sm text-gray-600">
                      {[item.companyName, item.contactName, item.phone].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 tabular-nums">{formatDateTime(item.createdAt)}</span>
                  <EmailStatusText status={item.emailNotificationStatus} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
