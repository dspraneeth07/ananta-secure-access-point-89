
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Print } from 'lucide-react';

interface Criminal {
  id: string;
  name: string;
  fatherName: string;
  address: string;
  firNumber: string;
  policeStation: string;
  district: string;
  drugType: string;
}

interface FIRDocumentProps {
  criminal: Criminal;
  onBack: () => void;
}

const FIRDocument: React.FC<FIRDocumentProps> = ({ criminal, onBack }) => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">FIR Document - {criminal.firNumber}</h1>
              <p className="text-muted-foreground">First Information Report</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <Print className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto bg-white text-black p-8 border">
              {/* FIR Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">FIRST INFORMATION REPORT</h2>
                <h3 className="text-lg font-semibold">TELANGANA ANTI NARCOTICS BUREAU</h3>
                <p className="text-sm">Under Section 182(1) of Bharatiya Nagarik Suraksha Sanhita, 2023</p>
              </div>

              {/* FIR Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>FIR No:</strong> {criminal.firNumber}
                  </div>
                  <div>
                    <strong>Date:</strong> 15/01/2024
                  </div>
                  <div>
                    <strong>Police Station:</strong> {criminal.policeStation}
                  </div>
                  <div>
                    <strong>District:</strong> {criminal.district}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">ACCUSED DETAILS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Name:</strong> {criminal.name}
                    </div>
                    <div>
                      <strong>Father's Name:</strong> {criminal.fatherName}
                    </div>
                    <div className="col-span-2">
                      <strong>Address:</strong> {criminal.address}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">OFFENCE DETAILS</h4>
                  <div className="space-y-2">
                    <div>
                      <strong>Sections:</strong> 21(b) of NDPS Act, 1985
                    </div>
                    <div>
                      <strong>Drug Type:</strong> {criminal.drugType}
                    </div>
                    <div>
                      <strong>Quantity Seized:</strong> 2.5 kg
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">CASE SUMMARY</h4>
                  <p className="text-sm leading-relaxed">
                    Based on reliable information, the accused {criminal.name} was found in possession of 
                    {criminal.drugType.toLowerCase()} weighing approximately 2.5 kg. The accused was 
                    apprehended at the location mentioned above. The contraband substance was seized 
                    in the presence of witnesses and panchnama was prepared. The accused has been 
                    arrested under relevant sections of NDPS Act, 1985.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">INVESTIGATING OFFICER</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Name:</strong> SI Rajesh Kumar
                    </div>
                    <div>
                      <strong>Badge No:</strong> 12345
                    </div>
                    <div>
                      <strong>Date:</strong> 15/01/2024
                    </div>
                    <div>
                      <strong>Signature:</strong> _______________
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">STATION HOUSE OFFICER</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Name:</strong> Inspector Suresh Reddy
                    </div>
                    <div>
                      <strong>Date:</strong> 15/01/2024
                    </div>
                    <div>
                      <strong>Signature:</strong> _______________
                    </div>
                    <div>
                      <strong>Seal:</strong> [OFFICIAL SEAL]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FIRDocument;
