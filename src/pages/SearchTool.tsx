
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const SearchTool = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Search Tool</h1>
          <p className="text-muted-foreground">Advanced search and investigation tools</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Search tool coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default SearchTool;
