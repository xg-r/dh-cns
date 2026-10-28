import type { Metadata } from "next";
import { site } from "@/content/site";

/** 하위 페이지가 openGraph 를 지정하면 루트 값이 통째로 대체되므로 공통 값을 함께 넣는다. */
export const baseOpenGraph = {
  type: "website",
  locale: "ko_KR",
  siteName: site.name,
} as const;

interface PageMetadataInput {
  path: string;
  title: string;
  description: string;
}

export function pageMetadata({ path, title, description }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, url: path, title, description },
  };
}
