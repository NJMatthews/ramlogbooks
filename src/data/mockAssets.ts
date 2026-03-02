// ── Interfaces ──────────────────────────────────────────────

export interface Asset {
  id: string;
  name: string;
  assetId: string;
  type: string;
  locationId: string;
  logbookCount: number;
  status: "current" | "overdue";
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
}

export type ReviewStatus = "pending-review" | "approved" | "rejected" | "correction-requested";

export interface AuditTrailEntry {
  action: string;
  timestamp: string;
}

export interface ReviewEntryField {
  label: string;
  value: string;
  preFilled?: boolean;
  modified?: { from: string; to: string };
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
}

// ── Mock Data ───────────────────────────────────────────────

export const mockAssets: Asset[] = [
  { id: "asset-001", name: "Reactor R-201", assetId: "RAM-3201", type: "Reactor", locationId: "loc-001", logbookCount: 3, status: "current" },
  { id: "asset-002", name: "Mixer M-105", assetId: "RAM-3105", type: "Mixer", locationId: "loc-001", logbookCount: 2, status: "current" },
  { id: "asset-003", name: "Centrifuge C-042", assetId: "RAM-3042", type: "Centrifuge", locationId: "loc-001", logbookCount: 2, status: "overdue" },
  { id: "asset-004", name: "Autoclave A-017", assetId: "RAM-3017", type: "Autoclave", locationId: "loc-001", logbookCount: 1, status: "current" },
  { id: "asset-005", name: "Fume Hood FH-12", assetId: "RAM-3012", type: "Fume Hood", locationId: "loc-001", logbookCount: 1, status: "current" },
  { id: "asset-006", name: "pH Meter PH-03", assetId: "RAM-2003", type: "pH Meter", locationId: "loc-002", logbookCount: 1, status: "current" },
  { id: "asset-007", name: "Spectrophotometer S-01", assetId: "RAM-2001", type: "Spectrophotometer", locationId: "loc-002", logbookCount: 1, status: "current" },
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
  { action: "Created by J. Martinez", timestamp: "06:15 AM" },
  { action: "E-signed", timestamp: "06:15 AM" },
  { action: "Submitted for review", timestamp: "06:15 AM" },
];

export const mockReviewEntries: ReviewEntry[] = [
  { id: "rev-01", date: "Feb 27, 2026 06:15", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", asset: "Reactor R-201", operator: "J. Martinez", status: "pending-review", version: "v2.1", fields: sampleFields, auditTrail: sampleAudit },
  { id: "rev-02", date: "Feb 27, 2026 06:10", logbook: "Temp Check", location: "Bldg 3, Fl 2", asset: "Reactor R-201", operator: "J. Martinez", status: "pending-review", version: "v1.2", fields: [], auditTrail: sampleAudit },
  { id: "rev-03", date: "Feb 27, 2026 05:45", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", asset: null, operator: "A. Patel", status: "pending-review", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-04", date: "Feb 26, 2026 22:30", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", asset: "Mixer M-105", operator: "K. Chen", status: "pending-review", version: "v2.1", fields: [], auditTrail: sampleAudit },
  { id: "rev-05", date: "Feb 26, 2026 22:15", logbook: "Calibration Log", location: "Lab A", asset: "pH Meter PH-03", operator: "K. Chen", status: "approved", version: "v3.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-06", date: "Feb 26, 2026 18:00", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", asset: "Reactor R-201", operator: "J. Martinez", status: "approved", version: "v2.1", fields: sampleFields, auditTrail: sampleAudit },
  { id: "rev-07", date: "Feb 26, 2026 17:45", logbook: "Temp Check", location: "Bldg 3, Fl 2", asset: "Centrifuge C-042", operator: "A. Patel", status: "approved", version: "v1.2", fields: [], auditTrail: sampleAudit },
  { id: "rev-08", date: "Feb 26, 2026 14:30", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", asset: null, operator: "J. Martinez", status: "approved", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-09", date: "Feb 26, 2026 14:00", logbook: "Cleaning Log", location: "Production S-1", asset: "Tablet Press T-1", operator: "R. Kim", status: "approved", version: "v2.1", fields: [], auditTrail: sampleAudit },
  { id: "rev-10", date: "Feb 26, 2026 10:15", logbook: "Vibration Check", location: "Bldg 3, Fl 2", asset: "Centrifuge C-042", operator: "K. Chen", status: "rejected", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-11", date: "Feb 26, 2026 10:00", logbook: "Calibration Log", location: "Bldg 3, Fl 2", asset: "Reactor R-201", operator: "K. Chen", status: "approved", version: "v3.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-12", date: "Feb 26, 2026 06:20", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", asset: "Reactor R-201", operator: "A. Patel", status: "approved", version: "v2.1", fields: sampleFields, auditTrail: sampleAudit },
  { id: "rev-13", date: "Feb 26, 2026 06:15", logbook: "Temp Check", location: "Bldg 3, Fl 2", asset: "Reactor R-201", operator: "A. Patel", status: "approved", version: "v1.2", fields: [], auditTrail: sampleAudit },
  { id: "rev-14", date: "Feb 26, 2026 05:50", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", asset: null, operator: "A. Patel", status: "approved", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-15", date: "Feb 25, 2026 22:30", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", asset: "Mixer M-105", operator: "J. Martinez", status: "approved", version: "v2.1", fields: [], auditTrail: sampleAudit },
  { id: "rev-16", date: "Feb 25, 2026 18:00", logbook: "Cleaning Log", location: "Lab A", asset: "Spectro S-01", operator: "K. Chen", status: "approved", version: "v2.1", fields: [], auditTrail: sampleAudit },
  { id: "rev-17", date: "Feb 25, 2026 14:30", logbook: "Calibration Log", location: "Lab A", asset: "pH Meter PH-03", operator: "R. Kim", status: "approved", version: "v3.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-18", date: "Feb 25, 2026 14:00", logbook: "Temp Check", location: "Bldg 3, Fl 2", asset: "Centrifuge C-042", operator: "A. Patel", status: "approved", version: "v1.2", fields: [], auditTrail: sampleAudit },
  { id: "rev-19", date: "Feb 25, 2026 10:00", logbook: "Environmental Mon.", location: "Bldg 3, Fl 2", asset: null, operator: "J. Martinez", status: "approved", version: "v1.0", fields: [], auditTrail: sampleAudit },
  { id: "rev-20", date: "Feb 25, 2026 06:00", logbook: "Cleaning Log", location: "Bldg 3, Fl 2", asset: "Reactor R-201", operator: "K. Chen", status: "rejected", version: "v2.1", fields: sampleFields, auditTrail: sampleAudit },
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
    if (sliceMode === "logbook") key = entry.logbook;
    else if (sliceMode === "location") key = entry.location;
    else key = entry.asset ?? "Location-Level Logs";

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
