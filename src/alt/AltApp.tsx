import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ALT_DESIGN_BASE } from "@/components/DesignSwitch";
import AltAppShell from "./AltAppShell";
import AltNotFound from "./AltNotFound";
import Index from "@/pages/Index";
import SearchPage from "@/pages/Search";
import MapPage from "@/pages/Map";
import TenderDetail from "@/pages/TenderDetail";
import WatchlistPage from "@/pages/Watchlist";
import AnalyticsPage from "@/pages/Analytics";
import AIInsightsPage from "@/pages/AIInsights";
import SettingsPage from "@/pages/Settings";

/**
 * Alternativ design på /alternativ/* – samma sidor, data och funktioner som
 * originalet. basename gör att alla interna länkar stannar under /alternativ.
 */
const AltApp = () => (
  <BrowserRouter basename={ALT_DESIGN_BASE}>
    <AltAppShell>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/tender/:id" element={<TenderDetail />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<AltNotFound />} />
      </Routes>
    </AltAppShell>
  </BrowserRouter>
);

export default AltApp;
