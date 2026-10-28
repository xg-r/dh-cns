import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const widths = {
  default: "max-w-[75rem]",
  wide: "max-w-[90rem]",
  narrow: "max-w-3xl",
} as const;

interface ContainerProps extends ComponentProps<"div"> {
  size?: keyof typeof widths;
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[size], className)} {...props} />;
}
