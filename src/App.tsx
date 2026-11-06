import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "@/components/AppShell";
import Index from "./pages/Index";
import SearchPage from "./pages/Search";
import MapPage from "./pages/Map";
import TenderDetail from "./pages/TenderDetail";
import WatchlistPage from "./pages/Watchlist";
import AnalyticsPage from "./pages/Analytics";
import AIInsightsPage from "./pages/AIInsights";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ALT_DESIGN_BASE } from "@/components/DesignSwitch";

// Alternativ design (Kommunradar.online-varumärket) laddas separat, bara på /alternativ
const AltApp = lazy(() => import("./alt/AltApp"));
const isAltDesign =
  window.location.pathname === ALT_DESIGN_BASE ||
  window.location.pathname.startsWith(`${ALT_DESIGN_BASE}/`);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {isAltDesign ? (
        <Suspense fallback={null}>
          <AltApp />
        </Suspense>
      ) : (
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/tender/:id" element={<TenderDetail />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ai-insights" element={<AIInsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
