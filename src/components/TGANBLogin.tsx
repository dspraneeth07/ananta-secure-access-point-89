
import React, { useState } from 'react';
import { Shield, Building, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from './ThemeToggle';

const TGANBLogin = () => {
  const [activePanel, setActivePanel] = useState<'police' | 'headquarters'>('police');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    police: { officerId: '', password: '' },
    headquarters: { hqId: '', passcode: '' }
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (panel: 'police' | 'headquarters', field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [panel]: { ...prev[panel], [field]: value }
    }));
  };

  const handleLogin = async (panel: 'police' | 'headquarters') => {
    setLoading(true);
    try {
      const username = panel === 'police' ? credentials.police.officerId : credentials.headquarters.hqId;
      const password = panel === 'police' ? credentials.police.password : credentials.headquarters.passcode;

      if (!username || !password) {
        toast({
          title: "Missing Credentials",
          description: "Please enter both username and password",
          variant: "destructive"
        });
        return;
      }

      const result = await login(username, password);
      
      if (!result.success) {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background flex flex-col relative overflow-hidden">
      <ThemeToggle />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[length:60px_60px] animate-pulse"></div>
      </div>

      {/* Header Section - Reduced spacing */}
      <header className="relative z-10 pt-4 pb-3">
        <div className="container mx-auto px-4 text-center">
          {/* Official Logo - Reduced margin */}
          <div className="mb-3 animate-fade-in">
            <img 
              src="/lovable-uploads/68edd6e3-5f88-4e5e-a0be-b0e347c0ea8b.png" 
              alt="TGANB Official Logo" 
              className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-2 animate-pulse rounded-full"
            />
          </div>
          
          {/* Official Title - Reduced spacing */}
          <h1 className="text-xl md:text-3xl font-bold font-roboto-condensed uppercase tracking-wider text-primary mb-1 animate-fade-in">
            Telangana Anti Narcotics Bureau
          </h1>
          <p className="text-muted-foreground text-base font-medium uppercase tracking-wide">
            Secure Access Portal
          </p>
          
          {/* Security Badge - Reduced margin */}
          <div className="flex items-center justify-center mt-2 text-sm text-primary">
            <Shield className="w-4 h-4 mr-2" />
            <span className="font-medium">CLASSIFIED ACCESS ONLY</span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Reduced padding */}
      <main className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-4xl">
          {/* Panel Selector - Reduced margin */}
          <div className="flex justify-center mb-4">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-1 inline-flex border border-border">
              <button
                onClick={() => setActivePanel('police')}
                className={`px-4 md:px-6 py-3 rounded-md font-semibold transition-all duration-300 text-sm md:text-base ${
                  activePanel === 'police'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Police Station Access
              </button>
              <button
                onClick={() => setActivePanel('headquarters')}
                className={`px-4 md:px-6 py-3 rounded-md font-semibold transition-all duration-300 text-sm md:text-base ${
                  activePanel === 'headquarters'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Headquarters Access
              </button>
            </div>
          </div>

          {/* Login Panels Container */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {activePanel === 'police' ? (
                <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-border">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-3">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">Police Station Login</h2>
                    <p className="text-muted-foreground text-sm">Field Operations Access</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleLogin('police'); }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Officer ID
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter Officer ID"
                        value={credentials.police.officerId}
                        onChange={(e) => handleInputChange('police', 'officerId', e.target.value)}
                        className="h-10 bg-background/50 border-border"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Secure Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Password"
                          value={credentials.police.password}
                          onChange={(e) => handleInputChange('police', 'password', e.target.value)}
                          className="h-10 pr-10 bg-background/50 border-border"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-10 text-base font-semibold"
                      disabled={loading}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {loading ? 'Logging in...' : 'Secure Login'}
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-border">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-3">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">Headquarters Access</h2>
                    <p className="text-muted-foreground text-sm">Command Center Portal</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleLogin('headquarters'); }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        HQ Access ID
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter HQ ID"
                        value={credentials.headquarters.hqId}
                        onChange={(e) => handleInputChange('headquarters', 'hqId', e.target.value)}
                        className="h-10 bg-background/50 border-border"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Encrypted Passcode
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Encrypted Passcode"
                          value={credentials.headquarters.passcode}
                          onChange={(e) => handleInputChange('headquarters', 'passcode', e.target.value)}
                          className="h-10 pr-10 bg-background/50 border-border"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-10 text-base font-semibold"
                      disabled={loading}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {loading ? 'Accessing...' : 'Access Command Center'}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer - Reduced padding */}
      <footer className="relative z-10 py-3 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center text-destructive text-xs font-medium">
              <Shield className="w-3 h-3 mr-1" />
              <span className="uppercase tracking-wide">Confidential System</span>
            </div>
            <p className="text-muted-foreground text-xs max-w-2xl mx-auto">
              Access restricted to authorized personnel only. All activities are monitored and logged. 
              Unauthorized access attempts will be reported to law enforcement authorities.
            </p>
            <div className="text-primary text-xs font-medium">
              © 2024 Telangana State Police • Anti Narcotics Bureau • Government of Telangana
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TGANBLogin;
