
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const UpdateCase = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Update Case</h1>
          <p className="text-muted-foreground">Update existing case information</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Case update system coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default UpdateCase;
