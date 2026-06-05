import { cn } from "@/lib/utils";
import { FAMILY_META, type LogbookFamily, type LogbookScope } from "@/data/mockLogbooks";
import { Wrench, ClipboardCheck, Sparkles, Gauge, RouteIcon, Clock } from "lucide-react";

const ICONS: Record<LogbookFamily, typeof Wrench> = {
  "equipment-status": ClipboardCheck,
  maintenance: Wrench,
  cleaning: Sparkles,
  calibration: Gauge,
  rounds: RouteIcon,
  handover: Clock,
};

const SCOPE_STYLES: Record<LogbookScope, string> = {
  primary: "bg-brand-100 text-brand-600 border-brand-200",
  adjacent: "bg-success-100 text-success-900 border-success-100",
  oos: "bg-gray-100 text-gray-500 border-gray-200",
};

interface FamilyChipProps {
  family: LogbookFamily;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  size?: "sm" | "md";
  showScope?: boolean;
}

export function FamilyChip({ family, active, count, onClick, size = "md", showScope = false }: FamilyChipProps) {
  const meta = FAMILY_META[family];
  const Icon = ICONS[family];
  const interactive = typeof onClick === "function";
  const Tag = interactive ? "button" : "span";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-extrabold transition-colors",
        size === "sm" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-text-xs",
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : interactive
          ? "border-gray-300 bg-card text-gray-700 hover:border-brand-500 hover:text-brand-600"
          : SCOPE_STYLES[meta.scope]
      )}
      title={`${meta.label} · ${meta.scope === "primary" ? "Primary v1 scope" : meta.scope === "adjacent" ? "Adjacent v1 scope" : "Not in v1 scope"}`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span>{meta.short}</span>
      {showScope && meta.scope === "oos" && (
        <span className="rounded-sm bg-foreground/10 px-1 text-[9px] uppercase tracking-wider">Post-v1</span>
      )}
      {count != null && count > 0 && (
        <span className={cn("text-[10px]", active ? "opacity-90" : "opacity-60")}>·{count}</span>
      )}
    </Tag>
  );
}
