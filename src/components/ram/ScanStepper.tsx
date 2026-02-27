import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ScanStepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ScanStepper({ steps, currentStep, className }: ScanStepperProps) {
  return (
    <div className={cn("flex items-center gap-ram-sm w-full px-ram-xl py-ram-lg", className)}>
      {steps.map((step, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-ram-xxs">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-text-xs font-extrabold transition-colors shrink-0",
                  completed
                    ? "bg-brand-500 text-white"
                    : active
                    ? "bg-brand-200 text-brand-500 ring-2 ring-brand-500"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-text-xs text-center whitespace-nowrap",
                  active ? "text-brand-500 font-medium" : "text-gray-500"
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-ram-sm mt-[-16px]",
                  completed ? "bg-brand-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
