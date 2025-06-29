import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Phone, Users, MapPin, AlertTriangle, Clock, Signal } from 'lucide-react';
import { toast } from 'sonner';

interface CDRRecord {
  partyA: string;
  partyB: string;
  duration: number;
  timestamp: string;
  location: string;
  callType: string;
}

interface NetworkNode {
  id: string;
  phone: string;
  name: string;
  role: 'kingpin' | 'middleman' | 'peddler';
  connections: number;
  totalCallTime: number;
  locations: string[];
  riskScore: number;
  callFrequency: number;
  avgCallDuration: number;
}

interface NetworkEdge {
  from: string;
  to: string;
  weight: number;
  frequency: number;
  totalDuration: number;
}

interface EnhancedCDRGraphProps {
  cdrData?: string;
}

const EnhancedCDRGraph: React.FC<EnhancedCDRGraphProps> = ({ cdrData }) => {
  const [networkData, setNetworkData] = useState<{
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  }>({ nodes: [], edges: [] });
  
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cdrData && cdrData.trim()) {
      processCDRData(cdrData);
    }
  }, [cdrData]);

  const parseCDRLine = (line: string): CDRRecord | null => {
    try {
      const fields = line.split('\t').map(field => field.trim());
      
      if (fields.length >= 9) {
        const partyA = fields[0];
        const partyB = fields[3];
        const duration = parseInt(fields[8]) || 0;
        const callDate = fields[6];
        const callTime = fields[7];
        const location = fields[9] || fields[10] || '';
        const callType = fields[1] || '';

        // Enhanced validation
        if (partyA && partyB && partyA !== partyB && partyA.length >= 10 && partyB.length >= 10) {
          return {
            partyA: partyA.replace(/[^\d]/g, ''),
            partyB: partyB.replace(/[^\d]/g, ''),
            duration,
            timestamp: `${callDate} ${callTime}`,
            location: location.substring(0, 100), // Limit location length
            callType
          };
        }
      }
    } catch (error) {
      console.error('Error parsing CDR line:', error);
    }
    return null;
  };

  const processCDRData = (rawData: string) => {
    setIsProcessing(true);
    
    try {
      const lines = rawData.split('\n').filter(line => line.trim());
      const records: CDRRecord[] = [];

      // Find data start (skip headers)
      let dataStartIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('Target /A PARTY NUMBER') || line.includes('PARTY NUMBER')) {
          dataStartIndex = i + 1;
          break;
        }
      }

      // If no header found, assume data starts from beginning
      if (dataStartIndex === -1) {
        dataStartIndex = 0;
      }

      // Parse each data line
      for (let i = dataStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines and separator lines
        if (!line || line.includes('----') || line.includes('Vodafone') || line.includes('MSISDN')) {
          continue;
        }

        const record = parseCDRLine(line);
        if (record) {
          records.push(record);
        }
      }

      if (records.length > 0) {
        generateNetworkFromRecords(records);
        toast.success(`Processed ${records.length} CDR records`);
      } else {
        toast.error('No valid CDR records found in the uploaded data');
      }
    } catch (error) {
      console.error('CDR processing error:', error);
      toast.error('Failed to process CDR data');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateNetworkFromRecords = (records: CDRRecord[]) => {
    console.log(`Processing ${records.length} CDR records for network analysis`);
    
    const callFrequency: { [key: string]: { [key: string]: number } } = {};
    const totalCallTime: { [key: string]: number } = {};
    const uniqueContacts: { [key: string]: Set<string> } = {};
    const locations: { [key: string]: Set<string> } = {};
    const callCounts: { [key: string]: number } = {};
    const callTypes: { [key: string]: { incoming: number; outgoing: number } } = {};
    const timePatterns: { [key: string]: { morning: number; afternoon: number; evening: number; night: number } } = {};

    records.forEach(record => {
      const { partyA, partyB, duration, location, callType, timestamp } = record;

      [partyA, partyB].forEach(party => {
        if (!callFrequency[party]) callFrequency[party] = {};
        if (!uniqueContacts[party]) uniqueContacts[party] = new Set();
        if (!locations[party]) locations[party] = new Set();
        if (!totalCallTime[party]) totalCallTime[party] = 0;
        if (!callCounts[party]) callCounts[party] = 0;
        if (!callTypes[party]) callTypes[party] = { incoming: 0, outgoing: 0 };
        if (!timePatterns[party]) timePatterns[party] = { morning: 0, afternoon: 0, evening: 0, night: 0 };
      });

      // Enhanced call frequency tracking
      callFrequency[partyA][partyB] = (callFrequency[partyA][partyB] || 0) + 1;
      callFrequency[partyB][partyA] = (callFrequency[partyB][partyA] || 0) + 1;

      // Track call types
      if (callType.toLowerCase().includes('incoming')) {
        callTypes[partyA].incoming++;
        callTypes[partyB].outgoing++;
      } else {
        callTypes[partyA].outgoing++;
        callTypes[partyB].incoming++;
      }

      // Time pattern analysis
      const hour = parseInt(timestamp.split(' ')[1]?.split(':')[0] || '12');
      const timeSlot = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : hour < 22 ? 'evening' : 'night';
      timePatterns[partyA][timeSlot]++;
      timePatterns[partyB][timeSlot]++;

      // Update totals
      totalCallTime[partyA] += duration;
      totalCallTime[partyB] += duration;
      callCounts[partyA]++;
      callCounts[partyB]++;

      uniqueContacts[partyA].add(partyB);
      uniqueContacts[partyB].add(partyA);

      if (location && location.length > 5) {
        locations[partyA].add(location);
        locations[partyB].add(location);
      }
    });

    // Enhanced role determination algorithm
    const nodes: NetworkNode[] = Object.keys(uniqueContacts).map(phone => {
      const connectionCount = uniqueContacts[phone].size;
      const callTime = totalCallTime[phone] || 0;
      const totalCalls = callCounts[phone] || 1;
      const avgDuration = callTime / totalCalls;
      const locationCount = locations[phone]?.size || 0;
      const callTypeRatio = callTypes[phone] ? callTypes[phone].outgoing / (callTypes[phone].incoming + 1) : 1;
      
      // Advanced role determination with multiple factors
      let role: 'kingpin' | 'middleman' | 'peddler';
      
      // Kingpins: Few contacts, long calls, high outgoing ratio, multiple locations
      if (connectionCount <= 5 && avgDuration > 180 && callTypeRatio > 1.5 && locationCount > 2) {
        role = 'kingpin';
      } 
      // Peddlers: Many contacts, short calls, balanced ratio
      else if (connectionCount >= 8 && avgDuration < 90 && callTypeRatio < 2) {
        role = 'peddler';
      } 
      // Middlemen: Moderate everything
      else {
        role = 'middleman';
      }

      // Enhanced risk scoring with multiple factors
      const connectionWeight = Math.min(connectionCount * 0.3, 15);
      const callTimeWeight = Math.min((callTime / 3600) * 0.25, 10);
      const locationWeight = Math.min(locationCount * 0.2, 8);
      const frequencyWeight = Math.min(totalCalls * 0.15, 12);
      const durationWeight = Math.min(avgDuration / 30, 5);
      
      const riskScore = connectionWeight + callTimeWeight + locationWeight + frequencyWeight + durationWeight;

      return {
        id: phone,
        phone,
        name: `User ${phone.slice(-4)}`,
        role,
        connections: connectionCount,
        totalCallTime: callTime,
        locations: Array.from(locations[phone] || []).slice(0, 5),
        riskScore: Math.round(riskScore),
        callFrequency: totalCalls,
        avgCallDuration: Math.round(avgDuration)
      };
    });

    // Generate enhanced edges with more data
    const edges: NetworkEdge[] = [];
    const processedPairs = new Set<string>();

    Object.keys(callFrequency).forEach(fromPhone => {
      Object.keys(callFrequency[fromPhone]).forEach(toPhone => {
        const pairKey = [fromPhone, toPhone].sort().join('-');
        
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          
          const frequency = callFrequency[fromPhone][toPhone];
          const totalDuration = records
            .filter(r => 
              (r.partyA === fromPhone && r.partyB === toPhone) ||
              (r.partyA === toPhone && r.partyB === fromPhone)
            )
            .reduce((sum, r) => sum + r.duration, 0);

          if (frequency >= 2) { // Only include significant connections
            edges.push({
              from: fromPhone,
              to: toPhone,
              weight: Math.min(frequency, 20),
              frequency,
              totalDuration
            });
          }
        }
      });
    });

    const sortedNodes = nodes
      .filter(node => node.connections >= 2) // Filter out isolated nodes
      .sort((a, b) => b.riskScore - a.riskScore);

    setNetworkData({ 
      nodes: sortedNodes, 
      edges: edges.filter(edge => 
        sortedNodes.find(n => n.id === edge.from) && 
        sortedNodes.find(n => n.id === edge.to)
      )
    });
    setAnalysisComplete(true);

    console.log(`Network analysis complete: ${sortedNodes.length} nodes, ${edges.length} edges`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'kingpin': return 'bg-red-100 text-red-800 border-red-300';
      case 'middleman': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'peddler': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderNetworkGraph = () => {
    if (networkData.nodes.length === 0) return null;

    const kingpins = networkData.nodes.filter(n => n.role === 'kingpin');
    const middlemen = networkData.nodes.filter(n => n.role === 'middleman');
    const peddlers = networkData.nodes.filter(n => n.role === 'peddler');

    return (
      <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-blue-200 dark:border-gray-600 overflow-hidden">
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

  if (isProcessing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Processing CDR data and analyzing all parameters...</p>
            <p className="text-sm text-gray-600 mt-2">Analyzing call patterns, locations, timing, and network hierarchy</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cdrData || !cdrData.trim()) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Network className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Upload CDR files to generate comprehensive network analysis</p>
            <p className="text-sm text-gray-500 mt-2">All CSV parameters will be analyzed for intelligence insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Advanced CDR Network Analysis - All Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysisComplete && networkData.nodes.length > 0 ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Enhanced Network Intelligence</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded text-center">
                    <div className="font-bold text-red-600">{networkData.nodes.filter(n => n.role === 'kingpin').length}</div>
                    <div>Command Level</div>
                    <div className="text-xs text-gray-600">Kingpins</div>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded text-center">
                    <div className="font-bold text-orange-600">{networkData.nodes.filter(n => n.role === 'middleman').length}</div>
                    <div>Middle Tier</div>
                    <div className="text-xs text-gray-600">Middlemen</div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded text-center">
                    <div className="font-bold text-yellow-600">{networkData.nodes.filter(n => n.role === 'peddler').length}</div>
                    <div>Street Level</div>
                    <div className="text-xs text-gray-600">Peddlers</div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded text-center">
                    <div className="font-bold text-blue-600">{networkData.edges.length}</div>
                    <div>Active Links</div>
                    <div className="text-xs text-gray-600">Connections</div>
                  </div>
                </div>
              </div>
              {renderNetworkGraph()}
            </>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <p className="text-gray-600">No valid network data found. Please check CDR format.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisComplete && networkData.nodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Network Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {networkData.nodes.slice(0, 10).map((node) => (
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
                          <Users className="w-3 h-3" />
                          {node.callFrequency} calls
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {node.locations.length} locations
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {node.riskScore}
                      </div>
                      <div className="text-xs text-gray-600">Risk Score</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Avg: {node.avgCallDuration}s
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Primary Locations: {node.locations.slice(0, 2).join(', ')}
                    {node.locations.length > 2 && ` +${node.locations.length - 2} more`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedCDRGraph;
