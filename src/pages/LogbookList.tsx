import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { SearchBar } from "@/components/ram/SearchBar";
import { FilterChip } from "@/components/ram/FilterChip";
import { WorkCard } from "@/components/ram/WorkCard";
import { mockLogbooks } from "@/data/mockLogbooks";
import { cn } from "@/lib/utils";
import { useLogbook } from "@/hooks/useLogbookState";

const tabs = ["Work", "Asset", "Work Plan"] as const;

export default function LogbookList() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Work");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { dispatch } = useLogbook();

  const filtered = mockLogbooks.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <HeaderNav type="workAgenda" title="Work Agenda" />

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-ram-lg text-text-md font-medium text-center transition-colors relative",
              activeTab === tab ? "text-brand-500" : "text-gray-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-500 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="px-ram-xl py-ram-lg space-y-ram-lg">
        <SearchBar value={search} onChange={setSearch} placeholder="Search logbooks..." />
        <div className="flex gap-ram-md overflow-x-auto">
          {["Location", "Status", "Date"].map((f) => (
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
      <div className="px-ram-xl pb-ram-3xl">
        <div className="grid gap-ram-lg grid-cols-1 md:grid-cols-2">
          {filtered.map((logbook) => (
            <WorkCard
              key={logbook.id}
              logbook={logbook}
              onClick={() => {
                dispatch({ type: "SELECT_LOGBOOK", id: logbook.id });
                navigate(`/entry/${logbook.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
