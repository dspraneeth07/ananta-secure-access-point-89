
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Network } from 'lucide-react';
import NetworkingMap from '@/components/NetworkingMap';
import CDRTable from '@/components/CDRTable';
import CaseStatusView from '@/components/CaseStatusView';

interface Criminal {
  id: string;
  name: string;
  fatherName: string;
  address: string;
  uniqueId: string;
  firNumber: string;
  personCategory: string;
  policeStation: string;
  district: string;
  country: string;
  state: string;
  drugType: string;
  noCrimes: number;
  photo: string;
  presentStatus: string;
  physicalVerificationDate: string;
  age: number;
  gender: string;
  occupation: string;
  aadharNo: string;
  voterId: string;
  drivingLicense: string;
  education: string;
  languagesKnown: string;
  passportNo: string;
  socialMedia: string;
  phoneNumber: string;
  imei: string;
  email: string;
  bankAccount: string;
  bankName: string;
  caseStatus: string;
}

interface CriminalProfileViewProps {
  criminal: Criminal;
  onBack: () => void;
}

const CriminalProfileView: React.FC<CriminalProfileViewProps> = ({ criminal, onBack }) => {
  const [showNetworkMap, setShowNetworkMap] = useState(false);
  const [showCDR, setShowCDR] = useState(false);
  const [showCaseStatus, setShowCaseStatus] = useState(false);

  const profileData = {
    fullName: criminal.name,
    fatherName: criminal.fatherName,
    address: criminal.address,
    age: criminal.age,
    gender: criminal.gender,
    occupation: criminal.occupation,
    aadharNo: criminal.aadharNo,
    voterId: criminal.voterId,
    drivingLicense: criminal.drivingLicense,
    education: criminal.education,
    languagesKnown: criminal.languagesKnown,
    passportNo: criminal.passportNo,
    socialMedia: criminal.socialMedia,
    statesVisited: 'Telangana, Andhra Pradesh, Karnataka',
    countriesVisited: criminal.country === 'India' ? 'India' : `${criminal.country}, India`,
    phoneNumber: criminal.phoneNumber,
    imei: criminal.imei,
    email: criminal.email,
    bankAccount: criminal.bankAccount,
    bankName: criminal.bankName
  };

  const addressHistory = [
    {
      type: 'Permanent',
      houseNo: criminal.address.split(',')[0] || '123',
      area: criminal.district,
      district: criminal.district,
      state: criminal.state,
      country: criminal.country,
      longitude: '78.4867',
      latitude: '17.3850',
      firNo: criminal.firNumber
    },
    {
      type: 'Temporary',
      houseNo: '456',
      area: 'Jubilee Hills',
      district: criminal.district,
      state: criminal.state,
      country: criminal.country,
      longitude: '78.4094',
      latitude: '17.4167',
      firNo: `FIR${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}/2024`
    }
  ];

  const caseHistory = [
    {
      sno: 1,
      firNo: criminal.firNumber,
      associates: 'Jane Smith, Bob Wilson',
      firDocument: 'View',
      caseStatus: criminal.caseStatus
    },
    {
      sno: 2,
      firNo: `FIR${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}/2024`,
      associates: 'Alice Johnson',
      firDocument: 'View',
      caseStatus: 'Disposed'
    }
  ];

  if (showNetworkMap) {
    return <NetworkingMap criminal={criminal} onBack={() => setShowNetworkMap(false)} />;
  }

  if (showCDR) {
    return <CDRTable criminal={criminal} onBack={() => setShowCDR(false)} />;
  }

  if (showCaseStatus) {
    return <CaseStatusView criminal={criminal} onBack={() => setShowCaseStatus(false)} />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Criminal Profile - {criminal.name}</h1>
            <p className="text-muted-foreground">Detailed criminal information and case history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profileData).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={criminal.photo} 
                  alt={criminal.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address Type</TableHead>
                  <TableHead>House No</TableHead>
                  <TableHead>Area/Locality</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>FIR No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addressHistory.map((address, index) => (
                  <TableRow key={index}>
                    <TableCell>{address.type}</TableCell>
                    <TableCell>{address.houseNo}</TableCell>
                    <TableCell>{address.area}</TableCell>
                    <TableCell>{address.district}</TableCell>
                    <TableCell>{address.state}</TableCell>
                    <TableCell>{address.country}</TableCell>
                    <TableCell>{address.longitude}</TableCell>
                    <TableCell>{address.latitude}</TableCell>
                    <TableCell>{address.firNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Case History */}
        <Card>
          <CardHeader>
            <CardTitle>List of Cases Filed</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>FIR No</TableHead>
                  <TableHead>Associates & Co-Criminals</TableHead>
                  <TableHead>Case Status</TableHead>
                  <TableHead>FIR Document</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseHistory.map((case_) => (
                  <TableRow key={case_.sno}>
                    <TableCell>{case_.sno}</TableCell>
                    <TableCell>{case_.firNo}</TableCell>
                    <TableCell>{case_.associates}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCaseStatus(true)}
                        className="text-xs"
                      >
                        {case_.caseStatus}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View FIR
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowNetworkMap(true)}
                      >
                        <Network className="w-4 h-4 mr-2" />
                        Network Map
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* CDR Data */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Call Data Records</CardTitle>
              <Button onClick={() => setShowCDR(true)}>
                View Full CDR
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Call data records and network analysis available. Click "View Full CDR" for detailed analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CriminalProfileView;
