import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { mockLogbooks } from "@/data/mockLogbooks";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock historical entries
const mockHistoryEntries = [
  { id: "h1", date: "2026-02-27", time: "2:34 PM", operator: "John Smith", status: "pass", temperature: "21.3", humidity: "45.2", pressure: "12.5" },
  { id: "h2", date: "2026-02-26", time: "2:15 PM", operator: "Jane Doe", status: "pass", temperature: "21.1", humidity: "44.8", pressure: "12.3" },
  { id: "h3", date: "2026-02-25", time: "3:00 PM", operator: "John Smith", status: "pass", temperature: "21.5", humidity: "45.0", pressure: "12.6" },
  { id: "h4", date: "2026-02-24", time: "1:45 PM", operator: "Mike Chen", status: "fail", temperature: "22.8", humidity: "48.1", pressure: "11.9" },
  { id: "h5", date: "2026-02-23", time: "2:30 PM", operator: "Jane Doe", status: "pass", temperature: "21.0", humidity: "44.5", pressure: "12.4" },
  { id: "h6", date: "2026-02-22", time: "2:00 PM", operator: "John Smith", status: "pass", temperature: "21.2", humidity: "45.3", pressure: "12.5" },
  { id: "h7", date: "2026-02-21", time: "3:15 PM", operator: "Jane Doe", status: "pass", temperature: "21.4", humidity: "44.9", pressure: "12.7" },
  { id: "h8", date: "2026-02-20", time: "2:45 PM", operator: "Mike Chen", status: "pass", temperature: "21.1", humidity: "45.1", pressure: "12.3" },
];

export default function LogbookHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const logbook = mockLogbooks.find((l) => l.id === id);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const entry = mockHistoryEntries[selectedIndex];

  const goPrev = () => setSelectedIndex((i) => Math.min(i + 1, mockHistoryEntries.length - 1));
  const goNext = () => setSelectedIndex((i) => Math.max(i - 1, 0));

  return (
    <AppLayout>
      <HeaderNav
        type="back"
        title={logbook?.name ?? "History"}
        onBack={() => navigate("/")}
        rightAction={
          <span className="text-text-xs text-gray-500">{mockHistoryEntries.length} entries</span>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Date sidebar */}
        <div className="w-[140px] shrink-0 border-r border-border bg-gray-50 overflow-y-auto">
          <div className="py-ram-md">
            {mockHistoryEntries.map((e, i) => (
              <button
                key={e.id}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "w-full text-left px-ram-lg py-ram-lg border-l-[3px] transition-colors",
                  i === selectedIndex
                    ? "border-l-brand-500 bg-brand-50 text-brand-500"
                    : "border-l-transparent text-gray-600 hover:bg-gray-100"
                )}
              >
                <p className="text-text-sm font-extrabold">{e.date.slice(5)}</p>
                <p className="text-text-xs text-gray-400">{e.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Entry detail panel */}
        <div className="flex-1 overflow-y-auto">
          {/* Swipe nav header */}
          <div className="flex items-center justify-between px-ram-xl py-ram-lg border-b border-border bg-background sticky top-0 z-10">
            <button
              onClick={goPrev}
              disabled={selectedIndex >= mockHistoryEntries.length - 1}
              className="flex items-center gap-ram-sm text-text-sm text-brand-500 disabled:text-gray-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Older
            </button>
            <div className="text-center">
              <p className="text-text-md font-extrabold text-foreground">{entry.date}</p>
              <p className="text-text-xs text-gray-500">{entry.time} • {entry.operator}</p>
            </div>
            <button
              onClick={goNext}
              disabled={selectedIndex <= 0}
              className="flex items-center gap-ram-sm text-text-sm text-brand-500 disabled:text-gray-300 transition-colors"
            >
              Newer
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Entry fields */}
          <div className="px-ram-xl py-ram-xl animate-fade-in" key={entry.id}>
            <div className="max-w-[500px] space-y-ram-xl">
              <HistoryField label="Date/Time" value={`${entry.date} ${entry.time}`} />
              <HistoryField label="Operator" value={entry.operator} />
              <HistoryField label="Temperature (°C)" value={`${entry.temperature} °C`} />
              <HistoryField label="Humidity (%RH)" value={`${entry.humidity} %RH`} />
              <HistoryField label="Differential Pressure (Pa)" value={`${entry.pressure} Pa`} />
              <HistoryField
                label="Status"
                value={entry.status === "pass" ? "Pass" : "Fail"}
                valueClass={entry.status === "pass" ? "text-success-400" : "text-error-600"}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function HistoryField({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-ram-xxs">
      <span className="text-text-sm font-medium text-gray-500">{label}</span>
      <div className="rounded-ram-xs border border-gray-200 bg-gray-50 px-ram-lg py-ram-lg">
        <span className={cn("text-text-md text-foreground", valueClass)}>{value}</span>
      </div>
    </div>
  );
}
