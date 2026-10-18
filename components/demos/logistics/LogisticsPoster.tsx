import { initialState } from "./model";
import { LogisticsView } from "./LogisticsView";

/** Server-rendered static poster: the demo's starting state, not yet interactive. */
export function LogisticsPoster({ idBase }: { idBase?: string }) {
  return (
    <div inert>
      <LogisticsView state={initialState} idBase={idBase} loadingLabel="Loading interactive demo…" />
    </div>
  );
}
