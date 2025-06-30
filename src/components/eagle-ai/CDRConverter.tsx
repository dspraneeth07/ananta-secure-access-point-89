
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CDRRecord {
  targetParty: string;
  callType: string;
  connectionType: string;
  bPartyNumber: string;
  lrnBParty: string;
  translationLRN: string;
  callDate: string;
  callInitiationTime: string;
  callDuration: number;
  firstBTSLocation: string;
  firstCellGlobalId: string;
  lastBTSLocation: string;
  lastCellGlobalId: string;
  smsCentreNumber: string;
  serviceType: string;
  imei: string;
  imsi: string;
  callForwardingNumber: string;
  roamingNetwork: string;
  mscId: string;
  inTG: string;
  outTG: string;
  ipAddress: string;
  portNo: string;
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

    const lines = data.split('\n').map(line => line.trim()).filter(line => line);
    console.log('Total lines found:', lines.length);
    
    if (lines.length < 13) {
      toast.error('CDR data must have at least 13 rows. Headers should be in row 11, data starts from row 13.');
      return [];
    }

    const records: CDRRecord[] = [];
    
    // Headers are in row 11 (index 10), data starts from row 13 (index 12)
    const headerLine = lines[10]; // Row 11 (0-indexed)
    console.log('Header line (row 11):', headerLine);
    
    if (!headerLine || !headerLine.includes('Target /A PARTY NUMBER')) {
      toast.error('Headers not found in row 11. Expected format: Target /A PARTY NUMBER should be the first column.');
      return [];
    }

    const headers = headerLine.split('\t').map(h => h.trim());
    console.log('Found headers:', headers.length, 'columns');

    // Validate essential headers
    const requiredHeaders = [
      'Target /A PARTY NUMBER', 'CALL_TYPE', 'B PARTY NUMBER', 'Call date',
      'Call Initiation Time', 'Call Duration', 'First BTS Location'
    ];

    const missingHeaders = requiredHeaders.filter(reqHeader => 
      !headers.some(header => header.includes(reqHeader.split(' ')[0]))
    );

    if (missingHeaders.length > 0) {
      toast.warning(`Some expected headers missing: ${missingHeaders.join(', ')}. Proceeding with available data.`);
    }

    // Parse data starting from row 13 (index 12)
    let validRecords = 0;
    let invalidRecords = 0;

    for (let i = 12; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line || line.length < 10) {
        continue; // Skip empty or very short lines
      }

      const fields = line.split('\t').map(field => field.trim());
      
      // Ensure we have minimum required fields
      if (fields.length >= 9 && fields[0] && fields[3]) { // Must have target party and B party
        const record: CDRRecord = {
          targetParty: fields[0] || '',
          callType: fields[1] || '',
          connectionType: fields[2] || '',
          bPartyNumber: fields[3] || '',
          lrnBParty: fields[4] || '',
          translationLRN: fields[5] || '',
          callDate: fields[6] || '',
          callInitiationTime: fields[7] || '',
          callDuration: parseInt(fields[8]) || 0,
          firstBTSLocation: fields[9] || '',
          firstCellGlobalId: fields[10] || '',
          lastBTSLocation: fields[11] || '',
          lastCellGlobalId: fields[12] || '',
          smsCentreNumber: fields[13] || '',
          serviceType: fields[14] || '',
          imei: fields[15] || '',
          imsi: fields[16] || '',
          callForwardingNumber: fields[17] || '',
          roamingNetwork: fields[18] || '',
          mscId: fields[19] || '',
          inTG: fields[20] || '',
          outTG: fields[21] || '',
          ipAddress: fields[22] || '',
          portNo: fields[23] || ''
        };

        // Additional validation
        if (record.targetParty !== record.bPartyNumber && record.targetParty.length >= 6) {
          records.push(record);
          validRecords++;
        } else {
          invalidRecords++;
        }
      } else {
        invalidRecords++;
      }
    }

    console.log(`Parsing complete: ${validRecords} valid records, ${invalidRecords} invalid/skipped`);
    
    if (records.length === 0) {
      toast.error('No valid CDR records found. Please check data format - headers in row 11, data from row 13.');
    } else {
      toast.success(`Successfully parsed ${records.length} CDR records`);
    }
    
    return records;
  };

  const generateExcelData = (records: CDRRecord[]) => {
    console.log('Generating Excel data for', records.length, 'records');
    
    // Enhanced Summary Analysis
    const summaryMap = new Map();
    
    records.forEach(record => {
      const phone = record.targetParty;
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
          FIRST_CALL_DATE: record.callDate,
          LAST_CALL_DATE: record.callDate,
          ROAMING_NETWORK: record.roamingNetwork || '',
          UNIQUE_LOCATIONS: new Set(),
          IMEI_COUNT: new Set(),
          CONTACT_FREQUENCY: new Map(),
          PEAK_HOURS: new Map(),
          CALL_PATTERNS: []
        });
      }

      const summary = summaryMap.get(phone);
      summary.CONTACTS.add(record.bPartyNumber);
      
      // Contact frequency tracking
      const contactFreq = summary.CONTACT_FREQUENCY.get(record.bPartyNumber) || 0;
      summary.CONTACT_FREQUENCY.set(record.bPartyNumber, contactFreq + 1);
      
      // Peak hour analysis
      const hour = record.callInitiationTime.split(':')[0];
      if (hour) {
        const hourCount = summary.PEAK_HOURS.get(hour) || 0;
        summary.PEAK_HOURS.set(hour, hourCount + 1);
      }
      
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
      
      summary.CALL_DURATION += record.callDuration;
      
      // Track last call date
      if (record.callDate > summary.LAST_CALL_DATE) {
        summary.LAST_CALL_DATE = record.callDate;
      }
      
      if (record.imei && record.imei.length > 10) {
        summary.IMEI_COUNT.add(record.imei);
      }
      
      if (record.firstBTSLocation && record.firstBTSLocation.length > 5) {
        summary.UNIQUE_LOCATIONS.add(record.firstBTSLocation);
      }
      if (record.lastBTSLocation && record.lastBTSLocation.length > 5) {
        summary.UNIQUE_LOCATIONS.add(record.lastBTSLocation);
      }
    });

    // Convert summary map to array with enhanced metrics
    const summaryData = Array.from(summaryMap.values()).map(item => {
      const topContact = Array.from(item.CONTACT_FREQUENCY.entries())
        .sort((a, b) => b[1] - a[1])[0];
      
      const peakHour = Array.from(item.PEAK_HOURS.entries())
        .sort((a, b) => b[1] - a[1])[0];

      return {
        PHONE: item.PHONE,
        TOTAL_CONTACTS: item.CONTACTS.size,
        IN_CALLS: item.IN_CALLS,
        OUT_CALLS: item.OUT_CALLS,
        TOTAL_CALLS: item.TOTAL_CALLS,
        IN_SMS: item.IN_SMS,
        OUT_SMS: item.OUT_SMS,
        TOTAL_SMS: item.TOTAL_SMS,
        TOTAL_DURATION_MIN: Math.round(item.CALL_DURATION / 60),
        AVG_CALL_DURATION: item.TOTAL_CALLS > 0 ? Math.round(item.CALL_DURATION / item.TOTAL_CALLS) : 0,
        FIRST_CALL_DATE: item.FIRST_CALL_DATE,
        LAST_CALL_DATE: item.LAST_CALL_DATE,
        ROAMING_NETWORK: item.ROAMING_NETWORK,
        UNIQUE_LOCATIONS: item.UNIQUE_LOCATIONS.size,
        UNIQUE_IMEI: item.IMEI_COUNT.size,
        TOP_CONTACT: topContact ? topContact[0] : '',
        TOP_CONTACT_CALLS: topContact ? topContact[1] : 0,
        PEAK_HOUR: peakHour ? `${peakHour[0]}:00` : '',
        CALL_RATIO: item.TOTAL_CALLS > 0 ? (item.OUT_CALLS / item.TOTAL_CALLS * 100).toFixed(1) + '% OUT' : '0%'
      };
    });

    return {
      summary: summaryData,
      callDetails: records,
      incomingAnalysis: records.filter(r => r.callType.toLowerCase().includes('incoming')),
      outgoingAnalysis: records.filter(r => r.callType.toLowerCase().includes('outgoing')),
      imeiAnalysis: records.filter(r => r.imei && r.imei.length > 10),
      contactAnalysis: records,
      locationAnalysis: records.filter(r => r.firstBTSLocation && r.firstBTSLocation.length > 5),
      smsAnalysis: records.filter(r => r.callType.toLowerCase().includes('sms')),
      timeAnalysis: records.map(r => ({
        targetParty: r.targetParty,
        bPartyNumber: r.bPartyNumber,
        callDate: r.callDate,
        callTime: r.callInitiationTime,
        duration: r.callDuration,
        dayOfWeek: new Date(r.callDate).toLocaleDateString('en', { weekday: 'long' })
      }))
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
    
    const sheets = [
      { 
        name: 'Summary_Analysis', 
        data: excelData.summary, 
        headers: ['PHONE', 'TOTAL_CONTACTS', 'IN_CALLS', 'OUT_CALLS', 'TOTAL_CALLS', 'IN_SMS', 'OUT_SMS', 'TOTAL_SMS', 'TOTAL_DURATION_MIN', 'AVG_CALL_DURATION', 'FIRST_CALL_DATE', 'LAST_CALL_DATE', 'ROAMING_NETWORK', 'UNIQUE_LOCATIONS', 'UNIQUE_IMEI', 'TOP_CONTACT', 'TOP_CONTACT_CALLS', 'PEAK_HOUR', 'CALL_RATIO'] 
      },
      { 
        name: 'Call_Details', 
        data: excelData.callDetails, 
        headers: ['targetParty', 'bPartyNumber', 'callType', 'callDuration', 'callDate', 'callInitiationTime', 'firstBTSLocation', 'lastBTSLocation', 'imei', 'imsi', 'roamingNetwork', 'serviceType', 'connectionType'] 
      },
      { 
        name: 'Incoming_Analysis', 
        data: excelData.incomingAnalysis, 
        headers: ['targetParty', 'bPartyNumber', 'callDuration', 'callDate', 'callInitiationTime', 'firstBTSLocation', 'imei', 'roamingNetwork'] 
      },
      { 
        name: 'Outgoing_Analysis', 
        data: excelData.outgoingAnalysis, 
        headers: ['targetParty', 'bPartyNumber', 'callDuration', 'callDate', 'callInitiationTime', 'firstBTSLocation', 'imei', 'roamingNetwork'] 
      },
      { 
        name: 'IMEI_Analysis', 
        data: excelData.imeiAnalysis, 
        headers: ['targetParty', 'imei', 'callType', 'callDuration', 'callDate', 'firstBTSLocation', 'bPartyNumber'] 
      },
      { 
        name: 'Contact_Analysis', 
        data: excelData.contactAnalysis, 
        headers: ['targetParty', 'bPartyNumber', 'callType', 'callDuration', 'callDate', 'firstBTSLocation', 'roamingNetwork'] 
      },
      { 
        name: 'Location_Analysis', 
        data: excelData.locationAnalysis, 
        headers: ['targetParty', 'callDate', 'firstBTSLocation', 'lastBTSLocation', 'callType', 'firstCellGlobalId', 'bPartyNumber', 'callDuration'] 
      },
      { 
        name: 'SMS_Analysis', 
        data: excelData.smsAnalysis, 
        headers: ['targetParty', 'bPartyNumber', 'callType', 'callDate', 'callInitiationTime', 'firstBTSLocation', 'smsCentreNumber'] 
      },
      { 
        name: 'Time_Analysis', 
        data: excelData.timeAnalysis, 
        headers: ['targetParty', 'bPartyNumber', 'callDate', 'callTime', 'duration', 'dayOfWeek'] 
      }
    ];

    let downloadCount = 0;
    const timestamp = new Date().getTime();
    
    sheets.forEach((sheet, index) => {
      setTimeout(() => {
        const csvContent = convertToCSV(sheet.data, sheet.headers);
        downloadCSV(csvContent, `CDR_${sheet.name}_${timestamp}.csv`);
        downloadCount++;
        
        if (downloadCount === 1) {
          toast.success(`Started downloading ${sheets.length} analysis sheets as CSV files`);
        }
      }, index * 500); // Stagger downloads by 500ms
    });
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
        toast.error('No valid CDR records found. Please ensure headers are in row 11 and data starts from row 13.');
        setIsConverting(false);
        return;
      }
      
      setProcessedRecords(records);
      
      const results = {
        totalRecords: records.length,
        processedSheets: 9, // Increased to 9 sheets
        uniqueNumbers: new Set(records.map(r => r.targetParty)).size,
        uniqueContacts: new Set(records.map(r => r.bPartyNumber)).size,
        dateRange: {
          from: records.reduce((min, r) => r.callDate < min ? r.callDate : min, records[0]?.callDate || ''),
          to: records.reduce((max, r) => r.callDate > max ? r.callDate : max, records[0]?.callDate || '')
        },
        totalDuration: Math.round(records.reduce((sum, r) => sum + r.callDuration, 0) / 60), // in minutes
        tables: [
          'Summary Analysis', 'Call Details', 'Incoming Analysis', 'Outgoing Analysis',
          'IMEI Analysis', 'Contact Analysis', 'Location Analysis', 'SMS Analysis', 'Time Analysis'
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
            Enhanced CDR Raw File to Excel Converter - Row 11 Headers, Row 13+ Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📋 Format Requirements: Headers must be in row 11, data starts from row 13
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Expected columns: Target/A Party | Call Type | Connection Type | B Party | Call Date | Duration | BTS Locations | IMEI | etc.
              </p>
            </div>

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
                Or Paste Raw CDR Data (Headers in row 11, Data from row 13+)
              </Label>
              <Textarea
                id="raw-data"
                placeholder="Paste your raw CDR data here with headers in row 11 and data starting from row 13..."
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="min-h-32"
              />
            </div>

            {rawData && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ CDR data loaded ({rawData.length} characters, {rawData.split('\n').length} lines)
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Will parse headers from row 11 and data from row 13 onwards
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
                    <p>✅ Headers parsed from row 11</p>
                    <p>✅ Data extracted from row 13 onwards</p>
                    <p>✅ {conversionResults.totalRecords} call records processed</p>
                    <p>✅ {conversionResults.uniqueNumbers} unique phone numbers identified</p>
                    <p>✅ {conversionResults.uniqueContacts} unique contacts found</p>
                    <p>✅ {conversionResults.totalDuration} minutes total call duration</p>
                    <p>✅ Date range: {conversionResults.dateRange.from} to {conversionResults.dateRange.to}</p>
                    <p>✅ 9 detailed analysis sheets generated</p>
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
                        <th className="border border-gray-300 p-2">Target Party</th>
                        <th className="border border-gray-300 p-2">B Party</th>
                        <th className="border border-gray-300 p-2">Call Type</th>
                        <th className="border border-gray-300 p-2">Duration</th>
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Time</th>
                        <th className="border border-gray-300 p-2">First BTS Location</th>
                        <th className="border border-gray-300 p-2">IMEI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedRecords.slice(0, 10).map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2 font-mono">{record.targetParty}</td>
                          <td className="border border-gray-300 p-2 font-mono">{record.bPartyNumber}</td>
                          <td className="border border-gray-300 p-2">{record.callType}</td>
                          <td className="border border-gray-300 p-2">{record.callDuration}s</td>
                          <td className="border border-gray-300 p-2">{record.callDate}</td>
                          <td className="border border-gray-300 p-2">{record.callInitiationTime}</td>
                          <td className="border border-gray-300 p-2 text-xs">{record.firstBTSLocation || 'N/A'}</td>
                          <td className="border border-gray-300 p-2 text-xs">{record.imei || 'N/A'}</td>
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
