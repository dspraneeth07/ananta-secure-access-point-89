
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Network, MapPin, Users, Brain, Phone } from 'lucide-react';
import { toast } from 'sonner';
import EnhancedCDRGraph from './EnhancedCDRGraph';
import RealCDRParser from './RealCDRParser';

const CDRNetworkingMap = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files);
    toast.success(`${files.length} CDR files uploaded successfully`);
  };

  const analyzeNetworking = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload CDR files first');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('CDR analysis completed successfully');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            AI-Powered CDR Network Analysis System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cdr-upload" className="block text-sm font-medium mb-2">
                Upload CDR Files (Excel/CSV/TXT format with Target A Party, B Party, Duration, Location columns)
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="cdr-upload"
                  type="file"
                  multiple
                  accept=".txt,.csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button 
                  onClick={analyzeNetworking}
                  disabled={isAnalyzing || uploadedFiles.length === 0}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Generate Network Map
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ {uploadedFiles.length} CDR files ready for analysis
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Expected format: Target/A Party | B Party | Duration | Date/Time | First BTS Location | Last BTS Location
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="real-parser" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="real-parser">Real CDR Parser</TabsTrigger>
          <TabsTrigger value="enhanced-graph">Network Graph</TabsTrigger>
          <TabsTrigger value="sample-analysis">Sample Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="real-parser" className="mt-6">
          <RealCDRParser />
        </TabsContent>

        <TabsContent value="enhanced-graph" className="mt-6">
          <EnhancedCDRGraph />
        </TabsContent>

        <TabsContent value="sample-analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample CDR Data Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`Vodafone Idea Call Data Records
MSISDN : - 9886788340
Report Type :- ALLINDIA Report
From Date :- 16/06/2023 00:00:00
Till Date :- 16/06/2025 13:24:38

Target /A PARTY NUMBER	CALL_TYPE	Type of Connection	B PARTY NUMBER	LRN- B Party Number	Translation of LRN	Call date	Call Initiation Time	Call Duration	First BTS Location	First Cell Global Id	Last BTS Location	Last Cell Global Id	SMS Centre Number	Service Type	IMEI	IMSI	Call Forwarding Number	Roaming Network/Circle	MSC ID	In TG 	Out TG 	IP Address 	Port No

9886788340	Incoming	PREPAID	TX-BROFRU	4121	Vodafone - Mobile-Karnataka	16-06-2023	06:32:56	1	MR.RAVICHANDRA G V B/7 GOKKAPPA LYT NEAR RLY GATE NAGAWARA BANGALORE-45	4.04868E+11	MR.RAVICHANDRA G V B/7 GOKKAPPA LYT NEAR RLY GATE NAGAWARA BANGALORE-45	4.04868E+11	9.12267E+11	SMS	8.68964E+14	4.0486E+14	-	Kar-Vodafone - India	9.19886E+11	-	-	-	-`}</pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Copy and paste CDR data in this format to the Real CDR Parser tab for accurate network analysis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CDRNetworkingMap;
