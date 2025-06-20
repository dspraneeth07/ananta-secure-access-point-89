
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockCriminals, telanganaDistricts, drugTypes, caseStatuses } from '@/data/mockCriminals';

type CaseType = 'UI' | 'PT' | null;

interface SearchFilters {
  caseType: CaseType;
  crimeNo: string;
  firNo: string;
  district: string;
}

const CaseStatus = () => {
  const [selectedType, setSelectedType] = useState<CaseType>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    caseType: null,
    crimeNo: '',
    firNo: '',
    district: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  const getFilteredCases = () => {
    let filteredCases = mockCriminals;

    if (filters.district) {
      filteredCases = filteredCases.filter(c => c.district.toLowerCase().includes(filters.district.toLowerCase()));
    }
    if (filters.crimeNo) {
      filteredCases = filteredCases.filter(c => c.firNumber.toLowerCase().includes(filters.crimeNo.toLowerCase()));
    }
    if (filters.firNo) {
      filteredCases = filteredCases.filter(c => c.firNumber.toLowerCase().includes(filters.firNo.toLowerCase()));
    }

    return filteredCases;
  };

  const generateDistrictCaseData = () => {
    return telanganaDistricts.map(district => ({
      district: district.substring(0, 10),
      cases: mockCriminals.filter(c => c.district === district).length,
      fill: '#3b82f6'
    }));
  };

  const generateDrugCaseData = () => {
    return drugTypes.map((drug, index) => ({
      drug: drug.substring(0, 8),
      cases: mockCriminals.filter(c => c.drugType === drug).length,
      fill: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 5]
    }));
  };

  const generateStatusData = () => {
    return caseStatuses.map((status, index) => ({
      status: status.substring(0, 15),
      count: mockCriminals.filter(c => c.caseStatus === status).length,
      fill: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
    }));
  };

  const generateArrestData = () => {
    const arrested = mockCriminals.filter(c => c.presentStatus === 'Arrested').length;
    const absconding = mockCriminals.filter(c => c.presentStatus === 'Absconding').length;
    return [
      { status: 'Arrested', count: arrested, fill: '#22c55e' },
      { status: 'Absconding', count: absconding, fill: '#ef4444' }
    ];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Case Status</h1>
          <p className="text-muted-foreground">Track and monitor case progress with advanced search</p>
        </div>

        {/* Case Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === 'UI' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedType('UI')}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">UI CASES</CardTitle>
              <p className="text-muted-foreground">Under Investigation Cases</p>
            </CardHeader>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === 'PT' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedType('PT')}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">PT CASES</CardTitle>
              <p className="text-muted-foreground">Prosecution Trial Cases</p>
            </CardHeader>
          </Card>
        </div>

        {selectedType && (
          <>
            {/* Search Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Search Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Crime No</label>
                    <Input
                      placeholder="Enter crime number"
                      value={filters.crimeNo}
                      onChange={(e) => setFilters(prev => ({ ...prev, crimeNo: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">FIR No</label>
                    <Input
                      placeholder="Enter FIR number"
                      value={filters.firNo}
                      onChange={(e) => setFilters(prev => ({ ...prev, firNo: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">District</label>
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
                  
                  <div className="flex items-end">
                    <Button onClick={handleSearch} className="w-full">
                      Search Cases
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts and Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cases by District</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateDistrictCaseData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="district" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="cases" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cases by Drug Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={generateDrugCaseData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="cases"
                          label={({ drug, cases }) => `${drug}: ${cases}`}
                        >
                          {generateDrugCaseData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Case Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateStatusData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Arrest Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={generateArrestData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="count"
                          label={({ status, count }) => `${status}: ${count}`}
                        >
                          {generateArrestData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Search Results */}
            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results - {selectedType} Cases ({getFilteredCases().length} found)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>FIR Number</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Police Station</TableHead>
                        <TableHead>Drug Type</TableHead>
                        <TableHead>Case Status</TableHead>
                        <TableHead>Present Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredCases().slice(0, 20).map((case_, index) => (
                        <TableRow key={case_.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{case_.name}</TableCell>
                          <TableCell>{case_.firNumber}</TableCell>
                          <TableCell>{case_.district}</TableCell>
                          <TableCell>{case_.policeStation}</TableCell>
                          <TableCell>{case_.drugType}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              {case_.caseStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              case_.presentStatus === 'Arrested' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {case_.presentStatus}
                            </span>
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

export default CaseStatus;
