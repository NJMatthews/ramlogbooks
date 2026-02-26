import { cn } from "@/lib/utils";

interface RAMToggleProps {
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  onLabel?: string;
  offLabel?: string;
}

export function RAMToggle({
  label,
  value,
  onChange,
  disabled,
  onLabel = "Pass",
  offLabel = "Fail",
}: RAMToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-md font-medium text-gray-800">{label}</span>
      <button
        onClick={() => !disabled && onChange?.(!value)}
        disabled={disabled}
        className={cn(
          "relative flex h-[31px] w-[60px] items-center rounded-full transition-colors",
          value ? "bg-brand-500" : "bg-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "absolute h-[27px] w-[27px] rounded-full bg-background shadow-ram-sm transition-transform",
            value ? "translate-x-[31px]" : "translate-x-[2px]"
          )}
        />
      </button>
      <span className={cn("ml-ram-md text-text-sm font-medium", value ? "text-success-400" : "text-error-600")}>
        {value ? onLabel : offLabel}
      </span>
    </div>
  );
}
