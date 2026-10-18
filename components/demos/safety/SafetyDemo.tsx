"use client";

import { useMemo, useReducer, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { useToast } from "@/components/ui/Toast";
import { actionLabels, demoTime, initialState, reducer } from "./model";
import { SafetyView, type SafetyActions } from "./SafetyView";

export default function SafetyDemo({ idBase = "sfy" }: { idBase?: string }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [startedAt] = useState(() => Date.now());
  const startedRef = useRef(startedAt);
  const { notify } = useToast();

  const actions = useMemo<SafetyActions>(
    () => ({
      setScenario: (scenario) => {
        dispatch({ type: "scenario", scenario });
        track({ name: "demo_interaction", props: { demo: "safety", action: `scenario_${scenario}` } });
      },
      select: (detectionId) => dispatch({ type: "select", detectionId }),
      toggleDetections: () => dispatch({ type: "toggleDetections" }),
      review: (detectionId, action) => {
        dispatch({ type: "review", detectionId, action, time: demoTime(startedRef.current) });
        notify({ kind: "success", title: actionLabels[action].announce, description: `${detectionId} · demo reviewer` });
        track({ name: "demo_interaction", props: { demo: "safety", action: `review_${action}` } });
      },
      dismissHint: () => dispatch({ type: "dismissHint" }),
      reset: () => {
        dispatch({ type: "reset" });
        notify({ kind: "success", title: "Demo reset", description: "Reviews and the incident log are back to the starting state." });
        track({ name: "demo_interaction", props: { demo: "safety", action: "reset" } });
      },
    }),
    [notify],
  );

  const [logOpen, setLogOpen] = useState(false);
  return (
    <SafetyView
      state={state}
      actions={actions}
      idBase={idBase}
      logOpen={logOpen}
      onToggleLog={() => setLogOpen((v) => !v)}
    />
  );
}
