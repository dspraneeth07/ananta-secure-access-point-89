
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockCriminals } from '@/data/mockCriminals';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  onSelect?: (criminal: any) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      const results = mockCriminals.filter(criminal => 
        criminal.name.toLowerCase().includes(query.toLowerCase()) ||
        criminal.fatherName.toLowerCase().includes(query.toLowerCase()) ||
        criminal.firNumber.toLowerCase().includes(query.toLowerCase()) ||
        criminal.uniqueId.toLowerCase().includes(query.toLowerCase()) ||
        criminal.phoneNumber.includes(query) ||
        criminal.drugType.toLowerCase().includes(query.toLowerCase()) ||
        criminal.district.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelect = (criminal: any) => {
    setShowResults(false);
    setSearchQuery('');
    
    if (onSelect) {
      onSelect(criminal);
    } else {
      // Navigate to search tool with pre-filled data
      navigate('/search-tool', { state: { selectedCriminal: criminal } });
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        placeholder="Search criminals, FIR, drug type..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />
      
      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-auto">
          <CardContent className="p-2">
            {searchResults.map((criminal) => (
              <div
                key={criminal.id}
                className="p-2 hover:bg-muted rounded cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelect(criminal)}
              >
                <div className="font-medium">{criminal.name}</div>
                <div className="text-sm text-muted-foreground">
                  FIR: {criminal.firNumber} | Crime No: {criminal.uniqueId} | {criminal.drugType}
                </div>
                <div className="text-xs text-muted-foreground">
                  {criminal.district}, {criminal.state}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {showResults && searchResults.length === 0 && searchQuery.length > 2 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-4 text-center text-muted-foreground">
            No results found for "{searchQuery}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
