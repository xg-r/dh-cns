import { describe, expect, it } from "vitest";
import { products } from "@/content/products";
import { contactHref, filterProducts, getProductBySlug, getRelatedProducts } from "./products";

describe("filterProducts", () => {
  it("필터가 없으면 전체 제품을 반환한다", () => {
    expect(filterProducts(products, {})).toHaveLength(products.length);
  });

  it("카테고리로 거른다", () => {
    const result = filterProducts(products, { category: "tape" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === "tape")).toBe(true);
  });

  it("알 수 없는 카테고리는 무시한다", () => {
    expect(filterProducts(products, { category: "unknown" })).toHaveLength(products.length);
    expect(filterProducts(products, { category: null })).toHaveLength(products.length);
  });

  it("제품명·키워드를 공백과 대소문자 구분 없이 검색한다", () => {
    expect(filterProducts(products, { query: "opp" }).map((p) => p.slug)).toContain("opp-tape");
    expect(filterProducts(products, { query: "스트레치 필름" }).map((p) => p.slug)).toContain("stretch-film");
    expect(filterProducts(products, { query: "VCI" }).map((p) => p.slug)).toEqual(["vci-film"]);
  });

  it("카테고리와 검색어를 함께 적용한다", () => {
    expect(filterProducts(products, { category: "film", query: "테이프" })).toEqual([]);
  });

  it("검색 결과가 없으면 빈 배열을 반환한다", () => {
    expect(filterProducts(products, { query: "존재하지않는제품" })).toEqual([]);
  });

  it("공백뿐인 검색어는 무시한다", () => {
    expect(filterProducts(products, { query: "   " })).toHaveLength(products.length);
  });
});

describe("product lookup", () => {
  it("slug 로 제품을 찾고, 없으면 undefined", () => {
    expect(getProductBySlug("opp-tape")?.name).toBe("OPP 테이프");
    expect(getProductBySlug("nope")).toBeUndefined();
  });

  it("관련 제품은 같은 카테고리를 우선하고 자기 자신을 제외한다", () => {
    const product = getProductBySlug("pe-film")!;
    const related = getRelatedProducts(product, 3);
    expect(related).toHaveLength(3);
    expect(related.map((p) => p.slug)).not.toContain(product.slug);
    expect(related[0].category).toBe("film");
  });

  it("문의 링크에 제품 slug 를 담는다", () => {
    expect(contactHref({ slug: "vci-film" })).toBe("/contact?product=vci-film");
    expect(contactHref()).toBe("/contact");
  });
});

describe("product data", () => {
  it("slug 가 중복되지 않는다", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
