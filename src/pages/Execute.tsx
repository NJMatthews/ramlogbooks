import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, Nfc, ChevronRight, Clock, FileText, AlertTriangle, ClipboardList, History } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { SearchBar } from "@/components/ram/SearchBar";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import {
  getAssetsByLocation,
  getInstancesByLocation,
  getInstancesByAsset,
  getLocationLevelInstances,
  type Asset,
  type LogbookInstance,
} from "@/data/mockAssets";
import { cn } from "@/lib/utils";

export default function Execute() {
  const navigate = useNavigate();
  const { currentLocation } = useDeviceLocation();

  const [scanning, setScanning] = useState(false);
  const [simulateSingle, setSimulateSingle] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const assets = useMemo(() => getAssetsByLocation(currentLocation.id), [currentLocation.id]);
  const allInstances = useMemo(() => getInstancesByLocation(currentLocation.id), [currentLocation.id]);

  // When an asset is selected, its logbooks go to the top; everything else is greyed out
  const { highlighted, dimmed } = useMemo(() => {
    if (!selectedAssetId) {
      return { highlighted: allInstances, dimmed: [] as LogbookInstance[] };
    }
    const assetInstances = getInstancesByAsset(selectedAssetId);
    const rest = allInstances.filter((i) => !assetInstances.some((a) => a.instanceId === i.instanceId));
    return { highlighted: assetInstances, dimmed: rest };
  }, [selectedAssetId, allInstances]);

  const filteredAssets = useMemo(() => {
    if (!search.trim()) return assets;
    const q = search.toLowerCase();
    return assets.filter(
      (a) => a.name.toLowerCase().includes(q) || a.assetId.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
    );
  }, [assets, search]);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (simulateSingle) {
        navigate("/entry/inst-007");
      } else {
        setSelectedAssetId("asset-001");
      }
    }, 2000);
  };

  return (
    <AppLayout>
      <HeaderNav type="workAgenda" title="Execute" />

      <div className="flex-1 overflow-y-auto">
        {/* ── Scan Bar (always visible) ── */}
        <div className="border-b border-border bg-card px-ram-xl py-ram-xl">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex w-full items-center justify-center gap-ram-md rounded-ram-xl bg-brand-500 px-ram-xl py-ram-xl text-primary-foreground transition-opacity disabled:opacity-60"
          >
            <ScanLine className="h-5 w-5" />
            <span className="text-[15px] font-extrabold">
              {scanning ? "Scanning…" : "Scan or Tap Asset"}
            </span>
          </button>
          <div className="mt-ram-md flex items-center justify-between">
            <button className="flex items-center gap-ram-sm text-text-xs font-medium text-brand-500 hover:underline">
              <Nfc className="h-3.5 w-3.5" />
              Or tap NFC tag
            </button>
            <label className="flex items-center gap-ram-sm text-text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={simulateSingle}
                onChange={(e) => setSimulateSingle(e.target.checked)}
                className="accent-brand-500 h-3 w-3"
              />
              Demo: single logbook
            </label>
          </div>
        </div>

        {/* ── Two-column workspace ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-0 md:gap-0 flex-1">
          {/* LEFT: Asset list */}
          <div className="border-b md:border-b-0 md:border-r border-border">
            <div className="sticky top-0 z-10 bg-background px-ram-xl pt-ram-xl pb-ram-md">
              <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 mb-ram-md">
                Assets · {currentLocation.name}
              </h2>
              <SearchBar value={search} onChange={setSearch} placeholder="Search assets…" />
            </div>
            <div className="px-ram-xl pb-ram-xl space-y-ram-sm">
              {/* Deselect button */}
              {selectedAssetId && (
                <button
                  onClick={() => setSelectedAssetId(null)}
                  className="w-full text-center text-text-xs font-medium text-brand-500 hover:underline py-ram-sm"
                >
                  Clear selection — show all logbooks
                </button>
              )}
              {filteredAssets.map((asset) => (
                <AssetRow
                  key={asset.id}
                  asset={asset}
                  selected={selectedAssetId === asset.id}
                  onSelect={() => setSelectedAssetId(selectedAssetId === asset.id ? null : asset.id)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Logbooks */}
          <div className="px-ram-xl py-ram-xl">
            {selectedAssetId && (
              <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 mb-ram-lg">
                Logbooks for {assets.find((a) => a.id === selectedAssetId)?.name}
              </h2>
            )}
            {!selectedAssetId && (
              <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 mb-ram-lg">
                All Logbooks · {currentLocation.name}
              </h2>
            )}

            <div className="space-y-ram-sm">
              {highlighted.map((inst) => (
                <LogbookRow key={inst.instanceId} instance={inst} dimmed={false} navigate={navigate} />
              ))}
              {dimmed.map((inst) => (
                <LogbookRow key={inst.instanceId} instance={inst} dimmed navigate={navigate} />
              ))}
            </div>
          </div>
        </div>
      </div>

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
    </AppLayout>
  );
}

/* ── Sub-components ── */

function AssetRow({
  asset,
  selected,
  onSelect,
}: {
  asset: Asset;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-ram-md rounded-ram-md border p-ram-lg text-left transition-all",
        selected
          ? "border-brand-500 bg-brand-100 shadow-ram-sm"
          : "border-border bg-card hover:shadow-ram-sm"
      )}
    >
      {/* Status dot */}
      <span
        className={cn(
          "h-2.5 w-2.5 shrink-0 rounded-full",
          asset.status === "current" ? "bg-success-400" : "bg-warning-400"
        )}
      />
      <div className="flex-1 min-w-0">
        <span className="text-[14px] font-extrabold text-foreground block truncate">{asset.name}</span>
        <span className="text-text-xs text-gray-500">{asset.assetId}</span>
      </div>
      <span className="inline-flex items-center rounded-full bg-gray-200 px-ram-md py-ram-xxs text-[11px] text-gray-600 shrink-0">
        {asset.type}
      </span>
      <span className="flex items-center gap-0.5 text-text-xs text-gray-500 shrink-0">
        <ClipboardList className="h-3 w-3" />
        {asset.logbookCount}
      </span>
    </button>
  );
}

function LogbookRow({
  instance,
  dimmed,
  navigate,
}: {
  instance: LogbookInstance;
  dimmed: boolean;
  navigate: (path: string) => void;
}) {
  return (
    <div
      onClick={() => !dimmed && navigate(`/entry/${instance.instanceId}`)}
      className={cn(
        "flex items-center gap-ram-md rounded-ram-md border border-border bg-card p-ram-lg transition-opacity cursor-pointer hover:shadow-ram-sm",
        dimmed && "opacity-35 pointer-events-none"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-ram-md flex-wrap">
          <span className="text-[14px] font-extrabold text-foreground">{instance.name}</span>
          {instance.assetName && (
            <span className="text-text-xs text-gray-500">· {instance.assetName}</span>
          )}
          {!instance.assetName && (
            <span className="inline-flex items-center rounded-full bg-gray-200 px-ram-md py-ram-xxs text-[11px] text-gray-500">
              Location
            </span>
          )}
        </div>
        <div className="mt-ram-xxs flex items-center gap-ram-lg text-text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-0.5">
            <Clock className="h-3 w-3" />
            {instance.lastEntry} · {instance.lastOperator}
          </span>
          <span className="flex items-center gap-0.5">
            <FileText className="h-3 w-3" />
            {instance.fieldCount} fields
          </span>
          {instance.isOverdue ? (
            <span className="flex items-center gap-0.5 text-error-600 font-medium">
              <AlertTriangle className="h-3 w-3" />
              Overdue
            </span>
          ) : (
            <span className="text-gray-400">{instance.schedule}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-ram-md shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/history/${instance.instanceId}`); }}
          className="flex items-center gap-1 text-text-xs font-medium text-brand-500 hover:underline"
        >
          <History className="h-3.5 w-3.5" />
          View History
        </button>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
