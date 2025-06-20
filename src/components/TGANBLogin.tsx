
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col relative overflow-hidden">
      <ThemeToggle />
      
      {/* 3D Drug Protection Background */}
      <div className="absolute inset-0 opacity-10">
        {/* Floating Pills */}
        <div className="absolute top-20 left-10 w-4 h-8 bg-red-500 rounded-full transform rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-5 h-10 bg-green-500 rounded-full transform rotate-12 animate-pulse"></div>
        <div className="absolute bottom-60 right-10 w-8 h-4 bg-blue-400 rounded-full transform -rotate-30 animate-bounce"></div>
        
        {/* Syringe-like shapes */}
        <div className="absolute top-60 left-1/4 w-1 h-12 bg-gray-400 transform rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-16 bg-gray-500 transform -rotate-45 animate-pulse"></div>
        
        {/* Shield Protection Elements */}
        <div className="absolute top-1/3 left-1/3 w-8 h-10 border-2 border-blue-300 rounded-t-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-10 h-12 border-2 border-green-300 rounded-t-full animate-bounce"></div>
        
        {/* Molecular Structure */}
        <div className="absolute top-80 right-40">
          <div className="relative">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full absolute -top-1 -right-2 animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full absolute -bottom-1 -left-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Header Section - Removed extra padding */}
      <header className="relative z-10 pt-2 pb-2">
        <div className="container mx-auto px-4 text-center">
          {/* Official Logo */}
          <div className="mb-2 animate-fade-in">
            <img 
              src="/lovable-uploads/68edd6e3-5f88-4e5e-a0be-b0e347c0ea8b.png" 
              alt="TGANB Official Logo" 
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-1 animate-pulse rounded-full"
            />
          </div>
          
          {/* Official Title */}
          <h1 className="text-lg md:text-2xl font-bold font-roboto-condensed uppercase tracking-wider text-white mb-1 animate-fade-in">
            Telangana Anti Narcotics Bureau
          </h1>
          <p className="text-gray-300 text-sm font-medium uppercase tracking-wide">
            Secure Access Portal
          </p>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center mt-1 text-xs text-blue-300">
            <Shield className="w-3 h-3 mr-1" />
            <span className="font-medium">CLASSIFIED ACCESS ONLY</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-4xl">
          {/* Panel Selector */}
          <div className="flex justify-center mb-3">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-1 inline-flex border border-gray-600">
              <button
                onClick={() => setActivePanel('police')}
                className={`px-3 md:px-4 py-2 rounded-md font-semibold transition-all duration-300 text-xs md:text-sm ${
                  activePanel === 'police'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Police Station Access
              </button>
              <button
                onClick={() => setActivePanel('headquarters')}
                className={`px-3 md:px-4 py-2 rounded-md font-semibold transition-all duration-300 text-xs md:text-sm ${
                  activePanel === 'headquarters'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
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
                <Card className="p-4 md:p-5 bg-black/20 backdrop-blur-sm border-gray-600">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600/30 rounded-full mb-2">
                      <Shield className="w-5 h-5 text-blue-300" />
                    </div>
                    <h2 className="text-base md:text-lg font-bold text-white mb-1">Police Station Login</h2>
                    <p className="text-gray-400 text-xs">Field Operations Access</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleLogin('police'); }} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Officer ID
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter Officer ID"
                        value={credentials.police.officerId}
                        onChange={(e) => handleInputChange('police', 'officerId', e.target.value)}
                        className="h-9 bg-black/30 border-gray-600 text-white placeholder-gray-400"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Secure Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Password"
                          value={credentials.police.password}
                          onChange={(e) => handleInputChange('police', 'password', e.target.value)}
                          className="h-9 pr-10 bg-black/30 border-gray-600 text-white placeholder-gray-400"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-9 text-sm font-semibold bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {loading ? 'Logging in...' : 'Secure Login'}
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card className="p-4 md:p-5 bg-black/20 backdrop-blur-sm border-gray-600">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600/30 rounded-full mb-2">
                      <Building className="w-5 h-5 text-blue-300" />
                    </div>
                    <h2 className="text-base md:text-lg font-bold text-white mb-1">Headquarters Access</h2>
                    <p className="text-gray-400 text-xs">Command Center Portal</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleLogin('headquarters'); }} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        HQ Access ID
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter HQ ID"
                        value={credentials.headquarters.hqId}
                        onChange={(e) => handleInputChange('headquarters', 'hqId', e.target.value)}
                        className="h-9 bg-black/30 border-gray-600 text-white placeholder-gray-400"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Encrypted Passcode
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Encrypted Passcode"
                          value={credentials.headquarters.passcode}
                          onChange={(e) => handleInputChange('headquarters', 'passcode', e.target.value)}
                          className="h-9 pr-10 bg-black/30 border-gray-600 text-white placeholder-gray-400"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-9 text-sm font-semibold bg-blue-600 hover:bg-blue-700"
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

      {/* Footer Disclaimer */}
      <footer className="relative z-10 py-2 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center text-red-400 text-xs font-medium">
              <Shield className="w-3 h-3 mr-1" />
              <span className="uppercase tracking-wide">Confidential System</span>
            </div>
            <p className="text-gray-400 text-xs max-w-2xl mx-auto">
              Access restricted to authorized personnel only. All activities are monitored and logged.
            </p>
            <div className="text-blue-300 text-xs font-medium">
              © 2024 Telangana State Police • Anti Narcotics Bureau • Government of Telangana
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TGANBLogin;
