import type { Logbook } from "./mockLogbooks";

export interface DeviceLocation {
  id: string;
  name: string;
  logbookCount: number;
  assetCount: number;
  operatorCount: number;
  isDefault: boolean;
}

export const mockLocations: DeviceLocation[] = [
  { id: "loc-001", name: "Building 3, Floor 2", logbookCount: 5, assetCount: 23, operatorCount: 12, isDefault: true },
  { id: "loc-002", name: "Lab A", logbookCount: 3, assetCount: 8, operatorCount: 6, isDefault: false },
  { id: "loc-003", name: "Utilities", logbookCount: 2, assetCount: 15, operatorCount: 4, isDefault: false },
  { id: "loc-004", name: "Cold Storage B", logbookCount: 1, assetCount: 5, operatorCount: 3, isDefault: false },
  { id: "loc-005", name: "Production Suite 1", logbookCount: 4, assetCount: 31, operatorCount: 9, isDefault: false },
  { id: "loc-006", name: "Warehouse C", logbookCount: 1, assetCount: 42, operatorCount: 5, isDefault: false },
];

export const logbooksByLocation: Record<string, Logbook[]> = {
  "loc-001": [
    { id: "1", name: "Clean Room Environmental Log", location: "Building 3, Floor 2", lastEntry: "2 hours ago", status: "active", entryCount: 142, fieldCount: 8 },
    { id: "2", name: "Equipment Calibration Log", location: "Building 3, Floor 2", lastEntry: "Yesterday", status: "active", entryCount: 89, fieldCount: 12 },
    { id: "3", name: "Water System Monitoring Log", location: "Building 3, Floor 2", lastEntry: "3 hours ago", status: "active", entryCount: 312, fieldCount: 6 },
    { id: "4", name: "Temperature Excursion Log", location: "Building 3, Floor 2", lastEntry: "1 day ago", status: "active", entryCount: 56, fieldCount: 9 },
    { id: "5", name: "Batch Weighing Log", location: "Building 3, Floor 2", lastEntry: "30 min ago", status: "active", entryCount: 203, fieldCount: 10 },
  ],
  "loc-002": [
    { id: "6", name: "pH Calibration Log", location: "Lab A", lastEntry: "1 hour ago", status: "active", entryCount: 45, fieldCount: 6 },
    { id: "7", name: "Reagent Preparation Log", location: "Lab A", lastEntry: "3 hours ago", status: "active", entryCount: 112, fieldCount: 8 },
    { id: "8", name: "Equipment Cleaning Log", location: "Lab A", lastEntry: "Yesterday", status: "active", entryCount: 89, fieldCount: 4 },
  ],
  "loc-003": [
    { id: "9", name: "Boiler Inspection Log", location: "Utilities", lastEntry: "4 hours ago", status: "active", entryCount: 67, fieldCount: 7 },
    { id: "10", name: "HVAC Maintenance Log", location: "Utilities", lastEntry: "2 days ago", status: "active", entryCount: 34, fieldCount: 5 },
  ],
  "loc-004": [
    { id: "11", name: "Cold Storage Temperature Log", location: "Cold Storage B", lastEntry: "15 min ago", status: "active", entryCount: 521, fieldCount: 4 },
  ],
  "loc-005": [
    { id: "12", name: "Line Clearance Log", location: "Production Suite 1", lastEntry: "2 hours ago", status: "active", entryCount: 178, fieldCount: 11 },
    { id: "13", name: "In-Process Check Log", location: "Production Suite 1", lastEntry: "45 min ago", status: "active", entryCount: 256, fieldCount: 9 },
    { id: "14", name: "Yield Reconciliation Log", location: "Production Suite 1", lastEntry: "Yesterday", status: "active", entryCount: 93, fieldCount: 7 },
    { id: "15", name: "Packaging Inspection Log", location: "Production Suite 1", lastEntry: "3 hours ago", status: "active", entryCount: 144, fieldCount: 6 },
  ],
  "loc-006": [
    { id: "16", name: "Receiving & Storage Log", location: "Warehouse C", lastEntry: "1 hour ago", status: "active", entryCount: 389, fieldCount: 8 },
  ],
};
