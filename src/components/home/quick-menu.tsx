import { Building2, Disc3, Factory, FileText, History, Layers, LayoutGrid, Package } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { revealDelay } from "@/lib/reveal";

const items = [
  { href: "/contact", label: "견적 문의", Icon: FileText },
  { href: "/products", label: "전체 제품", Icon: LayoutGrid },
  { href: "/products?category=film", label: "비닐·필름", Icon: Layers },
  { href: "/products?category=tape", label: "테이프", Icon: Disc3 },
  { href: "/products?category=wrap", label: "스트레치필름", Icon: Package },
  { href: "/about#facility", label: "생산 기반", Icon: Factory },
  { href: "/about", label: "회사 소개", Icon: Building2 },
  { href: "/about#history", label: "연혁", Icon: History },
];

/** 히어로 아래 아이콘 바로가기 */
export function QuickMenu() {
  return (
    <nav aria-label="바로가기" className="border-b border-gray-200 bg-white">
      <Container>
        <ul className="grid grid-cols-4 gap-y-2 py-6 sm:py-8 lg:grid-cols-8">
          {items.map(({ href, label, Icon }, i) => (
            <li key={href} data-reveal style={revealDelay(i)}>
              <Link
                href={href}
                className="group flex flex-col items-center gap-2.5 py-2 text-[13px] font-medium text-gray-800 sm:text-sm"
              >
                <Icon
                  aria-hidden
                  strokeWidth={1.25}
                  className="size-8 text-gray-900 transition-[color,transform] duration-300 group-hover:-translate-y-1 group-hover:text-accent-600 sm:size-10"
                />
                <span className="group-hover:text-accent-600">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
