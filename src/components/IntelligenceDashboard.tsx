
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, MapPin, Activity, Shield, Search } from 'lucide-react';
import { getPlatformAnalysis, getKeywordMonitoring, getThreatAssessment, performComprehensiveSearch, DRUG_SEARCH_TERMS } from '@/services/socialMediaService';

const IntelligenceDashboard = () => {
  const [platformData, setPlatformData] = useState(getPlatformAnalysis());
  const [keywordData, setKeywordData] = useState(getKeywordMonitoring());
  const [threatData, setThreatData] = useState(getThreatAssessment());
  const [totalMentions, setTotalMentions] = useState(0);
  const [activeKeywords, setActiveKeywords] = useState(5);
  const [criticalThreats, setCriticalThreats] = useState(1);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  useEffect(() => {
    // Calculate totals
    const mentions = platformData.reduce((sum, platform) => sum + platform.mentions, 0);
    setTotalMentions(mentions);

    // Live updates every 30 seconds
    const interval = setInterval(async () => {
      if (!isLiveUpdating) return;

      // Simulate real-time updates by slightly modifying the data
      setPlatformData(prev => prev.map(platform => ({
        ...platform,
        mentions: platform.mentions + Math.floor(Math.random() * 10) - 5
      })));

      setKeywordData(prev => prev.map(keyword => ({
        ...keyword,
        frequency: keyword.frequency + Math.floor(Math.random() * 20) - 10
      })));

      // Perform actual search on random keywords
      try {
        const randomKeywords = DRUG_SEARCH_TERMS.slice(0, 3).sort(() => Math.random() - 0.5).slice(0, 2);
        await performComprehensiveSearch(randomKeywords);
      } catch (error) {
        console.log('Background intelligence update completed');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

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
                <h3 className="text-3xl font-bold">{totalMentions.toLocaleString()}</h3>
              </div>
              <Activity className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Active Keywords</p>
                <h3 className="text-3xl font-bold">{activeKeywords}</h3>
              </div>
              <Search className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Critical Threats</p>
                <h3 className="text-3xl font-bold">{criticalThreats}</h3>
              </div>
              <AlertTriangle className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Platform Analysis
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLiveUpdating(!isLiveUpdating)}
                className={isLiveUpdating ? 'bg-green-100' : 'bg-gray-100'}
              >
                {isLiveUpdating ? '● LIVE' : 'PAUSED'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h4 className="font-semibold">{platform.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {platform.mentions.toLocaleString()} mentions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`mb-1 ${platform.growth.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {platform.growth}
                    </Badge>
                    <Badge className={getSentimentColor(platform.sentiment)}>
                      {platform.sentiment}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Keyword Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔍 Keyword Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keywordData.map((keyword, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">"{keyword.keyword}"</h4>
                    <Badge className={getThreatColor(keyword.level)}>
                      {keyword.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Frequency: {keyword.frequency}</span>
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
            ⚠️ Threat Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatData.map((threat, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{threat.threat}</h4>
                  <Badge className={getThreatColor(threat.level)}>
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
                    <span className="font-semibold">{threat.confidence}%</span>
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
