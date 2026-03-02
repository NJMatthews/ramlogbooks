import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LogbookContext, useLogbookState } from "@/hooks/useLogbookState";
import { DeviceLocationProvider } from "@/hooks/useDeviceLocation";

// Existing screens
import LogbookEntryForm from "./pages/LogbookEntryForm";
import LogbookHistory from "./pages/LogbookHistory";
import ScanCamera from "./pages/ScanCamera";
import FormReview from "./pages/FormReview";
import OfflineQueue from "./pages/OfflineQueue";
import LocationSettings from "./pages/LocationSettings";
import NotFound from "./pages/NotFound";

// New workflow screens
import Execute from "./pages/Execute";
import AssetList from "./pages/AssetList";
import AssetLogbooks from "./pages/AssetLogbooks";
import ManageTemplates from "./pages/ManageTemplates";
import TemplateDetail from "./pages/TemplateDetail";
import CreateTemplate from "./pages/CreateTemplate";
import ReviewDashboard from "./pages/ReviewDashboard";

const queryClient = new QueryClient();

function AppInner() {
  const { state, dispatch } = useLogbookState();

  return (
    <BrowserRouter>
      <DeviceLocationProvider>
        <LogbookContext.Provider value={{ state, dispatch }}>
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/execute" replace />} />

            {/* Execute workflow */}
            <Route path="/execute" element={<Execute />} />
            <Route path="/execute/assets" element={<AssetList />} />
            <Route path="/execute/asset/:id" element={<AssetLogbooks />} />

            {/* Manage workflow */}
            <Route path="/manage" element={<ManageTemplates />} />
            <Route path="/manage/template/new" element={<CreateTemplate />} />
            <Route path="/manage/template/:id" element={<TemplateDetail />} />

            {/* Review workflow */}
            <Route path="/review" element={<ReviewDashboard />} />

            {/* Existing routes (unchanged) */}
            <Route path="/entry/:id" element={<LogbookEntryForm />} />
            <Route path="/history/:id" element={<LogbookHistory />} />
            <Route path="/scan" element={<ScanCamera />} />
            <Route path="/review-form" element={<FormReview />} />
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
