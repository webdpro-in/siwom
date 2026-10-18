"use client";

import { useEffect, useId, useMemo, useReducer, useRef } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { track } from "@/lib/analytics";
import { useFocusTrap, useMediaQuery, useReducedMotion, useScrollLock } from "@/lib/hooks";
import { motion as motionTokens } from "@/lib/tokens";
import { useToast } from "@/components/ui/Toast";
import { exceptions } from "@/data/demo/exceptions";
import { shipments } from "@/data/demo/shipments";
import { fromSearch, initialState, reducer, toSearch, type DemoState } from "./model";
import { LogisticsView, type LogisticsActions } from "./LogisticsView";
import { ShipmentDetail } from "./ShipmentDetail";

export default function LogisticsDemo({ idBase = "lgx" }: { idBase?: string }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init): DemoState => ({
    ...init,
    ...(typeof window !== "undefined" ? fromSearch(window.location.search) : {}),
  }));
  const desktop = useMediaQuery("(min-width: 1024px)", true);
  const { notify } = useToast();
  const titleId = useId();

  // Mirror filters to the URL without adding history entries.
  const firstSync = useRef(true);
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false;
      return;
    }
    const next = toSearch(state, window.location.search);
    if (next !== window.location.search) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${next}${window.location.hash}`);
    }
  }, [state.statuses, state.modes, state.query]); // eslint-disable-line react-hooks/exhaustive-deps

  const actions = useMemo<LogisticsActions>(
    () => ({
      setView: (view) => dispatch({ type: "view", view }),
      setMobileTab: (tab) => dispatch({ type: "mobileTab", tab }),
      setQuery: (query) => dispatch({ type: "query", query }),
      toggleStatus: (status) => {
        dispatch({ type: "toggleStatus", status });
        track({ name: "demo_interaction", props: { demo: "logistics", action: `filter_status_${status}` } });
      },
      toggleMode: (mode) => {
        dispatch({ type: "toggleMode", mode });
        track({ name: "demo_interaction", props: { demo: "logistics", action: `filter_mode_${mode}` } });
      },
      clearFilters: () => dispatch({ type: "clearFilters" }),
      select: (id) => {
        dispatch({ type: "select", id });
        track({ name: "demo_interaction", props: { demo: "logistics", action: "select_shipment" } });
      },
      acknowledge: (exceptionId) => {
        dispatch({ type: "acknowledge", exceptionId });
        const e = exceptions.find((x) => x.id === exceptionId);
        notify({ kind: "success", title: `${exceptionId} acknowledged`, description: e ? `${e.title}. Open exception count updated.` : undefined });
        track({ name: "demo_interaction", props: { demo: "logistics", action: "acknowledge" } });
      },
      choose: (jobId, vehicleId) => dispatch({ type: "choose", jobId, vehicleId }),
      assign: (jobId) => {
        dispatch({ type: "assign", jobId });
        notify({ kind: "success", title: `Vehicle assigned to ${jobId}`, description: "The load moved to Assigned." });
        track({ name: "demo_interaction", props: { demo: "logistics", action: "assign" } });
      },
      sort: (key) => dispatch({ type: "sort", key }),
      dismissHint: () => dispatch({ type: "dismissHint" }),
      reset: () => {
        dispatch({ type: "reset" });
        notify({ kind: "success", title: "Demo reset", description: "Filters, selections and actions are back to the starting state." });
        track({ name: "demo_interaction", props: { demo: "logistics", action: "reset" } });
      },
    }),
    [notify],
  );

  const selected = shipments.find((s) => s.id === state.selectedId);
  const open = state.drawerOpen && Boolean(selected);

  return (
    <LazyMotion features={domAnimation} strict>
      <LogisticsView
        state={state}
        actions={actions}
        idBase={idBase}
        desktop={desktop}
        overlay={
          <Drawer open={open} desktop={desktop} titleId={titleId} onClose={() => dispatch({ type: "closeDrawer" })}>
            {selected ? (
              <ShipmentDetail
                shipment={selected}
                acknowledged={state.acknowledged}
                onAcknowledge={actions.acknowledge}
                onClose={() => dispatch({ type: "closeDrawer" })}
                titleId={titleId}
              />
            ) : null}
          </Drawer>
        }
      />
    </LazyMotion>
  );
}

function Drawer({
  open,
  desktop,
  titleId,
  onClose,
  children,
}: {
  open: boolean;
  desktop: boolean;
  titleId: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useFocusTrap(ref, open, { onEscape: onClose });
  useScrollLock(open && !desktop);

  const t = reduced ? motionTokens.reduced : motionTokens.ui;
  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : desktop
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
      : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  return (
    <AnimatePresence>
      {open ? (
        <div className={desktop ? "absolute inset-0 z-20" : "fixed inset-0 z-60"}>
          <m.div
            key="backdrop"
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 bg-scrim-heavy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: t.duration, ease: t.ease }}
          />
          <m.div
            key="panel"
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            {...panelMotion}
            transition={{ duration: t.duration, ease: t.ease }}
            className={
              desktop
                ? "absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto border-l border-border-strong bg-surface-1 p-6 shadow-float"
                : "absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-panel border-t border-border-strong bg-surface-1 px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-float"
            }
          >
            {!desktop ? <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-border-strong" /> : null}
            {children}
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
