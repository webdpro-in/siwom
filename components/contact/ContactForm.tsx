"use client";

import Link from "next/link";
import { submitEnquiry } from "@/lib/web3forms";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics";
import {
  contactSchema,
  industryOptions,
  MESSAGE_MAX,
  type ContactData,
  type ContactInput,
  type ContactResponse,
} from "@/lib/validation/contact";
import { interestOptions, type Interest } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { CheckboxField, RadioCardGroup, SelectField, TextareaField, TextField } from "@/components/ui/Field";

const fieldOrder: { name: keyof ContactInput; label: string; target: string }[] = [
  { name: "name", label: "Full name", target: "contact-name" },
  { name: "company", label: "Company", target: "contact-company" },
  { name: "email", label: "Work email", target: "contact-email" },
  { name: "industry", label: "Industry", target: "contact-industry" },
  { name: "interest", label: "Area of interest", target: "interest-group" },
  { name: "message", label: "Message", target: "contact-message" },
  { name: "consent", label: "Privacy Policy consent", target: "contact-consent" },
];

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string };

export function ContactForm({
  defaultInterest,
  defaultPilot,
  turnstileSiteKey,
}: {
  defaultInterest?: Interest;
  defaultPilot?: boolean;
  turnstileSiteKey?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [summary, setSummary] = useState<{ name: keyof ContactInput; label: string; target: string; message: string }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    setError,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      name: "",
      company: "",
      email: "",
      industry: "",
      interest: defaultInterest ?? "",
      pilot: defaultPilot ?? false,
      message: "",
      consent: false as unknown as true,
      website: "",
      startedAt: 0,
    },
  });

  // Time-to-submit starts when the form is first shown.
  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [setValue]);

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
    if (status.kind === "error") errorRef.current?.focus();
  }, [status.kind]);

  const message = useWatch({ control, name: "message" }) ?? "";

  /** Clear an error as soon as the field becomes valid, without validating on every keystroke otherwise. */
  const clearOnValid = (name: keyof ContactInput) => () => {
    if (errors[name]) void trigger(name);
  };
  const reg = (name: keyof ContactInput) => {
    const r = register(name);
    return {
      ...r,
      onChange: async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        await r.onChange(e);
        clearOnValid(name)();
      },
    };
  };

  function onInvalid(errs: FieldErrors<ContactInput>) {
    const items = fieldOrder
      .filter((f) => errs[f.name])
      .map((f) => ({ ...f, message: String(errs[f.name]?.message ?? "Check this field.") }));
    setSummary(items);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  const pending = useRef(false);

  async function onValid(data: ContactData) {
    if (pending.current) return;
    pending.current = true;
    setSummary([]);
    setStatus({ kind: "submitting" });
    const token = formRef.current?.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken: token }),
      });
      const body = (await res.json().catch(() => null)) as ContactResponse | null;
      // Server validation is not delivery. Require Web3Forms’ actual confirmation too.
      if (res.ok && body?.ok && body.validated) {
        const accepted = await submitEnquiry({ ...data, message: `${data.message}\n\nIndustry: ${data.industry}\nPilot interest: ${data.pilot ? "Yes" : "No"}` });
        if (!accepted) {
          setStatus({ kind: "error", message: "Our form service could not accept your message. Please try again shortly." });
          return;
        }
        setStatus({ kind: "success" });
        track({ name: "contact_submit", props: { result: "success", interest: data.interest } });
        return;
      }
      if (body && !body.ok && body.fieldErrors) {
        for (const [name, msgs] of Object.entries(body.fieldErrors)) {
          if (msgs?.length) setError(name as keyof ContactInput, { message: msgs[0] });
        }
      }
      setStatus({ kind: "error", message: body && !body.ok ? body.error : "We could not send your message just now." });
      track({ name: "contact_submit", props: { result: "error", interest: data.interest } });
    } catch {
      setStatus({ kind: "error", message: "The form service could not be reached. Submission was not confirmed; please try again." });
      track({ name: "contact_submit", props: { result: "error", interest: data.interest } });
    } finally {
      pending.current = false;
    }
  }

  if (status.kind === "success") {
    return (
      <div className="flex flex-col items-start gap-5 rounded-panel border border-border-strong bg-surface-1 p-6 md:p-10">
        <CircleCheck aria-hidden className="size-8 text-accent-text" strokeWidth={1.5} />
        <h2 ref={successRef} tabIndex={-1} className="text-h2 text-text outline-none">
          Thanks. Your message was submitted.
        </h2>
        <p className="max-w-reading text-body-l text-text-muted">
          Our form service accepted your enquiry. Thank you for getting in touch; the team can reply using the email address you provided.
        </p>
        <Button href="/" variant="secondary" icon="arrow">
          Back to home
        </Button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={(e) => void handleSubmit(onValid, onInvalid)(e)} className="flex flex-col gap-8" aria-busy={status.kind === "submitting"} aria-describedby="form-required-note">
      {turnstileSiteKey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /> : null}

      {summary.length > 0 ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="error-summary-title" className="rounded-card border border-sev-critical/60 bg-surface-1 p-5 outline-none focus-visible:outline-2 focus-visible:outline-focus">
          <h2 id="error-summary-title" className="flex items-center gap-2 font-sans text-body font-medium text-text">
            <CircleAlert aria-hidden className="size-5 text-sev-critical" strokeWidth={1.75} />
            {summary.length === 1 ? "1 field needs attention" : `${summary.length} fields need attention`}
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {summary.map((s) => (
              <li key={s.name}>
                <a
                  href={`#${s.target}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el =
                      s.name === "interest"
                        ? formRef.current?.querySelector<HTMLInputElement>('input[name="interest"]')
                        : document.getElementById(s.target);
                    el?.focus();
                    el?.scrollIntoView({ block: "center" });
                  }}
                  className="text-small text-sev-critical underline underline-offset-4"
                >
                  {s.label}: {s.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {status.kind === "error" ? (
        <div ref={errorRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-card border border-sev-critical/60 bg-surface-1 p-5 outline-none">
          <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-sev-critical" strokeWidth={1.75} />
          <div className="flex flex-col gap-2 text-small">
            <p className="font-medium text-text">{status.message}</p>
            <p className="text-text-muted">
              Everything you typed is still here. Check your connection and use Send message to try again.
            </p>
          </div>
        </div>
      ) : null}

      <p id="form-required-note" className="text-small text-text-muted">
        Fields marked <span aria-hidden>*</span>
        <span className="sr-only">required</span> are required.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <TextField id="contact-name" label="Full name" required autoComplete="name" error={errors.name?.message} {...reg("name")} />
        <TextField id="contact-company" label="Company" required autoComplete="organization" error={errors.company?.message} {...reg("company")} />
        <TextField
          id="contact-email"
          label="Work email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          spellCheck={false}
          helper="We only use this to reply to you."
          error={errors.email?.message}
          {...reg("email")}
        />
        <SelectField
          id="contact-industry"
          label="Industry"
          required
          options={industryOptions}
          placeholder="Choose your industry"
          error={errors.industry?.message}
          {...reg("industry")}
        />
      </div>

      <RadioCardGroup
        name="interest"
        legend="Area of interest"
        required
        options={interestOptions}
        error={errors.interest?.message}
        inputProps={reg("interest")}
      />

      <CheckboxField id="contact-pilot" label="I'm interested in a pilot" helper="A scoped trial on one real problem." {...register("pilot")} />

      <TextareaField
        id="contact-message"
        label="Message"
        required
        rows={6}
        count={message.length}
        maxCount={MESSAGE_MAX}
        helper="What operation do you run, and what problem would you like to solve first?"
        error={errors.message?.message}
        {...reg("message")}
      />

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <CheckboxField
        id="contact-consent"
        required
        error={errors.consent?.message}
        label={
          <>
            I agree to SIWOM processing these details to reply to me, as described in the{" "}
            <Link href="/privacy" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-text underline underline-offset-4">
              Privacy Policy
              <ExternalLink aria-hidden className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </Link>
            .
          </>
        }
        {...reg("consent")}
      />

      {turnstileSiteKey ? <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="auto" /> : null}

      <div className="flex flex-col items-start gap-3">
        <Button type="submit" size="lg" icon="arrow" loading={submitting} className="min-w-48" trackAs="contact_submit">
          {submitting ? "Sending…" : "Send message"}
        </Button>
        <p className="text-small text-text-muted">We read every message and reply by email.</p>
      </div>
    </form>
  );
}
