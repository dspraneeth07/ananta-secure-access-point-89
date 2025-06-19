
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const Profile = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">User profile and settings</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Profile management coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
