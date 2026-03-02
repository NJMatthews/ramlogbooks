import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, List, Nfc, Clock, FileText } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { getLocationLevelInstances } from "@/data/mockAssets";

export default function Execute() {
  const navigate = useNavigate();
  const { currentLocation } = useDeviceLocation();
  const [scanning, setScanning] = useState(false);
  const [simulateSingle, setSimulateSingle] = useState(false);

  const locationInstances = getLocationLevelInstances(currentLocation.id);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (simulateSingle) {
        // Autoclave has 1 logbook — skip to entry
        navigate("/entry/inst-007");
      } else {
        // Reactor R-201 has 3 logbooks
        navigate("/execute/asset/asset-001");
      }
    }, 2000);
  };

  return (
    <AppLayout>
      <HeaderNav
        type="workAgenda"
        title="Execute"
        rightAction={
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-ram-sm rounded-full bg-brand-500 px-ram-xl py-ram-md text-text-sm font-medium text-primary-foreground"
          >
            <ScanLine className="h-4 w-4" />
            {scanning ? "Scanning…" : "Scan"}
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl space-y-ram-3xl">
        {/* Two entry paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-ram-xl">
          {/* Path A: Scan */}
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex flex-col items-center gap-ram-xl rounded-ram-xl border border-border bg-card p-ram-3xl text-center hover:shadow-ram-sm transition-shadow"
          >
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-100">
              <ScanLine className="h-12 w-12 text-brand-500" />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-foreground">Scan or Tap Asset</h3>
              <p className="mt-ram-sm text-text-sm text-gray-600">
                Use QR code, barcode, or NFC to identify the equipment you're working on.
              </p>
            </div>
          </button>

          {/* Path B: Browse */}
          <button
            onClick={() => navigate("/execute/assets")}
            className="flex flex-col items-center gap-ram-xl rounded-ram-xl border border-border bg-card p-ram-3xl text-center hover:shadow-ram-sm transition-shadow"
          >
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-100">
              <List className="h-12 w-12 text-brand-500" />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-foreground">Select from List</h3>
              <p className="mt-ram-sm text-text-sm text-gray-600">
                Browse assets at this location.
              </p>
            </div>
          </button>
        </div>

        {/* NFC link */}
        <button className="flex items-center gap-ram-sm text-text-sm font-medium text-brand-500 hover:underline">
          <Nfc className="h-4 w-4" />
          Or tap NFC tag
        </button>

        {/* Simulate single logbook toggle */}
        <label className="flex items-center gap-ram-md text-text-xs text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={simulateSingle}
            onChange={(e) => setSimulateSingle(e.target.checked)}
            className="accent-brand-500"
          />
          Simulate single logbook (demo shortcut)
        </label>

        {/* Scanning overlay */}
        {scanning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60">
            <div className="flex flex-col items-center gap-ram-xl rounded-ram-xl bg-card p-ram-4xl shadow-ram-lg">
              <ScanLine className="h-16 w-16 text-brand-500 animate-pulse" />
              <p className="text-text-md font-extrabold text-foreground">Scanning…</p>
              <p className="text-text-sm text-gray-600">Point at asset QR code or barcode</p>
            </div>
          </div>
        )}

        {/* Location-level logbooks */}
        {locationInstances.length > 0 && (
          <section>
            <h2 className="text-[15px] font-extrabold text-foreground">Location-Level Logbooks</h2>
            <p className="mt-ram-sm text-text-sm text-gray-500 mb-ram-xl">
              Logbooks for {currentLocation.name} that aren't tied to a specific asset.
            </p>
            <div className="space-y-ram-lg">
              {locationInstances.map((inst) => (
                <button
                  key={inst.instanceId}
                  onClick={() => navigate(`/entry/${inst.instanceId}`)}
                  className="w-full text-left rounded-ram-xl border border-border bg-card p-ram-xl hover:shadow-ram-sm transition-shadow"
                >
                  <h3 className="text-[15px] font-extrabold text-foreground">{inst.name}</h3>
                  <div className="mt-ram-sm flex items-center gap-ram-lg text-text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {inst.fieldCount} fields
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last entry: {inst.lastEntry}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
