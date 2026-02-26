import { cn } from "@/lib/utils";
import { StatusChip } from "./StatusChip";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import type { Logbook } from "@/data/mockLogbooks";

interface WorkCardProps {
  logbook: Logbook;
  onClick: () => void;
  className?: string;
}

export function WorkCard({ logbook, onClick, className }: WorkCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full flex-col rounded-ram-md border border-gray-300 bg-card p-ram-xl text-left transition-shadow hover:shadow-ram-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-ram-md">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-md font-extrabold text-foreground truncate">
            {logbook.name}
          </h3>
          <div className="mt-ram-sm flex items-center gap-ram-sm text-text-sm text-gray-600">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{logbook.location}</span>
          </div>
          <div className="mt-ram-xxs flex items-center gap-ram-sm text-text-xs text-gray-500">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Last entry: {logbook.lastEntry}</span>
          </div>
        </div>
        <div className="flex items-center gap-ram-md shrink-0">
          <StatusChip status={logbook.status} />
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </button>
  );
}
