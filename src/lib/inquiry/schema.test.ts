import { describe, expect, it } from "vitest";
import { ATTACHMENT_MAX_BYTES, checkAttachment, getFieldErrors, inquirySchema } from "./schema";

const valid = { phone: "010-1234-5678", privacyConsent: true };

describe("inquirySchema", () => {
  it("연락처와 동의만으로 통과한다", () => {
    const result = inquirySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("빈 선택 항목은 undefined 로 정리한다", () => {
    const result = inquirySchema.parse({ ...valid, companyName: "  ", email: "", productCategory: "" });
    expect(result.companyName).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.productCategory).toBeUndefined();
  });

  it.each([
    "01012345678",
    "02-123-4567",
    "031-1234-5678",
    "0505-123-4567",
    "1588-1234",
    "(02) 123-4567",
    "010.1234.5678",
    "+82 10-1234-5678",
  ])("유효한 연락처 %s", (phone) => {
    expect(inquirySchema.safeParse({ ...valid, phone }).success).toBe(true);
  });

  it.each(["", "abc", "1234", "010-1234-5678-9999", "010-12ab-5678", "010/1234/5678"])(
    "잘못된 연락처 '%s' 는 거부한다",
    (phone) => {
      const result = inquirySchema.safeParse({ ...valid, phone });
      expect(result.success).toBe(false);
      if (!result.success) expect(getFieldErrors(result.error).phone).toBeTruthy();
    },
  );

  it("개인정보 동의가 없으면 거부한다", () => {
    const result = inquirySchema.safeParse({ ...valid, privacyConsent: false });
    expect(result.success).toBe(false);
    if (!result.success) expect(getFieldErrors(result.error).privacyConsent).toContain("동의");
  });

  it("잘못된 이메일과 카테고리를 거부한다", () => {
    const result = inquirySchema.safeParse({ ...valid, email: "not-an-email", productCategory: "food" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = getFieldErrors(result.error);
      expect(errors.email).toBeTruthy();
      expect(errors.productCategory).toBeTruthy();
    }
  });

  it("최대 길이를 넘는 요청 사항을 거부한다", () => {
    expect(inquirySchema.safeParse({ ...valid, message: "가".repeat(2001) }).success).toBe(false);
  });
});

describe("checkAttachment", () => {
  it("허용 형식·크기의 파일을 통과시킨다", () => {
    expect(checkAttachment({ name: "a.pdf", size: 1000, type: "application/pdf" }).ok).toBe(true);
    expect(checkAttachment({ name: "a.png", size: ATTACHMENT_MAX_BYTES, type: "image/png" }).ok).toBe(true);
  });

  it("허용되지 않는 형식을 거부한다", () => {
    expect(checkAttachment({ name: "a.exe", size: 10, type: "application/x-msdownload" }).ok).toBe(false);
    expect(checkAttachment({ name: "a", size: 10, type: "" }).ok).toBe(false);
  });

  it("10MB 를 넘는 파일을 거부한다", () => {
    expect(checkAttachment({ name: "big.jpg", size: ATTACHMENT_MAX_BYTES + 1, type: "image/jpeg" }).ok).toBe(false);
  });
});
