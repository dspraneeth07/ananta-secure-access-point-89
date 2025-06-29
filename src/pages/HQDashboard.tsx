
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StatisticsSection from '@/components/StatisticsSection';
import { Search, Twitter, MessageCircle, Instagram, Facebook, Globe } from 'lucide-react';
import { toast } from 'sonner';

const HQDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [socialResults, setSocialResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSocialSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter search keywords');
      return;
    }

    setIsSearching(true);
    
    // Simulate social media search
    setTimeout(() => {
      const mockResults = {
        twitter: Math.floor(Math.random() * 500) + 50,
        telegram: Math.floor(Math.random() * 300) + 30,
        instagram: Math.floor(Math.random() * 400) + 40,
        facebook: Math.floor(Math.random() * 350) + 35,
        web: Math.floor(Math.random() * 1000) + 100
      };
      
      setSocialResults(mockResults);
      setIsSearching(false);
      toast.success('Social media search completed');
    }, 2000);
  };

  const handleViewResults = (platform: string) => {
    toast.success(`Viewing ${platform} results for "${searchQuery}"`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Headquarters Dashboard</h1>
          <p className="text-muted-foreground">Central command and control panel</p>
        </div>

        {/* Social Media Intelligence Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Social Media Intelligence Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Input
                placeholder="Enter keywords to search across social media platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSocialSearch()}
              />
              <Button 
                onClick={handleSocialSearch}
                disabled={isSearching}
                className="flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {socialResults && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="cursor-pointer hover:shadow-md" onClick={() => handleViewResults('Twitter')}>
                  <CardContent className="flex flex-col items-center p-4">
                    <Twitter className="w-8 h-8 text-blue-500 mb-2" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{socialResults.twitter}</div>
                      <div className="text-xs text-muted-foreground">Twitter/X Posts</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md" onClick={() => handleViewResults('Telegram')}>
                  <CardContent className="flex flex-col items-center p-4">
                    <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{socialResults.telegram}</div>
                      <div className="text-xs text-muted-foreground">Telegram Messages</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md" onClick={() => handleViewResults('Instagram')}>
                  <CardContent className="flex flex-col items-center p-4">
                    <Instagram className="w-8 h-8 text-pink-500 mb-2" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{socialResults.instagram}</div>
                      <div className="text-xs text-muted-foreground">Instagram Posts</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md" onClick={() => handleViewResults('Facebook')}>
                  <CardContent className="flex flex-col items-center p-4">
                    <Facebook className="w-8 h-8 text-blue-700 mb-2" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{socialResults.facebook}</div>
                      <div className="text-xs text-muted-foreground">Facebook Posts</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md" onClick={() => handleViewResults('Web')}>
                  <CardContent className="flex flex-col items-center p-4">
                    <Globe className="w-8 h-8 text-green-600 mb-2" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{socialResults.web}</div>
                      <div className="text-xs text-muted-foreground">Web Results</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <StatisticsSection />
      </div>
    </Layout>
  );
};

export default HQDashboard;
