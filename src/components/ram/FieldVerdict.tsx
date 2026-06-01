import { useState } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldEvaluation } from "@/lib/evaluation";
import type { FormField } from "@/data/mockLogbooks";

interface FieldVerdictProps {
  field: FormField;
  evaluation: FieldEvaluation;
}

/**
 * Inline Pass/Fail chip with a click-to-reveal Evaluation Service trace.
 * Renders nothing while pending so empty fields stay quiet.
 */
export function FieldVerdict({ field, evaluation }: FieldVerdictProps) {
  const [showTrace, setShowTrace] = useState(false);

  if (evaluation.verdict === "pending") {
    if (!field.limits && field.type !== "toggle") return null;
    return (
      <div className="flex items-center gap-1.5 text-text-xs text-gray-500">
        <Info className="h-3 w-3" />
        <span>{field.limits?.description ?? "Awaiting input"}</span>
      </div>
    );
  }

  const pass = evaluation.verdict === "pass";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setShowTrace((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-text-xs font-extrabold transition-colors",
          pass
            ? "bg-success-100 text-success-400 hover:bg-success-100/80"
            : "bg-error-600/10 text-error-600 hover:bg-error-600/20"
        )}
      >
        {pass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
        {pass ? "Pass" : "Out of limit"}
        {evaluation.summary && <span className="font-medium opacity-80">· {evaluation.summary}</span>}
        <span className="ml-1 text-[10px] font-medium uppercase tracking-wider opacity-70">Why?</span>
      </button>
      {showTrace && (
        <div className="rounded-ram-xs border border-border bg-muted p-2 text-text-xs text-gray-600 animate-fade-in">
          <div className="font-extrabold text-foreground mb-0.5">Evaluation trace</div>
          <div className="font-mono">{evaluation.trace}</div>
          {field.limits?.description && (
            <div className="mt-1 text-gray-500">Criterion: {field.limits.description}</div>
          )}
        </div>
      )}
    </div>
  );
}
