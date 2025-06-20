
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface Criminal {
  id: string;
  name: string;
  firNumber: string;
  caseStatus: string;
}

interface CaseStatusViewProps {
  criminal: Criminal;
  onBack: () => void;
}

const CaseStatusView: React.FC<CaseStatusViewProps> = ({ criminal, onBack }) => {
  const caseSteps = [
    { id: 'investigation', label: 'Under Investigation', status: 'completed', icon: CheckCircle },
    { id: 'chargesheet', label: 'Chargesheet Created', status: 'completed', icon: CheckCircle },
    { id: 'trial', label: 'Pending Trial', status: 'current', icon: Clock },
    { id: 'transfer', label: 'Transfer to Other Dept', status: 'pending', icon: AlertCircle },
    { id: 'reassign', label: 'Reassign', status: 'pending', icon: AlertCircle },
    { id: 'transfer_ps', label: 'Transfer to Other P.S', status: 'pending', icon: AlertCircle },
    { id: 'reopened', label: 'Reopened', status: 'skipped', icon: XCircle },
    { id: 'disposed', label: 'Disposed', status: 'pending', icon: Clock }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'skipped': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLineColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Case Status - {criminal.name}</h1>
            <p className="text-muted-foreground">FIR: {criminal.firNumber} | Current Status: {criminal.caseStatus}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Progress Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline */}
              <div className="flex flex-col space-y-8">
                {caseSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === caseSteps.length - 1;
                  
                  return (
                    <div key={step.id} className="relative flex items-center">
                      {/* Timeline line */}
                      {!isLast && (
                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                      )}
                      
                      {/* Status icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      {/* Content */}
                      <div className="ml-6 flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{step.label}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}>
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                          </span>
                        </div>
                        
                        {step.status === 'current' && (
                          <p className="text-muted-foreground mt-2">
                            Currently in progress. Expected completion: 2-3 weeks
                          </p>
                        )}
                        
                        {step.status === 'completed' && (
                          <p className="text-green-600 mt-2">
                            Completed on {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Case Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">FIR Number:</span>
                  <span>{criminal.firNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Current Status:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {criminal.caseStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Case Filed Date:</span>
                  <span>15/01/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Investigating Officer:</span>
                  <span>SI Rajesh Kumar</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Court:</span>
                  <span>District Court, Hyderabad</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-yellow-800">Pending Trial</div>
                  <div className="text-sm text-yellow-600">
                    Hearing scheduled for next month. All documents prepared.
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">Evidence Review</div>
                  <div className="text-sm text-blue-600">
                    Final evidence review in progress by prosecution team.
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">Witness Statements</div>
                  <div className="text-sm text-green-600">
                    All witness statements recorded and verified.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CaseStatusView;
