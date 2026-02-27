import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockLocations, logbooksByLocation, type DeviceLocation } from "@/data/mockLocations";

interface DeviceLocationContextValue {
  currentLocation: DeviceLocation;
  locations: DeviceLocation[];
  setLocation: (locationId: string) => void;
  logbooks: ReturnType<typeof getLogbooks>;
}

function getLogbooks(locationId: string) {
  return logbooksByLocation[locationId] ?? [];
}

const defaultLocation = mockLocations.find((l) => l.isDefault) ?? mockLocations[0];

const DeviceLocationContext = createContext<DeviceLocationContextValue | null>(null);

export function DeviceLocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<DeviceLocation>(defaultLocation);

  const setLocation = useCallback((locationId: string) => {
    const loc = mockLocations.find((l) => l.id === locationId);
    if (loc) setCurrentLocation(loc);
  }, []);

  return (
    <DeviceLocationContext.Provider
      value={{
        currentLocation,
        locations: mockLocations,
        setLocation,
        logbooks: getLogbooks(currentLocation.id),
      }}
    >
      {children}
    </DeviceLocationContext.Provider>
  );
}

export function useDeviceLocation() {
  const ctx = useContext(DeviceLocationContext);
  if (!ctx) throw new Error("useDeviceLocation must be used within DeviceLocationProvider");
  return ctx;
}
