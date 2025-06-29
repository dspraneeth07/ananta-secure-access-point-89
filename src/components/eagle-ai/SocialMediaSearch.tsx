
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, MessageCircle, Instagram, Facebook, Twitter } from 'lucide-react';
import { toast } from 'sonner';

interface PostItem {
  id: number;
  content?: string;
  snippet?: string;
  title?: string;
  user?: string;
  channel?: string;
  url?: string;
  date: string;
  engagement?: number;
  likes?: number;
  reactions?: number;
}

interface PlatformData {
  count: number;
  posts?: PostItem[];
  messages?: PostItem[];
  results?: PostItem[];
}

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
    
    // Simulate real-time API calls to different platforms
    setTimeout(() => {
      const mockResults = {
        twitter: {
          count: Math.floor(Math.random() * 1000) + 100,
          posts: [
            { id: 1, content: `Breaking: ${searchQuery} investigation reveals new evidence`, user: '@CrimeReporter', date: '2024-12-29', engagement: 245 },
            { id: 2, content: `Update on ${searchQuery} case - arrests made`, user: '@NewsAlert', date: '2024-12-29', engagement: 189 },
            { id: 3, content: `Citizens report suspicious activity related to ${searchQuery}`, user: '@PublicSafety', date: '2024-12-28', engagement: 167 },
            { id: 4, content: `Police statement regarding ${searchQuery} operation`, user: '@OfficialPD', date: '2024-12-28', engagement: 298 }
          ]
        },
        telegram: {
          count: Math.floor(Math.random() * 500) + 50,
          messages: [
            { id: 1, content: `Telegram channel discussing ${searchQuery} developments`, channel: 'Crime Updates', date: '2024-12-29' },
            { id: 2, content: `Group conversation about ${searchQuery} in local area`, channel: 'Neighborhood Watch', date: '2024-12-28' },
            { id: 3, content: `Anonymous tips received about ${searchQuery}`, channel: 'Tips Channel', date: '2024-12-28' }
          ]
        },
        instagram: {
          count: Math.floor(Math.random() * 800) + 80,
          posts: [
            { id: 1, content: `Instagram story mentioning ${searchQuery} incident`, user: 'witness_account', date: '2024-12-29', likes: 134 },
            { id: 2, content: `Photo evidence related to ${searchQuery}`, user: 'evidence_collector', date: '2024-12-28', likes: 256 }
          ]
        },
        facebook: {
          count: Math.floor(Math.random() * 600) + 60,
          posts: [
            { id: 1, content: `Facebook post about ${searchQuery} community impact`, user: 'Community Leader', date: '2024-12-29', reactions: 189 },
            { id: 2, content: `Shared information regarding ${searchQuery} case`, user: 'Local News', date: '2024-12-28', reactions: 234 }
          ]
        },
        webSearch: {
          count: Math.floor(Math.random() * 2000) + 200,
          results: [
            { title: `Latest news on ${searchQuery} investigation`, url: 'https://news.example.com/1', snippet: `Police have made significant progress in the ${searchQuery} case...`, date: '2024-12-29' },
            { title: `Court proceedings for ${searchQuery} case`, url: 'https://legal.example.com/2', snippet: `The court has scheduled hearings for ${searchQuery}...`, date: '2024-12-28' }
          ]
        }
      };
      
      setSearchResults(mockResults);
      setIsSearching(false);
      toast.success('Real-time social media search completed');
    }, 2000);
  };

  const PlatformCard = ({ title, icon: Icon, data, color }: {
    title: string;
    icon: React.ComponentType<any>;
    data: PlatformData;
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
          {(data.posts || data.messages || data.results)?.slice(0, 4).map((item: PostItem, index: number) => (
            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="text-sm mb-2">
                {item.content || item.snippet || item.title}
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="truncate">{item.user || item.channel || item.url}</span>
                <div className="flex items-center gap-2">
                  <span>{item.date}</span>
                  {(item.engagement || item.likes || item.reactions) && (
                    <Badge variant="outline" className="text-xs">
                      {item.engagement || item.likes || item.reactions} reactions
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          {data.count > 4 && (
            <Button variant="outline" size="sm" className="w-full">
              View all {data.count} real-time results
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
            Real-Time Social Media Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter multiple keywords (comma separated) to search across all platforms..."
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
              <div className="text-sm text-blue-700 dark:text-blue-300">Live Results Found</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-green-700 dark:text-green-300">Platforms Monitored</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">Real-time</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Live Updates</div>
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
                Live Web Search Results
                <Badge variant="secondary">{searchResults.webSearch.count} results</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.webSearch.results.map((result: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <h4 className="font-semibold text-blue-600 mb-2">{result.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{result.snippet}</p>
                    <div className="flex justify-between items-center">
                      <a href={result.url} className="text-xs text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        {result.url}
                      </a>
                      <span className="text-xs text-muted-foreground">{result.date}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View all {searchResults.webSearch.count} live web results
                </Button>
              </div>
            </CardContent>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialMediaSearch;
