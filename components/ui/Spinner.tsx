import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <>
      <LoaderCircle aria-hidden className={cn("size-5 shrink-0 animate-spin", className)} strokeWidth={1.5} />
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  );
}
