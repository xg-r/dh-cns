"use client";

import { useState } from "react";
import { historyCategories, type HistoryCategory, type HistoryItem } from "@/content/company";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";

/** 카테고리 칩으로 거르는 연혁 카드 목록 (최신순) */
export function HistoryHighlights({ items }: { items: readonly HistoryItem[] }) {
  const [category, setCategory] = useState<HistoryCategory | null>(null);
  const used = new Set(items.map((i) => i.category));
  const chips: Array<{ id: HistoryCategory | null; label: string }> = [
    { id: null, label: "#전체" },
    ...(Object.keys(historyCategories) as HistoryCategory[])
      .filter((id) => used.has(id))
      .map((id) => ({ id, label: `#${historyCategories[id]}` })),
  ];
  const visible = items.filter((i) => category === null || i.category === category);

  return (
    <div>
      <div role="group" aria-label="연혁 분류" className="flex flex-wrap justify-center gap-2">
        {chips.map((chip) => {
          const active = chip.id === category;
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(chip.id)}
              className={cn(
                "min-h-10 rounded-full px-4 text-[15px] font-medium transition-colors",
                active ? "bg-accent-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <ol className="mt-10 grid gap-px border border-gray-200 bg-gray-200 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((item, i) => (
          <li
            key={`${category}-${item.year}-${item.title}`}
            data-reveal="flip"
            style={revealDelay(i % 4)}
            className="flex flex-col bg-white px-6 py-7 hover:bg-sand"
          >
            <span className="text-3xl font-bold text-brand-900 tabular-nums">
              {item.year}
              {item.month && <span className="ml-1 text-lg">.{String(item.month).padStart(2, "0")}</span>}
            </span>
            <span className="mt-4 text-[13px] font-semibold text-accent-600">{historyCategories[item.category]}</span>
            <span className="mt-1 text-[17px] font-bold text-gray-900">{item.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
