import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CDRRecord {
  partyA: string;
  partyB: string;
  callType: string;
  duration: string;
  date: string;
  time: string;
  location: string;
  imei?: string;
  imsi?: string;
  [key: string]: any;
}

const CDRConverter = () => {
  const [rawData, setRawData] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResults, setConversionResults] = useState<any>(null);
  const [processedRecords, setProcessedRecords] = useState<CDRRecord[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setRawData(content);
        toast.success('CDR file uploaded successfully');
      };
      reader.readAsText(file);
    }
  };

  const parseCDRData = (data: string): CDRRecord[] => {
    const lines = data.split('\n').filter(line => line.trim());
    const records: CDRRecord[] = [];
    let dataStartIndex = -1;

    // Find data start (skip headers)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('Target /A PARTY NUMBER') || line.includes('PARTY NUMBER')) {
        dataStartIndex = i + 1;
        break;
      }
    }

    if (dataStartIndex === -1) dataStartIndex = 0;

    // Parse each data line
    for (let i = dataStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line || line.includes('----') || line.includes('Vodafone') || line.includes('MSISDN')) {
        continue;
      }

      const fields = line.split('\t').map(field => field.trim());
      
      if (fields.length >= 9) {
        const record: CDRRecord = {
          partyA: fields[0] || '',
          partyB: fields[3] || '',
          callType: fields[1] || '',
          duration: fields[8] || '0',
          date: fields[6] || '',
          time: fields[7] || '',
          location: fields[9] || '',
          imei: fields[15] || '',
          imsi: fields[16] || '',
        };

        // Add all other fields
        fields.forEach((field, index) => {
          record[`field_${index}`] = field;
        });

        records.push(record);
      }
    }

    return records;
  };

  const generateExcelData = (records: CDRRecord[]) => {
    // Table 1 - Summary
    const summaryData = records.reduce((acc: any, record) => {
      const phone = record.partyA;
      if (!acc[phone]) {
        acc[phone] = {
          PHONE: phone,
          OTHER: new Set(),
          'IN CALLS': 0,
          'OUT CALLS': 0,
          'TOT CALLS': 0,
          'IN SMS': 0,
          'OUT SMS': 0,
          'TOT SMS': 0,
          'Call Duration': 0,
          'Call date': record.date,
          'Roaming Network/Circle': record.field_18 || '',
          'First BTS Location': record.location
        };
      }

      acc[phone].OTHER.add(record.partyB);
      
      if (record.callType.toLowerCase().includes('incoming')) {
        acc[phone]['IN CALLS']++;
      } else {
        acc[phone]['OUT CALLS']++;
      }
      
      acc[phone]['TOT CALLS']++;
      acc[phone]['Call Duration'] += parseInt(record.duration) || 0;

      return acc;
    }, {});

    // Convert sets to counts
    Object.values(summaryData).forEach((entry: any) => {
      entry.OTHER = entry.OTHER.size;
    });

    return {
      summary: Object.values(summaryData),
      callDetails: records,
      incomingAnalysis: records.filter(r => r.callType.toLowerCase().includes('incoming')),
      outgoingAnalysis: records.filter(r => r.callType.toLowerCase().includes('outgoing')),
      imeiAnalysis: records.filter(r => r.imei),
      contactAnalysis: records,
      locationAnalysis: records.filter(r => r.location)
    };
  };

  const convertToCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadExcel = () => {
    if (!processedRecords.length) {
      toast.error('No data to download');
      return;
    }

    const excelData = generateExcelData(processedRecords);
    
    // Create multiple CSV files (simulating Excel sheets)
    const sheets = [
      { name: 'Summary', data: excelData.summary, headers: ['PHONE', 'OTHER', 'IN CALLS', 'OUT CALLS', 'TOT CALLS', 'Call Duration', 'First BTS Location'] },
      { name: 'Call_Details', data: excelData.callDetails, headers: ['partyA', 'partyB', 'callType', 'duration', 'date', 'time', 'location', 'imei'] },
      { name: 'Incoming_Analysis', data: excelData.incomingAnalysis, headers: ['partyA', 'partyB', 'duration', 'date', 'location'] },
      { name: 'Outgoing_Analysis', data: excelData.outgoingAnalysis, headers: ['partyA', 'partyB', 'duration', 'date', 'location'] },
      { name: 'IMEI_Analysis', data: excelData.imeiAnalysis, headers: ['partyA', 'imei', 'callType', 'duration', 'date'] },
      { name: 'Contact_Analysis', data: excelData.contactAnalysis, headers: ['partyA', 'partyB', 'callType', 'duration', 'location'] },
      { name: 'Location_Analysis', data: excelData.locationAnalysis, headers: ['partyA', 'date', 'location', 'callType'] }
    ];

    // Download each sheet as CSV
    sheets.forEach(sheet => {
      const csvContent = convertToCSV(sheet.data, sheet.headers);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `CDR_${sheet.name}_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    toast.success(`Downloaded ${sheets.length} Excel sheets as CSV files`);
  };

  const convertToExcel = async () => {
    if (!rawData) {
      toast.error('Please upload or paste CDR data first');
      return;
    }

    setIsConverting(true);
    
    try {
      const records = parseCDRData(rawData);
      setProcessedRecords(records);
      
      const results = {
        totalRecords: records.length,
        processedSheets: 7,
        downloadUrl: '#',
        tables: [
          'Summary Table', 'Call Details', 'Incoming Calls', 'Outgoing Calls',
          'IMEI Analysis', 'Contact Analysis', 'Location Analysis'
        ]
      };
      
      setConversionResults(results);
      toast.success(`CDR conversion completed: ${records.length} records processed`);
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert CDR data');
    } finally {
      setIsConverting(false);
    }
  };

  const tableStructures = [
    {
      name: 'Table 1 - Summary',
      columns: ['PHONE', 'OTHER', 'IN CALLS', 'OUT CALLS', 'TOT CALLS', 'IN SMS', 'OUT SMS', 'TOT SMS', 'Call Duration', 'Call date', 'Roaming Network/Circle', 'First BTS Location']
    },
    {
      name: 'Table 2 - Call Details',
      columns: ['Target /A PARTY NUMBER', 'B PARTY NUMBER', 'Translation of LRN', 'Call Initiation Time', 'Call Duration', 'Service Type', 'IMEI', 'IMSI', 'First Cell Global Id', 'Roaming Network/Circle', 'First BTS Location']
    },
    {
      name: 'Table 3 - Incoming Analysis',
      columns: ['Target /A PARTY NUMBER', 'B PARTY NUMBER', 'Call Initiation Time', 'Call Duration', 'CALL_TYPE', 'IMEI', 'IMSI', 'First Cell Global Id', 'Roaming Network/Circle', 'Last BTS Location']
    },
    {
      name: 'Table 4 - Outgoing Analysis',
      columns: ['Target /A PARTY NUMBER', 'B PARTY NUMBER', 'Call Initiation Time', 'Call Duration', 'CALL_TYPE', 'IMEI', 'IMSI', 'Last Cell Global Id', 'Roaming Network/Circle', 'Last BTS Location']
    },
    {
      name: 'Table 5 - IMEI Analysis',
      columns: ['Target /A PARTY NUMBER', 'IMEI', 'TOT CALLS', 'CALL_TYPE', 'Call Duration', 'Call date', 'Call Forwarding Number', 'Translation of LRN', 'First BTS Location']
    },
    {
      name: 'Table 6 - Contact Analysis',
      columns: ['Target /A PARTY NUMBER', 'B PARTY NUMBER', 'CALL_TYPE', 'TOT CALLS', 'Call Duration', 'Call date', 'Roaming Network/Circle', 'First BTS Location']
    },
    {
      name: 'Table 7 - First Location Analysis',
      columns: ['Target /A PARTY NUMBER', 'Call date', 'First Cell Global Id', 'CALL_TYPE', 'First BTS Location', 'LAT', 'LONG', 'AZIMUTH']
    },
    {
      name: 'Table 8 - Last Location Analysis',
      columns: ['Target /A PARTY NUMBER', 'Call date', 'Last Cell Global Id', 'CALL_TYPE', 'Last BTS Location', 'LAT', 'LONG', 'AZIMUTH']
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            CDR Raw File to Excel Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cdr-file" className="block text-sm font-medium mb-2">
                Upload CDR Raw File
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="cdr-file"
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button 
                  onClick={convertToExcel}
                  disabled={isConverting || !rawData}
                  className="flex items-center gap-2"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4" />
                      Convert to Excel
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="raw-data" className="block text-sm font-medium mb-2">
                Or Paste Raw CDR Data
              </Label>
              <Textarea
                id="raw-data"
                placeholder="Paste your raw CDR data here..."
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {conversionResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Conversion Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{conversionResults.totalRecords.toLocaleString()}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Total Records</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{conversionResults.processedSheets}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Excel Sheets</div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <Button onClick={downloadExcel} className="w-full" disabled={!processedRecords.length}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Excel ({processedRecords.length} records)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {processedRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Processed Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Party A</th>
                        <th className="border border-gray-300 p-2">Party B</th>
                        <th className="border border-gray-300 p-2">Call Type</th>
                        <th className="border border-gray-300 p-2">Duration</th>
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedRecords.slice(0, 10).map((record, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">{record.partyA}</td>
                          <td className="border border-gray-300 p-2">{record.partyB}</td>
                          <td className="border border-gray-300 p-2">{record.callType}</td>
                          <td className="border border-gray-300 p-2">{record.duration}</td>
                          <td className="border border-gray-300 p-2">{record.date}</td>
                          <td className="border border-gray-300 p-2">{record.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {processedRecords.length > 10 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Showing first 10 of {processedRecords.length} records
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CDRConverter;
