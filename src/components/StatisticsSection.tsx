
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock data for accused status
const accusedStatusData = [
  { status: 'Arrested', count: 485, fill: '#22c55e' },
  { status: 'Absconding', count: 127, fill: '#ef4444' },
];

// Mock data for domicile status
const domicileData = [
  { state: 'Telangana', count: 450 },
  { state: 'Andhra Pradesh', count: 85 },
  { state: 'Karnataka', count: 32 },
  { state: 'Maharashtra', count: 28 },
  { state: 'Tamil Nadu', count: 17 },
];

// Mock data for case status
const caseStatusData = [
  { status: 'Under Investigation', count: 234, fill: '#3b82f6' },
  { status: 'Pending Trial', count: 189, fill: '#f59e0b' },
  { status: 'Chargesheet Created', count: 156, fill: '#10b981' },
  { status: 'Transfer to Other Dept', count: 45, fill: '#8b5cf6' },
  { status: 'Reassign', count: 32, fill: '#f97316' },
  { status: 'Transfer to Other PS', count: 28, fill: '#06b6d4' },
  { status: 'Reopened', count: 15, fill: '#84cc16' },
  { status: 'Disposed', count: 298, fill: '#6b7280' },
];

// Mock data for district-wise cases (31 districts of Telangana)
const districtData = [
  { district: 'Hyderabad', cases: 145 },
  { district: 'Rangareddy', cases: 98 },
  { district: 'Medchal-Malkajgiri', cases: 87 },
  { district: 'Sangareddy', cases: 76 },
  { district: 'Warangal Urban', cases: 65 },
  { district: 'Khammam', cases: 58 },
  { district: 'Nalgonda', cases: 52 },
  { district: 'Karimnagar', cases: 48 },
  { district: 'Nizamabad', cases: 45 },
  { district: 'Mahbubnagar', cases: 42 },
  { district: 'Warangal Rural', cases: 38 },
  { district: 'Adilabad', cases: 35 },
  { district: 'Suryapet', cases: 32 },
  { district: 'Siddipet', cases: 30 },
  { district: 'Medak', cases: 28 },
  { district: 'Jagtial', cases: 25 },
  { district: 'Jangaon', cases: 22 },
  { district: 'Bhadradri Kothagudem', cases: 20 },
  { district: 'Peddapalli', cases: 18 },
  { district: 'Kamareddy', cases: 16 },
  { district: 'Mahabubabad', cases: 14 },
  { district: 'Nirmal', cases: 12 },
  { district: 'Nagarkurnool', cases: 10 },
  { district: 'Wanaparthy', cases: 9 },
  { district: 'Yadadri Bhuvanagiri', cases: 8 },
  { district: 'Rajanna Sircilla', cases: 7 },
  { district: 'Vikarabad', cases: 6 },
  { district: 'Asifabad', cases: 5 },
  { district: 'Mancherial', cases: 4 },
  { district: 'Jayashankar Bhupalpally', cases: 3 },
  { district: 'Mulugu', cases: 2 },
];

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
  cases: {
    label: "Cases",
    color: "hsl(var(--chart-2))",
  },
};

const StatisticsSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accused Status Report */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Accused Status Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accusedStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {accusedStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Accused Domicile Status Report */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Accused Domicile Status (State-wise)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domicileData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Case Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">State-wise Case Status Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseStatusData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={150} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* District-wise Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">District-wise Reported Cases (31 Districts)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="district" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cases" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsSection;
