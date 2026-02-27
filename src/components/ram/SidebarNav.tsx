import { BookOpen, ScanLine, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "My Logbooks", icon: BookOpen, path: "/" },
  { label: "Scan & Convert", icon: ScanLine, path: "/scan" },
  { label: "Sync Queue", icon: RefreshCw, path: "/queue" },
];

export function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex w-[226px] flex-col border-r border-border bg-background py-ram-3xl h-full overflow-y-auto shrink-0">
      <div className="px-ram-xl mb-ram-4xl flex items-center gap-ram-md">
        <div className="w-8 h-8 rounded bg-brand-500 flex items-center justify-center text-white font-extrabold text-text-sm">BM</div>
        <h2 className="text-[17px] font-extrabold text-foreground" style={{ fontFamily: "'Avenir Heavy', sans-serif" }}>RAM Logbooks</h2>
      </div>
      <nav className="flex flex-col gap-ram-sm px-ram-md">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-ram-lg rounded-ram-md px-ram-lg py-ram-lg text-text-md font-medium transition-colors",
                active
                  ? "bg-brand-200 text-brand-500"
                  : "text-gray-800 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
