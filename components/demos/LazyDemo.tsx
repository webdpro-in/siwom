"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { ErrorState } from "@/components/ui/States";
import { useNearViewport } from "@/lib/hooks";

type DemoComponent = ComponentType<{ idBase?: string }>;

const loaders: Record<"safety", () => Promise<{ default: DemoComponent }>> = {
  safety: () => import("./safety/SafetyDemo"),
};

/**
 * Renders the server-rendered poster (identical markup to the demo's initial
 * state, so nothing shifts) until the demo is within one viewport, then loads
 * the interactive chunk. The first keyboard, pointer or wheel interaction
 * also triggers the load. If the chunk fails to load, an error state offers
 * a retry.
 */
export function LazyDemo({
  demo,
  poster,
  idBase,
}: {
  demo: keyof typeof loaders;
  poster: ReactNode;
  idBase?: string;
}) {
  const [ref, near] = useNearViewport<HTMLDivElement>("100% 0px");
  const [interacted, setInteracted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{ Demo: DemoComponent } | null>(null);
  const [failed, setFailed] = useState(false);

  // Keyboard and screen-reader users may reach the demo without scrolling
  // near it, so the first interaction of any kind also starts the load.
  // Nothing loads during the initial page load, keeping bandwidth for the hero.
  useEffect(() => {
    const events = ["keydown", "pointerdown", "touchstart", "wheel"] as const;
    const start = () => {
      setInteracted(true);
      events.forEach((e) => window.removeEventListener(e, start));
    };
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, []);

  const active = near || interacted;

  useEffect(() => {
    if (!active || loaded) return;
    let cancelled = false;
    loaders[demo]()
      .then((mod) => {
        if (!cancelled) setLoaded({ Demo: mod.default });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [active, demo, attempt, loaded]);

  if (failed) {
    return (
      <ErrorState
        title="The interactive demo could not load"
        reason="This usually means the connection dropped. The rest of the page still works."
        retryLabel="Load the demo again"
        onRetry={() => {
          setFailed(false);
          setAttempt((a) => a + 1);
        }}
      />
    );
  }

  return <div ref={ref}>{loaded ? <loaded.Demo idBase={idBase} /> : poster}</div>;
}
