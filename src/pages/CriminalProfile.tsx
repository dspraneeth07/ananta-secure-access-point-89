
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const CriminalProfile = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criminal Profile</h1>
          <p className="text-muted-foreground">Criminal database and profiling system</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Criminal profile system coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default CriminalProfile;
