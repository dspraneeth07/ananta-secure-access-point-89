
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Users, Phone, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CDRNode {
  id: string;
  label: string;
  phone: string;
  role: 'Kingpin' | 'Peddler' | 'Middleman' | 'Customer' | 'Unknown';
  callCount: number;
  avgDuration: number;
  locations: string[];
  riskScore: number;
  x: number;
  y: number;
  imeiCount?: number;
  uniqueContacts?: number;
}

interface CDREdge {
  from: string;
  to: string;
  callCount: number;
  totalDuration: number;
  avgDuration: number;
  callTypes: string[];
  strength: number;
}

interface EnhancedCDRGraphProps {
  cdrData: string;
}

const EnhancedCDRGraph: React.FC<EnhancedCDRGraphProps> = ({ cdrData }) => {
  const [nodes, setNodes] = useState<CDRNode[]>([]);
  const [edges, setEdges] = useState<CDREdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<CDRNode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mockDataGenerated, setMockDataGenerated] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });

  // Generate mock network data when no CDR data is available
  const generateMockNetworkData = async () => {
    console.log('Generating mock network data with criminal profile locations...');
    
    try {
      // Fetch criminal profiles for mock locations
      const { data: criminals, error } = await supabase
        .from('cases')
        .select('name, phone_number, address, case_id')
        .not('name', 'is', null)
        .limit(10);

      if (error) {
        console.error('Error fetching criminal data:', error);
      }

      const mockPhones = [
        '9886788340', '9876543210', '8765432109', '7654321098', '6543210987',
        '9123456789', '8234567890', '7345678901', '6456789012', '5567890123',
        '9988776655', '8899776655', '7788996644'
      ];

      const mockLocations = criminals && criminals.length > 0 
        ? criminals.map(c => c.address).filter(addr => addr && addr.length > 5)
        : [
          'Bangalore Central Prison, Bangalore',
          'Hyderabad Narcotics Bureau, Hyderabad', 
          'Mumbai Crime Branch, Mumbai',
          'Delhi Police Station, New Delhi',
          'Chennai Central, Chennai',
          'Kolkata Police HQ, Kolkata',
          'Pune Cyber Crime, Pune',
          'Ahmedabad Detection, Ahmedabad'
        ];

      const mockNodes: CDRNode[] = mockPhones.map((phone, index) => {
        const roles: CDRNode['role'][] = ['Kingpin', 'Peddler', 'Middleman', 'Customer'];
        const role = roles[index % roles.length];
        
        // Generate realistic call patterns based on role
        let callCount, avgDuration, riskScore, uniqueContacts;
        
        switch (role) {
          case 'Kingpin':
            callCount = Math.floor(Math.random() * 50) + 80; // 80-130 calls
            avgDuration = Math.floor(Math.random() * 180) + 120; // 2-5 min calls
            riskScore = Math.floor(Math.random() * 20) + 80; // 80-100 risk
            uniqueContacts = Math.floor(Math.random() * 15) + 20; // 20-35 contacts
            break;
          case 'Peddler':
            callCount = Math.floor(Math.random() * 80) + 120; // 120-200 calls
            avgDuration = Math.floor(Math.random() * 60) + 30; // 30-90 sec calls
            riskScore = Math.floor(Math.random() * 15) + 70; // 70-85 risk
            uniqueContacts = Math.floor(Math.random() * 20) + 15; // 15-35 contacts
            break;
          case 'Middleman':
            callCount = Math.floor(Math.random() * 40) + 50; // 50-90 calls
            avgDuration = Math.floor(Math.random() * 120) + 180; // 3-5 min calls
            riskScore = Math.floor(Math.random() * 20) + 50; // 50-70 risk
            uniqueContacts = Math.floor(Math.random() * 10) + 8; // 8-18 contacts
            break;
          default: // Customer
            callCount = Math.floor(Math.random() * 20) + 10; // 10-30 calls
            avgDuration = Math.floor(Math.random() * 90) + 60; // 1-2.5 min calls
            riskScore = Math.floor(Math.random() * 30) + 20; // 20-50 risk
            uniqueContacts = Math.floor(Math.random() * 5) + 2; // 2-7 contacts
            break;
        }

        // Position nodes in a force-directed layout
        const angle = (index / mockPhones.length) * 2 * Math.PI;
        const radius = role === 'Kingpin' ? 150 : role === 'Middleman' ? 250 : 350;
        const centerX = svgDimensions.width / 2;
        const centerY = svgDimensions.height / 2;

        return {
          id: phone,
          label: phone.slice(-4),
          phone,
          role,
          callCount,
          avgDuration,
          locations: mockLocations.slice(index % 3, (index % 3) + 2),
          riskScore,
          imeiCount: Math.floor(Math.random() * 3) + 1,
          uniqueContacts,
          x: centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 100,
          y: centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 100
        };
      });

      // Generate mock edges between related nodes
      const mockEdges: CDREdge[] = [];
      
      for (let i = 0; i < mockNodes.length; i++) {
        for (let j = i + 1; j < mockNodes.length; j++) {
          // Create connections based on roles and proximity
          const node1 = mockNodes[i];
          const node2 = mockNodes[j];
          
          let connectionProbability = 0.1; // Base 10% chance
          
          // Higher probability for hierarchical connections
          if ((node1.role === 'Kingpin' && node2.role === 'Middleman') ||
              (node1.role === 'Middleman' && node2.role === 'Peddler') ||
              (node1.role === 'Peddler' && node2.role === 'Customer')) {
            connectionProbability = 0.7;
          }
          
          // Same role connections
          if (node1.role === node2.role) {
            connectionProbability = 0.3;
          }

          if (Math.random() < connectionProbability) {
            const callCount = Math.floor(Math.random() * 25) + 5;
            const totalDuration = callCount * (Math.random() * 180 + 30);
            
            mockEdges.push({
              from: node1.id,
              to: node2.id,
              callCount,
              totalDuration,
              avgDuration: totalDuration / callCount,
              callTypes: ['Outgoing', 'Incoming'],
              strength: Math.min(callCount / 10, 1)
            });
          }
        }
      }

      setNodes(mockNodes);
      setEdges(mockEdges);
      setMockDataGenerated(true);
      
      console.log(`Generated mock network: ${mockNodes.length} nodes, ${mockEdges.length} edges`);
      toast.success(`Mock network generated: ${mockNodes.length} nodes with criminal profile locations`);
      
    } catch (error) {
      console.error('Error generating mock data:', error);
      toast.error('Failed to generate mock network data');
    }
  };

  const parseCDRForNetwork = (data: string) => {
    console.log('Parsing CDR data for network analysis, data length:', data.length);
    
    if (!data || data.trim().length === 0) {
      return { nodes: [], edges: [] };
    }

    const lines = data.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 13) {
      console.log('Not enough lines for CDR format, generating mock data instead');
      return { nodes: [], edges: [] };
    }

    const callRecords: any[] = [];
    
    // Headers should be in row 11 (index 10), data starts from row 13 (index 12)
    const headerLine = lines[10];
    if (!headerLine || !headerLine.includes('Target /A PARTY NUMBER')) {
      console.log('Header not found in expected row 11, generating mock data');
      return { nodes: [], edges: [] };
    }

    // Parse data starting from row 13 (index 12)
    for (let i = 12; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line || line.length < 10) {
        continue;
      }
      
      const fields = line.split('\t').map(f => f.trim());
      if (fields.length >= 9) {
        callRecords.push({
          targetParty: fields[0] || '',
          callType: fields[1] || '',
          bPartyNumber: fields[3] || '',
          callDate: fields[6] || '',
          callTime: fields[7] || '',
          duration: parseInt(fields[8]) || 0,
          firstBTSLocation: fields[9] || '',
          lastBTSLocation: fields[11] || '',
          imei: fields[15] || '',
          roamingNetwork: fields[18] || ''
        });
      }
    }

    console.log('Parsed call records:', callRecords.length);

    if (callRecords.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Build network from CDR records
    const phoneStats = new Map();
    const edgeMap = new Map();

    callRecords.forEach(record => {
      const { targetParty, bPartyNumber, duration, callType, firstBTSLocation, imei } = record;
      
      if (!targetParty || !bPartyNumber) return;

      // Initialize phone stats
      [targetParty, bPartyNumber].forEach(party => {
        if (!phoneStats.has(party)) {
          phoneStats.set(party, {
            phone: party,
            totalCalls: 0,
            incomingCalls: 0,
            outgoingCalls: 0,
            totalDuration: 0,
            contacts: new Set(),
            locations: new Set(),
            imeis: new Set(),
            callTypes: new Set()
          });
        }
      });

      const statsA = phoneStats.get(targetParty);
      const statsB = phoneStats.get(bPartyNumber);

      // Update stats
      statsA.totalCalls++;
      statsA.contacts.add(bPartyNumber);
      statsA.totalDuration += duration;
      statsA.callTypes.add(callType);
      if (firstBTSLocation) statsA.locations.add(firstBTSLocation);
      if (imei) statsA.imeis.add(imei);

      statsB.totalCalls++;
      statsB.contacts.add(targetParty);
      if (firstBTSLocation) statsB.locations.add(firstBTSLocation);

      // Determine call direction and update counts
      if (callType.toLowerCase().includes('outgoing')) {
        statsA.outgoingCalls++;
        statsB.incomingCalls++;
      } else if (callType.toLowerCase().includes('incoming')) {
        statsA.incomingCalls++;
        statsB.outgoingCalls++;
      }

      // Create/update edge
      const edgeKey = [targetParty, bPartyNumber].sort().join('-');
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {
          from: targetParty,
          to: bPartyNumber,
          callCount: 1,
          totalDuration: duration,
          callTypes: [callType],
          strength: 1
        });
      } else {
        const edge = edgeMap.get(edgeKey);
        edge.callCount++;
        edge.totalDuration += duration;
        edge.callTypes.push(callType);
        edge.strength++;
      }
    });

    // Determine roles and create nodes
    const networkNodes: CDRNode[] = Array.from(phoneStats.entries()).map(([phone, stats], index) => {
      const contactCount = stats.contacts.size;
      const avgDuration = stats.totalCalls > 0 ? stats.totalDuration / stats.totalCalls : 0;
      const outgoingRatio = stats.totalCalls > 0 ? stats.outgoingCalls / stats.totalCalls : 0;

      // Role determination logic
      let role: CDRNode['role'] = 'Unknown';
      let riskScore = 20;

      if (contactCount >= 10 && avgDuration > 60 && outgoingRatio > 0.3 && outgoingRatio < 0.7) {
        role = 'Kingpin';
        riskScore = 85;
      } else if (contactCount >= 6 && outgoingRatio > 0.6 && avgDuration < 90) {
        role = 'Peddler';
        riskScore = 70;
      } else if (contactCount >= 3 && avgDuration > 120) {
        role = 'Middleman';
        riskScore = 60;
      } else {
        role = 'Customer';
        riskScore = 35;
      }

      // Position calculation
      const angle = (index / phoneStats.size) * 2 * Math.PI;
      const radius = Math.min(svgDimensions.width, svgDimensions.height) * 0.25;
      const centerX = svgDimensions.width / 2;
      const centerY = svgDimensions.height / 2;
      
      return {
        id: phone,
        label: phone.slice(-4),
        phone,
        role,
        callCount: stats.totalCalls,
        avgDuration,
        locations: Array.from(stats.locations),
        riskScore,
        imeiCount: stats.imeis.size,
        uniqueContacts: contactCount,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Create edges with calculated strengths
    const networkEdges: CDREdge[] = Array.from(edgeMap.values()).map(edge => ({
      ...edge,
      avgDuration: edge.totalDuration / edge.callCount,
      strength: Math.min(edge.callCount / 5, 1)
    }));

    return { nodes: networkNodes, edges: networkEdges };
  };

  const analyzeNetwork = async () => {
    setIsAnalyzing(true);
    
    try {
      if (!cdrData || cdrData.trim().length === 0) {
        console.log('No CDR data, generating mock network');
        await generateMockNetworkData();
        return;
      }

      const { nodes: networkNodes, edges: networkEdges } = parseCDRForNetwork(cdrData);
      
      if (networkNodes.length === 0) {
        console.log('No valid CDR data found, generating mock network');
        await generateMockNetworkData();
        return;
      }

      setNodes(networkNodes);
      setEdges(networkEdges);
      setMockDataGenerated(false);
      
      toast.success(`Network analysis complete: ${networkNodes.length} nodes, ${networkEdges.length} connections`);
      
    } catch (error) {
      console.error('Network analysis error:', error);
      toast.error('Failed to analyze network, generating mock data');
      await generateMockNetworkData();
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    analyzeNetwork();
  }, [cdrData]);

  const getRoleColor = (role: CDRNode['role']) => {
    switch (role) {
      case 'Kingpin': return '#dc2626'; // Red
      case 'Peddler': return '#ea580c'; // Orange
      case 'Middleman': return '#d97706'; // Amber
      case 'Customer': return '#16a34a'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  const getRoleIcon = (role: CDRNode['role']) => {
    switch (role) {
      case 'Kingpin': return '👑';
      case 'Peddler': return '📱';
      case 'Middleman': return '🤝';
      case 'Customer': return '👤';
      default: return '❓';
    }
  };

  const handleNodeClick = (node: CDRNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            CDR Network Analysis - Enhanced Parser {mockDataGenerated && '(Mock Data with Criminal Profiles)'}
            {isAnalyzing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockDataGenerated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                🔄 Displaying mock network data with criminal profile locations as hotspots since no valid CDR data was provided
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-red-600">{nodes.filter(n => n.role === 'Kingpin').length}</div>
              <div className="text-xs text-red-700">👑 Kingpins</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-orange-600">{nodes.filter(n => n.role === 'Peddler').length}</div>
              <div className="text-xs text-orange-700">📱 Peddlers</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-yellow-600">{nodes.filter(n => n.role === 'Middleman').length}</div>
              <div className="text-xs text-yellow-700">🤝 Middlemen</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">{nodes.filter(n => n.role === 'Customer').length}</div>
              <div className="text-xs text-green-700">👤 Customers</div>
            </div>
          </div>

          <Button 
            onClick={analyzeNetwork} 
            disabled={isAnalyzing}
            className="mb-4"
          >
            {isAnalyzing ? 'Analyzing Network...' : 'Refresh Network Analysis'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Network Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <svg
                ref={svgRef}
                width={svgDimensions.width}
                height={svgDimensions.height}
                className="border rounded-lg bg-white dark:bg-gray-900"
              >
                {/* Render edges */}
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <g key={`edge-${index}`}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#94a3b8"
                        strokeWidth={Math.max(1, edge.strength * 4)}
                        opacity={0.6}
                      />
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#64748b"
                        className="pointer-events-none"
                      >
                        {edge.callCount}
                      </text>
                    </g>
                  );
                })}

                {/* Render nodes */}
                {nodes.map((node) => {
                  const nodeSize = Math.max(12, Math.min(25, node.callCount / 5));
                  return (
                    <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={nodeSize}
                        fill={getRoleColor(node.role)}
                        stroke="white"
                        strokeWidth="2"
                        opacity={0.9}
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.label}
                      </text>
                      <text
                        x={node.x}
                        y={node.y - nodeSize - 8}
                        textAnchor="middle"
                        fontSize="16"
                        className="pointer-events-none"
                      >
                        {getRoleIcon(node.role)}
                      </text>
                      {/* Risk score indicator */}
                      <circle
                        cx={node.x + nodeSize - 5}
                        cy={node.y - nodeSize + 5}
                        r="8"
                        fill={node.riskScore > 70 ? '#dc2626' : node.riskScore > 50 ? '#f59e0b' : '#10b981'}
                        opacity={0.8}
                      />
                      <text
                        x={node.x + nodeSize - 5}
                        y={node.y - nodeSize + 9}
                        textAnchor="middle"
                        fontSize="8"
                        fill="white"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.riskScore}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Nodes:</span>
                  <Badge>{nodes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Connections:</span>
                  <Badge>{edges.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Avg Calls per Node:</span>
                  <Badge>{nodes.length > 0 ? Math.round(nodes.reduce((sum, n) => sum + n.callCount, 0) / nodes.length) : 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>High Risk Nodes:</span>
                  <Badge variant="destructive">{nodes.filter(n => n.riskScore > 70).length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Hotspot Locations:</span>
                  <Badge variant="secondary">{new Set(nodes.flatMap(n => n.locations)).size}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{getRoleIcon(selectedNode.role)}</span>
                  Node Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Phone:</strong> {selectedNode.phone}
                  </div>
                  <div>
                    <strong>Role:</strong> 
                    <Badge className="ml-2" style={{ backgroundColor: getRoleColor(selectedNode.role) }}>
                      {selectedNode.role}
                    </Badge>
                  </div>
                  <div>
                    <strong>Call Count:</strong> {selectedNode.callCount}
                  </div>
                  <div>
                    <strong>Avg Duration:</strong> {Math.round(selectedNode.avgDuration)}s
                  </div>
                  <div>
                    <strong>Risk Score:</strong> 
                    <Badge variant={selectedNode.riskScore > 70 ? "destructive" : selectedNode.riskScore > 40 ? "secondary" : "default"}>
                      {selectedNode.riskScore}/100
                    </Badge>
                  </div>
                  {selectedNode.uniqueContacts && (
                    <div>
                      <strong>Unique Contacts:</strong> {selectedNode.uniqueContacts}
                    </div>
                  )}
                  {selectedNode.imeiCount && (
                    <div>
                      <strong>IMEI Devices:</strong> {selectedNode.imeiCount}
                    </div>
                  )}
                  {selectedNode.locations.length > 0 && (
                    <div>
                      <strong>Locations:</strong>
                      <ul className="text-sm mt-1">
                        {selectedNode.locations.slice(0, 3).map((loc, i) => (
                          <li key={i} className="truncate">📍 {loc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Role Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>👑</span>
                  <strong>Kingpin:</strong> High contacts, balanced calls, command level
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <strong>Peddler:</strong> Many outgoing calls, street level operations
                </div>
                <div className="flex items-center gap-2">
                  <span>🤝</span>
                  <strong>Middleman:</strong> Moderate contacts, longer calls
                </div>
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <strong>Customer:</strong> Few contacts, end users
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCDRGraph;
