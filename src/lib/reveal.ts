import type { CSSProperties } from "react";

/** 목록 항목의 스크롤 등장 시차. index 번째 항목은 index × 90ms 늦게 나타난다. */
export function revealDelay(index: number): CSSProperties {
  return { "--reveal-i": index } as CSSProperties;
}
