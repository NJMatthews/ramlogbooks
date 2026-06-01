import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";
import { StatusBar } from "./StatusBar";

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {!isMobile && !hideNav && <SidebarNav />}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <StatusBar />
        <main className="flex-1 overflow-y-auto flex flex-col">{children}</main>
        {isMobile && !hideNav && <div className="shrink-0"><BottomNav /></div>}
      </div>
    </div>
  );
}

