import { RAMDrawer } from "./RAMDrawer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessDrawerProps {
  open: boolean;
  onDone: () => void;
}

export function SuccessDrawer({ open, onDone }: SuccessDrawerProps) {
  return (
    <RAMDrawer
      open={open}
      onClose={onDone}
      title=""
      footer={
        <Button
          onClick={onDone}
          className="w-full h-11 rounded-ram-md bg-brand-400 text-primary-foreground font-extrabold text-text-lg hover:bg-brand-500"
        >
          Done
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-ram-xl py-ram-3xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <CheckCircle2 className="h-8 w-8 text-success-400" />
        </div>
        <h2 className="text-text-xl font-extrabold text-foreground">Entry Submitted</h2>
        <p className="text-text-md text-gray-600 text-center">
          Logbook entry signed and saved at {new Date().toLocaleTimeString()}
        </p>
      </div>
    </RAMDrawer>
  );
}
