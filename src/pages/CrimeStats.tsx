
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const CrimeStats = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crime Statistics</h1>
          <p className="text-muted-foreground">Comprehensive crime data and analytics</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Crime statistics dashboard coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default CrimeStats;
