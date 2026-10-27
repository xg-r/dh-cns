import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site, siteUrl } from "@/content/site";
import { baseOpenGraph } from "@/lib/seo";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | 산업용 포장자재 제조·가공 및 납품`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["산업용 포장자재", "산업용 비닐", "PE 비닐", "방청비닐", "OPP 테이프", "스트레치필름", site.name],
  openGraph: {
    ...baseOpenGraph,
    title: `${site.name} | 산업용 포장자재 제조·가공 및 납품`,
    description: site.description,
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#162b54",
};

/**
 * 스크롤 등장 효과를 켠다. 첫 화면을 그리기 전에 실행해 깜빡임을 막고,
 * 3초 안에 ScrollReveal 이 초기화되지 않으면(스크립트 로드 실패 등) 효과를 꺼서 내용이 숨지 않게 한다.
 */
const revealBootstrap = `(function(){var r=document.documentElement;r.classList.add("reveal-ready");setTimeout(function(){if(!r.hasAttribute("data-reveal-init"))r.classList.remove("reveal-ready")},3000)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: 인라인 스크립트가 하이드레이션 전에 <html> 에 reveal-ready 클래스·data-reveal-init 속성을 붙이기 때문이다.
    // <html> 요소 자신의 속성에만 적용된다.
    <html lang="ko" className={pretendard.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
