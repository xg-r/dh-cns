export const inquiryStatuses = {
  NEW: "신규 문의",
  REVIEWING: "검토 중",
  WAITING_CUSTOMER: "고객 답변 대기",
  QUOTED: "견적 안내 완료",
  COMPLETED: "처리 완료",
  CANCELLED: "취소",
} as const;

export type InquiryStatus = keyof typeof inquiryStatuses;

export const emailStatuses = {
  PENDING: "발송 대기",
  SENT: "발송 완료",
  FAILED: "발송 실패",
  SKIPPED: "미설정",
} as const;

export type EmailStatus = keyof typeof emailStatuses;

/** 담당자 조치가 필요한(미처리) 상태 */
export function isUnprocessed(status: InquiryStatus): boolean {
  return status === "NEW" || status === "REVIEWING";
}
