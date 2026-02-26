import { cn } from "@/lib/utils";
import React, { useState } from "react";

type InputState = "default" | "focused" | "filled" | "disabled" | "error" | "success";

interface RAMInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  state?: InputState;
  leadingIcon?: React.ReactNode;
  trailingButton?: React.ReactNode;
  leadingText?: string;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  errorMessage?: string;
  className?: string;
  needsConfirmation?: boolean;
  confirmed?: boolean;
  onConfirm?: () => void;
}

export function RAMInput({
  label,
  value,
  onChange,
  state: externalState,
  leadingIcon,
  trailingButton,
  leadingText,
  placeholder,
  type = "text",
  readOnly,
  errorMessage,
  className,
  needsConfirmation,
  confirmed,
  onConfirm,
}: RAMInputProps) {
  const [focused, setFocused] = useState(false);

  const computedState: InputState = externalState
    ? externalState
    : readOnly
    ? "disabled"
    : focused
    ? "focused"
    : value
    ? "filled"
    : "default";

  const borderColor = {
    default: "border-gray-300",
    focused: "border-brand-500",
    filled: "border-gray-800",
    disabled: "border-gray-300",
    error: "border-error-600",
    success: "border-success-400",
  }[computedState];

  const labelColor = {
    default: "text-gray-800",
    focused: "text-gray-800",
    filled: "text-gray-800",
    disabled: "text-gray-500",
    error: "text-error-600",
    success: "text-success-400",
  }[computedState];

  const textColor = {
    default: "text-gray-500",
    focused: "text-foreground",
    filled: "text-foreground",
    disabled: "text-gray-500",
    error: "text-foreground",
    success: "text-foreground",
  }[computedState];

  const bgColor = computedState === "disabled" ? "bg-gray-100" : "bg-background";

  return (
    <div className={cn("flex flex-col gap-ram-sm", className)}>
      <label className={cn("text-text-sm font-medium", labelColor)}>{label}</label>
      <div
        className={cn(
          "relative flex items-center rounded-ram-xs border transition-colors",
          borderColor,
          bgColor,
          needsConfirmation && !confirmed && "border-l-4 border-l-warning-400"
        )}
      >
        {leadingIcon && (
          <span className="pl-ram-lg text-gray-600">{leadingIcon}</span>
        )}
        {leadingText && (
          <span className="pl-ram-lg text-text-md text-gray-600 border-r border-gray-300 pr-ram-lg">
            {leadingText}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={computedState === "disabled"}
          className={cn(
            "flex-1 h-10 bg-transparent px-ram-lg text-text-md outline-none placeholder:text-gray-500",
            textColor
          )}
        />
        {needsConfirmation && !confirmed && (
          <button
            onClick={onConfirm}
            className="mr-ram-md px-ram-lg py-ram-sm rounded-ram-xs bg-warning-100 text-text-xs font-medium text-warning-400 hover:bg-warning-400 hover:text-primary-foreground transition-colors"
          >
            Confirm
          </button>
        )}
        {trailingButton && (
          <span className="pr-ram-lg">{trailingButton}</span>
        )}
      </div>
      {errorMessage && computedState === "error" && (
        <span className="text-text-xs text-error-600">{errorMessage}</span>
      )}
    </div>
  );
}
