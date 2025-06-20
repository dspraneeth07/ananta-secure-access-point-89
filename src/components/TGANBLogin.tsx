
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex flex-col relative overflow-hidden">
      {/* Theme Toggle - Fixed positioning */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Enhanced 3D Drug Protection Background with High Visibility */}
      <div className="absolute inset-0 opacity-80 dark:opacity-90">
        {/* Large Prominent Animated Pills */}
        <div className="absolute top-20 left-10 w-12 h-24 bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-full transform rotate-45 animate-bounce shadow-2xl border-2 border-red-300"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-full animate-pulse shadow-2xl border-2 border-yellow-200"></div>
        <div className="absolute bottom-40 left-20 w-14 h-28 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transform rotate-12 animate-bounce delay-100 shadow-2xl border-2 border-green-300"></div>
        <div className="absolute bottom-60 right-10 w-20 h-12 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 rounded-full transform -rotate-30 animate-pulse delay-200 shadow-2xl border-2 border-blue-200"></div>
        <div className="absolute top-32 left-1/3 w-10 h-20 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full transform rotate-60 animate-bounce delay-300 shadow-2xl border-2 border-purple-300"></div>
        <div className="absolute bottom-32 right-1/4 w-12 h-16 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 rounded-full transform -rotate-20 animate-pulse delay-400 shadow-2xl border-2 border-pink-300"></div>
        
        {/* Enhanced 3D Syringe-like shapes */}
        <div className="absolute top-60 left-1/4 w-4 h-24 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600 transform rotate-45 animate-pulse shadow-2xl border border-gray-200">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-400 rounded-full border border-gray-300"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-20 right-1/3 w-4 h-28 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-700 transform -rotate-45 animate-pulse delay-500 shadow-2xl border border-gray-300">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full border border-gray-400"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-200"></div>
        </div>
        
        {/* Larger Shield Protection Elements */}
        <div className="absolute top-1/3 left-1/3 w-16 h-20 border-4 border-blue-200 rounded-t-full animate-pulse bg-gradient-to-t from-blue-100/40 to-blue-200/40 shadow-2xl">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 w-18 h-22 border-4 border-green-200 rounded-t-full animate-bounce bg-gradient-to-t from-green-100/40 to-green-200/40 shadow-2xl">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full animate-ping delay-300"></div>
        </div>
        
        {/* Enhanced Molecular Structure with Glow Effects */}
        <div className="absolute top-80 right-40">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 rounded-full animate-pulse shadow-2xl border-2 border-purple-200 relative">
              <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="w-6 h-6 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-600 rounded-full absolute -top-4 -right-6 animate-bounce shadow-2xl border-2 border-pink-200 relative">
              <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping opacity-75 delay-100"></div>
            </div>
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-600 rounded-full absolute -bottom-4 -left-6 animate-pulse delay-200 shadow-2xl border-2 border-indigo-200 relative">
              <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-75 delay-200"></div>
            </div>
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-600 rounded-full absolute top-2 right-2 animate-bounce delay-100 shadow-2xl border border-cyan-200 relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75 delay-300"></div>
            </div>
            {/* Enhanced connecting lines with glow */}
            <div className="absolute top-4 right-2 w-12 h-1 bg-gradient-to-r from-white/80 via-purple-300 to-transparent transform rotate-45 shadow-lg"></div>
            <div className="absolute bottom-4 left-2 w-12 h-1 bg-gradient-to-r from-white/80 via-indigo-300 to-transparent transform -rotate-45 shadow-lg"></div>
          </div>
        </div>
        
        {/* Additional Large floating elements */}
        <div className="absolute top-56 right-60 w-16 h-8 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 rounded-full transform rotate-75 animate-bounce delay-600 shadow-2xl border-2 border-emerald-200"></div>
        <div className="absolute bottom-48 left-40 w-10 h-18 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transform -rotate-15 animate-pulse delay-700 shadow-2xl border-2 border-orange-300"></div>
        
        {/* Large Glowing orbs with enhanced visibility */}
        <div className="absolute top-48 left-60 w-12 h-12 bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-500 rounded-full animate-ping shadow-2xl border-2 border-cyan-100"></div>
        <div className="absolute bottom-56 right-52 w-8 h-8 bg-gradient-to-r from-violet-300 via-violet-400 to-violet-600 rounded-full animate-ping delay-1000 shadow-2xl border-2 border-violet-200"></div>
        
        {/* Additional Floating Pills for better coverage */}
        <div className="absolute top-96 left-96 w-10 h-20 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 rounded-full transform rotate-30 animate-bounce delay-800 shadow-2xl border-2 border-teal-300"></div>
        <div className="absolute bottom-80 right-80 w-14 h-10 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 rounded-full transform -rotate-60 animate-pulse delay-900 shadow-2xl border-2 border-rose-300"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 pt-2 pb-1">
        <div className="container mx-auto px-4 text-center">
          {/* Official Logo */}
          <div className="mb-1 animate-fade-in">
            <img 
              src="/lovable-uploads/68edd6e3-5f88-4e5e-a0be-b0e347c0ea8b.png" 
              alt="TGANB Official Logo" 
              className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-1 animate-pulse rounded-full shadow-2xl"
            />
          </div>
          
          {/* Official Title */}
          <h1 className="text-base md:text-xl font-bold font-roboto-condensed uppercase tracking-wider text-white dark:text-gray-100 mb-1 animate-fade-in">
            Telangana Anti Narcotics Bureau
          </h1>
          <p className="text-gray-300 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
            Secure Access Portal
          </p>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center mt-1 text-xs text-blue-300 dark:text-blue-400">
            <Shield className="w-3 h-3 mr-1" />
            <span className="font-medium">CLASSIFIED ACCESS ONLY</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-1">
        <div className="w-full max-w-4xl">
          {/* Panel Selector */}
          <div className="flex justify-center mb-2">
            <div className="bg-black/30 dark:bg-black/50 backdrop-blur-sm rounded-lg p-1 inline-flex border border-gray-600 dark:border-gray-500">
              <button
                onClick={() => setActivePanel('police')}
                className={`px-3 md:px-4 py-2 rounded-md font-semibold transition-all duration-300 text-xs md:text-sm ${
                  activePanel === 'police'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200'
                }`}
              >
                Police Station Access
              </button>
              <button
                onClick={() => setActivePanel('headquarters')}
                className={`px-3 md:px-4 py-2 rounded-md font-semibold transition-all duration-300 text-xs md:text-sm ${
                  activePanel === 'headquarters'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200'
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
                <Card className="p-4 md:p-5 bg-black/20 dark:bg-black/40 backdrop-blur-sm border-gray-600 dark:border-gray-500 shadow-2xl">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600/30 dark:bg-blue-500/40 rounded-full mb-2">
                      <Shield className="w-5 h-5 text-blue-300 dark:text-blue-400" />
                    </div>
                    <h2 className="text-base md:text-lg font-bold text-white dark:text-gray-100 mb-1">Police Station Login</h2>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">Field Operations Access</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleLogin('police'); }} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1">
                        Officer ID
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter Officer ID"
                        value={credentials.police.officerId}
                        onChange={(e) => handleInputChange('police', 'officerId', e.target.value)}
                        className="h-9 bg-black/30 dark:bg-black/50 border-gray-600 dark:border-gray-500 text-white dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1">
                        Secure Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Password"
                          value={credentials.police.password}
                          onChange={(e) => handleInputChange('police', 'password', e.target.value)}
                          className="h-9 pr-10 bg-black/30 dark:bg-black/50 border-gray-600 dark:border-gray-500 text-white dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:hover:text-gray-400 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-9 text-sm font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      disabled={loading}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {loading ? 'Logging in...' : 'Secure Login'}
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card className="p-4 md:p-5 bg-black/20 dark:bg-black/40 backdrop-blur-sm border-gray-600 dark:border-gray-500 shadow-2xl">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600/30 dark:bg-blue-500/40 rounded-full mb-2">
                      <Building className="w-5 h-5 text-blue-300 dark:text-blue-400" />
                    </div>
                    <h2 className="text-base md:text-lg font-bold text-white dark:text-gray-100 mb-1">Headquarters Access</h2>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">Command Center Portal</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleLogin('headquarters'); }} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1">
                        HQ Access ID
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter HQ ID"
                        value={credentials.headquarters.hqId}
                        onChange={(e) => handleInputChange('headquarters', 'hqId', e.target.value)}
                        className="h-9 bg-black/30 dark:bg-black/50 border-gray-600 dark:border-gray-500 text-white dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1">
                        Encrypted Passcode
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Encrypted Passcode"
                          value={credentials.headquarters.passcode}
                          onChange={(e) => handleInputChange('headquarters', 'passcode', e.target.value)}
                          className="h-9 pr-10 bg-black/30 dark:bg-black/50 border-gray-600 dark:border-gray-500 text-white dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:hover:text-gray-400 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-9 text-sm font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
      <footer className="relative z-10 py-1 border-t border-gray-700 dark:border-gray-600">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center text-red-400 dark:text-red-500 text-xs font-medium">
              <Shield className="w-3 h-3 mr-1" />
              <span className="uppercase tracking-wide">Confidential System</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-xs max-w-2xl mx-auto">
              Access restricted to authorized personnel only. All activities are monitored and logged.
            </p>
            <div className="text-blue-300 dark:text-blue-400 text-xs font-medium">
              © 2024 Telangana State Police • Anti Narcotics Bureau • Government of Telangana
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TGANBLogin;
