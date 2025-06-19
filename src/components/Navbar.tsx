
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  UserSearch, 
  Search, 
  FileText, 
  Network, 
  Edit, 
  UserCircle,
  Plus,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getNavItems = () => {
    if (user?.userType === 'headquarters') {
      return [
        { path: '/hq-dashboard', label: 'Home', icon: Home },
        { path: '/crime-stats', label: 'Crime Stats', icon: BarChart3 },
        { path: '/criminal-profile', label: 'Criminal Profile', icon: UserSearch },
        { path: '/search-tool', label: 'Search Tool', icon: Search },
        { path: '/case-status', label: 'Case Status', icon: FileText },
        { path: '/criminal-networks', label: 'Criminal Networks', icon: Network },
        { path: '/update-case', label: 'Update Case', icon: Edit },
        { path: '/user-dashboard', label: 'User Dashboard', icon: UserCircle }
      ];
    } else {
      return [
        { path: '/police-dashboard', label: 'Home', icon: Home },
        { path: '/register-case', label: 'Register Case', icon: Plus },
        { path: '/update-case', label: 'Update Case', icon: Edit },
        { path: '/generate-fir', label: 'Generate FIR', icon: FileText },
        { path: '/station-stats', label: 'Station Stats', icon: Activity },
        { path: '/profile', label: 'Profile', icon: UserCircle }
      ];
    }
  };

  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-1 md:space-x-2 py-4 overflow-x-auto">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
