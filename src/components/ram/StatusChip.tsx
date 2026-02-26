import { cn } from "@/lib/utils";

type Status = "open" | "in-progress" | "done" | "error" | "synced" | "conflict" | "awaiting" | "issue" | "success";

const statusConfig: Record<Status, { label: string; bg: string; text: string }> = {
  open: { label: "Open", bg: "bg-gray-200", text: "text-gray-800" },
  "in-progress": { label: "In Progress", bg: "bg-brand-200", text: "text-brand-500" },
  done: { label: "Done", bg: "bg-success-100", text: "text-success-400" },
  error: { label: "Error", bg: "bg-error-100", text: "text-error-600" },
  synced: { label: "Synced", bg: "bg-success-100", text: "text-success-400" },
  conflict: { label: "Conflict", bg: "bg-warning-100", text: "text-warning-400" },
  awaiting: { label: "Awaiting Sync", bg: "bg-brand-200", text: "text-brand-500" },
  issue: { label: "Issue", bg: "bg-error-100", text: "text-error-600" },
  success: { label: "Synced", bg: "bg-success-100", text: "text-success-400" },
};

interface StatusChipProps {
  status: Status;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-ram-xl px-ram-lg text-text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}
