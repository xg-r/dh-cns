import { PENDING_LABEL, privacyPolicy } from "@/content/privacy";

export function PendingBadge() {
  return (
    <span className="inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
      {PENDING_LABEL}
    </span>
  );
}

/** 개인정보 수집·이용 동의 요약표. 문의 폼과 처리방침 페이지에서 함께 사용한다. */
export function PrivacySummary() {
  const rows = [
    { label: "수집 목적", value: privacyPolicy.purpose },
    {
      label: "수집 항목",
      value: `필수: ${privacyPolicy.requiredItems.join(", ")} / 선택: ${privacyPolicy.optionalItems.join(", ")}`,
    },
    { label: "보유 기간", value: privacyPolicy.retentionPeriod },
  ];

  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-gray-200 last:border-0">
            <th scope="row" className="w-24 py-2.5 pr-3 text-left align-top font-semibold text-gray-700">
              {row.label}
            </th>
            <td className="py-2.5 text-gray-600">{row.value ?? <PendingBadge />}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
