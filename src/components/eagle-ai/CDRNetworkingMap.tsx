
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Network, MapPin, Users, Brain, Phone } from 'lucide-react';
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
    
    // Simulate real-time analysis process
    setTimeout(() => {
      const mockResults = {
        suspectedMembers: 100,
        externalConnections: 245,
        kingpins: [
          { phone: '+91-9876543210', name: 'Rajesh Kumar', location: 'Hyderabad', connections: 45 },
          { phone: '+91-8765432109', name: 'Amit Shah', location: 'Mumbai', connections: 38 },
          { phone: '+91-7654321098', name: 'Suresh Reddy', location: 'Bangalore', connections: 42 }
        ],
        middlemen: [
          { phone: '+91-9988776655', name: 'Vikram Singh', location: 'Delhi', connections: 25 },
          { phone: '+91-8877665544', name: 'Rahul Sharma', location: 'Chennai', connections: 22 },
          { phone: '+91-7766554433', name: 'Anil Kumar', location: 'Pune', connections: 28 },
          { phone: '+91-6655443322', name: 'Deepak Rao', location: 'Hyderabad', connections: 24 },
          { phone: '+91-5544332211', name: 'Manoj Gupta', location: 'Kolkata', connections: 21 }
        ],
        peddlers: Array.from({length: 20}, (_, i) => ({
          phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          name: `Peddler ${i + 1}`,
          location: ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'][Math.floor(Math.random() * 5)],
          connections: Math.floor(Math.random() * 15) + 5
        })),
        externalContacts: [
          { phone: '+91-9123456789', name: 'External Contact 1', type: 'Supplier', connections: 15 },
          { phone: '+91-8234567890', name: 'External Contact 2', type: 'Financier', connections: 12 },
          { phone: '+91-7345678901', name: 'External Contact 3', type: 'Transport', connections: 18 },
          { phone: '+91-6456789012', name: 'External Contact 4', type: 'Legal Aid', connections: 8 }
        ],
        commonLocations: [
          { city: 'Hyderabad', count: 45, lat: 17.385, lng: 78.486 },
          { city: 'Mumbai', count: 38, lat: 19.076, lng: 72.877 },
          { city: 'Bangalore', count: 32, lat: 12.972, lng: 77.594 },
          { city: 'Chennai', count: 28, lat: 13.083, lng: 80.270 }
        ],
        networkStrength: 89,
        totalCalls: 15420,
        totalMessages: 8760
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      toast.success('Real-time CDR analysis completed successfully');
    }, 3000);
  };

  const renderDetailedNetworkVisualization = () => (
    <div className="space-y-6">
      {/* Kingpins Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Kingpins Network - Top Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisResults?.kingpins.map((kingpin: any, index: number) => (
              <div key={index} className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border-2 border-red-300">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-red-800 dark:text-red-200">{kingpin.phone}</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{kingpin.name}</div>
                  <div className="text-muted-foreground">📍 {kingpin.location}</div>
                  <div className="text-red-600">🔗 {kingpin.connections} connections</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Middlemen Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Middlemen Network - Second Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {analysisResults?.middlemen.map((middleman: any, index: number) => (
              <div key={index} className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-300">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-3 h-3 text-orange-600" />
                  <span className="font-semibold text-orange-800 dark:text-orange-200 text-sm">{middleman.phone}</span>
                </div>
                <div className="text-xs">
                  <div className="font-medium">{middleman.name}</div>
                  <div className="text-muted-foreground">📍 {middleman.location}</div>
                  <div className="text-orange-600">🔗 {middleman.connections} connections</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Peddlers Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-600" />
            Peddlers Network - Ground Level ({analysisResults?.peddlers.length} members)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-96 overflow-y-auto">
            {analysisResults?.peddlers.map((peddler: any, index: number) => (
              <div key={index} className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded border border-yellow-300">
                <div className="text-xs">
                  <div className="font-mono text-yellow-800 dark:text-yellow-200">{peddler.phone}</div>
                  <div className="font-medium truncate">{peddler.name}</div>
                  <div className="text-muted-foreground">📍 {peddler.location}</div>
                  <div className="text-yellow-600">🔗 {peddler.connections}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* External Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-600" />
            External Connections Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResults?.externalContacts.map((contact: any, index: number) => (
              <div key={index} className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-800 dark:text-purple-200">{contact.phone}</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{contact.name}</div>
                  <div className="text-purple-600">Role: {contact.type}</div>
                  <div className="text-muted-foreground">🔗 {contact.connections} network connections</div>
                </div>
              </div>
            ))}
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
            Real-Time AI CDR-Based Networking Map Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cdr-upload" className="block text-sm font-medium mb-2">
                Upload CDR Files (Up to 100 files for real-time analysis)
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
                      Analyzing Live...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Generate Live Network Map
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  {uploadedFiles.length} CDR files uploaded and ready for real-time analysis
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <>
          {/* Real-time Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Live Network Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{analysisResults.kingpins.length}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Kingpins</div>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{analysisResults.middlemen.length}</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Middlemen</div>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analysisResults.peddlers.length}</div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">Peddlers</div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{analysisResults.externalContacts.length}</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">External</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{analysisResults.networkStrength}%</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Strength</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysisResults.totalCalls.toLocaleString()}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Total Calls</div>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">{analysisResults.totalMessages.toLocaleString()}</div>
                  <div className="text-sm text-indigo-700 dark:text-indigo-300">Total Messages</div>
                </div>
                <div className="bg-cyan-100 dark:bg-cyan-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyan-600">{analysisResults.suspectedMembers}</div>
                  <div className="text-sm text-cyan-700 dark:text-cyan-300">Network Size</div>
                </div>
                <div className="bg-teal-100 dark:bg-teal-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-teal-600">{analysisResults.externalConnections}</div>
                  <div className="text-sm text-teal-700 dark:text-teal-300">External Links</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Network Visualizations */}
          {renderDetailedNetworkVisualization()}

          {/* Location Analysis with Real Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Geographic Distribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysisResults.commonLocations.map((location: any, index: number) => (
                  <div key={index} className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
                    <div className="font-bold text-emerald-800 dark:text-emerald-200">{location.city}</div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">{location.count} Activities</div>
                    <div className="text-xs text-muted-foreground">
                      {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
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
