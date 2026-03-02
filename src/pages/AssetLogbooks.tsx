import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Clock, FileText, History, PlusCircle } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { getAssetById, getInstancesByAsset } from "@/data/mockAssets";

export default function AssetLogbooks() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLocation } = useDeviceLocation();

  const asset = getAssetById(id ?? "");
  const instances = getInstancesByAsset(id ?? "");

  if (!asset) {
    return (
      <AppLayout>
        <HeaderNav type="back" title="Asset Not Found" />
        <p className="p-ram-xl text-text-md text-gray-600">No asset with this ID.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <HeaderNav type="back" title={asset.name} />
      <div className="px-ram-xl py-ram-sm">
        <p className="text-text-sm text-gray-500">
          {asset.assetId} · {currentLocation.name}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-lg space-y-ram-lg">
        {instances.map((inst) => (
          <div
            key={inst.instanceId}
            className="rounded-ram-xl border border-border bg-card overflow-hidden"
          >
            <div className="p-ram-xl">
              <div className="flex items-start justify-between gap-ram-md">
                <h3 className="text-[15px] font-extrabold text-foreground">{inst.name}</h3>
                <span className="inline-flex items-center rounded-full bg-gray-200 px-ram-lg py-ram-xxs text-text-xs text-gray-500">
                  <FileText className="h-3 w-3 mr-1" />
                  {inst.fieldCount} fields
                </span>
              </div>

              <p className="mt-ram-sm text-text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last entry: {inst.lastEntry} by {inst.lastOperator}
              </p>

              {inst.isOverdue ? (
                <p className="mt-ram-sm text-text-sm text-error-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Overdue — {inst.schedule}
                </p>
              ) : (
                <p className="mt-ram-sm text-text-sm text-gray-600">
                  Due: {inst.schedule}
                </p>
              )}
            </div>

            <div className="flex border-t border-border">
              <button
                onClick={() => navigate(`/history/${inst.instanceId}`)}
                className="flex flex-1 items-center justify-center gap-1.5 py-3 text-text-sm font-medium text-brand-500 hover:bg-muted transition-colors"
              >
                <History className="h-4 w-4" />
                View History
              </button>
              <div className="w-px bg-border" />
              <button
                onClick={() => navigate(`/entry/${inst.instanceId}`)}
                className="flex flex-1 items-center justify-center gap-1.5 py-3 text-text-sm font-medium text-brand-500 hover:bg-muted transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                New Entry
              </button>
            </div>
          </div>
        ))}

        {instances.length === 0 && (
          <p className="text-center text-text-sm text-gray-500 py-ram-4xl">
            No logbooks associated with this asset.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
