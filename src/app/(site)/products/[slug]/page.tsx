import { Check, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CtaBand } from "@/components/home/cta-band";
import { PRICE_NOTE, ProductCard } from "@/components/product/product-card";
import { ProductVisual } from "@/components/product/product-visual";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCategory } from "@/content/categories";
import { products } from "@/content/products";
import { site, telHref } from "@/content/site";
import { baseOpenGraph } from "@/lib/seo";
import { contactHref, getProductBySlug, getRelatedProducts } from "@/lib/products";

const UNCONFIRMED = "별도 문의";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const path = `/products/${product.slug}`;
  return {
    title: `${product.name} - ${getCategory(product.category).label}`,
    description: `${product.summary}. ${product.uses.join(", ")} 등에 사용합니다. 규격과 수량에 맞춰 견적을 안내합니다.`,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, url: path, title: product.name, description: product.summary },
  };
}

export default function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

function ProductDetailSkeleton() {
  return (
    <Container aria-busy className="grid gap-10 py-14 lg:grid-cols-2 lg:gap-14">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-100" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="h-6 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-28 w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    </Container>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelatedProducts(product);
  const images = product.image ? [product.image, ...product.gallery] : [];

  return (
    <>
      <div className="border-b border-gray-200 bg-gray-50">
        <Container className="py-4">
          <nav aria-label="현재 위치">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-900">
                  홈
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/products" className="hover:text-gray-900">
                  제품안내
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/products?category=${category.id}`} className="hover:text-gray-900">
                  {category.label}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-gray-700">
                {product.name}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-14">
        <div>
          <ProductVisual
            image={product.image}
            category={product.category}
            name={product.name}
            preload
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rounded-2xl border border-gray-200"
          />
          {images.length > 1 && (
            <ul className="mt-3 grid grid-cols-4 gap-3">
              {images.map((img) => (
                <li key={img.src}>
                  <ProductVisual
                    image={img}
                    category={product.category}
                    name={product.name}
                    sizes="120px"
                    className="rounded-lg border border-gray-200"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-600">{category.label}</p>
          <h1 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg text-gray-600">{product.summary}</p>

          <div className="mt-6 rounded-xl bg-gray-50 px-5 py-4">
            <p className="text-sm font-medium text-gray-500">가격</p>
            <p className="mt-0.5 text-lg font-bold text-gray-900">{PRICE_NOTE}</p>
            <p className="mt-1 text-sm text-gray-600">
              생산 가능 여부, 최소 주문 수량, 단가와 납기는 담당자 확인 후 안내해 드립니다.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={contactHref(product)} size="lg" className="sm:flex-1">
              이 제품 견적 문의하기
            </ButtonLink>
            {site.phone && (
              <a href={telHref(site.phone)} className={buttonStyles({ variant: "secondary", size: "lg" })}>
                <Phone aria-hidden className="size-4" />
                전화 상담
              </a>
            )}
          </div>

          <section aria-labelledby="consult-title" className="mt-8 border-t border-gray-200 pt-6">
            <h2 id="consult-title" className="text-base font-bold">
              상담 시 확인하는 항목
            </h2>
            <p className="mt-1 text-sm text-gray-500">정확히 모르셔도 문의할 수 있습니다.</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.consultItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-gray-700">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>

      <div className="border-t border-gray-200">
        <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div className="space-y-12">
            <section aria-labelledby="desc-title">
              <h2 id="desc-title" className="text-xl font-bold">
                제품 설명
              </h2>
              <div className="mt-4 space-y-3 text-base text-gray-700">
                {product.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="uses-title">
              <h2 id="uses-title" className="text-xl font-bold">
                주요 용도
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.uses.map((use) => (
                  <li key={use} className="rounded-full bg-brand-50 px-3.5 py-1.5 text-[15px] font-medium text-brand-800">
                    {use}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-10">
            <SpecTable
              id="spec-title"
              title="규격"
              rows={product.specs.map((s) => ({ label: s.label, value: s.value }))}
            />
            <SpecTable
              id="option-title"
              title="선택 옵션"
              rows={product.options.map((o) => ({ label: o.label, value: o.values?.join(", ") ?? null }))}
            />
          </div>
        </Container>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-gray-200 bg-gray-50 py-14 sm:py-20">
          <Container>
            <h2 id="related-title" className="text-2xl font-bold">
              관련 제품
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug} className="flex">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}

interface SpecTableProps {
  id: string;
  title: string;
  rows: Array<{ label: string; value: string | null }>;
}

function SpecTable({ id, title, rows }: SpecTableProps) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-xl font-bold">
        {title}
      </h2>
      {rows.length > 0 ? (
        <table className="mt-4 w-full border-t-2 border-gray-900 text-[15px]">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-gray-200">
                <th scope="row" className="w-1/3 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
                  {row.label}
                </th>
                <td className={row.value ? "px-4 py-3 text-gray-900" : "px-4 py-3 text-gray-500"}>
                  {row.value ?? UNCONFIRMED}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-[15px] text-gray-600">
          사용 목적에 맞춰 상담 후 안내해 드립니다.
        </p>
      )}
    </section>
  );
}
