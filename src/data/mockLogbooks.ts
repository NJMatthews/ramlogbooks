export interface Logbook {
  id: string;
  name: string;
  location: string;
  lastEntry: string;
  status: "open" | "in-progress" | "done" | "error";
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

export interface ScanField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  approved: boolean;
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
    status: "open",
  },
  {
    id: "2",
    name: "Equipment Calibration Log",
    location: "Lab A",
    lastEntry: "Yesterday",
    status: "in-progress",
  },
  {
    id: "3",
    name: "Water System Monitoring Log",
    location: "Utilities",
    lastEntry: "3 hours ago",
    status: "open",
  },
  {
    id: "4",
    name: "Temperature Excursion Log",
    location: "Cold Storage B",
    lastEntry: "1 day ago",
    status: "done",
  },
  {
    id: "5",
    name: "Batch Weighing Log",
    location: "Production Suite 1",
    lastEntry: "30 min ago",
    status: "open",
  },
];

export const cleanRoomFormFields: FormField[] = [
  { id: "datetime", label: "Date/Time", type: "datetime", value: new Date().toLocaleString(), prefilled: true, timeSensitive: true },
  { id: "operator", label: "Operator", type: "text", value: "John Smith (Badge #4521)", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "room", label: "Room", type: "text", value: "CR-302 (Building 3, Floor 2)", prefilled: true, timeSensitive: false, readOnly: true },
  { id: "temperature", label: "Temperature (°C)", type: "number", value: "21.3", prefilled: true, timeSensitive: true, unit: "°C" },
  { id: "humidity", label: "Humidity (%RH)", type: "number", value: "45.2", prefilled: true, timeSensitive: true, unit: "%RH" },
  { id: "pressure", label: "Differential Pressure (Pa)", type: "number", value: "12.5", prefilled: true, timeSensitive: true, unit: "Pa" },
  { id: "particle05", label: "Particle Count (0.5µm)", type: "number", value: "3200", prefilled: true, timeSensitive: true },
  { id: "particle50", label: "Particle Count (5.0µm)", type: "number", value: "18", prefilled: true, timeSensitive: true },
  { id: "observations", label: "Observations", type: "textarea", value: "", prefilled: false, timeSensitive: false },
  { id: "status", label: "Status", type: "toggle", value: "pass", prefilled: false, timeSensitive: false },
];

export const mockScanResults: ScanField[] = [
  { id: "s1", name: "Date", value: "2026-02-26", confidence: 98, approved: false },
  { id: "s2", name: "Operator Name", value: "J. Smith", confidence: 92, approved: false },
  { id: "s3", name: "Room Number", value: "CR-302", confidence: 95, approved: false },
  { id: "s4", name: "Temperature", value: "21.5°C", confidence: 87, approved: false },
  { id: "s5", name: "Humidity", value: "44%", confidence: 73, approved: false },
  { id: "s6", name: "Pressure", value: "12 Pa", confidence: 65, approved: false },
  { id: "s7", name: "Particle Count", value: "3100", confidence: 58, approved: false },
  { id: "s8", name: "Comments", value: "No issues observed", confidence: 45, approved: false },
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
