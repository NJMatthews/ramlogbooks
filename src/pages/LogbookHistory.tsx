import { useState } from "react";
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

  const entry = mockHistoryEntries[selectedIndex];

  return (
    <AppLayout>
      <HeaderNav
        type="back"
        title={logbook?.name ?? "History"}
        onBack={() => navigate("/")}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Entry list */}
        <div className="w-[240px] shrink-0 border-r border-border bg-card overflow-y-auto">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-extrabold text-foreground">All Entries ({mockHistoryEntries.length})</h3>
          </div>
          {mockHistoryEntries.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "w-full text-left px-4 py-3 border-l-[3px] border-b border-border transition-colors",
                i === selectedIndex
                  ? "border-l-brand-500 bg-brand-50"
                  : "border-l-transparent hover:bg-muted"
              )}
            >
              <p className="text-sm font-extrabold text-foreground">{e.date} {e.time}</p>
              <p className="text-xs text-gray-500 mt-0.5">{e.operator}</p>
              <span className="inline-block mt-1.5 text-xs font-medium text-success-400 bg-success-100 px-2 py-0.5 rounded">
                Signed
              </span>
            </button>
          ))}
        </div>

        {/* Right: Entry detail */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 animate-fade-in" key={entry.id}>
            <div className="max-w-[420px] space-y-4">
              {/* Date/Operator header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{entry.date} {entry.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{entry.operator}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-success-400 bg-success-100 px-2.5 py-1 rounded">
                  Signed
                </span>
              </div>

              {/* Field cards */}
              <HistoryField label="TEMPERATURE (°C)" value={entry.temperature} unit="°C" />
              <HistoryField label="HUMIDITY (%RH)" value={entry.humidity} unit="%RH" />
              <HistoryField label="DIFFERENTIAL PRESSURE (PA)" value={entry.pressure} unit="Pa" />
              <HistoryField label="PARTICLE COUNT (0.5MM)" value={entry.particle05} />
              <HistoryField label="PARTICLE COUNT (5.0MM)" value={entry.particle50} />
              <HistoryField label="OBSERVATIONS" value={entry.observations || "—"} />
              <HistoryField label="STATUS" value={entry.status === "pass" ? "Pass" : "Fail"} />

              {/* Entry navigation */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedIndex((i) => Math.min(i + 1, mockHistoryEntries.length - 1))}
                  disabled={selectedIndex >= mockHistoryEntries.length - 1}
                  className="flex items-center gap-1 text-sm text-brand-500 disabled:text-gray-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Entry
                </button>
                <span className="text-sm text-gray-500 px-2">
                  {selectedIndex + 1} / {mockHistoryEntries.length}
                </span>
                <button
                  onClick={() => setSelectedIndex((i) => Math.max(i - 1, 0))}
                  disabled={selectedIndex <= 0}
                  className="flex items-center gap-1 text-sm font-extrabold text-brand-500 disabled:text-gray-300"
                >
                  Next Entry
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function HistoryField({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-ram-xl border border-border bg-card px-4 py-3">
      <p className="text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-1">{label}</p>
      <p className="text-lg font-extrabold text-foreground">
        {value}
        {unit && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
}
