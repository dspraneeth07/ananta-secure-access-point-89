
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileSpreadsheet, Network } from 'lucide-react';
import { toast } from 'sonner';

interface CDRRecord {
  targetParty: string;
  callType: string;
  connectionType: string;
  bPartyNumber: string;
  callDate: string;
  callInitiationTime: string;
  callDuration: number;
  firstBTSLocation: string;
  lastBTSLocation: string;
}

interface NetworkNode {
  id: string;
  phone: string;
  role: 'kingpin' | 'middleman' | 'peddler';
  connections: number;
  totalCallTime: number;
  locations: Set<string>;
  callFrequency: { [key: string]: number };
}

const RealCDRParser = () => {
  const [cdrData, setCdrData] = useState('');
  const [parsedRecords, setParsedRecords] = useState<CDRRecord[]>([]);
  const [networkAnalysis, setNetworkAnalysis] = useState<NetworkNode[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const parseCDRData = () => {
    if (!cdrData.trim()) {
      toast.error('Please paste CDR data');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Parse the CDR data based on your format
      const lines = cdrData.split('\n').filter(line => line.trim());
      const records: CDRRecord[] = [];

      // Find the header line and data lines
      let dataStartIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Target /A PARTY NUMBER') || lines[i].includes('CALL_TYPE')) {
          dataStartIndex = i + 1;
          break;
        }
      }

      if (dataStartIndex === -1) {
        // Try to parse without header
        dataStartIndex = lines.findIndex(line => 
          line.includes('Incoming') || line.includes('Outgoing') || 
          line.match(/^\d{10}/) || line.match(/^91\d{10}/)
        );
      }

      // Parse each data line
      for (let i = dataStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.includes('---') || line.includes('Vodafone')) continue;

        // Split by tabs or multiple spaces
        const fields = line.split(/\t+|\s{2,}/).filter(f => f.trim());
        
        if (fields.length >= 10) {
          const record: CDRRecord = {
            targetParty: fields[0] || '',
            callType: fields[1] || '',
            connectionType: fields[2] || '',
            bPartyNumber: fields[3] || '',
            callDate: fields[6] || '',
            callInitiationTime: fields[7] || '',
            callDuration: parseInt(fields[8]) || 0,
            firstBTSLocation: fields[9] || '',
            lastBTSLocation: fields[11] || fields[9] || ''
          };
          records.push(record);
        }
      }

      setParsedRecords(records);
      
      if (records.length > 0) {
        analyzeNetwork(records);
        toast.success(`Parsed ${records.length} CDR records successfully`);
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

  const analyzeNetwork = (records: CDRRecord[]) => {
    const nodes: { [key: string]: NetworkNode } = {};

    // Analyze each record
    records.forEach(record => {
      const aParty = record.targetParty;
      const bParty = record.bPartyNumber;
      const duration = record.callDuration;
      const location = record.firstBTSLocation;

      // Initialize nodes if they don't exist
      if (!nodes[aParty]) {
        nodes[aParty] = {
          id: aParty,
          phone: aParty,
          role: 'peddler', // Default, will be determined later
          connections: 0,
          totalCallTime: 0,
          locations: new Set(),
          callFrequency: {}
        };
      }

      if (!nodes[bParty]) {
        nodes[bParty] = {
          id: bParty,
          phone: bParty,
          role: 'peddler',
          connections: 0,
          totalCallTime: 0,
          locations: new Set(),
          callFrequency: {}
        };
      }

      // Update call frequency between parties
      if (!nodes[aParty].callFrequency[bParty]) {
        nodes[aParty].callFrequency[bParty] = 0;
      }
      if (!nodes[bParty].callFrequency[aParty]) {
        nodes[bParty].callFrequency[aParty] = 0;
      }

      nodes[aParty].callFrequency[bParty]++;
      nodes[bParty].callFrequency[aParty]++;

      // Update total call time
      nodes[aParty].totalCallTime += duration;
      nodes[bParty].totalCallTime += duration;

      // Add locations
      if (location) {
        nodes[aParty].locations.add(location);
        nodes[bParty].locations.add(location);
      }
    });

    // Calculate connections and determine roles
    Object.values(nodes).forEach(node => {
      node.connections = Object.keys(node.callFrequency).length;
      
      // Determine role based on network analysis
      const avgCallsPerContact = node.totalCallTime / Math.max(node.connections, 1);
      
      if (node.connections <= 3 && avgCallsPerContact > 300) {
        // Few contacts but long calls = Kingpin (command structure)
        node.role = 'kingpin';
      } else if (node.connections > 8) {
        // Many contacts = Peddler (street level)
        node.role = 'peddler';
      } else {
        // Moderate contacts = Middleman
        node.role = 'middleman';
      }
    });

    setNetworkAnalysis(Object.values(nodes));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'kingpin': return 'bg-red-100 text-red-800 border-red-200';
      case 'middleman': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'peddler': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Real CDR Data Parser & Network Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cdr-data">Paste CDR Data (Vodafone Idea format)</Label>
              <Textarea
                id="cdr-data"
                placeholder="Paste your CDR data here... Should include Target/A PARTY NUMBER, B PARTY NUMBER, Call Duration, First BTS Location, etc."
                value={cdrData}
                onChange={(e) => setCdrData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={parseCDRData}
              disabled={isAnalyzing || !cdrData.trim()}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Network className="w-4 h-4" />
                  Parse & Analyze CDR Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {parsedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed CDR Records ({parsedRecords.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">A Party</th>
                    <th className="text-left p-2">B Party</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-left p-2">Date/Time</th>
                    <th className="text-left p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRecords.slice(0, 10).map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-mono">{record.targetParty}</td>
                      <td className="p-2 font-mono">{record.bPartyNumber}</td>
                      <td className="p-2">{record.callDuration}s</td>
                      <td className="p-2">{record.callDate} {record.callInitiationTime}</td>
                      <td className="p-2 text-xs">{record.firstBTSLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRecords.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing first 10 of {parsedRecords.length} records
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {networkAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Network Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {networkAnalysis.filter(n => n.role === 'kingpin').length}
                </div>
                <div className="text-sm text-red-700">Kingpins</div>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {networkAnalysis.filter(n => n.role === 'middleman').length}
                </div>
                <div className="text-sm text-orange-700">Middlemen</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {networkAnalysis.filter(n => n.role === 'peddler').length}
                </div>
                <div className="text-sm text-yellow-700">Peddlers</div>
              </div>
            </div>

            <div className="space-y-3">
              {networkAnalysis.map((node) => (
                <div key={node.id} className={`p-3 rounded-lg border ${getRoleColor(node.role)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold font-mono">{node.phone}</div>
                      <div className="text-sm capitalize font-semibold">{node.role}</div>
                      <div className="text-sm">
                        {node.connections} connections | {Math.round(node.totalCallTime / 60)} min total
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="mb-1">Locations: {node.locations.size}</div>
                      <div className="text-xs text-muted-foreground">
                        {Array.from(node.locations).slice(0, 2).join(', ')}
                        {node.locations.size > 2 && '...'}
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

export default RealCDRParser;
