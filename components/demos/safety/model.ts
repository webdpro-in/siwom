/* Pure state model for the Safety AI inspection demo. */
import { initialLog, scenarios, type LogEntry, type ReviewStatus, type ScenarioId } from "@/data/demo/detections";

export type ReviewAction = "confirmed" | "dismissed" | "escalated";

export type SafetyState = {
  scenario: ScenarioId;
  /** Selected detection per scenario. */
  active: Record<ScenarioId, string>;
  showDetections: boolean;
  statuses: Record<string, ReviewStatus>;
  reviewedAt: Record<string, string>;
  log: LogEntry[];
  hintDismissed: boolean;
};

const firstReviewable = (id: ScenarioId) => {
  const s = scenarios.find((x) => x.id === id)!;
  return (s.detections.find((d) => d.reviewable) ?? s.detections[0]).id;
};

export const initialState: SafetyState = {
  scenario: "damage",
  active: { damage: firstReviewable("damage"), ppe: firstReviewable("ppe"), zone: firstReviewable("zone") },
  showDetections: true,
  statuses: Object.fromEntries(
    scenarios.flatMap((s) => s.detections.filter((d) => d.reviewable).map((d) => [d.id, "pending" as ReviewStatus])),
  ),
  reviewedAt: {},
  log: initialLog,
  hintDismissed: false,
};

export type SafetyAction =
  | { type: "scenario"; scenario: ScenarioId }
  | { type: "select"; detectionId: string }
  | { type: "toggleDetections" }
  | { type: "review"; detectionId: string; action: ReviewAction; time: string }
  | { type: "dismissHint" }
  | { type: "reset" };

export const actionLabels: Record<ReviewAction, { log: string; announce: string }> = {
  confirmed: { log: "Confirmed hazard", announce: "Hazard confirmed, added to incident log" },
  dismissed: { log: "Marked as false alarm", announce: "Marked as false alarm, added to incident log" },
  escalated: { log: "Escalated to supervisor", announce: "Escalated to supervisor, added to incident log" },
};

export function reducer(state: SafetyState, action: SafetyAction): SafetyState {
  switch (action.type) {
    case "scenario":
      return { ...state, scenario: action.scenario };
    case "select":
      return { ...state, active: { ...state.active, [state.scenario]: action.detectionId }, hintDismissed: true };
    case "toggleDetections":
      return { ...state, showDetections: !state.showDetections };
    case "review": {
      const detection = scenarios.flatMap((s) => s.detections).find((d) => d.id === action.detectionId);
      if (!detection) return state;
      return {
        ...state,
        hintDismissed: true,
        statuses: { ...state.statuses, [action.detectionId]: action.action },
        reviewedAt: { ...state.reviewedAt, [action.detectionId]: action.time },
        log: [
          {
            time: action.time,
            detectionId: detection.id,
            label: detection.label,
            action: actionLabels[action.action].log,
            note: "You, as demo reviewer",
          },
          ...state.log,
        ],
      };
    }
    case "dismissHint":
      return { ...state, hintDismissed: true };
    case "reset":
      return initialState;
  }
}

export function currentScenario(state: SafetyState) {
  return scenarios.find((s) => s.id === state.scenario)!;
}

export function activeDetection(state: SafetyState) {
  const scenario = currentScenario(state);
  return scenario.detections.find((d) => d.id === state.active[state.scenario]) ?? scenario.detections[0];
}

export function pendingCount(state: SafetyState) {
  return Object.values(state.statuses).filter((s) => s === "pending").length;
}

/** Simulated IST clock: snapshot 14:30:00 plus time since the demo loaded. */
export function demoTime(startedAt: number) {
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const total = 14 * 3600 + 30 * 60 + elapsed;
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor(total / 60) % 60;
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} IST`;
}
