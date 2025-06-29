
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StatisticsSection from '@/components/StatisticsSection';
import { Search, Twitter, MessageCircle, Instagram, Facebook, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { performComprehensiveSearch, DRUG_SEARCH_TERMS, RealSearchResults } from '@/services/socialMediaService';

const HQDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [socialResults, setSocialResults] = useState<RealSearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [liveResults, setLiveResults] = useState({
    facebook: { count: 0, trending: true },
    instagram: { count: 0, trending: true },
    webSearch: { count: 0, trending: true },
    googleSearch: { count: 0, trending: true },
    total: 0
  });
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);

  // Continuous live monitoring of drug-related content
  useEffect(() => {
    const performLiveMonitoring = async () => {
      if (!isLiveMonitoring) return;
      
      try {
        // Select random drug terms for monitoring
        const randomTerms = DRUG_SEARCH_TERMS.slice(0, 5).sort(() => Math.random() - 0.5).slice(0, 3);
        console.log('Live monitoring drug terms:', randomTerms);
        
        const results = await performComprehensiveSearch(randomTerms);
        
        setLiveResults({
          facebook: { count: results.facebook.count, trending: true },
          instagram: { count: results.instagram.count, trending: true },
          webSearch: { count: results.webSearch.count, trending: true },
          googleSearch: { count: results.googleSearch.count, trending: true },
          total: results.facebook.count + results.instagram.count + results.webSearch.count + results.googleSearch.count
        });
        
        toast.success(`Live monitoring updated: ${results.facebook.count + results.instagram.count + results.webSearch.count + results.googleSearch.count} new drug-related posts detected`);
      } catch (error) {
        console.error('Live monitoring error:', error);
        toast.error('Live monitoring temporarily unavailable');
      }
    };

    // Initial load
    performLiveMonitoring();
    
    // Update every 2 minutes for real-time monitoring
    const interval = setInterval(performLiveMonitoring, 120000);
    return () => clearInterval(interval);
  }, [isLiveMonitoring]);

  const handleSocialSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter search keywords');
      return;
    }

    setIsSearching(true);
    
    try {
      const keywords = searchQuery.split(',').map(k => k.trim()).filter(k => k);
      console.log('Searching for keywords:', keywords);
      
      const results = await performComprehensiveSearch(keywords);
      setSocialResults(results);
      
      toast.success(`Real search completed: Found ${results.facebook.count + results.instagram.count + results.webSearch.count + results.googleSearch.count} results for "${keywords.join(', ')}"`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewResults = (platform: string, results?: any[]) => {
    if (platform === 'Instagram' && socialResults?.instagram.posts.length) {
      // Open Instagram with real search results
      const instagramUrl = socialResults.instagram.posts[0]?.link || `https://www.instagram.com/explore/tags/${encodeURIComponent(searchQuery)}/`;
      window.open(instagramUrl, '_blank');
      toast.success(`Opening ${socialResults.instagram.posts.length} Instagram results`);
    } else if (platform === 'Facebook' && socialResults?.facebook.posts.length) {
      // Open Facebook with real search results
      const facebookUrl = socialResults.facebook.posts[0]?.url || `https://www.facebook.com/search/posts/?q=${encodeURIComponent(searchQuery)}`;
      window.open(facebookUrl, '_blank');
      toast.success(`Opening ${socialResults.facebook.posts.length} Facebook results`);
    } else if (platform === 'Web' && socialResults?.webSearch.results.length) {
      // Open first web result
      const webUrl = socialResults.webSearch.results[0]?.url || `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(webUrl, '_blank');
      toast.success(`Opening ${socialResults.webSearch.results.length} web results`);
    } else {
      // Fallback to live monitoring search
      const platformUrl = {
        'Facebook': `https://www.facebook.com/search/posts/?q=${encodeURIComponent('drugs trafficking')}`,
        'Instagram': `https://www.instagram.com/explore/tags/drugs/`,
        'Web': `https://www.google.com/search?q=${encodeURIComponent('drug trafficking news')}`,
        'Google': `https://www.google.com/search?q=${encodeURIComponent('criminal drug activity')}`
      }[platform] || '#';
      
      window.open(platformUrl, '_blank');
      toast.success(`Opening live ${platform} monitoring results`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Headquarters Dashboard</h1>
          <p className="text-muted-foreground">Central command and control panel with live criminal intelligence</p>
        </div>

        {/* Live Criminal Intelligence Monitor - Always Visible */}
        <Card className="border-2 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Live Criminal Intelligence Monitor - Drug Trafficking
              <Badge variant="outline" className="bg-red-100 text-red-800 animate-pulse">● LIVE MONITORING</Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLiveMonitoring(!isLiveMonitoring)}
              >
                {isLiveMonitoring ? 'Pause' : 'Resume'} Live Feed
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card 
                className="cursor-pointer hover:shadow-md transition-all border-blue-200 dark:border-blue-800" 
                onClick={() => handleViewResults('Facebook')}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <Facebook className="w-8 h-8 text-blue-700 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{liveResults.facebook.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Drug Posts</div>
                    <div className="text-xs text-red-600 animate-pulse">● MONITORING</div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-md transition-all border-pink-200 dark:border-pink-800" 
                onClick={() => handleViewResults('Instagram')}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <Instagram className="w-8 h-8 text-pink-500 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{liveResults.instagram.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Suspicious Content</div>
                    <div className="text-xs text-red-600 animate-pulse">● MONITORING</div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-md transition-all border-green-200 dark:border-green-800" 
                onClick={() => handleViewResults('Web')}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <Globe className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{liveResults.webSearch.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Web Intel</div>
                    <div className="text-xs text-red-600 animate-pulse">● MONITORING</div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-md transition-all border-orange-200 dark:border-orange-800" 
                onClick={() => handleViewResults('Google')}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <Search className="w-8 h-8 text-orange-600 mb-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{liveResults.googleSearch.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Search Results</div>
                    <div className="text-xs text-red-600 animate-pulse">● MONITORING</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
              <div className="text-sm text-red-700 dark:text-red-300 mb-2">
                <strong>Live Criminal Intelligence Summary:</strong>
              </div>
              <div className="text-xs text-red-600 dark:text-red-400">
                Monitoring {DRUG_SEARCH_TERMS.length} drug-related keywords across all platforms • 
                Total Active Threats: <strong>{liveResults.total}</strong> • 
                Last Update: {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="flex space-x-4">
              <Input
                placeholder="Enter multiple keywords for criminal intelligence search (e.g., drugs, trafficking, cocaine, heroin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSocialSearch()}
              />
              <Button 
                onClick={handleSocialSearch}
                disabled={isSearching}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching Intel...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search Criminal Intel
                  </>
                )}
              </Button>
            </div>

            {socialResults && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Criminal Intelligence Search Results for "{searchQuery}":
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="text-xs">
                    <div className="font-bold text-blue-700">{socialResults.facebook.count}</div>
                    <div>Facebook</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-pink-500">{socialResults.instagram.count}</div>
                    <div>Instagram</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-green-600">{socialResults.webSearch.count}</div>
                    <div>Web</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-orange-600">{socialResults.googleSearch.count}</div>
                    <div>Google</div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewResults('Instagram')}
                    className="mr-2"
                  >
                    View Instagram Results ({socialResults.instagram.count})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewResults('Facebook')}
                  >
                    View Facebook Results ({socialResults.facebook.count})
                  </Button>
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
