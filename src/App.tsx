
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import HQDashboard from "./pages/HQDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import CrimeStats from "./pages/CrimeStats";
import CriminalProfile from "./pages/CriminalProfile";
import SearchTool from "./pages/SearchTool";
import CaseStatus from "./pages/CaseStatus";
import CriminalNetworks from "./pages/CriminalNetworks";
import UpdateCase from "./pages/UpdateCase";
import UserDashboard from "./pages/UserDashboard";
import RegisterCase from "./pages/RegisterCase";
import GenerateFIR from "./pages/GenerateFIR";
import StationStats from "./pages/StationStats";
import Profile from "./pages/Profile";
import EagleAI from "./pages/EagleAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  if (user) {
    const dashboardPath = user.userType === 'headquarters' ? '/hq-dashboard' : '/police-dashboard';
    
    return (
      <Routes>
        <Route path="/" element={<Navigate to={dashboardPath} replace />} />
        <Route path="/hq-dashboard" element={
          <ProtectedRoute>
            {user.userType === 'headquarters' ? <HQDashboard /> : <Navigate to="/police-dashboard" replace />}
          </ProtectedRoute>
        } />
        <Route path="/police-dashboard" element={
          <ProtectedRoute>
            {user.userType === 'police_station' ? <PoliceDashboard /> : <Navigate to="/hq-dashboard" replace />}
          </ProtectedRoute>
        } />
        <Route path="/crime-stats" element={<ProtectedRoute><CrimeStats /></ProtectedRoute>} />
        <Route path="/criminal-profile" element={<ProtectedRoute><CriminalProfile /></ProtectedRoute>} />
        <Route path="/search-tool" element={<ProtectedRoute><SearchTool /></ProtectedRoute>} />
        <Route path="/case-status" element={<ProtectedRoute><CaseStatus /></ProtectedRoute>} />
        <Route path="/criminal-networks" element={<ProtectedRoute><CriminalNetworks /></ProtectedRoute>} />
        <Route path="/update-case" element={<ProtectedRoute><UpdateCase /></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/register-case" element={<ProtectedRoute><RegisterCase /></ProtectedRoute>} />
        <Route path="/generate-fir" element={<ProtectedRoute><GenerateFIR /></ProtectedRoute>} />
        <Route path="/station-stats" element={<ProtectedRoute><StationStats /></ProtectedRoute>} />
        <Route path="/eagle-ai" element={<ProtectedRoute><EagleAI /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
