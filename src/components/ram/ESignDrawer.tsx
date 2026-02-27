import { useState } from "react";
import { RAMDrawer } from "./RAMDrawer";
import { PinInput } from "./PinInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Nfc, QrCode, CreditCard, Check, Loader2 } from "lucide-react";

interface ESignDrawerProps {
  open: boolean;
  onClose: () => void;
  onSign: () => void;
}

type AuthMethod = "nfc" | "barcode" | null;
type AuthPhase = "pin" | "badge" | "scanning" | "verified";

export function ESignDrawer({ open, onClose, onSign }: ESignDrawerProps) {
  const [pinComplete, setPinComplete] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [phase, setPhase] = useState<AuthPhase>("pin");

  const handlePinComplete = () => {
    setPinComplete(true);
    setPhase("badge");
  };

  const handleBadgeScan = (method: AuthMethod) => {
    setAuthMethod(method);
    setPhase("scanning");
    // Simulate badge scan
    setTimeout(() => {
      setPhase("verified");
    }, 2000);
  };

  const handleSign = () => {
    onSign();
    // Reset state for next use
    setPinComplete(false);
    setAuthMethod(null);
    setPhase("pin");
  };

  const handleClose = () => {
    setPinComplete(false);
    setAuthMethod(null);
    setPhase("pin");
    onClose();
  };

  return (
    <RAMDrawer
      open={open}
      onClose={handleClose}
      title={
        phase === "pin"
          ? "Sign Entry"
          : phase === "badge"
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
          <div className="flex gap-ram-lg">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11 rounded-ram-md border-gray-300 text-gray-600 font-extrabold text-text-lg"
            >
              Cancel
            </Button>
            {phase === "pin" && (
              <Button
                onClick={handlePinComplete}
                disabled={!pinComplete}
                className="flex-1 h-11 rounded-ram-md bg-brand-500 text-white font-extrabold text-text-lg hover:bg-brand-600 disabled:opacity-50"
              >
                Next
              </Button>
            )}
          </div>
        )
      }
    >
      {/* Step 1: PIN Entry */}
      {phase === "pin" && (
        <div className="flex flex-col items-center gap-ram-3xl py-ram-xl animate-fade-in">
          <div className="flex items-center gap-ram-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white text-text-xs font-extrabold">
              1
            </div>
            <span className="text-text-sm text-gray-500">Step 1 of 2</span>
          </div>
          <p className="text-text-md text-gray-600 text-center">
            Enter your 4-digit PIN
          </p>
          <PinInput onComplete={() => setPinComplete(true)} />
          <p className="text-text-xs text-gray-400 text-center">
            "I confirm this entry is accurate and complete"
          </p>
        </div>
      )}

      {/* Step 2: Badge Method Selection */}
      {phase === "badge" && (
        <div className="flex flex-col items-center gap-ram-xl py-ram-xl animate-fade-in">
          <div className="flex items-center gap-ram-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white text-text-xs font-extrabold">
              2
            </div>
            <span className="text-text-sm text-gray-500">Step 2 of 2</span>
          </div>
          <p className="text-text-md text-gray-600 text-center">
            Verify your identity with your badge
          </p>

          {/* Badge terminal mock */}
          <div className="w-full max-w-[280px] rounded-ram-xl border-2 border-dashed border-gray-300 bg-gray-50 p-ram-3xl flex flex-col items-center gap-ram-xl">
            <CreditCard className="h-12 w-12 text-gray-400" />
            <p className="text-text-sm text-gray-500 text-center">
              Tap or scan your badge below
            </p>
          </div>

          <div className="flex gap-ram-xl w-full max-w-[280px]">
            <button
              onClick={() => handleBadgeScan("nfc")}
              className="flex-1 flex flex-col items-center gap-ram-md rounded-ram-md border-2 border-gray-300 p-ram-xl hover:border-brand-500 hover:bg-brand-50 transition-all"
            >
              <Nfc className="h-8 w-8 text-brand-500" />
              <span className="text-text-sm font-medium text-foreground">NFC Tap</span>
            </button>
            <button
              onClick={() => handleBadgeScan("barcode")}
              className="flex-1 flex flex-col items-center gap-ram-md rounded-ram-md border-2 border-gray-300 p-ram-xl hover:border-brand-500 hover:bg-brand-50 transition-all"
            >
              <QrCode className="h-8 w-8 text-brand-500" />
              <span className="text-text-sm font-medium text-foreground">Scan Code</span>
            </button>
          </div>
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
