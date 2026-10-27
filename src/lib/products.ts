import { isCategoryId, type ProductCategoryId } from "@/content/categories";
import { products, type Product } from "@/content/products";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategoryId): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const others = products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** 공백·대소문자 차이를 무시하고 비교하기 위한 정규화 */
function normalize(value: string): string {
  return value.toLowerCase().replace(/[\s·()]/g, "");
}

export interface ProductFilter {
  category?: string | null;
  query?: string | null;
}

export function filterProducts(
  list: readonly Product[],
  { category, query }: ProductFilter,
): Product[] {
  const activeCategory = isCategoryId(category) ? category : null;
  const needle = normalize(query?.trim() ?? "");

  return list.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (!needle) return true;
    const haystack = [p.name, p.summary, ...p.keywords, ...p.uses].map(normalize);
    return haystack.some((text) => text.includes(needle));
  });
}

export function contactHref(product?: Pick<Product, "slug">): string {
  return product ? `/contact?product=${encodeURIComponent(product.slug)}` : "/contact";
}
