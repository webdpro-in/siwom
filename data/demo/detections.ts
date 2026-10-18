import type { StaticImageData } from "next/image";
import type { Severity } from "@/components/ui/SeverityBadge";
import damageImg from "@/public/images/safety-container-photo.webp";
import ppeImg from "@/public/images/safety-ppe-photo.webp";
import zoneImg from "@/public/images/safety-zone-photo.webp";

/*
 * ILLUSTRATIVE DEMO DATA. Real reference photos with manually authored review areas.
 * No AI has analysed these photographs; no actual violation is asserted.
 * Confidence is a qualitative, illustrative band — never a measured score.
 * Box coordinates are in the 1600 × 900 frame space.
 */

export type Confidence = "Low" | "Moderate" | "High";
export type ReviewStatus = "pending" | "confirmed" | "dismissed" | "escalated";

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  pending: "Pending review",
  confirmed: "Confirmed",
  dismissed: "Dismissed",
  escalated: "Escalated",
};

export type Detection = {
  id: string;
  label: string;
  type: string;
  severity: Severity;
  confidence: Confidence;
  box: { x: number; y: number; w: number; h: number };
  description: string;
  nextStep: string;
  /** Context-only detections (e.g. "PPE visible") are not hazards to review. */
  reviewable: boolean;
};

export type ScenarioId = "damage" | "ppe" | "zone";

export type Scenario = {
  id: ScenarioId;
  tab: string;
  title: string;
  image: StaticImageData;
  alt: string;
  camera: string;
  location: string;
  capturedAt: string;
  sceneNote: string;
  detections: Detection[];
};

export const FRAME = { width: 1600, height: 900 } as const;

export const scenarios: Scenario[] = [
  {
    id: "damage",
    tab: "Visible damage",
    title: "Container side panel inspection",
    image: damageImg,
    alt: "Close-up of a weathered shipping-container door, latch and painted surface.",
    camera: "CAM-07",
    location: "Yard B, Bay 4 — demo",
    capturedAt: "14:12:08 IST",
    sceneNote: "Real reference photograph. Review areas and confidence labels are scripted demo examples, not AI findings.",
    detections: [
      {
        id: "DET-2041",
        label: "Latch condition review",
        type: "Visible condition · hardware review",
        severity: "high",
        confidence: "Moderate",
        box: { x: 336, y: 297, w: 1040, h: 198 },
        description: "A manually selected area around the container latch. A reviewer would inspect its condition; the image alone does not establish a defect.",
        nextStep: "Ask a qualified inspector to assess the latch and record the outcome before deciding on further action.",
        reviewable: true,
      },
      {
        id: "DET-2042",
        label: "Surface condition review",
        type: "Visible condition · weathered paint",
        severity: "medium",
        confidence: "High",
        box: { x: 128, y: 558, w: 512, h: 306 },
        description: "Weathering and paint variation are visible in this reference area. This scripted example does not determine corrosion depth or structural condition.",
        nextStep: "Log it for the next condition survey. A camera cannot judge how deep corrosion goes.",
        reviewable: true,
      },
    ],
  },
  {
    id: "ppe",
    tab: "PPE check",
    title: "Industrial PPE review",
    image: ppeImg,
    alt: "Three industrial workers wearing helmets and safety glasses inside a steel facility.",
    camera: "CAM-12",
    location: "Yard A, Lane 2 — demo",
    capturedAt: "14:18:41 IST",
    sceneNote: "Real reference photograph of protected workers. Manually placed review areas do not indicate a safety violation.",
    detections: [
      {
        id: "DET-2050",
        label: "PPE visible",
        type: "Context · head protection visible",
        severity: "low",
        confidence: "High",
        box: { x: 387, y: 284, w: 184, h: 122 },
        description: "A helmet and eye protection are visible on this worker. This is a manual reference label, not a model detection.",
        nextStep: "No action needed.",
        reviewable: false,
      },
      {
        id: "DET-2051",
        label: "Head protection review",
        type: "PPE review · suitability check",
        severity: "high",
        confidence: "Moderate",
        box: { x: 640, y: 216, w: 139, h: 112 },
        description: "A helmet is visible. This fictional review task asks whether visible protection meets the site’s requirements; it does not claim this worker is unsafe.",
        nextStep: "A qualified supervisor would verify required protection using site rules and additional evidence.",
        reviewable: true,
      },
    ],
  },
  {
    id: "zone",
    tab: "Restricted zone",
    title: "Terminal access review",
    image: zoneImg,
    alt: "Freight terminal with a truck, containers and marked vehicle lanes.",
    camera: "CAM-03",
    location: "Yard B, Bay 9 — demo",
    capturedAt: "14:24:55 IST",
    sceneNote: "Real reference photograph. Zone review areas are fictional interface examples; no restricted-zone entry is established.",
    detections: [
      {
        id: "DET-2062",
        label: "Vehicle visible",
        type: "Context · terminal vehicle",
        severity: "low",
        confidence: "High",
        box: { x: 504, y: 500, w: 464, h: 90 },
        description: "A freight vehicle is visible in the terminal. Its presence alone is not a hazard.",
        nextStep: "No action on its own; used to judge nearby activity.",
        reviewable: false,
      },
      {
        id: "DET-2061",
        label: "Zone boundary review",
        type: "Restricted zone · access-rule review",
        severity: "critical",
        confidence: "High",
        box: { x: 992, y: 495, w: 576, h: 72 },
        description: "A manually selected area of painted terminal markings. The photograph does not establish access rules or a violation.",
        nextStep: "Check the site’s access plan and current operating conditions before deciding whether any intervention is necessary.",
        reviewable: true,
      },
    ],
  },
];

export type LogEntry = { time: string; detectionId: string; label: string; action: string; note?: string };

/** Earlier entries so the log shows history before the visitor acts. */
/** Newest first, like the entries the visitor adds. */
export const initialLog: LogEntry[] = [
  {
    time: "14:05:47 IST",
    detectionId: "DET-2037",
    label: "Person near reversing truck",
    action: "Escalated",
    note: "Sent to shift supervisor (demo reviewer)",
  },
  {
    time: "13:58:12 IST",
    detectionId: "DET-2033",
    label: "Possible spill",
    action: "Dismissed",
    note: "Reflection on wet ground (demo reviewer)",
  },
];
