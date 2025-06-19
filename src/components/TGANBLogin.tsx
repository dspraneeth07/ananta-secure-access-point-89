
import React, { useState } from 'react';
import { Shield, Building, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const TGANBLogin = () => {
  const [activePanel, setActivePanel] = useState<'police' | 'headquarters'>('police');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    police: { officerId: '', password: '' },
    headquarters: { hqId: '', passcode: '' }
  });

  const handleInputChange = (panel: 'police' | 'headquarters', field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [panel]: { ...prev[panel], [field]: value }
    }));
  };

  const handleLogin = (panel: 'police' | 'headquarters') => {
    console.log(`${panel} login attempted:`, credentials[panel]);
    // Login logic would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 pt-8 pb-6">
        <div className="container mx-auto px-4 text-center">
          {/* Official Logo */}
          <div className="mb-6 animate-fade-in">
            <img 
              src="/lovable-uploads/68edd6e3-5f88-4e5e-a0be-b0e347c0ea8b.png" 
              alt="TGANB Official Logo" 
              className="w-32 h-32 mx-auto mb-4 animate-pulse-glow rounded-full"
            />
          </div>
          
          {/* Official Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-roboto-condensed uppercase tracking-wider text-tganb-gold mb-2 animate-fade-in">
            Telangana Anti Narcotics Bureau
          </h1>
          <p className="text-tganb-grey text-lg font-medium uppercase tracking-wide">
            Secure Access Portal
          </p>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center mt-4 text-sm text-tganb-gold">
            <Shield className="w-4 h-4 mr-2" />
            <span className="font-medium">CLASSIFIED ACCESS ONLY</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Panel Selector */}
          <div className="flex justify-center mb-8">
            <div className="glass-effect rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActivePanel('police')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activePanel === 'police'
                    ? 'bg-tganb-blue text-tganb-gold shadow-lg'
                    : 'text-tganb-grey hover:text-white'
                }`}
              >
                Police Station Access
              </button>
              <button
                onClick={() => setActivePanel('headquarters')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activePanel === 'headquarters'
                    ? 'bg-tganb-blue text-tganb-gold shadow-lg'
                    : 'text-tganb-grey hover:text-white'
                }`}
              >
                Headquarters Access
              </button>
            </div>
          </div>

          {/* Login Panels Container */}
          <div className="relative overflow-hidden">
            <div 
              className={`flex transition-transform duration-500 ease-in-out ${
                activePanel === 'headquarters' ? '-translate-x-full' : 'translate-x-0'
              }`}
              style={{ width: '200%' }}
            >
              {/* Police Station Panel */}
              <Card className="w-1/2 p-8 glass-effect border-tganb-gold/20 mr-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-tganb-blue/30 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-tganb-gold" />
                  </div>
                  <h2 className="text-2xl font-bold text-tganb-gold mb-2">Police Station Login</h2>
                  <p className="text-tganb-grey">Field Operations Access</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin('police'); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-tganb-gold mb-2">
                      Officer ID
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Officer ID"
                      value={credentials.police.officerId}
                      onChange={(e) => handleInputChange('police', 'officerId', e.target.value)}
                      className="military-input text-white placeholder-tganb-grey h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tganb-gold mb-2">
                      Secure Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Password"
                        value={credentials.police.password}
                        onChange={(e) => handleInputChange('police', 'password', e.target.value)}
                        className="military-input text-white placeholder-tganb-grey h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tganb-gold hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full glass-button h-12 text-white font-semibold text-lg"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Secure Login
                  </Button>
                </form>
              </Card>

              {/* Headquarters Panel */}
              <Card className="w-1/2 p-8 glass-effect border-tganb-gold/20">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-tganb-red/30 rounded-full mb-4">
                    <Building className="w-8 h-8 text-tganb-gold" />
                  </div>
                  <h2 className="text-2xl font-bold text-tganb-gold mb-2">Headquarters Access</h2>
                  <p className="text-tganb-grey">Command Center Portal</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin('headquarters'); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-tganb-gold mb-2">
                      HQ Access ID
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter HQ ID"
                      value={credentials.headquarters.hqId}
                      onChange={(e) => handleInputChange('headquarters', 'hqId', e.target.value)}
                      className="military-input text-white placeholder-tganb-grey h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tganb-gold mb-2">
                      Encrypted Passcode
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Encrypted Passcode"
                        value={credentials.headquarters.passcode}
                        onChange={(e) => handleInputChange('headquarters', 'passcode', e.target.value)}
                        className="military-input text-white placeholder-tganb-grey h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tganb-gold hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full glass-button h-12 text-white font-semibold text-lg"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Access Command Center
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 py-6 border-t border-tganb-gold/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center text-tganb-red text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              <span className="uppercase tracking-wide">Confidential System</span>
            </div>
            <p className="text-tganb-grey text-xs max-w-2xl mx-auto">
              Access restricted to authorized personnel only. All activities are monitored and logged. 
              Unauthorized access attempts will be reported to law enforcement authorities.
            </p>
            <div className="text-tganb-gold text-xs font-medium">
              © 2024 Telangana State Police • Anti Narcotics Bureau • Government of Telangana
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TGANBLogin;
