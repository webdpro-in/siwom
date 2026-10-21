import { CheckCircle2, Eye, Megaphone, ScanSearch, UserCheck } from "lucide-react";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Callout } from "@/components/ui/Callout";
import { Stepper, type Step } from "@/components/ui/Stepper";

/** Shared Safety content used on the homepage and on /safety. */

export function SafetyDisclaimer({ className }: { className?: string }) {
  return (
    <Callout variant="safety" title="About these detections" className={className}>
      Real photographs with manually authored sample review areas; no AI has analysed these images and no actual violation is asserted. Real-world performance depends on camera quality, sensor coverage,
      lighting, weather and validation. AI flags potential hazards for qualified human review; it does not certify a
      site as safe or assess hidden structural, electrical or material defects.
    </Callout>
  );
}

export const workflowSteps: Step[] = [
  { title: "Observe", description: "Cameras and suitable sensors capture the scene.", icon: <Eye className="size-4.5" strokeWidth={1.5} /> },
  { title: "Detect", description: "Software flags a potential hazard, with a confidence band.", icon: <ScanSearch className="size-4.5" strokeWidth={1.5} /> },
  { title: "Review", description: "A qualified person checks the flag and decides.", icon: <UserCheck className="size-4.5" strokeWidth={1.5} /> },
  { title: "Respond", description: "People act: inspect, pause work, escalate or dismiss.", icon: <Megaphone className="size-4.5" strokeWidth={1.5} /> },
  { title: "Improve", description: "Outcomes feed back to reduce false alarms over time.", icon: <CheckCircle2 className="size-4.5" strokeWidth={1.5} /> },
];

export function SafetyWorkflow() {
  return <Stepper label="Safety workflow: observe, detect, review, respond, improve" steps={workflowSteps} />;
}

export const limitations: AccordionItem[] = [
  {
    id: "see",
    title: "What can a camera actually see?",
    content: (
      <p>
        Visible surface conditions, where image quality allows: possible dents, corrosion, leaks, missing PPE or
        people inside marked zones. Ordinary cameras cannot assess internal structural integrity, electrical safety
        or hidden material defects. Those need engineering inspections, specialised sensors and non-destructive
        testing.
      </p>
    ),
  },
  {
    id: "reliable",
    title: "How reliable are the detections?",
    content: (
      <p>
        Performance depends on camera quality, sensor coverage, lighting, weather, viewing angle and validation on
        each site&apos;s own data. Expect false alarms and missed detections. Any deployment would be validated on site
        before people rely on it.
      </p>
    ),
  },
  {
    id: "decide",
    title: "Does the AI make safety decisions?",
    content: (
      <p>
        No. It flags potential hazards for qualified human review. People decide what happens next and remain
        accountable. It never certifies a site, an asset or a lift as safe.
      </p>
    ),
  },
  {
    id: "control",
    title: "Can it control cranes, vehicles or machinery?",
    content: (
      <p>
        No. SIWOM does not control cranes, vehicles or dangerous machinery. Any stop or pause is a human decision made
        through the site&apos;s existing procedures.
      </p>
    ),
  },
  {
    id: "start",
    title: "How do we get started?",
    content: (
      <p>
        We start with one site and its existing cameras, assess what is feasible, and agree how flags are reviewed under
        the site&apos;s safety processes.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "What about workers' privacy?",
    content: (
      <p>
        Our approach is to flag conditions, not identify people: no face recognition, footage access limited by role,
        and retention periods agreed with each site.
      </p>
    ),
  },
];

export function SafetyLimitations({ headingLevel = "h3" }: { headingLevel?: "h3" | "h4" }) {
  return <Accordion items={limitations} headingLevel={headingLevel} />;
}
