import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { ConfidenceChip } from "@/components/ram/ConfidenceChip";
import { Button } from "@/components/ui/button";
import { mockScanResults, type ScanField } from "@/data/mockLogbooks";
import { Check, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function FormReview() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<ScanField[]>(mockScanResults);

  const toggleApprove = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, approved: !f.approved } : f))
    );
  };

  const approveAll = () => {
    setFields((prev) => prev.map((f) => ({ ...f, approved: true })));
    toast({ title: "All fields approved", description: "Logbook form has been published." });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <AppLayout>
      <HeaderNav type="back" title="Review Proposed Fields" onBack={() => navigate("/")} />

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
        <div className="mx-auto max-w-[600px] space-y-ram-lg">
          {fields.map((field) => (
            <div
              key={field.id}
              className={cn(
                "flex items-center gap-ram-lg rounded-ram-md border p-ram-xl transition-colors",
                field.approved ? "border-success-400 bg-success-100" : "border-gray-300 bg-card"
              )}
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-text-md font-extrabold text-foreground">{field.name}</h4>
                <p className="text-text-md text-gray-600 mt-ram-xxs">{field.value}</p>
                <ConfidenceChip confidence={field.confidence} className="mt-ram-sm" />
              </div>
              <div className="flex items-center gap-ram-sm shrink-0">
                <button className="flex h-8 w-8 items-center justify-center rounded-ram-xs text-gray-600 hover:bg-gray-100">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleApprove(field.id)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-ram-xs transition-colors",
                    field.approved
                      ? "bg-success-400 text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {field.approved ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-border bg-background px-ram-xl py-ram-xl">
        <div className="mx-auto max-w-[600px] flex gap-ram-lg">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex-1 h-11 rounded-ram-md border-brand-500 text-brand-500 font-extrabold text-text-lg"
          >
            Send to Review Queue
          </Button>
          <Button
            onClick={approveAll}
            className="flex-1 h-11 rounded-ram-md bg-brand-400 text-primary-foreground font-extrabold text-text-lg hover:bg-brand-500"
          >
            Approve All
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
