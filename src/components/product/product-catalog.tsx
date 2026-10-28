"use client";

import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { Tilt } from "@/components/motion/tilt";
import { Button, ButtonLink } from "@/components/ui/button";
import { isCategoryId, productCategories, type ProductCategoryId } from "@/content/categories";
import { products } from "@/content/products";
import { cn } from "@/lib/cn";
import { filterProducts } from "@/lib/products";
import { revealDelay } from "@/lib/reveal";
import { ProductCard } from "./product-card";

/**
 * 현재 주소의 쿼리를 읽어 바꿀 값만 고친다.
 * useSearchParams 반영 전에 연달아 호출돼도(카테고리 클릭 직후 검색어 입력 등) 서로 덮어쓰지 않는다.
 */
function updateUrl(patch: { category?: ProductCategoryId | null; q?: string }) {
  const next = new URLSearchParams(window.location.search);
  if ("category" in patch) {
    if (patch.category) next.set("category", patch.category);
    else next.delete("category");
  }
  if ("q" in patch) {
    const q = patch.q?.trim();
    if (q) next.set("q", q);
    else next.delete("q");
  }
  const search = next.toString();
  window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
}

/**
 * URL(?category=&q=)을 기준으로 제품을 거른다. Suspense 안에서 렌더링해야 한다.
 * URL 이 기준이므로 링크 이동·뒤로 가기 후에도 필터가 주소와 어긋나지 않는다.
 */
export function ProductCatalog() {
  const params = useSearchParams();
  const category = params.get("category");
  return <ProductCatalogView category={isCategoryId(category) ? category : null} urlQuery={params.get("q") ?? ""} />;
}

interface ProductCatalogViewProps {
  category: ProductCategoryId | null;
  urlQuery: string;
}

export function ProductCatalogView({ category, urlQuery }: ProductCatalogViewProps) {
  // 입력창은 한글 조합(IME)이 끊기지 않도록 로컬 상태로 두고, URL 의 q 가 바깥에서 바뀌면 맞춘다.
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (urlQuery !== query.trim()) setQuery(urlQuery);
  }
  const searchId = useId();
  const results = filterProducts(products, { category, query });
  const activeLabel = productCategories.find((c) => c.id === category)?.label ?? "전체";

  const selectCategory = (next: ProductCategoryId | null) => updateUrl({ category: next });
  const changeQuery = (value: string) => {
    setQuery(value);
    updateUrl({ q: value });
  };
  const reset = () => {
    setQuery("");
    updateUrl({ category: null, q: "" });
  };

  const filters: Array<{ id: ProductCategoryId | null; label: string }> = [
    { id: null, label: "전체" },
    ...productCategories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="카테고리 필터" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2">
            {filters.map((f) => {
              const active = f.id === category;
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectCategory(f.id)}
                  className={cn(
                    "min-h-11 rounded-full px-4 text-[15px] font-semibold whitespace-nowrap transition-colors",
                    active
                      ? "bg-brand-800 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full lg:max-w-xs">
          <label htmlFor={searchId} className="sr-only">
            제품명 검색
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="제품명 또는 용도 검색"
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white pr-10 pl-10 text-[15px] placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => changeQuery("")}
              aria-label="검색어 지우기"
              className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-gray-400 hover:text-gray-700"
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{activeLabel}</span>
        {query.trim() && <> · ‘{query.trim()}’ 검색</>} 결과 {results.length}개
      </p>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <li key={p.slug} data-reveal style={revealDelay(i % 3)} className="flex">
              <Tilt max={4} glare={false} className="flex w-full">
                <ProductCard product={p} />
              </Tilt>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-900">조건에 맞는 제품을 찾지 못했습니다</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-gray-600">
            검색어를 바꾸거나 전체 제품을 확인해 보세요. 찾는 제품이 목록에 없어도 견적 문의로 상담할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button variant="secondary" onClick={reset}>
              전체 제품 보기
            </Button>
            <ButtonLink href="/contact">찾는 제품 문의하기</ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
