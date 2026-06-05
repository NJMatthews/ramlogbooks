import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  badge: string;
  role: "operator" | "supervisor" | "qa" | "logbookOnly";
  method: "pin+nfc" | "pin+barcode";
  signedInAt: number;
}

interface CurrentUserContextValue {
  currentUser: CurrentUser | null;
  signIn: (user: Omit<CurrentUser, "signedInAt">) => void;
  signOut: (reason?: "manual" | "idle") => void;
  bumpActivity: () => void;
  lastIdleReason: "manual" | "idle" | null;
}

const IDLE_TIMEOUT_MS = 60 * 1000; // 60s for demo — easy to see in prototype

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [lastIdleReason, setLastIdleReason] = useState<"manual" | "idle" | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);

  const signIn = useCallback((user: Omit<CurrentUser, "signedInAt">) => {
    setCurrentUser({ ...user, signedInAt: Date.now() });
    setLastIdleReason(null);
    lastActivityRef.current = Date.now();
  }, []);

  const signOut = useCallback((reason: "manual" | "idle" = "manual") => {
    setCurrentUser(null);
    setLastIdleReason(reason);
  }, []);

  const bumpActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Global activity tracking + idle timer
  useEffect(() => {
    if (!currentUser) return;

    const onActivity = () => {
      lastActivityRef.current = Date.now();
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    intervalRef.current = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS) {
        setCurrentUser(null);
        setLastIdleReason("idle");
      }
    }, 5000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [currentUser]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, signIn, signOut, bumpActivity, lastIdleReason }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

const noopUser: CurrentUserContextValue = {
  currentUser: null,
  signIn: () => {},
  signOut: () => {},
  bumpActivity: () => {},
  lastIdleReason: null,
};

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  return ctx ?? noopUser;
}

export const IDLE_TIMEOUT_SECONDS = IDLE_TIMEOUT_MS / 1000;
