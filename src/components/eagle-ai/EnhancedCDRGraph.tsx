
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Users, Phone, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });

  const parseCDRForNetwork = (data: string) => {
    console.log('Parsing CDR data for network analysis, data length:', data.length);
    
    if (!data || data.trim().length === 0) {
      toast.error('No CDR data available for network analysis');
      return { nodes: [], edges: [] };
    }

    const lines = data.split('\n').filter(line => line.trim());
    const callRecords: any[] = [];
    
    // Parse CDR data
    let dataStarted = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip header and info lines
      if (line.includes('Vodafone') || line.includes('MSISDN') || 
          line.includes('Report Type') || line.includes('From Date') ||
          line.includes('Till Date') || line.includes('----') || !line) {
        continue;
      }
      
      // Detect data start
      if (line.includes('Target') && line.includes('PARTY')) {
        dataStarted = true;
        continue;
      }
      
      if (!dataStarted) continue;
      
      const fields = line.split('\t').map(f => f.trim());
      if (fields.length >= 8) {
        callRecords.push({
          partyA: fields[0] || '',
          callType: fields[1] || '',
          partyB: fields[3] || '',
          date: fields[6] || '',
          time: fields[7] || '',
          duration: parseInt(fields[8]) || 0,
          location: fields[9] || fields[10] || '',
          imei: fields[15] || '',
          roamingNetwork: fields[18] || ''
        });
      }
    }

    console.log('Parsed call records:', callRecords.length);

    if (callRecords.length === 0) {
      toast.warning('No valid call records found in CDR data');
      return { nodes: [], edges: [] };
    }

    // Analyze call patterns to build network
    const phoneStats = new Map();
    const edgeMap = new Map();

    callRecords.forEach(record => {
      const { partyA, partyB, duration, callType, location } = record;
      
      if (!partyA || !partyB) return;

      // Update party A stats
      if (!phoneStats.has(partyA)) {
        phoneStats.set(partyA, {
          phone: partyA,
          totalCalls: 0,
          incomingCalls: 0,
          outgoingCalls: 0,
          totalDuration: 0,
          avgDuration: 0,
          contacts: new Set(),
          locations: new Set(),
          callTypes: new Set()
        });
      }

      // Update party B stats
      if (!phoneStats.has(partyB)) {
        phoneStats.set(partyB, {
          phone: partyB,
          totalCalls: 0,
          incomingCalls: 0,
          outgoingCalls: 0,
          totalDuration: 0,
          avgDuration: 0,
          contacts: new Set(),
          locations: new Set(),
          callTypes: new Set()
        });
      }

      const statsA = phoneStats.get(partyA);
      const statsB = phoneStats.get(partyB);

      // Update call counts and contacts
      statsA.totalCalls++;
      statsA.contacts.add(partyB);
      statsA.totalDuration += duration;
      statsA.callTypes.add(callType);
      if (location) statsA.locations.add(location);

      statsB.totalCalls++;
      statsB.contacts.add(partyA);
      if (location) statsB.locations.add(location);

      // Determine call direction
      if (callType.toLowerCase().includes('outgoing') || callType.toLowerCase().includes('out')) {
        statsA.outgoingCalls++;
        statsB.incomingCalls++;
      } else if (callType.toLowerCase().includes('incoming') || callType.toLowerCase().includes('inc')) {
        statsA.incomingCalls++;
        statsB.outgoingCalls++;
      }

      // Create edge
      const edgeKey = `${partyA}-${partyB}`;
      const reverseEdgeKey = `${partyB}-${partyA}`;
      
      if (!edgeMap.has(edgeKey) && !edgeMap.has(reverseEdgeKey)) {
        edgeMap.set(edgeKey, {
          from: partyA,
          to: partyB,
          callCount: 1,
          totalDuration: duration,
          callTypes: [callType],
          strength: 1
        });
      } else {
        const edge = edgeMap.get(edgeKey) || edgeMap.get(reverseEdgeKey);
        if (edge) {
          edge.callCount++;
          edge.totalDuration += duration;
          edge.callTypes.push(callType);
          edge.strength++;
        }
      }
    });

    // Calculate average durations and roles
    phoneStats.forEach(stats => {
      stats.avgDuration = stats.totalCalls > 0 ? stats.totalDuration / stats.totalCalls : 0;
    });

    // Determine roles based on call patterns
    const determineRole = (stats: any): CDRNode['role'] => {
      const contactCount = stats.contacts.size;
      const avgDuration = stats.avgDuration;
      const outgoingRatio = stats.totalCalls > 0 ? stats.outgoingCalls / stats.totalCalls : 0;

      // Kingpin: High contact count, moderate duration, balanced calls
      if (contactCount >= 8 && avgDuration > 30 && outgoingRatio > 0.3 && outgoingRatio < 0.7) {
        return 'Kingpin';
      }
      // Peddler: High outgoing calls, many contacts, shorter calls
      else if (contactCount >= 5 && outgoingRatio > 0.6 && avgDuration < 60) {
        return 'Peddler';
      }
      // Middleman: Moderate contacts, longer calls, balanced direction
      else if (contactCount >= 3 && avgDuration > 60 && outgoingRatio > 0.2 && outgoingRatio < 0.8) {
        return 'Middleman';
      }
      // Customer: Few contacts, mostly incoming or outgoing
      else if (contactCount <= 4 && (outgoingRatio < 0.3 || outgoingRatio > 0.8)) {
        return 'Customer';
      }
      else {
        return 'Unknown';
      }
    };

    // Calculate risk scores
    const calculateRiskScore = (stats: any, role: string): number => {
      let score = 0;
      
      // Base score by role
      switch (role) {
        case 'Kingpin': score += 90; break;
        case 'Peddler': score += 75; break;
        case 'Middleman': score += 60; break;
        case 'Customer': score += 30; break;
        default: score += 20;
      }
      
      // Adjust by contact count
      score += Math.min(stats.contacts.size * 3, 30);
      
      // Adjust by call frequency
      score += Math.min(stats.totalCalls * 0.5, 20);
      
      return Math.min(score, 100);
    };

    // Create nodes
    const networkNodes: CDRNode[] = Array.from(phoneStats.entries()).map(([phone, stats], index) => {
      const role = determineRole(stats);
      const riskScore = calculateRiskScore(stats, role);
      
      // Position nodes in a circle
      const angle = (index / phoneStats.size) * 2 * Math.PI;
      const radius = Math.min(svgDimensions.width, svgDimensions.height) * 0.3;
      const centerX = svgDimensions.width / 2;
      const centerY = svgDimensions.height / 2;
      
      return {
        id: phone,
        label: phone.slice(-4), // Show last 4 digits
        phone,
        role,
        callCount: stats.totalCalls,
        avgDuration: stats.avgDuration,
        locations: Array.from(stats.locations),
        riskScore,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Create edges with calculated strengths
    const networkEdges: CDREdge[] = Array.from(edgeMap.values()).map(edge => ({
      ...edge,
      avgDuration: edge.totalDuration / edge.callCount,
      strength: Math.min(edge.callCount / 5, 1) // Normalize strength
    }));

    console.log('Generated network:', networkNodes.length, 'nodes,', networkEdges.length, 'edges');
    return { nodes: networkNodes, edges: networkEdges };
  };

  const analyzeNetwork = async () => {
    if (!cdrData || cdrData.trim().length === 0) {
      toast.error('No CDR data available. Please upload a CDR file first.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { nodes: networkNodes, edges: networkEdges } = parseCDRForNetwork(cdrData);
      
      if (networkNodes.length === 0) {
        toast.warning('No network connections found in the CDR data');
        setNodes([]);
        setEdges([]);
        return;
      }

      setNodes(networkNodes);
      setEdges(networkEdges);
      
      toast.success(`Network analysis complete: ${networkNodes.length} nodes, ${networkEdges.length} connections`);
      
    } catch (error) {
      console.error('Network analysis error:', error);
      toast.error('Failed to analyze network from CDR data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (cdrData && cdrData.trim().length > 0) {
      analyzeNetwork();
    }
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

  if (!cdrData || cdrData.trim().length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">Upload CDR data to generate network analysis</p>
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
            CDR Network Analysis - Real-time Graph Generation
            {isAnalyzing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            disabled={isAnalyzing || !cdrData}
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
                        strokeWidth={Math.max(1, edge.strength * 3)}
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
                {nodes.map((node) => (
                  <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={Math.max(15, node.callCount / 5)}
                      fill={getRoleColor(node.role)}
                      stroke="white"
                      strokeWidth="2"
                      opacity={0.8}
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
                      y={node.y - 25}
                      textAnchor="middle"
                      fontSize="16"
                      className="pointer-events-none"
                    >
                      {getRoleIcon(node.role)}
                    </text>
                  </g>
                ))}
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
                  {selectedNode.locations.length > 0 && (
                    <div>
                      <strong>Locations:</strong>
                      <ul className="text-sm mt-1">
                        {selectedNode.locations.slice(0, 3).map((loc, i) => (
                          <li key={i} className="truncate">• {loc}</li>
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
                  <strong>Kingpin:</strong> High contacts, balanced calls
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <strong>Peddler:</strong> Many outgoing calls, short duration
                </div>
                <div className="flex items-center gap-2">
                  <span>🤝</span>
                  <strong>Middleman:</strong> Moderate contacts, long calls
                </div>
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <strong>Customer:</strong> Few contacts, specific pattern
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
