import { cn } from "@/lib/utils";
import { MapPin, Clock, FileText, History, PlusCircle } from "lucide-react";
import type { Logbook } from "@/data/mockLogbooks";

interface WorkCardProps {
  logbook: Logbook;
  onNewEntry: () => void;
  onViewHistory?: () => void;
  className?: string;
}

export function WorkCard({ logbook, onNewEntry, onViewHistory, className }: WorkCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-ram-md border border-gray-300 bg-card text-left transition-shadow hover:shadow-ram-sm overflow-hidden",
        className
      )}
    >
      <div className="p-ram-xl">
        <div className="flex items-start justify-between gap-ram-md">
          <h3 className="text-text-md font-extrabold text-foreground">
            {logbook.name}
          </h3>
          <span className="shrink-0 rounded bg-gray-100 px-ram-md py-ram-xxs text-text-xs font-medium text-gray-700 capitalize">
            {logbook.status}
          </span>
        </div>
        <div className="mt-ram-md flex items-center gap-ram-sm text-text-sm text-gray-600">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{logbook.location}</span>
        </div>
        <div className="mt-ram-xxs flex items-center gap-ram-sm text-text-sm text-gray-500">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Last entry: {logbook.lastEntry}</span>
        </div>
        <div className="mt-ram-xxs text-text-sm text-gray-500">
          {logbook.entryCount} entries
        </div>
        <div className="mt-ram-md">
          <span className="inline-flex items-center gap-ram-sm rounded-full border border-gray-300 px-ram-lg py-ram-xxs text-text-xs text-gray-600">
            <FileText className="h-3 w-3" />
            {logbook.fieldCount} fields
          </span>
        </div>
      </div>
      <div className="flex border-t border-gray-200">
        <button
          onClick={onViewHistory}
          className="flex flex-1 items-center justify-center gap-ram-sm py-ram-lg text-text-sm font-medium text-brand-500 hover:bg-gray-50 transition-colors"
        >
          <History className="h-4 w-4" />
          View History
        </button>
        <div className="w-px bg-gray-200" />
        <button
          onClick={onNewEntry}
          className="flex flex-1 items-center justify-center gap-ram-sm py-ram-lg text-text-sm font-medium text-brand-500 hover:bg-gray-50 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Entry
        </button>
      </div>
    </div>
  );
}
