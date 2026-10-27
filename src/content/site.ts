/**
 * 회사 기본 정보.
 *
 * 확인되지 않은 값은 반드시 null 로 둔다. null 인 항목은 화면에 노출되지 않는다.
 * (전화번호가 null 이면 전화 상담 버튼, tel: 링크도 렌더링되지 않는다.)
 */
export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  /** 로고 파일(/public 기준). inverseSrc 는 어두운 배경용. null 이면 텍스트 워드마크를 표시한다. */
  logo: { src: string; inverseSrc: string; width: number; height: number } | null;
  /** 대표 전화. 예: "031-000-0000" */
  phone: string | null;
  /** 대표 이메일. 예: "sales@example.com" */
  email: string | null;
  fax: string | null;
  address: string | null;
  representative: string | null;
  businessNumber: string | null;
  /** 상담 가능 시간. 예: "평일 09:00 – 18:00" */
  businessHours: string | null;
}

export const site: SiteConfig = {
  name: "대흥CNS",
  tagline: "산업 현장을 이해하는 포장자재 파트너",
  description:
    "산업용 비닐·필름, 테이프, 랩·스트레치필름 등 산업용 포장자재를 제조·가공하고 납품하는 대흥CNS입니다. 사용 목적과 요구 규격에 맞는 포장자재 공급 방안을 상담합니다.",
  logo: { src: "/brand/logo.png", inverseSrc: "/brand/logo-white.png", width: 233, height: 48 },
  phone: null,
  email: null,
  fax: null,
  address: null,
  representative: null,
  businessNumber: null,
  businessHours: null,
};

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
