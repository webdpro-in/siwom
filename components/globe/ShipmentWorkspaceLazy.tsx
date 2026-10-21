"use client";

import dynamic from "next/dynamic";
import { useNearViewport } from "@/lib/hooks";
import { DemoBanner } from "@/components/ui/Callout";

/** Same frame as the workspace, at its rendered height, so nothing shifts when it loads. */
function Placeholder() {
  return (
    <div aria-busy="true" className="min-h-[1600px] overflow-hidden rounded-panel border border-border-strong bg-surface-1 lg:min-h-[684px]">
      <DemoBanner />
      <p role="status" className="px-4 py-3 text-small text-text-muted">
        Loading shipment map…
      </p>
    </div>
  );
}

const ShipmentWorkspace = dynamic(() => import("./ShipmentWorkspace").then((m) => m.ShipmentWorkspace), {
  ssr: false,
  loading: Placeholder,
});

/**
 * Loads the shipment workspace (globe, list and journey) when it comes within
 * one viewport, so it never competes with the page's first paint.
 */
export function ShipmentWorkspaceLazy(props: { product?: string; view?: string }) {
  const [ref, near] = useNearViewport<HTMLDivElement>("100% 0px");
  return <div ref={ref}>{near ? <ShipmentWorkspace {...props} /> : <Placeholder />}</div>;
}
