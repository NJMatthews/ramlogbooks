export interface Logbook {
  id: string;
  name: string;
  location: string;
  lastEntry: string;
  status: "active" | "archived";
  entryCount: number;
  fieldCount: number;
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
  colSpan: number;
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
    name: "Temperature Excursion Log",
    location: "Cold Storage B",
    lastEntry: "1 day ago",
    status: "active",
    entryCount: 56,
    fieldCount: 9,
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

export const mockScanResults: ScanField[] = [
  { id: "s1", name: "Date", value: "02/26/2026", confidence: 98, approved: false, fieldType: "Date", colSpan: 1, rowHeight: "short" },
  { id: "s2", name: "Time", value: "14:30", confidence: 96, approved: false, fieldType: "Time", colSpan: 1, rowHeight: "short" },
  { id: "s3", name: "Operator", value: "J. Martinez", confidence: 94, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s4", name: "Room Number", value: "CR-204", confidence: 99, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
  { id: "s5", name: "Temperature (°C)", value: "21.5", confidence: 91, approved: false, fieldType: "Number", colSpan: 1, rowHeight: "short" },
  { id: "s6", name: "Humidity (%RH)", value: "44", confidence: 73, approved: false, fieldType: "Number", colSpan: 1, rowHeight: "short" },
  { id: "s7", name: "Differential Pressure (Pa)", value: "12", confidence: 65, approved: false, fieldType: "Number", colSpan: 1, rowHeight: "short" },
  { id: "s8", name: "Observations", value: "No issues observed", confidence: 45, approved: false, fieldType: "Text Area", colSpan: 2, rowHeight: "tall" },
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
