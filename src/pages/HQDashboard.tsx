
import React, { useState, useEffect } from 'react';
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
  const [liveResults, setLiveResults] = useState<any>({
    twitter: { count: 1247, trending: true },
    telegram: { count: 856, trending: true },
    instagram: { count: 2103, trending: true },
    facebook: { count: 1578, trending: true },
    web: { count: 4562, trending: true }
  });

  // Simulate live updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveResults((prev: any) => ({
        twitter: { count: prev.twitter.count + Math.floor(Math.random() * 10), trending: true },
        telegram: { count: prev.telegram.count + Math.floor(Math.random() * 5), trending: true },
        instagram: { count: prev.instagram.count + Math.floor(Math.random() * 15), trending: true },
        facebook: { count: prev.facebook.count + Math.floor(Math.random() * 8), trending: true },
        web: { count: prev.web.count + Math.floor(Math.random() * 20), trending: true }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSocialSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter search keywords');
      return;
    }

    setIsSearching(true);
    
    // Simulate social media search with multiple keywords
    setTimeout(() => {
      const keywords = searchQuery.split(',').map(k => k.trim());
      const mockResults = {
        twitter: Math.floor(Math.random() * 500) + 50,
        telegram: Math.floor(Math.random() * 300) + 30,
        instagram: Math.floor(Math.random() * 400) + 40,
        facebook: Math.floor(Math.random() * 350) + 35,
        web: Math.floor(Math.random() * 1000) + 100
      };
      
      setSocialResults(mockResults);
      setIsSearching(false);
      toast.success(`Social media search completed for: ${keywords.join(', ')}`);
    }, 2000);
  };

  const handleViewResults = (platform: string) => {
    // Navigate to detailed results - for now just show success message
    toast.success(`Opening detailed ${platform} results for "${searchQuery}"`);
    // In real implementation, this would redirect to actual social media posts
    window.open(`https://example.com/${platform.toLowerCase()}/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Headquarters Dashboard</h1>
          <p className="text-muted-foreground">Central command and control panel with live intelligence</p>
        </div>

        {/* Live Social Media Intelligence - Always Visible */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Live Social Media Intelligence Monitor
              <Badge variant="outline" className="bg-green-100 text-green-800">LIVE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card className="cursor-pointer hover:shadow-md transition-all border-blue-200 dark:border-blue-800" onClick={() => handleViewResults('Twitter')}>
                <CardContent className="flex flex-col items-center p-4">
                  <Twitter className="w-8 h-8 text-blue-500 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{liveResults.twitter.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Live Posts</div>
                    <div className="text-xs text-green-600 animate-pulse">● LIVE</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-all border-blue-200 dark:border-blue-800" onClick={() => handleViewResults('Telegram')}>
                <CardContent className="flex flex-col items-center p-4">
                  <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{liveResults.telegram.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Messages</div>
                    <div className="text-xs text-green-600 animate-pulse">● LIVE</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-all border-blue-200 dark:border-blue-800" onClick={() => handleViewResults('Instagram')}>
                <CardContent className="flex flex-col items-center p-4">
                  <Instagram className="w-8 h-8 text-pink-500 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{liveResults.instagram.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Posts & Stories</div>
                    <div className="text-xs text-green-600 animate-pulse">● LIVE</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-all border-blue-200 dark:border-blue-800" onClick={() => handleViewResults('Facebook')}>
                <CardContent className="flex flex-col items-center p-4">
                  <Facebook className="w-8 h-8 text-blue-700 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{liveResults.facebook.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Posts & Updates</div>
                    <div className="text-xs text-green-600 animate-pulse">● LIVE</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-all border-blue-200 dark:border-blue-800" onClick={() => handleViewResults('Web')}>
                <CardContent className="flex flex-col items-center p-4">
                  <Globe className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">{liveResults.web.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Web Results</div>
                    <div className="text-xs text-green-600 animate-pulse">● LIVE</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-4">
              <Input
                placeholder="Enter multiple keywords (comma separated) to search across all platforms..."
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
                    Search All
                  </>
                )}
              </Button>
            </div>

            {socialResults && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Search Results for "{searchQuery}":
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="text-xs">
                    <div className="font-bold text-blue-500">{socialResults.twitter}</div>
                    <div>Twitter</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-blue-600">{socialResults.telegram}</div>
                    <div>Telegram</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-pink-500">{socialResults.instagram}</div>
                    <div>Instagram</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-blue-700">{socialResults.facebook}</div>
                    <div>Facebook</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-green-600">{socialResults.web}</div>
                    <div>Web</div>
                  </div>
                </div>
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
