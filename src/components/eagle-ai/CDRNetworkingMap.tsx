
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Network, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

const CDRNetworkingMap = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

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
    
    // Simulate analysis process
    setTimeout(() => {
      const mockResults = {
        suspectedMembers: 100,
        externalConnections: 245,
        kingpins: 3,
        middlemen: 15,
        peddlers: 82,
        commonLocations: ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai'],
        networkStrength: 89
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      toast.success('CDR analysis completed successfully');
    }, 3000);
  };

  const renderNetworkVisualization = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Suspected Members Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Suspected Members Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border-2 border-dashed border-red-200 flex items-center justify-center relative overflow-hidden">
            {/* Triangular Hierarchy */}
            <div className="text-center">
              {/* Kingpins at top */}
              <div className="mb-8">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full inline-block shadow-lg">
                  <div className="text-sm font-bold">KINGPINS</div>
                  <div className="text-xs">{analysisResults?.kingpins} Members</div>
                </div>
              </div>
              
              {/* Middlemen in middle */}
              <div className="mb-8 flex justify-center space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-orange-500 text-white px-3 py-2 rounded-lg shadow-md">
                    <div className="text-xs font-semibold">MIDDLEMAN {i}</div>
                    <div className="text-xs">{Math.floor(analysisResults?.middlemen / 3)} Members</div>
                  </div>
                ))}
              </div>
              
              {/* Peddlers at bottom */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({length: 8}, (_, i) => (
                  <div key={i} className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                    <div className="font-medium">PEDDLER</div>
                    <div>{Math.floor(analysisResults?.peddlers / 8)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Connections Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            External Connections Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
              <div className="bg-blue-600 text-white p-4 rounded-full inline-block shadow-lg mb-6">
                <div className="text-sm font-bold">EXTERNAL NETWORK</div>
                <div className="text-xs">{analysisResults?.externalConnections} Connections</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {['Financial', 'Supply Chain', 'Communication'].map((type, i) => (
                  <div key={i} className="bg-purple-400 text-white p-3 rounded-lg shadow-md">
                    <div className="text-xs font-semibold">{type}</div>
                    <div className="text-xs">{Math.floor(analysisResults?.externalConnections / 3)} Links</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            AI CDR-Based Networking Map Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cdr-upload" className="block text-sm font-medium mb-2">
                Upload CDR Files (Up to 100 files)
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="cdr-upload"
                  type="file"
                  multiple
                  accept=".txt,.csv,.xlsx"
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
                  {uploadedFiles.length} CDR files uploaded and ready for analysis
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <>
          {/* Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{analysisResults.suspectedMembers}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Suspected Members</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysisResults.externalConnections}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">External Connections</div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{analysisResults.networkStrength}%</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Network Strength</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{analysisResults.commonLocations.length}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Key Locations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Visualizations */}
          {renderNetworkVisualization()}

          {/* Location Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysisResults.commonLocations.map((location: string, index: number) => (
                  <div key={index} className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
                    <div className="font-semibold text-yellow-700 dark:text-yellow-300">{location}</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      {Math.floor(Math.random() * 50 + 10)} Activities
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CDRNetworkingMap;
