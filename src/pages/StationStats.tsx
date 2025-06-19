
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const StationStats = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Station Statistics</h1>
          <p className="text-muted-foreground">Station-specific performance metrics</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Station statistics coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default StationStats;
