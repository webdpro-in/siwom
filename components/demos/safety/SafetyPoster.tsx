import { initialState } from "./model";
import { SafetyView } from "./SafetyView";

/** Server-rendered static poster: the demo's starting state, not yet interactive. */
export function SafetyPoster({ idBase }: { idBase?: string }) {
  return (
    <div inert>
      <SafetyView state={initialState} idBase={idBase} loadingLabel="Loading interactive demo…" />
    </div>
  );
}
