import { expect, test, type Page } from "@playwright/test";
import sampleCredits from "../src/content/sample-credits.json";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 768;

test.describe("주요 페이지", () => {
  const pages = [
    { path: "/", heading: /산업 현장을 이해하는/ },
    { path: "/products", heading: "제품안내" },
    { path: "/products/opp-tape", heading: "OPP 테이프" },
    { path: "/about", heading: "회사소개" },
    { path: "/contact", heading: "견적 문의" },
    { path: "/privacy", heading: "개인정보 처리방침" },
  ];

  for (const { path, heading } of pages) {
    test(`${path} 가 오류 없이 표시되고 가로 스크롤이 없다`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page).toHaveTitle(/대흥CNS/);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test("존재하지 않는 제품과 URL 은 404 안내를 보여준다", async ({ page }) => {
    for (const path of ["/products/not-a-product", "/no-such-page"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: "요청하신 페이지를 찾을 수 없습니다" })).toBeVisible();
      await expect(page.getByRole("link", { name: "제품안내 보기" })).toBeVisible();
    }
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
  });

  test("sitemap.xml 과 robots.txt 를 제공한다", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("/products/opp-tape");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Disallow: /admin");
  });
});

test.describe("제품 탐색", () => {
  test("카테고리 필터와 검색이 동작한다", async ({ page }) => {
    await page.goto("/products");
    const cards = page.locator("main article");
    const total = await cards.count();
    expect(total).toBeGreaterThan(4);

    await page.getByRole("button", { name: "테이프", exact: true }).click();
    await expect(page).toHaveURL(/category=tape/);
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("테이프");

    await page.getByRole("button", { name: "전체", exact: true }).click();
    await page.getByLabel("제품명 검색").fill("방청");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("방청비닐");

    await page.getByLabel("제품명 검색").fill("없는제품이름");
    await expect(page.getByText("조건에 맞는 제품을 찾지 못했습니다")).toBeVisible();
    await page.getByRole("button", { name: "전체 제품 보기" }).click();
    await expect(cards).toHaveCount(total);
  });

  test("URL 의 카테고리 파라미터로 진입하면 필터가 적용된다", async ({ page }) => {
    await page.goto("/products?category=wrap");
    await expect(page.getByRole("button", { name: "랩·스트레치필름" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("main article").first()).toContainText("랩·스트레치필름");
  });

  test("가격 대신 견적 안내 문구를 표시한다", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText("규격 및 수량에 따라 견적").first()).toBeVisible();
  });

  test("제품 상세에서 문의하면 제품 정보가 폼에 채워진다", async ({ page }) => {
    await page.goto("/products/vci-film");
    await page.getByRole("link", { name: "이 제품 견적 문의하기" }).click();
    await expect(page).toHaveURL(/\/contact\?product=vci-film/);
    await expect(page.locator("#inquiry-productName")).toHaveValue("방청비닐");
    await expect(page.locator("#inquiry-productCategory")).toHaveValue("film");
  });

  test("제품 카드의 견적 문의 버튼이 해당 제품으로 연결된다", async ({ page }) => {
    await page.goto("/products?category=tape");
    await page.locator("main article").filter({ hasText: "OPP 테이프" }).getByRole("link", { name: "견적 문의" }).click();
    await expect(page.locator("#inquiry-productName")).toHaveValue("OPP 테이프");
  });
});

test.describe("견적 문의", () => {
  test("개인정보 동의 없이는 접수되지 않는다", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("#inquiry-phone").fill("010-1234-5678");
    await page.getByRole("button", { name: "견적 문의 보내기" }).click();
    await expect(page.getByText("입력 내용을 확인해 주세요.")).toBeVisible();
    await expect(page.getByRole("link", { name: "개인정보 수집·이용 동의" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /접수 완료 화면 미리보기/ })).toHaveCount(0);
  });

  test("잘못된 연락처는 오류를 표시한다", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("#inquiry-phone").fill("12ab");
    await page.locator("#inquiry-privacyConsent").check();
    await page.getByRole("button", { name: "견적 문의 보내기" }).click();
    await expect(page.getByText("연락처 형식을 확인해 주세요.").first()).toBeVisible();
    await expect(page.locator("#inquiry-phone")).toHaveAttribute("aria-invalid", "true");
  });

  test("규격·수량 미정 체크 시 해당 입력이 비활성화된다", async ({ page }) => {
    await page.goto("/contact");
    await page.getByText("규격·수량을 아직 정하지 못했어요").click();
    await expect(page.locator("#inquiry-specification")).toBeDisabled();
    await expect(page.locator("#inquiry-quantity")).toBeDisabled();
  });

  test("허용되지 않는 첨부파일은 거부한다", async ({ page }) => {
    await page.goto("/contact");
    await page.locator('input[type="file"]').setInputFiles({
      name: "virus.exe",
      mimeType: "application/x-msdownload",
      buffer: Buffer.from("x"),
    });
    await expect(page.getByText("virus.exe: JPG, PNG, WEBP, PDF 파일만 첨부할 수 있습니다.")).toBeVisible();
  });

  test("미리보기 모드 제출 시 완료 화면과 미리보기 안내를 보여준다", async ({ page }) => {
    await page.goto("/contact?product=opp-tape");
    await page.locator("#inquiry-companyName").fill("테스트 회사");
    await page.locator("#inquiry-phone").fill("010-1234-5678");
    await page.locator('input[type="file"]').setInputFiles({
      name: "spec.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4"),
    });
    await expect(page.getByText("spec.pdf")).toBeVisible();
    await page.locator("#inquiry-privacyConsent").check();
    await page.getByRole("button", { name: "견적 문의 보내기" }).click();

    await expect(page.getByRole("heading", { name: /접수 완료 화면 미리보기/ })).toBeVisible();
    await expect(page.getByText("미리보기 화면입니다")).toBeVisible();
    await expect(page.getByText("DH-PREVIEW")).toBeVisible();
    await expect(page.getByText("테이프 / OPP 테이프")).toBeVisible();
    await expect(page.getByRole("heading", { name: /주문|구매|출고/ })).toHaveCount(0);
  });
});

test.describe("모바일 UX", () => {
  test("모바일 메뉴와 하단 고정 문의 버튼", async ({ page }) => {
    test.skip(!isMobile(page), "모바일 전용");
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "메뉴 열기" });
    await menuButton.click();
    const mobileNav = page.getByRole("navigation", { name: "모바일 메뉴" });
    await expect(mobileNav).toBeVisible();
    await mobileNav.getByRole("link", { name: "제품안내" }).click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(mobileNav).toBeHidden();

    await page.goto("/products/opp-tape");
    await page.getByRole("link", { name: "견적 문의하기" }).last().click();
    await expect(page.locator("#inquiry-productName")).toHaveValue("OPP 테이프");
  });

  test("전화번호가 설정되지 않으면 전화 링크를 만들지 않는다", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  });
});

test.describe("관리자 화면 (샘플)", () => {
  test("미리보기 안내와 함께 상태 필터·상세 화면이 동작한다", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("화면 미리보기 · 샘플 데이터")).toBeVisible();
    await page.getByRole("button", { name: /^신규 문의/ }).click();
    const rows = page.locator("main ul li a");
    await expect(rows).toHaveCount(2);

    await rows.filter({ hasText: "방청비닐" }).click();
    await expect(page.getByRole("heading", { name: "DH-20261026-0007" })).toBeVisible();
    await expect(page.getByText("메일 발송 실패").first()).toBeVisible();

    await page.getByLabel("처리 상태").selectOption("REVIEWING");
    await page.getByRole("button", { name: "변경 내용 저장" }).click();
    await expect(page.getByRole("status")).toContainText("저장되지 않았습니다");
  });

  test("관리자 페이지는 검색엔진 색인에서 제외한다", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("메인 비주얼", () => {
  test("히어로 슬라이드를 버튼으로 넘길 수 있고 자동으로 넘어가지 않는다", async ({ page }) => {
    await page.goto("/");
    const slides = page.locator('[aria-roledescription="slide"]');
    await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");
    await page.waitForTimeout(1500);
    await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");

    await page.getByRole("button", { name: /^2번째 슬라이드/ }).click();
    await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "false");
    await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByRole("heading", { level: 2, name: "랩·스트레치필름" })).toBeVisible();
  });

  test("로고 이미지와 샘플 이미지 표시가 있다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "대흥CNS 홈" }).first().locator("img")).toBeVisible();
    await expect(page.getByText("샘플 이미지").first()).toBeVisible();
  });

  test("샘플 이미지 출처 페이지에 저작자와 라이선스를 표시한다", async ({ page }) => {
    const response = await page.goto("/credits");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "샘플 이미지 출처" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Wikimedia Commons 원본" })).toHaveCount(sampleCredits.length);
    await expect(page.getByText(/CC BY|CC0|Public domain/).first()).toBeVisible();
  });
});

test.describe("헤더", () => {
  test("메인에서는 히어로 위에 투명하게 겹치고, 스크롤하면 흰 배경이 된다", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toHaveClass(/bg-transparent/);
    await page.mouse.wheel(0, 800);
    await expect(header).toHaveClass(/bg-white/);
  });

  test("다른 페이지에서는 처음부터 흰 배경이다", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("header").first()).toHaveClass(/bg-white/);
  });
});

test.describe("리뷰 회귀 방지", () => {
  test("숨은 등장 영역 안으로 키보드 포커스가 들어오면 바로 보인다", async ({ page }) => {
    test.skip(isMobile(page), "키보드 탐색은 데스크톱에서 확인");
    await page.goto("/");
    const tab = page.getByRole("button", { name: "테이프", exact: true });
    await tab.focus();
    await expect
      .poll(() =>
        tab.evaluate((el) => {
          for (let node: Element | null = el; node; node = node.parentElement) {
            if (getComputedStyle(node).opacity === "0") return false;
          }
          return true;
        }),
      )
      .toBe(true);
  });

  test("메인 중간에서 새로고침해도 헤더가 투명으로 남지 않는다", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 2500));
    await page.reload();
    await page.evaluate(() => window.scrollTo(0, 2500));
    await expect(page.locator("header").first()).toHaveClass(/bg-white/);
  });

  test("제품 필터를 고른 뒤 메뉴로 다시 들어오면 필터가 초기화된다", async ({ page }) => {
    test.skip(isMobile(page), "헤더 메뉴는 데스크톱에서 확인");
    await page.goto("/products");
    await page.getByRole("button", { name: "테이프", exact: true }).click();
    await expect(page).toHaveURL(/category=tape/);
    await page.getByRole("navigation", { name: "주 메뉴" }).getByRole("link", { name: "제품안내" }).click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByRole("button", { name: "전체", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("main article")).toHaveCount(5);
  });

  test("인쇄할 때는 스크롤 등장 효과로 숨은 내용이 없다", async ({ page }) => {
    await page.goto("/about");
    // 화면 안의 요소가 등장 애니메이션을 마칠 때까지 기다린다. (무한 반복 애니메이션은 제외)
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((a) => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).length,
        ),
      )
      .toBe(0);
    await page.emulateMedia({ media: "print" });
    const hidden = await page.evaluate(
      () => [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity === "0").length,
    );
    expect(hidden).toBe(0);
  });

  test("키워드 띠는 정지 버튼으로 멈출 수 있다", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "키워드 띠 움직임 정지" });
    await button.click();
    await expect(page.getByRole("button", { name: "키워드 띠 움직임 재생" })).toHaveAttribute("aria-pressed", "true");
  });
});
