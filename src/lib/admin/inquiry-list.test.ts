import { describe, expect, it } from "vitest";
import { filterInquiries, toCsv } from "./inquiry-list";
import { sampleInquiries, type AdminInquiry } from "./sample-inquiries";

const base = { status: null, query: "", sort: "newest" as const };

describe("filterInquiries", () => {
  it("접수일 최신순·오래된순으로 정렬한다", () => {
    const newest = filterInquiries(sampleInquiries, base);
    const oldest = filterInquiries(sampleInquiries, { ...base, sort: "oldest" });
    expect(newest[0].createdAt >= newest[newest.length - 1].createdAt).toBe(true);
    expect(oldest.map((i) => i.id)).toEqual([...newest].reverse().map((i) => i.id));
  });

  it("상태로 거른다", () => {
    const result = filterInquiries(sampleInquiries, { ...base, status: "NEW" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((i) => i.status === "NEW")).toBe(true);
  });

  it("문의 번호와 제품명으로 검색한다", () => {
    expect(filterInquiries(sampleInquiries, { ...base, query: "0007" }).map((i) => i.id)).toEqual(["sample-07"]);
    expect(filterInquiries(sampleInquiries, { ...base, query: "opp" }).map((i) => i.id)).toEqual(["sample-06"]);
  });

  it("원본 배열을 변경하지 않는다", () => {
    const before = sampleInquiries.map((i) => i.id);
    filterInquiries(sampleInquiries, { ...base, sort: "oldest" });
    expect(sampleInquiries.map((i) => i.id)).toEqual(before);
  });
});

describe("toCsv", () => {
  it("BOM 과 헤더를 포함하고 따옴표를 이스케이프한다", () => {
    const item: AdminInquiry = { ...sampleInquiries[0], message: 'say "hi", ok' };
    const csv = toCsv([item]);
    expect(csv.startsWith("﻿\"문의번호\"")).toBe(true);
    expect(csv).toContain('"say ""hi"", ok"');
  });

  it("수식으로 해석될 수 있는 값을 무력화한다", () => {
    const item: AdminInquiry = { ...sampleInquiries[0], companyName: "=HYPERLINK(\"x\")" };
    expect(toCsv([item])).toContain("\"'=HYPERLINK");
  });

  it("빈 목록이면 헤더만 남는다", () => {
    expect(toCsv([]).split("\r\n")).toHaveLength(1);
  });
});

describe("toCsv formula guard", () => {
  it.each([" =1+1", "\n=1", "＝SUM(A1)", "+82", "@cmd"])("'%s' 를 무력화한다", (value) => {
    const item: AdminInquiry = { ...sampleInquiries[0], companyName: value };
    expect(toCsv([item])).toContain(`"'${value}"`);
  });
});
