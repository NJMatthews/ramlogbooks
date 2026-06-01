import { RAMDrawer } from "./RAMDrawer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Wrench, ArrowRight } from "lucide-react";

interface SuccessDrawerProps {
  open: boolean;
  onDone: () => void;
  signatureMeaning?: string;
  workRequestId?: string | null;
  assetName?: string | null;
}

export function SuccessDrawer({ open, onDone, signatureMeaning, workRequestId, assetName }: SuccessDrawerProps) {
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
      <div className="flex flex-col items-center gap-ram-xl py-ram-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <CheckCircle2 className="h-8 w-8 text-success-400" />
        </div>
        <h2 className="text-text-xl font-extrabold text-foreground">Entry Submitted</h2>
        <p className="text-text-md text-gray-600 text-center">
          Signed as <b className="text-foreground">{signatureMeaning ?? "Performed"}</b> at {new Date().toLocaleTimeString()}
        </p>

        {workRequestId && (
          <div className="w-full rounded-ram-md border border-warning-400/40 bg-warning-100 p-ram-lg animate-fade-in">
            <div className="flex items-start gap-ram-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning-400/20">
                <Wrench className="h-4 w-4 text-warning-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-sm font-extrabold text-foreground">Work request auto-drafted</p>
                <p className="text-text-xs text-gray-600 mt-0.5">
                  {workRequestId} · linked to {assetName ?? "asset"}
                </p>
                <button className="mt-2 inline-flex items-center gap-1 text-text-xs font-extrabold text-brand-500 hover:text-brand-600">
                  Open in RAM <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RAMDrawer>
  );
}
