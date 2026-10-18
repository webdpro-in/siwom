"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastKind = "success" | "error";
type Toast = { id: number; kind: ToastKind; title: string; description?: string };

type ToastContextValue = {
  notify: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 6000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback((toast: Omit<Toast, "id">) => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-2), { ...toast, id }]);
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* The live region is always present so announcements are reliable. */}
      <div
        aria-live="polite"
        aria-relevant="additions text"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-70 flex flex-col items-center gap-2 md:inset-x-auto md:bottom-6 md:right-6 md:items-end"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    // Success toasts auto-dismiss after 6 s; errors stay until dismissed.
    if (toast.kind !== "success") return;
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast.kind, onDismiss]);

  const Icon = toast.kind === "success" ? CircleCheck : CircleAlert;
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm animate-fade items-start gap-3 rounded-card border bg-surface-2 p-4 shadow-float",
        toast.kind === "success" ? "border-border-strong" : "border-sev-critical/60",
      )}
    >
      <Icon
        aria-hidden
        className={cn("mt-0.5 size-5 shrink-0", toast.kind === "success" ? "text-accent-text" : "text-sev-critical")}
        strokeWidth={1.5}
      />
      <div className="flex-1 text-small">
        <p className="font-medium text-text">
          <span className="sr-only">{toast.kind === "success" ? "Success: " : "Error: "}</span>
          {toast.title}
        </p>
        {toast.description ? <p className="mt-0.5 text-text-muted">{toast.description}</p> : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="-m-2 inline-flex size-11 shrink-0 items-center justify-center rounded-control text-text-muted hover:text-text"
      >
        <X aria-hidden className="size-4" />
        <span className="sr-only">Dismiss notification</span>
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
