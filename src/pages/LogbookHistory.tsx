import { useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { mockLogbooks } from "@/data/mockLogbooks";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";

const mockHistoryEntries = [
  { id: "h1", date: "Feb 26, 2026", time: "12:15 PM", operator: "J. Martinez", status: "pass", temperature: "21.3", humidity: "45.2", pressure: "12.5", particle05: "3200", particle50: "18", observations: "All readings within normal range." },
  { id: "h2", date: "Feb 26, 2026", time: "8:02 AM", operator: "K. Chen", status: "pass", temperature: "21.1", humidity: "44.8", pressure: "12.3", particle05: "3100", particle50: "15", observations: "Normal operations." },
  { id: "h3", date: "Feb 25, 2026", time: "4:30 PM", operator: "J. Martinez", status: "pass", temperature: "21.5", humidity: "45.0", pressure: "12.6", particle05: "3150", particle50: "16", observations: "" },
  { id: "h4", date: "Feb 25, 2026", time: "12:10 PM", operator: "A. Patel", status: "pass", temperature: "22.0", humidity: "46.1", pressure: "12.1", particle05: "3400", particle50: "20", observations: "Slight humidity increase noted." },
  { id: "h5", date: "Feb 25, 2026", time: "7:55 AM", operator: "K. Chen", status: "pass", temperature: "21.0", humidity: "44.5", pressure: "12.4", particle05: "3050", particle50: "14", observations: "" },
];

export default function LogbookHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const logbook = mockLogbooks.find((l) => l.id === id);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (tableRef.current?.offsetLeft ?? 0);
    scrollLeft.current = tableRef.current?.scrollLeft ?? 0;
    if (tableRef.current) tableRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !tableRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = x - startX.current;
    tableRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (tableRef.current) tableRef.current.style.cursor = "grab";
  }, []);

  const entry = mockHistoryEntries[selectedIndex];

  return (
    <AppLayout>
      <HeaderNav
        type="back"
        title={logbook?.name ?? "History"}
        onBack={() => navigate("/")}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOP HALF — Detail view */}
        <div className="flex h-1/2 min-h-0 border-b border-border">
          {/* Left: Entry list */}
          <div className="w-[220px] shrink-0 border-r border-border bg-card overflow-y-auto">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-extrabold text-foreground">All Entries ({mockHistoryEntries.length})</h3>
            </div>
            {mockHistoryEntries.map((e, i) => (
              <button
                key={e.id}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "w-full text-left px-4 py-2.5 border-l-[3px] border-b border-border transition-colors",
                  i === selectedIndex
                    ? "border-l-brand-500 bg-brand-50"
                    : "border-l-transparent hover:bg-muted"
                )}
              >
                <p className="text-sm font-extrabold text-foreground">{e.date} {e.time}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{e.operator}</p>
                <span className="inline-block mt-1 text-xs font-medium text-success-400 bg-success-100 px-2 py-0.5 rounded">
                  Signed
                </span>
              </button>
            ))}
          </div>

          {/* Right: Entry detail */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 animate-fade-in" key={entry.id}>
              <div className="max-w-[420px] space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{entry.date} {entry.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{entry.operator}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-success-400 bg-success-100 px-2.5 py-1 rounded">
                    Signed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <HistoryField label="TEMPERATURE (°C)" value={entry.temperature} unit="°C" />
                  <HistoryField label="HUMIDITY (%RH)" value={entry.humidity} unit="%RH" />
                  <HistoryField label="DIFF. PRESSURE (PA)" value={entry.pressure} unit="Pa" />
                  <HistoryField label="PARTICLE (0.5µm)" value={entry.particle05} />
                  <HistoryField label="PARTICLE (5.0µm)" value={entry.particle50} />
                  <HistoryField label="STATUS" value={entry.status === "pass" ? "Pass" : "Fail"} />
                </div>
                {entry.observations && (
                  <HistoryField label="OBSERVATIONS" value={entry.observations} />
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedIndex((i) => Math.min(i + 1, mockHistoryEntries.length - 1))}
                    disabled={selectedIndex >= mockHistoryEntries.length - 1}
                    className="flex items-center gap-1 text-sm text-brand-500 disabled:text-muted-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground px-2">
                    {selectedIndex + 1} / {mockHistoryEntries.length}
                  </span>
                  <button
                    onClick={() => setSelectedIndex((i) => Math.max(i - 1, 0))}
                    disabled={selectedIndex <= 0}
                    className="flex items-center gap-1 text-sm font-extrabold text-brand-500 disabled:text-muted-foreground"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HALF — Comparison table */}
        <div className="h-1/2 min-h-0 flex flex-col overflow-hidden bg-card">
          <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-foreground">Entry Comparison</h3>
            <span className="text-xs text-muted-foreground">{mockHistoryEntries.length} entries</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="min-w-[800px] text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted text-left">
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">Date / Time</th>
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">Operator</th>
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">Temp (°C)</th>
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">Humidity (%)</th>
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">Pressure (Pa)</th>
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">0.5µm</th>
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">5.0µm</th>
                  <th className="px-3 py-2 font-extrabold text-muted-foreground text-xs whitespace-nowrap border-b border-border">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockHistoryEntries.map((e, i) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelectedIndex(i)}
                    className={cn(
                      "cursor-pointer transition-colors border-b border-border",
                      i === selectedIndex
                        ? "bg-brand-50"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-foreground">{e.date} {e.time}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{e.operator}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground font-medium">{e.temperature}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground font-medium">{e.humidity}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground font-medium">{e.pressure}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground font-medium">{e.particle05}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground font-medium">{e.particle50}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        e.status === "pass" ? "text-success-400 bg-success-100" : "text-error-600 bg-red-100"
                      )}>
                        {e.status === "pass" ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function HistoryField({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-ram-xs border border-border bg-background px-3 py-2">
      <p className="text-[10px] font-extrabold text-muted-foreground tracking-wider uppercase mb-0.5">{label}</p>
      <p className="text-base font-extrabold text-foreground">
        {value}
        {unit && <span className="text-xs font-medium text-muted-foreground ml-1">{unit}</span>}
      </p>
    </div>
  );
}
