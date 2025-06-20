
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Network } from 'lucide-react';

interface Criminal {
  id: string;
  name: string;
  firNumber: string;
}

interface CDRTableProps {
  criminal: Criminal;
  onBack: () => void;
}

const CDRTable: React.FC<CDRTableProps> = ({ criminal, onBack }) => {
  const [showNetworkGraph, setShowNetworkGraph] = useState(false);

  const cdrData = [
    {
      requestId: 'CDR001',
      phoneNumber: '+91-9876543210',
      imei: '123456789012345',
      requestSection: 'NTPCR',
      caseFirNo: 'FIR001/2024',
      telecomProvider: 'Airtel',
      fromDate: '2024-01-01',
      toDate: '2024-01-31',
      totalCalls: 245,
      suspiciousCalls: 12,
      criminalConnections: 3
    },
    {
      requestId: 'CDR002',
      phoneNumber: '+91-9876543211',
      imei: '123456789012346',
      requestSection: 'CID',
      caseFirNo: 'FIR002/2024',
      telecomProvider: 'Jio',
      fromDate: '2024-02-01',
      toDate: '2024-02-28',
      totalCalls: 189,
      suspiciousCalls: 8,
      criminalConnections: 2
    }
  ];

  if (showNetworkGraph) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowNetworkGraph(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to CDR
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">CDR Network Analysis</h1>
              <p className="text-muted-foreground">Criminal network connections through call data</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>CDR-Based Criminal Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Call Data Network Graph</h3>
                  <p className="text-muted-foreground mb-4">
                    Network connections based on call patterns and criminal database matches
                  </p>
                  <div className="space-y-2">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <strong>{criminal.name}</strong> (+91-9876543210)
                    </div>
                    <div className="flex justify-center space-x-4">
                      <div className="bg-red-100 p-2 rounded">Known Criminal A (Frequent Contact)</div>
                      <div className="bg-yellow-100 p-2 rounded">Suspicious Number B</div>
                    </div>
                    <div className="bg-green-100 p-2 rounded">
                      Associated Criminal C (Database Match)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Call Data Records - {criminal.name}</h1>
            <p className="text-muted-foreground">Detailed call data analysis and network connections</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>CDR Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CDR Request ID</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>IMEI</TableHead>
                  <TableHead>Request Section</TableHead>
                  <TableHead>Case FIR No</TableHead>
                  <TableHead>Telecom Provider</TableHead>
                  <TableHead>From Date</TableHead>
                  <TableHead>To Date</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Suspicious Calls</TableHead>
                  <TableHead>Criminal Connections</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cdrData.map((cdr) => (
                  <TableRow key={cdr.requestId}>
                    <TableCell>{cdr.requestId}</TableCell>
                    <TableCell>{cdr.phoneNumber}</TableCell>
                    <TableCell>{cdr.imei}</TableCell>
                    <TableCell>{cdr.requestSection}</TableCell>
                    <TableCell>{cdr.caseFirNo}</TableCell>
                    <TableCell>{cdr.telecomProvider}</TableCell>
                    <TableCell>{cdr.fromDate}</TableCell>
                    <TableCell>{cdr.toDate}</TableCell>
                    <TableCell>{cdr.totalCalls}</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        {cdr.suspiciousCalls}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {cdr.criminalConnections}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowNetworkGraph(true)}
                      >
                        <Network className="w-4 h-4 mr-2" />
                        View Network
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CDRTable;
