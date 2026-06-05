// ── Family taxonomy ─────────────────────────────────────────

export type LogbookFamily =
  | "equipment-status"
  | "maintenance"
  | "cleaning"
  | "calibration"
  | "rounds"
  | "handover";

export type LogbookScope = "primary" | "adjacent" | "oos";

export const FAMILY_META: Record<
  LogbookFamily,
  { label: string; short: string; scope: LogbookScope; description: string }
> = {
  "equipment-status": {
    label: "Equipment Status & Use",
    short: "Status & Use",
    scope: "primary",
    description: "Readiness, in-service state, last use",
  },
  maintenance: {
    label: "Maintenance & Repair",
    short: "Maintenance",
    scope: "primary",
    description: "Troubleshooting, repairs, temporary mitigations",
  },
  cleaning: {
    label: "Cleaning, Sanitation & Line Clearance",
    short: "Cleaning",
    scope: "adjacent",
    description: "Cleaning verification, line clearance",
  },
  calibration: {
    label: "Calibration & Verification",
    short: "Calibration",
    scope: "adjacent",
    description: "Daily verification, post-maintenance checks",
  },
  rounds: {
    label: "Utility & Facility Rounds",
    short: "Rounds",
    scope: "oos",
    description: "Routes, checkpoint readings (post-v1)",
  },
  handover: {
    label: "Shift Handover & Notes",
    short: "Handover",
    scope: "oos",
    description: "Shift continuity (post-v1)",
  },
};

export interface Logbook {
  id: string;
  name: string;
  location: string;
  lastEntry: string;
  status: "active" | "archived";
  entryCount: number;
  fieldCount: number;
  format?: "digital" | "paper";
  family?: LogbookFamily;
}

// ── Field model ─────────────────────────────────────────────

export interface FieldLimits {
  min?: number;
  max?: number;
  /** Optional friendly description of the criteria, e.g. "Action limit 18–24 °C" */
  description?: string;
}

export type FormFieldType =
  | "text"
  | "number"
  | "datetime"
  | "textarea"
  | "toggle"
  | "dropdown"
  | "attachment"
  | "parts-used"
  | "linked-wo"
  | "status"
  | "triplet";

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  value: string;
  prefilled: boolean;
  timeSensitive: boolean;
  unit?: string;
  readOnly?: boolean;
  /** Evaluation Service-style numeric limits, evaluated on-device */
  limits?: FieldLimits;
  /** For toggle fields, declares which state passes the criterion */
  passWhen?: "pass" | "fail";
  /** Options for dropdown / status / symptom fields */
  options?: string[];
  /** Photo / attachment must be present when an upstream verdict fails */
  requiredOnFail?: boolean;
  /** For triplet (expected/observed/as-left), shared limits apply to observed & as-left */
  triplet?: { expected: string; tolerance: number; unit?: string };
  /** Helper hint shown under the label */
  help?: string;
}

export type FieldType = "Text" | "Number" | "Date" | "Time" | "Text Area" | "Toggle";

export interface ScanField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  approved: boolean;
  fieldType: FieldType;
  colSpan: 1 | 2;
  rowHeight: "short" | "tall";
}

export interface SyncEntry {
  id: string;
  entryName: string;
  logbook: string;
  timestamp: string;
  status: "awaiting" | "issue" | "success";
  error?: string;
}

export const mockLogbooks: Logbook[] = [
  { id: "1", name: "Clean Room Environmental Log", location: "Building 3, Floor 2", lastEntry: "2 hours ago", status: "active", entryCount: 142, fieldCount: 8, family: "rounds" },
  { id: "2", name: "Equipment Calibration Log", location: "Lab A", lastEntry: "Yesterday", status: "active", entryCount: 89, fieldCount: 12, family: "calibration" },
  { id: "3", name: "Water System Monitoring Log", location: "Utilities", lastEntry: "3 hours ago", status: "active", entryCount: 312, fieldCount: 6, family: "rounds" },
  { id: "4", name: "pH/Conductivity Meter Daily Use Log", location: "Cold Storage B", lastEntry: "1 day ago", status: "active", entryCount: 56, fieldCount: 14, format: "paper", family: "calibration" },
  { id: "5", name: "Batch Weighing Log", location: "Production Suite 1", lastEntry: "30 min ago", status: "active", entryCount: 203, fieldCount: 10, family: "equipment-status" },
];

export const cleanRoomFormFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "operator", label: "Operator", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "room", label: "Room", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "temperature", label: "Temperature (°C)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "°C", limits: { min: 18, max: 24, description: "Action limit 18.0–24.0 °C (ISO 14644)" } },
  { id: "humidity", label: "Humidity (%RH)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "%RH", limits: { min: 30, max: 60, description: "Action limit 30–60 %RH" } },
  { id: "pressure", label: "Differential Pressure (Pa)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "Pa", limits: { min: 5, max: 20, description: "Differential ≥ 5 Pa, ≤ 20 Pa" } },
  { id: "particle05", label: "Particle Count (0.5µm)", type: "number", value: "", prefilled: false, timeSensitive: false, limits: { max: 3520, description: "ISO 7 limit ≤ 3,520 particles/m³" } },
  { id: "particle50", label: "Particle Count (5.0µm)", type: "number", value: "", prefilled: false, timeSensitive: false, limits: { max: 29, description: "ISO 7 limit ≤ 29 particles/m³" } },
  { id: "observations", label: "Observations", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "status", label: "Status", type: "toggle", value: "pass", prefilled: false, timeSensitive: false, passWhen: "pass" },
];

export const phConductivityFormFields: FormField[] = [
  { id: "equipmentId", label: "Equipment ID Number", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "date", label: "Date", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "phBufferSolution", label: "pH Buffer Solution*", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "bufferSolutionLot", label: "Buffer Solution Lot #", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "bufferExpDate", label: "Buffer Solution Expiration Date", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "slopePct", label: "Slope (%)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "%" },
  { id: "slopeInRange", label: "Slope Within Range? (92.0%–102.0%)", type: "toggle", value: "", prefilled: false, timeSensitive: false },
  { id: "conductivityStdUnit", label: "Conductivity Standard (Select U/M)", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "conductivityStdLot", label: "Conductivity Standard Lot #", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "conductivityExpDate", label: "Conductivity Standard Expiration Date", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "stdVerificationUnit", label: "Standard Verification (Select U/M)", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "stdVerInRange", label: "Standard Verification Within Range? (±5%)", type: "toggle", value: "", prefilled: false, timeSensitive: false },
  { id: "performedBy", label: "Performed by Initials/Date", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "verifiedBy", label: "Verified by Initials/Date", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "comments", label: "Comments", type: "textarea", value: "", prefilled: false, timeSensitive: false },
];

// ── 8 example logbooks from Core Problems doc ───────────────

// 1A: Autoclave Daily Use & Cycle Readiness
export const autoclaveDailyUseFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "operator", label: "Operator", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "currentStatus", label: "Current Status", type: "status", value: "in-service", prefilled: true, timeSensitive: false, options: ["in-service", "out-of-service", "under-maintenance"], help: "Pre-filled from asset record" },
  { id: "lastCycleTime", label: "Last Completed Cycle", type: "text", value: "Yesterday, 11:42 PM (Cycle #A101-1893)", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "doorGasket", label: "Door Gasket Condition", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass" },
  { id: "drainCheck", label: "Drain Check", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass" },
  { id: "chamberEmpty", label: "Chamber Empty Verification", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass" },
  { id: "failurePhoto", label: "Photo Evidence (required on any failed check)", type: "attachment", value: "", prefilled: false, timeSensitive: false, requiredOnFail: true },
  { id: "reason", label: "Reason / Notes", type: "textarea", value: "", prefilled: false, timeSensitive: false },
];

// 1B: Torque Wrench Checkout / Return
export const torqueWrenchFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "operator", label: "Checked Out By", type: "text", value: "", prefilled: true, timeSensitive: false, help: "Auto-filled from signed-in user" },
  { id: "tool", label: "Tool", type: "text", value: "Torque Wrench TW-044", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "workOrder", label: "Intended Job (Work Order)", type: "linked-wo", value: "", prefilled: false, timeSensitive: false },
  { id: "checkoutCondition", label: "Condition on Checkout", type: "dropdown", value: "", prefilled: false, timeSensitive: false, options: ["Good", "Damaged"] },
  { id: "returnCondition", label: "Condition on Return", type: "dropdown", value: "", prefilled: false, timeSensitive: false, options: ["Good", "Damaged"] },
  { id: "cleaningConfirmed", label: "Cleaning Confirmed", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass" },
  { id: "storageLocation", label: "Storage Location", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "damagePhoto", label: "Damage Photo (required if damaged)", type: "attachment", value: "", prefilled: false, timeSensitive: false, requiredOnFail: true },
];

// 2A: Packaging Line Clearance Between Lots
export const lineClearanceFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "line", label: "Line", type: "text", value: "Packaging Line P-2", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "lineLead", label: "Line Lead", type: "text", value: "", prefilled: true, timeSensitive: false },
  { id: "previousLot", label: "Previous Lot ID", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "nextLot", label: "Next Lot ID", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "materialsRemoved", label: "Previous lot materials removed", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass" },
  { id: "labelRecon", label: "Label reconciliation completed", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass" },
  { id: "trashSurfaces", label: "Trash removed, surfaces wiped, bins cleared", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass" },
  { id: "linePhoto", label: "Cleared Line Photo", type: "attachment", value: "", prefilled: false, timeSensitive: false, help: "Required evidence" },
  { id: "labelPhoto", label: "Label Station Photo", type: "attachment", value: "", prefilled: false, timeSensitive: false, help: "Required evidence" },
  { id: "notes", label: "Corrective Notes (if any step failed)", type: "textarea", value: "", prefilled: false, timeSensitive: false },
];

// 2B: CIP Skid Post-Clean Verification
export const cipVerificationFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "skid", label: "CIP Skid", type: "text", value: "CIP-03", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "cycleId", label: "Cycle ID", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "cycleStart", label: "Cycle Start", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "cycleEnd", label: "Cycle End", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "detergentLot", label: "Detergent Lot #", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "finalRinseCond", label: "Final Rinse Conductivity (µS/cm)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "µS/cm", limits: { max: 5, description: "Action limit ≤ 5 µS/cm" } },
  { id: "rerinseRequired", label: "Re-rinse Required", type: "toggle", value: "fail", prefilled: false, timeSensitive: false, passWhen: "fail", help: "Auto-flags on OOL conductivity" },
  { id: "rerinseNotes", label: "Re-rinse Notes (if rework)", type: "textarea", value: "", prefilled: false, timeSensitive: false },
];

// 3A: Unplanned Downtime Troubleshooting
export const downtimeTroubleshootFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "asset", label: "Asset", type: "text", value: "Filler F-220", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "downtimeStart", label: "Downtime Start", type: "datetime", value: "", prefilled: false, timeSensitive: true },
  { id: "symptom", label: "Symptom Category", type: "dropdown", value: "", prefilled: false, timeSensitive: false, options: ["Leak", "Sensor Fault", "Jam", "Electrical", "Vibration", "Other"] },
  { id: "observations", label: "Observations", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "containment", label: "Immediate Containment", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "diagnostic", label: "Diagnostic Checks Performed", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "parts", label: "Parts Used", type: "parts-used", value: "", prefilled: false, timeSensitive: false },
  { id: "linkedWO", label: "Linked Work Order", type: "linked-wo", value: "", prefilled: false, timeSensitive: false, help: "Auto-created or paste WO #" },
  { id: "evidence", label: "Photo Evidence", type: "attachment", value: "", prefilled: false, timeSensitive: false },
];

// 3B: Temporary Mitigation
export const mitigationFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "asset", label: "Asset", type: "text", value: "HVAC AHU-7", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "originalSetpoint", label: "Original Setpoint", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "tempSetpoint", label: "Temporary Setpoint", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "rationale", label: "Rationale", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "riskNotes", label: "Risk Notes", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "startDate", label: "Start", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "plannedEnd", label: "Planned End", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "linkedWO", label: "Linked Work Order (permanent fix)", type: "linked-wo", value: "", prefilled: false, timeSensitive: false },
  { id: "dailyCheckReminder", label: "Daily verification entry will be required while open", type: "toggle", value: "pass", prefilled: true, timeSensitive: false, passWhen: "pass", readOnly: true },
];

// 4A: Daily Verification of a Critical Scale
export const scaleVerificationFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "operator", label: "Operator", type: "text", value: "", prefilled: true, timeSensitive: false },
  { id: "asset", label: "Scale", type: "text", value: "Scale S-015", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "standardId", label: "Standard Weight ID", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "expected", label: "Expected Value (g)", type: "number", value: "500.000", prefilled: true, timeSensitive: false, unit: "g", readOnly: true },
  { id: "observed", label: "Observed Value (g)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "g", limits: { min: 499.95, max: 500.05, description: "Tolerance ±0.05 g (±0.01 %)" } },
  { id: "stopUse", label: "Place Asset Out of Service (on OOT)", type: "toggle", value: "", prefilled: false, timeSensitive: false, passWhen: "pass", help: "Required if observed value is out of tolerance" },
  { id: "notes", label: "Notes", type: "textarea", value: "", prefilled: false, timeSensitive: false },
];

// 4B: Post-Maintenance Instrument Check
export const postMaintCheckFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "calTech", label: "Calibration Technician", type: "text", value: "", prefilled: true, timeSensitive: false },
  { id: "asset", label: "Instrument", type: "text", value: "Pressure Transmitter PT-88", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "linkedWO", label: "Work Order Reference", type: "linked-wo", value: "", prefilled: false, timeSensitive: false },
  { id: "triplet", label: "As-Found / Adjustment / As-Left (psi)", type: "triplet", value: "", prefilled: false, timeSensitive: false, unit: "psi", triplet: { expected: "100.0", tolerance: 0.5, unit: "psi" } },
  { id: "setupPhoto", label: "Setup Photo", type: "attachment", value: "", prefilled: false, timeSensitive: false, help: "Required if procedure mandates" },
  { id: "verifierRequired", label: "Second-person verification required", type: "toggle", value: "pass", prefilled: true, timeSensitive: false, passWhen: "pass", readOnly: true },
];

// ── Field-set registry keyed by logbook / instance id ───────

export const fieldsByLogbookId: Record<string, FormField[]> = {
  // legacy
  "1": cleanRoomFormFields,
  "4": phConductivityFormFields,
  // 8 example instances
  "inst-eq-01": autoclaveDailyUseFields,
  "inst-eq-02": torqueWrenchFields,
  "inst-cl-01": lineClearanceFields,
  "inst-cl-02": cipVerificationFields,
  "inst-mt-01": downtimeTroubleshootFields,
  "inst-mt-02": mitigationFields,
  "inst-cb-01": scaleVerificationFields,
  "inst-cb-02": postMaintCheckFields,
};

export const mockScanResults: ScanField[] = [
  { id: "s1", name: "Date", value: "02/27/2026", confidence: 98, approved: false, fieldType: "Date", colSpan: 1, rowHeight: "short" },
  { id: "s2", name: "Equipment ID Number", value: "PH-2041", confidence: 96, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s3", name: "pH Buffer Solution", value: "7.00", confidence: 94, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s4", name: "Buffer Solution Lot #", value: "BUF-20260115", confidence: 91, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s5", name: "Buffer Solution Exp. Date", value: "08/15/2026", confidence: 93, approved: false, fieldType: "Date", colSpan: 1, rowHeight: "short" },
  { id: "s6", name: "Slope (%)", value: "97.2", confidence: 88, approved: false, fieldType: "Number", colSpan: 1, rowHeight: "short" },
  { id: "s7", name: "Slope Within Range? (Yes/No)", value: "Yes", confidence: 95, approved: false, fieldType: "Toggle", colSpan: 1, rowHeight: "short" },
  { id: "s8", name: "Conductivity Standard (U/M)", value: "µS/cm", confidence: 73, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s9", name: "Conductivity Std. Lot #", value: "CS-884520", confidence: 65, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s10", name: "Conductivity Std. Exp. Date", value: "11/30/2026", confidence: 89, approved: false, fieldType: "Date", colSpan: 1, rowHeight: "short" },
  { id: "s11", name: "Std. Verification (U/M)", value: "µS/cm", confidence: 72, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s12", name: "Std. Verification Within Range?", value: "Yes", confidence: 90, approved: false, fieldType: "Toggle", colSpan: 1, rowHeight: "short" },
  { id: "s13", name: "Performed by Initials/Date", value: "JM 02/27", confidence: 85, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s14", name: "Verified by Initials/Date", value: "KL 02/27", confidence: 45, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s15", name: "Comments", value: "No issues observed", confidence: 50, approved: false, fieldType: "Text Area", colSpan: 2, rowHeight: "tall" },
];

export const mockSyncQueue: SyncEntry[] = [
  { id: "q1", entryName: "Environmental Reading #1247", logbook: "Clean Room Environmental Log", timestamp: "Today, 2:34 PM", status: "awaiting" },
  { id: "q2", entryName: "Calibration Check #892", logbook: "Equipment Calibration Log", timestamp: "Today, 1:15 PM", status: "issue", error: "Timestamp conflict with server record" },
  { id: "q3", entryName: "Water Quality #445", logbook: "Water System Monitoring Log", timestamp: "Today, 11:00 AM", status: "success" },
];
