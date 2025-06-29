
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileSpreadsheet, Network, MapPin, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface CDRRecord {
  targetParty: string;
  callType: string;
  connectionType: string;
  bPartyNumber: string;
  lrnBParty: string;
  translationLRN: string;
  callDate: string;
  callInitiationTime: string;
  callDuration: number;
  firstBTSLocation: string;
  firstCellGlobalId: string;
  lastBTSLocation: string;
  lastCellGlobalId: string;
  smsCentreNumber: string;
  serviceType: string;
  imei: string;
  imsi: string;
  callForwardingNumber: string;
  roamingNetwork: string;
  mscId: string;
  inTG: string;
  outTG: string;
  ipAddress: string;
  portNo: string;
}

interface NetworkNode {
  id: string;
  phone: string;
  role: 'kingpin' | 'middleman' | 'peddler';
  connections: number;
  totalCallTime: number;
  locations: Set<string>;
  callFrequency: { [key: string]: number };
  callDates: string[];
  avgCallDuration: number;
  networkScore: number;
}

interface ConnectionEdge {
  from: string;
  to: string;
  weight: number;
  totalDuration: number;
  callCount: number;
  locations: string[];
}

const RealCDRParser = () => {
  const [cdrData, setCdrData] = useState('');
  const [parsedRecords, setParsedRecords] = useState<CDRRecord[]>([]);
  const [networkAnalysis, setNetworkAnalysis] = useState<NetworkNode[]>([]);
  const [connectionEdges, setConnectionEdges] = useState<ConnectionEdge[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const parseCDRData = () => {
    if (!cdrData.trim()) {
      toast.error('Please paste CDR data');
      return;
    }

    setIsAnalyzing(true);

    try {
      const lines = cdrData.split('\n').filter(line => line.trim());
      const records: CDRRecord[] = [];

      // Find header line
      let headerIndex = -1;
      let dataStartIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('Target /A PARTY NUMBER') && line.includes('B PARTY NUMBER')) {
          headerIndex = i;
          dataStartIndex = i + 2; // Skip header and separator line
          break;
        }
      }

      if (headerIndex === -1) {
        toast.error('CDR header not found. Please check the format.');
        setIsAnalyzing(false);
        return;
      }

      // Parse data rows
      for (let i = dataStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines and separator lines
        if (!line || line.includes('----') || line.includes('Vodafone Idea')) {
          continue;
        }

        // Split by tabs
        const fields = line.split('\t').map(field => field.trim());
        
        if (fields.length >= 24) { // Ensure we have all required fields
          const record: CDRRecord = {
            targetParty: fields[0] || '',
            callType: fields[1] || '',
            connectionType: fields[2] || '',
            bPartyNumber: fields[3] || '',
            lrnBParty: fields[4] || '',
            translationLRN: fields[5] || '',
            callDate: fields[6] || '',
            callInitiationTime: fields[7] || '',
            callDuration: parseInt(fields[8]) || 0,
            firstBTSLocation: fields[9] || '',
            firstCellGlobalId: fields[10] || '',
            lastBTSLocation: fields[11] || '',
            lastCellGlobalId: fields[12] || '',
            smsCentreNumber: fields[13] || '',
            serviceType: fields[14] || '',
            imei: fields[15] || '',
            imsi: fields[16] || '',
            callForwardingNumber: fields[17] || '',
            roamingNetwork: fields[18] || '',
            mscId: fields[19] || '',
            inTG: fields[20] || '',
            outTG: fields[21] || '',
            ipAddress: fields[22] || '',
            portNo: fields[23] || ''
          };
          records.push(record);
        }
      }

      setParsedRecords(records);
      
      if (records.length > 0) {
        analyzeNetworkFromRecords(records);
        toast.success(`Successfully parsed ${records.length} CDR records and generated network map`);
      } else {
        toast.error('No valid CDR records found. Please check the data format.');
      }
    } catch (error) {
      console.error('CDR parsing error:', error);
      toast.error('Failed to parse CDR data. Please check the format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeNetworkFromRecords = (records: CDRRecord[]) => {
    const nodes: { [key: string]: NetworkNode } = {};
    const edges: { [key: string]: ConnectionEdge } = {};

    // Process each CDR record
    records.forEach(record => {
      const aParty = record.targetParty;
      const bParty = record.bPartyNumber;
      const duration = record.callDuration;
      const location = record.firstBTSLocation;
      const callDateTime = `${record.callDate} ${record.callInitiationTime}`;

      // Initialize nodes
      [aParty, bParty].forEach(party => {
        if (!nodes[party]) {
          nodes[party] = {
            id: party,
            phone: party,
            role: 'peddler',
            connections: 0,
            totalCallTime: 0,
            locations: new Set(),
            callFrequency: {},
            callDates: [],
            avgCallDuration: 0,
            networkScore: 0
          };
        }
      });

      // Update node data
      nodes[aParty].totalCallTime += duration;
      nodes[bParty].totalCallTime += duration;
      nodes[aParty].callDates.push(callDateTime);
      nodes[bParty].callDates.push(callDateTime);

      if (location) {
        nodes[aParty].locations.add(location);
        nodes[bParty].locations.add(location);
      }

      // Update call frequency
      if (!nodes[aParty].callFrequency[bParty]) {
        nodes[aParty].callFrequency[bParty] = 0;
      }
      if (!nodes[bParty].callFrequency[aParty]) {
        nodes[bParty].callFrequency[aParty] = 0;
      }
      nodes[aParty].callFrequency[bParty]++;
      nodes[bParty].callFrequency[aParty]++;

      // Create connection edge
      const edgeKey = [aParty, bParty].sort().join('-');
      if (!edges[edgeKey]) {
        edges[edgeKey] = {
          from: aParty,
          to: bParty,
          weight: 0,
          totalDuration: 0,
          callCount: 0,
          locations: []
        };
      }
      edges[edgeKey].weight++;
      edges[edgeKey].totalDuration += duration;
      edges[edgeKey].callCount++;
      if (location && !edges[edgeKey].locations.includes(location)) {
        edges[edgeKey].locations.push(location);
      }
    });

    // Calculate final node metrics and determine roles
    Object.values(nodes).forEach(node => {
      node.connections = Object.keys(node.callFrequency).length;
      node.avgCallDuration = node.totalCallTime / Math.max(node.connections, 1);
      
      // Network scoring algorithm
      const connectionWeight = node.connections * 0.3;
      const callTimeWeight = (node.totalCallTime / 3600) * 0.2; // Convert to hours
      const locationWeight = node.locations.size * 0.2;
      const frequencyWeight = Object.values(node.callFrequency).reduce((a, b) => a + b, 0) * 0.3;
      
      node.networkScore = connectionWeight + callTimeWeight + locationWeight + frequencyWeight;

      // Determine role based on network analysis
      if (node.connections >= 8 && node.avgCallDuration < 120) {
        node.role = 'peddler'; // Many short calls = street level
      } else if (node.connections <= 3 && node.avgCallDuration > 300) {
        node.role = 'kingpin'; // Few long calls = command level
      } else {
        node.role = 'middleman'; // Moderate connections
      }
    });

    setNetworkAnalysis(Object.values(nodes).sort((a, b) => b.networkScore - a.networkScore));
    setConnectionEdges(Object.values(edges));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'kingpin': return 'bg-red-100 text-red-800 border-red-300';
      case 'middleman': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'peddler': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderNetworkVisualization = () => {
    if (networkAnalysis.length === 0) return null;

    const kingpins = networkAnalysis.filter(n => n.role === 'kingpin');
    const middlemen = networkAnalysis.filter(n => n.role === 'middleman');
    const peddlers = networkAnalysis.filter(n => n.role === 'peddler');

    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-blue-200 dark:border-gray-600 overflow-hidden">
        {/* Network Hierarchy Visualization */}
        <div className="absolute inset-0 p-4">
          {/* Kingpins Layer */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
            {kingpins.map((node, index) => (
              <div key={node.id} className="relative">
                <div className="bg-red-500 text-white p-4 rounded-full shadow-xl border-4 border-red-600 min-w-[80px] text-center">
                  <Phone className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs font-bold">{node.phone.slice(-4)}</div>
                  <div className="text-xs">KINGPIN</div>
                  <div className="text-xs">{node.connections}↔</div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center">
                  <div className="font-semibold">{Math.round(node.totalCallTime/60)}min</div>
                </div>
              </div>
            ))}
          </div>

          {/* Middlemen Layer */}
          <div className="absolute top-[200px] left-1/2 transform -translate-x-1/2 flex space-x-4">
            {middlemen.map((node, index) => (
              <div key={node.id} className="relative">
                <div className="bg-orange-400 text-white p-3 rounded-lg shadow-lg border-2 border-orange-500 min-w-[70px] text-center">
                  <Phone className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs font-bold">{node.phone.slice(-4)}</div>
                  <div className="text-xs">MIDDLEMAN</div>
                  <div className="text-xs">{node.connections}↔</div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center">
                  <div className="font-semibold">{Math.round(node.totalCallTime/60)}min</div>
                </div>
              </div>
            ))}
          </div>

          {/* Peddlers Layer */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-3 max-w-[90%]">
            {peddlers.map((node, index) => (
              <div key={node.id} className="relative">
                <div className="bg-yellow-400 text-black p-2 rounded border-2 border-yellow-500 min-w-[50px] text-center">
                  <Phone className="w-3 h-3 mx-auto mb-1" />
                  <div className="text-xs font-bold">{node.phone.slice(-4)}</div>
                  <div className="text-xs">PEDDLER</div>
                  <div className="text-xs">{node.connections}↔</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <div className="text-xs font-bold mb-2">Network Hierarchy</div>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span>Kingpins ({kingpins.length})</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
              <span>Middlemen ({middlemen.length})</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
              <span>Peddlers ({peddlers.length})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Real-Time CDR Data Parser & Network Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cdr-data">Paste Vodafone Idea CDR Data (Tab-separated format)</Label>
              <Textarea
                id="cdr-data"
                placeholder="Paste your complete CDR data here including headers..."
                value={cdrData}
                onChange={(e) => setCdrData(e.target.value)}
                rows={12}
                className="font-mono text-xs"
              />
            </div>
            
            <Button 
              onClick={parseCDRData}
              disabled={isAnalyzing || !cdrData.trim()}
              className="flex items-center gap-2 w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Parsing CDR Data & Generating Network...
                </>
              ) : (
                <>
                  <Network className="w-4 h-4" />
                  Parse CDR & Generate Network Map
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {parsedRecords.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Network Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {renderNetworkVisualization()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center border">
                  <div className="text-2xl font-bold text-blue-600">{parsedRecords.length}</div>
                  <div className="text-sm text-blue-700">Total CDR Records</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center border">
                  <div className="text-2xl font-bold text-red-600">
                    {networkAnalysis.filter(n => n.role === 'kingpin').length}
                  </div>
                  <div className="text-sm text-red-700">Kingpins Detected</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center border">
                  <div className="text-2xl font-bold text-orange-600">
                    {networkAnalysis.filter(n => n.role === 'middleman').length}
                  </div>
                  <div className="text-sm text-orange-700">Middlemen Detected</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center border">
                  <div className="text-2xl font-bold text-yellow-600">
                    {networkAnalysis.filter(n => n.role === 'peddler').length}
                  </div>
                  <div className="text-sm text-yellow-700">Peddlers Detected</div>
                </div>
              </div>

              <div className="space-y-3">
                {networkAnalysis.slice(0, 10).map((node) => (
                  <div key={node.id} className={`p-4 rounded-lg border-2 ${getRoleColor(node.role)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-lg font-mono">{node.phone}</div>
                        <div className="text-sm font-semibold uppercase tracking-wider">{node.role}</div>
                        <div className="text-sm mt-1">
                          <span className="inline-flex items-center gap-1 mr-3">
                            <Phone className="w-3 h-3" />
                            {node.connections} connections
                          </span>
                          <span className="inline-flex items-center gap-1 mr-3">
                            <Clock className="w-3 h-3" />
                            {Math.round(node.totalCallTime / 60)} min total
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {node.locations.size} locations
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {Math.round(node.networkScore)}
                        </div>
                        <div className="text-xs text-gray-600">Risk Score</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Primary Locations: {Array.from(node.locations).slice(0, 2).join(', ')}
                      {node.locations.size > 2 && ` +${node.locations.size - 2} more`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parsed CDR Records Sample</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">Target Party</th>
                      <th className="border p-2 text-left">B Party</th>
                      <th className="border p-2 text-left">Call Type</th>
                      <th className="border p-2 text-left">Duration</th>
                      <th className="border p-2 text-left">Date/Time</th>
                      <th className="border p-2 text-left">First BTS Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRecords.slice(0, 10).map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2 font-mono">{record.targetParty}</td>
                        <td className="border p-2 font-mono">{record.bPartyNumber}</td>
                        <td className="border p-2">{record.callType}</td>
                        <td className="border p-2">{record.callDuration}s</td>
                        <td className="border p-2">{record.callDate} {record.callInitiationTime}</td>
                        <td className="border p-2 text-xs">{record.firstBTSLocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedRecords.length > 10 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Showing first 10 of {parsedRecords.length} records
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RealCDRParser;
