import { useState, useMemo } from "react";
import { Download, CheckCircle, XCircle, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { SearchBar } from "@/components/ram/SearchBar";
import { StatusChip } from "@/components/ram/StatusChip";
import { EntryDetailDrawer } from "@/components/ram/EntryDetailDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { getEntriesBySlice, mockReviewEntries, type ReviewEntry, type ReviewStatus } from "@/data/mockAssets";
import { cn } from "@/lib/utils";

type DateRange = "today" | "7days" | "30days";
type StatusFilter = "all" | ReviewStatus;

export default function ReviewDashboard() {
  const isMobile = useIsMobile();
  
  const [dateRange, setDateRange] = useState<DateRange>("7days");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [detailEntry, setDetailEntry] = useState<ReviewEntry | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [confirmAction, setConfirmAction] = useState<{ action: "approve" | "reject"; ids: string[] } | null>(null);
  const [entries, setEntries] = useState(mockReviewEntries);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!e.operator.toLowerCase().includes(s) && !e.logbook.toLowerCase().includes(s) && !(e.asset ?? "").toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [entries, statusFilter, search]);

  const groups = useMemo(() => {
    const groupMap = new Map<string, ReviewEntry[]>();
    for (const e of filteredEntries) {
      const key = e.asset
        ? `${e.logbook} · ${e.asset}`
        : `${e.logbook} · Location-Level`;
      const arr = groupMap.get(key) ?? [];
      arr.push(e);
      groupMap.set(key, arr);
    }
    return Array.from(groupMap.entries()).map(([label, entries]) => ({
      label,
      totalEntries: entries.length,
      pendingCount: entries.filter((e) => e.status === "pending-review").length,
      entries,
    }));
  }, [filteredEntries]);

  const stats = useMemo(() => ({
    pending: entries.filter((e) => e.status === "pending-review").length,
    approved: entries.filter((e) => e.status === "approved").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
    total: entries.length,
  }), [entries]);

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    setConfirmAction({ action, ids: Array.from(selected) });
  };

  const confirmBulk = () => {
    if (!confirmAction) return;
    const newStatus: ReviewStatus = confirmAction.action === "approve" ? "approved" : "rejected";
    setEntries((prev) => prev.map((e) => confirmAction.ids.includes(e.id) ? { ...e, status: newStatus } : e));
    setSelected(new Set());
    setConfirmAction(null);
  };

  const handleApprove = (id: string) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: "approved" as ReviewStatus } : e));
    setDetailEntry(null);
  };

  const handleReject = (id: string) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: "rejected" as ReviewStatus } : e));
    setDetailEntry(null);
  };

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending-review", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <AppLayout>
      <HeaderNav
        type="workAgenda"
        title="QA Review"
        rightAction={
          <div className="flex items-center gap-ram-md">
            {isMobile && (
              <button
                onClick={() => { setSelectMode(!selectMode); if (selectMode) setSelected(new Set()); }}
                className={cn(
                  "rounded-ram-md px-ram-lg py-ram-md text-text-sm font-medium transition-colors",
                  selectMode ? "bg-brand-500 text-primary-foreground" : "border border-border text-foreground"
                )}
              >
                {selectMode ? "Cancel" : "Select"}
              </button>
            )}
            <button className="flex items-center gap-ram-sm rounded-ram-md border border-border px-ram-xl py-ram-md text-text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-ram-xl py-ram-xl space-y-ram-xl">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-ram-md">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-md text-text-sm text-foreground"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
            </select>
            <div className="flex gap-ram-xxs">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={cn(
                    "rounded-full px-ram-lg py-ram-sm text-text-xs font-medium border transition-colors",
                    statusFilter === opt.value
                      ? "bg-brand-500 text-primary-foreground border-brand-500"
                      : "bg-card text-gray-600 border-border"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex-1 min-w-[200px]">
              <SearchBar value={search} onChange={setSearch} placeholder="Search operator, asset, logbook…" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-ram-lg">
            <StatCard label="Pending Review" value={stats.pending} color="text-warning-400" />
            <StatCard label="Approved" value={stats.approved} color="text-success-400" />
            <StatCard label="Rejected" value={stats.rejected} color="text-error-600" />
            <StatCard label="Total Entries" value={stats.total} color="text-foreground" />
          </div>

          {/* Grid */}
          {isMobile ? (
            /* Mobile card list */
            <div className="space-y-ram-md">
              {groups.map((group) => (
                <div key={group.label}>
                  <button onClick={() => toggleGroup(group.label)} className="flex w-full items-center gap-ram-sm py-ram-md bg-gray-100 rounded-ram-md px-ram-lg mb-ram-sm">
                    {collapsedGroups.has(group.label) ? <ChevronRight className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
                    <span className="text-[15px] font-extrabold text-foreground">{group.label}</span>
                    <span className="text-text-xs text-gray-500 ml-auto">{group.totalEntries} entries, {group.pendingCount} pending</span>
                  </button>
                  {!collapsedGroups.has(group.label) && group.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-ram-md border border-border bg-card p-ram-lg mb-ram-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-ram-md">
                          {selectMode && (
                            <input type="checkbox" checked={selected.has(entry.id)} onChange={() => toggleSelect(entry.id)} className="accent-brand-500" />
                          )}
                          <span className="text-text-xs text-gray-500">{entry.date}</span>
                        </div>
                        <StatusChip status={entry.status} />
                      </div>
                      <p className="mt-ram-sm text-[15px] font-extrabold text-foreground">{entry.logbook}</p>
                      <p className="text-text-sm text-gray-600">{entry.location}{entry.asset ? ` · ${entry.asset}` : ""}</p>
                      <p className="text-text-sm text-gray-500">{entry.operator}</p>
                      <div className="mt-ram-lg flex gap-ram-md">
                        <button onClick={() => handleApprove(entry.id)} className="p-ram-md text-success-400 hover:bg-success-100 rounded-ram-xs"><CheckCircle className="h-5 w-5" /></button>
                        <button onClick={() => handleReject(entry.id)} className="p-ram-md text-error-600 hover:bg-error-100 rounded-ram-xs"><XCircle className="h-5 w-5" /></button>
                        <button onClick={() => setDetailEntry(entry)} className="p-ram-md text-brand-500 hover:bg-brand-100 rounded-ram-xs"><Eye className="h-5 w-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            /* Desktop table */
            <div className="rounded-ram-md border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="w-10 px-ram-lg py-ram-lg"><input type="checkbox" onChange={(e) => { if (e.target.checked) setSelected(new Set(filteredEntries.map(r => r.id))); else setSelected(new Set()); }} className="accent-brand-500" /></th>
                    <th className="text-left px-ram-lg py-ram-lg text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="text-left px-ram-lg py-ram-lg text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Logbook</th>
                    <th className="text-left px-ram-lg py-ram-lg text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="text-left px-ram-lg py-ram-lg text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Asset</th>
                    <th className="text-left px-ram-lg py-ram-lg text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Operator</th>
                    <th className="text-left px-ram-lg py-ram-lg text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="w-20 px-ram-lg py-ram-lg text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <GroupRows
                      key={group.label}
                      group={group}
                      collapsed={collapsedGroups.has(group.label)}
                      onToggle={() => toggleGroup(group.label)}
                      selected={selected}
                      onToggleSelect={toggleSelect}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onView={setDetailEntry}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div className="sticky bottom-0 z-40 flex items-center justify-between bg-brand-900 px-ram-xl py-ram-lg text-primary-foreground">
            <span className="text-[15px] font-medium">{selected.size} entries selected</span>
            <div className="flex gap-ram-md">
              <button onClick={() => handleBulkAction("approve")} className="rounded-ram-md px-ram-xl py-ram-md text-text-sm font-extrabold text-primary-foreground" style={{ backgroundColor: "hsl(157, 42%, 53%)" }}>
                Approve Selected
              </button>
              <button onClick={() => handleBulkAction("reject")} className="rounded-ram-md bg-error-600 px-ram-xl py-ram-md text-text-sm font-extrabold text-primary-foreground">
                Reject Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Entry detail drawer */}
      <EntryDetailDrawer entry={detailEntry} onClose={() => setDetailEntry(null)} onApprove={handleApprove} onReject={handleReject} />

      {/* Confirm modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60">
          <div className="mx-ram-xl max-w-sm w-full rounded-ram-xl bg-card p-ram-3xl shadow-ram-lg">
            <h3 className="text-text-lg font-extrabold text-foreground">
              {confirmAction.action === "approve" ? "Approve" : "Reject"} {confirmAction.ids.length} entries?
            </h3>
            <div className="mt-ram-xl flex gap-ram-md">
              <button onClick={() => setConfirmAction(null)} className="flex-1 rounded-ram-md border border-border py-ram-lg text-text-sm font-medium text-foreground">Cancel</button>
              <button onClick={confirmBulk} className={cn("flex-1 rounded-ram-md py-ram-lg text-text-sm font-extrabold text-primary-foreground", confirmAction.action === "approve" ? "bg-success-400" : "bg-error-600")}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-ram-md border border-border bg-card p-ram-xl">
      <p className={cn("text-display-xs font-extrabold", color)}>{value}</p>
      <p className="text-text-sm text-gray-600 mt-ram-xxs">{label}</p>
    </div>
  );
}

interface GroupRowsProps {
  group: { label: string; totalEntries: number; pendingCount: number; entries: ReviewEntry[] };
  collapsed: boolean;
  onToggle: () => void;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (entry: ReviewEntry) => void;
}

function GroupRows({ group, collapsed, onToggle, selected, onToggleSelect, onApprove, onReject, onView }: GroupRowsProps) {
  return (
    <>
      <tr className="bg-gray-100 cursor-pointer" onClick={onToggle}>
        <td colSpan={8} className="px-ram-lg py-ram-md">
          <div className="flex items-center gap-ram-sm">
            {collapsed ? <ChevronRight className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
            <span className="text-[15px] font-extrabold text-foreground">{group.label}</span>
            <span className="text-text-xs text-gray-500 ml-ram-md">({group.totalEntries} entries, {group.pendingCount} pending)</span>
          </div>
        </td>
      </tr>
      {!collapsed && group.entries.map((entry, i) => (
        <tr
          key={entry.id}
          className={cn(
            "h-[52px] border-b border-gray-200 hover:bg-brand-100 cursor-pointer transition-colors",
            i % 2 === 1 && "bg-gray-100/50"
          )}
          onClick={() => onView(entry)}
        >
          <td className="px-ram-lg" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={selected.has(entry.id)} onChange={() => onToggleSelect(entry.id)} className="accent-brand-500" />
          </td>
          <td className="px-ram-lg text-text-sm text-foreground whitespace-nowrap">{entry.date}</td>
          <td className="px-ram-lg text-text-sm text-foreground">{entry.logbook}</td>
          <td className="px-ram-lg text-text-sm text-foreground">{entry.location}</td>
          <td className="px-ram-lg text-text-sm text-foreground">{entry.asset ?? "—"}</td>
          <td className="px-ram-lg text-text-sm text-foreground">{entry.operator}</td>
          <td className="px-ram-lg"><StatusChip status={entry.status} /></td>
          <td className="px-ram-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-ram-xxs">
              <button onClick={() => onApprove(entry.id)} className="p-1 text-success-400 hover:text-success-900"><CheckCircle className="h-4 w-4" /></button>
              <button onClick={() => onReject(entry.id)} className="p-1 text-error-600 hover:text-error-900"><XCircle className="h-4 w-4" /></button>
              <button onClick={() => onView(entry)} className="p-1 text-brand-500 hover:text-brand-600"><Eye className="h-4 w-4" /></button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
