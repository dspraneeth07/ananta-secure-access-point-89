
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, FileText, Network, Activity } from 'lucide-react';
import { mockCriminals, telanganaDistricts, indianStates, countries, drugTypes, categories, statuses } from '@/data/mockCriminals';
import type { Criminal } from '@/data/mockCriminals';
import CriminalProfileView from '@/components/CriminalProfileView';
import FIRDocument from '@/components/FIRDocument';
import NetworkingMap from '@/components/NetworkingMap';

type LocationType = 'LOCAL' | 'OTHER_STATE' | 'OTHER_NATION' | null;

const CriminalProfile = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationType>(null);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedCriminal, setSelectedCriminal] = useState<Criminal | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFIR, setShowFIR] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    drugType: '',
    accusedCategory: '',
    area: ''
  });

  // Calculate location counts from mock data
  const locationCounts = {
    telangana: mockCriminals.filter(c => c.state === 'Telangana').length,
    india: mockCriminals.filter(c => c.country === 'India').length,
    global: mockCriminals.length
  };

  const getFilteredCriminals = () => {
    let filteredCriminals = mockCriminals;

    // Filter by location
    if (selectedLocation === 'LOCAL') {
      filteredCriminals = filteredCriminals.filter(c => c.state === 'Telangana');
      if (selectedArea) {
        filteredCriminals = filteredCriminals.filter(c => c.district === selectedArea);
      }
    } else if (selectedLocation === 'OTHER_STATE') {
      filteredCriminals = filteredCriminals.filter(c => c.country === 'India' && c.state !== 'Telangana');
      if (selectedArea) {
        filteredCriminals = filteredCriminals.filter(c => c.state === selectedArea);
      }
    } else if (selectedLocation === 'OTHER_NATION') {
      filteredCriminals = filteredCriminals.filter(c => c.country !== 'India');
      if (selectedArea) {
        filteredCriminals = filteredCriminals.filter(c => c.country === selectedArea);
      }
    }

    // Apply additional filters
    if (filters.status && filters.status !== 'all') {
      filteredCriminals = filteredCriminals.filter(c => c.presentStatus.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.drugType) {
      filteredCriminals = filteredCriminals.filter(c => c.drugType === filters.drugType);
    }
    if (filters.accusedCategory) {
      filteredCriminals = filteredCriminals.filter(c => c.personCategory === filters.accusedCategory);
    }

    return filteredCriminals;
  };

  const getAreaCounts = () => {
    let areas: string[] = [];
    let filteredCriminals = mockCriminals;

    switch (selectedLocation) {
      case 'LOCAL':
        areas = telanganaDistricts;
        filteredCriminals = mockCriminals.filter(c => c.state === 'Telangana');
        break;
      case 'OTHER_STATE':
        areas = indianStates;
        filteredCriminals = mockCriminals.filter(c => c.country === 'India' && c.state !== 'Telangana');
        break;
      case 'OTHER_NATION':
        areas = countries;
        filteredCriminals = mockCriminals.filter(c => c.country !== 'India');
        break;
      default:
        return {};
    }

    const counts: Record<string, number> = {};
    for (const area of areas) {
      if (selectedLocation === 'LOCAL') {
        counts[area] = filteredCriminals.filter(c => c.district === area).length;
      } else if (selectedLocation === 'OTHER_STATE') {
        counts[area] = filteredCriminals.filter(c => c.state === area).length;
      } else if (selectedLocation === 'OTHER_NATION') {
        counts[area] = filteredCriminals.filter(c => c.country === area).length;
      }
    }
    return counts;
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
        title = 'Select District (31 Districts)';
        break;
      case 'OTHER_STATE':
        areas = indianStates;
        title = 'Select State (29 States)';
        break;
      case 'OTHER_NATION':
        areas = countries;
        title = 'Select Country';
        break;
    }

    const areaCounts = getAreaCounts();

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
                {area} ({areaCounts[area] || 0})
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
              {drugTypes.map(drug => (
                <SelectItem key={drug} value={drug}>{drug}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.accusedCategory} onValueChange={(value) => setFilters(prev => ({ ...prev, accusedCategory: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
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

    const filteredCriminals = getFilteredCriminals();

    return (
      <Card>
        <CardHeader>
          <CardTitle>Criminal Profiles - {selectedArea} ({filteredCriminals.length} criminals)</CardTitle>
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
              {filteredCriminals.map((criminal) => (
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
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCriminal(criminal);
                          setShowFIR(true);
                        }}
                        className="p-2"
                        title="View FIR"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCriminal(criminal);
                          setShowProfile(true);
                        }}
                        className="p-2"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCriminal(criminal);
                          setShowNetwork(true);
                        }}
                        className="p-2"
                        title="View Network"
                      >
                        <Network className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2"
                        title="View Case Status"
                      >
                        <Activity className="w-4 h-4" />
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

  if (showNetwork && selectedCriminal) {
    return <NetworkingMap criminal={selectedCriminal} onBack={() => setShowNetwork(false)} />;
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
