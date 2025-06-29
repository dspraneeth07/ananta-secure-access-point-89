import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, User, Bot, AlertTriangle, Search, Database } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  analysis?: {
    connections: string[];
    threats: string[];
    recommendations: string[];
  };
}

const EagleAIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m Eagle AI, your criminal intelligence analysis assistant. I can analyze patterns, connections, and threats based on our intelligence database. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const analyzeWithEagleAI = async (query: string): Promise<Message> => {
    // Simulate AI analysis based on the query
    const lowerQuery = query.toLowerCase();
    
    let analysis = {
      connections: [] as string[],
      threats: [] as string[],
      recommendations: [] as string[]
    };

    let response = '';

    if (lowerQuery.includes('drug') || lowerQuery.includes('ganja') || lowerQuery.includes('trafficking')) {
      analysis = {
        connections: [
          'Hyderabad-Warangal supply corridor identified',
          'Cross-border smuggling network via Adilabad',
          'University student distribution network',
          'Dark web marketplace connections'
        ],
        threats: [
          'Critical: New supplier network establishing',
          'High: Increased social media recruitment',
          'Medium: Cryptocurrency payment methods',
          'High: Law enforcement evasion tactics'
        ],
        recommendations: [
          'Increase surveillance on identified corridors',
          'Monitor university campuses more closely',
          'Track cryptocurrency transactions',
          'Coordinate with border security'
        ]
      };

      response = `Based on my analysis of current intelligence data, I've identified several concerning patterns related to drug trafficking operations. The data shows increased activity along the Hyderabad-Warangal corridor with ${Math.floor(Math.random() * 50) + 150} related mentions in the past 24 hours. 

Key findings:
• ${analysis.connections.length} major network connections identified
• ${analysis.threats.length} active threat vectors detected
• Confidence level: ${Math.floor(Math.random() * 20) + 75}%

The intelligence suggests a coordinated effort involving multiple platforms and geographic regions. Immediate action recommended.`;
    
    } else if (lowerQuery.includes('network') || lowerQuery.includes('connection')) {
      analysis = {
        connections: [
          'Social media recruitment patterns',
          'Geographic distribution networks',
          'Communication method correlations',
          'Financial transaction patterns'
        ],
        threats: [
          'High: Encrypted communication usage',
          'Medium: Geographic expansion',
          'Critical: Recruitment of minors',
          'High: Technology adoption rate'
        ],
        recommendations: [
          'Deploy advanced communication monitoring',
          'Increase field surveillance operations',
          'Focus on educational institution monitoring',
          'Enhance digital forensics capabilities'
        ]
      };

      response = `Network analysis reveals complex interconnections across multiple platforms and regions. I've mapped ${Math.floor(Math.random() * 30) + 20} distinct network nodes with ${Math.floor(Math.random() * 100) + 200} active connections.

The network shows characteristics of:
• Hierarchical structure with 3-4 command levels
• Geographic spread across ${Math.floor(Math.random() * 5) + 8} districts
• Multi-platform communication strategy
• Sophisticated counter-surveillance measures`;

    } else {
      response = `I've analyzed your query against our intelligence database. Current system status:
• Monitoring ${Math.floor(Math.random() * 100) + 500} active intelligence feeds
• Processing ${Math.floor(Math.random() * 50) + 200} real-time alerts
• Tracking ${Math.floor(Math.random() * 20) + 80} ongoing investigations

Please provide more specific details about criminal activities, networks, or threats you'd like me to analyze.`;
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      analysis
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse = await analyzeWithEagleAI(input);
      setMessages(prev => [...prev, botResponse]);
      
      toast.success('Intelligence analysis completed');
    } catch (error) {
      console.error('Eagle AI error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'I encountered an issue processing your request. Please try again or contact system administrator.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Analysis failed');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Eagle AI Criminal Intelligence Assistant
          <Badge variant="outline" className="bg-blue-100 text-blue-800">● ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {message.analysis && (
                    <div className="mt-2 space-y-2">
                      {message.analysis.connections.length > 0 && (
                        <div className="p-2 bg-blue-50 rounded text-sm">
                          <div className="flex items-center gap-1 font-semibold text-blue-700 mb-1">
                            <Database className="w-3 h-3" />
                            Connections Identified
                          </div>
                          <ul className="text-blue-600 space-y-1">
                            {message.analysis.connections.map((conn, i) => (
                              <li key={i}>• {conn}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.analysis.threats.length > 0 && (
                        <div className="p-2 bg-red-50 rounded text-sm">
                          <div className="flex items-center gap-1 font-semibold text-red-700 mb-1">
                            <AlertTriangle className="w-3 h-3" />
                            Threat Assessment
                          </div>
                          <ul className="text-red-600 space-y-1">
                            {message.analysis.threats.map((threat, i) => (
                              <li key={i}>• {threat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.analysis.recommendations.length > 0 && (
                        <div className="p-2 bg-green-50 rounded text-sm">
                          <div className="flex items-center gap-1 font-semibold text-green-700 mb-1">
                            <Search className="w-3 h-3" />
                            Recommendations
                          </div>
                          <ul className="text-green-600 space-y-1">
                            {message.analysis.recommendations.map((rec, i) => (
                              <li key={i}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center order-1">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about criminal intelligence, networks, threats..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EagleAIChatbot;
