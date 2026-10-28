import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCategory } from "@/content/categories";
import type { Product } from "@/content/products";
import { contactHref } from "@/lib/products";
import { ProductVisual } from "./product-visual";

export const PRICE_NOTE = "규격 및 수량에 따라 견적";

export function ProductCard({ product, headingLevel = "h3" }: { product: Product; headingLevel?: "h2" | "h3" }) {
  const category = getCategory(product.category);
  const detailHref = `/products/${product.slug}`;
  const Heading = headingLevel;

  return (
    <article className="group relative flex w-full flex-col bg-white">
      <div className="overflow-hidden">
        <ProductVisual
          image={product.image}
          category={product.category}
          name={product.name}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[13px] font-semibold text-accent-600">{category.label}</p>
        <Heading className="mt-1.5 text-lg leading-snug font-bold sm:text-xl">
          <Link href={detailHref} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{product.summary}</p>

        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex gap-3">
            <dt className="w-10 shrink-0 text-gray-500">용도</dt>
            <dd className="text-gray-800">{product.uses.slice(0, 3).join(" · ")}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-10 shrink-0 text-gray-500">상담</dt>
            <dd className="text-gray-800">{product.consultItems.slice(0, 3).join(" · ")}</dd>
          </div>
        </dl>

        <p className="mt-4 border-t border-gray-200 pt-4 text-base font-bold text-gray-900">{PRICE_NOTE}</p>

        <div className="mt-auto flex gap-2 pt-4">
          <Link
            href={contactHref(product)}
            className="relative z-10 inline-flex min-h-11 flex-1 items-center justify-center bg-brand-900 px-4 text-[15px] font-medium text-white transition-colors hover:bg-brand-700"
          >
            견적 문의
          </Link>
          <span
            aria-hidden
            className="inline-flex min-h-11 items-center gap-0.5 border border-gray-300 px-4 text-[15px] font-medium text-gray-800 transition-colors group-hover:border-gray-900"
          >
            상세
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
