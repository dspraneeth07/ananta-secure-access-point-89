
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Users, AlertTriangle, Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CriminalLocation {
  id: string;
  name: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  riskLevel: 'high' | 'medium' | 'low';
  caseCount: number;
}

const CriminalHeatmap = () => {
  const [criminals, setCriminals] = useState<CriminalLocation[]>([]);
  const [filteredCriminals, setFilteredCriminals] = useState<CriminalLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Mock criminal data with realistic Hyderabad locations
  const mockCriminals: CriminalLocation[] = [
    { id: '1', name: 'Rajesh Kumar', phone: '9876543210', address: 'Banjara Hills, Hyderabad', lat: 17.4126, lng: 78.4482, riskLevel: 'high', caseCount: 5 },
    { id: '2', name: 'Suresh Reddy', phone: '9876543211', address: 'Jubilee Hills, Hyderabad', lat: 17.4435, lng: 78.4009, riskLevel: 'medium', caseCount: 3 },
    { id: '3', name: 'Mohammed Ali', phone: '9876543212', address: 'Old City, Hyderabad', lat: 17.3616, lng: 78.4747, riskLevel: 'high', caseCount: 7 },
    { id: '4', name: 'Ravi Varma', phone: '9876543213', address: 'Kondapur, Hyderabad', lat: 17.4647, lng: 78.3481, riskLevel: 'low', caseCount: 2 },
    { id: '5', name: 'Prasad Rao', phone: '9876543214', address: 'Gachibowli, Hyderabad', lat: 17.4399, lng: 78.3489, riskLevel: 'medium', caseCount: 4 },
    { id: '6', name: 'Kumar Singh', phone: '9876543215', address: 'Secunderabad, Hyderabad', lat: 17.4399, lng: 78.4983, riskLevel: 'high', caseCount: 6 },
    { id: '7', name: 'Venkat Reddy', phone: '9876543216', address: 'Kukatpally, Hyderabad', lat: 17.4847, lng: 78.4056, riskLevel: 'medium', caseCount: 3 },
    { id: '8', name: 'Ashok Kumar', phone: '9876543217', address: 'Madhapur, Hyderabad', lat: 17.4475, lng: 78.3915, riskLevel: 'low', caseCount: 1 },
    { id: '9', name: 'Srinivas Rao', phone: '9876543218', address: 'Ameerpet, Hyderabad', lat: 17.4374, lng: 78.4482, riskLevel: 'high', caseCount: 8 },
    { id: '10', name: 'Ramesh Babu', phone: '9876543219', address: 'Begumpet, Hyderabad', lat: 17.4435, lng: 78.4677, riskLevel: 'medium', caseCount: 2 }
  ];

  useEffect(() => {
    setCriminals(mockCriminals);
    setFilteredCriminals(mockCriminals);
  }, []);

  useEffect(() => {
    const filtered = criminals.filter(criminal =>
      criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      criminal.phone.includes(searchTerm) ||
      criminal.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCriminals(filtered);
  }, [searchTerm, criminals]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([17.4065, 78.4772], 11);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Add markers for filtered criminals
    filteredCriminals.forEach(criminal => {
      const color = criminal.riskLevel === 'high' ? '#ef4444' : 
                   criminal.riskLevel === 'medium' ? '#f59e0b' : '#eab308';

      const customIcon = L.divIcon({
        html: `<div style="
          background-color: ${color}; 
          width: ${criminal.riskLevel === 'high' ? '16px' : criminal.riskLevel === 'medium' ? '12px' : '10px'}; 
          height: ${criminal.riskLevel === 'high' ? '16px' : criminal.riskLevel === 'medium' ? '12px' : '10px'}; 
          border-radius: 50%; 
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        className: 'custom-div-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([criminal.lat, criminal.lng], { icon: customIcon })
        .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-weight: bold;">${criminal.name}</h3>
            <p style="margin: 4px 0; color: #666;"><strong>Phone:</strong> ${criminal.phone}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Location:</strong> ${criminal.address}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Cases:</strong> ${criminal.caseCount}</p>
            <p style="margin: 4px 0;">
              <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                ${criminal.riskLevel.toUpperCase()} RISK
              </span>
            </p>
          </div>
        `)
        .addTo(mapInstanceRef.current!);
    });

    // Create heat points for heatmap effect
    const heatPoints = filteredCriminals.map(criminal => {
      const weight = criminal.riskLevel === 'high' ? 0.8 : 
                    criminal.riskLevel === 'medium' ? 0.5 : 0.3;
      
      // Create circle markers for heatmap effect
      const circle = L.circle([criminal.lat, criminal.lng], {
        color: criminal.riskLevel === 'high' ? '#ef4444' : 
               criminal.riskLevel === 'medium' ? '#f59e0b' : '#eab308',
        fillColor: criminal.riskLevel === 'high' ? '#ef4444' : 
                   criminal.riskLevel === 'medium' ? '#f59e0b' : '#eab308',
        fillOpacity: 0.2,
        radius: criminal.caseCount * 100 + 200,
        weight: 1
      }).addTo(mapInstanceRef.current!);

      return circle;
    });

  }, [filteredCriminals]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Criminal Activity Heatmap - Telangana Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search criminals by name, phone, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {filteredCriminals.length} criminals found
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredCriminals.filter(c => c.riskLevel === 'high').length}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">High Risk</div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredCriminals.filter(c => c.riskLevel === 'medium').length}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Medium Risk</div>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredCriminals.filter(c => c.riskLevel === 'low').length}
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Low Risk</div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredCriminals.reduce((sum, c) => sum + c.caseCount, 0)}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Total Cases</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Criminal Heatmap - OpenStreetMap</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef}
            className="w-full h-[500px] rounded-lg"
          />
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>High Risk Criminals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>Medium Risk Criminals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Low Risk Criminals</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criminal Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCriminals.map((criminal) => (
              <div key={criminal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(criminal.riskLevel)}`}></div>
                    <div>
                      <h4 className="font-semibold">{criminal.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        📞 {criminal.phone} | 📍 {criminal.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{criminal.caseCount} Cases</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    criminal.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    criminal.riskLevel === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {criminal.riskLevel.toUpperCase()} RISK
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CriminalHeatmap;
