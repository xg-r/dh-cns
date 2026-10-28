import credits from "./sample-credits.json";

/** /public/samples 의 임시 사진 출처. 라이선스(CC BY 등)에 따라 저작자 표시가 필요하다. */
export interface SampleCredit {
  file: string;
  title: string;
  author: string;
  license: string;
  source: string;
}

export const sampleCredits: SampleCredit[] = credits;

/** 샘플 사진을 모두 실제 사진으로 교체하면 false 로 바꾼다. (푸터의 출처 링크가 사라진다) */
export const usesSampleImages = true;

const LICENSE_URLS: Record<string, string> = {
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
};

/** 라이선스 원문 주소. 퍼블릭 도메인처럼 원문이 없으면 null */
export function licenseUrl(license: string): string | null {
  return LICENSE_URLS[license] ?? null;
}
