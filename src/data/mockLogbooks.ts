export interface Logbook {
  id: string;
  name: string;
  location: string;
  lastEntry: string;
  status: "active" | "archived";
  entryCount: number;
  fieldCount: number;
  format?: "digital" | "paper";
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "datetime" | "textarea" | "toggle";
  value: string;
  prefilled: boolean;
  timeSensitive: boolean;
  unit?: string;
  readOnly?: boolean;
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
  {
    id: "1",
    name: "Clean Room Environmental Log",
    location: "Building 3, Floor 2",
    lastEntry: "2 hours ago",
    status: "active",
    entryCount: 142,
    fieldCount: 8,
  },
  {
    id: "2",
    name: "Equipment Calibration Log",
    location: "Lab A",
    lastEntry: "Yesterday",
    status: "active",
    entryCount: 89,
    fieldCount: 12,
  },
  {
    id: "3",
    name: "Water System Monitoring Log",
    location: "Utilities",
    lastEntry: "3 hours ago",
    status: "active",
    entryCount: 312,
    fieldCount: 6,
  },
  {
    id: "4",
    name: "pH/Conductivity Meter Daily Use Log",
    location: "Cold Storage B",
    lastEntry: "1 day ago",
    status: "active",
    entryCount: 56,
    fieldCount: 14,
    format: "paper",
  },
  {
    id: "5",
    name: "Batch Weighing Log",
    location: "Production Suite 1",
    lastEntry: "30 min ago",
    status: "active",
    entryCount: 203,
    fieldCount: 10,
  },
];

export const cleanRoomFormFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: "", prefilled: false, timeSensitive: false },
  { id: "operator", label: "Operator", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "room", label: "Room", type: "text", value: "", prefilled: false, timeSensitive: false },
  { id: "temperature", label: "Temperature (°C)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "°C" },
  { id: "humidity", label: "Humidity (%RH)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "%RH" },
  { id: "pressure", label: "Differential Pressure (Pa)", type: "number", value: "", prefilled: false, timeSensitive: false, unit: "Pa" },
  { id: "particle05", label: "Particle Count (0.5µm)", type: "number", value: "", prefilled: false, timeSensitive: false },
  { id: "particle50", label: "Particle Count (5.0µm)", type: "number", value: "", prefilled: false, timeSensitive: false },
  { id: "observations", label: "Observations", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "status", label: "Status", type: "toggle", value: "pass", prefilled: false, timeSensitive: false },
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
  {
    id: "q1",
    entryName: "Environmental Reading #1247",
    logbook: "Clean Room Environmental Log",
    timestamp: "Today, 2:34 PM",
    status: "awaiting",
  },
  {
    id: "q2",
    entryName: "Calibration Check #892",
    logbook: "Equipment Calibration Log",
    timestamp: "Today, 1:15 PM",
    status: "issue",
    error: "Timestamp conflict with server record",
  },
  {
    id: "q3",
    entryName: "Water Quality #445",
    logbook: "Water System Monitoring Log",
    timestamp: "Today, 11:00 AM",
    status: "success",
  },
];
