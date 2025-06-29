
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "@/pages/Index";
import HQDashboard from "@/pages/HQDashboard";
import EagleAI from "@/pages/EagleAI";
import EagleAIPage from "@/pages/EagleAIPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/hq-dashboard" element={<HQDashboard />} />
              <Route path="/eagle-ai" element={<EagleAI />} />
              <Route path="/eagle-ai-assistant" element={<EagleAIPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
