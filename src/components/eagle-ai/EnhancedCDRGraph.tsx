
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Phone, Users, MapPin, AlertTriangle } from 'lucide-react';

interface CDRRecord {
  partyA: string;
  partyB: string;
  duration: number;
  timestamp: string;
  location: string;
  cellTower: string;
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
}

interface NetworkEdge {
  from: string;
  to: string;
  weight: number;
  frequency: number;
}

const EnhancedCDRGraph = () => {
  const [networkData, setNetworkData] = useState<{
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  }>({ nodes: [], edges: [] });
  
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Simulate CDR data analysis
  useEffect(() => {
    generateNetworkFromCDR();
  }, []);

  const generateNetworkFromCDR = () => {
    // Simulated CDR analysis - this would process real CDR files
    const mockCDRData: CDRRecord[] = [
      { partyA: '+91-9876543210', partyB: '+91-8765432109', duration: 300, timestamp: '2024-01-15 14:30', location: 'Hyderabad', cellTower: 'HYD001' },
      { partyA: '+91-9876543210', partyB: '+91-7654321098', duration: 180, timestamp: '2024-01-15 15:45', location: 'Hyderabad', cellTower: 'HYD002' },
      { partyA: '+91-8765432109', partyB: '+91-6543210987', duration: 420, timestamp: '2024-01-15 16:20', location: 'Warangal', cellTower: 'WGL001' },
      { partyA: '+91-7654321098', partyB: '+91-5432109876', duration: 90, timestamp: '2024-01-15 17:10', location: 'Hyderabad', cellTower: 'HYD003' },
      { partyA: '+91-9876543210', partyB: '+91-4321098765', duration: 600, timestamp: '2024-01-15 18:00', location: 'Hyderabad', cellTower: 'HYD001' },
      { partyA: '+91-8765432109', partyB: '+91-3210987654', duration: 240, timestamp: '2024-01-15 19:30', location: 'Nizamabad', cellTower: 'NZB001' },
      { partyA: '+91-6543210987', partyB: '+91-2109876543', duration: 150, timestamp: '2024-01-15 20:15', location: 'Warangal', cellTower: 'WGL002' },
      { partyA: '+91-5432109876', partyB: '+91-1098765432', duration: 320, timestamp: '2024-01-15 21:00', location: 'Khammam', cellTower: 'KHM001' }
    ];

    // Analyze call patterns to determine hierarchy
    const callFrequency: { [key: string]: { [key: string]: number } } = {};
    const totalCallTime: { [key: string]: number } = {};
    const uniqueContacts: { [key: string]: Set<string> } = {};
    const locations: { [key: string]: Set<string> } = {};

    // Process CDR data
    mockCDRData.forEach(record => {
      // Track call frequency between parties
      if (!callFrequency[record.partyA]) callFrequency[record.partyA] = {};
      if (!callFrequency[record.partyB]) callFrequency[record.partyB] = {};
      
      callFrequency[record.partyA][record.partyB] = (callFrequency[record.partyA][record.partyB] || 0) + 1;
      callFrequency[record.partyB][record.partyA] = (callFrequency[record.partyB][record.partyA] || 0) + 1;

      // Track total call time
      totalCallTime[record.partyA] = (totalCallTime[record.partyA] || 0) + record.duration;
      totalCallTime[record.partyB] = (totalCallTime[record.partyB] || 0) + record.duration;

      // Track unique contacts
      if (!uniqueContacts[record.partyA]) uniqueContacts[record.partyA] = new Set();
      if (!uniqueContacts[record.partyB]) uniqueContacts[record.partyB] = new Set();
      
      uniqueContacts[record.partyA].add(record.partyB);
      uniqueContacts[record.partyB].add(record.partyA);

      // Track locations
      if (!locations[record.partyA]) locations[record.partyA] = new Set();
      if (!locations[record.partyB]) locations[record.partyB] = new Set();
      
      locations[record.partyA].add(record.location);
      locations[record.partyB].add(record.location);
    });

    // Determine hierarchy based on network analysis
    const nodes: NetworkNode[] = Object.keys(uniqueContacts).map(phone => {
      const connectionCount = uniqueContacts[phone].size;
      const callTime = totalCallTime[phone] || 0;
      const locationCount = locations[phone]?.size || 0;
      
      // Risk scoring algorithm
      const riskScore = (connectionCount * 0.4) + (callTime / 100 * 0.3) + (locationCount * 0.3);
      
      let role: 'kingpin' | 'middleman' | 'peddler';
      if (connectionCount <= 2 && callTime > 500) {
        role = 'kingpin'; // Few contacts but long calls (command structure)
      } else if (connectionCount > 5) {
        role = 'peddler'; // Many contacts (street level)
      } else {
        role = 'middleman'; // Moderate contacts
      }

      return {
        id: phone,
        phone,
        name: `Contact ${phone.slice(-4)}`,
        role,
        connections: connectionCount,
        totalCallTime: callTime,
        locations: Array.from(locations[phone] || []),
        riskScore: Math.round(riskScore)
      };
    });

    // Generate edges based on call frequency
    const edges: NetworkEdge[] = [];
    Object.keys(callFrequency).forEach(fromPhone => {
      Object.keys(callFrequency[fromPhone]).forEach(toPhone => {
        if (fromPhone < toPhone) { // Avoid duplicate edges
          edges.push({
            from: fromPhone,
            to: toPhone,
            weight: callFrequency[fromPhone][toPhone],
            frequency: callFrequency[fromPhone][toPhone]
          });
        }
      });
    });

    setNetworkData({ nodes, edges });
    setAnalysisComplete(true);
  };

  const renderNetworkGraph = () => {
    const kingpins = networkData.nodes.filter(n => n.role === 'kingpin');
    const middlemen = networkData.nodes.filter(n => n.role === 'middleman');
    const peddlers = networkData.nodes.filter(n => n.role === 'peddler');

    return (
      <div className="relative w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg border overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {/* Draw connections */}
          {networkData.edges.map((edge, index) => {
            const fromNode = networkData.nodes.find(n => n.id === edge.from);
            const toNode = networkData.nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            // Calculate positions based on role hierarchy
            const getNodePosition = (node: NetworkNode) => {
              if (node.role === 'kingpin') return { x: 50, y: 20 };
              if (node.role === 'middleman') return { 
                x: 20 + (middlemen.indexOf(node) * 60), 
                y: 50 
              };
              return { 
                x: 10 + (peddlers.indexOf(node) * 30), 
                y: 80 
              };
            };

            const fromPos = getNodePosition(fromNode);
            const toPos = getNodePosition(toNode);
            
            return (
              <g key={index}>
                <line
                  x1={`${fromPos.x}%`}
                  y1={`${fromPos.y}%`}
                  x2={`${toPos.x}%`}
                  y2={`${toPos.y}%`}
                  stroke={edge.weight > 2 ? '#ef4444' : '#6b7280'}
                  strokeWidth={Math.max(1, edge.weight)}
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={`${(fromPos.x + toPos.x) / 2}%`}
                  y={`${(fromPos.y + toPos.y) / 2}%`}
                  fill="#374151"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {edge.frequency}
                </text>
              </g>
            );
          })}
          
          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
            </marker>
          </defs>
        </svg>

        {/* Render nodes */}
        <div className="relative w-full h-full" style={{ zIndex: 2 }}>
          {/* Kingpins */}
          <div className="absolute top-[15%] left-[45%] transform -translate-x-1/2">
            {kingpins.map((node, index) => (
              <div
                key={node.id}
                className="bg-red-500 text-white p-3 rounded-full shadow-lg border-4 border-red-600 mb-2"
                style={{ marginLeft: index * 20 }}
              >
                <div className="text-xs font-bold text-center">
                  <Phone className="w-3 h-3 mx-auto mb-1" />
                  {node.phone.slice(-4)}
                </div>
                <div className="text-xs text-center">Kingpin</div>
                <div className="text-xs text-center">{node.connections} contacts</div>
              </div>
            ))}
          </div>

          {/* Middlemen */}
          <div className="absolute top-[45%] left-0 right-0 flex justify-center space-x-4">
            {middlemen.map((node) => (
              <div
                key={node.id}
                className="bg-orange-400 text-white p-2 rounded-lg shadow-md border-2 border-orange-500"
              >
                <div className="text-xs font-bold text-center">
                  <Phone className="w-3 h-3 mx-auto mb-1" />
                  {node.phone.slice(-4)}
                </div>
                <div className="text-xs text-center">Middleman</div>
                <div className="text-xs text-center">{node.connections} contacts</div>
                <div className="text-xs text-center">{node.locations.join(', ')}</div>
              </div>
            ))}
          </div>

          {/* Peddlers */}
          <div className="absolute top-[75%] left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
            {peddlers.map((node) => (
              <div
                key={node.id}
                className="bg-yellow-400 text-black p-1 rounded border border-yellow-500"
              >
                <div className="text-xs font-bold text-center">
                  <Phone className="w-2 h-2 mx-auto mb-1" />
                  {node.phone.slice(-4)}
                </div>
                <div className="text-xs text-center">Peddler</div>
                <div className="text-xs text-center">{node.connections}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow-lg">
          <div className="text-xs font-bold mb-1">Network Hierarchy</div>
          <div className="flex items-center text-xs mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            Kingpins (Few contacts, Long calls)
          </div>
          <div className="flex items-center text-xs mb-1">
            <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
            Middlemen (Moderate contacts)
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
            Peddlers (Many contacts)
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
            <Network className="w-5 h-5" />
            CDR-Based Criminal Network Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysisComplete ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Network Statistics</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded text-center">
                    <div className="font-bold text-red-600">{networkData.nodes.filter(n => n.role === 'kingpin').length}</div>
                    <div>Kingpins</div>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded text-center">
                    <div className="font-bold text-orange-600">{networkData.nodes.filter(n => n.role === 'middleman').length}</div>
                    <div>Middlemen</div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded text-center">
                    <div className="font-bold text-yellow-600">{networkData.nodes.filter(n => n.role === 'peddler').length}</div>
                    <div>Peddlers</div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded text-center">
                    <div className="font-bold text-blue-600">{networkData.edges.length}</div>
                    <div>Connections</div>
                  </div>
                </div>
              </div>
              {renderNetworkGraph()}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Analyzing CDR data and generating network map...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Network Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {networkData.nodes.map((node) => (
                <div key={node.id} className={`p-3 rounded-lg border ${
                  node.role === 'kingpin' ? 'bg-red-50 border-red-200' :
                  node.role === 'middleman' ? 'bg-orange-50 border-orange-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">{node.phone}</div>
                      <div className="text-sm text-gray-600 capitalize">{node.role}</div>
                      <div className="text-sm">Risk Score: {node.riskScore}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div>{node.connections} connections</div>
                      <div>{Math.round(node.totalCallTime / 60)} min total</div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{node.locations.join(', ')}</span>
                      </div>
                    </div>
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
