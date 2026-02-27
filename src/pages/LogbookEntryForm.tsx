import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { RAMInput } from "@/components/ram/RAMInput";
import { RAMTextarea } from "@/components/ram/RAMTextarea";
import { RAMToggle } from "@/components/ram/RAMToggle";
import { ESignDrawer } from "@/components/ram/ESignDrawer";
import { SuccessDrawer } from "@/components/ram/SuccessDrawer";
import { Button } from "@/components/ui/button";
import { useLogbook } from "@/hooks/useLogbookState";
import { mockLogbooks } from "@/data/mockLogbooks";
import { Calendar, Zap, Clock, ArrowRight } from "lucide-react";

// Simulated "last entry" values for Quick Fill
const lastEntryValues: Record<string, string> = {
  datetime: new Date().toLocaleString(),
  operator: "John Smith (Badge #4521)",
  room: "CR-302 (Building 3, Floor 2)",
  temperature: "21.3",
  humidity: "45.2",
  pressure: "12.5",
  particle05: "3200",
  particle50: "18",
};

const lastEntryMeta = {
  operator: "J. Martinez",
  date: "Feb 26, 2026 12:15 PM",
  chips: [
    "Temperature (°C): 21.3 °C",
    "Humidity (%RH): 45.2 %RH",
    "Differential Pressure (Pa): 12.5 Pa",
    "Particle Count (0.5µm): 3200",
  ],
};

export default function LogbookEntryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useLogbook();
  const logbook = mockLogbooks.find((l) => l.id === id);
  const [quickFillDismissed, setQuickFillDismissed] = useState(false);

  const hasAnyValue = state.formFields.some((f) => f.value.trim() !== "" && f.type !== "toggle");

  const handleQuickFill = () => {
    Object.entries(lastEntryValues).forEach(([fieldId, value]) => {
      dispatch({ type: "UPDATE_FIELD", fieldId, value });
    });
    setQuickFillDismissed(true);
  };

  return (
    <AppLayout>
      <HeaderNav
        type="back"
        title={logbook?.name ?? "Logbook Entry"}
        onBack={() => navigate("/")}
        rightAction={
          <button
            onClick={() => navigate(`/history/${id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-500 text-brand-500 text-sm font-medium hover:bg-brand-100 transition-colors"
          >
            <Clock className="h-4 w-4" />
            History
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
        <div className="mx-auto max-w-[600px] space-y-ram-xl">
          {/* Quick Fill Banner */}
          {!quickFillDismissed && !hasAnyValue && (
            <div className="rounded-ram-xl border border-border bg-card p-4 animate-fade-in">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-foreground" />
                  <span className="text-sm font-extrabold text-foreground">Quick Fill from Previous Entry</span>
                </div>
                <button
                  onClick={() => setQuickFillDismissed(true)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {lastEntryMeta.operator} — {lastEntryMeta.date}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {lastEntryMeta.chips.map((chip) => (
                  <span key={chip} className="text-xs border border-border rounded-full px-3 py-1 text-gray-600 bg-muted">
                    {chip}
                  </span>
                ))}
              </div>
              <button
                onClick={handleQuickFill}
                className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
              >
                Apply all previous values
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {state.formFields.map((field) => {
            if (field.type === "textarea") {
              return (
                <RAMTextarea
                  key={field.id}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: field.id, value: v })}
                  placeholder="Enter observations..."
                  expanded
                />
              );
            }
            if (field.type === "toggle") {
              return (
                <RAMToggle
                  key={field.id}
                  label={field.label}
                  value={field.value === "pass"}
                  onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: field.id, value: v ? "pass" : "fail" })}
                />
              );
            }
            return (
              <RAMInput
                key={field.id}
                label={field.label}
                value={field.value}
                onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: field.id, value: v })}
                readOnly={field.readOnly}
                type={field.type === "number" ? "number" : "text"}
                leadingIcon={field.type === "datetime" ? <Calendar className="h-4 w-4" /> : undefined}
                needsConfirmation={field.timeSensitive && field.prefilled}
                confirmed={state.confirmedFields.has(field.id)}
                onConfirm={() => dispatch({ type: "CONFIRM_FIELD", fieldId: field.id })}
              />
            );
          })}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t border-border bg-card px-ram-xl py-ram-xl shrink-0">
        <div className="mx-auto max-w-[600px]">
          <Button
            onClick={() => dispatch({ type: "OPEN_SIGN" })}
            className="w-full h-12 rounded-ram-md bg-brand-500 text-white font-extrabold text-lg hover:bg-brand-600"
          >
            Sign & Submit
          </Button>
        </div>
      </div>

      <ESignDrawer
        open={state.isSigning}
        onClose={() => dispatch({ type: "CLOSE_SIGN" })}
        onSign={() => dispatch({ type: "SIGN_ENTRY" })}
      />

      <SuccessDrawer
        open={state.showSuccess}
        onDone={() => {
          dispatch({ type: "HIDE_SUCCESS" });
          dispatch({ type: "RESET_FORM" });
          navigate("/");
        }}
      />
    </AppLayout>
  );
}
