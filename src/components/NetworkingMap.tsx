
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Criminal {
  id: string;
  name: string;
  firNumber: string;
}

interface NetworkingMapProps {
  criminal: Criminal;
  onBack: () => void;
}

const NetworkingMap: React.FC<NetworkingMapProps> = ({ criminal, onBack }) => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Criminal Network Map - {criminal.name}</h1>
            <p className="text-muted-foreground">Network analysis and criminal connections</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dependency Graph - Criminal Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] bg-white dark:bg-gray-900 rounded-lg border flex items-center justify-center">
              <div className="text-center max-w-4xl">
                <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Interactive Network Graph</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  This shows the criminal network connections, associates, and their relationships
                </p>
                
                {/* Network Visualization */}
                <div className="relative">
                  {/* Central Node */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-red-500 text-white p-4 rounded-full shadow-lg border-4 border-red-600">
                      <div className="text-sm font-bold">{criminal.name}</div>
                      <div className="text-xs">Primary Accused</div>
                    </div>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {/* Lines connecting central node to associates */}
                    <line x1="50%" y1="20%" x2="20%" y2="60%" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="50%" y1="20%" x2="80%" y2="60%" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    
                    {/* Arrow marker definition */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                      </marker>
                    </defs>
                  </svg>
                  
                  {/* Associate Nodes */}
                  <div className="relative" style={{ zIndex: 2 }}>
                    <div className="flex justify-between items-end mb-8">
                      <div className="bg-yellow-400 text-black p-3 rounded-lg shadow-md border-2 border-yellow-500">
                        <div className="text-sm font-semibold">Jane Smith</div>
                        <div className="text-xs">Associate</div>
                        <div className="text-xs">Role: Financier</div>
                      </div>
                      
                      <div className="bg-orange-400 text-black p-3 rounded-lg shadow-md border-2 border-orange-500">
                        <div className="text-sm font-semibold">Bob Wilson</div>
                        <div className="text-xs">Co-accused</div>
                        <div className="text-xs">Role: Transporter</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="bg-purple-400 text-white p-3 rounded-lg shadow-md border-2 border-purple-500">
                        <div className="text-sm font-semibold">Alice Johnson</div>
                        <div className="text-xs">Supplier</div>
                        <div className="text-xs">Connection: Drug Supply Chain</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="font-semibold text-blue-800 dark:text-blue-200">Connection Types</div>
                    <div className="text-blue-600 dark:text-blue-300">
                      • Financial Relations<br/>
                      • Drug Supply Chain<br/>
                      • Communication Network
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="font-semibold text-green-800 dark:text-green-200">Network Strength</div>
                    <div className="text-green-600 dark:text-green-300">
                      • Direct Associates: 3<br/>
                      • Indirect Links: 8<br/>
                      • Active Connections: 5
                    </div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <div className="font-semibold text-red-800 dark:text-red-200">Risk Assessment</div>
                    <div className="text-red-600 dark:text-red-300">
                      • High Risk Network<br/>
                      • Multi-state Operations<br/>
                      • Organized Structure
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                  Connections based on FIR: {criminal.firNumber} | Last Updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NetworkingMap;
