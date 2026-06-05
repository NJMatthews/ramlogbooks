import { WifiOff, Wifi, CloudUpload, Check, UserCircle2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogbook } from "@/hooks/useLogbookState";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function StatusBar() {
  const { state, dispatch } = useLogbook();
  const { currentUser, signOut } = useCurrentUser();
  const queued = state.syncQueue.filter((e) => e.status !== "success").length;
  const lastSync = "2:34 PM";

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-ram-md px-ram-xl py-ram-sm text-text-xs font-extrabold",
        state.isOffline ? "bg-warning-400 text-foreground" : "bg-card text-gray-600 border-b border-border"
      )}
    >
      <div className="flex items-center gap-ram-md">
        {state.isOffline ? (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline · entries are stored on device</span>
          </>
        ) : (
          <>
            <Wifi className="h-3.5 w-3.5 text-success-400" />
            <span className="text-foreground">Online</span>
            <span className="text-gray-500 font-medium">· last sync {lastSync}</span>
          </>
        )}
        {queued > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5">
            <CloudUpload className="h-3 w-3" />
            {queued} queued
          </span>
        )}
        {queued === 0 && !state.isOffline && (
          <span className="inline-flex items-center gap-1 text-success-900">
            <Check className="h-3 w-3" /> All synced
          </span>
        )}
      </div>

      <div className="flex items-center gap-ram-md">
        {currentUser && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2 py-0.5 text-brand-600">
            <UserCircle2 className="h-3.5 w-3.5" />
            <span className="font-extrabold">{currentUser.name}</span>
            <span className="text-brand-500/70 font-medium">· Badge {currentUser.badge}</span>
            <button
              onClick={() => signOut("manual")}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-extrabold text-brand-600 hover:bg-brand-500/20 transition-colors"
              title="Switch user / lock device"
            >
              <LogOut className="h-2.5 w-2.5" />
              Switch
            </button>
          </span>
        )}

        <button
          onClick={() => dispatch({ type: "TOGGLE_OFFLINE" })}
          className={cn(
            "rounded-full px-ram-md py-0.5 text-[10px] font-extrabold transition-colors",
            state.isOffline
              ? "bg-foreground text-warning-400 hover:bg-foreground/90"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          title="Demo: toggle offline mode"
        >
          {state.isOffline ? "Go online" : "Simulate offline"}
        </button>
      </div>
    </div>
  );
}
