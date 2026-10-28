export const productCategories = [
  {
    id: "film",
    label: "비닐·필름",
    description: "PE 비닐, 방청비닐 등 산업용 비닐과 플라스틱 필름",
  },
  {
    id: "tape",
    label: "테이프",
    description: "박스 포장과 산업 현장에서 쓰이는 산업용 테이프",
  },
  {
    id: "wrap",
    label: "랩·스트레치필름",
    description: "팔레트 적재물 고정과 보호를 위한 랩·스트레치필름",
  },
  {
    id: "etc",
    label: "기타 포장자재",
    description: "그 밖의 산업용 포장자재와 맞춤 포장자재 상담",
  },
] as const;

export type ProductCategoryId = (typeof productCategories)[number]["id"];

export const categoryIds = productCategories.map((c) => c.id) as [
  ProductCategoryId,
  ...ProductCategoryId[],
];

export function getCategory(id: ProductCategoryId) {
  return productCategories.find((c) => c.id === id)!;
}

export function isCategoryId(value: unknown): value is ProductCategoryId {
  return typeof value === "string" && categoryIds.includes(value as ProductCategoryId);
}
