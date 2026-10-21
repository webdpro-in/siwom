"use client";

import { useState } from "react";
import { Activity, Gauge, MapPin } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column, type SortState } from "@/components/ui/DataTable";
import { CheckboxField, RadioCardGroup, SelectField, TextareaField, TextField } from "@/components/ui/Field";
import { FilterChips } from "@/components/ui/FilterChips";
import { SeverityBadge, type Severity } from "@/components/ui/SeverityBadge";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";

type Row = { id: string; route: string; severity: Severity; eta: string; km: number };
const rows: Row[] = [
  { id: "SHP-24-0918", route: "Nhava Sheva → Nagpur", severity: "high", eta: "19 Oct, 02:30", km: 820 },
  { id: "SHP-24-0924", route: "Chennai → Bengaluru", severity: "low", eta: "18 Oct, 17:05", km: 345 },
  { id: "SHP-24-0933", route: "Mundra → Nhava Sheva", severity: "critical", eta: "18 Oct, 21:00", km: 640 },
];
const columns: Column<Row, "id" | "route" | "severity" | "eta" | "km">[] = [
  { key: "id", header: "Shipment", cell: (r) => r.id, sortable: true },
  { key: "route", header: "Route", cell: (r) => r.route },
  { key: "severity", header: "Severity", cell: (r) => <SeverityBadge severity={r.severity} /> },
  { key: "eta", header: "ETA", cell: (r) => r.eta },
  { key: "km", header: "Distance", cell: (r) => `${r.km.toLocaleString("en-IN")} km`, sortable: true, align: "right" },
];

export function InteractiveSamples() {
  const { notify } = useToast();
  const [sort, setSort] = useState<SortState<"id" | "km">>({ key: "id", direction: "asc" });
  const [selected, setSelected] = useState<string | null>("SHP-24-0918");
  const [chips, setChips] = useState<string[]>(["delayed"]);
  const [single, setSingle] = useState<string[]>(["road"]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sorted = [...rows].sort((a, b) => {
    if (!sort) return 0;
    const dir = sort.direction === "asc" ? 1 : -1;
    return sort.key === "km" ? (a.km - b.km) * dir : a.id.localeCompare(b.id) * dir;
  });

  return (
    <div className="flex flex-col gap-16">
      <Sample title="Tabs (underline, arrow-key navigation)">
        <Tabs
          label="Sample tabs"
          items={[
            { value: "overview", label: "Overview", icon: <Gauge aria-hidden className="size-4" />, content: <p className="pt-4 text-text-muted">Overview panel.</p> },
            { value: "shipments", label: "Shipments", icon: <MapPin aria-hidden className="size-4" />, content: <p className="pt-4 text-text-muted">Shipments panel.</p> },
            { value: "activity", label: "Activity", icon: <Activity aria-hidden className="size-4" />, content: <p className="pt-4 text-text-muted">Activity panel.</p> },
          ]}
        />
        <Tabs
          variant="chips"
          className="mt-6"
          label="Sample chip tabs"
          items={[
            { value: "a", label: "Visible damage", content: null },
            { value: "b", label: "PPE check", content: null },
            { value: "c", label: "Restricted zone", content: null },
          ]}
          renderPanels={false}
        />
      </Sample>

      <Sample title="Filter chips (multi and single select, active count, clear all)">
        <div className="flex flex-col gap-4">
          <FilterChips
            label="Status"
            options={[
              { value: "on-time", label: "On time" },
              { value: "at-risk", label: "At risk" },
              { value: "delayed", label: "Delayed" },
            ]}
            selected={chips}
            onToggle={(v) => setChips((c) => (c.includes(v) ? c.filter((x) => x !== v) : [...c, v]))}
            onClear={() => setChips([])}
          />
          <FilterChips
            label="Mode"
            multiple={false}
            options={[
              { value: "road", label: "Road" },
              { value: "rail", label: "Rail" },
              { value: "port", label: "Port" },
            ]}
            selected={single}
            onToggle={(v) => setSingle([v])}
          />
        </div>
      </Sample>

      <Sample title="Data table (sortable, sticky header, selected row) — stacked cards below 768 px">
        <div className="overflow-hidden rounded-card border border-border">
          <DataTable
            caption="Sample shipments"
            columns={columns}
            rows={sorted}
            getRowId={(r) => r.id}
            rowLabel={(r) => r.id}
            selectedId={selected}
            onSelect={setSelected}
            sort={sort}
            onSortChange={(key) =>
              setSort((s) =>
                key === "id" || key === "km"
                  ? { key, direction: s?.key === key && s.direction === "asc" ? "desc" : "asc" }
                  : s,
              )
            }
          />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-border">
            <DataTable caption="Loading sample" columns={columns} rows={[]} getRowId={(r) => r.id} rowLabel={(r) => r.id} loading />
          </div>
          <EmptyState
            title="No shipments match these filters"
            description="Try removing a filter."
            action={<Button variant="secondary" size="sm">Clear filters</Button>}
          />
          <ErrorState reason="The sample data could not be read. Nothing was lost." onRetry={() => notify({ kind: "success", title: "Retried" })} />
        </div>
      </Sample>

      <Sample title="Accordion (single-open)">
        <Accordion
          type="single"
          items={[
            { id: "one", title: "Can a camera see internal damage?", content: <p>No. Ordinary cameras only see surfaces.</p> },
            { id: "two", title: "Who decides what happens next?", content: <p>A qualified person, every time.</p> },
          ]}
        />
      </Sample>

      <Sample title="Toasts (success auto-dismisses after 6 s; errors stay)">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => notify({ kind: "success", title: "Exception acknowledged", description: "EXC-317 moved to acknowledged." })}>
            Show success toast
          </Button>
          <Button variant="secondary" onClick={() => notify({ kind: "error", title: "Could not send", description: "Check your connection and try again." })}>
            Show error toast
          </Button>
        </div>
      </Sample>

      <Sample title="Form fields (default, helper, error, disabled)">
        <form className="grid max-w-narrow gap-6" onSubmit={(e) => e.preventDefault()} noValidate>
          <TextField id="sg-name" label="Full name" required autoComplete="name" />
          <TextField id="sg-email" label="Work email" type="email" required helper="We only use this to reply." error="Enter an email like name@company.com" defaultValue="name@" />
          <SelectField id="sg-industry" label="Industry" required options={[{ value: "ports", label: "Ports and maritime" }]} />
          <TextField id="sg-disabled" label="Disabled field" disabled defaultValue="Not editable" />
          <TextareaField id="sg-message" label="Message" required count={message.length} maxCount={2000} value={message} onChange={(e) => setMessage(e.target.value)} />
          <RadioCardGroup
            name="sg-interest"
            legend="Area of interest"
            required
            options={[
              { value: "logistics", label: "Logistics" },
              { value: "safety", label: "Safety" },
              { value: "other", label: "Other" },
            ]}
          />
          <CheckboxField id="sg-pilot" label="I'm interested in a pilot" />
          <CheckboxField id="sg-consent" label="I agree to the Privacy Policy" required error="Tick this box to continue" />
          <div className="flex gap-3">
            <Button type="submit" loading={loading} icon="arrow" onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 1500); }}>
              {loading ? "Sending…" : "Send message"}
            </Button>
            <Button type="button" variant="destructive">Clear form</Button>
          </div>
        </form>
      </Sample>
    </div>
  );
}

function Sample({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">{title}</h3>
      {children}
    </div>
  );
}
