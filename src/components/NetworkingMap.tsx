
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
            <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Interactive Network Graph</h3>
                <p className="text-muted-foreground mb-4">
                  This would show the criminal network connections, associates, and their relationships
                </p>
                <div className="space-y-2">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <strong>{criminal.name}</strong> (Primary Accused)
                  </div>
                  <div className="flex justify-center space-x-4">
                    <div className="bg-yellow-100 p-2 rounded">Jane Smith (Associate)</div>
                    <div className="bg-yellow-100 p-2 rounded">Bob Wilson (Co-accused)</div>
                  </div>
                  <div className="bg-red-100 p-2 rounded">
                    Alice Johnson (Supplier)
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Connections based on FIR: {criminal.firNumber}
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
