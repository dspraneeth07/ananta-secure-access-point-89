
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Brain, Network, FileText } from 'lucide-react';
import { mockCriminals } from '@/data/mockCriminals';
import { toast } from 'sonner';

const AIFIRAnalyser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCriminal, setSelectedCriminal] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [criminalSummary, setCriminalSummary] = useState('');
  const [networkAnalysis, setNetworkAnalysis] = useState<any>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    const results = mockCriminals.filter(criminal => 
      criminal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      criminal.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      criminal.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      criminal.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      criminal.phoneNumber.includes(searchQuery) ||
      criminal.drugType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      criminal.district.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    toast.success(`Found ${results.length} matching records`);
  };

  const generateSummary = async (criminal: any) => {
    setIsAnalyzing(true);
    setSelectedCriminal(criminal);

    // Simulate AI analysis using Gemini API
    setTimeout(() => {
      const mockSummary = `
🔍 **Criminal Profile Summary for ${criminal.name}**

**🚨 Risk Assessment: HIGH**

**📊 Case Overview:**
- **Primary Suspect**: ${criminal.name} (${criminal.age} years)
- **Criminal Network Role**: ${criminal.personCategory}
- **Active Cases**: ${criminal.noCrimes} registered cases
- **Current Status**: ${criminal.presentStatus}

**🧬 Criminal Pattern Analysis:**
- **Drug Operation**: Specialized in ${criminal.drugType} trafficking
- **Geographic Footprint**: Operating across ${criminal.district}, ${criminal.state}
- **Communication Profile**: Primary contact ${criminal.phoneNumber}
- **Identity Verification**: Multiple ID documents on record

**🔗 Network Connections:**
- **Family Ties**: Son of ${criminal.fatherName}
- **Operational Base**: ${criminal.address}
- **Jurisdiction**: Under ${criminal.policeStation} supervision

**⚠️ Threat Level Indicators:**
- Multiple active cases suggest ongoing criminal activity
- Cross-district operations indicate organized network
- Current ${criminal.presentStatus.toLowerCase()} status requires immediate attention

**📈 Recommended Actions:**
1. Enhanced surveillance of known associates
2. Monitor communication channels
3. Coordinate with ${criminal.policeStation} for real-time updates
4. Cross-reference with other active ${criminal.drugType} cases

**🎯 Intelligence Priority: URGENT**
      `;
      
      setCriminalSummary(mockSummary);
      setIsAnalyzing(false);
      toast.success('Criminal profile analysis completed');
    }, 2000);
  };

  const generateNetworkAnalysis = async () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const mockNetwork = {
        totalCriminals: mockCriminals.length,
        connectedCases: 45,
        crossStateOperations: 12,
        majorNetworks: [
          { name: 'Hyderabad Network', members: 25, status: 'Active', threat: 'High' },
          { name: 'Bangalore Network', members: 18, status: 'Under Investigation', threat: 'Medium' },
          { name: 'Chennai Network', members: 15, status: 'Disrupted', threat: 'Low' },
          { name: 'Mumbai Network', members: 22, status: 'Active', threat: 'High' }
        ],
        drugTypes: {
          'Ganja': 45,
          'Heroin': 23,
          'Cocaine': 18,
          'MDMA': 12,
          'Opium': 8
        }
      };
      
      setNetworkAnalysis(mockNetwork);
      setIsAnalyzing(false);
      toast.success('Network analysis completed');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            AI FIR Analyser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Search by name, FIR number, phone, email, crime number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
            <Button 
              onClick={generateNetworkAnalysis}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isAnalyzing}
            >
              <Network className="w-4 h-4" />
              Network Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length} found)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>FIR Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Drug Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.slice(0, 10).map((criminal) => (
                  <TableRow key={criminal.id}>
                    <TableCell className="font-medium">{criminal.name}</TableCell>
                    <TableCell>{criminal.firNumber}</TableCell>
                    <TableCell>{criminal.phoneNumber}</TableCell>
                    <TableCell>{criminal.district}</TableCell>
                    <TableCell>{criminal.drugType}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        criminal.presentStatus === 'Arrested'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {criminal.presentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => generateSummary(criminal)}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2"
                      >
                        <Brain className="w-3 h-3" />
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedCriminal && criminalSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              AI-Generated Criminal Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">{criminalSummary}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {networkAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Criminal Network Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{networkAnalysis.totalCriminals}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Total Criminals</div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{networkAnalysis.connectedCases}</div>
                    <div className="text-sm text-red-700 dark:text-red-300">Connected Cases</div>
                  </div>
                </div>
                
                {networkAnalysis.majorNetworks.map((network: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{network.name}</div>
                      <div className="text-sm text-muted-foreground">{network.members} members</div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs ${
                        network.threat === 'High' ? 'bg-red-100 text-red-800' :
                        network.threat === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {network.threat} Risk
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{network.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drug Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(networkAnalysis.drugTypes).map(([drug, count]) => (
                  <div key={drug} className="flex justify-between items-center">
                    <span className="font-medium">{drug}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count as number / Math.max(...Object.values(networkAnalysis.drugTypes))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold w-8">{count as number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIFIRAnalyser;
