import { Suspense } from "react";
import { HeaderBar, HeaderWithPath } from "./header-nav";

export function SiteHeader() {
  return (
    <Suspense fallback={<HeaderBar pathname={null} />}>
      <HeaderWithPath />
    </Suspense>
  );
}
