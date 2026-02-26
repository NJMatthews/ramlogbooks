import { cn } from "@/lib/utils";
import { useRef, useState, useCallback } from "react";

interface PinInputProps {
  onComplete: (pin: string) => void;
  className?: string;
}

export function PinInput({ onComplete, className }: PinInputProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleChange = useCallback((index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 3) {
      refs[index + 1].current?.focus();
    }
    if (newDigits.every((d) => d !== "")) {
      onComplete(newDigits.join(""));
    }
  }, [digits, onComplete]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }, [digits]);

  return (
    <div className={cn("flex gap-ram-lg justify-center", className)}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-[47px] w-[47px] rounded-ram-md border border-gray-300 bg-background text-center text-text-xl font-extrabold text-foreground outline-none focus:border-brand-500 transition-colors"
        />
      ))}
    </div>
  );
}
