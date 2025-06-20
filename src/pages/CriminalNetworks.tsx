
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCriminals } from '@/data/mockCriminals';

type NetworkType = 'FIR' | 'MOBILE' | 'CO_ACCUSED' | null;

interface NetworkFilters {
  type: NetworkType;
  firNo: string;
  mobileNumber: string;
  imeiNumber: string;
  coAccusedName: string;
}

const CriminalNetworks = () => {
  const [selectedType, setSelectedType] = useState<NetworkType>(null);
  const [filters, setFilters] = useState<NetworkFilters>({
    type: null,
    firNo: '',
    mobileNumber: '',
    imeiNumber: '',
    coAccusedName: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = () => {
    setShowResults(true);
  };

  const getNetworkData = () => {
    let networkData = mockCriminals;

    if (filters.firNo) {
      networkData = networkData.filter(c => c.firNumber.toLowerCase().includes(filters.firNo.toLowerCase()));
    }
    if (filters.mobileNumber) {
      networkData = networkData.filter(c => c.phoneNumber.includes(filters.mobileNumber));
    }
    if (filters.imeiNumber) {
      networkData = networkData.filter(c => c.imei.includes(filters.imeiNumber));
    }

    return networkData;
  };

  const renderNetworkVisualization = () => {
    const networkData = getNetworkData();
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Criminal Network Map - 3D Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border flex items-center justify-center relative overflow-hidden">
            {/* World Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 800 400" className="w-full h-full">
                <path d="M100 100 Q150 50 200 100 T300 100" stroke="#3b82f6" strokeWidth="2" fill="none" />
                <path d="M300 100 Q350 150 400 100 T500 100" stroke="#3b82f6" strokeWidth="2" fill="none" />
                <path d="M500 100 Q550 50 600 100 T700 100" stroke="#3b82f6" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="text-center max-w-4xl z-10">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Interactive 3D Network Graph</h3>
              <p className="text-muted-foreground mb-6">
                Criminal network connections based on {selectedType === 'FIR' ? 'FIR linkages' : selectedType === 'MOBILE' ? 'Mobile/IMEI data' : 'Co-accused relationships'}
              </p>
              
              {/* Network Nodes */}
              <div className="relative">
                {/* Central Hub */}
                <div className="flex justify-center mb-8">
                  <div className="bg-red-500 text-white p-4 rounded-full shadow-lg border-4 border-red-600 transform hover:scale-110 transition-transform">
                    <div className="text-sm font-bold">Primary Hub</div>
                    <div className="text-xs">{networkData.length} Connections</div>
                  </div>
                </div>
                
                {/* Connection Lines with Animation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                    </marker>
                    <animate attributeName="stroke-dasharray" values="0,10;10,0;0,10" dur="3s" repeatCount="indefinite" />
                  </defs>
                  
                  <line x1="50%" y1="20%" x2="20%" y2="60%" stroke="#374151" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)">
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
                  </line>
                  <line x1="50%" y1="20%" x2="80%" y2="60%" stroke="#374151" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)">
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
                  </line>
                  <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#374151" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)">
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
                  </line>
                </svg>
                
                {/* Connected Nodes */}
                <div className="relative" style={{ zIndex: 2 }}>
                  <div className="flex justify-between items-end mb-8">
                    <div className="bg-yellow-400 text-black p-3 rounded-lg shadow-md border-2 border-yellow-500 transform hover:scale-105 transition-transform">
                      <div className="text-sm font-semibold">Location A</div>
                      <div className="text-xs">Financial Network</div>
                      <div className="text-xs">{Math.floor(networkData.length * 0.3)} Cases</div>
                    </div>
                    
                    <div className="bg-orange-400 text-black p-3 rounded-lg shadow-md border-2 border-orange-500 transform hover:scale-105 transition-transform">
                      <div className="text-sm font-semibold">Location B</div>
                      <div className="text-xs">Supply Chain</div>
                      <div className="text-xs">{Math.floor(networkData.length * 0.4)} Cases</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-purple-400 text-white p-3 rounded-lg shadow-md border-2 border-purple-500 transform hover:scale-105 transition-transform">
                      <div className="text-sm font-semibold">Location C</div>
                      <div className="text-xs">Communication Hub</div>
                      <div className="text-xs">{Math.floor(networkData.length * 0.3)} Cases</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criminal Networks</h1>
          <p className="text-muted-foreground">Network analysis and criminal connections with 3D visualization</p>
        </div>

        {/* Network Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === 'FIR' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedType('FIR')}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Generate based on FIR</CardTitle>
              <p className="text-muted-foreground">FIR-based network analysis</p>
            </CardHeader>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === 'MOBILE' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedType('MOBILE')}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Generate based on Mobile/IMEI</CardTitle>
              <p className="text-muted-foreground">Communication network analysis</p>
            </CardHeader>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === 'CO_ACCUSED' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedType('CO_ACCUSED')}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Generate based on Common Co-Accused</CardTitle>
              <p className="text-muted-foreground">Associate network analysis</p>
            </CardHeader>
          </Card>
        </div>

        {selectedType && (
          <>
            {/* Search Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Network Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {selectedType === 'FIR' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">FIR Number</label>
                      <Input
                        placeholder="Enter FIR number"
                        value={filters.firNo}
                        onChange={(e) => setFilters(prev => ({ ...prev, firNo: e.target.value }))}
                      />
                    </div>
                  )}
                  
                  {selectedType === 'MOBILE' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mobile Number</label>
                        <Input
                          placeholder="Enter mobile number"
                          value={filters.mobileNumber}
                          onChange={(e) => setFilters(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">IMEI Number</label>
                        <Input
                          placeholder="Enter IMEI number"
                          value={filters.imeiNumber}
                          onChange={(e) => setFilters(prev => ({ ...prev, imeiNumber: e.target.value }))}
                        />
                      </div>
                    </>
                  )}
                  
                  {selectedType === 'CO_ACCUSED' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Co-Accused Name</label>
                      <Input
                        placeholder="Enter co-accused name"
                        value={filters.coAccusedName}
                        onChange={(e) => setFilters(prev => ({ ...prev, coAccusedName: e.target.value }))}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-end">
                    <Button onClick={handleGenerate} className="w-full">
                      Generate Network
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Visualization */}
            {showResults && renderNetworkVisualization()}

            {/* Network Results Table */}
            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Network Analysis Results ({getNetworkData().length} connections found)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>FIR Number</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>IMEI</TableHead>
                        <TableHead>Connection Type</TableHead>
                        <TableHead>Strength</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getNetworkData().slice(0, 15).map((criminal, index) => (
                        <TableRow key={criminal.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{criminal.name}</TableCell>
                          <TableCell>{criminal.firNumber}</TableCell>
                          <TableCell>{criminal.district}</TableCell>
                          <TableCell>{criminal.phoneNumber}</TableCell>
                          <TableCell>{criminal.imei}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              {selectedType === 'FIR' ? 'FIR Link' : selectedType === 'MOBILE' ? 'Comm Link' : 'Associate'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${Math.random() * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{Math.floor(Math.random() * 100)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CriminalNetworks;
