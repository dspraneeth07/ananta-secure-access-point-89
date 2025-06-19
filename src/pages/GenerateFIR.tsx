
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const GenerateFIR = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Generate FIR</h1>
          <p className="text-muted-foreground">Generate First Information Report</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">FIR generation system coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default GenerateFIR;
