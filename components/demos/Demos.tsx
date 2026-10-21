import { LazyDemo } from "./LazyDemo";
import { LogisticsPoster } from "./logistics/LogisticsPoster";
import { SafetyPoster } from "./safety/SafetyPoster";

/** Logistics demo: static poster first, interactive chunk when near the viewport. */
export function LogisticsDemoSection({ idBase = "lgx" }: { idBase?: string }) {
  return <LazyDemo demo="logistics" idBase={idBase} poster={<LogisticsPoster idBase={idBase} />} />;
}

/** Safety inspection demo, loaded the same way. */
export function SafetyDemoSection({ idBase = "sfy" }: { idBase?: string }) {
  return <LazyDemo demo="safety" idBase={idBase} poster={<SafetyPoster idBase={idBase} />} />;
}
