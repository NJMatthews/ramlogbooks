import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PinInput } from "@/components/ram/PinInput";
import { useCurrentUser, IDLE_TIMEOUT_SECONDS } from "@/hooks/useCurrentUser";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { cn } from "@/lib/utils";
import { Nfc, ScanLine, Wifi, QrCode, Check, MapPin, Clock } from "lucide-react";

type AuthMethod = "nfc" | "barcode" | null;
type Phase = "pin" | "scanning" | "verified";

// Mock operator directory — in a real system this would resolve from the badge/PIN
const MOCK_OPERATORS = [
  { id: "u-4521", name: "John Smith", badge: "#4521", role: "operator" as const },
  { id: "u-7812", name: "J. Martinez", badge: "#7812", role: "operator" as const },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, lastIdleReason } = useCurrentUser();
  const { currentLocation } = useDeviceLocation();

  const [pinComplete, setPinComplete] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [phase, setPhase] = useState<Phase>("pin");
  const [clock, setClock] = useState(new Date());

  const from = (location.state as { from?: string } | null)?.from ?? "/execute";

  useEffect(() => {
    const t = window.setInterval(() => setClock(new Date()), 30 * 1000);
    return () => window.clearInterval(t);
  }, []);

  const handleBadge = (method: AuthMethod) => {
    setAuthMethod(method);
    setPhase("scanning");
    window.setTimeout(() => setPhase("verified"), 1800);
  };

  // Auto-complete sign-in shortly after the verified state shows
  useEffect(() => {
    if (phase !== "verified") return;
    const operator = MOCK_OPERATORS[0];
    const t = window.setTimeout(() => {
      signIn({
        id: operator.id,
        name: operator.name,
        badge: operator.badge,
        role: operator.role,
        method: authMethod === "nfc" ? "pin+nfc" : "pin+barcode",
      });
      navigate(from, { replace: true });
    }, 900);
    return () => window.clearTimeout(t);
  }, [phase, authMethod, signIn, navigate, from]);

  return (
    <div className="min-h-screen w-full bg-[hsl(220,30%,16%)] flex items-center justify-center px-ram-xl">
      {/* Top bar — device + location context */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-ram-xl py-ram-md text-white/70 text-text-xs font-extrabold">
        <div className="flex items-center gap-ram-md">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-white">{currentLocation.name}</span>
          <span className="text-white/40">·</span>
          <span>Pinned tablet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="w-full max-w-[480px] rounded-ram-xl bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-brand-500 text-white px-ram-xl py-ram-lg">
          <p className="text-text-xs font-extrabold tracking-widest uppercase opacity-80">RAM Logbooks</p>
          <h1 className="text-text-xl font-extrabold mt-1">
            {phase === "verified" ? "Welcome" : "Sign in to continue"}
          </h1>
          {lastIdleReason === "idle" && phase === "pin" && (
            <p className="text-text-xs font-medium mt-1 opacity-90">
              Session locked after {IDLE_TIMEOUT_SECONDS}s of inactivity
            </p>
          )}
        </div>

        <div className="px-ram-xl py-ram-2xl">
          {phase === "pin" && (
            <div className="flex flex-col items-center gap-ram-xl animate-fade-in">
              <p className="text-text-sm text-gray-600 text-center">
                Enter your PIN, then tap or scan your badge.
              </p>

              {!pinComplete && (
                <div className="w-full flex flex-col items-center gap-ram-lg">
                  <p className="text-text-xs font-extrabold tracking-wider uppercase text-gray-500">4-digit PIN</p>
                  <PinInput onComplete={() => setPinComplete(true)} />
                </div>
              )}

              {pinComplete && (
                <div className="w-full flex flex-col items-center gap-ram-md animate-fade-in">
                  <div className="flex items-center gap-2 text-success-400 text-text-xs font-extrabold">
                    <Check className="h-3.5 w-3.5" /> PIN accepted
                  </div>
                </div>
              )}

              {/* Badge terminal */}
              <div
                className={cn(
                  "w-full rounded-ram-xl border overflow-hidden transition-opacity duration-300",
                  pinComplete ? "opacity-100" : "opacity-40 pointer-events-none"
                )}
              >
                <div className="bg-[hsl(220,30%,20%)] text-white text-center py-2.5 text-text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Scan or Tap Your Badge
                </div>
                <div className="bg-[hsl(210,20%,97%)] flex divide-x divide-gray-200">
                  <button
                    onClick={() => handleBadge("barcode")}
                    className="flex-1 flex flex-col items-center gap-ram-lg py-ram-2xl px-ram-xl hover:bg-[hsl(210,20%,94%)] transition-colors"
                  >
                    <div className="relative h-20 w-20">
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

                  <div className="flex items-center">
                    <span className="absolute z-10 bg-[hsl(210,20%,97%)] px-1 text-text-xs text-gray-400 font-medium -ml-3">OR</span>
                  </div>

                  <button
                    onClick={() => handleBadge("nfc")}
                    className="flex-1 flex flex-col items-center gap-ram-lg py-ram-2xl px-ram-xl hover:bg-[hsl(210,20%,94%)] transition-colors"
                  >
                    <div className="relative h-20 w-20 flex items-center justify-center">
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
                <div className="bg-[hsl(210,20%,97%)] border-t border-gray-200 flex items-center justify-center gap-ram-xl py-2 text-text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Camera ready
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> NFC ready
                  </span>
                </div>
              </div>

              <p className="text-text-xs text-gray-400 text-center italic">
                Session is bound to this device and location. No full RAM login required.
              </p>
            </div>
          )}

          {phase === "scanning" && authMethod === "barcode" && (
            <div className="flex flex-col items-center gap-ram-xl py-ram-2xl animate-fade-in">
              <div className="relative h-48 w-48 rounded-ram-xl bg-[hsl(220,20%,12%)] overflow-hidden flex items-center justify-center">
                <div className="absolute top-3 left-3 h-8 w-8 border-t-[3px] border-l-[3px] border-brand-400 rounded-tl-md" />
                <div className="absolute top-3 right-3 h-8 w-8 border-t-[3px] border-r-[3px] border-brand-400 rounded-tr-md" />
                <div className="absolute bottom-3 left-3 h-8 w-8 border-b-[3px] border-l-[3px] border-brand-400 rounded-bl-md" />
                <div className="absolute bottom-3 right-3 h-8 w-8 border-b-[3px] border-r-[3px] border-brand-400 rounded-br-md" />
                <QrCode className="h-16 w-16 text-white/30" />
                <div
                  className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent"
                  style={{ animation: "scan-sweep 1.8s ease-in-out infinite" }}
                />
                <div className="absolute top-3.5 right-12 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-400 tracking-wider">REC</span>
                </div>
              </div>
              <p className="text-text-lg font-extrabold text-foreground">Scanning badge…</p>
              <style>{`
                @keyframes scan-sweep {
                  0%, 100% { top: 12px; }
                  50% { top: calc(100% - 12px); }
                }
              `}</style>
            </div>
          )}

          {phase === "scanning" && authMethod === "nfc" && (
            <div className="flex flex-col items-center gap-ram-xl py-ram-2xl animate-fade-in">
              <div className="relative h-56 w-32">
                <div className="absolute inset-0 rounded-[20px] border-[3px] border-gray-300 bg-[hsl(210,20%,97%)]">
                  <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-gray-300" />
                  <div className="mx-2 mt-3 h-[calc(100%-40px)] rounded-xl bg-[hsl(220,20%,12%)] flex items-center justify-center overflow-hidden">
                    <Wifi className="h-8 w-8 text-brand-400 animate-pulse" />
                  </div>
                  <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-gray-300" />
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-16 w-16 rounded-full border-2 border-brand-300 animate-ping opacity-30" />
                    <span
                      className="absolute h-12 w-12 rounded-full border border-brand-300 opacity-40"
                      style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite 0.3s" }}
                    />
                    <span className="h-8 w-8 rounded-full bg-brand-500/20 border-2 border-brand-400 flex items-center justify-center">
                      <Nfc className="h-4 w-4 text-brand-500" />
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-text-lg font-extrabold text-foreground">Ready to tap…</p>
              <p className="text-text-sm text-gray-500">Hold your badge near the top of the device</p>
            </div>
          )}

          {phase === "verified" && (
            <div className="flex flex-col items-center gap-ram-lg py-ram-2xl animate-fade-in">
              <div className="h-20 w-20 rounded-full bg-success-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-success-400" />
              </div>
              <h3 className="text-text-lg font-extrabold text-foreground">Identity Verified</h3>
              <div className="rounded-ram-md border border-gray-200 bg-gray-50 p-ram-lg w-full max-w-[280px] space-y-1 text-center">
                <p className="text-text-sm font-extrabold text-foreground">{MOCK_OPERATORS[0].name}</p>
                <p className="text-text-xs text-gray-500">
                  Badge {MOCK_OPERATORS[0].badge} · {authMethod === "nfc" ? "NFC" : "Barcode"} verified
                </p>
              </div>
              <p className="text-text-xs text-gray-400">Opening your shift…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
