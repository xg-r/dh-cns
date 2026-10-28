/**
 * 메인 페이지 비주얼 콘텐츠.
 * 이미지는 모두 /public/samples 의 샘플 사진이다. 실제 사진으로 교체 후 sample 을 false 로 바꾼다.
 */
export interface HeroSlide {
  id: string;
  /** 이전·다음 버튼에 표시하는 짧은 이름 */
  label: string;
  /** 제목 위 작은 머리말 */
  eyebrow: string;
  /** 큰 제목 (줄바꿈은 \n) */
  title: string;
  subtitle: string;
  image: { src: string; alt: string; sample: boolean };
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}

export const heroSlides: HeroSlide[] = [
  {
    id: "partner",
    label: "포장자재 파트너",
    eyebrow: "산업용 포장자재 제조·가공·납품",
    title: "산업 현장을 이해하는\n포장자재 파트너",
    subtitle:
      "비닐·필름부터 테이프와 스트레치필름까지. 고객의 사용 목적과 요구 규격에 맞는 포장자재 공급 방안을 상담합니다.",
    image: { src: "/samples/hero-warehouse.webp", alt: "창고에 적재된 포장 팔레트 (샘플 이미지)", sample: true },
    primary: { href: "/products", label: "제품 둘러보기" },
    secondary: { href: "/contact", label: "견적 문의하기" },
  },
  {
    id: "stretch",
    label: "랩·스트레치필름",
    eyebrow: "제품 소개",
    title: "랩·스트레치필름",
    subtitle: "팔레트 적재물을 고정하고 보호하는 랩·스트레치필름. 작업 방식과 적재물에 맞춰 상담합니다.",
    image: { src: "/samples/hero-wrapping.webp", alt: "스트레치필름으로 감싼 팔레트가 늘어선 창고 (샘플 이미지)", sample: true },
    primary: { href: "/products?category=wrap", label: "제품 보기" },
    secondary: { href: "/contact", label: "견적 문의하기" },
  },
  {
    id: "manufacturing",
    label: "생산 기반",
    eyebrow: "생산 기반",
    title: "자체 압출 설비로\n만드는 필름",
    subtitle: "2015년과 2021년 압출 설비를 늘리고 2017년 제2공장을 확보하며 생산 기반을 넓혀 왔습니다.",
    image: { src: "/samples/facility-extrusion.webp", alt: "필름 압출 설비 (샘플 이미지)", sample: true },
    primary: { href: "/about#facility", label: "생산 기반 보기" },
  },
];

export const facilityImage = {
  src: "/samples/facility-extrusion.webp",
  alt: "필름 압출 설비 (샘플 이미지)",
  sample: true,
};
