
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import EagleAIChatbot from '@/components/EagleAIChatbot';
import IntelligenceDashboard from '@/components/IntelligenceDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Database, MessageCircle, BarChart3 } from 'lucide-react';

const EagleAIPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            Eagle AI - Advanced Criminal Intelligence Analysis
          </h1>
          <p className="text-muted-foreground">AI-powered criminal intelligence analysis, pattern recognition, and threat assessment</p>
        </div>

        <Tabs defaultValue="ai-assistant" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="intelligence-analysis" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Intelligence Analysis
            </TabsTrigger>
            <TabsTrigger value="pattern-recognition" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Pattern Recognition
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-assistant" className="mt-6">
            <EagleAIChatbot />
          </TabsContent>

          <TabsContent value="intelligence-analysis" className="mt-6">
            <IntelligenceDashboard />
          </TabsContent>

          <TabsContent value="pattern-recognition" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Analysis Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-green-600">Hierarchical Network Structure</h4>
                      <p className="text-sm text-muted-foreground">
                        AI detected 3-tier command structure with 89% confidence
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-orange-600">Geographic Clustering</h4>
                      <p className="text-sm text-muted-foreground">
                        Operations concentrated in Hyderabad-Warangal corridor
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-red-600">Communication Patterns</h4>
                      <p className="text-sm text-muted-foreground">
                        Encrypted messaging apps usage increased by 45%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Behavioral Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-blue-600">Activity Timing Patterns</h4>
                      <p className="text-sm text-muted-foreground">
                        Peak activity between 10 PM - 2 AM (76% of communications)
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-purple-600">Language Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Code words evolution detected in 67% of monitored channels
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-yellow-600">Recruitment Patterns</h4>
                      <p className="text-sm text-muted-foreground">
                        Targeting educational institutions with 82% success rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EagleAIPage;
