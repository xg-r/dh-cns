# 개발 가이드 (프론트엔드 1단계)

프로젝트 요구사항은 [README.md](../README.md)에 있다. 이 문서는 현재 구현 상태와 실행·수정 방법을 다룬다.

## 현재 범위

**프론트엔드만 구현된 상태다.** 문의 DB 저장, 이메일 알림, 관리자 인증은 아직 없다.

| 영역 | 상태 |
| --- | --- |
| 메인 `/`, 제품 `/products`, 제품 상세 `/products/[slug]`, 회사소개 `/about`, 개인정보 처리방침 `/privacy`, 샘플 이미지 출처 `/credits`, 404 | 구현 |
| 견적 문의 `/contact` | 화면·클라이언트 검증·첨부파일 선택 UI 구현. **서버 전송 없음** (`NEXT_PUBLIC_INQUIRY_MODE`) |
| 관리자 `/admin` | 목록·필터·검색·정렬·CSV·상세·상태 변경 UI. **샘플 데이터, 인증 없음, 저장 안 됨** |
| SEO | 페이지별 title/description, Open Graph, `sitemap.xml`, `robots.txt`(`/admin` 제외) |

미연결 기능은 화면에 "미리보기"로 표시된다. 운영 빌드에서 `NEXT_PUBLIC_INQUIRY_MODE`를 설정하지 않으면 문의 제출이 비활성화된다.

> 관리자 화면은 인증 없이 누구나 접근할 수 있다. 샘플 데이터만 있지만, 실제 문의 데이터를 연결하기 전에 반드시 인증을 적용해야 한다.

## 실행

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
```

## 테스트

```bash
pnpm typecheck
pnpm lint
pnpm test           # Vitest: 제품 필터, 문의 검증 스키마, 관리자 목록/CSV
pnpm test:e2e       # Playwright: 데스크톱·모바일 주요 흐름 (미리보기 모드로 빌드 후 실행)
```

처음 E2E를 실행할 때는 `pnpm exec playwright install chromium`이 필요하다.

## 디자인 시스템

현대자동차 홈페이지(hyundai.com/kr)의 톤을 참고했다. 레이아웃과 톤만 참고했으며, 로고·서체·이미지·문구는 가져오지 않았다.

- 색상 (`src/app/globals.css`의 `@theme`): `brand`는 로고 네이비(#171c61), `accent`는 로고 블루(#0060b0), `gray`는 웜 그레이, `sand`(#f6f3f2)는 섹션 배경, `charcoal`은 푸터 색이다.
- 모서리: 전역 radius 토큰을 0으로 두어 버튼·카드·입력창이 각지게 보인다. 칩처럼 둥근 요소는 `rounded-full`을 쓴다.
- 섹션 제목: 가운데 정렬된 큰 제목과 회색 보조 문구 (`SectionHeader`)
- 메인 구성 (현대 메인의 섹션 흐름을 따름): 투명 헤더 + 전체 폭 히어로 슬라이더(자동 재생 없음) → 아이콘 퀵메뉴 → 배너 한 쌍 → 주요 제품(Model 형태: 큰 대표 이미지 + 탭 + 썸네일 2개) → 생산 기반(전기차 형태: 사진 카드 + 설비 카드 슬라이더) → 견적 상담(Trendy 형태: 샌드 패널 + 큰 이미지) → 납품 분야(HyundaiShop 형태: 타일 3개 + 안내 패널과 번호 타일) → 연혁(소식 형태: 해시태그 칩) → 모서리 둥근 바로가기 카드 → 차콜 푸터
- README 4-1 이 요구하는 '핵심 경쟁력'(함께하는 이유)은 주요 제품 다음에 둔다. '문의부터 거래까지'는 문의 페이지로 옮겼다.

## 모션

- 스크롤 등장: 요소에 `data-reveal`(기본 / left / right / zoom / flip / line / dot)을 붙이면 화면에 들어올 때 나타난다. 시차는 `style={revealDelay(i)}`로 준다. 구현은 `src/components/motion/scroll-reveal.tsx`이다.
  - DOM 속성을 바꾸지 않고 Web Animations API만 쓴다. 그래서 늦게 하이드레이션되는 영역과 충돌하지 않는다.
  - JS가 실패하면 3초 뒤 숨김을 해제한다. 동작 줄이기(prefers-reduced-motion) 설정에서는 효과를 끈다.
- 3D 기울기: `<Tilt>`(`src/components/motion/tilt.tsx`)로 감싸면 마우스 위치를 따라 카드가 기울어진다. 터치 기기에서는 동작하지 않는다.
- 히어로: 사진이 천천히 줌아웃되고 글자가 순서대로 올라온다. 자동 슬라이드는 없다.
- README의 "과도한 애니메이션 금지" 원칙에 따라 자동 재생은 키워드 띠 하나뿐이다. 이 띠는 마우스를 올리면 멈춘다.

## 로고와 샘플 이미지

- 로고: `public/brand/logo.png`(233×48 PNG). 어두운 배경용 흰색 버전은 `logo-white.png`이며 원본에서 자동 생성했다. **고해상도 PNG나 SVG 원본을 받아 교체하는 것을 권장한다.** 현재 파일은 레티나 화면에서 약간 흐리게 보일 수 있다.
- 샘플 이미지: `public/samples/`의 WebP 13장. Wikimedia Commons에서 CC0, Public domain, CC BY, CC BY-SA 라이선스 사진만 골랐다. 화면에는 "샘플 이미지" 표시가 붙고, 출처는 `/credits` 페이지와 `src/content/sample-credits.json`에 있다.
- 실제 사진으로 바꿀 때: 해당 데이터의 `src`를 바꾸고 `sample: true`를 지운다. 모든 샘플을 교체하면 `src/content/sample-credits.ts`의 `usesSampleImages`를 `false`로 바꾸고 `public/samples/`를 지운다.
- 방청비닐은 대체 이미지("이미지 준비 중") 화면을 확인하려고 일부러 사진 없이 두었다.

## 콘텐츠 수정

회사 정보와 제품 정보는 컴포넌트가 아니라 `src/content/`의 데이터 파일에서 관리한다.

| 파일 | 내용 |
| --- | --- |
| `src/content/site.ts` | 회사명, 로고, 전화, 이메일, 주소, 대표자, 사업자번호, 상담 시간 |
| `src/content/products.ts` | 제품 목록, 규격·옵션, 상담 항목, 이미지 |
| `src/content/categories.ts` | 제품 카테고리 |
| `src/content/company.ts` | 연혁, 설비 이력, 납품 분야, 거래처(공개 승인 플래그), 핵심 경쟁력 |
| `src/content/privacy.ts` | 개인정보 수집·이용 안내 항목 |
| `src/content/home.ts` | 메인 히어로 슬라이드, 생산 기반 이미지 |

규칙:

- 확인되지 않은 값은 `null`로 둔다. `null`인 항목은 화면에 나오지 않는다. 예를 들어 `phone`이 `null`이면 전화 상담 버튼과 `tel:` 링크가 만들어지지 않는다.
- 제품 규격·옵션 값이 `null`이면 "별도 문의"로 표시된다.
- 제품 `image`가 `null`이면 "이미지 준비 중"이라고 적힌 대체 일러스트가 나온다. 실제 사진은 `public/products/`에 넣고 `src`를 지정한다.
- 거래처명은 `approved: true`인 것만 메인 페이지에 노출된다.
- 실제 로고는 `public/`에 넣고 `site.logo`에 경로와 크기를 지정한다.

## 공개 전 확인이 필요한 정보

- [ ] 대표 전화·이메일·주소·대표자·사업자등록번호 (`site.ts`)
- [ ] 실제 취급 제품 목록과 문구, 확인된 규격·옵션 (`products.ts`의 `verified`가 모두 `false`). 현재는 README에 나온 5개 품목만 있음
- [ ] 실제 제품·설비 사진 (현재는 샘플 이미지), 고해상도 로고 원본
- [ ] 연혁의 월(month) 정보와 GRS 인증 이력의 정확한 내용
- [ ] 거래처명 공개 범위 (`company.ts`의 `approved`)
- [ ] 개인정보 처리방침: 운영 주체, 보유 기간, 처리 위탁, 보호책임자, 시행일. 법적 검토 후 `reviewed: true`로 변경

## 다음 단계 (README 5·6·10·11절)

1. 문의 접수 서버 API: zod 재검증(`src/lib/inquiry/schema.ts` 재사용), 스팸 방지, 요청 빈도 제한
2. MySQL `inquiries` 테이블과 마이그레이션
3. Resend 이메일 알림과 발송 상태 기록, 재시도
4. 첨부파일 저장(S3 등)과 서버 측 파일 검증
5. 관리자 인증과 `/admin`의 실제 데이터 연결

문의 제출은 `src/lib/inquiry/submit.ts`의 `submitInquiry`만 교체하면 되도록 분리되어 있다.

## 기술 메모

- Next.js 16 `cacheComponents` + `partialPrefetching`이 켜져 있다. URL 데이터(`params`, `useSearchParams`, `usePathname`)는 `<Suspense>` 안에서 읽는다.
- 서버 렌더 중에는 `new Date()`처럼 현재 시각을 읽는 코드를 쓰지 않는다. 날짜 포맷은 `src/lib/format.ts`(Asia/Seoul 고정)를 사용한다.
- 폰트: Pretendard Variable (`src/app/fonts/`, SIL Open Font License)
