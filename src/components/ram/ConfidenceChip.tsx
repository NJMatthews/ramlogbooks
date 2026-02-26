import { cn } from "@/lib/utils";

interface ConfidenceChipProps {
  confidence: number;
  className?: string;
}

export function ConfidenceChip({ confidence, className }: ConfidenceChipProps) {
  const config =
    confidence >= 90
      ? { bg: "bg-success-100", text: "text-success-400", label: "High" }
      : confidence >= 70
      ? { bg: "bg-warning-100", text: "text-warning-400", label: "Medium" }
      : { bg: "bg-error-100", text: "text-error-600", label: "Low" };

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-ram-sm rounded-ram-xl px-ram-lg text-text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {confidence}% — {config.label}
    </span>
  );
}
