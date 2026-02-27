import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { ScanStepper } from "@/components/ram/ScanStepper";
import { HowItWorks } from "@/components/ram/HowItWorks";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Upload,
  ChevronRight,
  Flashlight,
  X,
  Check,
  Pencil,
  Trash2,
  GripVertical,
  Plus,
  HelpCircle,
  Columns2,
  RectangleHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { ConfidenceChip } from "@/components/ram/ConfidenceChip";
import { cn } from "@/lib/utils";
import { mockScanResults, type ScanField, type FieldType } from "@/data/mockLogbooks";

const SCAN_STEPS = ["Capture", "Process", "Review", "Layout", "Publish"];
const FIELD_TYPES: FieldType[] = ["Text", "Number", "Date", "Time", "Text Area", "Toggle"];

type FlowPhase = "tour" | "capture-landing" | "camera" | "processing" | "review" | "review-edit" | "layout" | "layout-edit" | "publish";

const PROCESS_STEPS = [
  "Detecting page boundaries...",
  "Reading field labels...",
  "Extracting field values...",
  "Matching layout structure...",
  "Generating digital form...",
];

export default function ScanCamera() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<FlowPhase>("capture-landing");
  const [fields, setFields] = useState<ScanField[]>(mockScanResults);
  const [layoutChoice, setLayoutChoice] = useState<"paper" | "digital">("paper");
  const [processStep, setProcessStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [layoutSpacing, setLayoutSpacing] = useState<"compact" | "normal" | "relaxed">("normal");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const dragCounter = useRef(0);

  // Processing animation
  useEffect(() => {
    if (phase !== "processing") return;
    setProcessStep(0);
    const interval = setInterval(() => {
      setProcessStep((s) => {
        if (s >= PROCESS_STEPS.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [phase]);

  const currentStep =
    phase === "capture-landing" || phase === "camera" ? 0
    : phase === "processing" ? 1
    : phase === "review" || phase === "review-edit" ? 2
    : phase === "layout" ? 3
    : phase === "publish" ? 4
    : 0;

  const handleCapture = () => {
    setPhase("processing");
  };

  const updateFieldName = (id: string, name: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const updateFieldType = (id: string, fieldType: FieldType) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, fieldType } : f)));
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const addField = () => {
    const newId = `s${Date.now()}`;
    setFields((prev) => [
      ...prev,
      { id: newId, name: "", value: "", confidence: 100, approved: false, fieldType: "Text", colSpan: 1, rowHeight: "short" },
    ]);
  };

  const highCount = fields.filter((f) => f.confidence >= 90).length;
  const medCount = fields.filter((f) => f.confidence >= 70 && f.confidence < 90).length;
  const lowCount = fields.filter((f) => f.confidence < 70).length;

  // Tour overlay
  if (showTour) {
    return (
      <AppLayout>
        <HeaderNav type="back" title="Scan & Convert" onBack={() => setShowTour(false)} />
        <HowItWorks onComplete={() => setShowTour(false)} />
      </AppLayout>
    );
  }

  // Step 1: Capture landing
  if (phase === "capture-landing") {
    return (
      <AppLayout>
        <div className="flex items-center justify-between px-ram-xl py-ram-lg border-b border-border bg-card">
          <div className="flex items-center gap-ram-lg">
            <button onClick={() => navigate("/")} className="text-foreground">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 className="text-xl font-extrabold text-foreground">Scan & Convert</h1>
          </div>
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-500 text-brand-500 text-sm font-medium hover:bg-brand-100 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            How it works
          </button>
        </div>

        <ScanStepper steps={SCAN_STEPS} currentStep={0} className="border-b border-border bg-card" />

        <div className="flex-1 overflow-y-auto">
          {/* Document illustration */}
          <div className="flex items-center justify-center py-12 bg-card mx-ram-xl mt-ram-xl rounded-t-ram-xl">
            <div className="relative w-32 h-28">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-500 rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-500 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-500 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-500 rounded-br" />
              {/* Paper lines */}
              <div className="absolute inset-4 flex flex-col justify-center gap-2">
                <div className="h-px bg-brand-400/30 w-3/4" />
                <div className="h-px bg-brand-400/30 w-full" />
                <div className="h-px bg-brand-400/30 w-2/3" />
              </div>
            </div>
          </div>

          {/* Title and description */}
          <div className="text-center px-ram-xl py-ram-xl">
            <h2 className="text-2xl font-extrabold text-foreground mb-ram-md">Digitize a Paper Logbook</h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Photograph your paper logbook and we'll extract the fields, match the layout, and let you choose how to go digital.
            </p>
          </div>

          {/* Action cards */}
          <div className="px-ram-xl pb-ram-xl space-y-ram-lg max-w-lg mx-auto">
            <button
              onClick={() => setPhase("camera")}
              className="w-full flex items-center gap-ram-xl p-ram-xl rounded-ram-xl border border-border bg-card text-left hover:shadow-[var(--shadow-sm)] transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-ram-md bg-brand-100 shrink-0">
                <Camera className="h-6 w-6 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-foreground">Scan with Camera</h3>
                <p className="text-sm text-gray-500 mt-0.5">Use your device camera to photograph logbook pages. Works best with good lighting and a flat surface.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
            </button>

            <button
              onClick={() => setPhase("camera")}
              className="w-full flex items-center gap-ram-xl p-ram-xl rounded-ram-xl border border-border bg-card text-left hover:shadow-[var(--shadow-sm)] transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-ram-md bg-brand-100 shrink-0">
                <Upload className="h-6 w-6 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-foreground">Upload Image</h3>
                <p className="text-sm text-gray-500 mt-0.5">Upload a photo or scan you've already taken. Supports JPEG and PNG.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Camera capture phase (dark full-screen)
  if (phase === "camera") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "hsl(220, 30%, 15%)" }}>
        <ScanStepper steps={SCAN_STEPS} currentStep={0} className="pt-3 [&_span]:text-white/60 [&_span.text-brand-500]:text-brand-500" />

        <div className="flex items-center justify-between px-ram-xl py-ram-sm">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Flashlight className="h-5 w-5 text-white" />
          </button>
          <button onClick={() => setPhase("capture-landing")} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-[70%] max-w-[380px] aspect-[3/4]">
            {/* Corner brackets */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-brand-500 rounded-tl" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-brand-500 rounded-tr" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-brand-500 rounded-bl" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-brand-500 rounded-br" />
            {/* Simulated paper */}
            <div className="absolute inset-3 border border-dashed border-white/20 rounded-sm">
              <div className="h-full w-full p-4 flex flex-col justify-start gap-2.5 pt-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-px bg-white/10 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pb-10">
          <p className="text-sm text-white/70">Align logbook page within the frame</p>
          <button
            onClick={handleCapture}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand-500 transition-transform hover:scale-105 active:scale-95"
          />
        </div>
      </div>
    );
  }

  // Step 2: Processing
  if (phase === "processing") {
    return (
      <AppLayout>
        <ScanStepper steps={SCAN_STEPS} currentStep={1} className="border-b border-border bg-card" />

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-ram-xl py-ram-xl">
          {/* Skeleton document */}
          <div className="w-[280px] rounded-ram-md border border-border bg-card p-6 mb-8">
            <div className="space-y-2.5">
              <div className="flex gap-20">
                <div className="h-3 w-20 rounded bg-gray-300" />
                <div className="h-3 w-14 rounded bg-gray-300" />
              </div>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div className={cn("h-2 rounded", i % 3 === 0 ? "w-16 bg-gray-300" : "bg-gray-200", i % 2 === 0 ? "w-full" : "w-3/4")} />
                </div>
              ))}
            </div>
          </div>

          {/* Processing checklist */}
          <div className="space-y-3 w-full max-w-sm">
            {PROCESS_STEPS.map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full shrink-0 transition-all",
                  i <= processStep ? "bg-success-400 text-white" : "bg-gray-200"
                )}>
                  {i <= processStep && <Check className="h-3 w-3" />}
                </div>
                <span className={cn(
                  "text-sm transition-colors",
                  i <= processStep ? "text-success-400 font-medium" : "text-gray-400"
                )}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* View Results button */}
          {processStep >= PROCESS_STEPS.length - 1 && (
            <Button
              onClick={() => setPhase("review")}
              className="mt-8 h-12 px-10 rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600 text-base animate-fade-in"
            >
              View Results
            </Button>
          )}
        </div>
      </AppLayout>
    );
  }

  // Step 3: Review / Edit Fields
  if (phase === "review" || phase === "review-edit") {
    const isEditing = phase === "review-edit";
    return (
      <AppLayout>
        <HeaderNav type="back" title="Scan Results" onBack={() => setPhase("processing")} />
        <ScanStepper steps={SCAN_STEPS} currentStep={2} className="border-b border-border bg-card" />

        <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
          <div className="mx-auto max-w-[600px]">
            {/* Scanned image preview */}
            {!isEditing && (
              <div className="rounded-ram-md border border-border bg-card p-4 mb-4">
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className={cn("h-2 rounded", i % 3 === 0 ? "w-20 bg-gray-300" : "bg-gray-200", i % 2 === 0 ? "w-full" : "w-3/5")} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isEditing && (
              <p className="text-xs text-gray-500 mb-ram-xl">Scanned Feb 26, 2026 at 3:42 PM</p>
            )}

            {/* Field summary */}
            <h3 className="text-xs font-extrabold text-foreground tracking-widest uppercase mb-1">Extracted Fields</h3>
            <p className="text-sm text-foreground mb-ram-xl">
              {fields.length} fields detected — <span className="text-success-400">{highCount} high</span>, <span className="text-warning-400">{medCount} medium</span>, <span className="text-error-600">{lowCount} low</span> confidence
            </p>

            {/* Field cards */}
            <div className="space-y-ram-lg">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={cn(
                    "rounded-ram-xl border bg-card p-ram-xl transition-all",
                    isEditing && field.confidence < 70 ? "border-error-400" : "border-border"
                  )}
                >
                  {isEditing ? (
                    /* Edit mode */
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <label className="text-sm text-foreground mb-1.5 block">Field Label</label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateFieldName(field.id, e.target.value)}
                            placeholder='e.g. Temperature (°C)'
                            className="w-full rounded-ram-md border border-foreground px-3 py-2.5 text-base focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none bg-card"
                          />
                        </div>
                        <button onClick={() => removeField(field.id)} className="mt-6 text-error-600 hover:text-error-900 p-1">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-3">
                        <label className="text-sm text-foreground mb-1.5 block">Field Type</label>
                        <div className="flex flex-wrap gap-2">
                          {FIELD_TYPES.map((t) => (
                            <button
                              key={t}
                              onClick={() => updateFieldType(field.id, t)}
                              className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                                field.fieldType === t
                                  ? "bg-brand-500 text-white border-brand-500"
                                  : "bg-card text-foreground border-gray-300 hover:border-gray-400"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      {field.value && (
                        <p className="text-sm text-gray-500 mt-3 italic">
                          Sample from scan: "{field.value}"
                        </p>
                      )}
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-extrabold text-foreground">{field.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded font-medium",
                            field.fieldType === "Date" ? "bg-brand-100 text-brand-500"
                            : field.fieldType === "Time" ? "bg-brand-100 text-brand-500"
                            : field.fieldType === "Number" ? "bg-brand-100 text-brand-500"
                            : field.fieldType === "Text Area" ? "bg-brand-100 text-brand-500"
                            : "bg-brand-100 text-brand-500"
                          )}>
                            {field.fieldType}
                          </span>
                          <span className="text-xs text-gray-500">e.g. "{field.value}"</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ConfidenceChip confidence={field.confidence} />
                        <button className="text-gray-500 hover:text-foreground p-1">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add field (edit mode only) */}
              {isEditing && (
                <button
                  onClick={addField}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-ram-xl border-2 border-dashed border-gray-300 text-brand-500 font-medium hover:border-brand-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="sticky bottom-0 border-t border-border bg-card px-ram-xl py-ram-xl shrink-0">
          <div className="mx-auto max-w-[600px] flex gap-ram-lg">
            <Button
              variant="outline"
              onClick={() => setPhase(isEditing ? "review" : "review-edit")}
              className="flex-1 h-12 rounded-ram-md border-foreground text-foreground font-extrabold"
            >
              {isEditing ? "Done Editing" : "Edit Fields"}
            </Button>
            <Button
              onClick={() => setPhase("layout")}
              className="flex-1 h-12 rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600"
            >
              Choose Layout
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Step 4: Layout selection
  if (phase === "layout") {
    return (
      <AppLayout>
        <HeaderNav type="back" title="Choose Layout" onBack={() => setPhase("review")} />
        <ScanStepper steps={SCAN_STEPS} currentStep={3} className="border-b border-border bg-card" />

        <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
          <div className="mx-auto max-w-[600px] space-y-ram-xl">
            {/* Match Paper Layout */}
            <button
              onClick={() => setLayoutChoice("paper")}
              className={cn(
                "w-full rounded-ram-xl border-2 p-ram-xl text-left transition-all",
                layoutChoice === "paper" ? "border-brand-500 bg-brand-100" : "border-border bg-card"
              )}
            >
              {/* Wireframe preview - paper style */}
              <div className="rounded-ram-md border border-border bg-card p-4 mb-4">
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-12 rounded bg-gray-300" />
                      <div className="h-6 w-full rounded border border-gray-200" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-12 rounded bg-gray-300" />
                      <div className="h-6 w-full rounded border border-gray-200" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-16 rounded bg-gray-300" />
                    <div className="h-6 w-full rounded border border-gray-200" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-1">Match Paper Layout</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fields arranged to match your original paper logbook. Operators will recognize the familiar layout. Best for teams transitioning from paper.
              </p>
              <span className="inline-block mt-2 text-xs font-medium text-success-400 bg-success-100 px-2.5 py-1 rounded">
                Recommended for adoption
              </span>
            </button>

            {/* Optimize for Digital */}
            <button
              onClick={() => setLayoutChoice("digital")}
              className={cn(
                "w-full rounded-ram-xl border-2 p-ram-xl text-left transition-all",
                layoutChoice === "digital" ? "border-brand-500 bg-brand-100" : "border-border bg-card"
              )}
            >
              {/* Wireframe preview - digital style */}
              <div className="rounded-ram-md border border-border bg-card p-4 mb-4">
                <div className="space-y-2.5">
                  <div className="h-2.5 w-16 rounded bg-brand-400/40" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-10 rounded bg-gray-300" />
                    <div className="h-6 w-full rounded border border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-10 rounded bg-gray-300" />
                    <div className="h-6 w-full rounded border border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-10 rounded bg-gray-300" />
                    <div className="h-6 w-full rounded border border-gray-200" />
                  </div>
                  <div className="h-2.5 w-20 rounded bg-brand-400/40 mt-1" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-10 rounded bg-gray-300" />
                    <div className="h-6 w-full rounded border border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-10 rounded bg-gray-300" />
                    <div className="h-6 w-full rounded border border-gray-200" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-1">Optimize for Digital</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fields reorganized for tablet and mobile usability. Larger inputs, logical grouping, better for speed. Layout differs from paper original.
              </p>
              <span className="inline-block mt-2 text-xs font-medium text-success-400 bg-success-100 px-2.5 py-1 rounded">
                Faster data entry
              </span>
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-ram-xl py-ram-xl shrink-0">
          <div className="mx-auto max-w-[600px] space-y-3">
            <Button
              onClick={() => setPhase("publish")}
              className="w-full h-12 rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600 text-base"
            >
              Preview & Confirm
            </Button>
            <button
              onClick={() => setPhase("review")}
              className="w-full text-center text-sm text-brand-500 font-medium hover:underline"
            >
              Back to Fields
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Step 5: Publish (Preview form)
  if (phase === "publish") {
    const isPaper = layoutChoice === "paper";
    return (
      <AppLayout>
        <HeaderNav type="back" title="Preview: Clean Room Environmental Log" onBack={() => setPhase("layout")} />
        <ScanStepper steps={SCAN_STEPS} currentStep={4} className="border-b border-border bg-card" />

        <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
          <div className="mx-auto max-w-[600px]">
            <div className="rounded-ram-xl border-2 border-dashed border-border bg-card p-ram-xl">
              {isPaper ? (
                /* Paper-matched layout */
                <>
                  <p className="text-xs text-gray-400 mb-4">Paper-matched layout</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <label className="text-sm font-extrabold text-foreground block mb-1">Date</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">MM/DD/YYYY</div>
                    </div>
                    <div>
                      <label className="text-sm font-extrabold text-foreground block mb-1">Time</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">HH:MM</div>
                    </div>
                    <div>
                      <label className="text-sm font-extrabold text-foreground block mb-1">Operator</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">Operator name</div>
                    </div>
                    <div>
                      <label className="text-sm font-extrabold text-foreground block mb-1">Room Number</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">Room #</div>
                    </div>
                    <div>
                      <label className="text-sm font-extrabold text-foreground block mb-1">Temperature (°C)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">°C</div>
                    </div>
                    <div>
                      <label className="text-sm font-extrabold text-foreground block mb-1">Humidity (%RH)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">%RH</div>
                    </div>
                    <div>
                      <label className="text-sm font-extrabold text-foreground block mb-1">Diff. Pressure (Pa)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">Pa</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-extrabold text-foreground block mb-1">Observations</label>
                    <div className="h-24 rounded border border-gray-300 px-3 py-2 text-sm text-gray-400">Enter observations...</div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-gray-300">
                    <span className="text-sm font-medium text-foreground">Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-6 rounded-full bg-brand-500 relative">
                        <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white" />
                      </div>
                      <span className="text-sm text-brand-500 font-medium">Pass</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Digital optimized layout */
                <>
                  <h4 className="text-sm font-extrabold text-foreground mb-1">Entry Info</h4>
                  <div className="h-px bg-gray-200 mb-4" />
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-foreground block mb-1">Date/Time</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">Auto-filled</div>
                    </div>
                    <div>
                      <label className="text-sm text-foreground block mb-1">Operator</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">From badge auth</div>
                    </div>
                    <div>
                      <label className="text-sm text-foreground block mb-1">Room</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">From logbook scope</div>
                    </div>
                  </div>

                  <h4 className="text-sm font-extrabold text-foreground mt-6 mb-1">Environmental Readings</h4>
                  <div className="h-px bg-gray-200 mb-4" />
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-foreground block mb-1">Temperature (°C)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">°C</div>
                    </div>
                    <div>
                      <label className="text-sm text-foreground block mb-1">Humidity (%RH)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">%RH</div>
                    </div>
                    <div>
                      <label className="text-sm text-foreground block mb-1">Differential Pressure (Pa)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">Pa</div>
                    </div>
                  </div>

                  <h4 className="text-sm font-extrabold text-foreground mt-6 mb-1">Particle Counts</h4>
                  <div className="h-px bg-gray-200 mb-4" />
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-foreground block mb-1">Particle Count (0.5µm)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">Count</div>
                    </div>
                    <div>
                      <label className="text-sm text-foreground block mb-1">Particle Count (5.0µm)</label>
                      <div className="h-10 rounded border border-gray-300 px-3 flex items-center text-sm text-gray-400">Count</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-ram-xl py-ram-xl shrink-0">
          <div className="mx-auto max-w-[600px] flex gap-ram-lg">
            <Button
              variant="outline"
              onClick={() => setPhase("layout")}
              className="flex-1 h-12 rounded-ram-md border-foreground text-foreground font-extrabold"
            >
              Edit Layout
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="flex-1 h-12 rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600 text-base"
            >
              Publish Logbook
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}
