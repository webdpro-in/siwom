import type { Severity } from "@/components/ui/SeverityBadge";

/* ILLUSTRATIVE DEMO DATA. Fictional delivery exceptions. */

export type DeliveryException = {
  id: string;
  shipmentId: string;
  severity: Severity;
  title: string;
  reason: string;
  /** Change versus planned ETA, for display. */
  delay: string;
  raisedAt: string;
  suggestedStep: string;
};

export const exceptions: DeliveryException[] = [
  {
    id: "EXC-317",
    shipmentId: "SHP-24-0933",
    severity: "critical",
    title: "Berth window missed",
    reason: "Feeder vessel FDR-03 missed its berth window at Nhava Sheva and is waiting at anchorage.",
    delay: "+9 h 00 min",
    raisedAt: "18 Oct, 11:20 IST",
    suggestedStep: "Request a revised berth slot and tell the consignee the new delivery window.",
  },
  {
    id: "EXC-321",
    shipmentId: "SHP-24-0954",
    severity: "high",
    title: "Breakdown reported near Kurnool",
    reason: "The driver reported a breakdown. A replacement tractor has been requested.",
    delay: "+4 h 15 min",
    raisedAt: "18 Oct, 12:05 IST",
    suggestedStep: "Confirm the replacement tractor's arrival time and move the Hyderabad unloading slot.",
  },
  {
    id: "EXC-311",
    shipmentId: "SHP-24-0918",
    severity: "high",
    title: "Unplanned halt near Dhule",
    reason: "TRK-0142 has been stationary for 2 h 40 min outside a planned stop.",
    delay: "+6 h 30 min",
    raisedAt: "18 Oct, 09:50 IST",
    suggestedStep: "Call the driver to confirm status, then rebook the Nagpur unloading slot if needed.",
  },
  {
    id: "EXC-316",
    shipmentId: "SHP-24-0927",
    severity: "medium",
    title: "E-way bill expires before revised ETA",
    reason: "The e-way bill validity ends at 23:59 IST; the revised ETA is 19 Oct, 05:10.",
    delay: "+2 h 10 min",
    raisedAt: "18 Oct, 13:40 IST",
    suggestedStep: "Extend the e-way bill validity before 23:59 IST.",
  },
  {
    id: "EXC-314",
    shipmentId: "SHP-24-0921",
    severity: "medium",
    title: "Train held for path near Palanpur",
    reason: "RAKE-07 is held for a path and is expected to run 3 h 40 min late.",
    delay: "+3 h 40 min",
    raisedAt: "18 Oct, 10:15 IST",
    suggestedStep: "Tell the ICD about the late arrival and hold the outbound truck bookings.",
  },
  {
    id: "EXC-319",
    shipmentId: "SHP-24-0945",
    severity: "low",
    title: "Driver duty hours approaching limit",
    reason: "The driver of TRK-0231 reaches the planned duty-hour limit before Kolkata.",
    delay: "+2 h 30 min",
    raisedAt: "18 Oct, 13:05 IST",
    suggestedStep: "Arrange a relay driver at Raipur.",
  },
];
