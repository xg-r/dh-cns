import { getCategory } from "@/content/categories";
import { emailStatuses, inquiryStatuses, type InquiryStatus } from "@/lib/inquiry/status";
import type { AdminInquiry } from "./sample-inquiries";

export type SortOrder = "newest" | "oldest";

export interface InquiryListFilter {
  status: InquiryStatus | null;
  query: string;
  sort: SortOrder;
}

export function filterInquiries(list: readonly AdminInquiry[], { status, query, sort }: InquiryListFilter): AdminInquiry[] {
  const needle = query.trim().toLowerCase();
  const filtered = list.filter((item) => {
    if (status && item.status !== status) return false;
    if (!needle) return true;
    return [item.inquiryNumber, item.productName, item.companyName]
      .filter((v): v is string => Boolean(v))
      .some((v) => v.toLowerCase().includes(needle));
  });
  const direction = sort === "newest" ? -1 : 1;
  return [...filtered].sort((a, b) => direction * a.createdAt.localeCompare(b.createdAt));
}

function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  // 스프레드시트 수식 주입 방지: 공백·제어문자·수식 기호(전각 포함)로 시작하면 무력화
  const safe = /^[\s=+\-@\uFF1D\uFF0B\uFF0D\uFF20]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

const csvColumns: Array<[string, (i: AdminInquiry) => string | number | null]> = [
  ["문의번호", (i) => i.inquiryNumber],
  ["접수일시", (i) => i.createdAt],
  ["상태", (i) => inquiryStatuses[i.status]],
  ["회사명", (i) => i.companyName],
  ["담당자명", (i) => i.contactName],
  ["연락처", (i) => i.phone],
  ["이메일", (i) => i.email],
  ["제품 카테고리", (i) => (i.productCategory ? getCategory(i.productCategory).label : null)],
  ["제품명", (i) => i.productName],
  ["규격", (i) => i.specification],
  ["수량", (i) => i.quantity],
  ["희망 납기", (i) => i.desiredDeliveryDate],
  ["납품 지역", (i) => i.deliveryLocation],
  ["요청 사항", (i) => i.message],
  ["첨부 수", (i) => i.attachmentCount],
  ["이메일 알림", (i) => emailStatuses[i.emailNotificationStatus]],
  ["내부 메모", (i) => i.internalNote],
];

/** 엑셀에서 한글이 깨지지 않도록 BOM 을 붙인 CSV 문자열 */
export function toCsv(list: readonly AdminInquiry[]): string {
  const header = csvColumns.map(([label]) => csvCell(label)).join(",");
  const rows = list.map((item) => csvColumns.map(([, get]) => csvCell(get(item))).join(","));
  return `﻿${[header, ...rows].join("\r\n")}`;
}
