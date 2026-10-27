export const mainNav = [
  { href: "/about", label: "회사소개" },
  { href: "/products", label: "제품안내" },
  { href: "/contact", label: "견적문의" },
] as const;

export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
