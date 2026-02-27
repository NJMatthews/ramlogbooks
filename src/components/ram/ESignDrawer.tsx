import { useState } from "react";
import { RAMDrawer } from "./RAMDrawer";
import { PinInput } from "./PinInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Nfc, QrCode, ScanLine, Check, Loader2, Wifi } from "lucide-react";

interface ESignDrawerProps {
  open: boolean;
  onClose: () => void;
  onSign: () => void;
}

type AuthMethod = "nfc" | "barcode" | null;
type AuthPhase = "badge" | "scanning" | "verified";

export function ESignDrawer({ open, onClose, onSign }: ESignDrawerProps) {
  const [pinComplete, setPinComplete] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [phase, setPhase] = useState<AuthPhase>("badge");

  const handleBadgeScan = (method: AuthMethod) => {
    setAuthMethod(method);
    setPhase("scanning");
    setTimeout(() => {
      setPhase("verified");
    }, 2000);
  };

  const handleSign = () => {
    onSign();
    setPinComplete(false);
    setAuthMethod(null);
    setPhase("badge");
  };

  const handleClose = () => {
    setPinComplete(false);
    setAuthMethod(null);
    setPhase("badge");
    onClose();
  };

  return (
    <RAMDrawer
      open={open}
      onClose={handleClose}
      title={
        phase === "badge"
          ? "Badge Verification"
          : phase === "scanning"
          ? "Scanning..."
          : "Verified"
      }
      footer={
        phase === "verified" ? (
          <Button
            onClick={handleSign}
            className="w-full h-11 rounded-ram-md bg-brand-500 text-white font-extrabold text-text-lg hover:bg-brand-600"
          >
            Submit Entry
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full h-11 rounded-ram-md border-gray-300 text-gray-600 font-extrabold text-text-lg"
          >
            Cancel
          </Button>
        )
      }
    >
      {/* Badge phase: PIN + scan/tap in one view */}
      {phase === "badge" && (
        <div className="flex flex-col items-center gap-ram-xl py-ram-md animate-fade-in">
          <p className="text-text-md text-gray-600 text-center">
            Verify your identity to sign this entry
          </p>

          {/* PIN Section */}
          {!pinComplete && (
            <div className="w-full flex flex-col items-center gap-ram-lg animate-fade-in">
              <p className="text-text-sm font-medium text-foreground">Enter your 4-digit PIN</p>
              <PinInput onComplete={() => setPinComplete(true)} />
            </div>
          )}

          {/* Badge terminal — always visible, enabled after PIN */}
          <div className={cn(
            "w-full rounded-ram-xl border overflow-hidden transition-opacity duration-300",
            pinComplete ? "opacity-100" : "opacity-40 pointer-events-none"
          )}>
            {/* Header bar */}
            <div className="bg-[hsl(220,30%,20%)] text-white text-center py-2.5 text-text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Scan or Tap Your Badge
            </div>

            {/* Two-column scan area */}
            <div className="bg-[hsl(210,20%,97%)] flex divide-x divide-gray-200">
              {/* Scan Badge */}
              <button
                onClick={() => handleBadgeScan("barcode")}
                className="flex-1 flex flex-col items-center gap-ram-lg py-ram-2xl px-ram-xl hover:bg-[hsl(210,20%,94%)] transition-colors"
              >
                <div className="relative h-20 w-20">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-brand-500 rounded-tl-sm" />
                  <div className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-brand-500 rounded-tr-sm" />
                  <div className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-brand-500 rounded-bl-sm" />
                  <div className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brand-500 rounded-br-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="h-10 w-10 text-brand-500" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-text-sm font-extrabold text-foreground">Scan Badge</p>
                  <p className="text-text-xs text-gray-500">Hold barcode or QR to camera</p>
                </div>
              </button>

              {/* OR divider */}
              <div className="flex items-center">
                <span className="absolute z-10 bg-[hsl(210,20%,97%)] px-1 text-text-xs text-gray-400 font-medium -ml-3">OR</span>
              </div>

              {/* Tap Badge */}
              <button
                onClick={() => handleBadgeScan("nfc")}
                className="flex-1 flex flex-col items-center gap-ram-lg py-ram-2xl px-ram-xl hover:bg-[hsl(210,20%,94%)] transition-colors"
              >
                <div className="relative h-20 w-20 flex items-center justify-center">
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-brand-200 animate-ping opacity-20" />
                  <div className="absolute inset-2 rounded-full border border-brand-200 opacity-40" />
                  <div className="h-14 w-14 rounded-full bg-brand-500 flex items-center justify-center shadow-lg">
                    <Wifi className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-text-sm font-extrabold text-foreground">Tap Badge</p>
                  <p className="text-text-xs text-gray-500">Hold badge near device</p>
                </div>
              </button>
            </div>

            {/* Status bar */}
            <div className="bg-[hsl(210,20%,97%)] border-t border-gray-200 flex items-center justify-center gap-ram-xl py-2 text-text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Camera ready
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                NFC ready
              </span>
            </div>
          </div>

          <p className="text-text-xs text-gray-400 text-center italic">
            "I confirm this entry is accurate and complete"
          </p>
        </div>
      )}

      {/* Scanning animation */}
      {phase === "scanning" && (
        <div className="flex flex-col items-center gap-ram-xl py-ram-3xl animate-fade-in">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-brand-200 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
            </div>
          </div>
          <p className="text-text-lg font-extrabold text-foreground">
            {authMethod === "nfc" ? "Reading NFC badge..." : "Scanning barcode..."}
          </p>
          <p className="text-text-sm text-gray-500">Hold steady</p>
        </div>
      )}

      {/* Verified */}
      {phase === "verified" && (
        <div className="flex flex-col items-center gap-ram-xl py-ram-3xl animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-success-100 flex items-center justify-center">
            <Check className="h-10 w-10 text-success-400" />
          </div>
          <h3 className="text-text-lg font-extrabold text-foreground">Identity Verified</h3>
          <div className="rounded-ram-md border border-gray-200 bg-gray-50 p-ram-xl w-full max-w-[280px]">
            <p className="text-text-sm text-gray-500">Operator</p>
            <p className="text-text-md font-extrabold text-foreground">John Smith</p>
            <p className="text-text-xs text-gray-400 mt-ram-xxs">Badge #4521 • {authMethod === "nfc" ? "NFC" : "Barcode"} verified</p>
          </div>
          <p className="text-text-xs text-gray-400 text-center">
            Signed at {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </RAMDrawer>
  );
}
