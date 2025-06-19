
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, FileText, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';

const HQDashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Headquarters Dashboard</h1>
          <p className="text-muted-foreground">Command Center Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Officers</p>
                <p className="text-2xl font-bold text-foreground">89</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending FIRs</p>
                <p className="text-2xl font-bold text-foreground">23</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-foreground">7</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">New case registered - NRPTPS</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">FIR generated - WNPTPS</span>
                <span className="text-xs text-muted-foreground">4 hours ago</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">Case update - MBNRPS</span>
                <span className="text-xs text-muted-foreground">6 hours ago</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Station Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                <span className="text-sm font-medium">Warangal North PTS</span>
                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                <span className="text-sm font-medium">Nalgonda Rural PTS</span>
                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                <span className="text-sm font-medium">Mahbubnagar PTS</span>
                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HQDashboard;
