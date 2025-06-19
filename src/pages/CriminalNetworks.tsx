
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const CriminalNetworks = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criminal Networks</h1>
          <p className="text-muted-foreground">Network analysis and connections</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Criminal networks analysis coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default CriminalNetworks;
