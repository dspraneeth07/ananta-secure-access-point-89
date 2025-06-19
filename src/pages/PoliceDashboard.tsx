
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Plus, Edit, Activity } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const PoliceDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Police Station Dashboard</h1>
          <p className="text-muted-foreground">{user?.fullName} - {user?.stationCode?.toUpperCase()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <p className="text-2xl font-bold text-foreground">45</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Cases</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Updated Cases</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">FIRs Generated</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Cases</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">Case #2024-001 - Drug Possession</span>
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">Case #2024-002 - Trafficking</span>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">Case #2024-003 - Distribution</span>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-center transition-colors">
                <Plus className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Register Case</span>
              </button>
              <button className="p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-center transition-colors">
                <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">Generate FIR</span>
              </button>
              <button className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-center transition-colors">
                <Edit className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <span className="text-sm font-medium">Update Case</span>
              </button>
              <button className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-center transition-colors">
                <Activity className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <span className="text-sm font-medium">View Stats</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PoliceDashboard;
