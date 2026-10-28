"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { inquiryStatuses, type InquiryStatus } from "@/lib/inquiry/status";

interface InquiryActionsProps {
  status: InquiryStatus;
  internalNote: string | null;
}

/** 상태 변경과 내부 메모. 서버 연결 전이므로 저장되지 않으며 그 사실을 화면에 표시한다. */
export function InquiryActions({ status, internalNote }: InquiryActionsProps) {
  const [nextStatus, setNextStatus] = useState<InquiryStatus>(status);
  const [note, setNote] = useState(internalNote ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const dirty = nextStatus !== status || note !== (internalNote ?? "");

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage("서버가 연결되지 않아 변경 내용은 저장되지 않았습니다.");
      }}
    >
      <div>
        <label htmlFor="admin-status" className="text-sm font-semibold text-gray-800">
          처리 상태
        </label>
        <select
          id="admin-status"
          value={nextStatus}
          onChange={(e) => {
            setNextStatus(e.target.value as InquiryStatus);
            setMessage(null);
          }}
          className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-[15px] focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        >
          {(Object.keys(inquiryStatuses) as InquiryStatus[]).map((s) => (
            <option key={s} value={s}>
              {inquiryStatuses[s]}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-gray-500">
          기록 보호를 위해 문의 삭제 기능은 제공하지 않습니다. 필요 없는 문의는 ‘취소’로 변경하세요.
        </p>
      </div>
      <div>
        <label htmlFor="admin-note" className="text-sm font-semibold text-gray-800">
          내부 메모
        </label>
        <textarea
          id="admin-note"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setMessage(null);
          }}
          rows={4}
          maxLength={2000}
          placeholder="고객에게 공개되지 않는 담당자 메모"
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] leading-relaxed focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        />
      </div>
      <Button type="submit" disabled={!dirty} className="w-full">
        변경 내용 저장
      </Button>
      {message && (
        <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {message}
        </p>
      )}
    </form>
  );
}
