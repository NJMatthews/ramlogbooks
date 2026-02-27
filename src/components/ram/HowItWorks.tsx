import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScanLine, FileSearch, LayoutGrid, Check, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HowItWorksProps {
  onComplete: () => void;
}

const tourSteps = [
  {
    icon: ScanLine,
    title: "Point & Capture",
    description: "Hold your phone over the paper logbook page. The camera will automatically detect the page edges and capture it.",
    spotlight: "camera",
  },
  {
    icon: Sparkles,
    title: "AI Field Extraction",
    description: "Our AI reads the column headers, row labels, and data types from your paper log — not the data itself.",
    spotlight: "extraction",
  },
  {
    icon: FileSearch,
    title: "Review Proposed Fields",
    description: "Check each extracted field. Approve, edit, or remove fields. Confidence scores show how certain the AI is about each detection.",
    spotlight: "review",
  },
  {
    icon: LayoutGrid,
    title: "Choose Your Layout",
    description: "Pick 'Match Paper' to keep the familiar paper layout, or 'Digital Optimized' for a streamlined mobile-friendly form.",
    spotlight: "layout",
  },
  {
    icon: Check,
    title: "Name & Save",
    description: "Give your new digital logbook a name, assign it to a location, and it's ready for your team to use.",
    spotlight: "save",
  },
];

export function HowItWorks({ onComplete }: HowItWorksProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = tourSteps[currentStep];
  const isLast = currentStep === tourSteps.length - 1;
  const isFirst = currentStep === 0;
  const Icon = step.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-ram-xl animate-fade-in">
      {/* Progress dots */}
      <div className="flex gap-ram-sm mb-ram-4xl">
        {tourSteps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === currentStep ? "w-6 bg-brand-500" : "w-2 bg-gray-300"
            )}
          />
        ))}
      </div>

      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-100 mb-ram-xl">
        <Icon className="h-10 w-10 text-brand-500" />
      </div>

      {/* Content */}
      <div className="text-center max-w-sm">
        <h2 className="text-display-xs font-extrabold text-foreground mb-ram-md">{step.title}</h2>
        <p className="text-text-md text-gray-600 leading-relaxed">{step.description}</p>
      </div>

      {/* Step indicator */}
      <p className="text-text-xs text-gray-400 mt-ram-xl mb-ram-3xl">
        Step {currentStep + 1} of {tourSteps.length}
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-ram-lg w-full max-w-sm">
        {!isFirst && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => s - 1)}
            className="flex items-center gap-ram-sm rounded-ram-md border-gray-300 text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div className="flex-1" />
        {isLast ? (
          <Button
            onClick={onComplete}
            className="flex items-center gap-ram-sm rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600"
          >
            Start Scanning
            <ScanLine className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            className="flex items-center gap-ram-sm rounded-ram-md bg-brand-500 text-white font-extrabold hover:bg-brand-600"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Skip */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="mt-ram-xl text-text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip tour
        </button>
      )}
    </div>
  );
}
