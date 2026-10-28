"use client";

import Link from "next/link";
import { useState } from "react";
import { Tilt } from "@/components/motion/tilt";
import { ProductVisual } from "@/components/product/product-visual";
import { getCategory, productCategories, type ProductCategoryId } from "@/content/categories";
import type { Product } from "@/content/products";
import { cn } from "@/lib/cn";

const tabs: Array<{ id: ProductCategoryId | null; label: string }> = [
  { id: null, label: "전체" },
  ...productCategories.map((c) => ({ id: c.id, label: c.label })),
];

const SIDE_ITEMS = 2;

/** 사진 있는 제품 우선. 선택한 카테고리 제품을 앞에 두고 모자라면 다른 제품으로 채운다. */
function pickItems(products: readonly Product[], tab: ProductCategoryId | null): Product[] {
  const byImage = [...products].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
  if (tab === null) return byImage.slice(0, SIDE_ITEMS + 1);
  const inTab = byImage.filter((p) => p.category === tab);
  const rest = byImage.filter((p) => p.category !== tab);
  return [...inTab, ...rest].slice(0, SIDE_ITEMS + 1);
}

/** 큰 대표 제품 이미지 + 카테고리 탭 + 보조 제품 2개 */
export function ProductShowcase({ products }: { products: readonly Product[] }) {
  const [tab, setTab] = useState<ProductCategoryId | null>(null);
  const [featured, ...others] = pickItems(products, tab);
  if (!featured) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      <div data-reveal="left">
        <Tilt max={6}>
          <Link href={`/products/${featured.slug}`} className="group relative block overflow-hidden" tabIndex={-1}>
            <span className="absolute top-0 left-0 z-10 grid h-14 min-w-14 place-items-center bg-accent-600 px-3 text-lg font-bold text-white">
              {getCategory(featured.category).label}
            </span>
            <div key={featured.slug} className="animate-fade-in motion-reduce:animate-none">
              <ProductVisual
                image={featured.image}
                category={featured.category}
                name={featured.name}
                sizes="(min-width: 1024px) 576px, 100vw"
                className="aspect-[1/1.05] transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </Link>
        </Tilt>
      </div>

      <div data-reveal="right" className="flex min-w-0 flex-col">
        <div role="group" aria-label="제품 카테고리" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <ul className="flex w-max items-center text-[15px]">
            {tabs.map((t, i) => {
              const active = t.id === tab;
              return (
                <li
                  key={t.label}
                  className={cn("flex items-center", i > 0 && "before:mx-4 before:h-3 before:w-px before:bg-gray-300")}
                >
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "min-h-11 whitespace-nowrap",
                      active ? "font-semibold text-accent-600" : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p aria-live="polite" className="sr-only">
          {tabs.find((t) => t.id === tab)?.label} 탭, 대표 제품 {featured.name}
        </p>
        <div key={featured.slug} className="animate-fade-up motion-reduce:animate-none">
          <h3 className="mt-6 text-[1.75rem] leading-tight font-bold sm:text-[2.25rem]">
            <Link href={`/products/${featured.slug}`} className="hover:text-brand-700">
              {featured.name}
            </Link>
          </h3>
          <p className="mt-4 text-base text-gray-600">{featured.summary}</p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 lg:mt-auto">
          {others.map((p, i) => (
            <li
              key={`${tab}-${p.slug}`}
              className="animate-fade-up motion-reduce:animate-none"
              style={{ animationDelay: `${120 + i * 100}ms` }}
            >
              <Link href={`/products/${p.slug}`} className="group block">
                <span className="block overflow-hidden">
                  <ProductVisual
                    image={p.image}
                    category={p.category}
                    name={p.name}
                    sizes="(min-width: 1024px) 260px, 50vw"
                    className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 block text-[15px] font-bold text-gray-900 group-hover:text-accent-600 sm:text-base">
                  {p.name}
                </span>
                {tab !== null && p.category !== tab && (
                  <span className="mt-0.5 block text-xs text-gray-500">다른 제품군 · {getCategory(p.category).label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
