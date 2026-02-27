import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { ScanStepper } from "@/components/ram/ScanStepper";
import { HowItWorks } from "@/components/ram/HowItWorks";
import { Button } from "@/components/ui/button";
import {
  Flashlight,
  SwitchCamera,
  Focus,
  Check,
  X,
  Pencil,
  FileText,
  LayoutGrid,
  Smartphone,
} from "lucide-react";
import { ConfidenceChip } from "@/components/ram/ConfidenceChip";
import { cn } from "@/lib/utils";
import { mockScanResults, type ScanField } from "@/data/mockLogbooks";

const SCAN_STEPS = ["Capture", "Extract", "Review", "Layout", "Save"];

type FlowPhase = "tour" | "capture" | "processing" | "review" | "layout" | "save" | "done";

export default function ScanCamera() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<FlowPhase>("tour");
  const [fields, setFields] = useState<ScanField[]>(mockScanResults);
  const [layoutChoice, setLayoutChoice] = useState<"paper" | "digital" | null>(null);
  const [logbookName, setLogbookName] = useState("");
  const [logbookLocation, setLogbookLocation] = useState("");

  const currentStep =
    phase === "tour" ? 0
    : phase === "capture" || phase === "processing" ? 0
    : phase === "review" ? 2
    : phase === "layout" ? 3
    : phase === "save" || phase === "done" ? 4
    : 0;

  const handleCapture = () => {
    setPhase("processing");
    setTimeout(() => setPhase("review"), 2500);
  };

  const toggleApprove = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, approved: !f.approved } : f))
    );
  };

  const approveAll = () => {
    setFields((prev) => prev.map((f) => ({ ...f, approved: true })));
  };

  // Tour phase
  if (phase === "tour") {
    return (
      <AppLayout>
        <HeaderNav type="back" title="Scan & Convert" onBack={() => navigate("/")} />
        <HowItWorks onComplete={() => setPhase("capture")} />
      </AppLayout>
    );
  }

  // Camera capture phase
  if (phase === "capture" || phase === "processing") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-foreground">
        <div className="relative z-10">
          <HeaderNav type="back" title="Scan Logbook Page" onBack={() => setPhase("tour")} />
        </div>
        <ScanStepper steps={SCAN_STEPS} currentStep={0} className="bg-foreground/80" />

        <div className="flex-1 relative flex items-center justify-center">
          <div
            className={cn(
              "h-[280px] w-[85%] max-w-[400px] rounded-ram-xl border-4 transition-all",
              phase === "processing"
                ? "border-brand-500"
                : "border-primary-foreground/50 animate-pulse"
            )}
          >
            {/* Simulated paper lines */}
            <div className="h-full w-full p-ram-xl flex flex-col justify-center gap-ram-lg opacity-20">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-px bg-primary-foreground/60 w-full" />
              ))}
            </div>
          </div>

          {phase === "processing" && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/70">
              <div className="flex flex-col items-center gap-ram-xl animate-fade-in">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-foreground border-t-brand-500" />
                <p className="text-text-lg text-primary-foreground font-extrabold">Extracting fields...</p>
                <p className="text-text-sm text-primary-foreground/60">Reading column headers & data types</p>
              </div>
            </div>
          )}

          <div className="absolute top-ram-xl right-ram-xl flex flex-col gap-ram-lg">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <Flashlight className="h-5 w-5 text-primary-foreground" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <SwitchCamera className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>
        </div>

        {phase === "capture" && (
          <div className="flex flex-col items-center gap-ram-md pb-ram-7xl">
            <button
              onClick={handleCapture}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary-foreground bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/40"
            >
              <Focus className="h-8 w-8 text-primary-foreground" />
            </button>
            <p className="text-text-xs text-primary-foreground/60">Tap to capture</p>
          </div>
        )}
      </div>
    );
  }

  // Review extracted fields
  if (phase === "review") {
    const allApproved = fields.every((f) => f.approved);
    return (
      <AppLayout>
        <HeaderNav type="back" title="Review Proposed Fields" onBack={() => setPhase("capture")} />
        <ScanStepper steps={SCAN_STEPS} currentStep={2} />

        <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
          <p className="text-text-sm text-gray-500 mb-ram-xl">
            We found {fields.length} fields from your paper log. Review and approve each one.
          </p>
          <div className="mx-auto max-w-[600px] space-y-ram-lg">
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "flex items-center gap-ram-lg rounded-ram-md border p-ram-xl transition-colors animate-fade-in",
                  field.approved
                    ? "border-success-400 bg-success-100"
                    : "border-gray-300 bg-card"
                )}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-text-md font-extrabold text-foreground">{field.name}</h4>
                  <p className="text-text-sm text-gray-500 mt-ram-xxs">Detected: "{field.value}"</p>
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
                        ? "bg-success-400 text-white"
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

        <div className="sticky bottom-0 border-t border-border bg-background px-ram-xl py-ram-xl shrink-0">
          <div className="mx-auto max-w-[600px] flex gap-ram-lg">
            <Button
              variant="outline"
              onClick={approveAll}
              className="flex-1 h-11 rounded-ram-md border-brand-500 text-brand-500 font-extrabold"
            >
              Approve All
            </Button>
            <Button
              onClick={() => setPhase("layout")}
              disabled={!allApproved}
              className="flex-1 h-11 rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600"
            >
              Continue
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Layout selection
  if (phase === "layout") {
    return (
      <AppLayout>
        <HeaderNav type="back" title="Choose Layout" onBack={() => setPhase("review")} />
        <ScanStepper steps={SCAN_STEPS} currentStep={3} />

        <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
          <div className="mx-auto max-w-[600px]">
            <h2 className="text-text-lg font-extrabold text-foreground mb-ram-sm">
              How should your digital form look?
            </h2>
            <p className="text-text-sm text-gray-500 mb-ram-xl">
              Choose a layout that works best for your team.
            </p>

            <div className="grid gap-ram-xl">
              {/* Match Paper */}
              <button
                onClick={() => setLayoutChoice("paper")}
                className={cn(
                  "flex flex-col rounded-ram-md border-2 p-ram-xl text-left transition-all",
                  layoutChoice === "paper"
                    ? "border-brand-500 bg-brand-50 shadow-ram-sm"
                    : "border-gray-300 bg-card hover:border-gray-400"
                )}
              >
                <div className="flex items-center gap-ram-lg mb-ram-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-ram-md bg-brand-100">
                    <FileText className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-text-md font-extrabold text-foreground">Match Paper</h3>
                    <p className="text-text-sm text-gray-500">Keeps the familiar paper layout</p>
                  </div>
                  {layoutChoice === "paper" && (
                    <Check className="ml-auto h-5 w-5 text-brand-500" />
                  )}
                </div>
                {/* Mini preview */}
                <div className="rounded-ram-sm border border-gray-200 bg-gray-50 p-ram-lg">
                  <div className="space-y-ram-sm">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-ram-md">
                        <div className="h-3 w-16 rounded bg-gray-300" />
                        <div className="h-3 flex-1 rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </button>

              {/* Digital Optimized */}
              <button
                onClick={() => setLayoutChoice("digital")}
                className={cn(
                  "flex flex-col rounded-ram-md border-2 p-ram-xl text-left transition-all",
                  layoutChoice === "digital"
                    ? "border-brand-500 bg-brand-50 shadow-ram-sm"
                    : "border-gray-300 bg-card hover:border-gray-400"
                )}
              >
                <div className="flex items-center gap-ram-lg mb-ram-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-ram-md bg-brand-100">
                    <Smartphone className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-text-md font-extrabold text-foreground">Digital Optimized</h3>
                    <p className="text-text-sm text-gray-500">Streamlined mobile-friendly form</p>
                  </div>
                  {layoutChoice === "digital" && (
                    <Check className="ml-auto h-5 w-5 text-brand-500" />
                  )}
                </div>
                {/* Mini preview */}
                <div className="rounded-ram-sm border border-gray-200 bg-gray-50 p-ram-lg">
                  <div className="space-y-ram-md">
                    {[...Array(3)].map((_, i) => (
                      <div key={i}>
                        <div className="h-2 w-12 rounded bg-gray-300 mb-ram-xxs" />
                        <div className="h-6 w-full rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background px-ram-xl py-ram-xl shrink-0">
          <div className="mx-auto max-w-[600px]">
            <Button
              onClick={() => setPhase("save")}
              disabled={!layoutChoice}
              className="w-full h-11 rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600"
            >
              Continue
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Save / Name logbook
  if (phase === "save") {
    return (
      <AppLayout>
        <HeaderNav type="back" title="Name Your Logbook" onBack={() => setPhase("layout")} />
        <ScanStepper steps={SCAN_STEPS} currentStep={4} />

        <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
          <div className="mx-auto max-w-[600px] space-y-ram-xl">
            <div>
              <label className="text-text-sm font-medium text-foreground mb-ram-sm block">
                Logbook Name
              </label>
              <input
                type="text"
                value={logbookName}
                onChange={(e) => setLogbookName(e.target.value)}
                placeholder="e.g., Clean Room Environmental Log"
                className="w-full rounded-ram-md border border-gray-300 px-ram-lg py-ram-lg text-text-md focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="text-text-sm font-medium text-foreground mb-ram-sm block">
                Location
              </label>
              <input
                type="text"
                value={logbookLocation}
                onChange={(e) => setLogbookLocation(e.target.value)}
                placeholder="e.g., Building 3, Floor 2"
                className="w-full rounded-ram-md border border-gray-300 px-ram-lg py-ram-lg text-text-md focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
            <div className="rounded-ram-md border border-gray-200 bg-gray-50 p-ram-xl">
              <h4 className="text-text-sm font-extrabold text-foreground mb-ram-md">Summary</h4>
              <div className="space-y-ram-sm text-text-sm text-gray-600">
                <p>{fields.filter((f) => f.approved).length} fields extracted</p>
                <p>Layout: {layoutChoice === "paper" ? "Match Paper" : "Digital Optimized"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background px-ram-xl py-ram-xl shrink-0">
          <div className="mx-auto max-w-[600px]">
            <Button
              onClick={() => {
                setPhase("done");
                setTimeout(() => navigate("/"), 2000);
              }}
              disabled={!logbookName.trim()}
              className="w-full h-11 rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600"
            >
              Create Logbook
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Done
  return (
    <AppLayout>
      <div className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100 mb-ram-xl">
            <Check className="h-8 w-8 text-success-400" />
          </div>
          <h2 className="text-display-xs font-extrabold text-foreground mb-ram-md">
            Logbook Created!
          </h2>
          <p className="text-text-md text-gray-500">
            "{logbookName}" is ready for your team.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
