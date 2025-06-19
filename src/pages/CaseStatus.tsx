
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const CaseStatus = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Case Status</h1>
          <p className="text-muted-foreground">Track and monitor case progress</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Case status tracking coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default CaseStatus;
