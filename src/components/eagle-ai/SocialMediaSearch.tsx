
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, MessageCircle, Instagram, Facebook, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { performComprehensiveSearch, RealSearchResults, DRUG_SEARCH_TERMS } from '@/services/socialMediaService';

const SocialMediaSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RealSearchResults | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter search keywords');
      return;
    }

    setIsSearching(true);
    
    try {
      const keywords = searchQuery.split(',').map(k => k.trim()).filter(k => k);
      console.log('Performing real-time search for:', keywords);
      
      toast.info('Searching across all platforms...');
      const results = await performComprehensiveSearch(keywords);
      
      setSearchResults(results);
      toast.success(`Real-time search completed! Found ${results.facebook.count + results.instagram.count + results.webSearch.count + results.googleSearch.count} total results`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewPlatformResults = (platform: string) => {
    if (!searchResults) return;

    let url = '';
    let count = 0;

    switch (platform) {
      case 'Facebook':
        count = searchResults.facebook.count;
        if (searchResults.facebook.posts.length > 0) {
          url = searchResults.facebook.posts[0].url || `https://www.facebook.com/search/posts/?q=${encodeURIComponent(searchQuery)}`;
        } else {
          url = `https://www.facebook.com/search/posts/?q=${encodeURIComponent(searchQuery)}`;
        }
        break;
      case 'Instagram':
        count = searchResults.instagram.count;
        if (searchResults.instagram.posts.length > 0) {
          url = searchResults.instagram.posts[0].link || `https://www.instagram.com/explore/tags/${encodeURIComponent(searchQuery.replace(/\s+/g, ''))}/`;
        } else {
          url = `https://www.instagram.com/explore/tags/${encodeURIComponent(searchQuery.replace(/\s+/g, ''))}/`;
        }
        break;
      case 'Web':
        count = searchResults.webSearch.count;
        if (searchResults.webSearch.results.length > 0) {
          url = searchResults.webSearch.results[0].url || `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        } else {
          url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        }
        break;
      case 'Google':
        count = searchResults.googleSearch.count;
        if (searchResults.googleSearch.results.length > 0) {
          url = searchResults.googleSearch.results[0].url || `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        } else {
          url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        }
        break;
    }

    if (url) {
      window.open(url, '_blank');
      toast.success(`Opening ${count} ${platform} results for "${searchQuery}"`);
    }
  };

  const PlatformCard = ({ title, icon: Icon, data, color, platform }: {
    title: string;
    icon: React.ComponentType<any>;
    data: { count: number; posts?: any[]; results?: any[] };
    color: string;
    platform: string;
  }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleViewPlatformResults(platform)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
          <Badge variant="secondary">{data.count} real results</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(data.posts || data.results)?.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="text-sm mb-2 line-clamp-2">
                {item.text || item.title || item.description || item.snippet || 'Content detected'}
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="truncate">
                  {item.username || item.author || item.source || 'Unknown source'}
                </span>
                <div className="flex items-center gap-2">
                  <span>{item.created_time || item.date || 'Recent'}</span>
                  {item.url && (
                    <Badge variant="outline" className="text-xs cursor-pointer">
                      View Original
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          {data.count > 3 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleViewPlatformResults(platform);
              }}
            >
              View all {data.count} real results →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getTotalResults = (results: RealSearchResults): number => {
    return results.facebook.count + results.instagram.count + results.webSearch.count + results.googleSearch.count;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Real-Time Criminal Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              <strong>Suggested Criminal Intelligence Keywords:</strong>
            </div>
            <div className="flex flex-wrap gap-1">
              {DRUG_SEARCH_TERMS.slice(0, 15).map((term) => (
                <Badge 
                  key={term} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-blue-100"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Input
              placeholder="Enter criminal intelligence keywords (e.g., drugs, trafficking, cocaine, heroin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching Live...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search Real-Time
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getTotalResults(searchResults)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Real Results Found</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-green-700 dark:text-green-300">Platforms Searched</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">LIVE</div>
              <div className="text-sm text-red-700 dark:text-red-300">Real-Time Intel</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlatformCard
              title="Facebook Intelligence"
              icon={Facebook}
              data={searchResults.facebook}
              color="text-blue-700"
              platform="Facebook"
            />
            
            <PlatformCard
              title="Instagram Intelligence"
              icon={Instagram}
              data={searchResults.instagram}
              color="text-pink-500"
              platform="Instagram"
            />
            
            <PlatformCard
              title="Web Intelligence"
              icon={Globe}
              data={searchResults.webSearch}
              color="text-green-600"
              platform="Web"
            />
            
            <PlatformCard
              title="Google Search Intelligence"
              icon={Search}
              data={searchResults.googleSearch}
              color="text-orange-600"
              platform="Google"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Comprehensive Intelligence Summary
                <Badge variant="secondary">{getTotalResults(searchResults)} total results</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Platform Breakdown:</h4>
                  <div className="text-sm space-y-1">
                    <div>Facebook: {searchResults.facebook.count} results</div>
                    <div>Instagram: {searchResults.instagram.count} results</div>
                    <div>Web Search: {searchResults.webSearch.count} results</div>
                    <div>Google Search: {searchResults.googleSearch.count} results</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Quick Actions:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewPlatformResults('Instagram')}>
                      Open Instagram Results
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewPlatformResults('Facebook')}>
                      Open Facebook Results
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewPlatformResults('Web')}>
                      Open Web Results
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SocialMediaSearch;
