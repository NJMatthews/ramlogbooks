import { useState } from "react";
import { RAMDrawer } from "./RAMDrawer";
import { PinInput } from "./PinInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Nfc, QrCode, ScanLine, Check, Wifi } from "lucide-react";

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

      {/* Scanning animation — Barcode / QR */}
      {phase === "scanning" && authMethod === "barcode" && (
        <div className="flex flex-col items-center gap-ram-xl py-ram-2xl animate-fade-in">
          {/* Camera viewfinder */}
          <div className="relative h-48 w-48 rounded-ram-xl bg-[hsl(220,20%,12%)] overflow-hidden flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 h-8 w-8 border-t-[3px] border-l-[3px] border-brand-400 rounded-tl-md" />
            <div className="absolute top-3 right-3 h-8 w-8 border-t-[3px] border-r-[3px] border-brand-400 rounded-tr-md" />
            <div className="absolute bottom-3 left-3 h-8 w-8 border-b-[3px] border-l-[3px] border-brand-400 rounded-bl-md" />
            <div className="absolute bottom-3 right-3 h-8 w-8 border-b-[3px] border-r-[3px] border-brand-400 rounded-br-md" />

            {/* QR code icon */}
            <QrCode className="h-16 w-16 text-white/30" />

            {/* Sweeping scan line */}
            <div
              className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent"
              style={{
                animation: "scan-sweep 1.8s ease-in-out infinite",
              }}
            />

            {/* Flash effect on "capture" */}
            <div
              className="absolute inset-0 bg-white"
              style={{
                animation: "camera-flash 2s ease-out forwards",
              }}
            />

            {/* REC indicator */}
            <div className="absolute top-3.5 right-12 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-400 tracking-wider">REC</span>
            </div>
          </div>

          <p className="text-text-lg font-extrabold text-foreground">Scanning barcode…</p>
          <p className="text-text-sm text-gray-500">Hold badge steady in front of camera</p>

          {/* CSS for scan animations */}
          <style>{`
            @keyframes scan-sweep {
              0%, 100% { top: 12px; }
              50% { top: calc(100% - 12px); }
            }
            @keyframes camera-flash {
              0% { opacity: 0; }
              85% { opacity: 0; }
              90% { opacity: 0.7; }
              100% { opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Scanning animation — NFC Tap */}
      {phase === "scanning" && authMethod === "nfc" && (
        <div className="flex flex-col items-center gap-ram-xl py-ram-2xl animate-fade-in">
          {/* Phone outline with NFC zone */}
          <div className="relative h-56 w-32">
            {/* Phone body */}
            <div className="absolute inset-0 rounded-[20px] border-[3px] border-gray-300 bg-[hsl(210,20%,97%)]">
              {/* Notch */}
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-gray-300" />
              {/* Screen */}
              <div className="mx-2 mt-3 h-[calc(100%-40px)] rounded-xl bg-[hsl(220,20%,12%)] flex items-center justify-center overflow-hidden">
                <Wifi className="h-8 w-8 text-brand-400 animate-pulse" />
              </div>
              {/* Home bar */}
              <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-gray-300" />
            </div>

            {/* NFC zone highlight — pulsing circle at top-back of phone */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="relative flex items-center justify-center">
                <span className="absolute h-16 w-16 rounded-full border-2 border-brand-300 animate-ping opacity-30" />
                <span className="absolute h-12 w-12 rounded-full border border-brand-300 opacity-40" style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite 0.3s" }} />
                <span className="h-8 w-8 rounded-full bg-brand-500/20 border-2 border-brand-400 flex items-center justify-center">
                  <Nfc className="h-4 w-4 text-brand-500" />
                </span>
              </div>
            </div>

            {/* Tap arrow animation */}
            <div
              className="absolute -right-14 top-2 flex items-center gap-1 text-brand-500"
              style={{ animation: "tap-bounce 1.2s ease-in-out infinite" }}
            >
              <span className="text-text-xs font-extrabold">TAP HERE</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l-7 7 7 7" />
              </svg>
            </div>
          </div>

          <p className="text-text-lg font-extrabold text-foreground">Ready to tap…</p>
          <p className="text-text-sm text-gray-500">Hold your badge near the top of the device</p>

          <style>{`
            @keyframes tap-bounce {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(-6px); }
            }
          `}</style>
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
