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
import { Calendar, Zap, X } from "lucide-react";

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
      <HeaderNav type="back" title={logbook?.name ?? "Logbook Entry"} onBack={() => navigate("/")} />

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
        <div className="mx-auto max-w-[600px] space-y-ram-xl">
          {/* Quick Fill Banner */}
          {!quickFillDismissed && !hasAnyValue && (
            <div className="flex items-center gap-ram-lg rounded-ram-md border border-brand-200 bg-brand-50 p-ram-lg animate-fade-in">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 shrink-0">
                <Zap className="h-5 w-5 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-sm font-extrabold text-foreground">Quick Fill from Last Entry</p>
                <p className="text-text-xs text-gray-500 mt-ram-xxs">
                  Populate fields with values from your most recent entry
                </p>
              </div>
              <div className="flex items-center gap-ram-sm shrink-0">
                <Button
                  onClick={handleQuickFill}
                  size="sm"
                  className="rounded-ram-md bg-brand-500 text-white text-text-xs font-extrabold hover:bg-brand-600 h-8 px-ram-lg"
                >
                  Apply
                </Button>
                <button
                  onClick={() => setQuickFillDismissed(true)}
                  className="p-ram-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
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
      <div className="sticky bottom-0 border-t border-border bg-background px-ram-xl py-ram-xl shrink-0">
        <div className="mx-auto max-w-[600px]">
          <Button
            onClick={() => dispatch({ type: "OPEN_SIGN" })}
            className="w-full h-12 rounded-ram-md bg-brand-500 text-white font-extrabold text-text-lg hover:bg-brand-600"
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
