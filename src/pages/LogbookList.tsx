import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { SearchBar } from "@/components/ram/SearchBar";
import { FilterChip } from "@/components/ram/FilterChip";
import { WorkCard } from "@/components/ram/WorkCard";
import { cn } from "@/lib/utils";
import { useLogbook } from "@/hooks/useLogbookState";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScanLine, MapPin, Check } from "lucide-react";

export default function LogbookList() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { dispatch } = useLogbook();
  const { currentLocation, logbooks } = useDeviceLocation();
  const isMobile = useIsMobile();

  const filtered = logbooks.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchesTab = l.status === activeTab || activeTab === "active"; // show all for location-filtered data
    return matchesSearch;
  });

  return (
    <AppLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-ram-xl h-[70px] shrink-0">
        <h1 className="text-2xl font-extrabold text-foreground">My Logbooks</h1>
        <button
          onClick={() => navigate("/scan")}
          className="flex items-center gap-1.5 rounded-ram-md bg-brand-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-brand-600 transition-colors"
        >
          <ScanLine className="h-4 w-4" />
          Scan New Logbook
        </button>
      </header>

      {/* Mobile Location Bar */}
      {isMobile && (
        <button
          onClick={() => navigate("/settings/location")}
          className="flex items-center justify-center gap-1.5 h-8 bg-brand-100 text-text-xs font-medium text-gray-600 shrink-0"
        >
          <MapPin className="h-3 w-3 text-brand-500" />
          {currentLocation.name}
        </button>
      )}

      {/* Search + Toggle */}
      <div className="px-ram-xl pt-ram-lg space-y-ram-lg">
        <div className="flex items-center gap-ram-lg">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search logbooks..." />
          </div>
          <div className="flex rounded-ram-md border border-border overflow-hidden shrink-0">
            <button
              onClick={() => setActiveTab("active")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "active"
                  ? "bg-brand-500 text-white"
                  : "bg-card text-gray-600 hover:bg-muted"
              )}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "archived"
                  ? "bg-brand-500 text-white"
                  : "bg-card text-gray-600 hover:bg-muted"
              )}
            >
              Archived
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["Status", "Date"].map((f) => (
            <FilterChip
              key={f}
              label={f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
              onClear={() => setActiveFilter(null)}
            />
          ))}
          <FilterChip label="Sort: A-Z" />
        </div>
      </div>

      {/* Card List */}
      <div className="px-ram-xl py-ram-lg pb-ram-3xl">
        <div className="grid gap-ram-lg grid-cols-1">
          {filtered.map((logbook) => (
            <WorkCard
              key={logbook.id}
              logbook={logbook}
              showLocationBadge
              onNewEntry={() => {
                dispatch({ type: "SELECT_LOGBOOK", id: logbook.id });
                navigate(`/entry/${logbook.id}`);
              }}
              onViewHistory={() => navigate(`/history/${logbook.id}`)}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
