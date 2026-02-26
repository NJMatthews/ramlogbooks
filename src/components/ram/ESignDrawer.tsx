import { RAMDrawer } from "./RAMDrawer";
import { PinInput } from "./PinInput";
import { Button } from "@/components/ui/button";

interface ESignDrawerProps {
  open: boolean;
  onClose: () => void;
  onSign: () => void;
}

export function ESignDrawer({ open, onClose, onSign }: ESignDrawerProps) {
  return (
    <RAMDrawer
      open={open}
      onClose={onClose}
      title="Sign Entry"
      footer={
        <div className="flex gap-ram-lg">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-ram-md border-brand-500 text-brand-500 font-extrabold text-text-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={onSign}
            className="flex-1 h-11 rounded-ram-md bg-brand-400 text-primary-foreground font-extrabold text-text-lg hover:bg-brand-500"
          >
            Sign
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-ram-3xl py-ram-xl">
        <p className="text-text-md text-gray-600 text-center">
          Enter your 4-digit PIN to sign
        </p>
        <PinInput onComplete={() => {}} />
        <p className="text-text-sm text-gray-600 text-center italic">
          "I confirm this entry is accurate and complete"
        </p>
      </div>
    </RAMDrawer>
  );
}
