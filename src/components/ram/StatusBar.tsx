import { WifiOff } from "lucide-react";

export function StatusBar() {
  return (
    <div className="flex w-full items-center justify-center gap-ram-md bg-brand-500 px-ram-xl py-ram-md">
      <WifiOff className="h-4 w-4 text-primary-foreground" />
      <span className="text-text-sm font-medium text-primary-foreground">
        Offline Mode — entries will sync when reconnected
      </span>
    </div>
  );
}
