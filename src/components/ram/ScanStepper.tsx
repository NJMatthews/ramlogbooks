import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ScanStepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ScanStepper({ steps, currentStep, className }: ScanStepperProps) {
  return (
    <div className={cn("flex items-center justify-center w-full px-ram-xl py-ram-lg", className)}>
      {steps.map((step, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-text-xs font-extrabold transition-colors shrink-0",
                  completed
                    ? "bg-success-400 text-white"
                    : active
                    ? "bg-brand-500 text-white"
                    : "bg-gray-300 text-gray-600"
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px] text-center whitespace-nowrap",
                  completed ? "text-success-400 font-medium"
                  : active ? "text-brand-500 font-extrabold"
                  : "text-gray-500"
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-1 mt-[-16px]",
                  completed ? "bg-success-400" : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
