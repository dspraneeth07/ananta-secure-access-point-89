
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TGANBLogin from '@/components/TGANBLogin';

const Index = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to their dashboard
      if (user.userType === 'headquarters') {
        window.location.href = '/hq-dashboard';
      } else {
        window.location.href = '/police-dashboard';
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Only show login if user is not authenticated
  if (!user) {
    return <TGANBLogin />;
  }

  return null;
};

export default Index;
