/**
 * 회사 소개·연혁·납품 이력 데이터.
 *
 * README 2절에서 확인된 이력만 기재한다. 월(month)이 확인되지 않은 항목은 null.
 * 거래처 명칭은 공개 승인(approved) 후에만 화면에 표시된다.
 */

export const historyCategories = {
  facility: "설비 확충",
  supply: "납품 계약",
  award: "인증 및 수상",
} as const;

export type HistoryCategory = keyof typeof historyCategories;

export interface HistoryItem {
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  category: HistoryCategory;
}

export interface ClientRecord {
  name: string;
  /** 고객사명 공개 승인 여부. 승인 전에는 화면에 노출하지 않는다. */
  approved: boolean;
}

export const clients: ClientRecord[] = [
  { name: "현대모비스", approved: false },
  { name: "현대·기아자동차", approved: false },
  { name: "대한항공", approved: false },
  { name: "삼성물산", approved: false },
  { name: "아시아나에어포트", approved: false },
  { name: "금호타이어", approved: false },
  { name: "SPC그룹", approved: false },
  { name: "존슨콘트롤즈오토모티브코리아", approved: false },
  { name: "베트남 세화비나", approved: false },
];

export const approvedClients = clients.filter((c) => c.approved);

/** 거래처명이 공개 승인된 경우에만 실명을, 아니면 대체 표현을 쓴다. */
function clientName(name: string, fallback: string): string {
  return approvedClients.some((c) => c.name === name) ? name : fallback;
}

export const history: HistoryItem[] = [
  {
    year: 2022,
    month: null,
    title: "모범납세자 표창",
    description: null,
    category: "award",
  },
  {
    year: 2021,
    month: null,
    title: "60mm 압출 설비 증설",
    description: "필름 생산을 위한 압출 설비를 추가로 갖췄습니다.",
    category: "facility",
  },
  {
    year: 2020,
    month: null,
    title: "GRS 인증 관련 이력",
    description: "GRS(Global Recycled Standard) 관련 인증 이력",
    category: "award",
  },
  {
    year: 2017,
    month: null,
    title: "제2공장 부지 및 건물 확보",
    description: "생산 공간 확대를 위해 제2공장 부지와 건물을 확보했습니다.",
    category: "facility",
  },
  {
    year: 2017,
    month: null,
    title: "기술평가 우수기업 인증",
    description: null,
    category: "award",
  },
  {
    year: 2017,
    month: null,
    title: "모범납세자 표창",
    description: null,
    category: "award",
  },
  {
    year: 2015,
    month: null,
    title: "100mm 압출기 추가 설비",
    description: "필름 생산을 위한 100mm 압출기를 추가로 도입했습니다.",
    category: "facility",
  },
  {
    year: 2014,
    month: null,
    title: `${clientName("현대모비스", "주요 거래처")} 우수업체 선정 및 수상`,
    description: null,
    category: "award",
  },
];

export interface Facility {
  year: number;
  title: string;
  description: string;
}

export const facilities: Facility[] = [
  {
    year: 2015,
    title: "100mm 압출기",
    description: "필름 압출 생산 설비를 추가 도입했습니다.",
  },
  {
    year: 2017,
    title: "제2공장",
    description: "제2공장 부지와 건물을 확보해 생산 공간을 넓혔습니다.",
  },
  {
    year: 2021,
    title: "60mm 압출 설비",
    description: "압출 설비를 증설해 생산 기반을 보강했습니다.",
  },
];

/** 납품 분야 — 거래처 실명 대신 공개 가능한 산업 분야 단위로 표시. image 는 샘플 사진이다. */
export const supplyIndustries = [
  { title: "자동차·부품", description: "완성차 및 자동차 부품 제조 현장", image: "/samples/industry-auto.webp" },
  { title: "항공·공항", description: "항공사 및 공항 운영 관련 현장", image: "/samples/industry-airport.webp" },
  { title: "건설·상사", description: "건설·종합상사 관련 현장", image: "/samples/industry-construction.webp" },
  { title: "타이어·소재", description: "타이어 및 산업 소재 제조 현장", image: "/samples/industry-tire.webp" },
  { title: "식품", description: "식품 제조·유통 현장", image: "/samples/industry-food.webp" },
  { title: "해외 법인", description: "베트남·멕시코 관련 법인 납품", image: "/samples/industry-port.webp" },
];

export const strengths = [
  {
    id: "extrusion",
    title: "자체 압출 설비 기반",
    description: "압출 설비를 갖추고 필름을 생산합니다. 2015년과 2021년 설비를 추가하며 생산 기반을 넓혀 왔습니다.",
  },
  {
    id: "plant",
    title: "제2공장 확보",
    description: "2017년 제2공장 부지와 건물을 확보해 생산 기반을 넓혔습니다.",
  },
  {
    id: "industries",
    title: "다양한 산업 납품 경험",
    description: "자동차 부품, 항공, 식품, 해외 법인 등 여러 산업 현장에 포장자재를 납품해 왔습니다.",
  },
  {
    id: "consulting",
    title: "용도·규격 맞춤 상담",
    description: "사용 목적과 요구 규격을 먼저 확인하고, 생산 가능 여부와 견적을 담당자가 직접 안내합니다.",
  },
];
