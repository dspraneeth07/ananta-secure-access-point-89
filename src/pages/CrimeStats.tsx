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
  const [selectedStats, setSelectedStats] = useState<StatsType>('FIR');
  const [filters, setFilters] = useState<Filters>({
    drug: 'all',
    location: 'all',
    year: 'all',
    accusedCategory: 'all'
  });
  const [showMetrics, setShowMetrics] = useState(true);

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
    
    months.forEach((month, index) => {
      // Simulate realistic monthly distribution based on filtered data
      const baseCount = Math.floor(filteredData.length / 12);
      const variation = Math.floor(Math.random() * 15) + 5; // Add some variation
      const count = baseCount + variation;
      monthlyData.push({
        month,
        count,
        fill: `hsl(${220 + index * 10}, 70%, 50%)`
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
      const quantity = drugCriminals.length * (Math.random() * 50 + 10);
      seizureData.push({
        drug,
        quantity: Math.round(quantity * 100) / 100,
        fill: `hsl(${120 + index * 60}, 70%, 50%)`
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
        total: arrested + absconding
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
        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 ${selectedStats === 'FIR' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-blue-300'}`}
        onClick={() => setSelectedStats('FIR')}
      >
        <CardHeader className="text-center py-8">
          <CardTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">FIR STATISTICS</CardTitle>
          <p className="text-muted-foreground mt-2">View comprehensive FIR registration statistics and trends</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 ${selectedStats === 'SEIZURE' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-border hover:border-green-300'}`}
        onClick={() => setSelectedStats('SEIZURE')}
      >
        <CardHeader className="text-center py-8">
          <CardTitle className="text-xl font-bold text-green-600 dark:text-green-400">SEIZURE STATISTICS</CardTitle>
          <p className="text-muted-foreground mt-2">Analyze drug seizure data and quantities by type</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 ${selectedStats === 'ARREST' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' : 'border-border hover:border-purple-300'}`}
        onClick={() => setSelectedStats('ARREST')}
      >
        <CardHeader className="text-center py-8">
          <CardTitle className="text-xl font-bold text-purple-600 dark:text-purple-400">ARREST STATISTICS</CardTitle>
          <p className="text-muted-foreground mt-2">Monitor arrest rates and status by category</p>
        </CardHeader>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <Card className="mb-6 border">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-lg font-semibold">Filter Parameters</CardTitle>
        <p className="text-sm text-muted-foreground">Select one or more parameters to filter the statistics</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Drug Type</label>
            <Select value={filters.drug} onValueChange={(value) => handleFilterChange('drug', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select drug type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drug Types</SelectItem>
                {drugTypes.map(drug => (
                  <SelectItem key={drug} value={drug}>{drug}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Year</label>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Accused Category</label>
            <Select value={filters.accusedCategory} onValueChange={(value) => handleFilterChange('accusedCategory', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
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
        
        <Button 
          onClick={generateMetrics} 
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          Generate Analytics Report
        </Button>
      </CardContent>
    </Card>
  );

  const renderMetrics = () => {
    if (!showMetrics) return null;

    const chartConfig = {
      count: {
        label: "Count",
        color: "hsl(var(--chart-1))",
      },
      quantity: {
        label: "Quantity",
        color: "hsl(var(--chart-2))",
      },
      arrested: {
        label: "Arrested",
        color: "hsl(var(--chart-3))",
      },
      absconding: {
        label: "Absconding",
        color: "hsl(var(--chart-4))",
      },
    };

    return (
      <div className="space-y-8">
        {selectedStats === 'FIR' && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b">
              <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-200">FIR Registration Analysis</CardTitle>
              <p className="text-blue-600 dark:text-blue-400">Monthly trends and patterns in FIR registrations</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateFIRStatsData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]} 
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedStats === 'SEIZURE' && (
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-b">
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-200">Drug Seizure Analysis</CardTitle>
              <p className="text-green-600 dark:text-green-400">Comprehensive breakdown of seized substances by type and quantity</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Pie
                      data={generateSeizureStatsData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="quantity"
                      label={({ drug, quantity }) => `${drug}: ${quantity}kg`}
                      labelLine={false}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
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
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-b">
              <CardTitle className="text-xl font-bold text-purple-800 dark:text-purple-200">Arrest Statistics Overview</CardTitle>
              <p className="text-purple-600 dark:text-purple-400">Detailed analysis of arrest rates versus absconding cases by category</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateArrestStatsData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis 
                      dataKey="category" 
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="arrested" stackId="a" fill="hsl(var(--chart-3))" name="Arrested" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="absconding" stackId="a" fill="hsl(var(--chart-4))" name="Absconding" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Executive Summary Card - keep existing code */}
        <Card className="border-2 border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-b">
            <CardTitle className="text-xl font-bold text-orange-800 dark:text-orange-200">Executive Summary</CardTitle>
            <p className="text-orange-600 dark:text-orange-400">Key performance indicators and statistics overview</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{getFilteredData().length}</div>
                <div className="text-sm font-medium text-blue-500 dark:text-blue-300 mt-2">Total Cases</div>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {getFilteredData().filter(c => c.presentStatus === 'Arrested').length}
                </div>
                <div className="text-sm font-medium text-green-500 dark:text-green-300 mt-2">Arrested</div>
              </div>
              <div className="text-center p-6 bg-red-50 dark:bg-red-950 rounded-xl border border-red-200 dark:border-red-800">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {getFilteredData().filter(c => c.presentStatus === 'Absconding').length}
                </div>
                <div className="text-sm font-medium text-red-500 dark:text-red-300 mt-2">Absconding</div>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-950 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {[...new Set(getFilteredData().map(c => c.drugType))].length}
                </div>
                <div className="text-sm font-medium text-purple-500 dark:text-purple-300 mt-2">Drug Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="border-b pb-6">
          <h1 className="text-4xl font-bold text-foreground">Crime Statistics Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">Comprehensive crime data analytics and reporting system</p>
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
