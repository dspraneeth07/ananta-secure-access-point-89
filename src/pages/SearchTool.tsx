
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Network, FileText, Activity } from 'lucide-react';
import { mockCriminals, drugTypes, categories, telanganaDistricts, indianStates, countries } from '@/data/mockCriminals';
import type { Criminal } from '@/data/mockCriminals';
import CriminalProfileView from '@/components/CriminalProfileView';
import FIRDocument from '@/components/FIRDocument';
import NetworkingMap from '@/components/NetworkingMap';

type SearchType = 'name' | 'coAccused' | 'category' | 'drug' | 'domicile' | 'placeOfOffence' | 'crimeNumber' | 'mobile' | 'id' | 'bankAccount' | null;

const SearchTool = () => {
  const [selectedSearchType, setSelectedSearchType] = useState<SearchType>(null);
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [searchResults, setSearchResults] = useState<Criminal[]>([]);
  const [selectedCriminal, setSelectedCriminal] = useState<Criminal | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFIR, setShowFIR] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);

  const searchTypes = [
    { id: 'name', title: 'Name Based Search', icon: '👤' },
    { id: 'coAccused', title: 'Co-Accused Based Search', icon: '👥' },
    { id: 'category', title: 'Category Based Search', icon: '📋' },
    { id: 'drug', title: 'Drug Based Search', icon: '💊' },
    { id: 'domicile', title: 'Domicile Based Search', icon: '🏠' },
    { id: 'placeOfOffence', title: 'Place of Offence Based Search', icon: '📍' },
    { id: 'crimeNumber', title: 'Crime Number Based Search', icon: '🔢' },
    { id: 'mobile', title: 'Mobile/IMEI Based Search', icon: '📱' },
    { id: 'id', title: 'ID Based Search', icon: '🆔' },
    { id: 'bankAccount', title: 'Bank A/c Based Search', icon: '🏦' }
  ];

  const handleSearch = () => {
    let filteredCriminals = mockCriminals;

    // Apply filters based on search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        filteredCriminals = filteredCriminals.filter(criminal => {
          switch (key) {
            case 'name':
            case 'accusedName':
              return criminal.name.toLowerCase().includes(value.toLowerCase());
            case 'fatherName':
              return criminal.fatherName.toLowerCase().includes(value.toLowerCase());
            case 'aliasName':
              return criminal.aliasName?.toLowerCase().includes(value.toLowerCase()) || false;
            case 'drug':
              return criminal.drugType.toLowerCase().includes(value.toLowerCase());
            case 'category':
              return criminal.personCategory.toLowerCase().includes(value.toLowerCase());
            case 'domicile':
            case 'state':
              return criminal.state.toLowerCase().includes(value.toLowerCase());
            case 'district':
              return criminal.district.toLowerCase().includes(value.toLowerCase());
            case 'nationality':
              return criminal.country.toLowerCase().includes(value.toLowerCase());
            case 'placeOfOffence':
              return criminal.address.toLowerCase().includes(value.toLowerCase());
            case 'crimeNumber':
              return criminal.firNumber.toLowerCase().includes(value.toLowerCase());
            case 'policeStation':
              return criminal.policeStation.toLowerCase().includes(value.toLowerCase());
            case 'mobile':
              return criminal.phoneNumber.includes(value);
            case 'imei':
              return criminal.imei.includes(value);
            case 'idNumber':
              return criminal.aadharNo.includes(value) || criminal.voterId.includes(value) || criminal.passportNo.includes(value);
            case 'bankAccount':
              return criminal.bankAccount.includes(value);
            case 'bankName':
              return criminal.bankName.toLowerCase().includes(value.toLowerCase());
            default:
              return true;
          }
        });
      }
    });

    setSearchResults(filteredCriminals);
  };

  const renderSearchForm = () => {
    if (!selectedSearchType) return null;

    const renderCommonFields = () => (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name of Drug</label>
            <Select value={searchParams.drug || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, drug: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select drug" />
              </SelectTrigger>
              <SelectContent>
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
              value={searchParams.domicile || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, domicile: e.target.value }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Place of Offence</label>
            <Input
              placeholder="Enter place of offence"
              value={searchParams.placeOfOffence || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, placeOfOffence: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Father's Name</label>
            <Input
              placeholder="Enter father's name"
              value={searchParams.fatherName || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, fatherName: e.target.value }))}
            />
          </div>
        </div>
      </>
    );

    switch (selectedSearchType) {
      case 'name':
        return (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name of Accused *</label>
              <Input
                placeholder="Enter accused name"
                value={searchParams.name || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <h4 className="font-semibold mb-3">Optional for Advanced Search</h4>
            {renderCommonFields()}
            <div>
              <label className="block text-sm font-medium mb-2">Alias Name</label>
              <Input
                placeholder="Enter alias name"
                value={searchParams.aliasName || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, aliasName: e.target.value }))}
              />
            </div>
          </div>
        );

      case 'coAccused':
        return (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Co-Accused Name *</label>
              <Input
                placeholder="Enter co-accused name"
                value={searchParams.coAccusedName || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, coAccusedName: e.target.value }))}
              />
            </div>
            <h4 className="font-semibold mb-3">Optional for Advanced Search</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of PS</label>
                <Input
                  placeholder="Enter police station"
                  value={searchParams.policeStation || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, policeStation: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Co-Accused Alias</label>
                <Input
                  placeholder="Enter co-accused alias"
                  value={searchParams.coAccusedAlias || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, coAccusedAlias: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Place of Offence</label>
                <Input
                  placeholder="Enter place of offence"
                  value={searchParams.placeOfOffence || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, placeOfOffence: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name of Accused</label>
                <Input
                  placeholder="Enter accused name"
                  value={searchParams.accusedName || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, accusedName: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 'category':
        return (
          <div>
            <h4 className="font-semibold mb-3">Optional for Advanced Search</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of Accused</label>
                <Input
                  placeholder="Enter accused name"
                  value={searchParams.accusedName || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, accusedName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category of Offender</label>
                <Select value={searchParams.category || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Place of Offence</label>
                <Input
                  placeholder="Enter place of offence"
                  value={searchParams.placeOfOffence || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, placeOfOffence: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Domicile</label>
                <Input
                  placeholder="Enter domicile"
                  value={searchParams.domicile || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, domicile: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 'drug':
        return (
          <div>
            <h4 className="font-semibold mb-3">Optional for Advanced Search</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of Accused</label>
                <Input
                  placeholder="Enter accused name"
                  value={searchParams.accusedName || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, accusedName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Drugs</label>
                <Select value={searchParams.drug || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, drug: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drug" />
                  </SelectTrigger>
                  <SelectContent>
                    {drugTypes.map(drug => (
                      <SelectItem key={drug} value={drug}>{drug}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Place of Offence</label>
                <Input
                  placeholder="Enter place of offence"
                  value={searchParams.placeOfOffence || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, placeOfOffence: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Domicile</label>
                <Input
                  placeholder="Enter domicile"
                  value={searchParams.domicile || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, domicile: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 'domicile':
        return (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nationality *</label>
              <Select value={searchParams.nationality || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, nationality: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">State *</label>
              <Select value={searchParams.state || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, state: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                  {indianStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <h4 className="font-semibold mb-3">Optional for Advanced Search</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of Accused</label>
                <Input
                  placeholder="Enter accused name"
                  value={searchParams.accusedName || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, accusedName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name of PS</label>
                <Input
                  placeholder="Enter police station"
                  value={searchParams.policeStation || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, policeStation: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">District</label>
                <Select value={searchParams.district || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, district: value }))}>
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
            </div>
          </div>
        );

      case 'placeOfOffence':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <Select value={searchParams.state || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">District *</label>
                <Select value={searchParams.district || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, district: value }))}>
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
            </div>
            <h4 className="font-semibold mb-3">Optional for Advanced Search</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of Accused</label>
                <Input
                  placeholder="Enter accused name"
                  value={searchParams.accusedName || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, accusedName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Other</label>
                <Input
                  placeholder="Enter other details"
                  value={searchParams.other || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, other: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 'crimeNumber':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Crime Number *</label>
                <Input
                  placeholder="Enter crime number"
                  value={searchParams.crimeNumber || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, crimeNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Police Station *</label>
                <Input
                  placeholder="Enter police station"
                  value={searchParams.policeStation || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, policeStation: e.target.value }))}
                />
              </div>
            </div>
            <h4 className="font-semibold mb-3">Optional for Advanced Search</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name of Accused</label>
                <Input
                  placeholder="Enter accused name"
                  value={searchParams.accusedName || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, accusedName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Select value={searchParams.state || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'mobile':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                <Input
                  placeholder="Enter mobile number"
                  value={searchParams.mobile || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, mobile: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">IMEI Number</label>
                <Input
                  placeholder="Enter IMEI number"
                  value={searchParams.imei || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, imei: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 'id':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ID Type *</label>
                <Select value={searchParams.idType || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, idType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhar">Aadhar Card</SelectItem>
                    <SelectItem value="voter">Voter ID</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="driving">Driving License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ID Number *</label>
                <Input
                  placeholder="Enter ID number"
                  value={searchParams.idNumber || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, idNumber: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 'bankAccount':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bank Name *</label>
                <Select value={searchParams.bankName || ''} onValueChange={(value) => setSearchParams(prev => ({ ...prev, bankName: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SBI">State Bank of India</SelectItem>
                    <SelectItem value="HDFC">HDFC Bank</SelectItem>
                    <SelectItem value="ICICI">ICICI Bank</SelectItem>
                    <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                    <SelectItem value="Canara Bank">Canara Bank</SelectItem>
                    <SelectItem value="Union Bank">Union Bank</SelectItem>
                    <SelectItem value="PNB">Punjab National Bank</SelectItem>
                    <SelectItem value="BOI">Bank of India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">A/c Number *</label>
                <Input
                  placeholder="Enter account number"
                  value={searchParams.bankAccount || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, bankAccount: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <h1 className="text-3xl font-bold text-foreground">Search Tool</h1>
          <p className="text-muted-foreground">Search and Trace details of Known/Unknown Offenders</p>
        </div>

        {!selectedSearchType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchTypes.map(type => (
              <Card 
                key={type.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => setSelectedSearchType(type.id as SearchType)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{searchTypes.find(t => t.id === selectedSearchType)?.title}</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedSearchType(null)}>
                    Back to Search Types
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderSearchForm()}
                <div className="mt-6">
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results ({searchResults.length} criminals found)</CardTitle>
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
                      {searchResults.map((criminal) => (
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
                                variant="outline"
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
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchTool;
