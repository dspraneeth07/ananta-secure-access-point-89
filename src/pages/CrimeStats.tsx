import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { mockCriminals, drugTypes, telanganaDistricts, indianStates, categories } from '@/data/mockCriminals';

type StatsType = 'FIR' | 'SEIZURE' | 'ARREST' | null;

interface Filters {
  drug: string;
  location: string;
  year: string;
  accusedCategory: string;
}

const CrimeStats = () => {
  const [selectedStats, setSelectedStats] = useState<StatsType>(null);
  const [filters, setFilters] = useState<Filters>({
    drug: 'all',
    location: 'all',
    year: 'all',
    accusedCategory: 'all'
  });
  const [showMetrics, setShowMetrics] = useState(false);

  const yearOptions = ['2024', '2023', '2022', '2021', '2020'];

  // Generate dynamic data based on actual criminal data and filters
  const getFilteredData = () => {
    let filteredCriminals = mockCriminals;

    if (filters.drug && filters.drug !== 'all') {
      filteredCriminals = filteredCriminals.filter(c => c.drugType === filters.drug);
    }
    if (filters.location && filters.location !== 'all') {
      filteredCriminals = filteredCriminals.filter(c => 
        c.district === filters.location || c.state === filters.location
      );
    }
    if (filters.accusedCategory && filters.accusedCategory !== 'all') {
      filteredCriminals = filteredCriminals.filter(c => c.personCategory === filters.accusedCategory);
    }

    return filteredCriminals;
  };

  const generateFIRStatsData = () => {
    const filteredData = getFilteredData();
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach(month => {
      // Simulate monthly distribution based on filtered data
      const count = Math.floor((filteredData.length / 12) + (Math.random() * 10));
      monthlyData.push({
        month,
        count,
        fill: '#3b82f6'
      });
    });
    
    return monthlyData;
  };

  const generateSeizureStatsData = () => {
    const filteredData = getFilteredData();
    const seizureData: any[] = [];
    
    const relevantDrugs = filters.drug && filters.drug !== 'all' ? [filters.drug] : [...new Set(filteredData.map(c => c.drugType))];
    
    relevantDrugs.forEach((drug, index) => {
      const drugCriminals = filteredData.filter(c => c.drugType === drug);
      seizureData.push({
        drug,
        quantity: drugCriminals.length * (Math.random() * 50 + 10), // Simulate quantity
        fill: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 5]
      });
    });
    
    return seizureData;
  };

  const generateArrestStatsData = () => {
    const filteredData = getFilteredData();
    const arrestData: any[] = [];
    
    const relevantCategories = filters.accusedCategory && filters.accusedCategory !== 'all' ? [filters.accusedCategory] : [...new Set(filteredData.map(c => c.personCategory))];
    
    relevantCategories.forEach((category, index) => {
      const categoryCriminals = filteredData.filter(c => c.personCategory === category);
      const arrested = categoryCriminals.filter(c => c.presentStatus === 'Arrested').length;
      const absconding = categoryCriminals.filter(c => c.presentStatus === 'Absconding').length;
      
      arrestData.push({
        category,
        arrested,
        absconding,
        fill: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][index % 4]
      });
    });
    
    return arrestData;
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateMetrics = () => {
    setShowMetrics(true);
  };

  const renderStatsSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${selectedStats === 'FIR' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedStats('FIR')}
      >
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <CardTitle className="text-xl">FIR STATS</CardTitle>
          <p className="text-muted-foreground">View FIR registration statistics</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${selectedStats === 'SEIZURE' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedStats('SEIZURE')}
      >
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <CardTitle className="text-xl">SEIZURE STATS</CardTitle>
          <p className="text-muted-foreground">View drug seizure statistics</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${selectedStats === 'ARREST' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedStats('ARREST')}
      >
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">👮</div>
          <CardTitle className="text-xl">ARREST STATS</CardTitle>
          <p className="text-muted-foreground">View arrest statistics</p>
        </CardHeader>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters - Select One or More Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Drug</label>
            <Select value={filters.drug} onValueChange={(value) => handleFilterChange('drug', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All drugs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drugs</SelectItem>
                {drugTypes.map(drug => (
                  <SelectItem key={drug} value={drug}>{drug}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Location</label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {telanganaDistricts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
                {indianStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Year</label>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Accused Category</label>
            <Select value={filters.accusedCategory} onValueChange={(value) => handleFilterChange('accusedCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={generateMetrics} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          🎯 Generate 3D Visualized Metrics
        </Button>
      </CardContent>
    </Card>
  );

  const renderMetrics = () => {
    if (!showMetrics) return null;

    return (
      <div className="space-y-6">
        {selectedStats === 'FIR' && (
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl text-blue-800">📈 FIR Registration Trends</CardTitle>
              <p className="text-blue-600">Interactive visualization of FIR registrations over time</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateFIRStatsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedStats === 'SEIZURE' && (
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-xl text-green-800">🔍 Drug Seizure Analysis</CardTitle>
              <p className="text-green-600">3D visualization of drug seizures by type and quantity</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateSeizureStatsData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="quantity"
                      label={({ drug, quantity }) => `${drug}: ${quantity.toFixed(1)}kg`}
                    >
                      {generateSeizureStatsData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedStats === 'ARREST' && (
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-xl text-purple-800">👮 Arrest Statistics by Category</CardTitle>
              <p className="text-purple-600">Comparative analysis of arrests vs absconding by category</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateArrestStatsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="arrested" stackId="a" fill="#22c55e" name="Arrested" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="absconding" stackId="a" fill="#ef4444" name="Absconding" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Summary Statistics */}
        <Card className="border-2 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardTitle className="text-xl text-orange-800">📊 Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getFilteredData().length}</div>
                <div className="text-sm text-blue-500">Total Cases</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {getFilteredData().filter(c => c.presentStatus === 'Arrested').length}
                </div>
                <div className="text-sm text-green-500">Arrested</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {getFilteredData().filter(c => c.presentStatus === 'Absconding').length}
                </div>
                <div className="text-sm text-red-500">Absconding</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {[...new Set(getFilteredData().map(c => c.drugType))].length}
                </div>
                <div className="text-sm text-purple-500">Drug Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crime Statistics</h1>
          <p className="text-muted-foreground">Comprehensive crime data and analytics with 3D visualizations</p>
        </div>
        
        {renderStatsSelection()}
        
        {selectedStats && (
          <>
            {renderFilters()}
            {renderMetrics()}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CrimeStats;
