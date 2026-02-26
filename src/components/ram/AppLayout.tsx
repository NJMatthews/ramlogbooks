import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";
import { StatusBar } from "./StatusBar";
import { useLogbook } from "@/hooks/useLogbookState";

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { state } = useLogbook();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {!isMobile && !hideNav && <SidebarNav />}
      <div className="flex flex-1 flex-col min-h-screen">
        {state.isOffline && <StatusBar />}
        <main className="flex-1 overflow-y-auto">{children}</main>
        {isMobile && !hideNav && <BottomNav />}
      </div>
    </div>
  );
}
