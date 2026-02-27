import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LogbookContext, useLogbookState } from "@/hooks/useLogbookState";
import { DeviceLocationProvider } from "@/hooks/useDeviceLocation";
import LogbookList from "./pages/LogbookList";
import LogbookEntryForm from "./pages/LogbookEntryForm";
import LogbookHistory from "./pages/LogbookHistory";
import ScanCamera from "./pages/ScanCamera";
import FormReview from "./pages/FormReview";
import OfflineQueue from "./pages/OfflineQueue";
import LocationSettings from "./pages/LocationSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppInner() {
  const { state, dispatch } = useLogbookState();

  return (
    <BrowserRouter>
      <DeviceLocationProvider>
        <LogbookContext.Provider value={{ state, dispatch }}>
          <Routes>
            <Route path="/" element={<LogbookList />} />
            <Route path="/entry/:id" element={<LogbookEntryForm />} />
            <Route path="/history/:id" element={<LogbookHistory />} />
            <Route path="/scan" element={<ScanCamera />} />
            <Route path="/review" element={<FormReview />} />
            <Route path="/queue" element={<OfflineQueue />} />
            <Route path="/settings/location" element={<LocationSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LogbookContext.Provider>
      </DeviceLocationProvider>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppInner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
