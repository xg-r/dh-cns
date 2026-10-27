import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { productCategories } from "@/content/categories";
import { site, telHref } from "@/content/site";

interface LinkItem {
  href: string;
  label: string;
}

const groups: Array<{ title: string; links: LinkItem[] }> = [
  {
    title: "견적 문의",
    links: [
      { href: "/contact", label: "견적 문의하기" },
      ...(site.phone ? [{ href: telHref(site.phone), label: `전화 ${site.phone}` }] : []),
      { href: "/privacy", label: "개인정보 처리방침" },
    ],
  },
  {
    title: "제품 안내",
    links: productCategories.map((c) => ({ href: `/products?category=${c.id}`, label: c.label })),
  },
  {
    title: "회사 소개",
    links: [
      { href: "/about#intro", label: "회사 개요" },
      { href: "/about#facility", label: "생산 기반" },
      { href: "/about#history", label: "연혁" },
      { href: "/about#awards", label: "인증·수상" },
    ],
  },
];

/** 푸터 위 모서리가 둥근 바로가기 카드 */
export function CtaBand() {
  return (
    <section aria-labelledby="shortcut-title" className="bg-sand pt-10 sm:pt-12">
      <Container>
        <div data-reveal className="rounded-t-[1.25rem] border border-b-0 border-gray-200 bg-white px-6 pt-8 pb-10 sm:px-14">
          <h2 id="shortcut-title" className="text-base font-bold sm:text-lg">
            견적 문의 · 제품 안내 · 회사 소개
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-gray-200">
            {groups.map((group) => (
              <div key={group.title} className="md:px-10 md:first:pl-0">
                <h3 className="text-base font-bold text-brand-900 sm:text-[17px]">{group.title}</h3>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] text-gray-900">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="inline-flex items-center gap-1 hover:text-accent-600 hover:underline">
                        {link.label}
                        {link.href === "/contact" && <ArrowUpRight aria-hidden className="size-4" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
