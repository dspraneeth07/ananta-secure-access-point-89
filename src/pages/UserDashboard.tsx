
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const UserDashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
          <p className="text-muted-foreground">User management and settings</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">User dashboard coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default UserDashboard;
