import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./container";

interface Crumb {
  href?: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
}

export function PageHeader({ title, description, breadcrumbs = [] }: PageHeaderProps) {
  return (
    <div className="border-b border-gray-200">
      <Container className="pt-6 pb-12 sm:pb-16">
        <nav aria-label="현재 위치">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-gray-500">
            <li>
              <Link href="/" className="flex items-center hover:text-gray-900">
                <House aria-hidden className="size-3.5" />
                <span className="sr-only">홈</span>
              </Link>
            </li>
            {breadcrumbs.map((c, i) => {
              const last = i === breadcrumbs.length - 1;
              return (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3.5 text-gray-400" />
                  {c.href && !last ? (
                    <Link href={c.href} className="hover:text-gray-900">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current={last ? "page" : undefined} className={last ? "text-gray-900" : undefined}>
                      {c.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="mt-10 animate-fade-up text-center motion-reduce:animate-none sm:mt-14">
          <h1 className="text-[2rem] leading-tight font-bold sm:text-5xl">{title}</h1>
          {description && (
            <p className="mx-auto mt-5 max-w-2xl text-[15px] text-gray-600 sm:text-base">{description}</p>
          )}
        </div>
      </Container>
    </div>
  );
}
