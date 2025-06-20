
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CriminalProfileView from '@/components/CriminalProfileView';
import FIRDocument from '@/components/FIRDocument';

type LocationType = 'LOCAL' | 'OTHER_STATE' | 'OTHER_NATION' | null;

interface Criminal {
  id: string;
  sno: number;
  name: string;
  fatherName: string;
  address: string;
  uniqueId: string;
  firNumber: string;
  personCategory: string;
  policeStation: string;
  district: string;
  country: string;
  state: string;
  drugType: string;
  noCrimes: number;
  photo: string;
  presentStatus: string;
  physicalVerificationDate: string;
}

const CriminalProfile = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationType>(null);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedCriminal, setSelectedCriminal] = useState<Criminal | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFIR, setShowFIR] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    drugType: '',
    accusedCategory: '',
    area: ''
  });

  const telanganaDistricts = [
    'Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Sangareddy', 'Warangal Urban',
    'Khammam', 'Nalgonda', 'Karimnagar', 'Nizamabad', 'Mahbubnagar'
  ];

  const indianStates = [
    'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Kerala',
    'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Bihar', 'West Bengal'
  ];

  const countries = [
    'India', 'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka',
    'Afghanistan', 'Myanmar', 'Thailand', 'Malaysia', 'Singapore'
  ];

  const mockCriminals: Criminal[] = [
    {
      id: '1',
      sno: 1,
      name: 'John Doe',
      fatherName: 'Robert Doe',
      address: '123 Street, Hyderabad',
      uniqueId: 'TGANB001',
      firNumber: 'FIR001/2024',
      personCategory: 'Peddler',
      policeStation: 'Cyberabad PS',
      district: 'Hyderabad',
      country: 'India',
      state: 'Telangana',
      drugType: 'Cannabis',
      noCrimes: 3,
      photo: '/placeholder.svg',
      presentStatus: 'Arrested',
      physicalVerificationDate: '2024-01-15'
    },
    // Add more mock data...
  ];

  const locationCounts = {
    telangana: 1247,
    india: 3456,
    global: 5678
  };

  const renderLocationSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${selectedLocation === 'LOCAL' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedLocation('LOCAL')}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl">LOCAL</CardTitle>
          <p className="text-muted-foreground">Telangana Criminals: {locationCounts.telangana}</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${selectedLocation === 'OTHER_STATE' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedLocation('OTHER_STATE')}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl">OTHER STATE</CardTitle>
          <p className="text-muted-foreground">India Criminals: {locationCounts.india}</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${selectedLocation === 'OTHER_NATION' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedLocation('OTHER_NATION')}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl">OTHER NATION</CardTitle>
          <p className="text-muted-foreground">Global Criminals: {locationCounts.global}</p>
        </CardHeader>
      </Card>
    </div>
  );

  const renderAreaSelection = () => {
    if (!selectedLocation) return null;

    let areas: string[] = [];
    let title = '';

    switch (selectedLocation) {
      case 'LOCAL':
        areas = telanganaDistricts;
        title = 'Select District';
        break;
      case 'OTHER_STATE':
        areas = indianStates;
        title = 'Select State';
        break;
      case 'OTHER_NATION':
        areas = countries;
        title = 'Select Country';
        break;
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {areas.map(area => (
              <Button
                key={area}
                variant={selectedArea === area ? "default" : "outline"}
                onClick={() => setSelectedArea(area)}
                className="text-left justify-start"
              >
                {area} ({Math.floor(Math.random() * 100) + 10})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFilters = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="arrested">Arrested</SelectItem>
              <SelectItem value="absconding">Absconding</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.drugType} onValueChange={(value) => setFilters(prev => ({ ...prev, drugType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Drug Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cannabis">Cannabis</SelectItem>
              <SelectItem value="heroin">Heroin</SelectItem>
              <SelectItem value="cocaine">Cocaine</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.accusedCategory} onValueChange={(value) => setFilters(prev => ({ ...prev, accusedCategory: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="peddler">Peddler</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.area} onValueChange={(value) => setFilters(prev => ({ ...prev, area: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              {selectedLocation === 'LOCAL' && telanganaDistricts.map(district => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
              {selectedLocation === 'OTHER_STATE' && indianStates.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
              {selectedLocation === 'OTHER_NATION' && countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderCriminalsTable = () => {
    if (!selectedArea) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Criminal Profiles - {selectedArea}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Father Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Unique ID</TableHead>
                <TableHead>FIR Number</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Police Station</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Drug Type</TableHead>
                <TableHead>No. of Crimes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCriminals.map((criminal) => (
                <TableRow key={criminal.id}>
                  <TableCell>{criminal.sno}</TableCell>
                  <TableCell>{criminal.name}</TableCell>
                  <TableCell>{criminal.fatherName}</TableCell>
                  <TableCell>{criminal.address}</TableCell>
                  <TableCell>{criminal.uniqueId}</TableCell>
                  <TableCell>{criminal.firNumber}</TableCell>
                  <TableCell>{criminal.personCategory}</TableCell>
                  <TableCell>{criminal.policeStation}</TableCell>
                  <TableCell>{criminal.district}</TableCell>
                  <TableCell>{criminal.drugType}</TableCell>
                  <TableCell>{criminal.noCrimes}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      criminal.presentStatus === 'Arrested' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {criminal.presentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCriminal(criminal);
                          setShowFIR(true);
                        }}
                      >
                        View FIR
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCriminal(criminal);
                          setShowProfile(true);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  if (showProfile && selectedCriminal) {
    return <CriminalProfileView criminal={selectedCriminal} onBack={() => setShowProfile(false)} />;
  }

  if (showFIR && selectedCriminal) {
    return <FIRDocument criminal={selectedCriminal} onBack={() => setShowFIR(false)} />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criminal Profile</h1>
          <p className="text-muted-foreground">Criminal database and profiling system</p>
        </div>
        
        {renderLocationSelection()}
        {renderAreaSelection()}
        {selectedLocation && renderFilters()}
        {renderCriminalsTable()}
      </div>
    </Layout>
  );
};

export default CriminalProfile;
