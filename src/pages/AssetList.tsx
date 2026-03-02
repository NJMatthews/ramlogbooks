import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ClipboardList } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { SearchBar } from "@/components/ram/SearchBar";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { getAssetsByLocation } from "@/data/mockAssets";

export default function AssetList() {
  const navigate = useNavigate();
  const { currentLocation } = useDeviceLocation();
  const [search, setSearch] = useState("");

  const assets = getAssetsByLocation(currentLocation.id).filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.assetId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <HeaderNav type="back" title={`Assets at ${currentLocation.name}`} />
      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl space-y-ram-lg">
        <SearchBar value={search} onChange={setSearch} placeholder="Search assets…" />

        {assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => navigate(`/execute/asset/${asset.id}`)}
            className="flex w-full items-center gap-ram-lg rounded-ram-xl border border-border bg-card p-ram-xl hover:shadow-ram-sm transition-shadow text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-ram-md">
                <h3 className="text-[15px] font-extrabold text-foreground truncate">{asset.name}</h3>
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    asset.status === "current" ? "bg-success-400" : "bg-warning-400"
                  }`}
                />
              </div>
              <p className="mt-ram-xxs text-text-xs text-gray-500">{asset.assetId}</p>
              <div className="mt-ram-sm flex items-center gap-ram-lg">
                <span className="inline-flex items-center rounded-full bg-gray-200 px-ram-lg py-ram-xxs text-text-xs text-gray-600">
                  {asset.type}
                </span>
                <span className="flex items-center gap-1 text-text-sm text-gray-600">
                  <ClipboardList className="h-3 w-3" />
                  {asset.logbookCount} Logbook{asset.logbookCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
          </button>
        ))}

        {assets.length === 0 && (
          <p className="text-center text-text-sm text-gray-500 py-ram-4xl">No assets found.</p>
        )}
      </div>
    </AppLayout>
  );
}
