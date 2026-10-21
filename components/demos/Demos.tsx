import { LazyDemo } from "./LazyDemo";
import { SafetyPoster } from "./safety/SafetyPoster";

/** Safety inspection demo: static poster first, interactive chunk when near the viewport. */
export function SafetyDemoSection({ idBase = "sfy" }: { idBase?: string }) {
  return <LazyDemo demo="safety" idBase={idBase} poster={<SafetyPoster idBase={idBase} />} />;
}
