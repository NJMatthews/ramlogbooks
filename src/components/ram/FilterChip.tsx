import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  onClear?: () => void;
  className?: string;
}

export function FilterChip({ label, active, count, onClick, onClear, className }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-ram-sm rounded-full border px-ram-lg text-text-sm font-medium transition-colors",
        active
          ? "border-brand-500 bg-brand-500 text-primary-foreground"
          : "border-gray-300 bg-background text-gray-800 hover:bg-gray-100",
        className
      )}
    >
      <span>{label}</span>
      {count != null && count > 0 && (
        <span className="text-text-xs opacity-80">+{count}</span>
      )}
      {active && onClear && (
        <X className="h-3 w-3 ml-ram-xxs" onClick={(e) => { e.stopPropagation(); onClear(); }} />
      )}
    </button>
  );
}
