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
      <div className="min-h-screen w-full flex items-center justify-center bg-[hsl(220,13%,15%)] p-4 md:p-8">
        <div className="relative w-full max-w-[874px] h-[1194px] max-h-[95vh] rounded-[36px] border-[12px] border-[hsl(220,13%,22%)] bg-background shadow-2xl overflow-hidden flex flex-col">
          {/* iPad camera notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(220,13%,28%)] z-50" />
          <div className="flex-1 overflow-hidden">
            <AppInner />
          </div>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
