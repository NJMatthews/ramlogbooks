import { cn } from "@/lib/utils";
import { MapPin, Clock, FileText, History, PlusCircle, Check, Monitor, BookOpen } from "lucide-react";
import type { Logbook } from "@/data/mockLogbooks";

interface WorkCardProps {
  logbook: Logbook;
  onNewEntry: () => void;
  onViewHistory?: () => void;
  showLocationBadge?: boolean;
  className?: string;
}

export function WorkCard({ logbook, onNewEntry, onViewHistory, showLocationBadge, className }: WorkCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-ram-xl border border-border bg-card text-left transition-shadow hover:shadow-[var(--shadow-sm)] overflow-hidden",
        className
      )}
    >
      <div className="p-ram-xl pb-ram-lg">
        <div className="flex items-start justify-between gap-ram-md">
          <h3 className="text-lg font-extrabold text-foreground">
            {logbook.name}
          </h3>
          <span className="shrink-0 rounded-ram-xs border border-border px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
            {logbook.status}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{logbook.location}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Last entry: {logbook.lastEntry}</span>
        </div>
        <div className="mt-0.5 text-sm text-gray-500">
          {logbook.entryCount} entries
        </div>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-gray-600">
            <FileText className="h-3 w-3" />
            {logbook.fieldCount} fields
          </span>
          {showLocationBadge && (
            <span className="inline-flex items-center gap-1 text-text-xs text-success-900">
              <Check className="h-3 w-3" />
              This location
            </span>
          )}
        </div>
      </div>
      <div className="flex border-t border-border">
        <button
          onClick={onViewHistory}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium text-brand-500 hover:bg-muted transition-colors"
        >
          <History className="h-4 w-4" />
          View History
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={onNewEntry}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium text-brand-500 hover:bg-muted transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Entry
        </button>
      </div>
    </div>
  );
}
