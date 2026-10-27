"use client";

import { FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_ACCEPT_LABEL,
  ATTACHMENT_MAX_FILES,
  checkAttachment,
} from "@/lib/inquiry/schema";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

interface AttachmentFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function AttachmentField({ files, onChange }: AttachmentFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const nextErrors: string[] = [];
    const accepted: File[] = [];
    for (const file of Array.from(list)) {
      const check = checkAttachment(file);
      if (!check.ok) nextErrors.push(check.message!);
      else accepted.push(file);
    }
    const room = ATTACHMENT_MAX_FILES - files.length;
    if (accepted.length > room) {
      nextErrors.push(`첨부파일은 최대 ${ATTACHMENT_MAX_FILES}개까지 올릴 수 있습니다.`);
    }
    onChange([...files, ...accepted.slice(0, Math.max(0, room))]);
    setErrors(nextErrors);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    setErrors([]);
  };

  const full = files.length >= ATTACHMENT_MAX_FILES;

  return (
    <div>
      <p id={`${id}-label`} className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-800">
        제품 사진 또는 규격서
        <span className="text-xs font-normal text-gray-400">선택</span>
      </p>
      <p id={`${id}-hint`} className="mt-1 text-sm text-gray-500">
        현재 사용 중인 제품 사진이나 규격서가 있으면 상담이 빨라집니다. {ATTACHMENT_ACCEPT_LABEL} · 파일당 10MB · 최대{" "}
        {ATTACHMENT_MAX_FILES}개
      </p>

      <label
        htmlFor={id}
        className={
          full
            ? "mt-3 flex min-h-14 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 text-[15px] text-gray-400"
            : "mt-3 flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-[15px] font-medium text-gray-700 transition-colors hover:border-brand-400 hover:bg-brand-50/50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600"
        }
      >
        <Paperclip aria-hidden className="size-4" />
        {full ? "첨부 가능한 개수를 모두 채웠습니다" : "파일 선택"}
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          disabled={full}
          accept={ATTACHMENT_ACCEPT.join(",")}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          onChange={(e) => addFiles(e.target.files)}
          className="sr-only"
        />
      </label>

      {errors.length > 0 && (
        <ul role="alert" className="mt-2 space-y-1 text-sm font-medium text-red-600">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => {
            const Icon = file.type.startsWith("image/") ? ImageIcon : FileText;
            return (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 py-2 pr-2 pl-3"
              >
                <Icon aria-hidden className="size-5 shrink-0 text-gray-500" />
                <span className="min-w-0 flex-1 truncate text-sm text-gray-800">{file.name}</span>
                <span className="shrink-0 text-xs text-gray-500 tabular-nums">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`${file.name} 첨부 삭제`}
                  className="grid size-9 shrink-0 place-items-center rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
