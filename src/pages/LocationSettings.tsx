import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { Check, ClipboardList, Package, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function LocationSettings() {
  const { currentLocation, locations, setLocation } = useDeviceLocation();
  const [selectedId, setSelectedId] = useState<string>(currentLocation.id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const selectedLocation = locations.find((l) => l.id === selectedId);
  const hasChanged = selectedId !== currentLocation.id;

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLocation(selectedId);
      setIsLoading(false);
      setShowConfirm(false);
      navigate("/");
    }, 1000);
  };

  return (
    <AppLayout hideNav>
      <HeaderNav type="back" title="Device Location" />
      <div className="flex-1 overflow-y-auto">
        <div className="px-ram-xl py-ram-xl space-y-ram-xl max-w-2xl mx-auto">
          {/* Current Location Card */}
          <div className="rounded-ram-md border border-border bg-card p-ram-2xl">
            <p className="text-text-xs font-medium text-gray-500 uppercase tracking-[0.06em]">
              Current Location
            </p>
            <h2 className="mt-ram-sm text-display-xs font-extrabold text-foreground">
              {currentLocation.name}
            </h2>
            <div className="mt-ram-md flex items-center gap-ram-sm text-text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-1">
                <ClipboardList className="h-3 w-3 text-gray-500" />
                {currentLocation.logbookCount} Logbooks
              </span>
              <span className="text-gray-400">·</span>
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3 text-gray-500" />
                {currentLocation.assetCount} Assets
              </span>
              <span className="text-gray-400">·</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 text-gray-500" />
                {currentLocation.operatorCount} Operators
              </span>
            </div>
            <div className="mt-ram-lg">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-text-xs font-medium bg-success-100 text-success-900">
                Active
              </span>
            </div>
          </div>

          {/* Available Locations */}
          <div>
            <div className="border-b border-border pb-ram-md">
              <h3 className="text-[15px] font-extrabold text-foreground">Available Locations</h3>
            </div>
            <p className="mt-ram-md text-text-sm text-gray-600">
              Select a location to configure this device. Only logbooks and assets assigned to the selected location will be accessible.
            </p>
            <div className="mt-ram-xl flex flex-col gap-ram-md">
              {locations.map((loc) => {
                const isCurrent = loc.id === currentLocation.id;
                const isSelected = loc.id === selectedId;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedId(loc.id)}
                    className={cn(
                      "flex items-center justify-between w-full rounded-ram-md border bg-card p-ram-xl text-left transition-all",
                      isSelected && !isCurrent
                        ? "border-2 border-brand-500 bg-brand-100"
                        : "border-border",
                    )}
                  >
                    <div>
                      <p className="text-[15px] font-extrabold text-foreground">{loc.name}</p>
                      <p className="mt-ram-xxs text-text-xs text-gray-500">
                        {loc.logbookCount} Logbooks · {loc.assetCount} Assets · {loc.operatorCount} Operators
                      </p>
                    </div>
                    <div className="flex items-center gap-ram-sm shrink-0 ml-ram-lg">
                      {isCurrent ? (
                        <>
                          <div className="h-5 w-5 rounded-full border-[6px] border-brand-500" />
                          <span className="text-text-xs font-medium text-brand-500">Current</span>
                        </>
                      ) : (
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full border-2",
                            isSelected ? "border-brand-500 bg-brand-500 flex items-center justify-center" : "border-gray-400"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 border-t border-border bg-card px-ram-xl py-ram-lg">
        <button
          disabled={!hasChanged}
          onClick={() => setShowConfirm(true)}
          className={cn(
            "w-full rounded-ram-md py-3 text-text-md font-extrabold transition-colors",
            hasChanged
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          Confirm Location
        </button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground">Change Device Location?</DialogTitle>
            <DialogDescription className="text-text-sm text-gray-600 mt-ram-md">
              This device will be reconfigured for{" "}
              <span className="font-extrabold text-foreground">{selectedLocation?.name}</span>.
              You will only see logbooks and assets assigned to {selectedLocation?.name}.
              This change applies to all users of this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-ram-md mt-ram-lg">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 rounded-ram-md border border-border py-2.5 text-text-md font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 rounded-ram-md bg-brand-500 py-2.5 text-text-md font-extrabold text-white hover:bg-brand-600 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Confirming…
                </span>
              ) : (
                "Confirm Change"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
