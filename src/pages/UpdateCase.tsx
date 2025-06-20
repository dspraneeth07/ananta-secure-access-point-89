
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { telanganaDistricts, caseStatuses } from '@/data/mockCriminals';
import { toast } from 'sonner';

type UpdateType = 'CASE' | 'OFFENDER' | null;

interface UpdateFilters {
  updateType: UpdateType;
  district: string;
  policeStation: string;
  crimeNumber: string;
  offenderName: string;
}

interface CaseData {
  crimeNumber: string;
  district: string;
  policeStation: string;
  offenderName: string;
  caseStatus: string;
  investigationNotes: string;
  prosecutionDetails: string;
  chargesheet: string;
  courtDetails: string;
  evidenceDetails: string;
  witnessDetails: string;
  lastUpdated: string;
}

const UpdateCase = () => {
  const [selectedType, setSelectedType] = useState<UpdateType>(null);
  const [filters, setFilters] = useState<UpdateFilters>({
    updateType: null,
    district: '',
    policeStation: '',
    crimeNumber: '',
    offenderName: ''
  });
  const [updateData, setUpdateData] = useState({
    caseStatus: '',
    investigationNotes: '',
    prosecutionDetails: '',
    chargesheet: '',
    courtDetails: '',
    evidenceDetails: '',
    witnessDetails: ''
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [foundCase, setFoundCase] = useState<CaseData | null>(null);

  const policeStations = [
    'Cyberabad Police Station',
    'Rachakonda Police Station',
    'Hyderabad City Police Station',
    'TSSP Police Station',
    'Railway Police Station'
  ];

  const handleSearch = () => {
    // Validate required fields
    if (!filters.district || !filters.policeStation || !filters.crimeNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    // Generate unique crime number if not provided
    const uniqueCrimeNumber = filters.crimeNumber || `CR${Date.now()}`;
    
    // Simulate finding a case (in real app, this would be an API call)
    const mockFoundCase: CaseData = {
      crimeNumber: uniqueCrimeNumber,
      district: filters.district,
      policeStation: filters.policeStation,
      offenderName: filters.offenderName || 'John Doe',
      caseStatus: 'Under Investigation',
      investigationNotes: 'Initial investigation notes...',
      prosecutionDetails: 'Prosecution details...',
      chargesheet: 'Chargesheet information...',
      courtDetails: 'Court proceedings...',
      evidenceDetails: 'Evidence collected...',
      witnessDetails: 'Witness statements...',
      lastUpdated: new Date().toISOString()
    };

    setFoundCase(mockFoundCase);
    setUpdateData({
      caseStatus: mockFoundCase.caseStatus,
      investigationNotes: mockFoundCase.investigationNotes,
      prosecutionDetails: mockFoundCase.prosecutionDetails,
      chargesheet: mockFoundCase.chargesheet,
      courtDetails: mockFoundCase.courtDetails,
      evidenceDetails: mockFoundCase.evidenceDetails,
      witnessDetails: mockFoundCase.witnessDetails
    });
    setShowUpdateForm(true);
    toast.success('Case found successfully!');
  };

  const handleUpdate = () => {
    if (!foundCase) {
      toast.error('No case found to update');
      return;
    }

    // Update the case data
    const updatedCase: CaseData = {
      ...foundCase,
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    // In a real application, this would be saved to the database
    // For now, we'll store it in localStorage to simulate persistence
    const existingCases = JSON.parse(localStorage.getItem('updatedCases') || '[]');
    const caseIndex = existingCases.findIndex((c: CaseData) => c.crimeNumber === updatedCase.crimeNumber);
    
    if (caseIndex >= 0) {
      existingCases[caseIndex] = updatedCase;
    } else {
      existingCases.push(updatedCase);
    }
    
    localStorage.setItem('updatedCases', JSON.stringify(existingCases));

    toast.success('Case updated successfully!');
    
    // Reset form
    setShowUpdateForm(false);
    setSelectedType(null);
    setFoundCase(null);
    setFilters({
      updateType: null,
      district: '',
      policeStation: '',
      crimeNumber: '',
      offenderName: ''
    });
    setUpdateData({
      caseStatus: '',
      investigationNotes: '',
      prosecutionDetails: '',
      chargesheet: '',
      courtDetails: '',
      evidenceDetails: '',
      witnessDetails: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Update Case</h1>
          <p className="text-muted-foreground">Update existing case information and status</p>
        </div>

        {/* Update Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === 'CASE' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedType('CASE')}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">UPDATE CASE</CardTitle>
              <p className="text-muted-foreground">Update case information by case details</p>
            </CardHeader>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === 'OFFENDER' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedType('OFFENDER')}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">UPDATE OFFENDER</CardTitle>
              <p className="text-muted-foreground">Update case information by offender details</p>
            </CardHeader>
          </Card>
        </div>

        {selectedType && (
          <>
            {/* Search Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Search Parameters</CardTitle>
                <p className="text-muted-foreground">
                  {selectedType === 'CASE' ? 'Enter case details to find and update' : 'Enter offender details to find and update'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select value={filters.district} onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {telanganaDistricts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="policeStation">Police Station *</Label>
                    <Select value={filters.policeStation} onValueChange={(value) => setFilters(prev => ({ ...prev, policeStation: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select PS" />
                      </SelectTrigger>
                      <SelectContent>
                        {policeStations.map(ps => (
                          <SelectItem key={ps} value={ps}>{ps}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="crimeNumber">Crime Number (Unique ID) *</Label>
                    <Input
                      id="crimeNumber"
                      placeholder="Enter unique crime number"
                      value={filters.crimeNumber}
                      onChange={(e) => setFilters(prev => ({ ...prev, crimeNumber: e.target.value }))}
                    />
                  </div>

                  {selectedType === 'OFFENDER' && (
                    <div>
                      <Label htmlFor="offenderName">Offender Name</Label>
                      <Input
                        id="offenderName"
                        placeholder="Enter offender name"
                        value={filters.offenderName}
                        onChange={(e) => setFilters(prev => ({ ...prev, offenderName: e.target.value }))}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-end">
                    <Button onClick={handleSearch} className="w-full">
                      Search & Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Form */}
            {showUpdateForm && foundCase && (
              <Card>
                <CardHeader>
                  <CardTitle>Update Case Information</CardTitle>
                  <p className="text-muted-foreground">
                    Found case: {foundCase.crimeNumber} - {foundCase.district} - {foundCase.policeStation}
                    <br />
                    <span className="text-xs text-green-600">Last updated: {new Date(foundCase.lastUpdated).toLocaleString()}</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Case Status Update */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="caseStatus">Case Status</Label>
                        <Select value={updateData.caseStatus} onValueChange={(value) => setUpdateData(prev => ({ ...prev, caseStatus: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select case status" />
                          </SelectTrigger>
                          <SelectContent>
                            {caseStatuses.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Investigation Details */}
                    <div>
                      <Label htmlFor="investigationNotes">Investigation Notes</Label>
                      <Textarea
                        id="investigationNotes"
                        placeholder="Enter investigation details and progress..."
                        value={updateData.investigationNotes}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, investigationNotes: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    {/* Prosecution Details */}
                    <div>
                      <Label htmlFor="prosecutionDetails">Prosecution Details</Label>
                      <Textarea
                        id="prosecutionDetails"
                        placeholder="Enter prosecution details, court proceedings..."
                        value={updateData.prosecutionDetails}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, prosecutionDetails: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Chargesheet Information */}
                    <div>
                      <Label htmlFor="chargesheet">Chargesheet Information</Label>
                      <Textarea
                        id="chargesheet"
                        placeholder="Enter chargesheet details..."
                        value={updateData.chargesheet}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, chargesheet: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Court Details */}
                    <div>
                      <Label htmlFor="courtDetails">Court Details</Label>
                      <Textarea
                        id="courtDetails"
                        placeholder="Enter court details, hearing dates..."
                        value={updateData.courtDetails}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, courtDetails: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Evidence Details */}
                    <div>
                      <Label htmlFor="evidenceDetails">Evidence Details</Label>
                      <Textarea
                        id="evidenceDetails"
                        placeholder="Enter evidence collected, FSL reports..."
                        value={updateData.evidenceDetails}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, evidenceDetails: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Witness Details */}
                    <div>
                      <Label htmlFor="witnessDetails">Witness Details</Label>
                      <Textarea
                        id="witnessDetails"
                        placeholder="Enter witness information, statements..."
                        value={updateData.witnessDetails}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, witnessDetails: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700">
                        Update Case
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpdateForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default UpdateCase;
