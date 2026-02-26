import { cn } from "@/lib/utils";
import { StatusChip } from "./StatusChip";
import { Clock, FileText } from "lucide-react";
import type { SyncEntry } from "@/data/mockLogbooks";

interface SyncQueueCardProps {
  entry: SyncEntry;
  className?: string;
}

export function SyncQueueCard({ entry, className }: SyncQueueCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-ram-sm rounded-ram-md border border-gray-300 bg-card p-ram-xl",
        className
      )}
    >
      <div className="flex items-start justify-between gap-ram-md">
        <div className="flex-1 min-w-0">
          <h4 className="text-text-md font-extrabold text-foreground truncate">
            {entry.entryName}
          </h4>
          <div className="mt-ram-xxs flex items-center gap-ram-sm text-text-sm text-gray-600">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{entry.logbook}</span>
          </div>
          <div className="mt-ram-xxs flex items-center gap-ram-sm text-text-xs text-gray-500">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{entry.timestamp}</span>
          </div>
        </div>
        <StatusChip status={entry.status} />
      </div>
      {entry.error && (
        <p className="text-text-xs text-error-600 mt-ram-sm">{entry.error}</p>
      )}
    </div>
  );
}
