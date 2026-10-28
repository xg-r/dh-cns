import type { ProductCategoryId } from "@/content/categories";
import type { EmailStatus, InquiryStatus } from "@/lib/inquiry/status";

/**
 * 관리자 화면 디자인 확인용 샘플 데이터. 실제 고객 정보가 아니다.
 * 서버 연결 시 inquiries 테이블 조회 결과로 교체한다. (필드는 README 5-1 의 스키마를 따른다)
 */
export interface AdminInquiry {
  id: string;
  inquiryNumber: string;
  companyName: string | null;
  contactName: string | null;
  phone: string;
  email: string | null;
  productCategory: ProductCategoryId | null;
  productName: string | null;
  specification: string | null;
  quantity: string | null;
  desiredDeliveryDate: string | null;
  deliveryLocation: string | null;
  message: string | null;
  attachmentCount: number;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  emailNotificationStatus: EmailStatus;
  emailNotificationAttempts: number;
  emailNotificationLastError: string | null;
  internalNote: string | null;
}

export const sampleInquiries: AdminInquiry[] = [
  {
    id: "sample-08",
    inquiryNumber: "DH-20261027-0008",
    companyName: "샘플산업",
    contactName: "홍길동",
    phone: "010-0000-0008",
    email: "sample08@example.com",
    productCategory: "wrap",
    productName: "스트레치필름",
    specification: "폭 500mm",
    quantity: "월 100롤",
    desiredDeliveryDate: "11월 중",
    deliveryLocation: "경기도",
    message: "현재 사용 중인 래핑기 사양을 첨부합니다.",
    attachmentCount: 1,
    status: "NEW",
    createdAt: "2026-10-27T01:12:00Z",
    updatedAt: "2026-10-27T01:12:00Z",
    emailNotificationStatus: "SENT",
    emailNotificationAttempts: 1,
    emailNotificationLastError: null,
    internalNote: null,
  },
  {
    id: "sample-07",
    inquiryNumber: "DH-20261026-0007",
    companyName: "예시물산",
    contactName: null,
    phone: "010-0000-0007",
    email: null,
    productCategory: "film",
    productName: "방청비닐",
    specification: null,
    quantity: null,
    desiredDeliveryDate: null,
    deliveryLocation: "충청남도",
    message: "금속 부품 수출 포장용으로 상담 원합니다. 규격은 아직 미정입니다.",
    attachmentCount: 0,
    status: "NEW",
    createdAt: "2026-10-26T06:40:00Z",
    updatedAt: "2026-10-26T06:40:00Z",
    emailNotificationStatus: "FAILED",
    emailNotificationAttempts: 3,
    emailNotificationLastError: "샘플 오류: 발신 도메인 인증 필요",
    internalNote: null,
  },
  {
    id: "sample-06",
    inquiryNumber: "DH-20261024-0006",
    companyName: "테스트테크",
    contactName: "김담당",
    phone: "010-0000-0006",
    email: "sample06@example.com",
    productCategory: "tape",
    productName: "OPP 테이프",
    specification: "폭 48mm, 투명",
    quantity: "50박스",
    desiredDeliveryDate: "협의",
    deliveryLocation: "서울",
    message: "로고 인쇄 가능 여부 문의",
    attachmentCount: 0,
    status: "REVIEWING",
    createdAt: "2026-10-24T02:05:00Z",
    updatedAt: "2026-10-25T00:30:00Z",
    emailNotificationStatus: "SENT",
    emailNotificationAttempts: 1,
    emailNotificationLastError: null,
    internalNote: "인쇄 가능 여부 생산팀 확인 중",
  },
  {
    id: "sample-05",
    inquiryNumber: "DH-20261022-0005",
    companyName: "샘플식품",
    contactName: "이담당",
    phone: "010-0000-0005",
    email: "sample05@example.com",
    productCategory: "film",
    productName: "PE 비닐 (PE 필름)",
    specification: "600 × 900mm",
    quantity: "1만 매",
    desiredDeliveryDate: "12월 초",
    deliveryLocation: "경상북도",
    message: null,
    attachmentCount: 2,
    status: "WAITING_CUSTOMER",
    createdAt: "2026-10-22T04:15:00Z",
    updatedAt: "2026-10-23T08:00:00Z",
    emailNotificationStatus: "SENT",
    emailNotificationAttempts: 1,
    emailNotificationLastError: null,
    internalNote: "두께 확인 요청 메일 발송, 회신 대기",
  },
  {
    id: "sample-04",
    inquiryNumber: "DH-20261020-0004",
    companyName: "예시오토",
    contactName: "박담당",
    phone: "010-0000-0004",
    email: "sample04@example.com",
    productCategory: "film",
    productName: "PE 비닐 (PE 필름)",
    specification: "0.05mm",
    quantity: "월 300롤",
    desiredDeliveryDate: "11월 말",
    deliveryLocation: "울산",
    message: null,
    attachmentCount: 0,
    status: "QUOTED",
    createdAt: "2026-10-20T00:50:00Z",
    updatedAt: "2026-10-22T03:20:00Z",
    emailNotificationStatus: "SENT",
    emailNotificationAttempts: 1,
    emailNotificationLastError: null,
    internalNote: "견적서 발송 완료",
  },
  {
    id: "sample-03",
    inquiryNumber: "DH-20261015-0003",
    companyName: null,
    contactName: "최담당",
    phone: "010-0000-0003",
    email: null,
    productCategory: "etc",
    productName: "맞춤 포장자재 상담",
    specification: null,
    quantity: null,
    desiredDeliveryDate: null,
    deliveryLocation: null,
    message: "소량 구매 가능 여부",
    attachmentCount: 0,
    status: "CANCELLED",
    createdAt: "2026-10-15T07:00:00Z",
    updatedAt: "2026-10-16T01:00:00Z",
    emailNotificationStatus: "SENT",
    emailNotificationAttempts: 1,
    emailNotificationLastError: null,
    internalNote: "최소 주문 수량 미달로 고객 측 취소",
  },
  {
    id: "sample-02",
    inquiryNumber: "DH-20261010-0002",
    companyName: "테스트로지스",
    contactName: "정담당",
    phone: "010-0000-0002",
    email: "sample02@example.com",
    productCategory: "wrap",
    productName: "스트레치필름 (수동용)",
    specification: "폭 500mm, 20㎛",
    quantity: "200롤",
    desiredDeliveryDate: "10월 말",
    deliveryLocation: "인천",
    message: null,
    attachmentCount: 0,
    status: "COMPLETED",
    createdAt: "2026-10-10T05:30:00Z",
    updatedAt: "2026-10-18T02:00:00Z",
    emailNotificationStatus: "SENT",
    emailNotificationAttempts: 1,
    emailNotificationLastError: null,
    internalNote: "납품 완료",
  },
];

export function getSampleInquiry(id: string): AdminInquiry | undefined {
  return sampleInquiries.find((i) => i.id === id);
}
