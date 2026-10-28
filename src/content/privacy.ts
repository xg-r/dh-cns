/**
 * 개인정보 수집·이용 안내 데이터.
 *
 * 법적 검토가 끝나지 않은 항목은 null 로 두며, 화면에는 "확정 전"으로 표시된다.
 * 운영 주체, 보유 기간, 처리 위탁, 개인정보 보호책임자, 시행일은 확인 후 입력한다.
 */
export interface PrivacyPolicy {
  /** 법적 검토 완료 여부. false 이면 처리방침 페이지에 초안 안내가 표시된다. */
  reviewed: boolean;
  operator: string | null;
  purpose: string;
  requiredItems: string[];
  optionalItems: string[];
  retentionPeriod: string | null;
  /** 처리 위탁 내역. null = 미확정, [] = 위탁 없음 */
  processors: Array<{ name: string; task: string }> | null;
  officer: { name: string; contact: string } | null;
  effectiveDate: string | null;
}

export const privacyPolicy: PrivacyPolicy = {
  reviewed: false,
  operator: null,
  purpose: "견적 및 구매 문의 접수, 상담 회신, 문의 처리 이력 관리",
  requiredItems: ["연락처"],
  optionalItems: ["회사명", "담당자명", "이메일", "납품 지역", "첨부파일에 포함된 정보"],
  retentionPeriod: null,
  processors: null,
  officer: null,
  effectiveDate: null,
};

export const PENDING_LABEL = "확정 전";
