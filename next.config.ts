import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // E2E 테스트 빌드(미리보기 모드)가 일반 빌드 결과(.next)를 덮어쓰지 않도록 분리한다.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
