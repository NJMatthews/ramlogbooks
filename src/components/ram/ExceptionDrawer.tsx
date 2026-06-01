import { useState } from "react";
import { AlertTriangle, Camera, ArrowRight } from "lucide-react";
import { RAMDrawer } from "./RAMDrawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormField } from "@/data/mockLogbooks";
import { evaluateField } from "@/lib/evaluation";

interface ExceptionDrawerProps {
  open: boolean;
  failures: FormField[];
  assetName?: string | null;
  onClose: () => void;
  /** Called when the operator has acknowledged impact and is ready to e-sign. */
  onContinue: (payload: { impact: string; attached: boolean }) => void;
}

/**
 * P0.3 Exception handling — runs offline, blocks e-sign until the
 * operator captures impact text, optionally attaches evidence, and
 * acknowledges the escalation path preview.
 */
export function ExceptionDrawer({ open, failures, assetName, onClose, onContinue }: ExceptionDrawerProps) {
  const [impact, setImpact] = useState("");
  const [attached, setAttached] = useState(false);

  const canContinue = impact.trim().length >= 10;

  const handleContinue = () => {
    onContinue({ impact: impact.trim(), attached });
    setImpact("");
    setAttached(false);
  };

  return (
    <RAMDrawer
      open={open}
      onClose={onClose}
      title="Exception detected"
      footer={
        <div className="flex w-full gap-ram-md">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-ram-md border-gray-300 text-gray-600 font-extrabold text-text-lg"
          >
            Back to edit
          </Button>
          <Button
            disabled={!canContinue}
            onClick={handleContinue}
            className={cn(
              "flex-1 h-11 rounded-ram-md text-primary-foreground font-extrabold text-text-lg",
              "bg-error-600 hover:bg-error-600/90 disabled:opacity-40"
            )}
          >
            Continue to sign
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="space-y-ram-xl py-ram-md animate-fade-in">
        {/* Banner */}
        <div className="flex items-start gap-ram-md rounded-ram-md bg-error-600/10 p-ram-lg border border-error-600/30">
          <AlertTriangle className="h-5 w-5 text-error-600 shrink-0 mt-0.5" />
          <div className="text-text-sm text-foreground">
            <p className="font-extrabold">
              {failures.length} {failures.length === 1 ? "value is" : "values are"} out of limit.
            </p>
            <p className="text-gray-600 mt-0.5">
              Submitting this entry will auto-draft a RAM work request and route to QA review.
            </p>
          </div>
        </div>

        {/* Failed values */}
        <section>
          <h3 className="text-text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-ram-md">
            Failed checks
          </h3>
          <div className="space-y-ram-sm">
            {failures.map((f) => {
              const ev = evaluateField(f);
              return (
                <div key={f.id} className="rounded-ram-xs border border-border bg-card p-ram-md">
                  <div className="flex items-center justify-between">
                    <span className="text-text-sm font-extrabold text-foreground">{f.label}</span>
                    <span className="text-text-xs font-extrabold text-error-600">{ev.summary}</span>
                  </div>
                  {f.limits?.description && (
                    <p className="text-text-xs text-gray-500 mt-0.5">{f.limits.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Impact assessment */}
        <section>
          <label className="text-text-sm font-extrabold text-foreground">
            Impact assessment <span className="text-error-600">*</span>
          </label>
          <p className="text-text-xs text-gray-500 mb-ram-sm">
            Describe the impact and immediate containment. Minimum 10 characters.
          </p>
          <textarea
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            placeholder="e.g. Particle count spike during gowning shift change; area cleared and re-tested..."
            className="w-full h-28 rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-md text-text-md text-foreground placeholder:text-gray-500 resize-none outline-none focus:border-brand-500"
          />
        </section>

        {/* Optional attachment */}
        <button
          type="button"
          onClick={() => setAttached((v) => !v)}
          className={cn(
            "flex w-full items-center gap-ram-md rounded-ram-md border p-ram-md text-left transition-colors",
            attached ? "border-brand-500 bg-brand-100" : "border-dashed border-gray-300 hover:border-brand-500"
          )}
        >
          <Camera className={cn("h-5 w-5", attached ? "text-brand-500" : "text-gray-500")} />
          <div className="flex-1">
            <p className="text-text-sm font-extrabold text-foreground">
              {attached ? "Photo attached" : "Attach photo evidence"}
            </p>
            <p className="text-text-xs text-gray-500">
              {attached ? "exception-photo-001.jpg · 1.2 MB" : "Optional but recommended for QA review"}
            </p>
          </div>
        </button>

        {/* Escalation preview */}
        <section className="rounded-ram-md border border-border bg-muted p-ram-lg">
          <h3 className="text-text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-ram-sm">
            Escalation path
          </h3>
          <ol className="space-y-ram-xs text-text-sm text-foreground">
            <li className="flex gap-2"><span className="text-gray-500">1.</span> Sign as <b>Performed</b> with impact</li>
            <li className="flex gap-2"><span className="text-gray-500">2.</span> Auto-draft RAM work request on <b>{assetName ?? "asset"}</b></li>
            <li className="flex gap-2"><span className="text-gray-500">3.</span> Notify Supervisor + QA Reviewer queue</li>
            <li className="flex gap-2"><span className="text-gray-500">4.</span> Hold for QA disposition</li>
          </ol>
        </section>
      </div>
    </RAMDrawer>
  );
}
