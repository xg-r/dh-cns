import type { ProductCategoryId } from "./categories";

/**
 * 제품 카탈로그 데이터.
 *
 * - 확인되지 않은 규격·옵션 값은 null 로 둔다. 화면에는 "별도 문의"로 표시된다.
 * - image 가 null 이면 카테고리별 대체 이미지(“이미지 준비 중”)가 표시된다.
 *   실제 사진은 /public/products/ 에 넣고 src 를 지정한다. sample: true 는 /public/samples 의 임시 사진이다.
 * - verified: 실제 취급 품목·문구 확인을 마쳤는지 여부(내부 관리용).
 *   현재 목록은 홈페이지 구성을 위한 초안이며 담당자 확인이 필요하다.
 */
export interface ProductImage {
  src: string;
  alt: string;
  /** 디자인 확인용 샘플 사진. 화면에 "샘플 이미지" 표시가 붙는다. */
  sample?: boolean;
}

export interface ProductSpec {
  label: string;
  /** null 이면 "별도 문의" */
  value: string | null;
}

export interface ProductOption {
  label: string;
  /** null 이면 "별도 문의" */
  values: string[] | null;
}

export interface Product {
  slug: string;
  name: string;
  category: ProductCategoryId;
  summary: string;
  description: string[];
  uses: string[];
  specs: ProductSpec[];
  options: ProductOption[];
  /** 상담 시 확인하는 항목 */
  consultItems: string[];
  /** 검색 보조 키워드 */
  keywords: string[];
  image: ProductImage | null;
  gallery: ProductImage[];
  verified: boolean;
}

const filmConsult = ["사용 목적과 포장 대상", "두께·폭·길이", "형태(롤·시트·봉투)", "예상 수량", "인쇄 필요 여부"];

export const products: Product[] = [
  {
    slug: "pe-film",
    name: "PE 비닐 (PE 필름)",
    category: "film",
    summary: "제품 포장과 표면 보호에 두루 쓰이는 폴리에틸렌 필름",
    description: [
      "PE 비닐은 산업 현장에서 가장 폭넓게 쓰이는 포장용 필름입니다. 부품과 제품의 먼지·습기 차단, 표면 보호, 낱개 포장 등에 사용됩니다.",
      "사용 목적과 포장 대상, 요구 규격을 확인한 뒤 공급 가능한 사양을 안내해 드립니다.",
    ],
    uses: ["부품·제품 낱개 포장", "먼지·습기 차단", "표면 보호", "적재물 덮개"],
    specs: [
      { label: "두께", value: null },
      { label: "폭", value: null },
      { label: "길이", value: null },
    ],
    options: [
      { label: "형태", values: null },
      { label: "색상", values: null },
    ],
    consultItems: filmConsult,
    keywords: ["PE", "폴리에틸렌", "산업용 비닐", "PE 필름", "비닐 롤"],
    image: { src: "/samples/product-pe-film.webp", alt: "투명 PE 필름 롤과 실링기 (샘플 이미지)", sample: true },
    gallery: [],
    verified: false,
  },
  {
    slug: "vci-film",
    name: "방청비닐",
    category: "film",
    summary: "금속 부품의 녹 발생을 줄이기 위한 방청 기능성 포장 필름",
    description: [
      "방청비닐은 금속 부품을 보관하거나 운송할 때 녹 발생을 줄이기 위해 사용하는 기능성 포장 필름입니다. 자동차 부품, 기계 부품 등 금속 제품 포장에 주로 쓰입니다.",
      "적용 금속 종류와 보관 환경, 보관 기간에 따라 적합한 사양이 달라지므로 상담을 통해 확인합니다.",
    ],
    uses: ["금속 부품 보관·운송 포장", "수출 포장", "기계 부품 포장"],
    specs: [
      { label: "두께", value: null },
      { label: "폭", value: null },
      { label: "적용 금속", value: null },
    ],
    options: [{ label: "형태", values: null }],
    consultItems: ["적용 금속 종류", "보관 환경과 기간", "두께·폭·길이", "형태(롤·봉투)", "예상 수량"],
    keywords: ["방청", "VCI", "녹 방지", "금속 포장"],
    image: null,
    gallery: [],
    verified: false,
  },
  {
    slug: "opp-tape",
    name: "OPP 테이프",
    category: "tape",
    summary: "박스 봉함에 쓰는 대표적인 포장용 테이프",
    description: [
      "OPP 테이프는 박스 봉함과 일반 포장에 가장 많이 쓰이는 포장용 테이프입니다.",
      "폭과 길이, 색상, 인쇄 여부에 따라 사양이 달라지므로 사용 환경과 수량을 확인한 뒤 안내합니다.",
    ],
    uses: ["박스 봉함", "출고 포장", "일반 포장"],
    specs: [
      { label: "폭", value: null },
      { label: "길이", value: null },
    ],
    options: [
      { label: "색상", values: null },
      { label: "인쇄", values: null },
    ],
    consultItems: ["폭·길이", "색상(투명·황색 등)", "로고 인쇄 여부", "예상 수량"],
    keywords: ["OPP", "박스 테이프", "포장 테이프", "투명 테이프"],
    image: { src: "/samples/product-opp-tape.webp", alt: "완충재를 넣는 골판지 상자와 포장 테이프 롤 (샘플 이미지)", sample: true },
    gallery: [],
    verified: false,
  },
  {
    slug: "stretch-film",
    name: "스트레치필름",
    category: "wrap",
    summary: "팔레트 적재물을 감아 고정하고 보호하는 스트레치필름",
    description: [
      "스트레치필름은 팔레트에 쌓인 제품을 감아 고정하고 운송 중 흔들림과 먼지로부터 보호할 때 사용합니다.",
      "수작업인지 래핑기를 쓰는지, 적재물의 무게와 형태에 따라 맞는 폭과 두께가 달라지므로 상담을 통해 안내합니다.",
    ],
    uses: ["팔레트 적재물 고정", "운송 중 흔들림·이탈 방지", "먼지 차단"],
    specs: [
      { label: "폭", value: null },
      { label: "두께", value: null },
      { label: "길이", value: null },
    ],
    options: [{ label: "색상", values: null }],
    consultItems: ["작업 방식(수작업·래핑기)", "적재물 무게와 형태", "폭·두께·길이", "예상 수량"],
    keywords: ["스트레치", "랩", "팔레트", "스트레치 필름", "수동", "기계", "래핑기"],
    image: { src: "/samples/product-stretch-hand.webp", alt: "스트레치필름으로 감싼 팔레트 적재물 (샘플 이미지)", sample: true },
    gallery: [],
    verified: false,
  },
  {
    slug: "custom-packaging",
    name: "맞춤 포장자재 상담",
    category: "etc",
    summary: "목록에 없는 포장자재도 사용 목적을 알려주시면 상담합니다",
    description: [
      "찾으시는 포장자재가 목록에 없거나 정확한 품명을 모르셔도 괜찮습니다.",
      "포장 대상과 사용 환경, 현재 사용 중인 제품 사진이나 규격서를 알려주시면 공급 가능 여부를 확인해 안내해 드립니다.",
    ],
    uses: ["목록에 없는 포장자재", "기존 사용 제품 대체 검토", "신규 포장 방식 검토"],
    specs: [],
    options: [],
    consultItems: ["포장 대상과 사용 환경", "현재 사용 중인 제품 정보", "예상 수량", "희망 납기"],
    keywords: ["맞춤", "주문 제작", "기타", "상담"],
    image: { src: "/samples/product-custom.webp", alt: "창고에 쌓인 포장 상자 (샘플 이미지)", sample: true },
    gallery: [],
    verified: false,
  },
];
