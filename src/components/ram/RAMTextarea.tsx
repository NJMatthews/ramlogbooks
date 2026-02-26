import { cn } from "@/lib/utils";
import { useState } from "react";

interface RAMTextareaProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  expanded?: boolean;
  className?: string;
}

export function RAMTextarea({
  label,
  value,
  onChange,
  placeholder,
  expanded = false,
  className,
}: RAMTextareaProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? "border-brand-500" : value ? "border-gray-800" : "border-gray-300";

  return (
    <div className={cn("flex flex-col gap-ram-sm", className)}>
      <label className="text-text-sm font-medium text-gray-800">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-ram-xs border bg-background px-ram-lg py-ram-lg text-text-md text-foreground outline-none placeholder:text-gray-500 transition-colors resize-none",
          borderColor,
          expanded ? "h-[256px]" : "h-[152px]"
        )}
      />
    </div>
  );
}
