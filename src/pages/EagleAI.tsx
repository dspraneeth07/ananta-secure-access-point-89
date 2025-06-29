
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, FileSpreadsheet, Search, Brain } from 'lucide-react';
import CDRNetworkingMap from '@/components/eagle-ai/CDRNetworkingMap';
import CDRConverter from '@/components/eagle-ai/CDRConverter';
import AIFIRAnalyser from '@/components/eagle-ai/AIFIRAnalyser';
import SocialMediaSearch from '@/components/eagle-ai/SocialMediaSearch';

const EagleAI = () => {
  const [activeTab, setActiveTab] = useState('cdr-networking');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            Eagle AI - Intelligence Analysis System
          </h1>
          <p className="text-muted-foreground">Advanced AI-powered criminal intelligence and analysis tools</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cdr-networking" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              CDR Networking
            </TabsTrigger>
            <TabsTrigger value="cdr-converter" className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              CDR Converter
            </TabsTrigger>
            <TabsTrigger value="fir-analyser" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              FIR Analyser
            </TabsTrigger>
            <TabsTrigger value="social-search" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Social Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cdr-networking" className="mt-6">
            <CDRNetworkingMap />
          </TabsContent>

          <TabsContent value="cdr-converter" className="mt-6">
            <CDRConverter />
          </TabsContent>

          <TabsContent value="fir-analyser" className="mt-6">
            <AIFIRAnalyser />
          </TabsContent>

          <TabsContent value="social-search" className="mt-6">
            <SocialMediaSearch />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EagleAI;
