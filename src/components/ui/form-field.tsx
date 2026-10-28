import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const controlBase =
  "w-full rounded-lg border bg-white px-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-400";

function controlClass(invalid: boolean) {
  return cn(
    controlBase,
    invalid
      ? "border-red-500 focus:border-red-600 focus:ring-red-100"
      : "border-gray-300 hover:border-gray-400 focus:border-brand-600 focus:ring-brand-100",
  );
}

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, required, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-800">
        {label}
        {required ? (
          <span className="text-xs font-semibold text-red-600">필수</span>
        ) : (
          <span className="text-xs font-normal text-gray-400">선택</span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint: unknown, error: unknown) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

type ShellProps = Omit<FieldShellProps, "children" | "id">;

export function TextField({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...input
}: ShellProps & ComponentProps<"input"> & { id: string }) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass(Boolean(error)), "min-h-12")}
        {...input}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...textarea
}: ShellProps & ComponentProps<"textarea"> & { id: string }) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass(Boolean(error)), "min-h-28 py-3 leading-relaxed")}
        {...textarea}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
  ...select
}: ShellProps & ComponentProps<"select"> & { id: string }) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass(Boolean(error)), "min-h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2364748b%22><path d=%22M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z%22/></svg>')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10")}
        {...select}
      >
        {children}
      </select>
    </FieldShell>
  );
}
