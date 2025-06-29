
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  BarChart3, 
  Users, 
  Search, 
  FileText, 
  Network, 
  RefreshCw, 
  User,
  UserPlus,
  AlertTriangle,
  PieChart,
  Settings,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const hqNavItems = [
    { path: '/hq-dashboard', label: 'Home', icon: Home },
    { path: '/crime-stats', label: 'Crime Stats', icon: BarChart3 },
    { path: '/criminal-profile', label: 'Criminal Profile', icon: Users },
    { path: '/search-tool', label: 'Search Tool', icon: Search },
    { path: '/case-status', label: 'Case Status', icon: FileText },
    { path: '/criminal-networks', label: 'Criminal Networks', icon: Network },
    { path: '/update-case', label: 'Update Case', icon: RefreshCw },
    { path: '/eagle-ai', label: 'Eagle AI', icon: Brain },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const policeNavItems = [
    { path: '/police-dashboard', label: 'Home', icon: Home },
    { path: '/register-case', label: 'Register Case', icon: UserPlus },
    { path: '/update-case', label: 'Update Case', icon: RefreshCw },
    { path: '/generate-fir', label: 'Generate FIR', icon: AlertTriangle },
    { path: '/station-stats', label: 'Station Stats', icon: PieChart },
    { path: '/eagle-ai', label: 'Eagle AI', icon: Brain },
    { path: '/profile', label: 'Profile', icon: Settings },
  ];

  const navItems = user?.userType === 'headquarters' ? hqNavItems : policeNavItems;

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-1 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
