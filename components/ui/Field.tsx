import type { ComponentPropsWithRef, ReactNode } from "react";
import { Check, ChevronDown, CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Form fields. Label always visible above the field (no placeholder-as-label),
 * helper text below, errors as red text + icon wired with aria-describedby.
 * Inputs use 16 px text so iOS Safari does not zoom. Works with React Hook
 * Form's register() because refs are plain props in React 19.
 */

type FieldShellProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  helper?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
};

export function describedBy(id: string, helper?: ReactNode, error?: string) {
  return [error ? `${id}-error` : null, helper ? `${id}-helper` : null].filter(Boolean).join(" ") || undefined;
}

export function FieldShell({ id, label, required, helper, error, children, className, aside }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-small font-medium text-text">
          {label}
          {required ? (
            <span className="text-text-muted">
              {" "}
              <span aria-hidden>*</span>
              <span className="sr-only">(required)</span>
            </span>
          ) : (
            <span className="text-text-muted"> (optional)</span>
          )}
        </label>
        {aside}
      </div>
      {children}
      {helper ? (
        <p id={`${id}-helper`} className="text-small text-text-muted">
          {helper}
        </p>
      ) : null}
      <FieldError id={id} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="flex items-start gap-1.5 text-small text-sev-critical">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
      <span>{error}</span>
    </p>
  );
}

const controlBase =
  "w-full rounded-control border bg-surface-3 px-3.5 text-body text-text transition-colors duration-hover " +
  "placeholder:text-text-muted hover:border-text-muted focus-visible:border-accent disabled:cursor-not-allowed disabled:text-text-subtle";

function controlState(error?: string) {
  return error ? "border-sev-critical" : "border-border-control";
}

type InputProps = Omit<ComponentPropsWithRef<"input">, "id"> & {
  id: string;
  label: ReactNode;
  helper?: ReactNode;
  error?: string;
  shellClassName?: string;
};

export function TextField({ id, label, helper, error, required, shellClassName, className, ...rest }: InputProps) {
  return (
    <FieldShell id={id} label={label} required={required} helper={helper} error={error} className={shellClassName}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        aria-required={required || undefined}
        className={cn(controlBase, controlState(error), "h-12", className)}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = Omit<ComponentPropsWithRef<"select">, "id"> & {
  id: string;
  label: ReactNode;
  helper?: ReactNode;
  error?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  shellClassName?: string;
};

export function SelectField({
  id,
  label,
  helper,
  error,
  required,
  options,
  placeholder = "Select an option",
  shellClassName,
  className,
  ...rest
}: SelectProps) {
  return (
    <FieldShell id={id} label={label} required={required} helper={helper} error={error} className={shellClassName}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, helper, error)}
          aria-required={required || undefined}
          className={cn(controlBase, controlState(error), "h-12 appearance-none pr-10", className)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-text-muted"
          strokeWidth={1.5}
        />
      </div>
    </FieldShell>
  );
}

type TextareaProps = Omit<ComponentPropsWithRef<"textarea">, "id"> & {
  id: string;
  label: ReactNode;
  helper?: ReactNode;
  error?: string;
  count?: number;
  maxCount?: number;
  shellClassName?: string;
};

export function TextareaField({
  id,
  label,
  helper,
  error,
  required,
  count,
  maxCount,
  shellClassName,
  className,
  ...rest
}: TextareaProps) {
  const counter =
    typeof count === "number" && maxCount ? (
      <span
        id={`${id}-count`}
        className={cn("font-mono text-eyebrow tabular", count > maxCount ? "text-sev-critical" : "text-text-muted")}
      >
        {count.toLocaleString("en-IN")} / {maxCount.toLocaleString("en-IN")}
      </span>
    ) : null;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      helper={helper}
      error={error}
      className={shellClassName}
      aside={counter}
    >
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[describedBy(id, helper, error), counter ? `${id}-count` : null].filter(Boolean).join(" ") || undefined}
        aria-required={required || undefined}
        className={cn(controlBase, controlState(error), "min-h-40 resize-y py-3", className)}
        {...rest}
      />
    </FieldShell>
  );
}

type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "id" | "type"> & {
  id: string;
  label: ReactNode;
  helper?: ReactNode;
  error?: string;
  className?: string;
};

export function CheckboxField({ id, label, helper, error, required, className, ...rest }: CheckboxProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 inline-flex size-6 shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, helper, error)}
            aria-required={required || undefined}
            className={cn(
              "peer size-6 cursor-pointer appearance-none rounded-xs border bg-surface-3 transition-colors duration-micro checked:border-accent checked:bg-accent",
              error ? "border-sev-critical" : "border-border-control",
            )}
            {...rest}
          />
          <Check
            aria-hidden
            className="pointer-events-none absolute size-4 text-accent-ink opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>
        <label htmlFor={id} className="cursor-pointer pt-0.5 text-small text-text">
          {label}
          {required ? <span className="sr-only"> (required)</span> : null}
        </label>
      </div>
      {helper ? (
        <p id={`${id}-helper`} className="pl-9 text-small text-text-muted">
          {helper}
        </p>
      ) : null}
      <div className="pl-9">
        <FieldError id={id} error={error} />
      </div>
    </div>
  );
}

type RadioCardOption = { value: string; label: string; description?: string };

/** Radio cards (one choice). Native radios inside a fieldset for full keyboard support. */
export function RadioCardGroup({
  name,
  legend,
  options,
  error,
  required,
  helper,
  inputProps,
  className,
}: {
  name: string;
  legend: string;
  options: readonly RadioCardOption[];
  error?: string;
  required?: boolean;
  helper?: ReactNode;
  inputProps?: Omit<ComponentPropsWithRef<"input">, "type" | "value" | "id">;
  className?: string;
}) {
  const id = `${name}-group`;
  return (
    <fieldset
      className={cn("flex flex-col gap-3", className)}
      aria-describedby={describedBy(id, helper, error)}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-2 text-small font-medium text-text">
        {legend}
        {required ? (
          <span className="text-text-muted">
            {" "}
            <span aria-hidden>*</span>
            <span className="sr-only">(required)</span>
          </span>
        ) : null}
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "relative flex min-h-12 cursor-pointer items-center gap-3 rounded-control border bg-surface-1 px-3 py-2 text-small text-text transition-colors duration-hover",
              "hover:border-text-muted has-checked:border-accent has-checked:bg-accent/10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
              error ? "border-sev-critical" : "border-border-control",
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              className="peer size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-border-control bg-surface-3 checked:border-4 checked:border-accent focus-visible:outline-none"
              {...inputProps}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {helper ? (
        <p id={`${id}-helper`} className="text-small text-text-muted">
          {helper}
        </p>
      ) : null}
      <FieldError id={id} error={error} />
    </fieldset>
  );
}
