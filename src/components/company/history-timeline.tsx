import { historyCategories, type HistoryCategory, type HistoryItem } from "@/content/company";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";

const categoryStyles: Record<HistoryCategory, string> = {
  facility: "bg-brand-50 text-brand-700 ring-brand-200",
  supply: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  award: "bg-amber-50 text-amber-800 ring-amber-200",
};

export function HistoryCategoryBadge({ category }: { category: HistoryCategory }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        categoryStyles[category],
      )}
    >
      {historyCategories[category]}
    </span>
  );
}

function groupByYear(items: readonly HistoryItem[]): Array<[number, HistoryItem[]]> {
  const groups = new Map<number, HistoryItem[]>();
  for (const item of items) {
    groups.set(item.year, [...(groups.get(item.year) ?? []), item]);
  }
  return [...groups.entries()].sort(([a], [b]) => b - a);
}

/**
 * 연도별 세로 타임라인 (최신순).
 * 스크롤하면 연도 그룹마다 세로선이 위에서 아래로 그려지고, 항목 점이 켜지며 카드가 세워지듯 나타난다.
 * 데스크톱에서는 연도가 화면 위쪽에 고정되어 따라온다.
 */
export function HistoryTimeline({ items }: { items: readonly HistoryItem[] }) {
  return (
    <ol>
      {groupByYear(items).map(([year, entries]) => (
        <li key={year} className="grid sm:grid-cols-[10rem_1fr]">
          <div className="pb-4 sm:pb-0">
            <h3
              data-reveal="left"
              className="text-4xl font-bold text-brand-900 tabular-nums sm:sticky sm:top-36 sm:pt-6 sm:text-5xl"
            >
              {year}
            </h3>
          </div>

          <div
            data-reveal="line"
            className={cn(
              "relative pb-12 pl-8 sm:pl-12 [perspective:1200px]",
              "before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-gray-200",
              "after:absolute after:top-0 after:left-0 after:h-full after:w-0.5 after:-translate-x-1/4 after:origin-top after:bg-gradient-to-b after:from-brand-900 after:to-accent-600",
            )}
          >
            <ul className="space-y-4 sm:pt-4">
              {entries.map((entry, i) => (
                <li
                  key={`${entry.year}-${entry.title}`}
                  data-reveal="flip"
                  style={revealDelay(i + 1)}
                  className="relative"
                >
                  <span
                    aria-hidden
                    data-reveal="dot"
                    style={revealDelay(i + 1)}
                    className="absolute top-7 -left-8 z-10 size-4 -translate-x-1/2 rounded-full border-2 border-gray-300 bg-white ring-4 ring-white sm:-left-12"
                  />
                  <div className="border border-gray-200 bg-white px-6 py-5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-300/40 sm:px-8 sm:py-6">
                    <div className="flex items-center gap-2">
                      <HistoryCategoryBadge category={entry.category} />
                      {entry.month && (
                        <span className="text-sm font-medium text-gray-500 tabular-nums">{entry.month}월</span>
                      )}
                    </div>
                    <p className="mt-3 text-lg font-bold text-gray-900 sm:text-xl">{entry.title}</p>
                    {entry.description && <p className="mt-1 text-[15px] text-gray-600">{entry.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
