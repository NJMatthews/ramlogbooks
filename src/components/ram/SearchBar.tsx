import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search...", className }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-ram-md rounded-ram-xs border bg-background px-ram-lg transition-colors",
        focused ? "border-brand-500" : "border-gray-300",
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-gray-600" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-text-md text-foreground outline-none placeholder:text-gray-500"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-gray-600 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
