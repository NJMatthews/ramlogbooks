import { ClipboardList, CalendarDays, Settings, Box } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Work Requests", icon: ClipboardList, path: "/requests" },
  { label: "Work Agenda", icon: CalendarDays, path: "/" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Assets", icon: Box, path: "/assets" },
];

export function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex w-[226px] flex-col border-r border-border bg-background py-ram-3xl">
      <div className="px-ram-xl mb-ram-4xl">
        <h2 className="text-text-lg font-extrabold text-foreground">RAM</h2>
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
