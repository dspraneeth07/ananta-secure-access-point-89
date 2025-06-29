
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "@/pages/Index";
import HQDashboard from "@/pages/HQDashboard";
import EagleAI from "@/pages/EagleAI";
import EagleAIPage from "@/pages/EagleAIPage";
import PoliceDashboard from "@/pages/PoliceDashboard";
import CrimeStats from "@/pages/CrimeStats";
import CriminalProfile from "@/pages/CriminalProfile";
import SearchTool from "@/pages/SearchTool";
import CaseStatus from "@/pages/CaseStatus";
import CriminalNetworks from "@/pages/CriminalNetworks";
import UpdateCase from "@/pages/UpdateCase";
import Profile from "@/pages/Profile";
import RegisterCase from "@/pages/RegisterCase";
import GenerateFIR from "@/pages/GenerateFIR";
import StationStats from "@/pages/StationStats";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <SonnerToaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/hq-dashboard" element={<HQDashboard />} />
                <Route path="/police-dashboard" element={<PoliceDashboard />} />
                <Route path="/crime-stats" element={<CrimeStats />} />
                <Route path="/criminal-profile" element={<CriminalProfile />} />
                <Route path="/search-tool" element={<SearchTool />} />
                <Route path="/case-status" element={<CaseStatus />} />
                <Route path="/criminal-networks" element={<CriminalNetworks />} />
                <Route path="/update-case" element={<UpdateCase />} />
                <Route path="/register-case" element={<RegisterCase />} />
                <Route path="/generate-fir" element={<GenerateFIR />} />
                <Route path="/station-stats" element={<StationStats />} />
                <Route path="/eagle-ai" element={<EagleAI />} />
                <Route path="/eagle-ai-assistant" element={<EagleAIPage />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
