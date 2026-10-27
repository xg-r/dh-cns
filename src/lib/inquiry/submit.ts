import type { InquiryData } from "./schema";

/**
 * 문의 제출 어댑터.
 *
 * 서버 API(DB 저장 + 이메일 알림)는 아직 연결되지 않았다.
 * - preview  : 디자인 확인용. 실제로 저장하지 않고 미리보기 완료 화면을 보여준다.
 * - disabled : 제출을 막고 연결 전임을 안내한다. (운영 환경 기본값)
 *
 * 서버 API 연결 시 이 파일의 submitInquiry 만 교체하면 된다.
 */
export type InquiryMode = "preview" | "disabled";

function resolveMode(): InquiryMode {
  const configured = process.env.NEXT_PUBLIC_INQUIRY_MODE;
  if (configured === "preview" || configured === "disabled") return configured;
  return process.env.NODE_ENV === "development" ? "preview" : "disabled";
}

export const inquiryMode: InquiryMode = resolveMode();

export interface InquiryReceipt {
  inquiryNumber: string;
  receivedAt: string;
  preview: boolean;
}

export type SubmitResult =
  | { ok: true; receipt: InquiryReceipt }
  | { ok: false; message: string };

export async function submitInquiry(data: InquiryData, files: readonly File[]): Promise<SubmitResult> {
  void data;
  void files;
  if (inquiryMode === "preview") {
    return {
      ok: true,
      receipt: { inquiryNumber: "DH-PREVIEW", receivedAt: new Date().toISOString(), preview: true },
    };
  }
  return {
    ok: false,
    message: "온라인 문의 접수가 아직 연결되지 않았습니다. 전화 또는 이메일로 문의해 주세요.",
  };
}
