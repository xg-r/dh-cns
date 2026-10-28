"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/form-field";
import { Notice } from "@/components/ui/notice";
import { productCategories } from "@/content/categories";
import { products } from "@/content/products";
import { site, telHref } from "@/content/site";
import { getFieldErrors, inquirySchema, type InquiryData, type InquiryFieldErrors } from "@/lib/inquiry/schema";
import { inquiryMode, submitInquiry, type InquiryReceipt } from "@/lib/inquiry/submit";
import { AttachmentField } from "./attachment-field";
import { InquiryComplete } from "./inquiry-complete";
import { PrivacySummary } from "./privacy-summary";

const fieldId = (name: string) => `inquiry-${name}`;

function readForm(form: HTMLFormElement, needsConsultation: boolean) {
  const fd = new FormData(form);
  const text = (name: string) => {
    const value = fd.get(name);
    return typeof value === "string" ? value : undefined;
  };
  return {
    companyName: text("companyName"),
    contactName: text("contactName"),
    phone: text("phone") ?? "",
    email: text("email"),
    productCategory: text("productCategory"),
    productName: text("productName"),
    needsConsultation,
    specification: text("specification"),
    quantity: text("quantity"),
    desiredDeliveryDate: text("desiredDeliveryDate"),
    deliveryLocation: text("deliveryLocation"),
    message: text("message"),
    privacyConsent: fd.get("privacyConsent") === "on",
  };
}

const fieldLabels: Record<keyof InquiryFieldErrors, string> = {
  companyName: "회사명",
  contactName: "담당자명",
  phone: "연락처",
  email: "이메일",
  productCategory: "제품 카테고리",
  productName: "제품명",
  needsConsultation: "규격·수량 상담",
  specification: "희망 규격",
  quantity: "예상 수량",
  desiredDeliveryDate: "희망 납기",
  deliveryLocation: "납품 지역",
  message: "요청 내용",
  privacyConsent: "개인정보 수집·이용 동의",
};

interface InquiryFormProps {
  defaultCategory: string;
  defaultProductName: string;
}

export function InquiryForm({ defaultCategory, defaultProductName }: InquiryFormProps) {
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsConsultation, setNeedsConsultation] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{ receipt: InquiryReceipt; data: InquiryData } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const disabled = inquiryMode === "disabled";

  if (result) {
    return <InquiryComplete receipt={result.receipt} data={result.data} attachmentCount={files.length} />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    const parsed = inquirySchema.safeParse(readForm(event.currentTarget, needsConsultation));
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await submitInquiry(parsed.data, files);
      if (response.ok) setResult({ receipt: response.receipt, data: parsed.data });
      else setSubmitError(response.message);
    } catch {
      setSubmitError("문의를 보내는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const errorEntries = Object.entries(errors) as Array<[keyof InquiryFieldErrors, string]>;

  return (
    <form method="post" noValidate onSubmit={onSubmit} className="space-y-10" aria-describedby="inquiry-required-note">
      {inquiryMode === "preview" && (
        <Notice tone="warning" title="미리보기 모드">
          온라인 접수 서버가 아직 연결되지 않았습니다. 제출하면 완료 화면을 미리 볼 수 있지만, 문의와 첨부파일은 실제로
          전송·저장되지 않습니다.
        </Notice>
      )}
      {disabled && (
        <Notice tone="warning" title="온라인 접수 준비 중">
          현재 온라인 견적 문의 접수를 준비하고 있습니다.
          {site.phone && (
            <>
              {" "}
              <a href={telHref(site.phone)} className="font-semibold underline">
                {site.phone}
              </a>
              로 연락해 주세요.
            </>
          )}
          {site.email && (
            <>
              {" "}
              이메일:{" "}
              <a href={`mailto:${site.email}`} className="font-semibold underline">
                {site.email}
              </a>
            </>
          )}
        </Notice>
      )}

      {errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 focus:outline-none"
        >
          <p className="font-semibold">입력 내용을 확인해 주세요.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorEntries.map(([name, message]) => (
              <li key={name}>
                <a href={`#${fieldId(name)}`} className="underline underline-offset-2">
                  {fieldLabels[name]}
                </a>
                : {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p id="inquiry-required-note" className="text-sm text-gray-500">
        <span className="font-semibold text-red-600">필수</span> 항목은 연락처와 개인정보 동의뿐입니다. 나머지는 아는
        만큼만 적어 주세요.
      </p>

      {/* 접수 비활성화 상태에서는 입력·첨부를 모두 막아 동작하는 것처럼 보이지 않게 한다. */}
      <fieldset disabled={disabled} className="min-w-0 space-y-10 disabled:opacity-60">
        <fieldset className="min-w-0">
          <legend className="float-left mb-5 w-full text-lg font-bold text-gray-900">연락처 정보</legend>
          <div className="clear-both space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id={fieldId("companyName")}
                name="companyName"
                error={errors.companyName}
                label="회사명"
                autoComplete="organization"
                maxLength={100}
              />
              <TextField
                id={fieldId("contactName")}
                name="contactName"
                error={errors.contactName}
                label="담당자명"
                autoComplete="name"
                maxLength={50}
              />
              <TextField
                id={fieldId("phone")}
                name="phone"
                label="연락처"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="010-1234-5678"
                required
                error={errors.phone}
              />
              <TextField
                id={fieldId("email")}
                name="email"
                label="이메일"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                hint="견적서를 이메일로 받고 싶으시면 입력해 주세요."
                error={errors.email}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="min-w-0 border-t border-gray-200 pt-10">
          <legend className="float-left mb-5 w-full text-lg font-bold text-gray-900">제품 정보</legend>
          <div className="clear-both space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                id={fieldId("productCategory")}
                name="productCategory"
                error={errors.productCategory}
                label="제품 카테고리"
                defaultValue={defaultCategory}
              >
                <option value="">선택해 주세요</option>
                {productCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </SelectField>
              <TextField
                id={fieldId("productName")}
                name="productName"
                error={errors.productName}
                label="제품명"
                list="inquiry-product-options"
                defaultValue={defaultProductName}
                placeholder="예: 스트레치필름"
                maxLength={100}
              />
              <datalist id="inquiry-product-options">
                {products.map((p) => (
                  <option key={p.slug} value={p.name} />
                ))}
              </datalist>
            </div>

            <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <input
                type="checkbox"
                checked={needsConsultation}
                onChange={(e) => setNeedsConsultation(e.target.checked)}
                className="mt-1 size-5 shrink-0 accent-brand-800"
              />
              <span>
                <span className="block text-[15px] font-semibold text-gray-800">규격·수량을 아직 정하지 못했어요</span>
                <span className="mt-0.5 block text-sm text-gray-500">
                  사용 목적만 알려주시면 담당자가 적합한 규격과 수량을 함께 검토합니다.
                </span>
              </span>
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id={fieldId("specification")}
                name="specification"
                error={errors.specification}
                label="희망 규격"
                placeholder={needsConsultation ? "상담 후 결정" : "예: 두께 0.05mm, 폭 500mm"}
                disabled={needsConsultation}
                maxLength={500}
              />
              <TextField
                id={fieldId("quantity")}
                name="quantity"
                error={errors.quantity}
                label="예상 수량"
                placeholder={needsConsultation ? "상담 후 결정" : "예: 월 200롤"}
                disabled={needsConsultation}
                maxLength={100}
              />
              <TextField
                id={fieldId("desiredDeliveryDate")}
                name="desiredDeliveryDate"
                error={errors.desiredDeliveryDate}
                label="희망 납기"
                placeholder="예: 11월 말, 협의 가능"
                maxLength={100}
              />
              <TextField
                id={fieldId("deliveryLocation")}
                name="deliveryLocation"
                error={errors.deliveryLocation}
                label="납품 지역"
                placeholder="예: 경기도 화성시"
                autoComplete="address-level2"
                maxLength={100}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="min-w-0 border-t border-gray-200 pt-10">
          <legend className="float-left mb-5 w-full text-lg font-bold text-gray-900">추가 요청 사항</legend>
          <div className="clear-both space-y-5">
            <TextAreaField
              id={fieldId("message")}
              name="message"
              error={errors.message}
              label="요청 내용"
              rows={5}
              maxLength={2000}
              placeholder="사용 목적, 포장 대상, 현재 사용 중인 제품, 인쇄 필요 여부 등을 자유롭게 적어 주세요."
            />
            <AttachmentField files={files} onChange={setFiles} />
          </div>
        </fieldset>

        <fieldset className="min-w-0 border-t border-gray-200 pt-10">
          <legend className="float-left mb-4 w-full text-lg font-bold text-gray-900">개인정보 수집·이용 동의</legend>
          <div className="clear-both">
            <div className="rounded-lg border border-gray-200 px-4 py-2">
              <PrivacySummary />
            </div>
            <p className="mt-3 text-sm text-gray-500">
              동의를 거부할 수 있으나, 거부 시 견적 문의 접수가 제한됩니다. 자세한 내용은{" "}
              <Link href="/privacy" className="font-medium text-brand-800 underline underline-offset-2">
                개인정보 처리방침
              </Link>
              을 확인해 주세요.
            </p>
            <label
              htmlFor={fieldId("privacyConsent")}
              className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 text-[15px] font-semibold text-gray-800"
            >
              <input
                id={fieldId("privacyConsent")}
                type="checkbox"
                name="privacyConsent"
                aria-invalid={errors.privacyConsent ? true : undefined}
                aria-describedby={errors.privacyConsent ? `${fieldId("privacyConsent")}-error` : undefined}
                className="size-5 shrink-0 accent-brand-800"
              />
              개인정보 수집·이용에 동의합니다 <span className="text-xs text-red-600">필수</span>
            </label>
            {errors.privacyConsent && (
              <p id={`${fieldId("privacyConsent")}-error`} className="mt-1 text-sm font-medium text-red-600">
                {errors.privacyConsent}
              </p>
            )}
          </div>
        </fieldset>
      </fieldset>

      <div className="border-t border-gray-200 pt-8">
        {submitError && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </p>
        )}
        <Button type="submit" size="lg" disabled={submitting || disabled} className="w-full sm:w-auto sm:min-w-56">
          {submitting ? "보내는 중…" : "견적 문의 보내기"}
        </Button>
        <p className="mt-3 text-sm text-gray-500">
          문의 접수는 주문이나 구매 확정이 아닙니다. 담당자가 확인 후 연락드립니다.
        </p>
      </div>
    </form>
  );
}
