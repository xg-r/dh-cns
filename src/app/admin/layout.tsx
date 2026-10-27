import type { Metadata } from "next";
import Link from "next/link";
import { Notice } from "@/components/ui/notice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { default: "문의 관리", template: `%s | ${site.name} 관리자` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="font-bold text-gray-900">
            {site.name} 관리자
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            홈페이지로
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Notice tone="warning" title="화면 미리보기 · 샘플 데이터">
          관리자 인증과 문의 DB가 아직 연결되지 않았습니다. 표시되는 문의는 디자인 확인용 샘플이며, 상태 변경과 메모는
          저장되지 않습니다.
        </Notice>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
