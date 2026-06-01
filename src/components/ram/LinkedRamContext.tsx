import { Wrench, CalendarCheck2, AlertTriangle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RamContext {
  assetCode: string;
  assetName: string;
  calibrationStatus: "in-tolerance" | "due-soon" | "overdue";
  calibrationDate: string;
  calibrationDueIn: string;
  openWorkOrders: { id: string; title: string; priority: "low" | "med" | "high" }[];
}

interface LinkedRamContextProps {
  context: RamContext;
}

const CAL_STYLES: Record<RamContext["calibrationStatus"], { label: string; cls: string }> = {
  "in-tolerance": { label: "In tolerance", cls: "bg-success-100 text-success-900" },
  "due-soon": { label: "Due soon", cls: "bg-warning-400/15 text-warning-400" },
  overdue: { label: "Overdue", cls: "bg-error-600/10 text-error-600" },
};

const PRIORITY: Record<"low" | "med" | "high", string> = {
  low: "bg-gray-200 text-gray-700",
  med: "bg-warning-400/15 text-warning-400",
  high: "bg-error-600/10 text-error-600",
};

export function LinkedRamContext({ context }: LinkedRamContextProps) {
  const cal = CAL_STYLES[context.calibrationStatus];
  return (
    <section className="rounded-ram-md border border-brand-500/30 bg-brand-100/50 p-ram-lg">
      <div className="flex items-center justify-between mb-ram-md">
        <div>
          <p className="text-text-xs font-extrabold text-brand-700 uppercase tracking-wider">Linked RAM context</p>
          <p className="text-[15px] font-extrabold text-foreground">{context.assetName} · <span className="font-mono text-text-sm">{context.assetCode}</span></p>
        </div>
        <button className="flex items-center gap-1 text-text-xs font-extrabold text-brand-500 hover:text-brand-600">
          Open in RAM <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-ram-md">
        <div className="rounded-ram-xs border border-border bg-card px-ram-md py-ram-sm">
          <div className="flex items-center gap-ram-sm">
            <CalendarCheck2 className="h-3.5 w-3.5 text-brand-500" />
            <span className="text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Calibration</span>
            <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-extrabold", cal.cls)}>
              {cal.label}
            </span>
          </div>
          <p className="mt-ram-xxs text-text-sm text-foreground">Last: {context.calibrationDate}</p>
          <p className="text-text-xs text-gray-500">Next due in {context.calibrationDueIn}</p>
        </div>

        <div className="rounded-ram-xs border border-border bg-card px-ram-md py-ram-sm">
          <div className="flex items-center gap-ram-sm">
            <Wrench className="h-3.5 w-3.5 text-brand-500" />
            <span className="text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Open work orders</span>
            <span className="ml-auto text-text-xs font-extrabold text-foreground tabular-nums">
              {context.openWorkOrders.length}
            </span>
          </div>
          {context.openWorkOrders.length === 0 ? (
            <p className="mt-ram-xxs text-text-xs text-gray-500">No open work orders</p>
          ) : (
            <ul className="mt-ram-xxs space-y-ram-xxs">
              {context.openWorkOrders.slice(0, 2).map((wo) => (
                <li key={wo.id} className="flex items-center gap-ram-sm">
                  <span className={cn("rounded-full px-1.5 py-0 text-[10px] font-extrabold uppercase", PRIORITY[wo.priority])}>
                    {wo.priority}
                  </span>
                  <span className="text-text-xs text-foreground truncate">{wo.id} · {wo.title}</span>
                </li>
              ))}
              {context.openWorkOrders.length > 2 && (
                <li className="text-text-xs text-gray-500">+{context.openWorkOrders.length - 2} more</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {context.calibrationStatus === "overdue" && (
        <div className="mt-ram-md flex items-center gap-ram-sm rounded-ram-xs border border-error-600/30 bg-error-600/10 px-ram-md py-ram-sm text-text-xs font-extrabold text-error-600">
          <AlertTriangle className="h-3.5 w-3.5" />
          Calibration overdue — entries may need supervisor verification
        </div>
      )}
    </section>
  );
}

/** Demo RAM context by logbook id */
export const ramContextByLogbookId: Record<string, RamContext> = {
  "4": {
    assetCode: "RAM-2003",
    assetName: "pH Meter PH-03",
    calibrationStatus: "due-soon",
    calibrationDate: "Feb 20, 2026",
    calibrationDueIn: "4 days",
    openWorkOrders: [
      { id: "WR-48119", title: "Electrode replacement scheduled", priority: "med" },
    ],
  },
  "2": {
    assetCode: "RAM-3201",
    assetName: "Reactor R-201",
    calibrationStatus: "in-tolerance",
    calibrationDate: "Jan 30, 2026",
    calibrationDueIn: "62 days",
    openWorkOrders: [],
  },
};
