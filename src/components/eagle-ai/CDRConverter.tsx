
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const CDRConverter = () => {
  const [rawData, setRawData] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResults, setConversionResults] = useState<any>(null);

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

  const convertToExcel = async () => {
    if (!rawData) {
      toast.error('Please upload or paste CDR data first');
      return;
    }

    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      const mockResults = {
        totalRecords: 15420,
        processedSheets: 8,
        downloadUrl: '#',
        tables: [
          'Summary Table', 'Call Details', 'Incoming Calls', 'Outgoing Calls',
          'IMEI Analysis', 'Contact Analysis', 'Location Analysis', 'Timeline Analysis'
        ]
      };
      
      setConversionResults(mockResults);
      setIsConverting(false);
      toast.success('CDR conversion completed successfully');
    }, 3000);
  };

  const downloadExcel = () => {
    // In a real implementation, this would trigger the actual download
    toast.success('Excel file download started');
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
                  <Button onClick={downloadExcel} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Excel Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tableStructures.map((table, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 text-blue-600">{table.name}</h4>
                    <div className="space-y-1">
                      {table.columns.map((column, colIndex) => (
                        <div key={colIndex} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {column}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CDRConverter;
