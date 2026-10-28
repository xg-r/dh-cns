import Link from "next/link";
import { Container } from "@/components/ui/container";
import { productCategories } from "@/content/categories";
import { site, telHref } from "@/content/site";
import { usesSampleImages } from "@/content/sample-credits";
import { Logo } from "./logo";
import { mainNav } from "./navigation";

type InfoItem = { label: string; value: string; href?: string };

export function SiteFooter() {
  const info = [
    site.representative && { label: "대표", value: site.representative },
    site.businessNumber && { label: "사업자등록번호", value: site.businessNumber },
    site.address && { label: "주소", value: site.address },
    site.phone && { label: "전화", value: site.phone, href: telHref(site.phone) },
    site.fax && { label: "팩스", value: site.fax },
    site.email && { label: "이메일", value: site.email, href: `mailto:${site.email}` },
  ].filter((v): v is InfoItem => Boolean(v));

  const links = [
    ...mainNav,
    ...(usesSampleImages ? [{ href: "/credits", label: "샘플 이미지 출처" }] : []),
  ];

  return (
    <footer className="bg-charcoal text-gray-400">
      <Container className="py-12 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <Logo tone="inverse" />

          <div className="flex-1 space-y-6">
            <ul className="flex flex-wrap items-center gap-y-2 text-[15px]">
              <li className="mr-5 border-r border-white/20 pr-5">
                <Link href="/privacy" className="font-semibold text-white hover:underline">
                  개인정보 처리방침
                </Link>
              </li>
              {links.map((item, i) => (
                <li key={item.href} className={i < links.length - 1 ? "mr-5 border-r border-white/20 pr-5" : undefined}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <nav aria-label="제품 카테고리">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {productCategories.map((c) => (
                  <li key={c.id}>
                    <Link href={`/products?category=${c.id}`} className="hover:text-white">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {info.length > 0 && (
              <dl className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
                {info.map((item) => (
                  <div key={item.label} className="flex gap-2">
                    <dt className="text-gray-500">{item.label}</dt>
                    <dd className="text-gray-300">
                      {item.href ? (
                        <a href={item.href} className="hover:text-white">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Copyright © {site.name}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
