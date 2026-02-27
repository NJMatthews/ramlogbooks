import { BookOpen, ScanLine, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "My Logbooks", icon: BookOpen, path: "/" },
  { label: "Scan & Convert", icon: ScanLine, path: "/scan" },
  { label: "Sync Queue", icon: RefreshCw, path: "/queue" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sticky bottom-0 z-40 flex h-[115px] items-start border-t border-border bg-gray-100 pt-ram-md pb-ram-4xl">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 pt-ram-sm relative",
              active ? "text-brand-500" : "text-gray-600"
            )}
          >
            {active && (
              <div className="absolute top-0 left-1/4 right-1/4 h-[3px] rounded-b bg-brand-500" />
            )}
            <item.icon className="h-6 w-6" />
            <span className="text-text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
