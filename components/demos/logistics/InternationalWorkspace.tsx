"use client";

import { useState } from "react";
import { ArrowRight, Check, Globe2, Handshake, Lightbulb, RotateCcw, Search, Ship, Plane } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const lanes = [
  { id: "asia-india", origin: "Singapore", destination: "Bengaluru, India", terminal: "Chennai port", airTerminal: "Bengaluru airport", cargo: "Palletised machinery parts", reference: "DEMO-INT-1042" },
  { id: "europe-india", origin: "Rotterdam, Netherlands", destination: "Pune, India", terminal: "Nhava Sheva port", airTerminal: "Mumbai airport", cargo: "Packaged industrial components", reference: "DEMO-INT-1043" },
  { id: "india-europe", origin: "Mumbai, India", destination: "Hamburg, Germany", terminal: "Hamburg port", airTerminal: "Frankfurt airport", cargo: "Containerised consumer goods", reference: "DEMO-INT-1044" },
];
const providers = [
  { name: "Demo Ocean Network", region: "International", modes: "Ocean", cargo: "Containers & dry cargo", service: "Main carriage", status: "Example profile" },
  { name: "Demo Air Forwarding", region: "International", modes: "Air", cargo: "Time-sensitive freight", service: "Air freight coordination", status: "Example profile" },
  { name: "Demo Local Logistics", region: "India", modes: "Land", cargo: "Pallets & container loads", service: "Terminal pickup & distribution", status: "Example profile" },
  { name: "Demo Inland Connect", region: "Europe", modes: "Land", cargo: "Intermodal containers", service: "Rail, road & warehouse transfer", status: "Example profile" },
];

export default function InternationalWorkspace() {
  const [laneId,setLaneId]=useState(lanes[0].id);
  const [route,setRoute]=useState("ocean");
  const [region,setRegion]=useState("All regions");
  const [mode,setMode]=useState("All modes");
  const [query,setQuery]=useState("");
  const [reviewed,setReviewed]=useState(false);
  const [announcement,setAnnouncement]=useState("");
  const lane=lanes.find(l=>l.id===laneId)!;
  const filtered=providers.filter(p=>(region==="All regions"||p.region===region)&&(mode==="All modes"||p.modes===mode)&&`${p.name} ${p.cargo} ${p.service}`.toLowerCase().includes(query.toLowerCase()));
  const terminal=route==="air"?lane.airTerminal:lane.terminal;
  function reset(){setLaneId(lanes[0].id);setRoute("ocean");setRegion("All regions");setMode("All modes");setQuery("");setReviewed(false);setAnnouncement("International planning demo reset.");}
  return (
    <section aria-label="International logistics workspace demo" className="overflow-hidden rounded-panel border border-border-strong bg-surface-1">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-2 px-5 py-4 md:px-7">
        <span className="flex items-center gap-3"><Globe2 aria-hidden className="size-5 text-accent-text"/><span className="font-display text-body font-medium text-text">SIWOM Logistics <span className="text-text-muted">/ International workspace</span></span></span>
        <button onClick={reset} className="inline-flex min-h-11 items-center gap-2 text-small text-text-muted hover:text-text"><RotateCcw aria-hidden className="size-4"/>Reset planning demo</button>
      </div>
      <div className="flex flex-col gap-2 border-b border-border px-5 py-4 text-small md:px-7"><p className="font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">Demo data · Interactive product concept</p><p className="text-text-muted">Fictional providers and shipment records. No live tracking, actual quotations or connected AI. Recommendations below are written examples.</p></div>
      <div className="p-5 md:p-7">
        <Tabs label="International workspace views" idBase="international-workspace" items={[
          {value:"journey",label:"Shipment planning",icon:<Ship aria-hidden className="size-4"/>,content:(
            <div className="pt-7">
              <div className="mb-6 grid gap-5 md:grid-cols-2">
                <div><label htmlFor="international-lane" className="mb-2 block text-small font-medium text-text">Example shipment lane</label><select id="international-lane" value={laneId} onChange={e=>{setLaneId(e.target.value);setReviewed(false);}} className="min-h-12 w-full rounded-control border border-border-control bg-bg px-3 text-small text-text">{lanes.map(l=><option key={l.id} value={l.id}>{l.origin} → {l.destination}</option>)}</select></div>
                <div className="flex flex-col justify-end"><p className="font-mono text-eyebrow text-text-muted">{lane.reference}</p><p className="mt-2 text-body font-medium text-text">{lane.cargo}</p></div>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="rounded-card border border-border p-5">
                  <p className="mb-5 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Global origin → Local destination</p>
                  <ol className="space-y-0">{[
                    {name:lane.origin,detail:"Supplier documents prepared",done:true},
                    {name:route==="air"?"International air freight":"International ocean freight",detail:route==="air"?"Demo Air Forwarding · sample assignment":"Demo Ocean Network · sample assignment",done:true},
                    {name:terminal,detail:"Document review & terminal handoff · pending",done:false},
                    {name:lane.destination,detail:"Local logistics partner · final delivery planned",done:false},
                  ].map((step,i)=><li key={i} className="relative flex gap-4 pb-6 last:pb-0">{i<3?<span aria-hidden className="absolute top-8 bottom-0 left-3.5 w-px bg-border"/>:null}<span aria-hidden className={cn("relative flex size-7 shrink-0 items-center justify-center rounded-full border text-small",step.done?"border-accent bg-accent text-accent-ink":"border-border-control bg-bg text-text-muted")}>{step.done?<Check className="size-3.5"/>:i+1}</span><div><p className="text-body font-medium text-text">{step.name}</p><p className="mt-1 text-small text-text-muted">{step.detail}</p></div></li>)}</ol>
                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4"><div><p className="text-small text-text-muted">Documents</p><p className="mt-1 text-small text-text">Packing list · demo draft</p></div><div><p className="text-small text-text-muted">Quotation</p><p className="mt-1 text-small text-text">Awaiting provider quote</p></div></div>
                </div>
                <div className="flex flex-col gap-4">
                  <fieldset><legend className="mb-3 text-small font-medium text-text">Compare transport combinations</legend><div className="grid gap-3">{[{id:"ocean",label:"Ocean + local road",note:"For consolidated, less time-sensitive cargo",Icon:Ship},{id:"air",label:"Air + local road",note:"For urgent, eligible cargo; confirm capacity",Icon:Plane}].map(({id,label,note,Icon})=><label key={id} className={cn("flex cursor-pointer items-start gap-3 rounded-card border p-4",route===id?"border-accent-text bg-accent/10":"border-border bg-bg")}><input type="radio" name="international-route" value={id} checked={route===id} onChange={()=>{setRoute(id);setReviewed(false);}} className="mt-1 accent-accent"/><Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text"/><span><span className="block text-small font-medium text-text">{label}</span><span className="mt-1 block text-small text-text-muted">{note}</span></span></label>)}</div></fieldset>
                  <div className="rounded-card border border-border bg-bg p-5"><p className="mb-2 flex items-center gap-2 text-small font-medium text-text"><Lightbulb aria-hidden className="size-4 text-accent-text"/>Analysis preview</p><p className="text-small text-text-muted">{route==="air"?"Request the airport-to-destination quote together with air carriage. Check cargo eligibility, handling requirements and the document handoff before confirming.":"Compare terminal pickup, inland transport and storage charges together. Confirm the local carrier’s pickup window before committing to the main freight leg."}</p><p className="mt-3 font-mono text-eyebrow uppercase text-text-muted">Scripted example · human decision required</p></div>
                  <Button size="sm" variant="secondary" onClick={()=>{setReviewed(true);setAnnouncement("Sample handoff marked reviewed. No provider was contacted.");}} disabled={reviewed}>{reviewed?"Handoff reviewed · demo":"Mark handoff reviewed"}</Button>
                </div>
              </div>
            </div>
          )},
          {value:"partners",label:"Partner discovery",icon:<Handshake aria-hidden className="size-4"/>,content:(
            <div className="pt-7"><div className="mb-6 grid gap-4 md:grid-cols-3"><div><label htmlFor="provider-search" className="mb-2 block text-small text-text">Cargo or service</label><div className="relative"><Search aria-hidden className="absolute top-3.5 left-3 size-4 text-text-muted"/><input id="provider-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try containers or distribution" className="min-h-11 w-full rounded-control border border-border-control bg-bg pr-3 pl-10 text-small text-text"/></div></div><div><label htmlFor="provider-region" className="mb-2 block text-small text-text">Geography</label><select id="provider-region" value={region} onChange={e=>setRegion(e.target.value)} className="min-h-11 w-full rounded-control border border-border-control bg-bg px-3 text-small text-text">{['All regions','International','India','Europe'].map(v=><option key={v}>{v}</option>)}</select></div><div><label htmlFor="provider-mode" className="mb-2 block text-small text-text">Transport mode</label><select id="provider-mode" value={mode} onChange={e=>setMode(e.target.value)} className="min-h-11 w-full rounded-control border border-border-control bg-bg px-3 text-small text-text">{['All modes','Ocean','Air','Land'].map(v=><option key={v}>{v}</option>)}</select></div></div>
              <p role="status" className="mb-4 text-small text-text-muted">{filtered.length} illustrative provider {filtered.length===1?'profile':'profiles'}</p>
              <div className="grid gap-4 md:grid-cols-2">{filtered.map(p=><article key={p.name} className="rounded-card border border-border bg-bg p-5"><div className="mb-4 flex items-start justify-between gap-4"><h3 className="text-body-l text-text">{p.name}</h3><span className="rounded-full border border-border px-2 py-1 font-mono text-eyebrow text-text-muted">DEMO</span></div><p className="text-small text-accent-text">{p.region} · {p.modes}</p><dl className="mt-4 grid gap-2 text-small"><div><dt className="inline text-text-muted">Cargo: </dt><dd className="inline text-text">{p.cargo}</dd></div><div><dt className="inline text-text-muted">Service: </dt><dd className="inline text-text">{p.service}</dd></div></dl><p className="mt-4 border-t border-border pt-3 text-small text-text-muted">Sample profile, not an available or verified carrier.</p></article>)}</div>
              {filtered.length===0?<div className="rounded-card border border-border p-7 text-center"><p className="text-text">No example providers match.</p><button onClick={()=>{setQuery('');setRegion('All regions');setMode('All modes');}} className="mt-3 min-h-11 text-small text-accent-text underline">Clear discovery filters</button></div>:null}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5"><p className="max-w-xl text-small text-text-muted">Run a freight or logistics business? Tell us which lanes and services you cover, and help shape this research.</p><Button href="/contact?interest=partnership" variant="secondary" icon={<ArrowRight aria-hidden className="size-4"/>}>Discuss partnership</Button></div>
            </div>
          )}
        ]}/>
        <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
      </div>
    </section>
  );
}
