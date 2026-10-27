import { emailStatuses, inquiryStatuses, type EmailStatus, type InquiryStatus } from "@/lib/inquiry/status";
import { cn } from "@/lib/cn";

const statusStyles: Record<InquiryStatus, string> = {
  NEW: "bg-red-50 text-red-700 ring-red-200",
  REVIEWING: "bg-amber-50 text-amber-800 ring-amber-200",
  WAITING_CUSTOMER: "bg-sky-50 text-sky-700 ring-sky-200",
  QUOTED: "bg-brand-50 text-brand-700 ring-brand-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-gray-100 text-gray-500 ring-gray-200",
};

const emailStyles: Record<EmailStatus, string> = {
  PENDING: "text-gray-500",
  SENT: "text-emerald-700",
  FAILED: "text-red-700 font-semibold",
  SKIPPED: "text-gray-400",
};

const badge = "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset";

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return <span className={cn(badge, statusStyles[status])}>{inquiryStatuses[status]}</span>;
}

export function EmailStatusText({ status }: { status: EmailStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs whitespace-nowrap", emailStyles[status])}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      메일 {emailStatuses[status]}
    </span>
  );
}
