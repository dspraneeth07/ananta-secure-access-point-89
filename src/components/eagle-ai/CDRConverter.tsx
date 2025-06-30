
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
  cellId?: string;
  roamingNetwork?: string;
  serviceType?: string;
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
        console.log('File uploaded, content length:', content.length);
      };
      reader.readAsText(file);
    }
  };

  const parseCDRData = (data: string): CDRRecord[] => {
    console.log('Starting CDR parsing, data length:', data.length);
    
    if (!data || data.trim().length === 0) {
      toast.error('No data to parse');
      return [];
    }

    const lines = data.split('\n').filter(line => line.trim());
    console.log('Total lines found:', lines.length);
    
    const records: CDRRecord[] = [];
    let headerIndex = -1;
    let headers: string[] = [];

    // Find header line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('Target') && line.includes('PARTY') || 
          line.includes('A PARTY') || 
          line.includes('B PARTY') ||
          (line.split('\t').length > 5 && line.includes('Call'))) {
        headerIndex = i;
        headers = line.split('\t').map(h => h.trim());
        console.log('Found headers at line', i, ':', headers);
        break;
      }
    }

    // If no proper header found, try to detect columns automatically
    if (headerIndex === -1) {
      // Look for lines with multiple tab-separated values
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i].trim();
        const parts = line.split('\t');
        if (parts.length >= 8 && !line.includes('Vodafone') && !line.includes('Report')) {
          headerIndex = i - 1;
          headers = ['Target_A_Party', 'Call_Type', 'Connection_Type', 'B_Party', 'LRN_B_Party', 'Translation_LRN', 'Call_Date', 'Call_Time', 'Duration', 'First_BTS_Location', 'First_Cell_ID', 'Last_BTS_Location', 'Last_Cell_ID', 'SMS_Centre', 'Service_Type', 'IMEI', 'IMSI', 'Call_Forwarding', 'Roaming_Network', 'MSC_ID'];
          console.log('Auto-detected headers:', headers);
          break;
        }
      }
    }

    const dataStartIndex = headerIndex + 1;
    console.log('Data starts at line:', dataStartIndex);

    // Parse data lines
    for (let i = dataStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines, separators, and info lines
      if (!line || 
          line.includes('----') || 
          line.includes('Vodafone') || 
          line.includes('MSISDN') ||
          line.includes('Report Type') ||
          line.includes('From Date') ||
          line.includes('Till Date') ||
          line.length < 10) {
        continue;
      }

      const fields = line.split('\t').map(field => field.trim());
      
      if (fields.length >= 8) { // Minimum fields required
        const record: CDRRecord = {
          partyA: fields[0] || '',
          callType: fields[1] || '',
          partyB: fields[3] || fields[1] || '',
          duration: fields[8] || fields[7] || '0',
          date: fields[6] || fields[5] || '',
          time: fields[7] || fields[6] || '',
          location: fields[9] || fields[10] || '',
          imei: fields[15] || fields[14] || '',
          imsi: fields[16] || fields[15] || '',
          cellId: fields[10] || fields[11] || '',
          roamingNetwork: fields[18] || fields[17] || '',
          serviceType: fields[14] || fields[13] || ''
        };

        // Add all fields with their indices for reference
        fields.forEach((field, index) => {
          record[`field_${index}`] = field;
          if (headers[index]) {
            record[headers[index].replace(/\s+/g, '_')] = field;
          }
        });

        records.push(record);
      }
    }

    console.log('Parsed records count:', records.length);
    return records;
  };

  const generateExcelData = (records: CDRRecord[]) => {
    console.log('Generating Excel data for', records.length, 'records');
    
    // Table 1 - Summary Analysis
    const summaryMap = new Map();
    
    records.forEach(record => {
      const phone = record.partyA;
      if (!summaryMap.has(phone)) {
        summaryMap.set(phone, {
          PHONE: phone,
          CONTACTS: new Set(),
          IN_CALLS: 0,
          OUT_CALLS: 0,
          TOTAL_CALLS: 0,
          IN_SMS: 0,
          OUT_SMS: 0,
          TOTAL_SMS: 0,
          CALL_DURATION: 0,
          FIRST_CALL_DATE: record.date,
          ROAMING_NETWORK: record.roamingNetwork || '',
          FIRST_LOCATION: record.location || ''
        });
      }

      const summary = summaryMap.get(phone);
      summary.CONTACTS.add(record.partyB);
      
      const callType = record.callType.toLowerCase();
      if (callType.includes('incoming') || callType.includes('inc')) {
        summary.IN_CALLS++;
      } else if (callType.includes('outgoing') || callType.includes('out')) {
        summary.OUT_CALLS++;
      }
      
      if (callType.includes('sms')) {
        if (callType.includes('incoming')) {
          summary.IN_SMS++;
        } else {
          summary.OUT_SMS++;
        }
        summary.TOTAL_SMS++;
      } else {
        summary.TOTAL_CALLS++;
      }
      
      const duration = parseInt(record.duration) || 0;
      summary.CALL_DURATION += duration;
    });

    // Convert summary map to array
    const summaryData = Array.from(summaryMap.values()).map(item => ({
      ...item,
      CONTACTS: item.CONTACTS.size
    }));

    return {
      summary: summaryData,
      callDetails: records,
      incomingAnalysis: records.filter(r => r.callType.toLowerCase().includes('incoming')),
      outgoingAnalysis: records.filter(r => r.callType.toLowerCase().includes('outgoing')),
      imeiAnalysis: records.filter(r => r.imei && r.imei.length > 5),
      contactAnalysis: records,
      locationAnalysis: records.filter(r => r.location && r.location.length > 3),
      smsAnalysis: records.filter(r => r.callType.toLowerCase().includes('sms'))
    };
  };

  const convertToCSV = (data: any[], headers: string[]) => {
    if (!data || data.length === 0) {
      return headers.join(',') + '\n';
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          const stringValue = value.toString().replace(/"/g, '""');
          return `"${stringValue}"`;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    if (!processedRecords.length) {
      toast.error('No data to download');
      return;
    }

    console.log('Starting Excel download for', processedRecords.length, 'records');
    
    const excelData = generateExcelData(processedRecords);
    
    // Define all sheets with their data and headers
    const sheets = [
      { 
        name: 'Summary_Analysis', 
        data: excelData.summary, 
        headers: ['PHONE', 'CONTACTS', 'IN_CALLS', 'OUT_CALLS', 'TOTAL_CALLS', 'IN_SMS', 'OUT_SMS', 'TOTAL_SMS', 'CALL_DURATION', 'FIRST_CALL_DATE', 'ROAMING_NETWORK', 'FIRST_LOCATION'] 
      },
      { 
        name: 'Call_Details', 
        data: excelData.callDetails, 
        headers: ['partyA', 'partyB', 'callType', 'duration', 'date', 'time', 'location', 'imei', 'imsi', 'cellId', 'roamingNetwork', 'serviceType'] 
      },
      { 
        name: 'Incoming_Analysis', 
        data: excelData.incomingAnalysis, 
        headers: ['partyA', 'partyB', 'duration', 'date', 'time', 'location', 'imei'] 
      },
      { 
        name: 'Outgoing_Analysis', 
        data: excelData.outgoingAnalysis, 
        headers: ['partyA', 'partyB', 'duration', 'date', 'time', 'location', 'imei'] 
      },
      { 
        name: 'IMEI_Analysis', 
        data: excelData.imeiAnalysis, 
        headers: ['partyA', 'imei', 'callType', 'duration', 'date', 'location'] 
      },
      { 
        name: 'Contact_Analysis', 
        data: excelData.contactAnalysis, 
        headers: ['partyA', 'partyB', 'callType', 'duration', 'date', 'location'] 
      },
      { 
        name: 'Location_Analysis', 
        data: excelData.locationAnalysis, 
        headers: ['partyA', 'date', 'location', 'callType', 'cellId'] 
      },
      { 
        name: 'SMS_Analysis', 
        data: excelData.smsAnalysis, 
        headers: ['partyA', 'partyB', 'callType', 'date', 'time', 'location'] 
      }
    ];

    // Download each sheet as CSV
    let downloadCount = 0;
    const timestamp = new Date().getTime();
    
    sheets.forEach((sheet, index) => {
      setTimeout(() => {
        const csvContent = convertToCSV(sheet.data, sheet.headers);
        downloadCSV(csvContent, `CDR_${sheet.name}_${timestamp}.csv`);
        downloadCount++;
        
        if (downloadCount === 1) {
          toast.success(`Started downloading ${sheets.length} Excel sheets as CSV files`);
        }
      }, index * 500); // Stagger downloads by 500ms
    });

    console.log(`Initiated download of ${sheets.length} sheets`);
  };

  const convertToExcel = async () => {
    if (!rawData || rawData.trim().length === 0) {
      toast.error('Please upload or paste CDR data first');
      return;
    }

    setIsConverting(true);
    
    try {
      console.log('Starting CDR conversion...');
      const records = parseCDRData(rawData);
      
      if (records.length === 0) {
        toast.error('No valid CDR records found in the uploaded data');
        setIsConverting(false);
        return;
      }
      
      setProcessedRecords(records);
      
      const results = {
        totalRecords: records.length,
        processedSheets: 8,
        uniqueNumbers: new Set(records.map(r => r.partyA)).size,
        tables: [
          'Summary Analysis', 'Call Details', 'Incoming Analysis', 'Outgoing Analysis',
          'IMEI Analysis', 'Contact Analysis', 'Location Analysis', 'SMS Analysis'
        ]
      };
      
      setConversionResults(results);
      toast.success(`CDR conversion completed: ${records.length} records processed into ${results.processedSheets} analysis sheets`);
      
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert CDR data. Please check the file format.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            CDR Raw File to Excel Converter - Enhanced Parser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cdr-file" className="block text-sm font-medium mb-2">
                Upload CDR Raw File (TXT, CSV, or Excel format)
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="cdr-file"
                  type="file"
                  accept=".txt,.csv,.xlsx,.xls"
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

            {rawData && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  ✅ CDR data loaded ({rawData.length} characters, {rawData.split('\n').length} lines)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {conversionResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Conversion Results - Successfully Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{conversionResults.totalRecords.toLocaleString()}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Total Records</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{conversionResults.processedSheets}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Analysis Sheets</div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{conversionResults.uniqueNumbers}</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Unique Numbers</div>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                  <Button onClick={downloadExcel} className="w-full" disabled={!processedRecords.length}>
                    <Download className="w-4 h-4 mr-2" />
                    Download All Sheets
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Generated Analysis Sheets:</h4>
                  <ul className="text-sm space-y-1">
                    {conversionResults.tables.map((table: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <FileSpreadsheet className="w-3 h-3 mr-2 text-green-600" />
                        {table}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Processing Summary:</h4>
                  <div className="text-sm space-y-1">
                    <p>✅ CDR data successfully parsed</p>
                    <p>✅ {conversionResults.totalRecords} call records extracted</p>
                    <p>✅ {conversionResults.uniqueNumbers} unique phone numbers identified</p>
                    <p>✅ 8 detailed analysis sheets generated</p>
                    <p>✅ Ready for download in CSV format</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {processedRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Processed Data Preview - First 10 Records</CardTitle>
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
                        <th className="border border-gray-300 p-2">Time</th>
                        <th className="border border-gray-300 p-2">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedRecords.slice(0, 10).map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2">{record.partyA}</td>
                          <td className="border border-gray-300 p-2">{record.partyB}</td>
                          <td className="border border-gray-300 p-2">{record.callType}</td>
                          <td className="border border-gray-300 p-2">{record.duration}</td>
                          <td className="border border-gray-300 p-2">{record.date}</td>
                          <td className="border border-gray-300 p-2">{record.time}</td>
                          <td className="border border-gray-300 p-2">{record.location || 'N/A'}</td>
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
