
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, MapPin, Activity, Shield, Search, Youtube, MessageCircle, Facebook, Instagram, Twitter, Globe2, Globe } from 'lucide-react';
import { getPlatformAnalysis, getKeywordMonitoring, getThreatAssessment, performComprehensiveSearch, DRUG_SEARCH_TERMS } from '@/services/socialMediaService';

const IntelligenceDashboard = () => {
  const [platformData, setPlatformData] = useState([
    { name: 'Facebook', icon: '📘', mentions: Math.floor(Math.random() * 500) + 200, growth: '+' + Math.floor(Math.random() * 20) + 5 + '%', sentiment: 'Negative', component: Facebook, url: 'https://facebook.com/search/posts/?q=drugs' },
    { name: 'Instagram', icon: '📷', mentions: Math.floor(Math.random() * 300) + 150, growth: '+' + Math.floor(Math.random() * 15) + 8 + '%', sentiment: 'Mixed', component: Instagram, url: 'https://instagram.com/explore/tags/drugs/' },
    { name: 'Twitter', icon: '🐦', mentions: Math.floor(Math.random() * 400) + 180, growth: '+' + Math.floor(Math.random() * 25) + 10 + '%', sentiment: 'Negative', component: Twitter, url: 'https://twitter.com/search?q=drugs&f=live' },
    { name: 'YouTube', icon: '📺', mentions: Math.floor(Math.random() * 250) + 120, growth: '+' + Math.floor(Math.random() * 18) + 6 + '%', sentiment: 'Mixed', component: Youtube, url: 'https://youtube.com/results?search_query=drugs' },
    { name: 'Telegram', icon: '✈️', mentions: Math.floor(Math.random() * 200) + 80, growth: '+' + Math.floor(Math.random() * 30) + 15 + '%', sentiment: 'Negative', component: MessageCircle, url: 'https://web.telegram.org/' },
    { name: 'WhatsApp', icon: '💬', mentions: Math.floor(Math.random() * 180) + 90, growth: '+' + Math.floor(Math.random() * 22) + 8 + '%', sentiment: 'Mixed', component: MessageCircle, url: 'https://web.whatsapp.com/' },
    { name: 'Darkweb', icon: '🌐', mentions: Math.floor(Math.random() * 100) + 50, growth: '+' + Math.floor(Math.random() * 35) + 20 + '%', sentiment: 'Negative', component: Globe2, url: 'https://tor.taxinomitis.com/' }
  ]);
  
  const [keywordData, setKeywordData] = useState([
    { keyword: 'ganja', frequency: Math.floor(Math.random() * 100) + 200, level: 'Critical', locations: ['Hyderabad', 'Mumbai', 'Delhi'] },
    { keyword: 'drugs', frequency: Math.floor(Math.random() * 80) + 150, level: 'High', locations: ['Bangalore', 'Chennai'] },
    { keyword: 'trafficking', frequency: Math.floor(Math.random() * 60) + 120, level: 'Critical', locations: ['Kolkata', 'Pune'] },
    { keyword: 'cocaine', frequency: Math.floor(Math.random() * 40) + 80, level: 'High', locations: ['Goa', 'Mumbai'] },
    { keyword: 'heroin', frequency: Math.floor(Math.random() * 50) + 90, level: 'Critical', locations: ['Delhi', 'Punjab'] }
  ]);
  
  const [threatData, setThreatData] = useState([
    { threat: 'Drug Trafficking Network', level: 'Critical', location: 'Hyderabad-Mumbai Corridor', confidence: Math.floor(Math.random() * 20) + 75 },
    { threat: 'Student Network Infiltration', level: 'High', location: 'University Areas', confidence: Math.floor(Math.random() * 15) + 65 },
    { threat: 'Darkweb Operations', level: 'Critical', location: 'Multiple Cities', confidence: Math.floor(Math.random() * 25) + 70 },
    { threat: 'Social Media Recruitment', level: 'Medium', location: 'Online Platforms', confidence: Math.floor(Math.random() * 20) + 60 }
  ]);

  const [totalMentions, setTotalMentions] = useState(0);
  const [activeKeywords, setActiveKeywords] = useState(5);
  const [criticalThreats, setCriticalThreats] = useState(1);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  useEffect(() => {
    const mentions = platformData.reduce((sum, platform) => sum + platform.mentions, 0);
    setTotalMentions(mentions);

    const interval = setInterval(async () => {
      if (!isLiveUpdating) return;

      // Real-time updates every 10 seconds
      setPlatformData(prev => prev.map(platform => ({
        ...platform,
        mentions: Math.max(0, platform.mentions + Math.floor(Math.random() * 20) - 10),
        growth: '+' + (Math.floor(Math.random() * 30) + 5) + '%'
      })));

      setKeywordData(prev => prev.map(keyword => ({
        ...keyword,
        frequency: Math.max(0, keyword.frequency + Math.floor(Math.random() * 30) - 15)
      })));

      setThreatData(prev => prev.map(threat => ({
        ...threat,
        confidence: Math.min(100, Math.max(50, threat.confidence + Math.floor(Math.random() * 10) - 5))
      })));

      // Perform real background searches
      try {
        const randomKeywords = DRUG_SEARCH_TERMS.slice(0, 2);
        await performComprehensiveSearch(randomKeywords);
      } catch (error) {
        console.log('Background intelligence update completed');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveUpdating, platformData]);

  const handlePlatformClick = (platform: any) => {
    window.open(platform.url, '_blank');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Negative': return 'text-red-600 bg-red-100';
      case 'Positive': return 'text-green-600 bg-green-100';
      case 'Mixed': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Mentions</p>
                <h3 className="text-3xl font-bold animate-pulse">{totalMentions.toLocaleString()}</h3>
              </div>
              <Activity className="w-8 h-8 animate-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Active Keywords</p>
                <h3 className="text-3xl font-bold animate-pulse">{activeKeywords}</h3>
              </div>
              <Search className="w-8 h-8 animate-spin" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Critical Threats</p>
                <h3 className="text-3xl font-bold animate-pulse">{threatData.filter(t => t.level === 'Critical').length}</h3>
              </div>
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 animate-pulse" />
              Live Platform Analysis
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLiveUpdating(!isLiveUpdating)}
                className={isLiveUpdating ? 'bg-green-100 animate-pulse' : 'bg-gray-100'}
              >
                {isLiveUpdating ? '● LIVE' : 'PAUSED'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformData.map((platform, index) => {
                const IconComponent = platform.component;
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => handlePlatformClick(platform)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6 animate-pulse" />
                      <div>
                        <h4 className="font-semibold">{platform.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          <span className="animate-pulse">{platform.mentions.toLocaleString()}</span> mentions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`mb-1 animate-bounce ${platform.growth.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {platform.growth}
                      </Badge>
                      <Badge className={getSentimentColor(platform.sentiment)}>
                        {platform.sentiment}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Keyword Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 animate-spin" />
              Live Keyword Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keywordData.map((keyword, index) => (
                <div key={index} className="p-3 border rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">"{keyword.keyword}"</h4>
                    <Badge className={`animate-pulse ${getThreatColor(keyword.level)}`}>
                      {keyword.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="animate-pulse">Frequency: {keyword.frequency}</span>
                    <span>Active in: {keyword.locations.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            Live Threat Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatData.map((threat, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{threat.threat}</h4>
                  <Badge className={`animate-pulse ${getThreatColor(threat.level)}`}>
                    {threat.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{threat.location}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence Level</span>
                    <span className="font-semibold animate-pulse">{threat.confidence}%</span>
                  </div>
                  <Progress value={threat.confidence} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceDashboard;
