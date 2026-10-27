import { z } from "zod";
import { categoryIds } from "@/content/categories";

/**
 * 견적 문의 입력 스키마.
 * 클라이언트 검증에 사용하며, 서버 API 연결 시 동일 스키마로 재검증한다.
 */

export const ATTACHMENT_MAX_FILES = 3;
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;
export const ATTACHMENT_ACCEPT_LABEL = "JPG, PNG, WEBP, PDF";

/** 국내 일반·대표번호(1588 등)·국제번호를 허용한다. 구분 기호는 하이픈·공백·괄호·점. */
const PHONE_CHARS = /^\+?[0-9\s\-().]+$/;

function isPhoneNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "").length;
  return PHONE_CHARS.test(value) && digits >= 8 && digits <= 13;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `${max}자 이내로 입력해 주세요.` })
    .optional()
    .transform((v) => (v ? v : undefined));

export const inquirySchema = z.object({
  companyName: optionalText(100),
  contactName: optionalText(50),
  phone: z
    .string()
    .trim()
    .min(1, { error: "연락처를 입력해 주세요." })
    .refine(isPhoneNumber, {
      error: "연락처 형식을 확인해 주세요. 예: 010-1234-5678",
    }),
  email: z
    .union([z.literal(""), z.email({ error: "이메일 형식을 확인해 주세요." })])
    .optional()
    .transform((v) => (v ? v : undefined)),
  productCategory: z
    .union([z.literal(""), z.enum(categoryIds)])
    .optional()
    .transform((v) => (v ? v : undefined)),
  productName: optionalText(100),
  needsConsultation: z.boolean().default(false),
  specification: optionalText(500),
  quantity: optionalText(100),
  desiredDeliveryDate: optionalText(100),
  deliveryLocation: optionalText(100),
  message: optionalText(2000),
  privacyConsent: z.literal(true, {
    error: "개인정보 수집·이용에 동의해 주셔야 문의를 남길 수 있습니다.",
  }),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryData = z.output<typeof inquirySchema>;

export type InquiryFieldErrors = Partial<Record<keyof InquiryInput, string>>;

export function getFieldErrors(error: z.ZodError): InquiryFieldErrors {
  const result: InquiryFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof InquiryInput | undefined;
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}

export interface AttachmentCheck {
  ok: boolean;
  message?: string;
}

export function checkAttachment(file: { name: string; size: number; type: string }): AttachmentCheck {
  if (!(ATTACHMENT_ACCEPT as readonly string[]).includes(file.type)) {
    return { ok: false, message: `${file.name}: ${ATTACHMENT_ACCEPT_LABEL} 파일만 첨부할 수 있습니다.` };
  }
  if (file.size > ATTACHMENT_MAX_BYTES) {
    return { ok: false, message: `${file.name}: 파일 크기는 10MB 이하여야 합니다.` };
  }
  return { ok: true };
}
