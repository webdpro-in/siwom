import { LazyDemo } from "./LazyDemo";
import { LogisticsPoster } from "./logistics/LogisticsPoster";
import { SafetyPoster } from "./safety/SafetyPoster";

/** Logistics OS demo: static poster first, interactive chunk when near the viewport. */
export function LogisticsDemoSection({ idBase = "lgx" }: { idBase?: string }) {
  return <LazyDemo demo="logistics" idBase={idBase} poster={<LogisticsPoster idBase={idBase} />} />;
}

/** Safety AI inspection demo, loaded the same way. */
export function SafetyDemoSection({ idBase = "sfy" }: { idBase?: string }) {
  return <LazyDemo demo="safety" idBase={idBase} poster={<SafetyPoster idBase={idBase} />} />;
}
