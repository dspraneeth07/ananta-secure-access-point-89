import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, MessageCircle, Instagram, Facebook, Twitter } from 'lucide-react';
import { toast } from 'sonner';

const SocialMediaSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter search keywords');
      return;
    }

    setIsSearching(true);
    
    // Simulate API calls to different platforms
    setTimeout(() => {
      const mockResults = {
        twitter: {
          count: Math.floor(Math.random() * 1000) + 100,
          posts: [
            { id: 1, content: `Found relevant tweet about ${searchQuery}`, user: '@user1', date: '2024-12-28', engagement: 45 },
            { id: 2, content: `Another tweet mentioning ${searchQuery}`, user: '@user2', date: '2024-12-27', engagement: 23 },
            { id: 3, content: `Important information about ${searchQuery}`, user: '@user3', date: '2024-12-26', engagement: 67 }
          ]
        },
        telegram: {
          count: Math.floor(Math.random() * 500) + 50,
          messages: [
            { id: 1, content: `Telegram message containing ${searchQuery}`, channel: 'Channel 1', date: '2024-12-28' },
            { id: 2, content: `Discussion about ${searchQuery} in group`, channel: 'Channel 2', date: '2024-12-27' }
          ]
        },
        instagram: {
          count: Math.floor(Math.random() * 800) + 80,
          posts: [
            { id: 1, content: `Instagram post about ${searchQuery}`, user: 'user1', date: '2024-12-28', likes: 234 },
            { id: 2, content: `Story mentioning ${searchQuery}`, user: 'user2', date: '2024-12-27', likes: 156 }
          ]
        },
        facebook: {
          count: Math.floor(Math.random() * 600) + 60,
          posts: [
            { id: 1, content: `Facebook post discussing ${searchQuery}`, user: 'User One', date: '2024-12-28', reactions: 89 },
            { id: 2, content: `Marketplace item related to ${searchQuery}`, user: 'User Two', date: '2024-12-27', reactions: 34 }
          ]
        },
        webSearch: {
          count: Math.floor(Math.random() * 2000) + 200,
          results: [
            { title: `Comprehensive guide about ${searchQuery}`, url: 'https://example.com/1', snippet: `Detailed information about ${searchQuery}...` },
            { title: `News article mentioning ${searchQuery}`, url: 'https://example.com/2', snippet: `Recent developments in ${searchQuery}...` }
          ]
        }
      };
      
      setSearchResults(mockResults);
      setIsSearching(false);
      toast.success('Social media search completed');
    }, 3000);
  };

  const PlatformCard = ({ title, icon: Icon, data, color }: {
    title: string;
    icon: React.ComponentType<any>;
    data: any;
    color: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
          <Badge variant="secondary">{data.count} results</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(data.posts || data.messages || data.results)?.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="text-sm">
                {item.content || item.snippet || item.title}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>{item.user || item.channel || item.url}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
          {data.count > 3 && (
            <Button variant="outline" size="sm" className="w-full">
              View all {data.count} results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Social Media Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter keywords to search across social media platforms..."
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
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search All Platforms
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
                {Object.values(searchResults).reduce((sum: number, platform: any) => sum + platform.count, 0)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Results Found</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-green-700 dark:text-green-300">Platforms Searched</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">Real-time</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Search Results</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlatformCard
              title="Twitter/X"
              icon={Twitter}
              data={searchResults.twitter}
              color="text-blue-500"
            />
            
            <PlatformCard
              title="Telegram"
              icon={MessageCircle}
              data={searchResults.telegram}
              color="text-blue-600"
            />
            
            <PlatformCard
              title="Instagram"
              icon={Instagram}
              data={searchResults.instagram}
              color="text-pink-500"
            />
            
            <PlatformCard
              title="Facebook"
              icon={Facebook}
              data={searchResults.facebook}
              color="text-blue-700"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Web Search Results
                <Badge variant="secondary">{searchResults.webSearch.count} results</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.webSearch.results.map((result: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-blue-600 mb-2">{result.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{result.snippet}</p>
                    <a href={result.url} className="text-xs text-blue-500 hover:underline">
                      {result.url}
                    </a>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View all {searchResults.webSearch.count} web results
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SocialMediaSearch;
