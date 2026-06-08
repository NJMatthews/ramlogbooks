// ── Interfaces ──────────────────────────────────────────────

import type { LogbookFamily } from "./mockLogbooks";

export type AssetServiceStatus = "in-service" | "out-of-service" | "under-maintenance";

export interface Asset {
  id: string;
  name: string;
  assetId: string;
  type: string;
  locationId: string;
  logbookCount: number;
  status: "current" | "overdue";
  serviceStatus?: AssetServiceStatus;
}

export interface TemplateField {
  name: string;
  type: "Text" | "Number" | "Date" | "Time" | "Textarea" | "Toggle" | "Dropdown";
  required: boolean;
  validation?: string;
  options?: string[];
  autoFill?: string;
}

export interface LogbookTemplate {
  id: string;
  name: string;
  version: string;
  status: "Published" | "Draft" | "Archived";
  fieldCount: number;
  locationCount: number;
  assetCount: number;
  totalEntries: number;
  fields: TemplateField[];
  modifiedAgo: string;
}

export interface TemplateVersion {
  version: string;
  date: string;
  author: string;
  changeSummary: string;
  status: "Active" | "Superseded";
  entryCount: number;
  fields: TemplateField[];
}

export interface LogbookInstance {
  instanceId: string;
  templateId: string;
  locationId: string;
  assetId: string | null;
  name: string;
  assetName: string | null;
  lastEntry: string;
  lastOperator: string;
  schedule: string;
  isOverdue: boolean;
  fieldCount: number;
  family?: LogbookFamily;
}

export type ReviewStatus =
  | "pending-review"
  | "approved"
  | "rejected"
  | "correction-requested"
  | "returned"
  | "deviation";

export interface AuditTrailEntry {
  action: string;
  timestamp: string;
  actor?: string;
  /** Free-form context, e.g. field name + old/new value, or signature meaning */
  detail?: string;
  /** Optional verdict for events tied to field evaluation */
  verdict?: "pass" | "fail" | "pending";
  priorValue?: string;
  newValue?: string;
  reasonCode?: string;
  hash?: string;
}

export interface ReviewEntryField {
  label: string;
  value: string;
  preFilled?: boolean;
  modified?: { from: string; to: string };
  verdict?: "pass" | "fail";
  trace?: string;
}

export interface ReviewEntry {
  id: string;
  date: string;
  logbook: string;
  location: string;
  asset: string | null;
  operator: string;
  status: ReviewStatus;
  version: string;
  fields: ReviewEntryField[];
  auditTrail: AuditTrailEntry[];
  hasException?: boolean;
  slaBreached?: boolean;
  hoursOpen?: number;
  assignee?: string;
  site?: string;
  capturedAt?: string;
  syncedAt?: string;
  templateHash?: string;
  linkedWorkRequest?: string;
  signatureMeaning?: "Performed" | "Verified" | "Reviewed";
  /** Reason captured when an entry is returned to the operator for correction */
  returnReason?: string;
  /** Deviation reference when an entry is escalated to QA deviation */
  deviationRef?: string;
}

// ── Mock Data ───────────────────────────────────────────────

export const mockAssets: Asset[] = [
  { id: "asset-001", name: "Reactor R-201", assetId: "RAM-3201", type: "Reactor", locationId: "loc-001", logbookCount: 3, status: "current", serviceStatus: "in-service" },
  { id: "asset-002", name: "Mixer M-105", assetId: "RAM-3105", type: "Mixer", locationId: "loc-001", logbookCount: 2, status: "current", serviceStatus: "in-service" },
  { id: "asset-003", name: "Centrifuge C-042", assetId: "RAM-3042", type: "Centrifuge", locationId: "loc-001", logbookCount: 2, status: "overdue", serviceStatus: "in-service" },
  { id: "asset-004", name: "Autoclave A-017", assetId: "RAM-3017", type: "Autoclave", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-005", name: "Fume Hood FH-12", assetId: "RAM-3012", type: "Fume Hood", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-006", name: "pH Meter PH-03", assetId: "RAM-2003", type: "pH Meter", locationId: "loc-002", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-007", name: "Spectrophotometer S-01", assetId: "RAM-2001", type: "Spectrophotometer", locationId: "loc-002", logbookCount: 1, status: "current", serviceStatus: "in-service" },

  // ── v1 scope demo assets (8-example logbooks) ─────────────
  { id: "asset-a101", name: "Autoclave A-101", assetId: "RAM-3101", type: "Autoclave", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-tw044", name: "Torque Wrench TW-044", assetId: "RAM-T044", type: "Tool", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-p2", name: "Packaging Line P-2", assetId: "RAM-P002", type: "Packaging Line", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-cip03", name: "CIP Skid CIP-03", assetId: "RAM-C003", type: "CIP Skid", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-f220", name: "Filler F-220", assetId: "RAM-F220", type: "Filler", locationId: "loc-001", logbookCount: 1, status: "overdue", serviceStatus: "under-maintenance" },
  { id: "asset-ahu7", name: "HVAC AHU-7", assetId: "RAM-AHU7", type: "HVAC", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-s015", name: "Scale S-015", assetId: "RAM-S015", type: "Scale", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
  { id: "asset-pt88", name: "Pressure Transmitter PT-88", assetId: "RAM-PT88", type: "Transmitter", locationId: "loc-001", logbookCount: 1, status: "current", serviceStatus: "in-service" },
];

const cleaningLogFields: TemplateField[] = [
  { name: "Date/Time", type: "Date", required: true },
  { name: "Operator", type: "Text", required: true, autoFill: "Auto-filled from auth" },
  { name: "Equipment ID", type: "Text", required: true, autoFill: "Auto-filled from asset" },
  { name: "Cleaning Agent", type: "Text", required: true },
  { name: "Cleaning Method", type: "Dropdown", required: false, options: ["Manual", "CIP", "SIP"] },
  { name: "Verification", type: "Toggle", required: true },
  { name: "Observations", type: "Textarea", required: false },
];

export const mockTemplates: LogbookTemplate[] = [
  { id: "tpl-001", name: "Cleaning Log", version: "v2.1", status: "Published", fieldCount: 6, locationCount: 3, assetCount: 8, totalEntries: 1247, fields: cleaningLogFields, modifiedAgo: "3 days ago" },
  { id: "tpl-002", name: "Environmental Monitoring Log", version: "v1.0", status: "Published", fieldCount: 8, locationCount: 2, assetCount: 0, totalEntries: 892, fields: [], modifiedAgo: "2 weeks ago" },
  { id: "tpl-003", name: "Calibration Log", version: "v3.0", status: "Published", fieldCount: 12, locationCount: 1, assetCount: 12, totalEntries: 456, fields: [], modifiedAgo: "1 week ago" },
  { id: "tpl-004", name: "Temperature Check Log", version: "v1.2", status: "Published", fieldCount: 4, locationCount: 2, assetCount: 6, totalEntries: 2103, fields: [], modifiedAgo: "5 days ago" },
  { id: "tpl-005", name: "Visitor Access Log", version: "v1.0", status: "Published", fieldCount: 4, locationCount: 4, assetCount: 0, totalEntries: 334, fields: [], modifiedAgo: "1 month ago" },
  { id: "tpl-006", name: "pH Calibration Log", version: "v1.0", status: "Draft", fieldCount: 6, locationCount: 0, assetCount: 0, totalEntries: 0, fields: [], modifiedAgo: "Today" },
];

export const mockTemplateVersions: Record<string, TemplateVersion[]> = {
  "tpl-001": [
    {
      version: "v2.1", date: "Published Feb 20, 2026", author: "N. Matthews",
      changeSummary: "Added 'Cleaning Method' field, updated 'Verification' to required",
      status: "Active", entryCount: 342, fields: cleaningLogFields,
    },
    {
      version: "v2.0", date: "Published Jan 5, 2026", author: "N. Matthews",
      changeSummary: "Reorganized field order, added 'Observations' textarea",
      status: "Superseded", entryCount: 578,
      fields: [
        { name: "Date/Time", type: "Date", required: true },
        { name: "Operator", type: "Text", required: true, autoFill: "Auto-filled from auth" },
        { name: "Equipment ID", type: "Text", required: true, autoFill: "Auto-filled from asset" },
        { name: "Cleaning Agent", type: "Text", required: true },
        { name: "Verification", type: "Toggle", required: false },
        { name: "Observations", type: "Textarea", required: false },
      ],
    },
    {
      version: "v1.0", date: "Published Oct 12, 2025", author: "K. Chen",
      changeSummary: "Initial version",
      status: "Superseded", entryCount: 327,
      fields: [
        { name: "Date/Time", type: "Date", required: true },
        { name: "Operator", type: "Text", required: true },
        { name: "Equipment ID", type: "Text", required: true },
        { name: "Cleaning Agent", type: "Text", required: true },
        { name: "Verification", type: "Toggle", required: false },
      ],
    },
  ],
};

export const mockInstances: LogbookInstance[] = [
  { instanceId: "inst-001", templateId: "tpl-001", locationId: "loc-001", assetId: "asset-001", name: "Cleaning Log", assetName: "Reactor R-201", lastEntry: "2 hours ago", lastOperator: "J. Martinez", schedule: "Every shift", isOverdue: false, fieldCount: 6 },
  { instanceId: "inst-002", templateId: "tpl-003", locationId: "loc-001", assetId: "asset-001", name: "Calibration Log", assetName: "Reactor R-201", lastEntry: "Yesterday", lastOperator: "K. Chen", schedule: "Weekly", isOverdue: false, fieldCount: 12 },
  { instanceId: "inst-003", templateId: "tpl-004", locationId: "loc-001", assetId: "asset-001", name: "Temperature Check Log", assetName: "Reactor R-201", lastEntry: "45 min ago", lastOperator: "A. Patel", schedule: "Every 4 hours", isOverdue: false, fieldCount: 4 },
  { instanceId: "inst-004", templateId: "tpl-001", locationId: "loc-001", assetId: "asset-002", name: "Cleaning Log", assetName: "Mixer M-105", lastEntry: "6 hours ago", lastOperator: "K. Chen", schedule: "Every shift", isOverdue: false, fieldCount: 6 },
  { instanceId: "inst-005", templateId: "tpl-001", locationId: "loc-001", assetId: "asset-003", name: "Cleaning Log", assetName: "Centrifuge C-042", lastEntry: "6 hours ago", lastOperator: "J. Martinez", schedule: "Every shift", isOverdue: true, fieldCount: 6 },
  { instanceId: "inst-006", templateId: "tpl-004", locationId: "loc-001", assetId: "asset-003", name: "Vibration Check Log", assetName: "Centrifuge C-042", lastEntry: "2 days ago", lastOperator: "K. Chen", schedule: "Daily", isOverdue: false, fieldCount: 5 },
  { instanceId: "inst-007", templateId: "tpl-001", locationId: "loc-001", assetId: "asset-004", name: "Cleaning Log", assetName: "Autoclave A-017", lastEntry: "4 hours ago", lastOperator: "A. Patel", schedule: "Every shift", isOverdue: false, fieldCount: 6 },
  { instanceId: "inst-008", templateId: "tpl-001", locationId: "loc-001", assetId: "asset-005", name: "Cleaning Log", assetName: "Fume Hood FH-12", lastEntry: "Yesterday", lastOperator: "J. Martinez", schedule: "Daily", isOverdue: false, fieldCount: 6 },
  { instanceId: "inst-009", templateId: "tpl-002", locationId: "loc-001", assetId: null, name: "Environmental Monitoring Log", assetName: null, lastEntry: "1 hour ago", lastOperator: "A. Patel", schedule: "Every 4 hours", isOverdue: false, fieldCount: 8 },
  { instanceId: "inst-010", templateId: "tpl-005", locationId: "loc-001", assetId: null, name: "Visitor Access Log", assetName: null, lastEntry: "3 hours ago", lastOperator: "J. Martinez", schedule: "As needed", isOverdue: false, fieldCount: 4 },
  { instanceId: "inst-011", templateId: "tpl-003", locationId: "loc-002", assetId: "asset-006", name: "Calibration Log", assetName: "pH Meter PH-03", lastEntry: "Yesterday", lastOperator: "K. Chen", schedule: "Weekly", isOverdue: false, fieldCount: 12 },
  { instanceId: "inst-012", templateId: "tpl-001", locationId: "loc-002", assetId: "asset-007", name: "Cleaning Log", assetName: "Spectrophotometer S-01", lastEntry: "2 days ago", lastOperator: "R. Kim", schedule: "Weekly", isOverdue: false, fieldCount: 6 },

  // ── v1 scope demo instances (8 examples from Core Problems doc) ──
  { instanceId: "inst-eq-01", templateId: "tpl-eq-01", locationId: "loc-001", assetId: "asset-a101", name: "Autoclave Daily Use & Cycle Readiness", assetName: "Autoclave A-101", lastEntry: "Today, 06:12 AM", lastOperator: "J. Martinez", schedule: "Start of shift", isOverdue: false, fieldCount: 9, family: "equipment-status" },
  { instanceId: "inst-eq-02", templateId: "tpl-eq-02", locationId: "loc-001", assetId: "asset-tw044", name: "Tool Checkout & Return", assetName: "Torque Wrench TW-044", lastEntry: "Yesterday, 4:18 PM", lastOperator: "K. Chen", schedule: "On checkout", isOverdue: false, fieldCount: 9, family: "equipment-status" },
  { instanceId: "inst-cl-01", templateId: "tpl-cl-01", locationId: "loc-001", assetId: "asset-p2", name: "Packaging Line Clearance", assetName: "Packaging Line P-2", lastEntry: "Today, 09:40 AM", lastOperator: "A. Patel (Lead)", schedule: "Lot changeover", isOverdue: false, fieldCount: 11, family: "cleaning" },
  { instanceId: "inst-cl-02", templateId: "tpl-cl-02", locationId: "loc-001", assetId: "asset-cip03", name: "CIP Post-Clean Verification", assetName: "CIP Skid CIP-03", lastEntry: "Today, 08:05 AM", lastOperator: "R. Kim", schedule: "Per cycle", isOverdue: false, fieldCount: 9, family: "cleaning" },
  { instanceId: "inst-mt-01", templateId: "tpl-mt-01", locationId: "loc-001", assetId: "asset-f220", name: "Unplanned Downtime Troubleshoot", assetName: "Filler F-220", lastEntry: "30 min ago", lastOperator: "J. Martinez", schedule: "On breakdown", isOverdue: true, fieldCount: 10, family: "maintenance" },
  { instanceId: "inst-mt-02", templateId: "tpl-mt-02", locationId: "loc-001", assetId: "asset-ahu7", name: "Temporary Mitigation", assetName: "HVAC AHU-7", lastEntry: "Yesterday", lastOperator: "K. Chen (Supervisor)", schedule: "Daily verify while open", isOverdue: false, fieldCount: 10, family: "maintenance" },
  { instanceId: "inst-cb-01", templateId: "tpl-cb-01", locationId: "loc-001", assetId: "asset-s015", name: "Critical Scale Daily Verify", assetName: "Scale S-015", lastEntry: "Today, 05:55 AM", lastOperator: "A. Patel", schedule: "Daily, pre-weigh", isOverdue: false, fieldCount: 8, family: "calibration" },
  { instanceId: "inst-cb-02", templateId: "tpl-cb-02", locationId: "loc-001", assetId: "asset-pt88", name: "Post-Maintenance Instrument Check", assetName: "Pressure Transmitter PT-88", lastEntry: "2 days ago", lastOperator: "R. Kim (Cal Tech)", schedule: "On WO completion", isOverdue: false, fieldCount: 7, family: "calibration" },
];

const sampleFields: ReviewEntryField[] = [
  { label: "Date/Time", value: "Feb 27, 2026 06:15 AM", preFilled: true },
  { label: "Operator", value: "J. Martinez", preFilled: true },
  { label: "Equipment ID", value: "RAM-3201", preFilled: true },
  { label: "Cleaning Agent", value: "IPA 70%" },
  { label: "Cleaning Method", value: "Manual" },
  { label: "Verification", value: "Pass" },
  { label: "Observations", value: "No residue observed" },
];

const sampleAudit: AuditTrailEntry[] = [
  { action: "Entry created", timestamp: "06:14 AM", actor: "J. Martinez", detail: "New entry started against Cleaning Log v2.1" },
  { action: "Field updated", timestamp: "06:14 AM", actor: "J. Martinez", detail: "Cleaning Agent: — → IPA 70%" },
  { action: "Field updated", timestamp: "06:14 AM", actor: "J. Martinez", detail: "Verification: — → Pass", verdict: "pass" },
  { action: "E-signed as Performed", timestamp: "06:15 AM", actor: "J. Martinez", detail: "Signature meaning: Performed" },
  { action: "Submitted to review queue", timestamp: "06:15 AM", actor: "J. Martinez", detail: "Routed to QA reviewer N. Matthews" },
];

const sampleFieldsWithException: ReviewEntryField[] = [
  { label: "Date/Time", value: "Feb 27, 2026 06:15 AM", preFilled: true, verdict: "pass" },
  { label: "Operator", value: "J. Martinez", preFilled: true },
  { label: "Equipment ID", value: "RAM-3201", preFilled: true },
  { label: "Temperature (°C)", value: "26.1", verdict: "fail", trace: "value (26.1) > max (24) — Action limit 18–24 °C" },
  { label: "Humidity (%RH)", value: "48.0", verdict: "pass", trace: "30 ≤ value (48) ≤ 60" },
  { label: "Pressure (Pa)", value: "12.5", verdict: "pass" },
  { label: "Observations", value: "HVAC alarm triggered — supervisor notified" },
];

const richAudit = (operator: string): AuditTrailEntry[] => [
  { action: "Entry created", timestamp: "06:14:02 AM", actor: operator, detail: "Entry opened on tablet", hash: "a3f1…9c2b" },
  { action: "Field updated", timestamp: "06:14:48 AM", actor: operator, detail: "Temperature: — → 26.1 °C", priorValue: "—", newValue: "26.1 °C", verdict: "fail" },
  { action: "Field updated", timestamp: "06:14:52 AM", actor: operator, detail: "Humidity: — → 48.0 %RH", priorValue: "—", newValue: "48.0 %RH", verdict: "pass" },
  { action: "Exception acknowledged", timestamp: "06:15:11 AM", actor: operator, detail: "Out-of-limit impact assessment captured", reasonCode: "OOL-IMPACT" },
  { action: "E-signed as Performed", timestamp: "06:15:34 AM", actor: operator, detail: "Signature meaning: Performed", hash: "b8d2…41ee" },
  { action: "Synced from offline queue", timestamp: "06:18:02 AM", detail: "Captured offline; sync pushed after reconnect" },
  { action: "Submitted to review queue", timestamp: "06:18:03 AM", detail: "Routed to QA reviewer N. Matthews" },
];

export const mockReviewEntries: ReviewEntry[] = [
  { id: "rev-01", date: "Feb 27, 2026 06:15", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Reactor R-201", operator: "J. Martinez", assignee: "N. Matthews", status: "pending-review", version: "v2.1", templateHash: "tpl-001@v2.1#a3f1", capturedAt: "06:15:34 AM (offline)", syncedAt: "06:18:02 AM", hoursOpen: 26, slaBreached: true, hasException: true, linkedWorkRequest: "WR-48211", fields: sampleFieldsWithException, auditTrail: richAudit("J. Martinez"), signatureMeaning: "Performed" },
  { id: "rev-02", date: "Feb 27, 2026 06:10", logbook: "Temp Check", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Reactor R-201", operator: "J. Martinez", assignee: "N. Matthews", status: "pending-review", version: "v1.2", hoursOpen: 26, slaBreached: true, fields: [], auditTrail: sampleAudit },
  { id: "rev-03", date: "Feb 27, 2026 05:45", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", site: "Building 3", asset: null, operator: "A. Patel", assignee: "N. Matthews", status: "pending-review", version: "v1.0", hoursOpen: 27, slaBreached: true, hasException: true, fields: [], auditTrail: sampleAudit },
  { id: "rev-04", date: "Feb 26, 2026 22:30", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Mixer M-105", operator: "K. Chen", assignee: "N. Matthews", status: "pending-review", version: "v2.1", hoursOpen: 10, fields: [], auditTrail: sampleAudit },
  { id: "rev-05", date: "Feb 26, 2026 22:15", logbook: "Calibration Log", location: "Lab A", site: "Lab A", asset: "pH Meter PH-03", operator: "K. Chen", assignee: "R. Kim", status: "approved", version: "v3.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-06", date: "Feb 26, 2026 18:00", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Reactor R-201", operator: "J. Martinez", assignee: "N. Matthews", status: "approved", version: "v2.1", fields: sampleFields, auditTrail: sampleAudit },
  { id: "rev-07", date: "Feb 26, 2026 17:45", logbook: "Temp Check", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Centrifuge C-042", operator: "A. Patel", assignee: "N. Matthews", status: "approved", version: "v1.2", fields: [], auditTrail: sampleAudit },
  { id: "rev-08", date: "Feb 26, 2026 14:30", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", site: "Building 3", asset: null, operator: "J. Martinez", assignee: "N. Matthews", status: "approved", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-09", date: "Feb 26, 2026 14:00", logbook: "Cleaning Log", location: "Production S-1", site: "Production Suite 1", asset: "Tablet Press T-1", operator: "R. Kim", assignee: "N. Matthews", status: "approved", version: "v2.1", fields: [], auditTrail: sampleAudit },
  { id: "rev-10", date: "Feb 26, 2026 10:15", logbook: "Vibration Check", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Centrifuge C-042", operator: "K. Chen", assignee: "N. Matthews", status: "rejected", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-11", date: "Feb 26, 2026 10:00", logbook: "Calibration Log", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Reactor R-201", operator: "K. Chen", assignee: "N. Matthews", status: "approved", version: "v3.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-12", date: "Feb 26, 2026 06:20", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Reactor R-201", operator: "A. Patel", assignee: "N. Matthews", status: "approved", version: "v2.1", fields: sampleFields, auditTrail: sampleAudit },
  { id: "rev-13", date: "Feb 26, 2026 06:15", logbook: "Temp Check", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Reactor R-201", operator: "A. Patel", assignee: "N. Matthews", status: "approved", version: "v1.2", fields: [], auditTrail: sampleAudit },
  { id: "rev-14", date: "Feb 26, 2026 05:50", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", site: "Building 3", asset: null, operator: "A. Patel", assignee: "N. Matthews", status: "approved", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-15", date: "Feb 25, 2026 22:30", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Mixer M-105", operator: "J. Martinez", assignee: "N. Matthews", status: "approved", version: "v2.1", fields: [], auditTrail: sampleAudit },
  { id: "rev-16", date: "Feb 25, 2026 18:00", logbook: "Cleaning Log", location: "Lab A", site: "Lab A", asset: "Spectro S-01", operator: "K. Chen", assignee: "R. Kim", status: "approved", version: "v2.1", fields: [], auditTrail: sampleAudit },
  { id: "rev-17", date: "Feb 25, 2026 14:30", logbook: "Calibration Log", location: "Lab A", site: "Lab A", asset: "pH Meter PH-03", operator: "R. Kim", assignee: "R. Kim", status: "approved", version: "v3.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-18", date: "Feb 25, 2026 14:00", logbook: "Temp Check", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Centrifuge C-042", operator: "A. Patel", assignee: "N. Matthews", status: "approved", version: "v1.2", fields: [], auditTrail: sampleAudit },
  { id: "rev-19", date: "Feb 25, 2026 10:00", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", site: "Building 3", asset: null, operator: "J. Martinez", assignee: "N. Matthews", status: "approved", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-20", date: "Feb 25, 2026 06:00", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", site: "Building 3", asset: "Reactor R-201", operator: "K. Chen", assignee: "N. Matthews", status: "rejected", version: "v2.1", fields: sampleFields, auditTrail: sampleAudit },
];

// ── Location → asset associations for template management ──

export const locationAssociations: Record<string, { locationId: string; locationName: string; assets: { assetId: string; assetName: string; assetCode: string }[] }> = {
  "loc-001": {
    locationId: "loc-001",
    locationName: "Building 3, Floor 2",
    assets: [
      { assetId: "asset-001", assetName: "Reactor R-201", assetCode: "RAM-3201" },
      { assetId: "asset-002", assetName: "Mixer M-105", assetCode: "RAM-3105" },
      { assetId: "asset-003", assetName: "Centrifuge C-042", assetCode: "RAM-3042" },
      { assetId: "asset-004", assetName: "Autoclave A-017", assetCode: "RAM-3017" },
      { assetId: "asset-005", assetName: "Fume Hood FH-12", assetCode: "RAM-3012" },
    ],
  },
  "loc-002": {
    locationId: "loc-002",
    locationName: "Lab A",
    assets: [
      { assetId: "asset-006", assetName: "pH Meter PH-03", assetCode: "RAM-2003" },
      { assetId: "asset-007", assetName: "Spectrophotometer S-01", assetCode: "RAM-2001" },
    ],
  },
  "loc-005": {
    locationId: "loc-005",
    locationName: "Production Suite 1",
    assets: [],
  },
};

// ── Helper Functions ────────────────────────────────────────

export function getAssetsByLocation(locationId: string): Asset[] {
  return mockAssets.filter((a) => a.locationId === locationId);
}

export function getInstancesByAsset(assetId: string): LogbookInstance[] {
  return mockInstances.filter((i) => i.assetId === assetId);
}

export function getInstancesByLocation(locationId: string): LogbookInstance[] {
  return mockInstances.filter((i) => i.locationId === locationId);
}

export function getLocationLevelInstances(locationId: string): LogbookInstance[] {
  return mockInstances.filter((i) => i.locationId === locationId && i.assetId === null);
}

export function getTemplateById(templateId: string): LogbookTemplate | undefined {
  return mockTemplates.find((t) => t.id === templateId);
}

export function getAssetById(assetId: string): Asset | undefined {
  return mockAssets.find((a) => a.id === assetId);
}

export interface SliceGroup {
  label: string;
  totalEntries: number;
  pendingCount: number;
  entries: ReviewEntry[];
}

export function getEntriesBySlice(sliceMode: "logbook" | "location" | "asset"): SliceGroup[] {
  const groupMap = new Map<string, ReviewEntry[]>();

  for (const entry of mockReviewEntries) {
    let key: string;
    if (sliceMode === "logbook") {
      // Group by logbook + asset to keep each instance separate
      key = entry.asset
        ? `${entry.logbook} · ${entry.asset}`
        : `${entry.logbook} · Location-Level`;
    } else if (sliceMode === "location") {
      key = entry.location;
    } else {
      key = entry.asset ?? "Location-Level Logs";
    }

    const arr = groupMap.get(key) ?? [];
    arr.push(entry);
    groupMap.set(key, arr);
  }

  return Array.from(groupMap.entries()).map(([label, entries]) => ({
    label,
    totalEntries: entries.length,
    pendingCount: entries.filter((e) => e.status === "pending-review").length,
    entries,
  }));
}
