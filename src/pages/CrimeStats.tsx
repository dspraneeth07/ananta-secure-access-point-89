
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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
    drug: '',
    location: '',
    year: '',
    accusedCategory: ''
  });
  const [showMetrics, setShowMetrics] = useState(false);

  const drugOptions = ['Cannabis', 'Heroin', 'Cocaine', 'Ganja', 'Opium', 'MDMA', 'Amphetamine'];
  const locationOptions = ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Nalgonda'];
  const yearOptions = ['2024', '2023', '2022', '2021', '2020'];
  const categoryOptions = ['Peddler', 'Consumer', 'Supplier', 'Kingpin', 'Transporter'];

  // Mock data for different stats
  const firStatsData = [
    { month: 'Jan', count: 45, fill: '#3b82f6' },
    { month: 'Feb', count: 52, fill: '#3b82f6' },
    { month: 'Mar', count: 38, fill: '#3b82f6' },
    { month: 'Apr', count: 61, fill: '#3b82f6' },
    { month: 'May', count: 55, fill: '#3b82f6' },
    { month: 'Jun', count: 67, fill: '#3b82f6' },
  ];

  const seizureStatsData = [
    { drug: 'Cannabis', quantity: 125, fill: '#10b981' },
    { drug: 'Heroin', quantity: 45, fill: '#f59e0b' },
    { drug: 'Cocaine', quantity: 23, fill: '#ef4444' },
    { drug: 'Ganja', quantity: 89, fill: '#8b5cf6' },
    { drug: 'Opium', quantity: 34, fill: '#06b6d4' },
  ];

  const arrestStatsData = [
    { category: 'Peddler', arrested: 85, absconding: 15, fill: '#22c55e' },
    { category: 'Consumer', arrested: 120, absconding: 8, fill: '#3b82f6' },
    { category: 'Supplier', arrested: 45, absconding: 12, fill: '#f59e0b' },
    { category: 'Kingpin', arrested: 8, absconding: 5, fill: '#ef4444' },
  ];

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateMetrics = () => {
    setShowMetrics(true);
  };

  const renderStatsSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${selectedStats === 'FIR' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedStats('FIR')}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl">FIR STATS</CardTitle>
          <p className="text-muted-foreground">View FIR registration statistics</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${selectedStats === 'SEIZURE' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedStats('SEIZURE')}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl">SEIZURE STATS</CardTitle>
          <p className="text-muted-foreground">View drug seizure statistics</p>
        </CardHeader>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${selectedStats === 'ARREST' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSelectedStats('ARREST')}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl">ARREST STATS</CardTitle>
          <p className="text-muted-foreground">View arrest statistics</p>
        </CardHeader>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Drug</label>
            <Select value={filters.drug} onValueChange={(value) => handleFilterChange('drug', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select drug type" />
              </SelectTrigger>
              <SelectContent>
                {drugOptions.map(drug => (
                  <SelectItem key={drug} value={drug}>{drug}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Location</label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Year</label>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
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
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={generateMetrics} className="w-full">
          Generate Metrics
        </Button>
      </CardContent>
    </Card>
  );

  const renderMetrics = () => {
    if (!showMetrics) return null;

    return (
      <div className="space-y-6">
        {selectedStats === 'FIR' && (
          <Card>
            <CardHeader>
              <CardTitle>FIR Registration Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={firStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {selectedStats === 'SEIZURE' && (
          <Card>
            <CardHeader>
              <CardTitle>Drug Seizure Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={seizureStatsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="quantity"
                      label={({ drug, quantity }) => `${drug}: ${quantity}kg`}
                    >
                      {seizureStatsData.map((entry, index) => (
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
          <Card>
            <CardHeader>
              <CardTitle>Arrest Statistics by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={arrestStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="arrested" stackId="a" fill="#22c55e" />
                    <Bar dataKey="absconding" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crime Statistics</h1>
          <p className="text-muted-foreground">Comprehensive crime data and analytics</p>
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
