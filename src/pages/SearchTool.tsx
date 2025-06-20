
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCriminals, telanganaDistricts, indianStates, countries, drugTypes, categories } from '@/data/mockCriminals';
import CriminalProfileView from '@/components/CriminalProfileView';

type SearchType = 'NAME' | 'CO_ACCUSED' | 'CATEGORY' | 'DRUG' | 'DOMICILE' | 'PLACE_OFFENCE' | 'CRIME_NUMBER' | 'MOBILE_IMEI' | 'ID' | 'BANK_AC' | null;

interface SearchFilters {
  searchType: SearchType;
  // Name-based
  accusedName: string;
  drugName: string;
  domicile: string;
  aliasName: string;
  placeOfOffence: string;
  fatherName: string;
  // Co-accused based
  coAccusedName: string;
  policeStation: string;
  coAccusedAlias: string;
  // Category based
  categoryOfOffender: string;
  // Domicile based
  nationality: string;
  state: string;
  district: string;
  // Crime number based
  crimeNumber: string;
  // Mobile/IMEI based
  mobileNumber: string;
  imeiNumber: string;
  // ID based
  idType: string;
  idNumber: string;
  // Bank account based
  bankName: string;
  accountNumber: string;
}

const SearchTool = () => {
  const [selectedSearchType, setSelectedSearchType] = useState<SearchType>('NAME');
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'NAME',
    accusedName: '',
    drugName: '',
    domicile: '',
    aliasName: '',
    placeOfOffence: '',
    fatherName: '',
    coAccusedName: '',
    policeStation: '',
    coAccusedAlias: '',
    categoryOfOffender: '',
    nationality: '',
    state: '',
    district: '',
    crimeNumber: '',
    mobileNumber: '',
    imeiNumber: '',
    idType: '',
    idNumber: '',
    bankName: '',
    accountNumber: ''
  });
  const [showResults, setShowResults] = useState(true); // Show results by default
  const [selectedCriminal, setSelectedCriminal] = useState(null);

  const handleSearch = () => {
    setShowResults(true);
  };

  const getFilteredCriminals = () => {
    let filteredCriminals = mockCriminals;

    // Apply filters based on search type
    if (filters.accusedName) {
      filteredCriminals = filteredCriminals.filter(c => 
        c.name.toLowerCase().includes(filters.accusedName.toLowerCase())
      );
    }
    if (filters.fatherName) {
      filteredCriminals = filteredCriminals.filter(c => 
        c.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase())
      );
    }
    if (filters.drugName) {
      filteredCriminals = filteredCriminals.filter(c => c.drugType === filters.drugName);
    }
    if (filters.domicile) {
      filteredCriminals = filteredCriminals.filter(c => 
        c.state.toLowerCase().includes(filters.domicile.toLowerCase()) ||
        c.country.toLowerCase().includes(filters.domicile.toLowerCase())
      );
    }
    if (filters.placeOfOffence) {
      filteredCriminals = filteredCriminals.filter(c => 
        c.district.toLowerCase().includes(filters.placeOfOffence.toLowerCase())
      );
    }
    if (filters.categoryOfOffender) {
      filteredCriminals = filteredCriminals.filter(c => c.personCategory === filters.categoryOfOffender);
    }
    if (filters.mobileNumber) {
      filteredCriminals = filteredCriminals.filter(c => c.phoneNumber.includes(filters.mobileNumber));
    }
    if (filters.imeiNumber) {
      filteredCriminals = filteredCriminals.filter(c => c.imei.includes(filters.imeiNumber));
    }
    if (filters.crimeNumber) {
      filteredCriminals = filteredCriminals.filter(c => 
        c.firNumber.toLowerCase().includes(filters.crimeNumber.toLowerCase())
      );
    }
    if (filters.policeStation) {
      filteredCriminals = filteredCriminals.filter(c => 
        c.policeStation.toLowerCase().includes(filters.policeStation.toLowerCase())
      );
    }
    if (filters.state) {
      filteredCriminals = filteredCriminals.filter(c => c.state === filters.state);
    }
    if (filters.district) {
      filteredCriminals = filteredCriminals.filter(c => c.district === filters.district);
    }

    return filteredCriminals;
  };

  const renderAllSearchForms = () => {
    return (
      <div className="space-y-6">
        {/* Name Based Search */}
        <Card>
          <CardHeader>
            <CardTitle>Name Based Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of Accused</label>
                <Input
                  placeholder="Enter accused name"
                  value={filters.accusedName}
                  onChange={(e) => setFilters(prev => ({ ...prev, accusedName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name of Drug</label>
                <Select value={filters.drugName} onValueChange={(value) => setFilters(prev => ({ ...prev, drugName: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drug type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Drugs</SelectItem>
                    {drugTypes.map(drug => (
                      <SelectItem key={drug} value={drug}>{drug}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Domicile</label>
                <Input
                  placeholder="Enter domicile"
                  value={filters.domicile}
                  onChange={(e) => setFilters(prev => ({ ...prev, domicile: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alias Name</label>
                <Input
                  placeholder="Enter alias name"
                  value={filters.aliasName}
                  onChange={(e) => setFilters(prev => ({ ...prev, aliasName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Place of Offence</label>
                <Input
                  placeholder="Enter place of offence"
                  value={filters.placeOfOffence}
                  onChange={(e) => setFilters(prev => ({ ...prev, placeOfOffence: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Father's Name</label>
                <Input
                  placeholder="Enter father's name"
                  value={filters.fatherName}
                  onChange={(e) => setFilters(prev => ({ ...prev, fatherName: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Co-Accused Based Search */}
        <Card>
          <CardHeader>
            <CardTitle>Co-Accused Based Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Co-Accused Name</label>
                <Input
                  placeholder="Enter co-accused name"
                  value={filters.coAccusedName}
                  onChange={(e) => setFilters(prev => ({ ...prev, coAccusedName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name of PS</label>
                <Input
                  placeholder="Enter police station"
                  value={filters.policeStation}
                  onChange={(e) => setFilters(prev => ({ ...prev, policeStation: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Based Search */}
        <Card>
          <CardHeader>
            <CardTitle>Category Based Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category of Offender</label>
                <Select value={filters.categoryOfOffender} onValueChange={(value) => setFilters(prev => ({ ...prev, categoryOfOffender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile/IMEI Based Search */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile/IMEI Based Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                <Input
                  placeholder="Enter mobile number"
                  value={filters.mobileNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, mobileNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">IMEI Number</label>
                <Input
                  placeholder="Enter IMEI number"
                  value={filters.imeiNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, imeiNumber: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crime Number Based Search */}
        <Card>
          <CardHeader>
            <CardTitle>Crime Number Based Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Crime Number</label>
                <Input
                  placeholder="Enter crime number"
                  value={filters.crimeNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, crimeNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">District</label>
                <Select value={filters.district} onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Districts</SelectItem>
                    {telanganaDistricts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (selectedCriminal) {
    return (
      <CriminalProfileView 
        criminal={selectedCriminal} 
        onBack={() => setSelectedCriminal(null)} 
      />
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Search Tool</h1>
          <p className="text-muted-foreground">Search and trace details of known/unknown offenders</p>
        </div>

        {/* All Search Parameters */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Parameters</h2>
          {renderAllSearchForms()}
          <div className="mt-6">
            <Button onClick={handleSearch} className="w-full md:w-auto">
              Search Criminals
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({getFilteredCriminals().length} found)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Father Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Crime No.</TableHead>
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
                  {getFilteredCriminals().slice(0, 20).map((criminal, index) => (
                    <TableRow key={criminal.id}>
                      <TableCell>{index + 1}</TableCell>
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
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            View FIR
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-xs px-2 py-1"
                            onClick={() => setSelectedCriminal(criminal)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            View Network
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            Case Status
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SearchTool;
