import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LogbookContext, useLogbookState } from "@/hooks/useLogbookState";
import LogbookList from "./pages/LogbookList";
import LogbookEntryForm from "./pages/LogbookEntryForm";
import LogbookHistory from "./pages/LogbookHistory";
import ScanCamera from "./pages/ScanCamera";
import FormReview from "./pages/FormReview";
import OfflineQueue from "./pages/OfflineQueue";
import NotFound from "./pages/NotFound";
import iPadFrame from "@/assets/ipad-frame.png";

const queryClient = new QueryClient();

function AppInner() {
  const { state, dispatch } = useLogbookState();

  return (
    <LogbookContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogbookList />} />
          <Route path="/entry/:id" element={<LogbookEntryForm />} />
          <Route path="/history/:id" element={<LogbookHistory />} />
          <Route path="/scan" element={<ScanCamera />} />
          <Route path="/review" element={<FormReview />} />
          <Route path="/queue" element={<OfflineQueue />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LogbookContext.Provider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-900 p-4 md:p-8">
        <div className="relative w-full max-w-[900px] max-h-[95vh]" style={{ aspectRatio: '3/4' }}>
          {/* iPad frame image */}
          <img
            src={iPadFrame}
            alt=""
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            draggable={false}
          />
          {/* App content inside the frame */}
          <div className="absolute inset-[3.8%] top-[2.8%] bottom-[2.8%] rounded-[12px] overflow-hidden bg-background">
            <AppInner />
          </div>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
