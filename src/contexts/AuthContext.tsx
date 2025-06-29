
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  userType: 'headquarters' | 'police_station';
  stationCode?: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        const { data, error } = await supabase
          .from('user_sessions')
          .select(`
            user_id,
            expires_at,
            credentials (
              id,
              username,
              user_type,
              station_code,
              full_name
            )
          `)
          .eq('session_token', sessionToken)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (data && !error) {
          const credential = data.credentials as any;
          setUser({
            id: credential.id,
            username: credential.username,
            userType: credential.user_type,
            stationCode: credential.station_code,
            fullName: credential.full_name
          });
        } else {
          localStorage.removeItem('sessionToken');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('sessionToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { data: credential, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !credential) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Create session
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: credential.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        return { success: false, error: 'Session creation failed' };
      }

      localStorage.setItem('sessionToken', sessionToken);
      const newUser = {
        id: credential.id,
        username: credential.username,
        userType: credential.user_type,
        stationCode: credential.station_code,
        fullName: credential.full_name
      };
      
      setUser(newUser);

      // Redirect based on user type
      setTimeout(() => {
        if (credential.user_type === 'headquarters') {
          window.location.href = '/hq-dashboard';
        } else {
          window.location.href = '/police-dashboard';
        }
      }, 100);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionToken');
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
