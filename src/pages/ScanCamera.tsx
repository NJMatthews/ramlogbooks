import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { Flashlight, SwitchCamera, Focus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScanCamera() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCapture = () => {
    setScanning(true);
    setLoading(true);
    setTimeout(() => {
      navigate("/review");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground">
      {/* Header overlay */}
      <div className="relative z-10">
        <HeaderNav type="back" title="Scan Logbook Page" onBack={() => navigate("/")} />
      </div>

      {/* Camera mock area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Scanner overlay */}
        <div
          className={cn(
            "h-[280px] w-[280px] rounded-ram-xl border-4 transition-all",
            scanning ? "border-brand-500" : "border-primary-foreground/50 animate-pulse-border"
          )}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
            <div className="flex flex-col items-center gap-ram-xl">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-foreground border-t-brand-500" />
              <p className="text-text-md text-primary-foreground font-medium">Processing...</p>
            </div>
          </div>
        )}

        {/* Top-right controls */}
        <div className="absolute top-ram-xl right-ram-xl flex flex-col gap-ram-lg">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <Flashlight className="h-5 w-5 text-primary-foreground" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <SwitchCamera className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Capture button */}
      {!loading && (
        <div className="flex justify-center pb-ram-7xl">
          <button
            onClick={handleCapture}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary-foreground bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/40"
          >
            <Focus className="h-8 w-8 text-primary-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
