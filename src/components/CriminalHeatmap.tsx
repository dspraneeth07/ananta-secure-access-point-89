
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Users, AlertTriangle, Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CriminalLocation {
  id: string;
  name: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  riskLevel: 'high' | 'medium' | 'low';
  caseCount: number;
  caseId: string;
  firNumber?: string;
}

const CriminalHeatmap = () => {
  const [criminals, setCriminals] = useState<CriminalLocation[]>([]);
  const [filteredCriminals, setFilteredCriminals] = useState<CriminalLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Generate coordinates for Indian cities based on address
  const getCoordinatesFromAddress = (address: string): { lat: number; lng: number } => {
    const addressLower = address.toLowerCase();
    
    // Major Indian cities coordinates
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'delhi': { lat: 28.7041, lng: 77.1025 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'pune': { lat: 18.5204, lng: 73.8567 },
      'ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'jaipur': { lat: 26.9124, lng: 75.7873 },
      'lucknow': { lat: 26.8467, lng: 80.9462 },
      'kanpur': { lat: 26.4499, lng: 80.3319 },
      'nagpur': { lat: 21.1458, lng: 79.0882 },
      'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
      'bhopal': { lat: 23.2599, lng: 77.4126 },
      'patna': { lat: 25.5941, lng: 85.1376 },
      'vadodara': { lat: 22.3072, lng: 73.1812 },
      'ludhiana': { lat: 30.9010, lng: 75.8573 },
      'agra': { lat: 27.1767, lng: 78.0081 },
      'nashik': { lat: 19.9975, lng: 73.7898 },
      'faridabad': { lat: 28.4089, lng: 77.3178 },
      'meerut': { lat: 28.9845, lng: 77.7064 },
      'rajkot': { lat: 22.3039, lng: 70.8022 },
      'kalyan': { lat: 19.2437, lng: 73.1355 },
      'vasai': { lat: 19.4911, lng: 72.8054 },
      'varanasi': { lat: 25.3176, lng: 82.9739 },
      'srinagar': { lat: 34.0837, lng: 74.7973 },
      'dhanbad': { lat: 23.7957, lng: 86.4304 },
      'jodhpur': { lat: 26.2389, lng: 73.0243 },
      'amritsar': { lat: 31.6340, lng: 74.8723 },
      'raipur': { lat: 21.2514, lng: 81.6296 },
      'allahabad': { lat: 25.4358, lng: 81.8463 },
    };

    // Check for city matches
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (addressLower.includes(city)) {
        // Add small random offset to avoid exact overlaps
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.1,
          lng: coords.lng + (Math.random() - 0.5) * 0.1
        };
      }
    }

    // Default to Hyderabad area with random offset if no city found
    return {
      lat: 17.3850 + (Math.random() - 0.5) * 2,
      lng: 78.4867 + (Math.random() - 0.5) * 2
    };
  };

  // Determine risk level based on case data
  const getRiskLevel = (caseData: any): 'high' | 'medium' | 'low' => {
    const drugCategory = caseData.drug_category?.toLowerCase() || '';
    const drugType = caseData.drug_type?.toLowerCase() || '';
    
    // High risk drugs
    if (drugCategory.includes('hard') || drugType.includes('cocaine') || drugType.includes('heroin') || drugType.includes('opium')) {
      return 'high';
    }
    
    // Medium risk drugs
    if (drugCategory.includes('synthetic') || drugType.includes('mdma') || drugType.includes('lsd')) {
      return 'medium';
    }
    
    // Default to low risk
    return 'low';
  };

  // Fetch all criminal cases from database
  const fetchCriminalCases = async () => {
    try {
      setIsLoading(true);
      
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .not('name', 'is', null)
        .not('address', 'is', null);

      if (error) {
        console.error('Error fetching cases:', error);
        toast.error('Failed to load criminal cases');
        return;
      }

      if (!cases || cases.length === 0) {
        toast.info('No criminal cases found in database');
        return;
      }

      console.log(`Loaded ${cases.length} criminal cases from database`);

      const criminalData: CriminalLocation[] = cases.map((case_item) => {
        const coordinates = getCoordinatesFromAddress(case_item.address || '');
        
        return {
          id: case_item.id,
          name: case_item.name,
          phone: case_item.phone_number || 'Not available',
          address: case_item.address || 'Address not available',
          lat: coordinates.lat,
          lng: coordinates.lng,
          riskLevel: getRiskLevel(case_item),
          caseCount: 1, // Each case represents one criminal case
          caseId: case_item.case_id,
          firNumber: case_item.fir_number
        };
      });

      setCriminals(criminalData);
      setFilteredCriminals(criminalData);
      toast.success(`Successfully loaded ${criminalData.length} criminal cases on map`);

    } catch (error) {
      console.error('Error in fetchCriminalCases:', error);
      toast.error('Failed to load criminal data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCriminalCases();
  }, []);

  useEffect(() => {
    const filtered = criminals.filter(criminal =>
      criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      criminal.phone.includes(searchTerm) ||
      criminal.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      criminal.caseId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCriminals(filtered);
  }, [searchTerm, criminals]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on India
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
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
    if (!mapInstanceRef.current || isLoading) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    if (filteredCriminals.length === 0) return;

    // Add markers for filtered criminals
    filteredCriminals.forEach(criminal => {
      const color = criminal.riskLevel === 'high' ? '#ef4444' : 
                   criminal.riskLevel === 'medium' ? '#f59e0b' : '#22c55e';

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
          <div style="padding: 8px; min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-weight: bold;">${criminal.name}</h3>
            <p style="margin: 4px 0; color: #666;"><strong>Phone:</strong> ${criminal.phone}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Location:</strong> ${criminal.address}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Case ID:</strong> ${criminal.caseId}</p>
            ${criminal.firNumber ? `<p style="margin: 4px 0; color: #666;"><strong>FIR Number:</strong> ${criminal.firNumber}</p>` : ''}
            <p style="margin: 4px 0;">
              <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                ${criminal.riskLevel.toUpperCase()} RISK
              </span>
            </p>
          </div>
        `)
        .addTo(mapInstanceRef.current!);

      // Create circle markers for heatmap effect
      L.circle([criminal.lat, criminal.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: criminal.riskLevel === 'high' ? 5000 : criminal.riskLevel === 'medium' ? 3000 : 2000,
        weight: 1
      }).addTo(mapInstanceRef.current!);
    });

    // Fit map to show all markers if there are any
    if (filteredCriminals.length > 0) {
      const group = new L.FeatureGroup(
        filteredCriminals.map(criminal => 
          L.marker([criminal.lat, criminal.lng])
        )
      );
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [filteredCriminals, isLoading]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading criminal cases from database...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Criminal Activity Heatmap - All Cases from Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search criminals by name, phone, location, or case ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {filteredCriminals.length} of {criminals.length} cases shown
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredCriminals.filter(c => c.riskLevel === 'high').length}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">High Risk Cases</div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredCriminals.filter(c => c.riskLevel === 'medium').length}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Medium Risk Cases</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredCriminals.filter(c => c.riskLevel === 'low').length}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Low Risk Cases</div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredCriminals.length}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Total Cases</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Criminal Heatmap - Real Database Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef}
            className="w-full h-[500px] rounded-lg"
          />
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>High Risk Cases</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>Medium Risk Cases</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Low Risk Cases</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criminal Cases Database ({criminals.length} Total Cases)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCriminals.map((criminal) => (
              <div key={criminal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(criminal.riskLevel)}`}></div>
                    <div>
                      <h4 className="font-semibold">{criminal.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        📞 {criminal.phone} | 📍 {criminal.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Case ID: {criminal.caseId} {criminal.firNumber && `| FIR: ${criminal.firNumber}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    criminal.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    criminal.riskLevel === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
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
