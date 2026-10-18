"use client";

import dynamic from "next/dynamic";

/**
 * The form (React Hook Form + Zod) is split into its own chunk so pages that
 * link to /contact do not prefetch it. It is still server-rendered.
 */
export const ContactFormLazy = dynamic(() => import("./ContactForm").then((m) => m.ContactForm));
