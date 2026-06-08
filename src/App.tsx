import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LogbookContext, useLogbookState } from "@/hooks/useLogbookState";
import { DeviceLocationProvider } from "@/hooks/useDeviceLocation";
import { CurrentUserProvider } from "@/hooks/useCurrentUser";
import { RequireAuth } from "@/components/ram/RequireAuth";
import { ErrorBoundary } from "@/components/ram/ErrorBoundary";

// Existing screens
import LogbookEntryForm from "./pages/LogbookEntryForm";
import LogbookHistory from "./pages/LogbookHistory";
import ScanCamera from "./pages/ScanCamera";
import FormReview from "./pages/FormReview";
import OfflineQueue from "./pages/OfflineQueue";
import LocationSettings from "./pages/LocationSettings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

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
        <CurrentUserProvider>
          <LogbookContext.Provider value={{ state, dispatch }}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/execute" replace />} />

              {/* Execute workflow */}
              <Route path="/execute" element={<RequireAuth><Execute /></RequireAuth>} />
              <Route path="/execute/assets" element={<RequireAuth><AssetList /></RequireAuth>} />
              <Route path="/execute/asset/:id" element={<RequireAuth><AssetLogbooks /></RequireAuth>} />

              {/* Manage workflow */}
              <Route path="/manage" element={<RequireAuth><ManageTemplates /></RequireAuth>} />
              <Route path="/manage/template/new" element={<RequireAuth><CreateTemplate /></RequireAuth>} />
              <Route path="/manage/template/:id" element={<RequireAuth><TemplateDetail /></RequireAuth>} />

              {/* Review workflow */}
              <Route path="/review" element={<RequireAuth><ReviewDashboard /></RequireAuth>} />

              {/* Existing routes */}
              <Route path="/entry/:id" element={<RequireAuth><LogbookEntryForm /></RequireAuth>} />
              <Route path="/history/:id" element={<RequireAuth><LogbookHistory /></RequireAuth>} />
              <Route path="/scan" element={<RequireAuth><ScanCamera /></RequireAuth>} />
              <Route path="/review-form" element={<RequireAuth><FormReview /></RequireAuth>} />
              <Route path="/queue" element={<RequireAuth><OfflineQueue /></RequireAuth>} />
              <Route path="/settings/location" element={<RequireAuth><LocationSettings /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LogbookContext.Provider>
        </CurrentUserProvider>
      </DeviceLocationProvider>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
