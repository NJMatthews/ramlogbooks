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
import { Calendar } from "lucide-react";

export default function LogbookEntryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useLogbook();
  const logbook = mockLogbooks.find((l) => l.id === id);

  return (
    <AppLayout>
      <HeaderNav type="back" title={logbook?.name ?? "Logbook Entry"} onBack={() => navigate("/")} />

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
        <div className="mx-auto max-w-[600px] space-y-ram-xl">
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
      <div className="sticky bottom-0 border-t border-border bg-background px-ram-xl py-ram-xl">
        <div className="mx-auto max-w-[600px]">
          <Button
            onClick={() => dispatch({ type: "OPEN_SIGN" })}
            className="w-full h-12 rounded-ram-md bg-brand-400 text-primary-foreground font-extrabold text-text-lg hover:bg-brand-500"
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
